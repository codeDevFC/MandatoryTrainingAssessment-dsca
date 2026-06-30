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

function generatePracticalCode() {
 const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
 let code = '';
 for (let i = 0; i < 8; i++) {
 code += chars.charAt(Math.floor(Math.random() * chars.length));
 }
 return code;
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
 role: 'TRAINEE',
 trainingRoute: 'FULL_ACCESS',
 paymentConfirmed: false,
 practicalModules: JSON.stringify({})
 }
 });
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

// ============ GET STUDENT WITH LOGIN ============
app.get('/api/admin/student-with-login/:id', async (req, res) => {
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
 practicalModules: true
 }
 });
 if (!student) return res.status(404).json({ error: 'Student not found' });
 const loginCode = await prisma.loginCode.findFirst({
 where: { email: student.email, expiresAt: { gt: new Date() } },
 orderBy: { createdAt: 'desc' }
 });
 res.json({
 student: student,
 loginDetails: loginCode ? {
 loginEmail: student.email,
 code: loginCode.code,
 expiresAt: loginCode.expiresAt
 } : null
 });
 } catch (error) {
 console.error('Fetch student error:', error);
 res.status(500).json({ error: 'Failed to fetch student details' });
 }
});

// ============ GET ALL STUDENTS WITH STATUS ============
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
 paymentConfirmed: true,
 paymentConfirmedAt: true,
 createdAt: true,
 trainingRoute: true,
 selectedModules: true,
 practicalModules: true
 },
 orderBy: { createdAt: 'desc' }
 });
 res.json(students);
 } catch (error) {
 console.error('Fetch students error:', error);
 res.status(500).json({ error: 'Failed to fetch students' });
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
 res.json({ success: true, user });
 } catch (error) {
 console.error('Confirm payment error:', error);
 res.status(500).json({ error: 'Failed to confirm payment: ' + error.message });
 }
});

// ============ GENERATE CODE WITH ROUTE ============
app.post('/api/admin/generate-code-with-route/:id', async (req, res) => {
 const { id } = req.params;
 const { trainingRoute = 'FULL_ACCESS', selectedModules = [] } = req.body;
 try {
 const user = await prisma.user.findUnique({ where: { id: id } });
 if (!user) return res.status(404).json({ error: 'Student not found' });
 if (!user.paymentConfirmed) return res.status(400).json({ error: 'Payment not confirmed yet' });
 const nameParts = user.name ? user.name.split(' ') : ['user', 'unknown'];
 const surname = nameParts[nameParts.length - 1] || 'user';
 const firstName = nameParts[0] || 'user';
 const loginEmail = surname.toLowerCase() + firstName.charAt(0).toLowerCase() + "@coht.co.uk";
 const selectedModulesJson = trainingRoute === 'CUSTOMIZED_01' ? JSON.stringify(selectedModules) : null;
 await prisma.user.update({
 where: { id: id },
 data: { email: loginEmail, trainingRoute: trainingRoute, selectedModules: selectedModulesJson }
 });
 await prisma.loginCode.deleteMany({ where: { email: loginEmail } });
 const code = generateCode();
 const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
 await prisma.loginCode.create({ data: { email: loginEmail, code: code, expiresAt: expiresAt } });
 const BASE_URL = process.env.FRONTEND_URL || 'https://dsca-mta-quiz01.vercel.app';
 const whatsappMessage = `COHT Training Credentials%0A%0A? Login Email: ${loginEmail}%0A? Code: ${code}%0A%0A? Login: ${BASE_URL}%0A%0A? Code expires in 30 days`;
 const whatsappLink = `https://wa.me/${user.phone.replace('+', '')}?text=${whatsappMessage}`;
 res.json({ 
 success: true, 
 code: code, 
 loginEmail: loginEmail, 
 phone: user.phone, 
 whatsappLink: whatsappLink, 
 trainingRoute: trainingRoute 
 });
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
 const whatsappMessage = `COHT Training Credentials%0A%0A? Login Email: ${user.email}%0A? Code: ${loginCode.code}%0A%0A? Login: ${BASE_URL}%0A%0A? Code expires in 30 days`;
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
 const { students, trainingRoute = 'FULL_ACCESS', selectedModules = [] } = req.body;
 const results = [];
 for (const student of students) {
 try {
 const email = generateEmail(student.surname, student.firstName);
 const selectedModulesJson = trainingRoute === 'CUSTOMIZED_01' ? JSON.stringify(selectedModules) : null;
 await prisma.user.upsert({
 where: { email: email },
 update: { trainingRoute: trainingRoute, selectedModules: selectedModulesJson },
 create: {
 email: email,
 name: student.firstName + " " + student.surname,
 role: 'TRAINEE',
 trainingRoute: trainingRoute,
 selectedModules: selectedModulesJson,
 phone: student.phone || '',
 practicalModules: JSON.stringify({})
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

// ============ GET ALL STUDENTS ============
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
 select: { id: true, name: true, passMark: true, isPractical: true }
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
 data: { 
 email: email, 
 name: email.split('@')[0], 
 role: 'TRAINEE', 
 trainingRoute: 'FULL_ACCESS',
 practicalModules: JSON.stringify({})
 }
 });
 }
 res.json(user);
 } catch (error) {
 console.error('Verify code error:', error);
 res.status(500).json({ error: 'Verification failed' });
 }
});

// ============ PRACTICAL CODE ENDPOINTS ============
app.post('/api/admin/generate-practical-code', async (req, res) => {
 try {
 await prisma.practicalAccessCode.updateMany({
 where: { isActive: true },
 data: { isActive: false }
 });
 const newCode = generatePracticalCode();
 const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
 const practicalCode = await prisma.practicalAccessCode.create({
 data: {
 code: newCode,
 isActive: true,
 expiresAt: expiresAt,
 generatedBy: req.body.generatedBy || 'admin'
 }
 });
 res.json({
 success: true,
 code: practicalCode.code,
 expiresAt: practicalCode.expiresAt,
 message: 'New practical access code generated successfully!'
 });
 } catch (error) {
 console.error('Generate practical code error:', error);
 res.status(500).json({ error: 'Failed to generate practical code' });
 }
});

app.get('/api/admin/current-practical-code', async (req, res) => {
 try {
 const currentCode = await prisma.practicalAccessCode.findFirst({
 where: { isActive: true },
 orderBy: { generatedAt: 'desc' }
 });
 res.json({
 success: true,
 code: currentCode ? currentCode.code : null,
 expiresAt: currentCode ? currentCode.expiresAt : null,
 generatedAt: currentCode ? currentCode.generatedAt : null
 });
 } catch (error) {
 console.error('Get practical code error:', error);
 res.status(500).json({ error: 'Failed to get practical code' });
 }
});

// ============ VERIFY PRACTICAL CODE - FIXED ============
app.post('/api/auth/verify-practical-code', async (req, res) => {
 const { userId, moduleId, practicalCode } = req.body;
 
 console.log(`🔐 Verifying practical code for userId: ${userId}, moduleId: ${moduleId}`);
 
 try {
   // Check if module is practical
   if (![8, 17].includes(moduleId)) {
     return res.status(400).json({ 
       success: false, 
       error: 'This module does not require a practical access code' 
     });
   }

   // Check if user exists
   const user = await prisma.user.findUnique({ 
     where: { id: userId } 
   });
   
   if (!user) {
     console.error(`❌ User not found: ${userId}`);
     return res.status(404).json({ error: 'User not found' });
   }

   // Check if practical code is valid
   const activeCode = await prisma.practicalAccessCode.findFirst({
     where: { 
       code: practicalCode.toUpperCase(), 
       isActive: true,
       expiresAt: { gt: new Date() }
     }
   });

   if (!activeCode) {
     console.error(`❌ Invalid or expired code: ${practicalCode}`);
     return res.status(401).json({ 
       success: false, 
       error: 'Invalid or expired practical access code. Please check with your trainer.' 
     });
   }

   // Parse existing practical modules
   let practicalModules = {};
   try {
     practicalModules = user.practicalModules ? JSON.parse(user.practicalModules) : {};
   } catch (e) {
     practicalModules = {};
   }

   // Mark the practical module as completed
   practicalModules[moduleId] = {
     completed: true,
     completedAt: new Date().toISOString(),
     code: practicalCode,
     verifiedBy: activeCode.generatedBy || 'system'
   };

   // Update user with practical modules
   await prisma.user.update({
     where: { id: userId },
     data: { practicalModules: JSON.stringify(practicalModules) }
   });

   console.log(`✅ Practical code verified for module ${moduleId}`);
   
   res.json({ 
     success: true, 
     message: `Practical verification successful for Module ${moduleId}!` 
   });

 } catch (error) {
   console.error('Verify practical code error:', error);
   res.status(500).json({ error: 'Failed to verify practical code' });
 }
});

// ============ GET MODULES FOR TRAINEE ============
app.get('/api/modules', async (req, res) => {
 const userId = req.query.userId;
 try {
 let modules;
 let user = null;
 let practicalModules = {};
 let practicalAccessCode = null;
 
 if (userId) {
   user = await prisma.user.findUnique({ where: { id: userId } });
   if (user && user.practicalModules) {
     try {
       practicalModules = JSON.parse(user.practicalModules);
     } catch (e) {
       practicalModules = {};
     }
   }
   const activeCode = await prisma.practicalAccessCode.findFirst({
     where: { isActive: true },
     orderBy: { generatedAt: 'desc' }
   });
   if (activeCode) {
     practicalAccessCode = activeCode.code;
   }
 }
 
 if (userId && user) {
   let selectedModules = [];
   if (user.trainingRoute === 'CUSTOMIZED_01' && user.selectedModules) {
     try { selectedModules = JSON.parse(user.selectedModules); } catch(e) { selectedModules = []; }
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
 
 const modulesWithStatus = modules.map(module => {
   const isPractical = module.isPractical || [8, 17].includes(module.id);
   const isPracticalCompleted = practicalModules[module.id]?.completed || false;
   return {
     ...module,
     isPractical,
     isPracticalCompleted,
     practicalAccessCode: isPractical ? practicalAccessCode : null
   };
 });
 
 res.json(modulesWithStatus);
 } catch (error) {
   console.error('Modules fetch error:', error);
   res.status(500).json({ error: 'Failed to fetch modules' });
 }
});

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
 let practicalModules = {};
 try {
 practicalModules = user.practicalModules ? JSON.parse(user.practicalModules) : {};
 } catch (e) {
 practicalModules = {};
 }
 const attemptsWithErrors = user.moduleAttempts.map(attempt => {
 let errors = [];
 if (attempt.errors) {
 if (typeof attempt.errors === 'string') {
 try { errors = JSON.parse(attempt.errors); } catch(e) { errors = []; }
 } else if (Array.isArray(attempt.errors)) {
 errors = attempt.errors;
 }
 }
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
 user: { 
 name: user.name, 
 email: user.email, 
 role: user.role, 
 joinedAt: user.createdAt, 
 trainingRoute: user.trainingRoute,
 address: user.address,
 postCode: user.postCode,
 phone: user.phone,
 practicalModules: practicalModules
 },
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

app.delete('/api/admin/delete-user/:id', async (req, res) => {
 try {
 await prisma.user.delete({ where: { id: req.params.id } });
 res.json({ success: true });
 } catch (error) {
 console.error('Delete error:', error);
 res.status(500).json({ error: 'Delete failed' });
 }
});

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
 console.log('📋 Routes: FULL_ACCESS, CUSTOMIZED_01, CUSTOMIZED_02');
 console.log('🔐 Practical modules: 8 (First Aid), 17 (Moving & Handling)');
});
