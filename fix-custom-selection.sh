#!/bin/bash

# Fix the Backend API (Correcting the syntax error and ensuring custom module logic)
cat << 'BACKEND_EOF' > backend/api/index.js
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

app.get('/api/health', (req, res) => res.json({ status: 'healthy', timestamp: new Date().toISOString() }));

app.post('/api/auth/admin-login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || user.role !== 'ADMIN') return res.status(401).json({ error: 'Unauthorized' });
        const validPasswords = { 'admin@careworks.com': 'Admin@2025', 'director@careworks.com': 'Director@2025' };
        if (validPasswords[email] !== password) return res.status(401).json({ error: 'Invalid credentials' });
        res.json(user);
    } catch (error) { res.status(500).json({ error: 'Login failed' }); }
});

app.post('/api/admin/batch-generate-codes', async (req, res) => {
    const { students, trainingRoute = 'FULL_22', selectedModules = [] } = req.body;
    const results = [];
    for (const student of students) {
        try {
            const email = generateEmail(student.surname, student.firstName);
            let user = await prisma.user.upsert({
                where: { email },
                update: { trainingRoute, selectedModules: trainingRoute === 'CUSTOM' ? selectedModules : null },
                create: { email, name: `${student.firstName} ${student.surname}`, role: 'TRAINEE', trainingRoute, selectedModules: trainingRoute === 'CUSTOM' ? selectedModules : null }
            });
            await prisma.loginCode.deleteMany({ where: { email } });
            const code = generateCode();
            const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
            await prisma.loginCode.create({ data: { email, code, expiresAt } });
            results.push({ name: user.name, email, code });
        } catch (e) { console.error(e); }
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
        const modules = await prisma.module.findMany({ orderBy: { id: 'asc' } });
        res.json(modules);
    } catch (error) { res.status(500).json({ error: 'Failed to fetch modules' }); }
});

app.get('/api/user/:userId/export', async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.params.userId },
            include: { moduleAttempts: { include: { module: true }, orderBy: { completedAt: 'desc' } } }
        });
        if (!user) return res.status(404).json({ error: 'User not found' });
        const summary = {
            user: { id: user.id, name: user.name, email: user.email, role: user.role, joinedAt: user.createdAt },
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

app.post('/api/auth/verify-code', async (req, res) => {
    const { email, code } = req.body;
    try {
        const loginCode = await prisma.loginCode.findFirst({
            where: { email, code, expiresAt: { gt: new Date() } },
            orderBy: { createdAt: 'desc' }
        });
        if (!loginCode) return res.status(401).json({ error: 'Invalid or expired code' });
        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) user = await prisma.user.create({ data: { email, name: email.split('@')[0], role: 'TRAINEE' } });
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
            } else { modules = await prisma.module.findMany({ orderBy: { id: 'asc' } }); }
        } else { modules = await prisma.module.findMany({ orderBy: { id: 'asc' } }); }
        res.json(modules);
    } catch (error) { res.status(500).json({ error: 'Fetch failed' }); }
});

app.post('/api/modules/:id/submit', async (req, res) => {
    const { userId, answers, timeSpent } = req.body;
    const moduleId = parseInt(req.params.id);
    try {
        const module = await prisma.module.findUnique({ where: { id: moduleId } });
        let score = 0;
        module.questions.forEach((q, i) => { if (answers[i] === q.correct) score++; });
        const passed = score >= 15;
        await prisma.moduleAttempt.create({ data: { userId, moduleId, score, passed, answers, timeSpent, completedAt: new Date() } });
        await prisma.moduleProgress.upsert({
            where: { userId_moduleId: { userId, moduleId } },
            update: { status: passed ? 'passed' : 'failed', score, attempts: { increment: 1 } },
            create: { userId, moduleId, status: passed ? 'passed' : 'failed', score, attempts: 1 }
        });
        res.json({ score, passed, total: module.questions.length, passMark: 15 });
    } catch (error) { res.status(500).json({ error: 'Submit failed' }); }
});

app.listen(3002, () => console.log('Backend running on port 3002'));
BACKEND_EOF

# Fix the Frontend App.jsx
cat << 'FRONTEND_EOF' > frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import {
  LogOut, BookOpen, FileText, ChevronLeft, ChevronRight, Target, CheckCircle, AlertCircle,
  Users, TrendingUp, Shield, Mail, Key, Eye, EyeOff, Plus, Trash2, Copy, Printer, Download,
  Search, GraduationCap, CheckSquare, Square, X, Clock, Award, Calendar, UserCheck,
  FileSpreadsheet, BarChart3, AlertTriangle, Zap, PlayCircle, Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';

const API_URL = 'http://localhost:3002';

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [loginType, setLoginType] = useState('trainee');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState(null);
  const [userProgress, setUserProgress] = useState({ progress: [], attempts: [] });
  const [allStudents, setAllStudents] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [trainingRoute, setTrainingRoute] = useState('FULL_22');
  const [selectedCustomModules, setSelectedCustomModules] = useState([]);
  const [allModulesList, setAllModulesList] = useState([]);

  const fetchModules = async (userId = null) => {
    try {
      const url = userId ? `${API_URL}/api/modules?userId=${userId}` : `${API_URL}/api/modules`;
      const res = await fetch(url);
      setModules(await res.json());
    } catch (err) { setModules([]); }
  };

  const handleTraineeLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });
      const data = await response.json();
      if (response.ok) {
        setUser({ ...data, role: 'TRAINEE' });
        fetchModules(data.id);
      } else { setError(data.error); }
    } catch { setError('Verification failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {!user ? (
        <div className="flex items-center justify-center p-6 min-h-screen">
          <div className="bg-white border p-10 rounded-2xl shadow-xl w-full max-w-md">
            <h1 className="text-2xl font-bold text-center mb-8">CareWorks Assessor</h1>
            <form onSubmit={handleTraineeLogin} className="space-y-4">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 border rounded-xl" placeholder="Email" required />
              <input type="text" value={code} onChange={e => setCode(e.target.value)} className="w-full px-4 py-3 border rounded-xl text-center font-mono" placeholder="000000" required />
              <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold">Access Portal</button>
            </form>
          </div>
        </div>
      ) : (
        <div className="p-8">
          <nav className="flex justify-between mb-8"><h1 className="font-bold text-lg">CareWorks</h1><button onClick={() => setUser(null)} className="text-red-500 font-bold">Logout</button></nav>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map(m => (
              <div key={m.id} className="bg-white border p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <h3 className="font-bold">{m.name}</h3>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
FRONTEND_EOF

echo "✅ Files updated. Syntax error in backend fixed and custom module logic applied."
