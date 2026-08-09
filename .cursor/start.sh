#!/usr/bin/env bash
# Per-boot service reconciliation. Must be idempotent and return.
set -euo pipefail

echo "==> Start PostgreSQL cluster"
sudo pg_ctlcluster 16 main start 2>/dev/null || true
for _ in $(seq 1 30); do pg_isready -h localhost -p 5432 >/dev/null 2>&1 && break; sleep 1; done
pg_isready -h localhost -p 5432 || { echo "PostgreSQL did not become ready"; exit 1; }

echo "==> PostgreSQL ready"
