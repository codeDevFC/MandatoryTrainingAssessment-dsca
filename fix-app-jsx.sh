#!/bin/bash

echo "========================================="
echo "🔧 FIXING APP.JSX - WRONG PLACEMENT"
echo "========================================="

cd frontend/src || exit

# Backup current file
cp App.jsx App.jsx.backup.wrong.$(date +%Y%m%d_%H%M%S)

# Fix the file using Python
python3 << 'PYTHON_FIX'
import re

with open('App.jsx', 'r') as f:
    content = f.read()

# The problem: "await fetchModules(user.id);" was placed in the wrong location
# It was inserted inside the button's onClick handler
# We need to remove it from there and add it to submitAssessment

# 1. Remove the misplaced line from the results screen
# Find the pattern where fetchModules is incorrectly placed inside the button
pattern = r'<button onClick=\{\(\) => \{ setSelectedModule\(null\); setShowResults\(false\); fetchUserProgress\(user\.id\); \}\} \s*await fetchModules\(user\.id\); // Refresh module statuses\s*className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">Return to Dashboard</button>'
replacement = r'<button onClick={() => { setSelectedModule(null); setShowResults(false); fetchUserProgress(user.id); }} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">Return to Dashboard</button>'
content = re.sub(pattern, replacement, content, flags=re.DOTALL)

# 2. Make sure submitAssessment has the fetchModules call in the right place
# Look for the submitAssessment function
submit_pattern = r'(if\s*\(\s*user\.role\s*===\s*[\'"]TRAINEE[\'"]\s*\)\s*\{[^}]*?fetchUserProgress\(user\.id\)\s*;)'
submit_replacement = r'\1\n            await fetchModules(user.id); // Refresh module statuses'
content = re.sub(submit_pattern, submit_replacement, content, flags=re.DOTALL | re.MULTILINE)

with open('App.jsx', 'w') as f:
    f.write(content)

print("✅ App.jsx fixed - removed misplaced fetchModules line")
PYTHON_FIX

echo ""
echo "📝 Verifying the fix..."
# Check if the line is still incorrectly placed
if grep -q "await fetchModules(user.id);" App.jsx && grep -A2 "Return to Dashboard" App.jsx | grep -q "await fetchModules"; then
    echo "⚠️ Warning: The line might still be in the wrong place"
    echo "Manually checking..."
fi

cd ../..

# Add and commit
git add frontend/src/App.jsx
git commit -m "Fix: Remove incorrectly placed fetchModules from results button"
git push origin main

echo ""
echo "========================================="
echo "🏗️  TESTING LOCAL BUILD"
echo "========================================="

cd frontend || exit
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful locally!"
    echo ""
    echo "========================================="
    echo "🚀 DEPLOYING TO VERCEL"
    echo "========================================="
    cd ..
    vercel --prod --force
else
    echo ""
    echo "❌ Build still failing. Showing errors:"
    npm run build 2>&1 | tail -20
    cd ..
fi

echo ""
echo "✅ Done!"
