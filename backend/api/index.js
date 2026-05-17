const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'https://careworks-assessment.vercel.app',
        'https://careworks-assessment-git-main.vercel.app'
    ],
    credentials: true
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

app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.post('/api/auth/admin-login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(401).json({ error: 'Invalid email or password' });
        if (user.role === 'TRAINEE') return res.status(401).json({ error: 'Please use code login' });
        
        const validPasswords = {
            'admin@careworks.com': 'Admin@2025',
            'director@careworks.com': 'Director@2025',
            'supervisor@careworks.com': 'Supervisor@2025'
        };
        
        if (validPasswords[email] !== password) {
            return res.status(401).json({ error: 'Invalid password' });
        }
        
        const { password: _, ...userWithoutSensitive } = user;
        res.json(userWithoutSensitive);
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

app.post('/api/admin/batch-generate-codes', async (req, res) => {
    const { students, trainingRoute = 'FULL_22', selectedModules = [] } = req.body;
    if (!students || students.length === 0) return res.status(400).json({ error: 'No students provided' });
    
    const results = [];
    for (const student of students) {
        try {
            const email = generateEmail(student.surname, student.firstName);
            const name = `${student.firstName} ${student.surname}`;
            let user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                user = await prisma.user.create({
                    data: {
                        email,
                        name,
                        role: 'TRAINEE',
                        trainingRoute,
                        selectedModules: trainingRoute === 'CUSTOM' ? selectedModules : null
                    }
                });
            }
            await prisma.loginCode.deleteMany({ where: { email } });
            const code = generateCode();
            const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
            await prisma.loginCode.create({ data: { email, code, expiresAt } });
            results.push({ surname: student.surname, firstName: student.firstName, email, name, code, expiresAt });
        } catch (error) {
            results.push({ error: error.message });
        }
    }
    res.json({ success: true, count: results.length, codes: results });
});

app.get('/api/admin/students', async (req, res) => {
    try {
        const students = await prisma.user.findMany({
            where: { role: 'TRAINEE' },
            select: {
                id: true, email: true, name: true, trainingRoute: true, selectedModules: true, createdAt: true,
                moduleAttempts: { select: { id: true, score: true, passed: true, total: true, completedAt: true, module: { select: { name: true } } } },
                loginCodes: { where: { expiresAt: { gt: new Date() } }, select: { code: true, expiresAt: true }, orderBy: { createdAt: 'desc' }, take: 1 }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(students);
    } catch (error) { res.status(500).json({ error: 'Failed to fetch students' }); }
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
        if (!user) {
            user = await prisma.user.create({
                data: { email, name: email.split('@')[0], role: 'TRAINEE', trainingRoute: 'FULL_22' }
            });
        }
        res.json(user);
    } catch (error) { res.status(500).json({ error: 'Verification failed' }); }
});

app.get('/api/modules', async (req, res) => {
    const userId = req.query.userId;
    try {
        let modules;
        if (userId) {
            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (user && user.trainingRoute === 'CUSTOM' && user.selectedModules) {
                modules = await prisma.module.findMany({ where: { id: { in: user.selectedModules } }, orderBy: { id: 'asc' } });
            } else {
                modules = await prisma.module.findMany({ orderBy: { id: 'asc' } });
            }
        } else {
            modules = await prisma.module.findMany({ orderBy: { id: 'asc' } });
        }
        res.json(modules);
    } catch (error) { res.status(500).json({ error: 'Failed to fetch modules' }); }
});

app.get('/api/user/:userId/progress', async (req, res) => {
    try {
        const progress = await prisma.moduleProgress.findMany({ where: { userId: req.params.userId } });
        const attempts = await prisma.moduleAttempt.findMany({ where: { userId: req.params.userId }, include: { module: true }, orderBy: { completedAt: 'desc' } });
        res.json({ progress, attempts });
    } catch (error) { res.json({ progress: [], attempts: [] }); }
});

app.post('/api/modules/:id/submit', async (req, res) => {
    const { userId, answers, timeSpent } = req.body;
    const moduleId = parseInt(req.params.id);
    try {
        const module = await prisma.module.findUnique({ where: { id: moduleId } });
        const questions = module.questions || [];
        let score = 0;
        questions.forEach((q, index) => { if (answers[index] === q.correct) score++; });
        const passed = score >= Math.ceil(questions.length * 0.75);
        await prisma.moduleAttempt.create({
            data: { userId, moduleId, score, passed, answers, timeSpent: timeSpent || 0, completedAt: new Date() }
        });
        await prisma.moduleProgress.upsert({
            where: { userId_moduleId: { userId, moduleId } },
            update: { status: passed ? 'passed' : 'failed', score, attempts: { increment: 1 } },
            create: { userId, moduleId, status: passed ? 'passed' : 'failed', score, attempts: 1 }
        });
        res.json({ score, passed, total: questions.length });
    } catch (error) { res.status(500).json({ error: 'Failed to submit assessment' }); }
});

app.delete('/api/admin/delete-user/:userId', async (req, res) => {
    try {
        await prisma.user.delete({ where: { id: req.params.userId } });
        res.json({ success: true });
    } catch (error) { res.status(500).json({ error: 'Failed to delete user' }); }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
module.exports = app;
