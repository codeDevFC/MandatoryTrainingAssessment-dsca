const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const app = express();
const prisma = new PrismaClient();

const PORT = process.env.PORT || 3002;

app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:3000',
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

app.post('/api/auth/register', async (req, res) => {
    const { firstName, lastName, email, phone, address, postCode } = req.body;
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

app.post('/api/auth/admin-login', async (req, res) => {
    const { email, password } = req.body;
    const validAdmins = {
        [process.env.ADMIN_EMAIL || 'admin@careworks.com']: process.env.ADMIN_PASSWORD,
        [process.env.DIRECTOR_EMAIL || 'director@careworks.com']: process.env.DIRECTOR_PASSWORD,
        [process.env.SUPERVISOR_EMAIL || 'supervisor@careworks.com']: process.env.SUPERVISOR_PASSWORD,
    };
    try {
        if (validAdmins[email] && validAdmins[email] === password) {
            let user = await prisma.user.findUnique({ where: { email: email } });
            if (!user) {
                let role = 'ADMIN';
                if (email === 'director@careworks.com') role = 'DIRECTOR';
                else if (email === 'supervisor@careworks.com') role = 'SUPERVISOR';
                user = await prisma.user.create({
                    data: {
                        email: email,
                        name: email.split('@')[0],
                        role: role,
                        trainingRoute: 'FULL_ACCESS',
                        paymentConfirmed: true,
                        practicalModules: JSON.stringify({})
                    }
                });
            }
            return res.json({ id: user.id, email: user.email, name: user.name, role: user.role });
        }
        res.status(401).json({ error: 'Invalid email or password' });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ error: 'Login failed: ' + error.message });
    }
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
            select: { id: true, name: true, passMark: true, isPractical: true }
        });
        res.json(modules);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch modules' });
    }
});

app.get('/api/admin/all-students-with-status', async (req, res) => {
    try {
        const students = await prisma.user.findMany({
            where: { role: 'TRAINEE' },
            select: {
                id: true, name: true, email: true, phone: true, address: true, postCode: true,
                paymentConfirmed: true, paymentConfirmedAt: true, createdAt: true,
                trainingRoute: true, selectedModules: true, practicalModules: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch students' });
    }
});

app.get('/api/admin/student-with-login/:id', async (req, res) => {
    try {
        const student = await prisma.user.findUnique({
            where: { id: req.params.id },
            select: {
                id: true, name: true, email: true, phone: true, address: true, postCode: true,
                role: true, trainingRoute: true, selectedModules: true,
                paymentConfirmed: true, paymentConfirmedAt: true, createdAt: true,
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
        res.status(500).json({ error: 'Failed to fetch student details' });
    }
});

app.post('/api/admin/confirm-payment/:id', async (req, res) => {
    try {
        const user = await prisma.user.update({
            where: { id: req.params.id },
            data: { paymentConfirmed: true, paymentConfirmedAt: new Date() }
        });
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ error: 'Failed to confirm payment: ' + error.message });
    }
});

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
        let loginEmail = surname.toLowerCase() + firstName.charAt(0).toLowerCase() + "@coht.co.uk";

        const existingUser = await prisma.user.findUnique({ where: { email: loginEmail } });
        if (existingUser && existingUser.id !== id) {
            let counter = 1;
            let found = false;
            while (!found && counter < 100) {
                const testEmail = surname.toLowerCase() + firstName.charAt(0).toLowerCase() + counter + "@coht.co.uk";
                const checkUser = await prisma.user.findUnique({ where: { email: testEmail } });
                if (!checkUser) {
                    loginEmail = testEmail;
                    found = true;
                    break;
                }
                counter++;
            }
        }

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
        const whatsappMessage = 'COHT Training Credentials%0A%0A Login Email: ' + loginEmail + '%0A Code: ' + code + '%0A%0A Login: ' + BASE_URL + '%0A%0A Code expires in 30 days';
        const whatsappLink = 'https://wa.me/' + user.phone.replace('+', '') + '?text=' + whatsappMessage;

        res.json({
            success: true, code: code, loginEmail: loginEmail, phone: user.phone,
            whatsappLink: whatsappLink, trainingRoute: trainingRoute
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate code: ' + error.message });
    }
});

app.post('/api/admin/generate-practical-code', async (req, res) => {
    try {
        await prisma.practicalAccessCode.updateMany({ where: { isActive: true }, data: { isActive: false } });
        const newCode = Math.random().toString(36).substring(2, 10).toUpperCase();
        const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
        const practicalCode = await prisma.practicalAccessCode.create({
            data: { code: newCode, isActive: true, expiresAt: expiresAt, generatedBy: req.body.generatedBy || 'admin' }
        });
        res.json({ success: true, code: practicalCode.code, expiresAt: practicalCode.expiresAt });
    } catch (error) {
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
            expiresAt: currentCode ? currentCode.expiresAt : null
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get practical code' });
    }
});

app.post('/api/auth/verify-practical-code', async (req, res) => {
    const { userId, moduleId, practicalCode } = req.body;
    try {
        if (![8, 17].includes(moduleId)) {
            return res.status(400).json({ success: false, error: 'This module does not require a practical access code' });
        }
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ error: 'User not found' });
        const activeCode = await prisma.practicalAccessCode.findFirst({
            where: { code: practicalCode.toUpperCase(), isActive: true, expiresAt: { gt: new Date() } }
        });
        if (!activeCode) {
            return res.status(401).json({ success: false, error: 'Invalid or expired practical access code.' });
        }
        let practicalModules = {};
        try { practicalModules = user.practicalModules ? JSON.parse(user.practicalModules) : {}; } catch (e) { practicalModules = {}; }
        practicalModules[moduleId] = {
            completed: true, completedAt: new Date().toISOString(),
            code: practicalCode.toUpperCase(), verifiedBy: activeCode.generatedBy || 'system'
        };
        await prisma.user.update({ where: { id: userId }, data: { practicalModules: JSON.stringify(practicalModules) } });
        res.json({ success: true, message: 'Practical verification successful for Module ' + moduleId + '!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to verify practical code: ' + error.message });
    }
});

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
                try { practicalModules = JSON.parse(user.practicalModules); } catch (e) { practicalModules = {}; }
            }
            const activeCode = await prisma.practicalAccessCode.findFirst({ where: { isActive: true }, orderBy: { generatedAt: 'desc' } });
            if (activeCode) practicalAccessCode = activeCode.code;
        }
        if (userId && user && user.trainingRoute === 'CUSTOMIZED_01' && user.selectedModules) {
            let selectedModules = [];
            try { selectedModules = JSON.parse(user.selectedModules); } catch(e) { selectedModules = []; }
            modules = await prisma.module.findMany({ where: { id: { in: selectedModules } }, orderBy: { id: 'asc' } });
        } else {
            modules = await prisma.module.findMany({ orderBy: { id: 'asc' } });
        }
        const fullAccessIds = [1,2,3,4,6,7,8,10,11,12,14,15,16,17,18,19,21,22,23];
        const practicalIds = [8,17];
        const extraAddOnIds = [5,9,13,20];
        const modulesWithStatus = modules.map(module => {
            const isPractical = module.isPractical || [8, 17].includes(module.id);
            const isPracticalCompleted = practicalModules[module.id]?.completed || false;
            let section = 'FULL_ACCESS';
            if (extraAddOnIds.includes(module.id)) section = 'EXTRA_ADD_ON';
            else if (practicalIds.includes(module.id)) section = 'PRACTICAL';
            return {
                ...module, isPractical, isPracticalCompleted,
                practicalAccessCode: isPractical ? practicalAccessCode : null,
                section: section,
                displayOrder: fullAccessIds.indexOf(module.id) + 1
            };
        });
        res.json(modulesWithStatus);
    } catch (error) {
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
        const detailedAnswers = [];
        questions.forEach((q, i) => {
            const userAnswer = answers[i];
            const isCorrect = userAnswer === q.correct;
            const userAnswerText = q.options ? q.options[userAnswer] : (userAnswer === 0 ? 'True' : 'False');
            const correctAnswerText = q.options ? q.options[q.correct] : (q.correct === 0 ? 'True' : 'False');
            if (isCorrect) { score++; } else {
                errors.push({ questionNumber: i + 1, questionText: q.text, userAnswer: userAnswerText, correctAnswer: correctAnswerText });
            }
            detailedAnswers.push({ questionNumber: i + 1, questionText: q.text, userAnswer: userAnswerText, correctAnswer: correctAnswerText, isCorrect: isCorrect });
        });
        const passed = score >= moduleData.passMark;
        await prisma.moduleAttempt.create({
            data: {
                userId: userId, moduleId: moduleId, score: score, passed: passed,
                answers: JSON.stringify(answers), errors: JSON.stringify(errors),
                detailedAnswers: JSON.stringify(detailedAnswers),
                timeSpent: timeSpent || 0, completedAt: new Date()
            }
        });
        await prisma.moduleProgress.upsert({
            where: { userId_moduleId: { userId: userId, moduleId: moduleId } },
            update: { status: passed ? 'passed' : 'failed', score: score, attempts: { increment: 1 } },
            create: { userId: userId, moduleId: moduleId, status: passed ? 'passed' : 'failed', score: score, attempts: 1 }
        });
        res.json({
            score: score, passed: passed, total: questions.length,
            passMark: moduleData.passMark, errors: errors, detailedAnswers: detailedAnswers
        });
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

app.get('/api/user/:userId/export', async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.params.userId },
            include: { moduleAttempts: { include: { module: true }, orderBy: { completedAt: 'desc' } } }
        });
        if (!user) return res.status(404).json({ error: 'User not found' });
        let practicalModules = {};
        try { practicalModules = user.practicalModules ? JSON.parse(user.practicalModules) : {}; } catch (e) { practicalModules = {}; }
        const attemptsWithDetails = user.moduleAttempts.map(attempt => {
            let errors = [];
            let detailedAnswers = [];
            let parsedAnswers = {};
            if (attempt.answers) { try { parsedAnswers = JSON.parse(attempt.answers); } catch(e) {} }
            if (attempt.errors) {
                if (typeof attempt.errors === 'string') { try { errors = JSON.parse(attempt.errors); } catch(e) { errors = []; } }
                else if (Array.isArray(attempt.errors)) { errors = attempt.errors; }
            }
            if (attempt.detailedAnswers) {
                if (typeof attempt.detailedAnswers === 'string') { try { detailedAnswers = JSON.parse(attempt.detailedAnswers); } catch(e) { detailedAnswers = []; } }
                else if (Array.isArray(attempt.detailedAnswers)) { detailedAnswers = attempt.detailedAnswers; }
            } else if (attempt.answers && attempt.module) {
                try {
                    const questions = JSON.parse(attempt.module.questions || '[]');
                    detailedAnswers = questions.map((q, idx) => ({
                        questionNumber: idx + 1, questionText: q.text,
                        userAnswer: q.options ? q.options[parsedAnswers[idx]] : (parsedAnswers[idx] === 0 ? 'True' : 'False'),
                        correctAnswer: q.options ? q.options[q.correct] : (q.correct === 0 ? 'True' : 'False'),
                        isCorrect: parsedAnswers[idx] === q.correct
                    }));
                } catch(e) { detailedAnswers = []; }
            }
            return {
                id: attempt.id, module: attempt.module, score: attempt.score, passed: attempt.passed,
                timeSpent: attempt.timeSpent, completedAt: attempt.completedAt,
                errors: errors, detailedAnswers: detailedAnswers
            };
        });
        res.json({
            user: {
                name: user.name, email: user.email, role: user.role, joinedAt: user.createdAt,
                trainingRoute: user.trainingRoute, address: user.address, postCode: user.postCode,
                phone: user.phone, practicalModules: practicalModules
            },
            totalAttempts: user.moduleAttempts.length,
            passedModules: user.moduleAttempts.filter(a => a.passed).length,
            failedModules: user.moduleAttempts.filter(a => !a.passed).length,
            averageScore: user.moduleAttempts.length > 0 ? user.moduleAttempts.reduce((acc, a) => acc + a.score, 0) / user.moduleAttempts.length : 0,
            totalTimeSpent: user.moduleAttempts.reduce((acc, a) => acc + (a.timeSpent || 0), 0),
            attempts: attemptsWithDetails
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
        const result = await prisma.user.deleteMany({ where: { id: { in: userIds }, role: 'TRAINEE' } });
        res.json({ success: true, count: result.count });
    } catch (error) {
        res.status(500).json({ error: 'Delete failed' });
    }
});

app.post('/api/admin/batch-generate-codes', async (req, res) => {
    const { students, trainingRoute = 'FULL_ACCESS', selectedModules = [] } = req.body;
    const results = [];
    for (const student of students) {
        try {
            const email = generateEmail(student.surname, student.firstName);
            const selectedModulesJson = trainingRoute === 'CUSTOMIZED_01' ? JSON.stringify(selectedModules) : null;
            const existingUser = await prisma.user.findUnique({ where: { email: email } });
            let finalEmail = email;
            if (existingUser) {
                let counter = 1;
                let found = false;
                while (!found && counter < 100) {
                    const testEmail = student.surname.toLowerCase() + student.firstName.charAt(0).toLowerCase() + counter + "@coht.co.uk";
                    const checkUser = await prisma.user.findUnique({ where: { email: testEmail } });
                    if (!checkUser) { finalEmail = testEmail; found = true; break; }
                    counter++;
                }
                if (!found) continue;
            }
            await prisma.user.upsert({
                where: { email: finalEmail },
                update: { trainingRoute: trainingRoute, selectedModules: selectedModulesJson, phone: student.phone || '' },
                create: {
                    email: finalEmail, name: student.firstName + ' ' + student.surname,
                    role: 'TRAINEE', trainingRoute: trainingRoute,
                    selectedModules: selectedModulesJson, phone: student.phone || '',
                    practicalModules: JSON.stringify({})
                }
            });
            await prisma.loginCode.deleteMany({ where: { email: finalEmail } });
            const code = generateCode();
            const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
            await prisma.loginCode.create({ data: { email: finalEmail, code: code, expiresAt: expiresAt } });
            results.push({ name: student.firstName + ' ' + student.surname, email: finalEmail, code: code });
        } catch (e) {
            console.error('Error generating code:', e.message);
        }
    }
    res.json({ success: true, codes: results, count: results.length });
});

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
                data: { email: email, name: email.split('@')[0], role: 'TRAINEE', trainingRoute: 'FULL_ACCESS', practicalModules: JSON.stringify({}) }
            });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Verification failed' });
    }
});

app.post('/api/admin/update-student-modules/:id', async (req, res) => {
    const { id } = req.params;
    const { selectedModules } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { id: id } });
        if (!user) return res.status(404).json({ error: 'Student not found' });
        const updatedUser = await prisma.user.update({
            where: { id: id },
            data: { selectedModules: JSON.stringify(selectedModules) }
        });
        res.json({ success: true, message: 'Modules updated successfully', selectedModules: selectedModules, user: updatedUser });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update student modules: ' + error.message });
    }
});


// ═══════════════════════════════════════════════════════════════════
// Discovery Form — public intake + admin view + CSV export
// ═══════════════════════════════════════════════════════════════════

app.post('/api/discovery', async (req, res) => {
    const {
        firstName, lastName, phone, email, addressTown, country,
        courseAppliedFor, firstCourse, sourceChannel, bookingMethod,
        reasonForChoice, priorExperience, experienceRating, futurePlans,
        comments, consentGiven
    } = req.body;

    if (!firstName || !lastName || !phone) {
        return res.status(400).json({ error: 'First name, last name, and phone are required' });
    }
    if (!consentGiven) {
        return res.status(400).json({ error: 'Consent is required to submit this form' });
    }
    if (!/^\+44\d{10}$/.test(phone)) {
        return res.status(400).json({ error: 'Phone must start with +44 and have 10 digits' });
    }

    try {
        const year = new Date().getFullYear();
        const result = await prisma.$queryRaw`
            INSERT INTO "DiscoveryForm" (
                id, "learnerId", "firstName", "lastName", phone, email,
                "addressTown", country, "courseAppliedFor", "firstCourse",
                "sourceChannel", "bookingMethod", "reasonForChoice",
                "priorExperience", "experienceRating", "futurePlans", comments,
                "consentGiven", "consentDate", "submittedVia", "updatedAt"
            ) VALUES (
                gen_random_uuid()::text,
                'COHT-' || ${year}::text || '-' || LPAD((
                    SELECT COALESCE(MAX(
                        CASE WHEN "learnerId" LIKE 'COHT-' || ${year}::text || '-%'
                             THEN SUBSTRING("learnerId" FROM 11)::int ELSE 0 END
                    ), 0) + 1
                    FROM "DiscoveryForm"
                )::text, 4, '0'),
                ${firstName}, ${lastName}, ${phone}, ${email || null},
                ${addressTown || null}, ${country || 'UK'},
                ${courseAppliedFor || null}, ${firstCourse || false},
                ${sourceChannel || null}, ${bookingMethod || null},
                ${reasonForChoice || null}, ${priorExperience || null},
                ${experienceRating || null}, ${futurePlans || null},
                ${comments || null}, ${consentGiven}, NOW(), 'digital', NOW()
            )
            RETURNING "learnerId"
        `;
        res.json({ success: true, learnerId: result[0].learnerId });
    } catch (err) {
        console.error('Discovery form submission error:', err);
        res.status(500).json({ error: 'Submission failed. Please try again.' });
    }
});

app.get('/api/admin/discovery', async (req, res) => {
    try {
        const rows = await prisma.discoveryForm.findMany({
            orderBy: { createdAt: 'desc' },
        });
        res.json(rows);
    } catch (err) {
        console.error('Discovery form fetch error:', err);
        res.status(500).json({ error: 'Failed to fetch discovery forms' });
    }
});

app.get('/api/admin/discovery/export', async (req, res) => {
    try {
        const rows = await prisma.discoveryForm.findMany({
            orderBy: { createdAt: 'asc' },
        });
        const headers = [
            'learner_id', 'first_name', 'last_name', 'phone', 'email', 'address_town',
            'country', 'course_applied_for', 'first_course', 'source_channel',
            'booking_method', 'reason_for_choice', 'prior_experience',
            'experience_rating', 'future_plans', 'comments', 'consent_given',
            'consent_date', 'submitted_via', 'created_at'
        ];
        const escape = v => v == null ? '' : `"${String(v).replace(/"/g, '""')}"`;
        const csv = [
            headers.join(','),
            ...rows.map(r => [
                r.learnerId, r.firstName, r.lastName, r.phone, r.email,
                r.addressTown, r.country, r.courseAppliedFor, r.firstCourse,
                r.sourceChannel, r.bookingMethod, r.reasonForChoice,
                r.priorExperience, r.experienceRating, r.futurePlans, r.comments,
                r.consentGiven, r.consentDate ? r.consentDate.toISOString() : '',
                r.submittedVia, r.createdAt.toISOString()
            ].map(escape).join(','))
        ].join('\n');
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition',
            `attachment; filename="discovery-${new Date().toISOString().slice(0,10)}.csv"`);
        res.send(csv);
    } catch (err) {
        console.error('Discovery CSV export error:', err);
        res.status(500).json({ error: 'Export failed' });
    }
});



// ═══════════════════════════════════════════════════════════════════
// Risk Log — public submission + admin view + CSV export
// ═══════════════════════════════════════════════════════════════════

app.post('/api/risk-log', async (req, res) => {
    const { area, description, likelihood, impact, owner, mitigation } = req.body;

    if (!area || !description || !likelihood || !impact || !owner) {
        return res.status(400).json({ error: 'Area, description, likelihood, impact, and owner are required' });
    }

    try {
        // Atomic Risk ID: RISK-NNN
        const result = await prisma.$queryRaw`
            INSERT INTO "RiskLog" (
                id, "riskId", "area", description, likelihood, impact, owner, mitigation, status, "updatedAt"
            ) VALUES (
                gen_random_uuid()::text,
                'RISK-' || LPAD((
                    SELECT COALESCE(MAX(
                        CASE WHEN "riskId" LIKE 'RISK-%'
                             THEN SUBSTRING("riskId" FROM 6)::int ELSE 0 END
                    ), 0) + 1
                    FROM "RiskLog"
                )::text, 3, '0'),
                ${area}, ${description}, ${likelihood}, ${impact}, ${owner}, ${mitigation || null}, 'Open', NOW()
            )
            RETURNING "riskId"
        `;
        res.json({ success: true, riskId: result[0].riskId });
    } catch (err) {
        console.error('Risk log submission error:', err);
        res.status(500).json({ error: 'Submission failed. Please try again.' });
    }
});

app.get('/api/admin/risk-log', async (req, res) => {
    try {
        const rows = await prisma.riskLog.findMany({ orderBy: { dateRaised: 'desc' } });
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch risk log' });
    }
});

app.get('/api/admin/risk-log/export', async (req, res) => {
    try {
        const rows = await prisma.riskLog.findMany({ orderBy: { dateRaised: 'asc' } });
        const headers = ['risk_id','date_raised','area','description','likelihood','impact','owner','mitigation','status','date_closed','resolution_notes'];
        const escape = v => v == null ? '' : `"${String(v).replace(/"/g, '""')}"`;
        const csv = [
            headers.join(','),
            ...rows.map(r => [
                r.riskId, r.dateRaised.toISOString(), r.area, r.description,
                r.likelihood, r.impact, r.owner, r.mitigation, r.status,
                r.dateClosed ? r.dateClosed.toISOString() : '', r.resolutionNotes
            ].map(escape).join(','))
        ].join('\n');
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="risk-log-${new Date().toISOString().slice(0,10)}.csv"`);
        res.send(csv);
    } catch (err) {
        res.status(500).json({ error: 'Export failed' });
    }
});



// ═══════════════════════════════════════════════════════════════════
// Attendance Record (v2 - trainer friendly)
// ═══════════════════════════════════════════════════════════════════

app.post('/api/attendance', async (req, res) => {
    const { learnerName, learnerPhone, courseName, trainerName, sessionDate, arrivalTime, departureTime, lateFlag, lateReason, noShowFlag, trainerNotes } = req.body;
    
    if (!learnerName || !courseName || !sessionDate) {
        return res.status(400).json({ error: 'Learner Name, Course Name, and Session Date are required' });
    }

    try {
        let hoursAttended = null;
        if (arrivalTime && departureTime) {
            const arr = new Date(`1970-01-01T${arrivalTime}:00`);
            const dep = new Date(`1970-01-01T${departureTime}:00`);
            if (dep > arr) hoursAttended = (dep - arr) / (1000 * 60 * 60);
        }

        const result = await prisma.$queryRaw`
            INSERT INTO "AttendanceRecord" (
                id, "attendanceId", "learnerName", "learnerPhone", "courseName", "trainerName", 
                "sessionDate", "arrivalTime", "departureTime", "hoursAttended", 
                "lateFlag", "lateReason", "noShowFlag", "trainerNotes", "updatedAt"
            ) VALUES (
                gen_random_uuid()::text,
                'ATT-' || LPAD((
                    SELECT COALESCE(MAX(CASE WHEN "attendanceId" LIKE 'ATT-%' THEN SUBSTRING("attendanceId" FROM 5)::int ELSE 0 END), 0) + 1 FROM "AttendanceRecord"
                )::text, 4, '0'),
                ${learnerName}, ${learnerPhone || ''}, ${courseName}, ${trainerName || ''},
                ${new Date(sessionDate)}, ${arrivalTime || null}, ${departureTime || null}, ${hoursAttended},
                ${lateFlag || false}, ${lateReason || null}, ${noShowFlag || false}, ${trainerNotes || null}, NOW()
            )
            RETURNING "attendanceId"
        `;
        res.json({ success: true, attendanceId: result[0].attendanceId });
    } catch (err) {
        console.error('Attendance error:', err);
        res.status(500).json({ error: 'Failed to save attendance' });
    }
});

app.get('/api/admin/attendance', async (req, res) => {
    const { start, end, course } = req.query;
    try {
        let where = {};
        if (start && end) where.sessionDate = { gte: new Date(start), lte: new Date(end) };
        if (course) where.courseName = course;
        
        const rows = await prisma.attendanceRecord.findMany({ where, orderBy: { sessionDate: 'desc' } });
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch attendance' });
    }
});

app.get('/api/admin/attendance/export', async (req, res) => {
    const { start, end } = req.query;
    try {
        let where = {};
        if (start && end) where.sessionDate = { gte: new Date(start), lte: new Date(end) };
        
        const rows = await prisma.attendanceRecord.findMany({ where, orderBy: { sessionDate: 'desc' } });
        const headers = ['attendance_id','learner_name','learner_phone','course_name','trainer_name','session_date','arrival_time','departure_time','hours_attended','late_flag','late_reason','no_show_flag','trainer_notes'];
        const escape = v => v == null ? '' : `"${String(v).replace(/"/g, '""')}"`;
        
        const csv = [
            headers.join(','),
            ...rows.map(r => [
                r.attendanceId, r.learnerName, r.learnerPhone, r.courseName, r.trainerName, r.sessionDate.toISOString().slice(0,10),
                r.arrivalTime, r.departureTime, r.hoursAttended, r.lateFlag, r.lateReason, r.noShowFlag, r.trainerNotes
            ].map(escape).join(','))
        ].join('\n');
        
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="attendance-${start || 'all'}.csv"`);
        res.send(csv);
    } catch (err) {
        res.status(500).json({ error: 'Export failed' });
    }
});

// ═══════════════════════════════════════════════════════════════════
// FAQ Entry
// ═══════════════════════════════════════════════════════════════════

app.post('/api/faq', async (req, res) => {
    const { question, courseId, frequency, answer, addedBy } = req.body;
    if (!question || !answer || !addedBy) {
        return res.status(400).json({ error: 'Question, Answer, and Added By are required' });
    }
    try {
        const result = await prisma.$queryRaw`
            INSERT INTO "FAQEntry" (
                id, "faqId", question, "courseId", frequency, answer, "addedBy", "updatedAt"
            ) VALUES (
                gen_random_uuid()::text,
                'FAQ-' || LPAD((
                    SELECT COALESCE(MAX(CASE WHEN "faqId" LIKE 'FAQ-%' THEN SUBSTRING("faqId" FROM 5)::int ELSE 0 END), 0) + 1 FROM "FAQEntry"
                )::text, 4, '0'),
                ${question}, ${courseId || null}, ${frequency || 'Occasional'}, ${answer}, ${addedBy}, NOW()
            )
            RETURNING "faqId"
        `;
        res.json({ success: true, faqId: result[0].faqId });
    } catch (err) {
        res.status(500).json({ error: 'Failed to save FAQ' });
    }
});

app.get('/api/admin/faq/export', async (req, res) => {
    try {
        const rows = await prisma.fAQEntry.findMany({ orderBy: { createdAt: 'desc' } });
        const headers = ['faq_id','question','course_id','frequency','answer','added_by','publish_ready','created_at'];
        const escape = v => v == null ? '' : `"${String(v).replace(/"/g, '""')}"`;
        const csv = [
            headers.join(','),
            ...rows.map(r => [
                r.faqId, r.question, r.courseId, r.frequency, r.answer, r.addedBy, r.publishReady, r.createdAt.toISOString()
            ].map(escape).join(','))
        ].join('\n');
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="faq-${new Date().toISOString().slice(0,10)}.csv"`);
        res.send(csv);
    } catch (err) {
        res.status(500).json({ error: 'Export failed' });
    }
});



// ═══════════════════════════════════════════════════════════════════
// Courses (CRUD)
// ═══════════════════════════════════════════════════════════════════

app.get('/api/courses', async (req, res) => {
    try {
        const courses = await prisma.course.findMany({
            where: { active: true },
            orderBy: { title: 'asc' }
        });
        res.json(courses);
    } catch (err) {
        console.error('Course fetch error:', err);
        res.status(500).json({ error: 'Failed to fetch courses' });
    }
});

app.post('/api/admin/courses', async (req, res) => {
    const { title, type, description } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });
    try {
        const result = await prisma.$queryRaw`
            INSERT INTO "Course" (id, "courseId", title, type, description, "updatedAt")
            VALUES (
                gen_random_uuid()::text,
                'CRS-' || LPAD((
                    SELECT COALESCE(MAX(CASE WHEN "courseId" LIKE 'CRS-%' THEN SUBSTRING("courseId" FROM 5)::int ELSE 0 END), 0) + 1 FROM "Course"
                )::text, 3, '0'),
                ${title}, ${type || 'Short Course'}, ${description || null}, NOW()
            )
            RETURNING "courseId"
        `;
        res.json({ success: true, courseId: result[0].courseId });
    } catch (err) {
        console.error('Course create error:', err);
        res.status(500).json({ error: 'Failed to save course' });
    }
});

app.delete('/api/admin/courses/:id', async (req, res) => {
    try {
        await prisma.course.update({ where: { id: req.params.id }, data: { active: false } });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete course' });
    }
});


app.listen(PORT, '0.0.0.0', () => {
    console.log('Backend running on port ' + PORT);
});
