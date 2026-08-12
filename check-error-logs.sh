#!/bin/bash

echo "========================================="
echo "📋 CHECKING DEPLOYMENT ERRORS"
echo "========================================="

# Get the last deployment ID
DEPLOYMENT_ID=$(vercel list --limit 1 --json 2>/dev/null | grep -o '"uid":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -n "$DEPLOYMENT_ID" ]; then
  echo "Deployment ID: $DEPLOYMENT_ID"
  echo ""
  echo "📋 Fetching logs..."
  vercel logs $DEPLOYMENT_ID
else
  echo "❌ Could not get deployment ID"
  echo "Trying to get logs from recent deployment..."
  vercel logs dsca-mta-quiz --limit 50
fi

echo ""
echo "========================================="
echo "🔍 Common issues to check:"
echo "========================================="
echo "1. JSX syntax errors in App.jsx"
echo "2. Missing dependencies in package.json"
echo "3. Build script errors"
echo ""
echo "📊 Check dashboard for detailed logs:"
echo "https://vercel.com/felix-cobbinahs-projects/dsca-mta-quiz/deployments"
