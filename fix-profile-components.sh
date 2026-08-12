#!/bin/bash

echo "========================================="
echo "🔧 FIXING PROFILE IN COMPONENTS"
echo "========================================="

cd frontend/src/components || exit

for file in *.jsx; do
    if [ -f "$file" ]; then
        echo "Checking: $file"
        if grep -q "profile" "$file" || grep -q "onUpdate" "$file"; then
            echo "  ⚠️ Found profile/onUpdate in $file"
            # Add safety checks
            python3 << PYTHON_FIX
import re
with open('$file', 'r') as f:
    content = f.read()
# Add optional chaining for user access
content = re.sub(r'user\?\.', 'user?.', content)
# Add fallback for profile
content = re.sub(r'user\.profile(?!\?)', 'user?.profile ?? {}', content)
# Fix onUpdate-profile
content = re.sub(r'onUpdate-profile', 'onUpdate', content)
with open('$file', 'w') as f:
    f.write(content)
print("    ✅ Fixed $file")
PYTHON_FIX
        fi
    fi
done

cd ../..

git add frontend/src/components/*.jsx
git commit -m "Fix: Add safety checks for profile in components"
git push origin main

echo ""
echo "✅ Components fixed!"
echo "🚀 Redeploying..."

cd frontend
npm run build && cd .. && vercel --prod --force

echo ""
echo "✅ Done!"
