#!/bin/bash

echo "========================================="
echo "🔧 FINAL VERCEL CONFIGURATION FIX"
echo "========================================="

# Remove any existing Vercel configuration that might be cached
rm -rf .vercel/cache 2>/dev/null || true
rm -rf .vercel/project.json 2>/dev/null || true
rm -rf .vercel/config.json 2>/dev/null || true

# Create a clean vercel.json WITHOUT any root directory
cat > vercel.json << 'VERCEL_EOF'
{
  "version": 2,
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "installCommand": "npm install",
  "framework": "vite"
}
VERCEL_EOF

echo "✅ vercel.json created (no root directory)"

# Create a clean package.json
cat > package.json << 'PKG_EOF'
{
  "name": "dsca-mta-quiz",
  "version": "1.0.0",
  "scripts": {
    "vercel-build": "cd frontend && npm install && npm run build"
  }
}
PKG_EOF

echo "✅ package.json created"

# Make sure frontend/package.json has the build script
cd frontend || exit
if ! grep -q '"build"' package.json; then
    echo "Adding build script to frontend/package.json..."
    npm pkg set scripts.build="vite build"
fi
cd ..

# Commit changes
git add vercel.json package.json frontend/package.json
git commit -m "Fix: Clean Vercel config without root directory"
git push origin main

echo ""
echo "========================================="
echo "🚀 DEPLOYING WITH PROJECT ID"
echo "========================================="

# Deploy using the project ID directly
vercel --prod --force --scope felix-cobbinahs-projects

echo ""
echo "✅ Done!"
echo "🌐 Check: https://dsca-mta-quiz.vercel.app"
