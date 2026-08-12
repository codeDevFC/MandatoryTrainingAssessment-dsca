#!/bin/bash

echo "========================================="
echo "🔍 CHECKING DEPLOYMENT STATUS"
echo "========================================="

# Get latest deployment status
vercel list --limit 3

echo ""
echo "🌐 Your site: https://dsca-mta-quiz.vercel.app"
echo ""
echo "📊 Check Vercel dashboard:"
echo "https://vercel.com/felix-cobbinahs-projects/dsca-mta-quiz/deployments"
