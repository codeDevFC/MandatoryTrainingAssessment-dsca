#!/bin/bash
cd ~/Downloads/dsca-MTA-Quiz/frontend/src
Check what's at line 169
echo "📋 Checking line 169 of App.jsx..."
sed -n '160,180p' App.jsx
Fix the App.jsx file
python3 << 'PYTHON_FIX'
import re
with open('App.jsx', 'r') as f:
content = f.read()
print("🔧 Fixing App.jsx...")
Remove any self-referencing "App" inside the file that's not the export
content = re.sub(r'(?<![a-zA-Z])App.', 'window.App.', content)
Fix common issues
content = content.replace('App =', '// App =')
Make sure the App function is properly defined
if 'function App()' not in content and 'const App =' not in content:
print("❌ App function not found - checking file structure...")
app_match = re.search(r'(function\s+App|const\s+App\s*=\sfunction|const\s+App\s=\s*([^)])\s=>)', content)
if app_match:
print(f"✅ Found App definition at position {app_match.start()}")
else:
print("⚠️ Could not find App definition - adding wrapper...")
content = '''function App() {\n''' + content + '''\n}\n\nexport default App;'''
Ensure the export is at the end
content = re.sub(r'export\s+default\s+App\s*;?', '', content)
content = content.rstrip() + '\n\nexport default App;\n'
Remove any duplicate exports
content = re.sub(r'export\s+default\s+App\s*;\sexport\s+default\s+App\s;', 'export default App;', content)
with open('App.jsx', 'w') as f:
f.write(content)
print("✅ App.jsx fixed")
PYTHON_FIX
Also create a clean main.tsx
cat > main.tsx << 'MAIN_EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Register from './Register'
import './index.css'
ReactDOM.createRoot(document.getElementById('root')!).render(
<React.StrictMode>
<BrowserRouter>
<Routes>
<Route path="/" element={<App />} />
<Route path="/register" element={<Register />} />
</Routes>
</BrowserRouter>
</React.StrictMode>
)
MAIN_EOF
echo "✅ main.tsx fixed"
Restart everything
echo ""
echo "🔄 Restarting services..."
Kill everything
lsof -ti:3002,5173 | xargs kill -9 2>/dev/null || true
pkill -f "node" 2>/dev/null || true
sleep 2
Start backend
cd ~/Downloads/dsca-MTA-Quiz/backend
node api/index.js &
BACKEND_PID=$!
echo "✅ Backend started with PID: $BACKEND_PID"
sleep 3
Start frontend
cd ~/Downloads/dsca-MTA-Quiz/frontend
rm -rf .vite
npm run dev &
FRONTEND_PID=$!
echo "✅ Frontend started with PID: $FRONTEND_PID"
echo ""
echo "============================================================"
echo "✅ FIX APPLIED!"
echo "============================================================"
echo ""
echo "🌐 Open: http://localhost:5173"
echo "🔑 Admin: admin@careworks.com / Admin@2025"
echo ""
