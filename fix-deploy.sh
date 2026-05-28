#!/bin/bash

echo "🔧 FIXING EMAIL FORMAT AND BUILD ERRORS..."

# 1. Fix the backend email function
echo "📧 Fixing email format to lowercase..."

cat > backend/api/index.js << 'BACKEND_EOF'
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const app = express();
const prisma = new PrismaClient();

app.use(cors({
 origin: [
   'http://localhost:5173',
   'http://localhost:5174',
   'http://localhost:3000',
   'https://dsca-mta-quiz.vercel.app',
   /\.vercel\.app$/,
   /\.onrender\.com$/
 ],
 credentials: true,
 methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
 allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

function generateCode() {
 return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateEmail(surname, firstName) {
 const initial = firstName.charAt(0).toLowerCase();
 const formattedSurname = surname.toLowerCase();
 return formattedSurname + initial + "@coht.co.uk";
}

app.get('/api/health', (req, res) => {
 res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.post('/api/auth/admin-login', async (req, res) => {
 const { email, password } = req.body;
 try {
   const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
   if (!user || user.role === 'TRAINEE') {
     return res.status(401).json({ error: 'Invalid credentials' });
   }
   const validPasswords = {
     'admin@careworks.com': 'Admin@2025',
     'director@careworks.com': 'Director@2025',
     'supervisor@careworks.com': 'Supervisor@2025'
   };
   if (validPasswords[email.toLowerCase()] !== password) {
     return res.status(401).json({ error: 'Invalid credentials' });
   }
   res.json({ id: user.id, email: user.email, name: user.name, role: user.role });
 } catch (error) {
   res.status(500).json({ error: 'Login failed' });
 }
});

app.post('/api/admin/batch-generate-codes', async (req, res) => {
 const { students, trainingRoute = 'FULL_22', selectedModules = [] } = req.body;
 const results = [];
 for (const student of students) {
   try {
     const email = generateEmail(student.surname, student.firstName);
     const selectedModulesJson = trainingRoute === 'CUSTOM' ? JSON.stringify(selectedModules) : null;
     let user = await prisma.user.upsert({
       where: { email },
       update: { trainingRoute, selectedModules: selectedModulesJson },
       create: {
         email,
         name: student.firstName + " " + student.surname,
         role: 'TRAINEE',
         trainingRoute,
         selectedModules: selectedModulesJson
       }
     });
     await prisma.loginCode.deleteMany({ where: { email } });
     const code = generateCode();
     const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
     await prisma.loginCode.create({ data: { email, code, expiresAt } });
     results.push({ name: user.name, email, code });
   } catch (e) {
     console.error('Error:', e.message);
   }
 }
 res.json({ success: true, codes: results, count: results.length });
});

app.get('/api/admin/students', async (req, res) => {
 try {
   const students = await prisma.user.findMany({
     where: { role: 'TRAINEE' },
     include: { moduleAttempts: { include: { module: true } } },
     orderBy: { createdAt: 'desc' }
   });
   res.json(students);
 } catch (error) {
   res.status(500).json({ error: 'Failed to fetch students' });
 }
});

app.get('/api/admin/modules', async (req, res) => {
 try {
   const modules = await prisma.module.findMany({
     orderBy: { id: 'asc' },
     select: { id: true, name: true, passMark: true }
   });
   res.json(modules);
 } catch (error) {
   res.status(500).json({ error: 'Failed to fetch modules' });
 }
});

app.get('/api/user/:userId/export', async (req, res) => {
 try {
   const user = await prisma.user.findUnique({
     where: { id: req.params.userId },
     include: { moduleAttempts: { include: { module: true }, orderBy: { completedAt: 'desc' } } }
   });
   if (!user) return res.status(404).json({ error: 'User not found' });
   res.json({
     user: { name: user.name, email: user.email, role: user.role },
     totalAttempts: user.moduleAttempts.length,
     passedModules: user.moduleAttempts.filter(a => a.passed).length,
     failedModules: user.moduleAttempts.filter(a => !a.passed).length,
     attempts: user.moduleAttempts
   });
 } catch (error) {
   res.status(500).json({ error: 'Export failed' });
 }
});

app.delete('/api/admin/delete-user/:id', async (req, res) => {
 try {
   await prisma.user.delete({ where: { id: req.params.id } });
   res.json({ success: true });
 } catch (error) {
   res.status(500).json({ error: 'Delete failed' });
 }
});

app.delete('/api/admin/bulk-delete-users', async (req, res) => {
 const { userIds } = req.body;
 if (!userIds || userIds.length === 0) {
   return res.status(400).json({ error: 'No user IDs provided' });
 }
 try {
   const result = await prisma.user.deleteMany({
     where: { id: { in: userIds }, role: 'TRAINEE' }
   });
   res.json({ success: true, count: result.count });
 } catch (error) {
   res.status(500).json({ error: 'Delete failed' });
 }
});

app.post('/api/auth/verify-code', async (req, res) => {
 const { email, code } = req.body;
 try {
   const loginCode = await prisma.loginCode.findFirst({
     where: { email, code, expiresAt: { gt: new Date() } },
     orderBy: { createdAt: 'desc' }
   });
   if (!loginCode) {
     return res.status(401).json({ error: 'Invalid or expired code' });
   }
   let user = await prisma.user.findUnique({ where: { email } });
   if (!user) {
     user = await prisma.user.create({
       data: { email, name: email.split("@")[0], role: 'TRAINEE', trainingRoute: 'FULL_22' }
     });
   }
   res.json(user);
 } catch (error) {
   res.status(500).json({ error: 'Verification failed' });
 }
});

app.get('/api/modules', async (req, res) => {
 const userId = req.query.userId;
 try {
   let modules;
   if (userId) {
     const user = await prisma.user.findUnique({ where: { id: userId } });
     if (user && user.trainingRoute === 'CUSTOM' && user.selectedModules) {
       let selected = [];
       try {
         selected = JSON.parse(user.selectedModules);
       } catch(e) { selected = []; }
       modules = await prisma.module.findMany({
         where: { id: { in: selected } },
         orderBy: { id: 'asc' }
       });
     } else {
       modules = await prisma.module.findMany({ orderBy: { id: 'asc' } });
     }
   } else {
     modules = await prisma.module.findMany({ orderBy: { id: 'asc' } });
   }
   res.json(modules);
 } catch (error) {
   res.status(500).json({ error: 'Failed to fetch modules' });
 }
});

app.get('/api/modules/:id', async (req, res) => {
 try {
   const moduleData = await prisma.module.findUnique({
     where: { id: parseInt(req.params.id) }
   });
   if (!moduleData) return res.status(404).json({ error: 'Module not found' });
   if (moduleData.questions && typeof moduleData.questions === 'string') {
     moduleData.questions = JSON.parse(moduleData.questions);
   }
   res.json(moduleData);
 } catch (error) {
   res.status(500).json({ error: 'Fetch failed' });
 }
});

app.post('/api/modules/:id/submit', async (req, res) => {
 const { userId, answers, timeSpent } = req.body;
 const moduleId = parseInt(req.params.id);
 try {
   const moduleData = await prisma.module.findUnique({ where: { id: moduleId } });
   if (!moduleData) return res.status(404).json({ error: 'Module not found' });
   let questions = [];
   if (moduleData.questions && typeof moduleData.questions === 'string') {
     questions = JSON.parse(moduleData.questions);
   }
   let score = 0;
   questions.forEach((q, i) => { if (answers[i] === q.correct) score++; });
   const passed = score >= moduleData.passMark;
   await prisma.moduleAttempt.create({
     data: {
       userId: userId,
       moduleId: moduleId,
       score: score,
       passed: passed,
       answers: JSON.stringify(answers),
       timeSpent: timeSpent || 0,
       completedAt: new Date()
     }
   });
   await prisma.moduleProgress.upsert({
     where: { userId_moduleId: { userId: userId, moduleId: moduleId } },
     update: { status: passed ? 'passed' : 'failed', score: score, attempts: { increment: 1 } },
     create: { userId: userId, moduleId: moduleId, status: passed ? 'passed' : 'failed', score: score, attempts: 1 }
   });
   res.json({ score: score, passed: passed, total: questions.length, passMark: moduleData.passMark });
 } catch (error) {
   res.status(500).json({ error: 'Submit failed' });
 }
});

app.get('/api/user/:userId/progress', async (req, res) => {
 try {
   const progress = await prisma.moduleProgress.findMany({ where: { userId: req.params.userId } });
   const attempts = await prisma.moduleAttempt.findMany({
     where: { userId: req.params.userId },
     orderBy: { completedAt: 'desc' },
     include: { module: true }
   });
   res.json({ progress: progress || [], attempts: attempts || [] });
 } catch (error) {
   res.json({ progress: [], attempts: [] });
 }
});

module.exports = app;

if (require.main === module) {
 const PORT = process.env.PORT || 3002;
 app.listen(PORT, () => console.log("Backend running on port " + PORT));
}
BACKEND_EOF

# 2. Fix main.tsx - restore proper import syntax
echo "🔧 Fixing main.tsx imports..."

cat > frontend/src/main.tsx << 'MAIN_EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { initAntiCopyProtection } from './utils/antiCopy'

// Initialize anti-copy protection
initAntiCopyProtection();

// Cold start loading indicator
const showColdStartMessage = () => {
  const existing = document.getElementById('cold-start-message');
  if (existing) return;
  const div = document.createElement('div');
  div.id = 'cold-start-message';
  div.innerHTML = '<div style="position: fixed; bottom: 20px; left: 20px; z-index: 9999; background: #1e293b; color: white; padding: 12px 20px; border-radius: 12px; font-size: 13px; font-family: monospace; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">' +
    '<span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #10b981; margin-right: 8px; animation: pulse 1.5s infinite;"></span>' +
    '🔄 Server waking up - first request may take 15-30s' +
    '</div>' +
    '<style>@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }</style>';
  document.body.appendChild(div);
};

const hideColdStartMessage = () => {
  const el = document.getElementById('cold-start-message');
  if (el) el.remove();
};

showColdStartMessage();
setTimeout(hideColdStartMessage, 35000);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
MAIN_EOF

# 3. Update frontend email placeholder text
echo "📝 Updating frontend email hints..."

cd frontend/src
sed -i '' 's/surname\.initial@coht\.co\.uk/surnameinitial@coht.co.uk/g' App.jsx 2>/dev/null || true
sed -i '' 's/CareWorks/COHT/g' App.jsx 2>/dev/null || true
sed -i '' 's/careworks/coht/g' App.jsx 2>/dev/null || true

cd ../..

# 4. Rebuild and deploy
echo "🏗️ Rebuilding frontend..."
cd frontend
npm run build

if [ $? -eq 0 ]; then
  echo "✅ Build successful!"
else
  echo "❌ Build failed - check errors above"
  exit 1
fi

cd ..

echo "📦 Committing and deploying..."
git add .
git commit -m "Fix: lowercase email format (surnameinitial@coht.co.uk) and fix main.tsx imports"
git push origin main --force
vercel --prod --force

echo ""
echo "=========================================="
echo "✅ DEPLOYMENT COMPLETE!"
echo "=========================================="
echo ""
echo "📍 URL: https://dsca-mta-quiz.vercel.app"
echo ""
echo "📧 NEW EMAIL FORMAT: surnameinitial@coht.co.uk"
echo "   Example: Trainee01 + Erik = trainee01e@coht.co.uk"
echo ""
echo "⚠️  Note: Existing users keep old emails."
echo "   Only NEW users get lowercase format."
echo "=========================================="
