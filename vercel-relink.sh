#!/bin/bash

echo "========================================="
echo "🔄 UNLINKING AND RELINKING VERCEL PROJECT"
echo "========================================="

# Unlink current project
vercel unlink

echo "✅ Unlinked from current project"

# Remove any local Vercel config
rm -rf .vercel 2>/dev/null || true
rm -f .env.local 2>/dev/null || true

echo "✅ Cleaned local Vercel files"

# Create fresh config
mkdir -p .vercel
cat > .vercel/project.json << 'PROJECT_EOF'
{
  "orgId": "team_Ic0v9BtSIb6lXWVd3dJDGxQF",
  "projectId": "prj_Ai9Lj1vn4poJYNXcBAndQ3S9b4SN"
}
PROJECT_EOF

# Simple vercel.json
cat > vercel.json << 'VERCEL_EOF'
{
  "version": 2,
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "installCommand": "npm install",
  "framework": "vite"
}
VERCEL_EOF

echo "✅ Fresh configuration created"

# Add and commit
git add .
git commit -m "Fix: Relink Vercel project with clean config"
git push origin main

echo ""
echo "========================================="
echo "🔗 LINKING TO VERCEL"
echo "========================================="

# Link the project (will prompt for project selection)
vercel link

echo ""
echo "========================================="
echo "🚀 DEPLOYING TO VERCEL"
echo "========================================="

vercel --prod --force

echo ""
echo "✅ Done!"
