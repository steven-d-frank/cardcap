#!/bin/bash
# ==============================================================================
# Cardcap Backend - Development Entrypoint
# Runs inside the devcontainer when VS Code starts
# ==============================================================================

set -e

echo "🚀 Starting cardcap backend development environment..."

# Construct DATABASE_URL
export DATABASE_URL="postgresql://${DB_USER:-dev}:${DB_PASSWORD:-dev}@${DB_HOST:-db}:${DB_PORT:-5432}/${DB_NAME:-cardcap}?sslmode=disable"

# Wait for database to be ready
echo "⏳ Waiting for database..."
until pg_isready -h "${DB_HOST:-db}" -p "${DB_PORT:-5432}" -U "${DB_USER:-dev}" -q; do
  sleep 1
done
echo "✅ Database is ready"

# Run migrations
if [ -d "migrations" ]; then
  echo "🔄 Running database migrations..."
  # Intentionally lenient — migrations may already be applied, don't block dev startup
  migrate -path migrations -database "$DATABASE_URL" up || echo "⚠️  Migrations already applied or failed"
fi

# Seed development data (dev only — never runs in production)
if [ -f "seeds/dev_seed.sql" ] && [ "${ENVIRONMENT:-development}" = "development" ]; then
  echo "🌱 Seeding development data..."
  psql "$DATABASE_URL" -f seeds/dev_seed.sql -q 2>/dev/null || echo "⚠️  Seed already applied or failed"
fi

# Generate sqlc code if needed
if [ -f "sqlc.yaml" ]; then
  echo "📝 Generating sqlc code..."
  sqlc generate || echo "⚠️  sqlc generate failed"
fi

# Start Air for hot-reload
echo "🔥 Starting Air hot-reload server on port ${PORT:-8080}..."
exec air -c .air.toml
