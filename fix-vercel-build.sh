#!/bin/bash

echo "========================================="
echo "🔧 FIXING VERCEL BUILD CONFIGURATION"
echo "========================================="

# Create proper vercel.json with correct paths
cat > vercel.json << 'VERCEL_EOF'
{
  "version": 2,
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "installCommand": "npm install --prefix frontend",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/"
    }
  ]
}
VERCEL_EOF

echo "✅ vercel.json updated"

# Update root package.json
cat > package.json << 'PKG_EOF'
{
  "name": "dsca-mta-quiz",
  "version": "1.0.0",
  "scripts": {
    "vercel-build": "cd frontend && npm install && npm run build"
  }
}
PKG_EOF

echo "✅ package.json updated"

# Check if frontend/package.json has build script
if [ -f "frontend/package.json" ]; then
  echo "✅ frontend/package.json found"
  
  # Ensure build script exists in frontend
  if ! grep -q '"build"' frontend/package.json; then
    echo "⚠️ Build script missing in frontend, adding..."
    cd frontend
    npm pkg set scripts.build="vite build"
    cd ..
  fi
fi

# Add and commit
git add vercel.json package.json
git commit -m "Fix: Vercel build configuration with correct paths"
git push origin main

echo ""
echo "========================================="
echo "🚀 DEPLOYING TO VERCEL"
echo "========================================="

# Try deploying with the fix
vercel --prod --force

echo ""
echo "✅ Done!"
