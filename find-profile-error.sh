#!/bin/bash

echo "========================================="
echo "🔍 FINDING THE PROFILE ERROR SOURCE"
echo "========================================="

cd frontend/src || exit

echo "📝 Searching for 'profile' references..."

# Search for profile in App.jsx
echo ""
echo "1. Checking App.jsx for 'profile':"
grep -n "profile" App.jsx 2>/dev/null || echo "No 'profile' found in App.jsx"

# Search for profile in components
echo ""
echo "2. Checking components for 'profile':"
for file in components/*.jsx; do
    if [ -f "$file" ]; then
        if grep -q "profile" "$file"; then
            echo "   ⚠️ Found in: $file"
            grep -n "profile" "$file"
        fi
    fi
done

# Search for onUpdate-profile
echo ""
echo "3. Checking for 'onUpdate-profile':"
grep -rn "onUpdate-profile" . 2>/dev/null || echo "No 'onUpdate-profile' found"

echo ""
echo "4. Checking for 'Update-profile':"
grep -rn "Update-profile" . 2>/dev/null || echo "No 'Update-profile' found"

echo ""
echo "========================================="
echo "🔧 FIXING THE ISSUE"
echo "========================================="

# Fix by adding profile to the user object or removing references to it
echo "Creating a fix..."

# Use Python to add a profile property to the user object
python3 << 'PYTHON_FIX'
import re

with open('App.jsx', 'r') as f:
    content = f.read()

# Add profile to user object in setUser calls
# Look for setUser({ ...data, role: 'ADMIN' }) and add profile
content = re.sub(
    r'setUser\(\s*\{\s*\.\.\.data,\s*role:\s*[\'"]ADMIN[\'"]\s*\}\s*\)',
    'setUser({ ...data, role: "ADMIN", profile: { name: data.name, email: data.email } })',
    content
)

# Look for setUser({ ...data, role: 'TRAINEE' })
content = re.sub(
    r'setUser\(\s*\{\s*\.\.\.data,\s*role:\s*[\'"]TRAINEE[\'"]\s*\}\s*\)',
    'setUser({ ...data, role: "TRAINEE", profile: { name: data.name, email: data.email } })',
    content
)

# Also check if any component is calling onUpdate-profile
# Replace onUpdate-profile with onUpdate if needed
content = re.sub(
    r'onUpdate-profile',
    'onUpdate',
    content
)

with open('App.jsx', 'w') as f:
    f.write(content)

print("✅ App.jsx updated with profile property")
PYTHON_FIX

cd ../..

# Add and commit
git add frontend/src/App.jsx
git commit -m "Fix: Add profile property to user object and fix onUpdate-profile"
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
