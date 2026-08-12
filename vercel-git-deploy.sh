#!/bin/bash

echo "========================================="
echo "🔄 TRIGGERING GIT DEPLOYMENT"
echo "========================================="

# Push any pending changes
git push origin main

echo ""
echo "Now Vercel will automatically deploy from GitHub."
echo ""
echo "Check the deployment:"
echo "https://vercel.com/felix-cobbinahs-projects/dsca-mta-quiz/deployments"
echo ""
echo "Opening deployment page..."

open "https://vercel.com/felix-cobbinahs-projects/dsca-mta-quiz/deployments" 2>/dev/null

