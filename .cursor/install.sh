#!/usr/bin/env bash
# Idempotent Cloud Agent setup for the Chat SDK monorepo.
# Safe to run repeatedly and on top of a warm snapshot.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

export DEBIAN_FRONTEND=noninteractive
DB_URL="postgresql://chat:chat@localhost:5432/chat?schema=public"

# Pinned Bun version (installed from a verified release artifact, never piped
# from a remote installer script).
BUN_VERSION="1.3.14"

# Download $1 to $2 and fail unless its sha256 equals $3.
fetch_verify() {
  local url="$1" dest="$2" sha="$3"
  curl -fsSL --retry 3 --retry-delay 2 -o "$dest" "$url"
  printf '%s  %s\n' "$sha" "$dest" | sha256sum -c - >/dev/null
}

# Echo "VERSION CLUSTER" for the first configured PostgreSQL cluster so we never
# assume a hardcoded "16 main" (the unversioned postgresql metapackage installs
# whatever version the base image defaults to).
pg_cluster_spec() {
  pg_lsclusters -h 2>/dev/null | awk 'NR==1 {print $1, $2}'
}

echo "==> System packages (PostgreSQL, unzip)"
if ! command -v psql >/dev/null 2>&1; then
  sudo apt-get update -y
  sudo apt-get install -y --no-install-recommends postgresql postgresql-contrib unzip
fi

echo "==> Bun ${BUN_VERSION} (pinned, checksum-verified)"
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"
if [ ! -x "$BUN_INSTALL/bin/bun" ]; then
  if grep -qw avx2 /proc/cpuinfo; then
    bun_asset="bun-linux-x64.zip"
    bun_sha="951ee2aee855f08595aeec6225226a298d3fea83a3dcd6465c09cbccdf7e848f"
  else
    bun_asset="bun-linux-x64-baseline.zip"
    bun_sha="a063908ae08b7852ca10939bbdc6ceed3ddabce8fb9402dce83d65d73b36e6c7"
  fi
  bun_zip="$(mktemp --suffix=.zip)"
  bun_dir="$(mktemp -d)"
  fetch_verify "https://github.com/oven-sh/bun/releases/download/bun-v${BUN_VERSION}/${bun_asset}" "$bun_zip" "$bun_sha"
  unzip -q "$bun_zip" -d "$bun_dir"
  mkdir -p "$BUN_INSTALL/bin"
  install -m 0755 "$bun_dir"/*/bun "$BUN_INSTALL/bin/bun"
  ln -sf "$BUN_INSTALL/bin/bun" "$BUN_INSTALL/bin/bunx"
  rm -rf "$bun_zip" "$bun_dir"
fi

echo "==> Node dependencies (frozen lockfile)"
bun install --frozen-lockfile

echo "==> Build workspace packages (produces dist/ consumed by the Next app)"
npm run build:chat
npm run build:ai-sdk

echo "==> App environment file"
if [ ! -f examples/next/.env.local ]; then
  cp examples/next/env.example examples/next/.env.local
fi

echo "==> Start PostgreSQL cluster"
read -r PG_VER PG_CLUSTER <<<"$(pg_cluster_spec)"
if [ -z "${PG_VER:-}" ]; then
  echo "No PostgreSQL cluster found" >&2
  exit 1
fi
sudo pg_ctlcluster "$PG_VER" "$PG_CLUSTER" start 2>/dev/null || true
for _ in $(seq 1 30); do pg_isready -h localhost -p 5432 >/dev/null 2>&1 && break; sleep 1; done

echo "==> Ensure database role and database"
sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='chat'" | grep -q 1 \
  || sudo -u postgres psql -c "CREATE ROLE chat LOGIN PASSWORD 'chat';"
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='chat'" | grep -q 1 \
  || sudo -u postgres createdb -O chat chat

echo "==> Prisma client + schema"
export DATABASE_URL="$DB_URL"
npm run prisma:generate
npm run prisma:push

echo "==> Install complete"
