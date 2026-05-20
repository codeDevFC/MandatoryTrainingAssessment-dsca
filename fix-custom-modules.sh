#!/bin/bash

echo "=========================================="
echo "🔧 Fixing Custom Module Selection Bug"
echo "=========================================="

cd backend

# Backup the current file
cp api/index.js api/index.js.backup.$(date +%Y%m%d_%H%M%S)

# Fix the /api/modules endpoint - the logic was inverted
cat > api/index.js.fixed << 'API_EOF'
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const app = express();
const prisma = new PrismaClient();

app.use(cors({
 origin: ['http://localhost:5173', 'http://localhost:5174', 'https://careworks-assessment.vercel.app'],
 credentials: true
}));
app.use(express.json());

function generateCode() { return Math.floor(100000 + Math.random() * 900000).toString(); }
function generateEmail(surname, firstName) {
 const initial = firstName.charAt(0).toUpperCase();
 const formattedSurname = surname.charAt(0).toUpperCase() + surname.slice(1).toLowerCase();
 return `${formattedSurname}.${initial}@dsca.co.uk`;
}

app.get('/api/health', (req, res) => res.json({ status: 'healthy' }));

app.post('/api/auth/admin-login', async (req, res) => {
 const { email, password } = req.body;
 try {
 const user = await prisma.user.findUnique({ where: { email } });
 if (!user || user.role === 'TRAINEE') return res.status(401).json({ error: 'Unauthorized' });
 const validPasswords = { 'admin@careworks.com': 'Admin@2025', 'director@careworks.com': 'Director@2025', 'supervisor@careworks.com': 'Supervisor@2025' };
 if (validPasswords[email] !== password) return res.status(401).json({ error: 'Invalid credentials' });
 res.json(user);
 } catch (error) { res.status(500).json({ error: 'Login failed' }); }
});

app.post('/api/admin/batch-generate-codes', async (req, res) => {
 const { students, trainingRoute = 'FULL_22', selectedModules = [] } = req.body;
 const results = [];
 for (const student of students) {
 const email = generateEmail(student.surname, student.firstName);
 let user = await prisma.user.upsert({
 where: { email },
 update: { trainingRoute, selectedModules: trainingRoute === 'CUSTOM' ? selectedModules : null },
 create: { email, name: `${student.firstName} ${student.surname}`, role: 'TRAINEE', trainingRoute, selectedModules: trainingRoute === 'CUSTOM' ? selectedModules : null }
 });
 await prisma.loginCode.deleteMany({ where: { email } });
 const code = generateCode();
 await prisma.loginCode.create({ data: { email, code, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } });
 results.push({ name: user.name, email, code });
 }
 res.json({ success: true, codes: results });
});

app.get('/api/admin/students', async (req, res) => {
 try {
 const students = await prisma.user.findMany({
 where: { role: 'TRAINEE' },
 include: { moduleAttempts: { include: { module: true } } },
 orderBy: { createdAt: 'desc' }
 });
 res.json(students);
 } catch (error) { res.status(500).json({ error: 'Failed to fetch students' }); }
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
 const summary = {
 user: { name: user.name, email: user.email, role: user.role, joinedAt: user.createdAt, organisation: user.organisation, jobRole: user.jobRole },
 totalAttempts: user.moduleAttempts.length,
 passedModules: user.moduleAttempts.filter(a => a.passed).length,
 failedModules: user.moduleAttempts.filter(a => !a.passed).length,
 averageScore: user.moduleAttempts.reduce((acc, a) => acc + a.score, 0) / (user.moduleAttempts.length || 1),
 totalTimeSpent: user.moduleAttempts.reduce((acc, a) => acc + a.timeSpent, 0),
 attempts: user.moduleAttempts
 };
 res.json(summary);
 } catch (error) { res.status(500).json({ error: 'Export failed' }); }
});

app.delete('/api/admin/delete-user/:id', async (req, res) => {
 try {
 await prisma.user.delete({ where: { id: req.params.id } });
 res.json({ success: true });
 } catch (error) { res.status(500).json({ error: 'Delete failed' }); }
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
 res.status(500).json({ error: 'Failed to delete users' });
 }
});

app.post('/api/auth/verify-code', async (req, res) => {
 const { email, code } = req.body;
 try {
 const loginCode = await prisma.loginCode.findFirst({
 where: { email, code, expiresAt: { gt: new Date() } },
 orderBy: { createdAt: 'desc' }
 });
 if (!loginCode) return res.status(401).json({ error: 'Invalid or expired code' });
 let user = await prisma.user.findUnique({ where: { email } });
 if (!user) user = await prisma.user.create({ data: { email, name: email.split('@')[0], role: 'TRAINEE', trainingRoute: 'FULL_22' } });
 res.json(user);
 } catch (error) { res.status(500).json({ error: 'Verification failed' }); }
});

// FIXED: /api/modules endpoint - correctly returns ONLY selected modules for CUSTOM route
app.get('/api/modules', async (req, res) => {
 const userId = req.query.userId;
 try {
 let modules;
 if (userId) {
 const user = await prisma.user.findUnique({ where: { id: userId } });
 if (user && user.trainingRoute === 'CUSTOM' && user.selectedModules && user.selectedModules.length > 0) {
 // CUSTOM: Return ONLY the selected modules
 modules = await prisma.module.findMany({
 where: { id: { in: user.selectedModules } },
 orderBy: { id: 'asc' }
 });
 } else {
 // FULL_22 or no custom selection: Return ALL modules
 modules = await prisma.module.findMany({ orderBy: { id: 'asc' } });
 }
 } else {
 modules = await prisma.module.findMany({ orderBy: { id: 'asc' } });
 }
 res.json(modules);
 } catch (error) {
 console.error('Modules fetch error:', error);
 res.status(500).json({ error: 'Failed to fetch modules' });
 }
});

app.get('/api/modules/:id', async (req, res) => {
 try {
 const module = await prisma.module.findUnique({ where: { id: parseInt(req.params.id) } });
 res.json(module);
 } catch (error) { res.status(500).json({ error: 'Fetch failed' }); }
});

app.post('/api/modules/:id/submit', async (req, res) => {
 const { userId, answers, timeSpent } = req.body;
 const moduleId = parseInt(req.params.id);
 try {
 const module = await prisma.module.findUnique({ where: { id: moduleId } });
 if (!module) return res.status(404).json({ error: 'Module not found' });
 const questions = module.questions || [];
 let score = 0;
 questions.forEach((q, i) => { if (answers[i] === q.correct) score++; });
 const passed = score >= Math.ceil(questions.length * 0.75);
 await prisma.moduleAttempt.create({
 data: { userId, moduleId, score, passed, answers, timeSpent: timeSpent || 0, completedAt: new Date() }
 });
 await prisma.moduleProgress.upsert({
 where: { userId_moduleId: { userId, moduleId } },
 update: { status: passed ? 'passed' : 'failed', score, attempts: { increment: 1 }, passedAt: passed ? new Date() : undefined },
 create: { userId, moduleId, status: passed ? 'passed' : 'failed', score, attempts: 1, passedAt: passed ? new Date() : undefined }
 });
 await prisma.quizResult.create({ data: { score, moduleId, userId, passed } });
 res.json({ score, passed, total: questions.length, passMark: Math.ceil(questions.length * 0.75) });
 } catch (error) { res.status(500).json({ error: 'Submit failed' }); }
});

// Get user progress
app.get('/api/user/:userId/progress', async (req, res) => {
 try {
 const progress = await prisma.moduleProgress.findMany({ where: { userId: req.params.userId } });
 const attempts = await prisma.moduleAttempt.findMany({ where: { userId: req.params.userId }, orderBy: { completedAt: 'desc' }, include: { module: true } });
 res.json({ progress: progress || [], attempts: attempts || [] });
 } catch (error) {
 console.error('Progress error:', error);
 res.json({ progress: [], attempts: [] });
 }
});

app.listen(3002, () => console.log('Backend running on port 3002'));
API_EOF

# Replace the file
mv api/index.js.fixed api/index.js

echo "✅ Fixed /api/modules endpoint - now correctly returns ONLY selected modules for CUSTOM route"
echo ""
echo "=========================================="
echo "✅ Fix complete!"
echo ""
echo "Restart your backend:"
echo "  cd backend && node api/index.js"
echo ""
echo "Then test:"
echo "  1. Create a student with 'Custom Selection'"
echo "  2. Select only 3 specific modules"
echo "  3. Login as that student - you should see ONLY those 3 modules"
echo "=========================================="
