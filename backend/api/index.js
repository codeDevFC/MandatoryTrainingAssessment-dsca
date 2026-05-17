const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'], credentials: true }));
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
    if (!user) return res.status(401).json({ error: 'Invalid email' });
    if (user.role === 'TRAINEE') return res.status(401).json({ error: 'Use code login' });
    const validPasswords = { 'admin@careworks.com': 'Admin@2025', 'director@careworks.com': 'Director@2025', 'supervisor@careworks.com': 'Supervisor@2025' };
    if (validPasswords[email] !== password) return res.status(401).json({ error: 'Invalid password' });
    const { password: _, ...userData } = user;
    res.json(userData);
  } catch (error) { res.status(500).json({ error: 'Login failed' }); }
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

app.post('/api/admin/batch-generate-codes', async (req, res) => {
  const { students, trainingRoute = 'FULL_22' } = req.body;
  const results = [];
  for (const student of students) {
    try {
      const email = generateEmail(student.surname, student.firstName);
      const name = `${student.firstName} ${student.surname}`;
      let user = await prisma.user.findUnique({ where: { email } });
      if (!user) user = await prisma.user.create({ data: { email, name, role: 'TRAINEE', trainingRoute } });
      await prisma.loginCode.deleteMany({ where: { email } });
      const code = generateCode();
      await prisma.loginCode.create({ data: { email, code, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } });
      results.push({ surname: student.surname, firstName: student.firstName, email, name, code });
    } catch (error) { results.push({ error: error.message }); }
  }
  res.json({ success: true, count: results.length, codes: results });
});

app.get('/api/modules', async (req, res) => {
  try {
    const modules = await prisma.module.findMany({ orderBy: { id: 'asc' }, select: { id: true, name: true, passMark: true, questions: true } });
    res.json(modules || []);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch modules' }); }
});

app.get('/api/admin/students', async (req, res) => {
  try {
    const students = await prisma.user.findMany({
      where: { role: 'TRAINEE' },
      select: { id: true, email: true, name: true, trainingRoute: true, createdAt: true, moduleAttempts: { select: { id: true, score: true, passed: true, completedAt: true, module: { select: { name: true } } } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(students || []);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch students' }); }
});

app.get('/api/modules/:id', async (req, res) => {
  try {
    const module = await prisma.module.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!module) return res.status(404).json({ error: 'Module not found' });
    res.json(module);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch module' }); }
});

app.get('/api/user/:userId/progress', async (req, res) => {
  try {
    const progress = await prisma.moduleProgress.findMany({ where: { userId: req.params.userId } });
    const attempts = await prisma.moduleAttempt.findMany({ where: { userId: req.params.userId }, include: { module: true }, orderBy: { completedAt: 'desc' } });
    res.json({ progress: progress || [], attempts: attempts || [] });
  } catch (error) { res.json({ progress: [], attempts: [] }); }
});

const PORT = 3002;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
