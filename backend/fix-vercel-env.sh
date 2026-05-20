#!/bin/bash

echo "🔧 Fixing Vercel Environment Variables"
echo "======================================"

cd ~/Downloads/dsca-MTA-Quiz

# Remove existing problematic env variables
echo "Removing existing environment variables..."
vercel env rm DATABASE_URL production --yes 2>/dev/null || true
vercel env rm JWT_SECRET production --yes 2>/dev/null || true

# Add DATABASE_URL
echo "Adding DATABASE_URL..."
echo "postgresql://neondb_owner:npg_KHqQgr8p2kOA@ep-lucky-butterfly-ann71upz-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require" | vercel env add DATABASE_URL production

# Add JWT_SECRET
echo "Adding JWT_SECRET..."
echo "careworks-super-secret-key-2025" | vercel env add JWT_SECRET production

# Redeploy
echo "Redeploying with new environment variables..."
vercel --prod

echo "✅ Done! Visit: https://mandatory-training-assessment-dsca.vercel.app"
