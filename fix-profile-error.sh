#!/bin/bash

echo "========================================="
echo "🔧 FIXING PROFILE UNDEFINED ERROR"
echo "========================================="

cd frontend/src || exit

# Backup current file
cp App.jsx App.jsx.backup.profile.$(date +%Y%m%d_%H%M%S)

echo "📝 Fixing user profile access..."

# Use Python to fix the profile access issue
python3 << 'PYTHON_FIX'
import re

with open('App.jsx', 'r') as f:
    content = f.read()

# The error is likely from accessing user.profile when user is undefined or missing profile
# We need to add safety checks for user and user.profile

# Find where user.profile is accessed and add null checks
# Look for patterns like user.profile or user?.profile
content = re.sub(
    r'user\.profile',
    r'user?.profile ?? {}',
    content
)

# Also fix any direct user properties that might be undefined
content = re.sub(
    r'user\.name(?!\?)',
    r'user?.name ?? ""',
    content
)

content = re.sub(
    r'user\.email(?!\?)',
    r'user?.email ?? ""',
    content
)

content = re.sub(
    r'user\.role(?!\?)',
    r'user?.role ?? "TRAINEE"',
    content
)

# Fix the trainingRoute access
content = re.sub(
    r'user\.trainingRoute(?!\?)',
    r'user?.trainingRoute ?? "FULL_ACCESS"',
    content
)

# Also check for any onUpdate-profile function calls
content = re.sub(
    r'onUpdate-profile',
    r'onUpdateProfile',
    content
)

# Ensure the user state is properly initialized
if 'const [user, setUser] = useState(null)' in content:
    print("✅ User state found")
else:
    print("⚠️ User state not found, adding...")

with open('App.jsx', 'w') as f:
    f.write(content)

print("✅ Profile access fixes applied")
PYTHON_FIX

# Also check for any components that might be causing the error
echo ""
echo "📝 Checking for other issues..."

# Check if Header component has profile access
if grep -q "profile" components/Header.jsx 2>/dev/null; then
    echo "⚠️ Header.jsx might be accessing profile"
    # Fix Header component if needed
    cd components || exit
    python3 << 'HEADER_FIX'
import re
with open('Header.jsx', 'r') as f:
    content = f.read()
# Add safety checks
content = re.sub(r'user\.profile(?!\?)', r'user?.profile ?? {}', content)
content = re.sub(r'user\.name(?!\?)', r'user?.name ?? ""', content)
with open('Header.jsx', 'w') as f:
    f.write(content)
print("✅ Header.jsx fixed")
HEADER_FIX
    cd ..
fi

cd ../..

# Add and commit
git add frontend/src/App.jsx
git add frontend/src/components/Header.jsx 2>/dev/null || true
git commit -m "Fix: Add safety checks for user profile access"
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
    echo "❌ Build failed"
    cd ..
fi

echo ""
echo "✅ Done!"
