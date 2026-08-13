#!/bin/bash

# Find the practical check section in getModuleStatus
# We need to replace the logic so that if EITHER module 8 OR 17 is completed, BOTH show as available

# Look for the pattern and replace
sed -i '/if (isPractical) {/,/return .practical_locked.;/c\
    // Practical: Check all theory passed, then code required\n\
    if (isPractical) {\n\
      const allTheoryPassed = THEORY_IDS.every(id => {\n\
        const p = progress.find(x => x.moduleId === id);\n\
        return p?.status === \x27passed\x27;\n\
      });\n\
      if (!allTheoryPassed) return \x27locked\x27;\n\
      \n\
      let practicalModules = {};\n\
      if (user?.practicalModules) {\n\
        try {\n\
          practicalModules = typeof user.practicalModules === \x27string\x27 \n\
            ? JSON.parse(user.practicalModules) \n\
            : user.practicalModules;\n\
        } catch (e) { practicalModules = {}; }\n\
      }\n\
      \n\
      // CRITICAL FIX: If EITHER practical module is completed, BOTH should be available\n\
      const isModule8Completed = practicalModules[\x278\x27]?.completed || false;\n\
      const isModule17Completed = practicalModules[\x2717\x27]?.completed || false;\n\
      \n\
      if (isModule8Completed || isModule17Completed) {\n\
        return \x27available\x27;\n\
      }\n\
      \n\
      return \x27practical_locked\x27;\n\
    }' App.jsx

echo "✅ App.jsx fixed - practical modules now unlock together"
