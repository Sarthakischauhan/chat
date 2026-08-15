#!/usr/bin/env bash
# Per-boot service reconciliation. Must be idempotent and return.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
# shellcheck source=/dev/null
source "$ROOT/.cursor/postgres.sh"

echo "==> App environment file"
ensure_app_env "$ROOT"

echo "==> Start PostgreSQL cluster"
ensure_postgres

echo "==> PostgreSQL ready"
