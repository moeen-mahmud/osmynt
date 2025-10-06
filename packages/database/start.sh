#!/bin/sh

echo "🚀 Starting Talinq Engine..."

# Navigate to database package and run migrations
echo "📊 Running database migrations..."
cd /app/packages/database
bunx prisma migrate deploy

# Check if migrations were successful
if [ $? -eq 0 ]; then
    echo "✅ Migrations completed successfully"
else
    echo "❌ Migration failed"
    exit 1
fi

# Navigate to engine and start the application
echo "🔥 Starting application..."
cd /app/apps/engine
bun run src/app.ts 