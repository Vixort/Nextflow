#!/usr/bin/env bash
# ============================================================
# Nextflow MariaDB bootstrap — creates the database and applies
# supabase/mariadb_schema.sql (idempotent).
#
# Usage:  bash scripts/init-mariadb.sh
# Env:    DB_HOST (default 127.0.0.1), DB_USER (default root),
#         DB_PASSWORD (default empty), DB_NAME (default nextflow)
# ============================================================
set -euo pipefail

DB_HOST="${DB_HOST:-127.0.0.1}"
DB_USER="${DB_USER:-root}"
DB_PASSWORD="${DB_PASSWORD:-}"
DB_NAME="${DB_NAME:-nextflow}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

MYSQL_ARGS=(--host="$DB_HOST" --user="$DB_USER")
if [ -n "$DB_PASSWORD" ]; then
  MYSQL_ARGS+=(--password="$DB_PASSWORD")
fi

echo "==> Creating database '${DB_NAME}' (if missing)..."
mysql "${MYSQL_ARGS[@]}" -e "CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

echo "==> Enabling event scheduler (needed for cleanup events)..."
mysql "${MYSQL_ARGS[@]}" -e "SET GLOBAL event_scheduler = ON;"

echo "==> Applying supabase/mariadb_schema.sql..."
mysql "${MYSQL_ARGS[@]}" "${DB_NAME}" < "${SCRIPT_DIR}/../supabase/mariadb_schema.sql"

echo "==> Applying seed-admin (sets the real admin password)..."
node "${SCRIPT_DIR}/seed-admin.mjs"

echo "==> Done. Verifying:"
mysql "${MYSQL_ARGS[@]}" "${DB_NAME}" -e "SHOW TABLES; SELECT COUNT(*) AS services_count FROM services; SELECT COUNT(*) AS settings_count FROM system_settings; SHOW EVENTS;"
