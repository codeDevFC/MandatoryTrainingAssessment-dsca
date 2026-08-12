#!/bin/bash

echo "========================================="
echo "🧹 CLEAN VERCEL DEPLOYMENT"
echo "========================================="

# Clean up
rm -rf .vercel 2>/dev/null || true

# Simple vercel.json
cat > vercel.json << 'VERCEL_EOF'
{
  "version": 2,
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "installCommand": "cd frontend && npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "index.html"
    }
  ]
}
VERCEL_EOF

echo "✅ vercel.json created with simple config"

# Root package.json
cat > package.json << 'PKG_EOF'
{
  "name": "dsca-mta-quiz",
  "version": "1.0.0",
  "scripts": {
    "build": "cd frontend && npm install && npm run build"
  }
}
PKG_EOF

echo "✅ package.json created"

# Add and commit
git add vercel.json package.json
git commit -m "Fix: Clean Vercel configuration"
git push origin main

echo ""
echo "========================================="
echo "🚀 DEPLOYING TO VERCEL"
echo "========================================="

vercel --prod --force

echo ""
echo "✅ Done!"
