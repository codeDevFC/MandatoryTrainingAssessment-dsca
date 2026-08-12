#!/bin/bash

echo "========================================="
echo "📊 MONITORING VERCEL DEPLOYMENT"
echo "========================================="

echo "Checking deployment status..."
echo ""

# List recent deployments
vercel list --limit 5

echo ""
echo "========================================="
echo "📝 To see detailed logs:"
echo "========================================="
echo "Run: vercel logs dsca-mta-quiz --follow"
echo ""
echo "🌐 Check your site:"
echo "https://dsca-mta-quiz.vercel.app"
echo ""
echo "⏳ Wait 1-2 minutes for the build to complete..."
