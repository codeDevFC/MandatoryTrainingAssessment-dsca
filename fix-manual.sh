#!/bin/bash

cd frontend/src || exit

# Backup
cp App.jsx App.jsx.backup.manual.$(date +%Y%m%d_%H%M%S)

# Use sed to add the missing line in submitAssessment
# Find the line with fetchUserProgress and add fetchModules after it
sed -i '' '/fetchUserProgress(user\.id);/a\
            await fetchModules(user.id); // Refresh module statuses
' App.jsx

echo "✅ Manual fix applied!"

# Restart frontend
cd ../..
lsof -ti:5173 | xargs kill -9 2>/dev/null
sleep 2
cd frontend
npm run dev &

echo ""
echo "✅ Done! Test your app at http://localhost:5173"
