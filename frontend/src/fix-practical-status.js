const fs = require('fs');
const path = './App.jsx';

let content = fs.readFileSync(path, 'utf8');

// Find and replace the getModuleStatus function for practical modules
// The issue: when one practical module is completed, the other should also be available

// Look for the practical module check in getModuleStatus
const practicalCheckPattern = /\/\/ Practical: Check all theory passed, then code required\s+if \(isPractical\) \{\s+const allTheoryPassed = THEORY_IDS\.every\(id => \{\s+const p = progress\.find\(x => x\.moduleId === id\);\s+return p\?\.status === 'passed';\s+\}\);\s+if \(!allTheoryPassed\) return 'locked';\s+let practicalModules = \{\};\s+if \(user\?\.practicalModules\) \{\s+try \{\s+practicalModules = typeof user\.practicalModules === 'string' \? JSON\.parse\(user\.practicalModules\) : user\.practicalModules;\s+\} catch \(e\) \{ practicalModules = \{\}; \}\s+\}\s+if \(practicalModules\[moduleId\]\?\.completed\) return 'available';\s+return 'practical_locked';\s+\}/;

const newPracticalCheck = `// Practical: Check all theory passed, then code required
 if (isPractical) {
   const allTheoryPassed = THEORY_IDS.every(id => {
     const p = progress.find(x => x.moduleId === id);
     return p?.status === 'passed';
   });
   if (!allTheoryPassed) return 'locked';
   
   let practicalModules = {};
   if (user?.practicalModules) {
     try {
       practicalModules = typeof user.practicalModules === 'string' 
         ? JSON.parse(user.practicalModules) 
         : user.practicalModules;
     } catch (e) { practicalModules = {}; }
   }
   
   // CRITICAL FIX: If EITHER practical module is completed, BOTH should be available
   // Check if module 8 OR module 17 is completed
   const isModule8Completed = practicalModules['8']?.completed || false;
   const isModule17Completed = practicalModules['17']?.completed || false;
   
   if (isModule8Completed || isModule17Completed) {
     return 'available';
   }
   
   return 'practical_locked';
 }`;

// Replace the pattern
content = content.replace(practicalCheckPattern, newPracticalCheck);

fs.writeFileSync(path, content);
console.log('? App.jsx updated - practical modules now unlock together');
