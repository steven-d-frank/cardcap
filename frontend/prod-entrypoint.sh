#!/bin/sh
set -e

echo "🚀 Starting cardcap frontend..."

# Log environment info
echo "📋 Environment:"
echo "   NODE_ENV: ${NODE_ENV:-not set}"
echo "   PORT: ${PORT:-8080}"

# Start the SolidStart server
echo "✅ Starting server on port ${PORT:-8080}..."
exec node .output/server/index.mjs
