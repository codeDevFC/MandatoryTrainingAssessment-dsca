#!/bin/bash

echo "========================================="
echo "🏗️  TESTING LOCAL BUILD"
echo "========================================="

cd frontend || exit

echo "📦 Installing dependencies..."
npm install

echo ""
echo "🏗️  Building frontend locally..."
npm run build

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Build successful locally!"
  echo "The issue is likely with Vercel configuration."
else
  echo ""
  echo "❌ Build failed locally!"
  echo "Here are the errors:"
  npm run build 2>&1 | tail -30
fi

cd ..

echo ""
echo "========================================="
echo "🔧 If build fails, try:"
echo "========================================="
echo "1. Check App.jsx for syntax errors"
echo "2. Check for missing imports"
echo "3. Verify all components exist"
