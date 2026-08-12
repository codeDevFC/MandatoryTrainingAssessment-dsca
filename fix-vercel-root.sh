#!/bin/bash

echo "========================================="
echo "🔧 FIXING VERCEL ROOT DIRECTORY"
echo "========================================="

# Remove the root directory setting from Vercel's internal config
rm -rf .vercel/project.json 2>/dev/null || true
rm -rf .vercel/config.json 2>/dev/null || true

# Create fresh vercel.json without any root directory
cat > vercel.json << 'VERCEL_EOF'
{
  "version": 2,
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "installCommand": "npm install",
  "framework": "vite"
}
VERCEL_EOF

echo "✅ vercel.json created without root directory"

# Update package.json with the correct build script
cat > package.json << 'PKG_EOF'
{
  "name": "dsca-mta-quiz",
  "version": "1.0.0",
  "scripts": {
    "build": "cd frontend && npm install && npm run build"
  }
}
PKG_EOF

echo "✅ package.json updated"

# Create a .vercel/project.json with empty root directory
mkdir -p .vercel
cat > .vercel/project.json << 'PROJECT_EOF'
{
  "orgId": "team_Ic0v9BtSIb6lXWVd3dJDGxQF",
  "projectId": "prj_Ai9Lj1vn4poJYNXcBAndQ3S9b4SN"
}
PROJECT_EOF

echo "✅ .vercel/project.json created"

# Add and commit
git add vercel.json package.json .vercel/project.json
git commit -m "Fix: Remove root directory from Vercel config"
git push origin main

echo ""
echo "========================================="
echo "🚀 DEPLOYING TO VERCEL WITH --force"
echo "========================================="

# Deploy with --force to override any cached settings
vercel --prod --force

echo ""
echo "✅ Done!"
