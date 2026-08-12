#!/bin/bash

echo "========================================="
echo "🚀 AUTO-DEPLOYING TO VERCEL"
echo "========================================="

# Deploy with project name to skip interactive prompt
vercel --prod --force --yes --project dsca-mta-quiz

echo ""
echo "✅ Deployment complete!"
echo "🌐 Your app: https://dsca-mta-quiz.vercel.app"
