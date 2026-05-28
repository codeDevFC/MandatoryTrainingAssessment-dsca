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
/.vercel.app$/,
/.onrender.com$/
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
module.exports = app;
if (require.main === module) {
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log("Backend running on port " + PORT));
}
