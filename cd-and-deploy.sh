#!/bin/bash

echo "========================================="
echo "📂 NAVIGATING TO DSCA-MTA-QUIZ"
echo "========================================="

# Navigate to the correct directory
cd ~/Downloads/dsca-MTA-Quiz || exit

echo "✅ Now in: $(pwd)"
echo ""

echo "========================================="
echo "🚀 DEPLOYING DSCA-MTA-QUIZ"
echo "========================================="

# Deploy with the simplest possible configuration
vercel --prod --force --yes

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo "🌐 Your app: https://dsca-mta-quiz.vercel.app"
else
    echo ""
    echo "⚠️ Deployment failed. Let's try with explicit project..."
    vercel --prod --force --yes --project dsca-mta-quiz
fi

echo ""
echo "📊 Check deployment status:"
vercel list --limit 3

