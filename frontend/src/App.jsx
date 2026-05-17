import React, { useState, useEffect } from 'react';
import { 
  LogOut, BookOpen, FileText, ChevronLeft, ChevronRight, Target, 
  CheckCircle, AlertCircle, Users, TrendingUp, Shield, Mail, Key,
  Eye, EyeOff, Plus, Trash2, Copy, Printer, Download, Search,
  GraduationCap, CheckSquare, Square, X, Clock, Award, Calendar,
  UserCheck, FileSpreadsheet, BarChart3, AlertTriangle
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

// Generate Accreditation Report with Full Details
const generateFullReport = (student, attempts) => {
  const reportWindow = window.open('', '_blank');
  const passedModules = attempts.filter(a => a.passed).length;
  const totalScore = attempts.reduce((sum, a) => sum + (a.score || 0), 0);
  const totalPossible = attempts.reduce((sum, a) => sum + (a.total || 20), 0);
  const overallPercentage = totalPossible > 0 ? (totalScore / totalPossible * 100).toFixed(1) : 0;
  
  let tableRows = '';
  for (const a of attempts) {
    tableRows += `
      <tr>
        <td>${a.module?.name || 'Unknown Module'}</td>
        <td>${a.score}/${a.total || 20}</td>
        <td>15/20 (75%)</td>
        <td class="${a.passed ? 'passed' : 'failed'}">${a.passed ? 'PASSED' : 'FAILED'}</td>
        <td>${new Date(a.completedAt).toLocaleDateString()}</td>
      </tr>
    `;
  }
  
  reportWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Accreditation Report - ${student.name || student.email}</title>
      <meta charset="UTF-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Arial, sans-serif;
          background: white;
          padding: 40px;
          color: #1a1a2e;
        }
        .report-container { max-width: 1000px; margin: 0 auto; }
        .header {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 12px;
          margin-bottom: 30px;
        }
        .header h1 { font-size: 28px; margin-bottom: 8px; }
        .header p { font-size: 14px; opacity: 0.9; }
        .section {
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          margin-bottom: 25px;
          overflow: hidden;
        }
        .section-title {
          background: #f1f5f9;
          padding: 12px 20px;
          font-weight: bold;
          border-bottom: 2px solid #3b82f6;
        }
        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          padding: 20px;
          background: #f8fafc;
        }
        .info-item { display: flex; gap: 10px; }
        .info-label { font-weight: 600; color: #475569; min-width: 120px; }
        .info-value { color: #1e293b; }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          padding: 20px;
        }
        .stat-card {
          text-align: center;
          padding: 20px;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }
        .stat-number { font-size: 32px; font-weight: bold; color: #3b82f6; }
        .stat-label { font-size: 12px; color: #64748b; margin-top: 8px; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #334155; color: white; padding: 12px; text-align: left; font-size: 13px; }
        td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
        .passed { color: #10b981; font-weight: bold; }
        .failed { color: #ef4444; font-weight: bold; }
        .footer { 
          margin-top: 40px; 
          text-align: center; 
          border-top: 1px solid #e2e8f0; 
          padding-top: 20px;
        }
        .signature-line {
          display: flex;
          justify-content: space-between;
          margin-top: 40px;
          padding: 0 40px;
        }
        .signature { text-align: center; }
        .signature hr { width: 200px; margin: 10px auto; border: 1px solid #cbd5e1; }
        @media print {
          body { padding: 20px; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="report-container">
        <div class="header">
          <h1>🏥 CareWorks Training Academy</h1>
          <p>Official Accreditation Document</p>
          <p style="font-size: 12px; margin-top: 10px;">Generated: ${new Date().toLocaleString()}</p>
        </div>
        
        <div class="section">
          <div class="section-title">Trainee Information</div>
          <div class="info-grid">
            <div class="info-item"><span class="info-label">Full Name:</span><span class="info-value">${student.name || student.email}</span></div>
            <div class="info-item"><span class="info-label">Email:</span><span class="info-value">${student.email}</span></div>
            <div class="info-item"><span class="info-label">Organisation:</span><span class="info-value">CareWorks Training</span></div>
            <div class="info-item"><span class="info-label">Member Since:</span><span class="info-value">${new Date(student.createdAt || Date.now()).toLocaleDateString()}</span></div>
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">Performance Summary</div>
          <div class="stats-grid">
            <div class="stat-card"><div class="stat-number">${attempts.length}</div><div class="stat-label">Total Attempts</div></div>
            <div class="stat-card"><div class="stat-number">${passedModules}</div><div class="stat-label">Modules Passed</div></div>
            <div class="stat-card"><div class="stat-number">${attempts.length - passedModules}</div><div class="stat-label">Modules Failed</div></div>
            <div class="stat-card"><div class="stat-number">${overallPercentage}%</div><div class="stat-label">Overall Score</div></div>
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">Module Results</div>
          <table>
            <thead>
              <tr><th>Module</th><th>Score</th><th>Pass Mark</th><th>Status</th><th>Date</th></tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </div>
        
        <div class="footer">
          <p>This is an official accreditation document</p>
          <div class="signature-line">
            <div class="signature"><hr /><p>Assessor Signature</p></div>
            <div class="signature"><hr /><p>Date</p></div>
            <div class="signature"><hr /><p>Stamp</p></div>
          </div>
          <p style="margin-top: 20px; font-size: 11px;">Document ID: ${Date.now()}-${(student.id || 'NEW').slice(0, 8)}</p>
        </div>
      </div>
      <div class="no-print" style="text-align: center; margin-top: 20px;">
        <button onclick="window.print()" style="padding: 12px 32px; background: #3b82f6; color: white; border: none; border-radius: 8px; cursor: pointer; margin: 0 10px;">🖨️ Print / Save as PDF</button>
        <button onclick="window.close()" style="padding: 12px 32px; background: #64748b; color: white; border: none; border-radius: 8px; cursor: pointer;">Close</button>
      </div>
    </body>
    </html>
  `);
  reportWindow.document.close();
};

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [loginType, setLoginType] = useState('trainee');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [userProgress, setUserProgress] = useState({ progress: [], attempts: [] });

  const [allStudents, setAllStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [studentBatch, setStudentBatch] = useState([{ surname: '', firstName: '' }]);
  const [generatedCodes, setGeneratedCodes] = useState([]);
  const [showCodes, setShowCodes] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [bulkDeleteConfirmText, setBulkDeleteConfirmText] = useState('');
  const [trainingRoute, setTrainingRoute] = useState('FULL_22');
  const [selectedCustomModules, setSelectedCustomModules] = useState([]);
  const [allModulesList, setAllModulesList] = useState([]);

  const fetchModules = async () => {
    try {
      const res = await fetch(`${API_URL}/api/modules`);
      const data = await res.json();
      setModules(Array.isArray(data) ? data : []);
    } catch (err) {
      setModules([]);
    }
  };

  const fetchAllModulesForSelection = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/modules`);
      const data = await res.json();
      setAllModulesList(Array.isArray(data) ? data : []);
    } catch (err) {
      setAllModulesList([]);
    }
  };

  const fetchAllStudents = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/students`);
      const data = await res.json();
      setAllStudents(Array.isArray(data) ? data : []);
      setFilteredStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      setAllStudents([]);
      setFilteredStudents([]);
    }
  };

  const fetchUserProgress = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/user/${id}/progress`);
      const data = await res.json();
      setUserProgress(data);
    } catch (err) {
      setUserProgress({ progress: [], attempts: [] });
    }
  };

  useEffect(() => {
    if (searchTerm) {
      setFilteredStudents(allStudents.filter(s => 
        (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    } else {
      setFilteredStudents(allStudents);
    }
  }, [searchTerm, allStudents]);

  useEffect(() => {
    setSelectedStudents([]);
    setSelectAll(false);
  }, [allStudents]);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/api/auth/admin-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
        setUser({ ...data, role: 'ADMIN' });
        fetchModules();
        fetchAllStudents();
        fetchAllModulesForSelection();
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Cannot connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleTraineeLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/api/auth/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });
      const data = await response.json();
      if (response.ok) {
        setUser({ ...data, role: 'TRAINEE' });
        fetchModules();
        fetchUserProgress(data.id);
      } else {
        setError(data.error || 'Invalid or expired code');
      }
    } catch (err) {
      setError('Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const startModule = async (module) => {
    try {
      const res = await fetch(`${API_URL}/api/modules/${module.id}`);
      const data = await res.json();
      setSelectedModule(data);
      setAnswers({});
      setCurrentQuestion(0);
      setShowResults(false);
      setResult(null);
      setStartTime(Date.now());
    } catch (err) {
      setError('Failed to load module');
    }
  };

  const submitAssessment = async () => {
    setLoading(true);
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    try {
      const response = await fetch(`${API_URL}/api/modules/${selectedModule.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, answers, timeSpent })
      });
      const data = await response.json();
      setResult(data);
      setShowResults(true);
      fetchUserProgress(user.id);
    } catch (err) {
      setError('Submission failed');
    } finally {
      setLoading(false);
    }
  };

  const getStatus = (id) => {
    if (user?.role !== 'TRAINEE') return 'available';
    const p = userProgress.progress?.find(x => x.moduleId === id);
    if (p?.status === 'passed') return 'completed';
    if (id === 1) return 'available';
    const prev = userProgress.progress?.find(x => x.moduleId === id - 1);
    if (prev?.status === 'passed') return 'available';
    return 'locked';
  };

  const batchGenerateCodes = async () => {
    const validStudents = studentBatch.filter(s => s.surname.trim() && s.firstName.trim());
    if (validStudents.length === 0) {
      setError('Please add at least one student');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/batch-generate-codes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ students: validStudents, trainingRoute, selectedModules: trainingRoute === 'CUSTOM' ? selectedCustomModules : [] })
      });
      const data = await response.json();
      if (response.ok) {
        setGeneratedCodes(data.codes);
        setShowCodes(true);
        setSuccess(`Successfully generated ${data.count} login codes!`);
        fetchAllStudents();
        setStudentBatch([{ surname: '', firstName: '' }]);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to generate codes');
      }
    } catch (err) {
      setError('Failed to generate codes');
    } finally {
      setLoading(false);
    }
  };

  const addStudentField = () => {
    if (studentBatch.length < 20) {
      setStudentBatch([...studentBatch, { surname: '', firstName: '' }]);
    }
  };

  const removeStudentField = (index) => {
    const newBatch = studentBatch.filter((_, i) => i !== index);
    setStudentBatch(newBatch.length ? newBatch : [{ surname: '', firstName: '' }]);
  };

  const updateStudent = (index, field, value) => {
    const newBatch = [...studentBatch];
    newBatch[index][field] = value;
    setStudentBatch(newBatch);
  };

  const copyAllCodes = () => {
    const codesText = generatedCodes.map(c => `${c.name}: ${c.code}`).join('\n');
    navigator.clipboard.writeText(codesText);
    setSuccess('All codes copied to clipboard!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const toggleModuleSelection = (moduleId) => {
    setSelectedCustomModules(prev => 
      prev.includes(moduleId) ? prev.filter(id => id !== moduleId) : [...prev, moduleId]
    );
  };

  const deleteUser = async () => {
    if (deleteConfirmText !== 'DELETE') {
      setError('Please type DELETE to confirm');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/delete-user/${deleteUserId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setSuccess('Student deleted successfully');
        fetchAllStudents();
        setShowDeleteConfirm(false);
        setDeleteUserId(null);
        setDeleteConfirmText('');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete user');
      }
    } catch (err) {
      setError('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const bulkDeleteUsers = async () => {
    if (bulkDeleteConfirmText !== 'DELETE') {
      setError('Please type DELETE to confirm bulk deletion');
      return;
    }
    if (selectedStudents.length === 0) {
      setError('No students selected');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/bulk-delete-users`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIds: selectedStudents })
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess(`Successfully deleted ${data.count} students`);
        setSelectedStudents([]);
        setSelectAll(false);
        fetchAllStudents();
        setShowBulkDeleteConfirm(false);
        setBulkDeleteConfirmText('');
      } else {
        setError(data.error || 'Failed to delete users');
      }
    } catch (err) {
      setError('Failed to delete users');
    } finally {
      setLoading(false);
    }
  };

  const toggleStudentSelection = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) ? prev.filter(id => id !== studentId) : [...prev, studentId]
    );
    setSelectAll(false);
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedStudents([]);
      setSelectAll(false);
    } else {
      const allIds = filteredStudents.map(s => s.id);
      setSelectedStudents(allIds);
      setSelectAll(true);
    }
  };

  // Login Screen
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-lg max-w-md w-full p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="text-white w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">CareWorks Training</h1>
            <p className="text-slate-500 text-sm mt-1">Assessment Portal</p>
          </div>
          
          <div className="flex gap-2 mb-6 bg-slate-100 rounded-lg p-1">
            <button onClick={() => { setLoginType('admin'); setError(''); setCode(''); setEmail(''); setPassword(''); }} 
              className={`flex-1 py-2 rounded-md text-sm font-medium transition ${loginType === 'admin' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>
              Admin
            </button>
            <button onClick={() => { setLoginType('trainee'); setError(''); setCode(''); setEmail(''); setPassword(''); }} 
              className={`flex-1 py-2 rounded-md text-sm font-medium transition ${loginType === 'trainee' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>
              Trainee
            </button>
          </div>
          
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}
          
          {loginType === 'admin' ? (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="admin@careworks.com" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" required />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-2.5 rounded-lg font-semibold hover:bg-slate-800 transition">
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleTraineeLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="your.email@dsca.co.uk" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">6-Digit Code</label>
                <input type="text" value={code} onChange={e => setCode(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg text-center tracking-widest font-mono text-xl" placeholder="000000" maxLength="6" required />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition">
                {loading ? 'Verifying...' : 'Access Training'}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Assessment Screen
  if (selectedModule && !showResults) {
    const questions = selectedModule.questions || [];
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200 sticky top-0 z-10 px-6 py-4 flex justify-between items-center">
          <button onClick={() => setSelectedModule(null)} className="text-slate-600 hover:text-slate-900">← Back</button>
          <span className="text-sm font-medium">{user.name || user.email}</span>
        </div>
        <div className="max-w-2xl mx-auto p-6">
          <div className="bg-white rounded-xl border border-slate-200 p-8">
            <div className="mb-6">
              <span className="text-sm text-slate-400">Question {currentQuestion + 1} of {questions.length}</span>
              <h3 className="text-xl font-medium text-slate-900 mt-2">{questions[currentQuestion]?.text}</h3>
            </div>
            <div className="space-y-3">
              {questions[currentQuestion]?.options?.map((opt, idx) => (
                <label key={idx} className={`flex items-center p-4 border-2 rounded-xl cursor-pointer ${answers[currentQuestion] === idx ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200'}`}>
                  <input type="radio" checked={answers[currentQuestion] === idx} onChange={() => setAnswers({...answers, [currentQuestion]: idx})} className="w-4 h-4 text-indigo-600" />
                  <span className="ml-3">{opt}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-between mt-8">
              <button disabled={currentQuestion === 0} onClick={() => setCurrentQuestion(v => v - 1)} className="text-slate-500 disabled:opacity-30">Previous</button>
              {currentQuestion < questions.length - 1 ? (
                <button disabled={answers[currentQuestion] === undefined} onClick={() => setCurrentQuestion(v => v + 1)} className="px-6 py-2 bg-slate-900 text-white rounded-lg">Next</button>
              ) : (
                <button disabled={Object.keys(answers).length < questions.length} onClick={submitAssessment} className="px-6 py-2 bg-green-600 text-white rounded-lg">Submit</button>
              )}
            </div>
            <div className="mt-4 text-center text-sm text-slate-400">Answered: {Object.keys(answers).length}/{questions.length}</div>
          </div>
        </div>
      </div>
    );
  }

  if (showResults && result) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl border border-slate-200 p-8 max-w-md text-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${result.passed ? 'bg-green-100' : 'bg-red-100'}`}>
            {result.passed ? <CheckCircle className="w-10 h-10 text-green-600" /> : <AlertCircle className="w-10 h-10 text-red-600" />}
          </div>
          <h2 className="text-2xl font-bold mb-2">{result.passed ? 'Passed!' : 'Completed'}</h2>
          <p className="text-slate-600 mb-4">Score: {result.score}/{result.total}</p>
          <button onClick={() => { setSelectedModule(null); setShowResults(false); }} className="px-6 py-2 bg-slate-900 text-white rounded-lg">Return to Dashboard</button>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  if (user.role !== 'TRAINEE') {
    const totalStudents = allStudents.length;
    const totalAttempts = allStudents.reduce((acc, s) => acc + (s.moduleAttempts?.length || 0), 0);
    const totalPassed = allStudents.reduce((acc, s) => acc + (s.moduleAttempts?.filter(a => a.passed).length || 0), 0);
    const passRate = totalAttempts > 0 ? Math.round(totalPassed / totalAttempts * 100) : 0;

    return (
      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200 sticky top-0 z-10 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center"><Shield className="w-5 h-5 text-white" /></div>
            <div><h1 className="font-bold">CareWorks Admin</h1><p className="text-xs text-slate-500">{user.email}</p></div>
          </div>
          <button onClick={() => setUser(null)} className="text-red-600 text-sm">Logout</button>
        </div>
        
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex gap-4 mb-6 border-b">
            <button onClick={() => setActiveTab('dashboard')} className={`pb-2 px-1 ${activeTab === 'dashboard' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500'}`}>Dashboard</button>
            <button onClick={() => { setActiveTab('generate'); setShowCodes(false); }} className={`pb-2 px-1 ${activeTab === 'generate' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500'}`}>Generate Codes</button>
            <button onClick={() => setActiveTab('students')} className={`pb-2 px-1 ${activeTab === 'students' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500'}`}>Students</button>
          </div>
          
          {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4">{error}</div>}
          {success && <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg mb-4">{success}</div>}
          
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <div className="bg-white rounded-lg border p-5"><div className="text-2xl font-bold">{totalStudents}</div><div className="text-sm text-slate-500">Students</div></div>
              <div className="bg-white rounded-lg border p-5"><div className="text-2xl font-bold">{modules.length}</div><div className="text-sm text-slate-500">Modules</div></div>
              <div className="bg-white rounded-lg border p-5"><div className="text-2xl font-bold">{totalAttempts}</div><div className="text-sm text-slate-500">Attempts</div></div>
              <div className="bg-white rounded-lg border p-5"><div className="text-2xl font-bold">{totalPassed}</div><div className="text-sm text-slate-500">Passed</div><div className="text-xs text-slate-400 mt-1">Pass Rate: {passRate}%</div></div>
            </div>
          )}
          
          {activeTab === 'generate' && (
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-bold mb-4">Generate Login Codes</h2>
              <p className="text-sm text-slate-500 mb-4">Format: <strong>Surname.Initial@dsca.co.uk</strong></p>
              
              <div className="space-y-3 mb-4">
                {studentBatch.map((student, idx) => (
                  <div key={idx} className="flex gap-3">
                    <input type="text" placeholder="Surname" value={student.surname} onChange={e => updateStudent(idx, 'surname', e.target.value)} className="flex-1 px-4 py-2 border rounded-lg" />
                    <input type="text" placeholder="First Name" value={student.firstName} onChange={e => updateStudent(idx, 'firstName', e.target.value)} className="flex-1 px-4 py-2 border rounded-lg" />
                    {studentBatch.length > 1 && <button onClick={() => removeStudentField(idx)} className="p-2 text-red-500">✕</button>}
                  </div>
                ))}
              </div>
              
              <div className="flex gap-3">
                <button onClick={addStudentField} disabled={studentBatch.length >= 20} className="px-4 py-2 border rounded-lg text-sm">+ Add ({studentBatch.length}/20)</button>
                <button onClick={batchGenerateCodes} disabled={loading} className="px-6 py-2 bg-slate-900 text-white rounded-lg text-sm">Generate Codes</button>
              </div>
              
              {showCodes && generatedCodes.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <div className="flex justify-between items-center mb-4"><h3 className="font-semibold">Credentials</h3><button onClick={copyAllCodes} className="px-3 py-1 text-sm border rounded-lg">Copy All</button></div>
                  <table className="w-full text-sm"><thead><tr className="bg-slate-50"><th className="p-2">Name</th><th>Email</th><th>Code</th></tr></thead>
                  <tbody>{generatedCodes.map((s, idx) => (<tr key={idx} className="border-t"><td className="p-2">{s.name}</td><td>{s.email}</td><td><code className="bg-slate-100 px-2 py-1 rounded">{s.code}</code></td></tr>))}</tbody></table>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'students' && (
            <div className="bg-white rounded-lg border overflow-hidden">
              {selectedStudents.length > 0 && (
                <div className="bg-indigo-50 border-b border-indigo-200 px-4 py-3 flex justify-between items-center">
                  <div className="flex items-center gap-3"><CheckSquare className="w-5 h-5 text-indigo-600" /><span className="text-sm text-indigo-800">{selectedStudents.length} student(s) selected</span></div>
                  <button onClick={() => setShowBulkDeleteConfirm(true)} className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"><Trash2 size={16} /> Delete Selected</button>
                </div>
              )}
              
              <div className="p-4 border-b flex justify-between items-center">
                <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type="text" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border rounded-lg w-64" /></div>
                <div className="flex items-center gap-4"><button onClick={toggleSelectAll} className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800">{selectAll ? <CheckSquare size={16} /> : <Square size={16} />}{selectAll ? 'Deselect All' : 'Select All'}</button><div className="text-sm text-slate-500">{filteredStudents.length} students</div></div>
              </div>
              
              <table className="w-full"><thead className="bg-slate-50"><tr><th className="p-4 w-10"><input type="checkbox" checked={selectAll} onChange={toggleSelectAll} className="w-4 h-4 text-indigo-600 rounded" /></th><th className="p-4 text-left">Name</th><th className="p-4 text-left">Email</th><th className="p-4 text-left">Attempts</th><th className="p-4 text-left">Passed</th><th className="p-4 text-left">Actions</th></tr></thead>
              <tbody>{filteredStudents.map(s => (<tr key={s.id} className="border-t hover:bg-slate-50"><td className="p-4"><input type="checkbox" checked={selectedStudents.includes(s.id)} onChange={() => toggleStudentSelection(s.id)} className="w-4 h-4 text-indigo-600 rounded" /></td><td className="p-4 text-slate-900">{s.name || '-'}</td><td className="p-4 text-slate-600 text-sm">{s.email}</td><td className="p-4 text-slate-600">{s.moduleAttempts?.length || 0}</td><td className="p-4 text-slate-600">{s.moduleAttempts?.filter(a => a.passed).length || 0}</td><td className="p-4"><div className="flex gap-2"><button onClick={() => generateFullReport(s, s.moduleAttempts || [])} className="text-indigo-600 text-sm hover:underline flex items-center gap-1"><FileSpreadsheet size={14} /> Report</button><button onClick={() => { setDeleteUserId(s.id); setShowDeleteConfirm(true); }} className="text-red-600 text-sm hover:underline flex items-center gap-1"><Trash2 size={14} /> Delete</button></div></td></tr>))}</tbody></table>
            </div>
          )}
          
          {/* Single Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl max-w-md w-full p-6">
                <div className="flex items-center gap-3 text-red-600 mb-4"><AlertTriangle className="w-8 h-8" /><h3 className="text-xl font-bold">Delete Student</h3></div>
                <p className="text-slate-600 mb-4">This action cannot be undone. Type <strong className="font-mono bg-slate-100 px-1">DELETE</strong> to confirm:</p>
                <input type="text" value={deleteConfirmText} onChange={(e) => setDeleteConfirmText(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-4 font-mono" placeholder="DELETE" />
                <div className="flex gap-3"><button onClick={deleteUser} disabled={deleteConfirmText !== 'DELETE'} className="flex-1 bg-red-600 text-white py-2 rounded-lg disabled:opacity-50 hover:bg-red-700 transition">Delete</button><button onClick={() => { setShowDeleteConfirm(false); setDeleteUserId(null); setDeleteConfirmText(''); }} className="flex-1 bg-slate-200 text-slate-700 py-2 rounded-lg hover:bg-slate-300 transition">Cancel</button></div>
              </div>
            </div>
          )}
          
          {/* Bulk Delete Confirmation Modal */}
          {showBulkDeleteConfirm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl max-w-md w-full p-6">
                <div className="flex items-center gap-3 text-red-600 mb-4"><AlertTriangle className="w-8 h-8" /><h3 className="text-xl font-bold">Bulk Delete Students</h3></div>
                <p className="text-slate-600 mb-2">You are about to delete <strong>{selectedStudents.length}</strong> student(s).</p>
                <p className="text-slate-600 mb-4">Type <strong className="font-mono bg-slate-100 px-1">DELETE</strong> to confirm:</p>
                <input type="text" value={bulkDeleteConfirmText} onChange={(e) => setBulkDeleteConfirmText(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-4 font-mono" placeholder="DELETE" />
                <div className="flex gap-3"><button onClick={bulkDeleteUsers} disabled={bulkDeleteConfirmText !== 'DELETE'} className="flex-1 bg-red-600 text-white py-2 rounded-lg disabled:opacity-50 hover:bg-red-700 transition">Delete All</button><button onClick={() => { setShowBulkDeleteConfirm(false); setBulkDeleteConfirmText(''); }} className="flex-1 bg-slate-200 text-slate-700 py-2 rounded-lg hover:bg-slate-300 transition">Cancel</button></div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Trainee Dashboard
  const stats = {
    total: modules.length,
    completed: userProgress.progress?.filter(p => p.status === 'passed').length || 0,
    inProgress: userProgress.progress?.filter(p => p.status === 'failed').length || 0,
    locked: modules.length - (userProgress.progress?.length || 0)
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3"><div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center"><BookOpen className="w-5 h-5 text-white" /></div><div><h1 className="font-bold">CareWorks Training</h1><p className="text-xs text-slate-500">Trainee</p></div></div>
        <button onClick={() => setUser(null)} className="text-red-600 text-sm">Logout</button>
      </div>
      
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-xl p-6 mb-8 text-white"><h2 className="text-xl font-bold mb-1">Welcome back, {user.name || 'Trainee'}!</h2><p className="text-indigo-100">Continue your mandatory training assessments.</p></div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-lg border p-5"><div className="flex justify-between items-start mb-2"><div className="p-2 bg-blue-100 rounded-lg"><FileText className="w-5 h-5 text-blue-600" /></div><span className="text-2xl font-bold text-slate-900">{stats.total}</span></div><p className="text-sm text-slate-500">Total Modules</p></div>
          <div className="bg-white rounded-lg border p-5"><div className="flex justify-between items-start mb-2"><div className="p-2 bg-green-100 rounded-lg"><CheckCircle className="w-5 h-5 text-green-600" /></div><span className="text-2xl font-bold text-slate-900">{stats.completed}</span></div><p className="text-sm text-slate-500">Completed</p></div>
          <div className="bg-white rounded-lg border p-5"><div className="flex justify-between items-start mb-2"><div className="p-2 bg-yellow-100 rounded-lg"><TrendingUp className="w-5 h-5 text-yellow-600" /></div><span className="text-2xl font-bold text-slate-900">{stats.inProgress}</span></div><p className="text-sm text-slate-500">In Progress</p></div>
          <div className="bg-white rounded-lg border p-5"><div className="flex justify-between items-start mb-2"><div className="p-2 bg-slate-100 rounded-lg"><Shield className="w-5 h-5 text-slate-600" /></div><span className="text-2xl font-bold text-slate-900">{stats.locked}</span></div><p className="text-sm text-slate-500">Locked</p></div>
        </div>
        
        <h2 className="text-lg font-bold text-slate-900 mb-4">Training Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map(m => {
            const status = getStatus(m.id);
            return (
              <div key={m.id} className={`bg-white rounded-lg border p-5 transition-all ${status !== 'locked' ? 'cursor-pointer hover:shadow-md hover:border-indigo-300' : 'opacity-60'}`} onClick={() => status !== 'locked' && startModule(m)}>
                <div className="flex justify-between items-start mb-3"><div className={`p-2 rounded-lg ${status === 'completed' ? 'bg-green-100' : status === 'available' ? 'bg-indigo-100' : 'bg-slate-100'}`}><FileText className={`w-5 h-5 ${status === 'completed' ? 'text-green-600' : status === 'available' ? 'text-indigo-600' : 'text-slate-400'}`} /></div><span className={`text-xs px-2 py-1 rounded-full font-medium ${status === 'completed' ? 'bg-green-100 text-green-700' : status === 'available' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>{status === 'completed' ? 'Completed' : status === 'available' ? 'Available' : 'Locked'}</span></div>
                <h3 className="font-semibold text-slate-900 mb-1">{m.name}</h3>
                <div className="flex items-center gap-2 text-xs text-slate-400"><Target size={12} /><span>Pass: {m.passMark}/{m.questionCount || 20} (75%)</span></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
