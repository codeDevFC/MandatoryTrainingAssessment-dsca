#!/bin/bash

echo "========================================="
echo "🔧 FIXING NULLISH COALESCING SYNTAX"
echo "========================================="

cd frontend/src || exit

# Backup current file
cp App.jsx App.jsx.backup.nullish.$(date +%Y%m%d_%H%M%S)

echo "📝 Fixing nullish coalescing syntax..."

# Use Python to fix the syntax errors
python3 << 'PYTHON_FIX'
import re

with open('App.jsx', 'r') as f:
    content = f.read()

# Fix the pattern: user?.name ?? "" || user?.email ?? ""
# Should be: user?.name ?? "" || user?.email ?? "" 
# But we need parentheses: (user?.name ?? "") || (user?.email ?? "")

# Fix line 775 pattern
content = re.sub(
    r'\{\s*user\?\.name\s*\?\?\s*""\s*\|\|\s*user\?\.email\s*\?\?\s*""\s*\}',
    '{(user?.name ?? "") || (user?.email ?? "")}',
    content
)

# Fix line 1153 pattern
content = re.sub(
    r'\{\s*user\?\.name\s*\?\?\s*""\s*\|\|\s*user\?\.email\s*\?\?\s*""\s*\}',
    '{(user?.name ?? "") || (user?.email ?? "")}',
    content
)

# Fix line 1162 pattern - "Welcome back, {user?.name ?? "" || 'Trainee'}"
content = re.sub(
    r'Welcome back,\s*\{\s*user\?\.name\s*\?\?\s*""\s*\|\|\s*[\'"]Trainee[\'"]\s*\}',
    'Welcome back, {(user?.name ?? "") || "Trainee"}',
    content
)

# Also fix any other similar patterns
content = re.sub(
    r'\{\s*user\?\.name\s*\?\?\s*[\'"]Unknown[\'"]\s*\}',
    '{(user?.name ?? "Unknown")}',
    content
)

with open('App.jsx', 'w') as f:
    f.write(content)

print("✅ Nullish coalescing syntax fixed")
PYTHON_FIX

cd ../..

# Add and commit
git add frontend/src/App.jsx
git commit -m "Fix: Correct nullish coalescing syntax with parentheses"
git push origin main

echo ""
echo "========================================="
echo "🏗️  BUILDING AND DEPLOYING"
echo "========================================="

cd frontend || exit
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    cd ..
    vercel --prod --force
else
    echo ""
    echo "❌ Build failed. Showing errors:"
    npm run build 2>&1 | tail -30
    cd ..
fi

echo ""
echo "✅ Done!"
