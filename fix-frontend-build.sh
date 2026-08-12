#!/bin/bash

echo "========================================="
echo "🔧 PREPARING FRONTEND BUILD FIX"
echo "========================================="

# Check if frontend exists
if [ -d "frontend" ]; then
  echo "✅ frontend directory exists"
  
  # Check package.json in frontend
  if [ -f "frontend/package.json" ]; then
    echo "✅ frontend/package.json exists"
    
    # Verify build script
    if grep -q '"build"' frontend/package.json; then
      echo "✅ Build script found in frontend/package.json"
    else
      echo "⚠️ Build script missing, adding..."
      cd frontend
      npm pkg set scripts.build="vite build"
      cd ..
      git add frontend/package.json
      git commit -m "Fix: Add build script to frontend/package.json"
      git push origin main
    fi
  else
    echo "❌ frontend/package.json not found!"
  fi
else
  echo "❌ frontend directory not found!"
fi

echo ""
echo "✅ Fixes applied (if needed)"
echo "🚀 Redeploy with: vercel --prod --force"
