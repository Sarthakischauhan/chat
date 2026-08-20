#!/usr/bin/env bash
# Shared PostgreSQL helpers for Cloud Agent install/start.
# Intended to be sourced. Safe to call repeatedly.

DB_URL="${DB_URL:-postgresql://chat:chat@localhost:5432/chat?schema=public}"

pg_cluster_spec() {
  pg_lsclusters -h 2>/dev/null | awk 'NR==1 {print $1, $2, $6}'
}

# Start the first configured cluster, clearing leftover pid/socket files from a
# previous VM snapshot, then wait until TCP 5432 accepts connections.
ensure_postgres() {
  local ver cluster data_dir pid_file old_pid i
  read -r ver cluster data_dir <<<"$(pg_cluster_spec)"
  if [ -z "${ver:-}" ] || [ -z "${cluster:-}" ]; then
    echo "No PostgreSQL cluster found" >&2
    return 1
  fi

  pid_file="${data_dir}/postmaster.pid"
  if [ -f "$pid_file" ]; then
    old_pid="$(sudo awk 'NR==1 {print $1}' "$pid_file" 2>/dev/null || true)"
    if [ -n "$old_pid" ] && ! sudo kill -0 "$old_pid" 2>/dev/null; then
      echo "Removing stale PostgreSQL pid $old_pid"
      sudo rm -f "$pid_file"
      sudo rm -f "/var/run/postgresql/${ver}-${cluster}.pid" \
        "/tmp/.s.PGSQL.5432" "/tmp/.s.PGSQL.5432.lock" \
        "/var/run/postgresql/.s.PGSQL.5432" "/var/run/postgresql/.s.PGSQL.5432.lock" \
        2>/dev/null || true
    fi
  fi

  if ! pg_isready -h 127.0.0.1 -p 5432 >/dev/null 2>&1; then
    if ! sudo pg_ctlcluster "$ver" "$cluster" start; then
      echo "pg_ctlcluster start failed; force-stop and retry"
      sudo pg_ctlcluster "$ver" "$cluster" stop --force 2>/dev/null || true
      sudo rm -f "$pid_file"
      sudo pg_ctlcluster "$ver" "$cluster" start
    fi
  fi

  for i in $(seq 1 60); do
    pg_isready -h 127.0.0.1 -p 5432 >/dev/null 2>&1 && break
    sleep 1
  done
  pg_isready -h 127.0.0.1 -p 5432 || {
    echo "PostgreSQL did not become ready on 127.0.0.1:5432" >&2
    return 1
  }

  sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='chat'" | grep -q 1 \
    || sudo -u postgres psql -c "CREATE ROLE chat LOGIN PASSWORD 'chat';"
  sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='chat'" | grep -q 1 \
    || sudo -u postgres createdb -O chat chat
}

ensure_app_env() {
  local root="${1:-.}"
  local env_file="$root/examples/next/.env.local"
  local example="$root/examples/next/env.example"
  if [ ! -f "$env_file" ] && [ -f "$example" ]; then
    cp "$example" "$env_file"
  fi
  if [ -f "$env_file" ] && ! grep -q '^DATABASE_URL=' "$env_file"; then
    printf 'DATABASE_URL="%s"\n' "$DB_URL" >>"$env_file"
  fi
}
