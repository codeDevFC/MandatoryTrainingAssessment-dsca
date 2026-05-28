#!/bin/bash

echo "📦 Creating backups..."
cp backend/api/index.js backend/api/index.js.backup 2>/dev/null || true
cp frontend/src/App.jsx frontend/src/App.jsx.backup 2>/dev/null || true

echo "✉️ Fixing email format to lowercase..."

cat > backend/api/index.js << 'EOF'
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
   res.status(500).json({ error: 'Failed' });
 }
});

app.get('/api/modules', async (req, res) => {
 const userId = req.query.userId;
 try {
   let modules;
   if (userId) {
     const user = await prisma.user.findUnique({ where: { id: userId } });
     if (user && user.trainingRoute === 'CUSTOM' && user.selectedModules) {
       let selected = JSON.parse(user.selectedModules);
       modules = await prisma.module.findMany({ where: { id: { in: selected } }, orderBy: { id: 'asc' } });
     } else {
       modules = await prisma.module.findMany({ orderBy: { id: 'asc' } });
     }
   } else {
     modules = await prisma.module.findMany({ orderBy: { id: 'asc' } });
   }
   res.json(modules);
 } catch (error) {
   res.status(500).json({ error: 'Failed' });
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
EOF

echo "📝 Updating frontend branding..."
cd frontend/src
sed -i '' 's/surname\.initial@coht\.co\.uk/surnameinitial@coht.co.uk/g' App.jsx 2>/dev/null || true
sed -i '' 's/CareWorks/COHT/g' App.jsx 2>/dev/null || true

echo "⏳ Adding loading indicator..."
mkdir -p utils
cat > utils/loading.js << 'EOF'
export const showColdStartMessage = () => {
  const existing = document.getElementById('cold-start-message');
  if (existing) return;
  const div = document.createElement('div');
  div.id = 'cold-start-message';
  div.innerHTML = '<div style="position: fixed; bottom: 20px; left: 20px; z-index: 9999; background: #1e293b; color: white; padding: 12px 20px; border-radius: 12px; font-size: 13px; font-family: monospace;">' +
    '🔄 Server waking up - first request may take 15-30s</div>';
  document.body.appendChild(div);
};
export const hideColdStartMessage = () => {
  const el = document.getElementById('cold-start-message');
  if (el) el.remove();
};
EOF

# Add loading to main.tsx
if ! grep -q "showColdStartMessage" main.tsx 2>/dev/null; then
  sed -i '' 's/import { initAntiCopyProtection }/import { initAntiCopyProtection }\nimport { showColdStartMessage, hideColdStartMessage }/g' main.tsx
  sed -i '' 's/initAntiCopyProtection();/initAntiCopyProtection();\nshowColdStartMessage();\nsetTimeout(hideColdStartMessage, 35000);/g' main.tsx
fi

cd ../..

echo "🏗️ Rebuilding and deploying..."
cd frontend
npm run build
cd ..

git add .
git commit -m "Fix: lowercase email format (surnameinitial@coht.co.uk) and branding"
git push origin main --force
vercel --prod --force

echo ""
echo "✅ DEPLOYMENT COMPLETE!"
echo "📍 https://dsca-mta-quiz.vercel.app"
echo ""
echo "📧 NEW EMAIL FORMAT: surnameinitial@coht.co.uk (e.g., erikt@coht.co.uk)"
