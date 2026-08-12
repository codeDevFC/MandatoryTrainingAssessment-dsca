#!/bin/bash

echo "========================================="
echo "🔧 FIXING MODULE UNLOCKING ISSUE"
echo "========================================="

cd frontend/src || exit

# Backup the current App.jsx
cp App.jsx App.jsx.backup.$(date +%Y%m%d_%H%M%S)

echo "📝 Fixing submitAssessment to refresh modules..."

# Use Python to make precise changes
python3 << 'PYTHON_FIX'
import re

with open('App.jsx', 'r') as f:
    content = f.read()

# FIX 1: Add fetchModules(user.id) in submitAssessment
# Find the submitAssessment function and add the missing line
pattern = r'(if\s*\(\s*user\.role\s*===\s*[\'"]TRAINEE[\'"]\s*\)\s*\{[^}]*?fetchUserProgress\(user\.id\)\s*;)'
replacement = r'\1\n            await fetchModules(user.id); // Refresh module statuses'
content = re.sub(pattern, replacement, content, flags=re.DOTALL)

# FIX 2: Improve getModuleStatus to handle sequential unlocking better
# Replace the entire function with a more robust version
old_status = r'const getModuleStatus = \(moduleId\) => \{[^}]*?\};'
new_status = """const getModuleStatus = (moduleId) => {
  if (user?.role !== 'TRAINEE') return 'available';
  
  const progress = userProgress.progress || [];
  const moduleProgress = progress.find(x => x.moduleId === moduleId);
  
  // Already passed
  if (moduleProgress?.status === 'passed') return 'completed';
  
  // CUSTOM route
  if (user?.trainingRoute === 'CUSTOM' || user?.trainingRoute === 'CUSTOMIZED_01') {
    const selectedModules = user?.selectedModules || [];
    if (selectedModules.includes(moduleId)) return 'available';
    return 'locked';
  }
  
  // FULL_ACCESS route - sequential unlock
  if (moduleId === 1) return 'available';
  
  // Check the previous module (skip 8 and 17 as they are practical)
  let prevId = moduleId - 1;
  while (prevId === 8 || prevId === 17) {
    prevId--;
  }
  if (prevId < 1) return 'available';
  
  const prevProgress = progress.find(x => x.moduleId === prevId);
  if (prevProgress?.status === 'passed') return 'available';
  
  return 'locked';
};"""
content = re.sub(old_status, new_status, content, flags=re.DOTALL)

with open('App.jsx', 'w') as f:
    f.write(content)

print("✅ App.jsx updated successfully!")
PYTHON_FIX

echo ""
echo "✅ Fix applied!"
echo ""
echo "🔄 Restarting frontend..."
cd ../..
lsof -ti:5173 | xargs kill -9 2>/dev/null
sleep 2
cd frontend
npm run dev &
sleep 3

echo ""
echo "========================================="
echo "✅ DEPLOYMENT READY!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Test locally: http://localhost:5173"
echo "2. Login as Trainee (use your credentials)"
echo "3. Complete Module 4 if not already done"
echo "4. Module 5 should now be unlocked"
echo ""
echo "To deploy to Vercel:"
echo "  git add ."
echo "  git commit -m 'Fix: Module unlocking after completion'"
echo "  git push origin main"
echo "  vercel --prod"
