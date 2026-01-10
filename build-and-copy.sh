#!/bin/bash
# Build frontend and copy to server directory

echo "🔨 Building frontend..."
cd .. || exit 1
npm install
npm run build

if [ -d "dist" ]; then
  echo "📦 Copying dist to server directory..."
  cp -r dist server/ || {
    echo "❌ Failed to copy dist folder"
    exit 1
  }
  echo "✅ Frontend built and copied successfully"
else
  echo "⚠️  dist folder not found after build"
  exit 1
fi

