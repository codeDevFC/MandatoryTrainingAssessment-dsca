#!/bin/bash

echo "========================================="
echo "🧹 CLEAN VERCEL DEPLOYMENT"
echo "========================================="

# Clean up all Vercel cache and config
rm -rf .vercel 2>/dev/null || true
rm -f .env.local 2>/dev/null || true
rm -f vercel.json 2>/dev/null || true

echo "✅ Cleaned Vercel configuration"

# Create a minimal vercel.json
cat > vercel.json << 'VERCEL_EOF'
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist"
}
VERCEL_EOF

echo "✅ Created minimal vercel.json"

# Create a fresh .vercel directory
mkdir -p .vercel

# Add project config
cat > .vercel/project.json << 'PROJECT_EOF'
{
  "orgId": "team_Ic0v9BtSIb6lXWVd3dJDGxQF",
  "projectId": "prj_Ai9Lj1vn4poJYNXcBAndQ3S9b4SN"
}
PROJECT_EOF

echo "✅ Project config created"

# Add and commit
git add vercel.json .vercel/project.json
git commit -m "Fix: Clean Vercel config without root directory"
git push origin main

echo ""
echo "========================================="
echo "🚀 DEPLOYING WITH FRESH CONFIG"
echo "========================================="

# Deploy with explicit project
vercel --prod --force --yes --project dsca-mta-quiz

echo ""
echo "✅ Deployment complete!"
echo "🌐 Your app: https://dsca-mta-quiz01.vercel.app"
