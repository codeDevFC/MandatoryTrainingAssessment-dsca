#!/bin/bash

echo "========================================="
echo "🚀 DEPLOYING TO VERCEL"
echo "========================================="

# Add all changes
git add .

# Commit with message
git commit -m "Fix: Module unlocking after completion - refresh modules after submission"

# Push to GitHub
git push origin main

# Deploy to Vercel
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo "🌐 Your app: https://dsca-mta-quiz.vercel.app"
