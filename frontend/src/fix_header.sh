#!/bin/bash

# Find the printReport function and replace the header
cd ~/Downloads/dsca-MTA-Quiz/frontend/src

# Create a temporary file with the new header content
cat > /tmp/new_header.txt << 'HEADER'
  <div class="header">
    <div style="display: flex; align-items: center; justify-content: center; gap: 20px; margin-bottom: 15px; flex-wrap: wrap;">
      <div style="background: white; padding: 8px 20px; border-radius: 12px; display: inline-block;">
        <span style="font-size: 28px; font-weight: bold; color: #1e664e;">COHT</span>
      </div>
      <div>
        <h1 style="margin: 0;">Training Assessment Report</h1>
        <p style="margin: 5px 0 0 0;">Official Training Record - Generated on ${new Date().toLocaleString()}</p>
      </div>
    </div>
  </div>
HEADER

# Use Python for more reliable replacement
python3 << 'PYTHON_FIX'
import re

file_path = 'App.jsx'
with open(file_path, 'r') as f:
    content = f.read()

# Find the printReport function
print_report_start = content.find('const printReport = () => {')
if print_report_start == -1:
    print("Could not find printReport function")
    exit(1)

# Find the header within the printReport function
# Look for the div with class="header"
header_pattern = r'(<div class="header">)(.*?)(</div>)'
new_header = '''<div class="header">
    <div style="display: flex; align-items: center; justify-content: center; gap: 20px; margin-bottom: 15px; flex-wrap: wrap;">
      <div style="background: white; padding: 8px 20px; border-radius: 12px; display: inline-block;">
        <span style="font-size: 28px; font-weight: bold; color: #1e664e;">COHT</span>
      </div>
      <div>
        <h1 style="margin: 0;">Training Assessment Report</h1>
        <p style="margin: 5px 0 0 0;">Official Training Record - Generated on ${new Date().toLocaleString()}</p>
      </div>
    </div>
  </div>'''

# Replace the header
content = re.sub(header_pattern, new_header, content, flags=re.DOTALL)

with open(file_path, 'w') as f:
    f.write(content)

print("✅ Header updated successfully!")
PYTHON_FIX

echo ""
echo "Now restart your frontend:"
echo "  Press Ctrl+C, then run: npm run dev"
