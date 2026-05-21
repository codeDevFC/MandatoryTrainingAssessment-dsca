const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

// CORS - Allow all origins for production
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Helper functions
function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateEmail(surname, firstName) {
  const initial = firstName.charAt(0).toUpperCase();
  const formattedSurname = surname.charAt(0).toUpperCase() + surname.slice(1).toLowerCase();
  return `${formattedSurname}.${initial}@dsca.co.uk`;
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Admin login
app.post('/api/auth/admin-login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', email);
  
  try {
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    if (user.role === 'TRAINEE') {
      return res.status(401).json({ error: 'Use code login for trainees' });
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
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Batch generate codes
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
          name: `${student.firstName} ${student.surname}`,
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

// Get all students
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

// Get all modules for admin
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

// Export user report
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

// Delete single user
app.delete('/api/admin/delete-user/:id', async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

// Bulk delete users
app.delete('/api/admin/bulk-delete-users', async (req, res) => {
  const { userIds } = req.body;
  if (!userIds || userIds.length === 0) {
    return res.status(400).json({ error: 'No user IDs provided' });
  }
  try {
    const result = await prisma.user.deleteMany({ where: { id: { in: userIds }, role: 'TRAINEE' } });
    res.json({ success: true, count: result.count });
  } catch (error) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

// Verify trainee code
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
        data: { email, name: email.split('@')[0], role: 'TRAINEE', trainingRoute: 'FULL_22' }
      });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Verification failed' });
  }
});

// Get modules for trainee
app.get('/api/modules', async (req, res) => {
  const userId = req.query.userId;
  try {
    let modules;
    if (userId) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user && user.trainingRoute === 'CUSTOM' && user.selectedModules) {
        let selected = [];
        try { selected = JSON.parse(user.selectedModules); } catch(e) { selected = []; }
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

// Get single module
app.get('/api/modules/:id', async (req, res) => {
  try {
    const moduleData = await prisma.module.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!moduleData) return res.status(404).json({ error: 'Module not found' });
    
    if (moduleData.questions && typeof moduleData.questions === 'string') {
      moduleData.questions = JSON.parse(moduleData.questions);
    }
    res.json(moduleData);
  } catch (error) {
    res.status(500).json({ error: 'Fetch failed' });
  }
});

// Submit assessment
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
        userId, moduleId, score, passed,
        answers: JSON.stringify(answers),
        timeSpent: timeSpent || 0,
        completedAt: new Date()
      }
    });
    
    await prisma.moduleProgress.upsert({
      where: { userId_moduleId: { userId, moduleId } },
      update: { status: passed ? 'passed' : 'failed', score, attempts: { increment: 1 } },
      create: { userId, moduleId, status: passed ? 'passed' : 'failed', score, attempts: 1 }
    });
    
    res.json({ score, passed, total: questions.length, passMark: moduleData.passMark });
  } catch (error) {
    res.status(500).json({ error: 'Submit failed' });
  }
});

// Get user progress
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
  app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
}
