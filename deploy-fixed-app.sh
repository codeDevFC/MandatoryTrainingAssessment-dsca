#!/bin/bash

echo "========================================="
echo "🚀 DEPLOYING FIXED APP.JSX"
echo "========================================="

# Add all changes including the fixed App.jsx
git add frontend/src/App.jsx
git add fix-*.sh vercel-*.sh monitor-deploy.sh 2>/dev/null || true

# Commit with message
git commit -m "Fix: JSX syntax errors resolved in App.jsx"

# Push to GitHub
git push origin main

echo ""
echo "========================================="
echo "🚀 REDEPLOYING TO VERCEL"
echo "========================================="

# Deploy non-interactively
echo "dsca-mta-quiz" | vercel --prod --force

echo ""
echo "✅ Deployment triggered!"
echo "🌐 Check: https://dsca-mta-quiz.vercel.app"
echo ""
echo "To monitor the build:"
echo "  vercel logs dsca-mta-quiz --follow"
