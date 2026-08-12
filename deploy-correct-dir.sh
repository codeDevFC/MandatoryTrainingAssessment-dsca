#!/bin/bash

echo "========================================="
echo "📂 DEPLOYING FROM CORRECT DIRECTORY"
echo "========================================="

cd ~/Downloads/dsca-MTA-Quiz || exit

echo "✅ Current directory: $(pwd)"
echo ""

# Check if this is the right project
if [ -f "frontend/package.json" ]; then
    echo "✅ frontend/package.json found"
else
    echo "❌ Not in the correct directory!"
    exit 1
fi

echo ""
echo "========================================="
echo "🚀 DEPLOYING TO VERCEL"
echo "========================================="

# Deploy with project name
vercel --prod --force --yes --project dsca-mta-quiz

echo ""
echo "✅ Deployment complete!"
echo "🌐 Your app: https://dsca-mta-quiz.vercel.app"

