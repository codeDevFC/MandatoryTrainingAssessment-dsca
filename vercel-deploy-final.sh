#!/bin/bash

echo "========================================="
echo "🚀 FINAL VERCEL DEPLOYMENT"
echo "========================================="

# Use the project ID directly to skip the prompt
vercel --prod --force --token $(vercel whoami --token 2>/dev/null) 2>/dev/null || \
vercel --prod --force --yes

echo ""
echo "========================================="
echo "✅ Done!"
echo "🌐 Check: https://dsca-mta-quiz.vercel.app"
echo "========================================="
