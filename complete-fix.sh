#!/bin/bash

echo "=========================================="
echo "🔧 STARTING COMPLETE FIX FOR STUDENT DETAILS"
echo "=========================================="

# Step 1: Fix Backend Student Endpoint
echo ""
echo "📡 STEP 1: Fixing Backend Student Endpoint..."

cd backend

cat > api/index.js.fixed << 'BACKENDEOF'
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
    'https://dsca-mta-quiz01.vercel.app',
    /\.vercel\.app$/,
    /\.onrender\.com$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());
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

// ============ REGISTRATION ============
app.post('/api/auth/register', async (req, res) => {
  const { firstName, lastName, email, phone, address, postCode, role } = req.body;
  const phoneRegex = /^\+44\d{10}$/;
  
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ error: 'Phone must start with +44 and have 10 digits' });
  }
  
  try {
    const existingUser = await prisma.user.findUnique({ where: { email: email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    const user = await prisma.user.create({
      data: {
        email: email,
        name: firstName + ' ' + lastName,
        phone: phone,
        address: address || '',
        postCode: postCode || '',
        role: role || 'TRAINEE',
        trainingRoute: 'FULL_22',
        paymentConfirmed: false
      }
    });
    
    console.log('✅ New registration:', user.email);
    
    res.json({
      success: true,
      message: 'Registration submitted! Awaiting payment confirmation.',
      registration: { id: user.id, name: user.name, email: user.email, phone: user.phone }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed: ' + error.message });
  }
});

// ============ GET ALL STUDENTS WITH PAYMENT STATUS (FIXED) ============
app.get('/api/admin/all-students-with-status', async (req, res) => {
  try {
    const students = await prisma.user.findMany({
      where: { role: 'TRAINEE' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        postCode: true,
        role: true,
        paymentConfirmed: true,
        paymentConfirmedAt: true,
        createdAt: true,
        trainingRoute: true,
        selectedModules: true,
        loginCodes: {
          where: { expiresAt: { gt: new Date() } },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log('📊 Found students:', students.length);
    res.json(students);
  } catch (error) {
    console.error('Fetch students error:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// ============ GET STUDENT FULL DETAILS ============
app.get('/api/admin/student-full-details/:id', async (req, res) => {
  try {
    const student = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        postCode: true,
        role: true,
        trainingRoute: true,
        selectedModules: true,
        paymentConfirmed: true,
        paymentConfirmedAt: true,
        createdAt: true,
        loginCodes: {
          where: { expiresAt: { gt: new Date() } },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });
    
    if (!student) return res.status(404).json({ error: 'Student not found' });
    
    res.json({
      ...student,
      currentCode: student.loginCodes[0]?.code || null,
      codeExpiresAt: student.loginCodes[0]?.expiresAt || null,
      originalRegistrationEmail: student.email
    });
  } catch (error) {
    console.error('Fetch student details error:', error);
    res.status(500).json({ error: 'Failed to fetch student details' });
  }
});

// ============ CONFIRM PAYMENT ============
app.post('/api/admin/confirm-payment/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.update({
      where: { id: id },
      data: { paymentConfirmed: true, paymentConfirmedAt: new Date() }
    });
    console.log('✅ Payment confirmed for:', user.email);
    res.json({ success: true, user });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ error: 'Failed to confirm payment: ' + error.message });
  }
});

// ============ GENERATE CODE WITH ROUTE ============
app.post('/api/admin/generate-code-with-route/:id', async (req, res) => {
  const { id } = req.params;
  const { trainingRoute = 'FULL_22', selectedModules = [] } = req.body;
  
  try {
    const user = await prisma.user.findUnique({ where: { id: id } });
    if (!user) return res.status(404).json({ error: 'Student not found' });
    if (!user.paymentConfirmed) return res.status(400).json({ error: 'Payment not confirmed yet' });
    
    const nameParts = user.name ? user.name.split(' ') : ['user', 'unknown'];
    const surname = nameParts[nameParts.length - 1] || 'user';
    const firstName = nameParts[0] || 'user';
    const loginEmail = surname.toLowerCase() + firstName.charAt(0).toLowerCase() + "@coht.co.uk";
    const selectedModulesJson = trainingRoute === 'CUSTOM' ? JSON.stringify(selectedModules) : null;
    
    await prisma.user.update({
      where: { id: id },
      data: { email: loginEmail, trainingRoute: trainingRoute, selectedModules: selectedModulesJson }
    });
    
    await prisma.loginCode.deleteMany({ where: { email: loginEmail } });
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await prisma.loginCode.create({ data: { email: loginEmail, code: code, expiresAt: expiresAt } });
    
    const BASE_URL = process.env.FRONTEND_URL || 'https://dsca-mta-quiz01.vercel.app';
    const whatsappMessage = `COHT Training Credentials%0A%0A🔐 Login Email: ${loginEmail}%0A🔑 Code: ${code}%0A%0A🔗 Login: ${BASE_URL}%0A%0A⏰ Code expires in 30 days`;
    const whatsappLink = `https://wa.me/${user.phone.replace('+', '')}?text=${whatsappMessage}`;
    
    console.log('✅ Code generated for:', loginEmail, 'Code:', code);
    
    res.json({ success: true, code: code, loginEmail: loginEmail, phone: user.phone, whatsappLink: whatsappLink, trainingRoute: trainingRoute });
  } catch (error) {
    console.error('Generate code error:', error);
    res.status(500).json({ error: 'Failed to generate code: ' + error.message });
  }
});

// ============ RESEND LOGIN DETAILS ============
app.post('/api/admin/resend-login-details/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const user = await prisma.user.findUnique({ where: { id: id } });
    if (!user) return res.status(404).json({ error: 'Student not found' });
    
    let loginCode = await prisma.loginCode.findFirst({
      where: { email: user.email, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' }
    });
    
    if (!loginCode) {
      const code = generateCode();
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      loginCode = await prisma.loginCode.create({ data: { email: user.email, code: code, expiresAt: expiresAt } });
    }
    
    const BASE_URL = process.env.FRONTEND_URL || 'https://dsca-mta-quiz01.vercel.app';
    const whatsappMessage = `COHT Training Credentials%0A%0A🔐 Login Email: ${user.email}%0A🔑 Code: ${loginCode.code}%0A%0A🔗 Login: ${BASE_URL}%0A%0A⏰ Code expires in 30 days`;
    const whatsappLink = `https://wa.me/${user.phone.replace('+', '')}?text=${whatsappMessage}`;
    
    res.json({ success: true, code: loginCode.code, loginEmail: user.email, whatsappLink: whatsappLink });
  } catch (error) {
    console.error('Resend login error:', error);
    res.status(500).json({ error: 'Failed to resend credentials: ' + error.message });
  }
});

// ============ ADMIN LOGIN ============
app.post('/api/auth/admin-login', async (req, res) => {
  const { email, password } = req.body;
  
  const validAdmins = {
    'admin@careworks.com': 'Admin@2025',
    'director@careworks.com': 'Director@2025',
    'supervisor@careworks.com': 'Supervisor@2025'
  };
  
  try {
    if (validAdmins[email] && validAdmins[email] === password) {
      let user = await prisma.user.findUnique({ where: { email: email } });
      if (!user) {
        let role = 'TRAINEE';
        if (email === 'admin@careworks.com') role = 'ADMIN';
        else if (email === 'director@careworks.com') role = 'DIRECTOR';
        else if (email === 'supervisor@careworks.com') role = 'SUPERVISOR';
        user = await prisma.user.create({ data: { email: email, name: email.split('@')[0], role: role } });
      }
      return res.json({ id: user.id, email: user.email, name: user.name, role: user.role });
    }
    res.status(401).json({ error: 'Invalid email or password' });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ============ BATCH GENERATE CODES ============
app.post('/api/admin/batch-generate-codes', async (req, res) => {
  const { students, trainingRoute = 'FULL_22', selectedModules = [] } = req.body;
  const results = [];
  
  for (const student of students) {
    try {
      const email = generateEmail(student.surname, student.firstName);
      const selectedModulesJson = trainingRoute === 'CUSTOM' ? JSON.stringify(selectedModules) : null;
      
      await prisma.user.upsert({
        where: { email: email },
        update: { trainingRoute: trainingRoute, selectedModules: selectedModulesJson },
        create: {
          email: email,
          name: student.firstName + " " + student.surname,
          role: 'TRAINEE',
          trainingRoute: trainingRoute,
          selectedModules: selectedModulesJson,
          phone: student.phone || ''
        }
      });
      
      await prisma.loginCode.deleteMany({ where: { email: email } });
      const code = generateCode();
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      await prisma.loginCode.create({ data: { email: email, code: code, expiresAt: expiresAt } });
      results.push({ name: student.firstName + " " + student.surname, email: email, code: code });
    } catch (e) {
      console.error('Error generating code:', e.message);
    }
  }
  
  res.json({ success: true, codes: results, count: results.length });
});

// ============ GET ALL STUDENTS (for admin) ============
app.get('/api/admin/students', async (req, res) => {
  try {
    const students = await prisma.user.findMany({
      where: { role: 'TRAINEE' },
      include: { moduleAttempts: { include: { module: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(students);
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// ============ GET ALL MODULES ============
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

// ============ VERIFY TRAINEE CODE ============
app.post('/api/auth/verify-code', async (req, res) => {
  const { email, code } = req.body;
  
  try {
    const loginCode = await prisma.loginCode.findFirst({
      where: { email: email, code: code, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' }
    });
    
    if (!loginCode) {
      return res.status(401).json({ error: 'Invalid or expired code' });
    }
    
    let user = await prisma.user.findUnique({ where: { email: email } });
    if (!user) {
      user = await prisma.user.create({
        data: { email: email, name: email.split('@')[0], role: 'TRAINEE', trainingRoute: 'FULL_22' }
      });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Verify code error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// ============ GET MODULES FOR TRAINEE ============
app.get('/api/modules', async (req, res) => {
  const userId = req.query.userId;
  try {
    let modules;
    if (userId) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      let selectedModules = [];
      if (user && user.trainingRoute === 'CUSTOM' && user.selectedModules) {
        try { selectedModules = JSON.parse(user.selectedModules); } catch(e) { selectedModules = []; }
      }
      if (user && user.trainingRoute === 'CUSTOM' && selectedModules.length > 0) {
        modules = await prisma.module.findMany({ where: { id: { in: selectedModules } }, orderBy: { id: 'asc' } });
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

// ============ GET SINGLE MODULE ============
app.get('/api/modules/:id', async (req, res) => {
  try {
    const moduleData = await prisma.module.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!moduleData) return res.status(404).json({ error: 'Module not found' });
    if (moduleData.questions && typeof moduleData.questions === 'string') {
      try { moduleData.questions = JSON.parse(moduleData.questions); } catch(e) { moduleData.questions = []; }
    }
    res.json(moduleData);
  } catch (error) {
    console.error('Module fetch error:', error);
    res.status(500).json({ error: 'Fetch failed' });
  }
});

// ============ SUBMIT ASSESSMENT ============
app.post('/api/modules/:id/submit', async (req, res) => {
  const { userId, answers, timeSpent } = req.body;
  const moduleId = parseInt(req.params.id);
  try {
    const moduleData = await prisma.module.findUnique({ where: { id: moduleId } });
    if (!moduleData) return res.status(404).json({ error: 'Module not found' });
    
    let questions = [];
    if (moduleData.questions && typeof moduleData.questions === 'string') {
      try { questions = JSON.parse(moduleData.questions); } catch(e) { questions = []; }
    }
    
    let score = 0;
    const errors = [];
    
    questions.forEach((q, i) => {
      const userAnswer = answers[i];
      if (userAnswer === q.correct) {
        score++;
      } else {
        errors.push({
          questionNumber: i + 1,
          questionText: q.text,
          userAnswer: q.options ? q.options[userAnswer] : (userAnswer === 0 ? 'True' : 'False'),
          correctAnswer: q.options ? q.options[q.correct] : (q.correct === 0 ? 'True' : 'False')
        });
      }
    });
    
    const passed = score >= moduleData.passMark;
    
    await prisma.moduleAttempt.create({
      data: {
        userId: userId,
        moduleId: moduleId,
        score: score,
        passed: passed,
        answers: JSON.stringify(answers),
        errors: JSON.stringify(errors),
        timeSpent: timeSpent || 0,
        completedAt: new Date()
      }
    });
    
    await prisma.moduleProgress.upsert({
      where: { userId_moduleId: { userId: userId, moduleId: moduleId } },
      update: { status: passed ? 'passed' : 'failed', score: score, attempts: { increment: 1 } },
      create: { userId: userId, moduleId: moduleId, status: passed ? 'passed' : 'failed', score: score, attempts: 1 }
    });
    
    res.json({ score: score, passed: passed, total: questions.length, passMark: moduleData.passMark, errors: errors });
  } catch (error) {
    console.error('Submit error:', error);
    res.status(500).json({ error: 'Submit failed' });
  }
});

// ============ GET USER PROGRESS ============
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
    console.error('Progress error:', error);
    res.json({ progress: [], attempts: [] });
  }
});

// ============ EXPORT REPORT ============
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
    
    const attemptsWithErrors = user.moduleAttempts.map(attempt => {
      let errors = [];
      try { errors = JSON.parse(attempt.errors || '[]'); } catch(e) { errors = []; }
      return {
        id: attempt.id,
        module: attempt.module,
        score: attempt.score,
        passed: attempt.passed,
        timeSpent: attempt.timeSpent,
        completedAt: attempt.completedAt,
        errors: errors
      };
    });
    
    res.json({
      user: { name: user.name, email: user.email, role: user.role, joinedAt: user.createdAt, trainingRoute: user.trainingRoute },
      totalAttempts: user.moduleAttempts.length,
      passedModules: user.moduleAttempts.filter(a => a.passed).length,
      failedModules: user.moduleAttempts.filter(a => !a.passed).length,
      averageScore: user.moduleAttempts.length > 0 ? user.moduleAttempts.reduce((acc, a) => acc + a.score, 0) / user.moduleAttempts.length : 0,
      totalTimeSpent: user.moduleAttempts.reduce((acc, a) => acc + (a.timeSpent || 0), 0),
      attempts: attemptsWithErrors
    });
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Export failed' });
  }
});

// ============ DELETE USER ============
app.delete('/api/admin/delete-user/:id', async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Delete failed' });
  }
});

// ============ BULK DELETE USERS ============
app.delete('/api/admin/bulk-delete-users', async (req, res) => {
  const { userIds } = req.body;
  if (!userIds || userIds.length === 0) {
    return res.status(400).json({ error: 'No user IDs provided' });
  }
  try {
    const result = await prisma.user.deleteMany({ where: { id: { in: userIds }, role: 'TRAINEE' } });
    res.json({ success: true, count: result.count });
  } catch (error) {
    console.error('Bulk delete error:', error);
    res.status(500).json({ error: 'Delete failed' });
  }
});

const PORT = 3002;
app.listen(PORT, '0.0.0.0', () => {
  console.log('✅ Backend running on port ' + PORT);
  console.log('✅ Accepting requests from Vercel frontend');
});

BACKENDEOF

# Replace the backend file
mv api/index.js.fixed api/index.js
echo "✅ Backend API updated"

# Step 2: Kill old processes and restart backend
echo ""
echo "🔄 Restarting backend server..."
lsof -ti:3002 | xargs kill -9 2>/dev/null
sleep 2
node api/index.js &
sleep 3
echo "✅ Backend started on port 3002"

# Step 3: Update frontend
echo ""
echo "🎨 Updating frontend..."

cd ../frontend/src

# Create the StudentDetailsPanel component
mkdir -p components

cat > components/StudentDetailsPanel.jsx << 'PANELEOF'
import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Key, Calendar, CheckCircle, Clock, Copy, Eye, EyeOff, Building2, Shield } from 'lucide-react';

const StudentDetailsPanel = ({ student, loginDetails, onClose, onGenerateCode, onConfirmPayment }) => {
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateCode = async () => {
    setIsGenerating(true);
    if (onGenerateCode) {
      await onGenerateCode();
    }
    setIsGenerating(false);
  };

  if (!student) return null;

  const hasLoginCode = loginDetails?.code || student.currentCode;
  const loginEmail = loginDetails?.loginEmail || student.email;
  const loginCode = loginDetails?.code || student.currentCode;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">Student Details & Login Credentials</h3>
          <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl">&times;</button>
        </div>

        <div className="flex flex-col md:flex-row overflow-y-auto max-h-[calc(90vh-70px)]">
          {/* LEFT COLUMN - Registration Details */}
          <div className="flex-1 p-6 border-r border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800">Registration Information</h4>
                <p className="text-xs text-gray-500">Details provided during registration</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border-b pb-3">
                <label className="text-xs font-semibold text-gray-500 uppercase">Full Name</label>
                <p className="text-gray-800 font-medium mt-1">{student.name || 'N/A'}</p>
              </div>

              <div className="border-b pb-3">
                <label className="text-xs font-semibold text-gray-500 uppercase">Email Address</label>
                <p className="text-gray-800 font-mono text-sm mt-1">{student.originalRegistrationEmail || student.email || 'N/A'}</p>
              </div>

              <div className="border-b pb-3">
                <label className="text-xs font-semibold text-gray-500 uppercase">Phone Number</label>
                <p className="text-gray-800 font-mono text-sm mt-1">{student.phone || 'N/A'}</p>
              </div>

              <div className="border-b pb-3">
                <label className="text-xs font-semibold text-gray-500 uppercase">Address</label>
                <p className="text-gray-800 mt-1">{student.address || 'Not provided'}</p>
                <p className="text-gray-800">{student.postCode || ''}</p>
              </div>

              <div className="border-b pb-3">
                <label className="text-xs font-semibold text-gray-500 uppercase">Role</label>
                <p className="text-gray-800 mt-1">{student.role || 'Care Worker'}</p>
              </div>

              <div className="border-b pb-3">
                <label className="text-xs font-semibold text-gray-500 uppercase">Payment Status</label>
                <div className="flex items-center gap-2 mt-1">
                  {student.paymentConfirmed ? (
                    <>
                      <CheckCircle size={16} className="text-green-600" />
                      <span className="text-green-700 font-medium">Confirmed</span>
                    </>
                  ) : (
                    <>
                      <Clock size={16} className="text-yellow-600" />
                      <span className="text-yellow-700 font-medium">Pending</span>
                      {onConfirmPayment && (
                        <button onClick={onConfirmPayment} className="ml-3 text-green-600 text-sm hover:underline">
                          Confirm Payment
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="border-b pb-3">
                <label className="text-xs font-semibold text-gray-500 uppercase">Registration Date</label>
                <p className="text-gray-800 mt-1">{new Date(student.createdAt).toLocaleDateString()}</p>
              </div>

              <div className="border-b pb-3">
                <label className="text-xs font-semibold text-gray-500 uppercase">Training Route</label>
                <p className="text-gray-800 mt-1">{student.trainingRoute === 'CUSTOM' ? 'Custom Selection' : 'Full Access'}</p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Login Credentials */}
          <div className="flex-1 p-6 bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Key className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800">Login Credentials</h4>
                <p className="text-xs text-gray-500">Generated login details for assessment portal</p>
              </div>
            </div>

            {!student.paymentConfirmed ? (
              <div className="text-center py-8 bg-yellow-50 rounded-xl border border-yellow-200">
                <Clock size={48} className="text-yellow-500 mx-auto mb-3" />
                <p className="text-yellow-700 font-medium mb-2">Payment Not Confirmed</p>
                <p className="text-sm text-gray-500">Login credentials will be generated after payment confirmation.</p>
              </div>
            ) : hasLoginCode ? (
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-green-200">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Login Email</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail size={16} className="text-green-600" />
                    <code className="text-sm font-mono bg-gray-100 px-3 py-1.5 rounded-lg flex-1 break-all">{loginEmail}</code>
                    <button onClick={() => copyToClipboard(loginEmail)} className="text-gray-400 hover:text-indigo-600">
                      <Copy size={16} />
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-green-200">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Access Code</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Key size={16} className="text-green-600" />
                    <code className="text-xl font-mono tracking-wider bg-gray-100 px-4 py-2 rounded-lg block">
                      {showCode ? loginCode : '••••••'}
                    </code>
                    <button onClick={() => setShowCode(!showCode)} className="text-gray-400 hover:text-indigo-600">
                      {showCode ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button onClick={() => copyToClipboard(loginCode)} className="text-gray-400 hover:text-indigo-600">
                      <Copy size={16} />
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-green-200">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Login URL</label>
                  <code className="text-xs font-mono bg-gray-100 px-3 py-1.5 rounded-lg block mt-1 break-all">
                    https://dsca-mta-quiz01.vercel.app
                  </code>
                </div>

                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <p className="text-xs text-blue-800">ℹ️ Code expires in 30 days from generation.</p>
                </div>

                {student.phone && (
                  <a href={`https://wa.me/${student.phone.replace('+', '')}?text=COHT%20Credentials%0A%0AEmail%3A%20${encodeURIComponent(loginEmail)}%0ACode%3A%20${loginCode}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition">
                    💬 Send via WhatsApp
                  </a>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Key size={48} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No login credentials generated yet.</p>
                <p className="text-xs text-gray-400 mt-2">Payment is confirmed. Click below to generate login code.</p>
                <button onClick={handleGenerateCode} disabled={isGenerating}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                  {isGenerating ? 'Generating...' : 'Generate Login Code'}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="border-t p-4 bg-gray-50 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailsPanel;
PANELEOF

echo "✅ StudentDetailsPanel component created"

# Step 4: Update App.jsx imports
echo ""
echo "📝 Updating App.jsx..."

if ! grep -q "StudentDetailsPanel" App.jsx; then
  sed -i '' '1i\
import StudentDetailsPanel from "./components/StudentDetailsPanel";
' App.jsx
fi

# Step 5: Add missing state variables
if ! grep -q "generatedLoginDetails" App.jsx; then
  sed -i '' '/const \[showStudentDetails, setShowStudentDetails\]/a\
  const [generatedLoginDetails, setGeneratedLoginDetails] = useState(null);\
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
' App.jsx
fi

# Step 6: Add generateCodeForStudent function
if ! grep -q "generateCodeForStudent" App.jsx; then
  cat >> App.jsx << 'FUNCEOF'

  // ============ GENERATE CODE FOR STUDENT ============
  const generateCodeForStudent = async (studentId) => {
    setIsGeneratingCode(true);
    const route = studentRoutes[studentId] || 'FULL_22';
    const customModules = studentCustomModules[studentId] || [];
    
    try {
      const response = await fetch(`${API_URL}/api/admin/generate-code-with-route/${studentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trainingRoute: route,
          selectedModules: route === 'CUSTOM' ? customModules : []
        })
      });
      const data = await response.json();
      
      if (response.ok) {
        setSuccess(data.message || 'Login code generated successfully!');
        if (data.whatsappLink) {
          window.open(data.whatsappLink, '_blank');
        }
        await fetchStudentFullDetails(studentId);
        await fetchAllStudents();
        await fetchRegisteredStudents();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to generate code');
      }
    } catch (err) {
      setError('Failed to generate code');
    } finally {
      setIsGeneratingCode(false);
    }
  };
FUNCEOF
fi

# Step 7: Update the modal rendering
sed -i '' '/{showStudentDetails && selectedStudentDetails && (/,/)}/c\
        {showStudentDetails && selectedStudentDetails && (\
          <StudentDetailsPanel \
            student={selectedStudentDetails} \
            loginDetails={generatedLoginDetails} \
            onClose={() => { setShowStudentDetails(false); setSelectedStudentDetails(null); setGeneratedLoginDetails(null); }} \
            onGenerateCode={() => generateCodeForStudent(selectedStudentDetails.id)} \
            onConfirmPayment={() => confirmPayment(selectedStudentDetails.id)} \
          />\
        )}
' App.jsx

echo "✅ App.jsx updated"

# Step 8: Restart frontend
echo ""
echo "🔄 Restarting frontend..."
cd ..
lsof -ti:5173 | xargs kill -9 2>/dev/null
sleep 2
npm run dev &
sleep 3

echo ""
echo "=========================================="
echo "✅ ALL FIXES COMPLETE!"
echo "=========================================="
echo ""
echo "🌐 ACCESS YOUR APPLICATION:"
echo "  - Frontend: http://localhost:5173"
echo "  - Backend:  http://localhost:3002"
echo ""
echo "👨‍💼 ADMIN LOGIN:"
echo "  - Email: admin@careworks.com"
echo "  - Password: Admin@2025"
echo ""
echo "🧪 TEST INSTRUCTIONS:"
echo "  1. Register a new student at http://localhost:5173/register"
echo "  2. Login as Admin"
echo "  3. Go to 'Students' tab - you should see the new student"
echo "  4. Click 'Confirm Payment' for the student"
echo "  5. Click 'Generate Code' to create login credentials"
echo "  6. Click 'Details' - NOW you'll see both columns"
echo ""
echo "=========================================="

