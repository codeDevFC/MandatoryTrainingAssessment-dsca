const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

// CORS configuration - allow all origins for production
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3002',
    'https://mandatory-training-assessment-dsca.vercel.app',
    'https://mandatory-training-assessment-dsca.vercel.app',
    'https://mandatory-training-assessment-dsca-1bft2qzve.vercel.app',
    /\.vercel\.app$/
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
  console.log('📝 Login attempt:', email);
  
  try {
    const user = await prisma.user.findUnique({ 
      where: { email: email.toLowerCase() } 
    });
    
    console.log('👤 User found:', user ? user.email : 'No user found');
    
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    if (user.role === 'TRAINEE') {
      console.log('❌ Trainee trying to use admin login');
      return res.status(401).json({ error: 'Please use code login for trainee accounts' });
    }
    
    const validPasswords = {
      'admin@careworks.com': 'Admin@2025',
      'director@careworks.com': 'Director@2025',
      'supervisor@careworks.com': 'Supervisor@2025'
    };
    
    if (validPasswords[email.toLowerCase()] !== password) {
      console.log('❌ Invalid password for:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    console.log('✅ Login successful:', email);
    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    });
    
  } catch (error) {
    console.error('❌ Admin login error:', error);
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
        update: {
          trainingRoute,
          selectedModules: selectedModulesJson
        },
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
      results.push({ name: user.name, email, code, trainingRoute });
    } catch (e) {
      console.error('Error generating code:', e.message);
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
    
    const parsedStudents = students.map(s => ({
      ...s,
      selectedModules: s.selectedModules ? JSON.parse(s.selectedModules) : []
    }));
    res.json(parsedStudents);
  } catch (error) {
    console.error('Get students error:', error);
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
    console.error('Get modules error:', error);
    res.status(500).json({ error: 'Failed to fetch modules' });
  }
});

// Export user report
app.get('/api/user/:userId/export', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.userId },
      include: {
        moduleAttempts: {
          include: { module: true },
          orderBy: { completedAt: 'desc' }
        }
      }
    });
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const summary = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        joinedAt: user.createdAt,
        trainingRoute: user.trainingRoute,
        selectedModules: user.selectedModules ? JSON.parse(user.selectedModules) : []
      },
      totalAttempts: user.moduleAttempts.length,
      passedModules: user.moduleAttempts.filter(a => a.passed).length,
      failedModules: user.moduleAttempts.filter(a => !a.passed).length,
      averageScore: user.moduleAttempts.length > 0 
        ? user.moduleAttempts.reduce((acc, a) => acc + a.score, 0) / user.moduleAttempts.length 
        : 0,
      totalTimeSpent: user.moduleAttempts.reduce((acc, a) => acc + (a.timeSpent || 0), 0),
      attempts: user.moduleAttempts
    };
    res.json(summary);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Export failed' });
  }
});

// Delete single user
app.delete('/api/admin/delete-user/:id', async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
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
    const result = await prisma.user.deleteMany({
      where: { id: { in: userIds }, role: 'TRAINEE' }
    });
    res.json({ success: true, count: result.count });
  } catch (error) {
    console.error('Bulk delete error:', error);
    res.status(500).json({ error: 'Failed to delete users' });
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
    console.error('Verify error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// Get modules with custom filtering
app.get('/api/modules', async (req, res) => {
  const userId = req.query.userId;
  try {
    let modules;
    if (userId) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      let selectedModules = [];
      if (user && user.trainingRoute === 'CUSTOM' && user.selectedModules) {
        try {
          selectedModules = JSON.parse(user.selectedModules);
        } catch (e) {
          selectedModules = [];
        }
      }
      if (user && user.trainingRoute === 'CUSTOM' && selectedModules.length > 0) {
        modules = await prisma.module.findMany({
          where: { id: { in: selectedModules } },
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
    console.error('Modules fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch modules' });
  }
});

// Get single module
app.get('/api/modules/:id', async (req, res) => {
  try {
    const moduleData = await prisma.module.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!moduleData) return res.status(404).json({ error: 'Module not found' });
    
    let parsedModule = { ...moduleData };
    if (moduleData.questions && typeof moduleData.questions === 'string') {
      try {
        parsedModule.questions = JSON.parse(moduleData.questions);
      } catch (e) {
        parsedModule.questions = [];
      }
    }
    res.json(parsedModule);
  } catch (error) {
    console.error('Module fetch error:', error);
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
      try {
        questions = JSON.parse(moduleData.questions);
      } catch (e) {
        questions = [];
      }
    }
    
    let score = 0;
    const errors = [];
    
    questions.forEach((question, index) => {
      const userAnswer = answers[index];
      if (userAnswer === question.correct) {
        score++;
      } else {
        errors.push({
          questionIndex: index,
          questionText: question.text,
          userAnswer: userAnswer,
          correctAnswer: question.correct
        });
      }
    });
    
    const passed = score >= moduleData.passMark;
    const answersJson = JSON.stringify(answers);
    
    await prisma.moduleAttempt.create({
      data: {
        userId: userId,
        moduleId: moduleId,
        score: score,
        passed: passed,
        answers: answersJson,
        timeSpent: timeSpent || 0,
        completedAt: new Date()
      }
    });
    
    await prisma.moduleProgress.upsert({
      where: { userId_moduleId: { userId: userId, moduleId: moduleId } },
      update: {
        status: passed ? 'passed' : 'failed',
        score: score,
        attempts: { increment: 1 },
        passedAt: passed ? new Date() : undefined
      },
      create: {
        userId: userId,
        moduleId: moduleId,
        status: passed ? 'passed' : 'failed',
        score: score,
        attempts: 1,
        passedAt: passed ? new Date() : undefined
      }
    });
    
    await prisma.quizResult.create({
      data: { score: score, moduleId: moduleId, userId: userId, passed: passed }
    });
    
    res.json({
      score: score,
      passed: passed,
      total: questions.length,
      passMark: moduleData.passMark,
      errors: errors.slice(0, 5)
    });
  } catch (error) {
    console.error('Submit error:', error);
    res.status(500).json({ error: 'Submit failed' });
  }
});

// Get user progress
app.get('/api/user/:userId/progress', async (req, res) => {
  try {
    const progress = await prisma.moduleProgress.findMany({
      where: { userId: req.params.userId }
    });
    const attempts = await prisma.moduleAttempt.findMany({
      where: { userId: req.params.userId },
      orderBy: { completedAt: 'desc' },
      include: { module: true }
    });
    
    const parsedAttempts = attempts.map(a => ({
      ...a,
      answers: a.answers ? JSON.parse(a.answers) : {}
    }));
    
    res.json({ progress: progress || [], attempts: parsedAttempts || [] });
  } catch (error) {
    console.error('Progress error:', error);
    res.json({ progress: [], attempts: [] });
  }
});

// For Vercel serverless
module.exports = app;

// Start server if not in Vercel
if (require.main === module) {
  const PORT = 3002;
  app.listen(PORT, () => {
    console.log(`✅ Backend running on http://localhost:${PORT}`);
  });
}
