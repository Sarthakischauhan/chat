#!/usr/bin/env bash
# Per-boot service reconciliation. Must be idempotent and return.
set -euo pipefail

echo "==> Start PostgreSQL cluster"
# Detect the installed cluster rather than assuming a hardcoded "16 main": the
# unversioned postgresql metapackage installs whatever version the base image
# defaults to.
read -r PG_VER PG_CLUSTER <<<"$(pg_lsclusters -h 2>/dev/null | awk 'NR==1 {print $1, $2}')"
if [ -z "${PG_VER:-}" ]; then
  echo "No PostgreSQL cluster found" >&2
  exit 1
fi
sudo pg_ctlcluster "$PG_VER" "$PG_CLUSTER" start 2>/dev/null || true
for _ in $(seq 1 30); do pg_isready -h localhost -p 5432 >/dev/null 2>&1 && break; sleep 1; done
pg_isready -h localhost -p 5432 || { echo "PostgreSQL did not become ready"; exit 1; }

echo "==> PostgreSQL ready"
