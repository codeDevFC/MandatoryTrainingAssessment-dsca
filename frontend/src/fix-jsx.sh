#!/bin/bash

cd ~/Downloads/dsca-MTA-Quiz/frontend/src

# Backup current App.jsx
cp App.jsx App.jsx.backup.$(date +%Y%m%d_%H%M%S)

# Fix 1: Ensure the return statements have proper wrapping
# Look for unclosed div tags and fix them

# Remove any duplicate Footer closing issues
sed -i '' '/^[[:space:]]*<\/div>[[:space:]]*$/{
N
/\n[[:space:]]*<\/div>[[:space:]]*$/d
}' App.jsx

# Fix the specific line 1148 issue - ensure proper fragment wrapping
# Find the trainee dashboard return and ensure it's properly wrapped
awk '
/\/\/ ============ TRAINEE DASHBOARD ============/ {
    in_trainee = 1
}
in_trainee && /return \(/ {
    return_started = 1
}
return_started && /^[[:space:]]*<\/div>[[:space:]]*$/ {
    div_count++
}
return_started && /^[[:space:]]*\);[[:space:]]*$/ {
    if (div_count == 1) {
        print "        </div>"
        print "      </div>"
        print "    );"
    }
    in_trainee = 0
    return_started = 0
    div_count = 0
}
{ print }
' App.jsx > App.jsx.tmp && mv App.jsx.tmp App.jsx

echo "✅ JSX syntax fixes applied"
