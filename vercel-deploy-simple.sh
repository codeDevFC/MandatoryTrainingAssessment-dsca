#!/bin/bash

echo "========================================="
echo "🚀 SIMPLE VERCEL DEPLOYMENT"
echo "========================================="

# Build locally first (already built)
echo "✅ Local build is ready"

# Deploy with the simplest possible configuration
vercel --prod --force --yes

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo "🌐 Your app: https://dsca-mta-quiz.vercel.app"
else
    echo ""
    echo "⚠️ Deployment failed. Let's try with explicit settings..."
    
    # Try with explicit project
    vercel --prod --force --yes --project dsca-mta-quiz
fi

echo ""
echo "📊 Check deployment status:"
vercel list --limit 3

