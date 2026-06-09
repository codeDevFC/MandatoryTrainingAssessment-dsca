#!/bin/bash
Navigate to the root project directory
cd ~/Downloads/dsca-MTA-Quiz
echo "Starting Vercel configuration fix..."
First, let's check if there's a package.json at the root (informational)
echo "Checking for existing package.json:"
ls -la package.json || echo "No package.json found, creating one."
Create/overwrite a root package.json for Vercel
cat > package.json << 'EOF'
{
"name": "dsca-mta-quiz",
"version": "1.0.0",
"scripts": {
"vercel-build": "cd frontend && npm install && npm run build"
}
}
EOF
echo "✅ Root package.json created/updated."
Update vercel.json to use the correct build command
cat > vercel.json << 'EOF'
{
"version": 2,
"builds": [
{
"src": "frontend/**",
"use": "@vercel/static-build",
"config": {
"distDir": "frontend/dist",
"buildCommand": "npm run vercel-build"
}
}
],
"routes": [
{
"src": "/(.*)",
"dest": "frontend/dist/$1"
}
]
}
EOF
echo "✅ vercel.json updated to use 'vercel-build' script."
Commit these changes to GitHub
echo "Staging changes for commit..."
git add package.json vercel.json
echo "Committing changes..."
git commit -m "Fix Vercel build configuration and add root package.json"
echo "Pushing changes to GitHub..."
git push origin main
echo ""
echo "==================================================="
echo "✅ Vercel configuration files committed and pushed to GitHub!"
echo "==================================================="
echo ""
echo "Now, you can deploy your application to Vercel:"
echo "🚀 Run this command in your terminal (from ~/Downloads/dsca-MTA-Quiz):"
echo "   vercel --prod --force"
echo ""
echo "This will deploy your frontend application with the updated build configuration."
