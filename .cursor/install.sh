#!/usr/bin/env bash
# Idempotent Cloud Agent setup for the Chat SDK monorepo.
# Safe to run repeatedly and on top of a warm snapshot.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

export DEBIAN_FRONTEND=noninteractive
DB_URL="postgresql://chat:chat@localhost:5432/chat?schema=public"

echo "==> System packages (PostgreSQL, zstd)"
if ! command -v psql >/dev/null 2>&1; then
  sudo apt-get update -y
  sudo apt-get install -y --no-install-recommends postgresql postgresql-contrib zstd
fi

echo "==> Bun (package manager pinned by bun.lock)"
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"
if ! command -v bun >/dev/null 2>&1; then
  curl -fsSL https://bun.sh/install | bash
fi

echo "==> Ollama (local, keyless model provider)"
if ! command -v ollama >/dev/null 2>&1; then
  curl -fsSL https://ollama.com/install.sh | sh
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
sudo pg_ctlcluster 16 main start 2>/dev/null || true
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

echo "==> Ensure a tool-capable Ollama model for keyless demos"
if ! curl -sf http://localhost:11434/api/version >/dev/null 2>&1; then
  nohup ollama serve >/tmp/ollama-serve.log 2>&1 &
  for _ in $(seq 1 30); do curl -sf http://localhost:11434/api/version >/dev/null 2>&1 && break; sleep 1; done
fi
ollama list | grep -q 'gpt-oss:20b' || ollama pull gpt-oss:20b

echo "==> Install complete"
