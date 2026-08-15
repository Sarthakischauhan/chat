#!/usr/bin/env bash
# Long-running Next.js dev server for the Cloud Agent terminal.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
export PATH="${HOME}/.bun/bin:${PATH}"
export DATABASE_URL="${DATABASE_URL:-postgresql://chat:chat@localhost:5432/chat?schema=public}"

# Wait for Postgres from start.sh (or recover if this terminal is restarted first).
for _ in $(seq 1 60); do
  pg_isready -h 127.0.0.1 -p 5432 >/dev/null 2>&1 && break
  sleep 1
done
pg_isready -h 127.0.0.1 -p 5432 || {
  echo "PostgreSQL is not ready; cannot start Next.js" >&2
  exit 1
}

if curl -sf -o /dev/null http://127.0.0.1:3000/; then
  echo "Next.js already serving on :3000"
  exec tail -f /dev/null
fi

exec npm run dev -- --hostname 0.0.0.0 --port 3000
