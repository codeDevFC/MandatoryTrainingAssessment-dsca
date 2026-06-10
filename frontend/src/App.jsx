import React, { useState, useEffect } from 'react';
import { 
  LogOut, BookOpen, FileText, ChevronLeft, ChevronRight, Target, CheckCircle, AlertCircle, 
  Users, TrendingUp, Shield, Mail, Key, Eye, EyeOff, Plus, Trash2, Copy, Printer, Download, 
  Search, GraduationCap, CheckSquare, Square, X, Clock, Award, Calendar, UserCheck, 
  FileSpreadsheet, BarChart3, AlertTriangle, Zap, PlayCircle, Lock 
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://dsca-backend.onrender.com';

function App() {
  // Auth state
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [loginType, setLoginType] = useState('trainee');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Module state
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [userProgress, setUserProgress] = useState({ progress: [], attempts: [] });

  // Admin state
  const [allStudents, setAllStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [studentBatch, setStudentBatch] = useState([{ surname: '', firstName: '' }]);
  const [generatedCodes, setGeneratedCodes] = useState([]);
  const [showCodes, setShowCodes] = useState(false);
  const [trainingRoute, setTrainingRoute] = useState('FULL_22');
  const [selectedCustomModules, setSelectedCustomModules] = useState([]);
  const [allModulesList, setAllModulesList] = useState([]);

  // Selection state for bulk delete
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [bulkDeleteConfirmText, setBulkDeleteConfirmText] = useState('');

  // Report modal state
  const [reportData, setReportData] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);

  // ====== FETCH FUNCTIONS ======
  const fetchModules = async (userId = null) => {
    try {
      const url = userId ? `${API_URL}/api/modules?userId=${userId}` : `${API_URL}/api/modules`;
      const res = await fetch(url);
      const data = await res.json();
      setModules(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Fetch modules error:', err);
      setModules([]);
    }
  };

  const fetchAllModulesForSelection = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/modules`);
      const data = await res.json();
      setAllModulesList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Fetch modules selection error:', err);
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
      console.error('Fetch students error:', err);
      setAllStudents([]);
      setFilteredStudents([]);
    }
  };

  const fetchUserProgress = async (userId) => {
    try {
      const res = await fetch(`${API_URL}/api/user/${userId}/progress`);
      const data = await res.json();
      setUserProgress({ progress: data.progress || [], attempts: data.attempts || [] });
    } catch (err) {
      console.error('Fetch progress error:', err);
      setUserProgress({ progress: [], attempts: [] });
    }
  };

  // ============ LOGIN HANDLERS ============
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
        await fetchModules(data.id);
        await fetchUserProgress(data.id);
      } else {
        setError(data.error || 'Invalid or expired code');
      }
    } catch (err) {
      setError('Verification failed');
    } finally {
      setLoading(false);
    }
  };

  // ======== MODULE ASSESSMENT ========
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
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/modules/${selectedModule.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, answers, timeSpent })
      });
      const data = await response.json();
      setResult(data);
      setShowResults(true);
      if (user.role === 'TRAINEE') {
        fetchUserProgress(user.id);
      } else {
        fetchAllStudents();
      }
    } catch (err) {
      setError('Submission failed');
    } finally {
      setLoading(false);
    }
  };

  const getModuleStatus = (moduleId) => {
    if (user?.role !== 'TRAINEE') return 'available';
    const p = userProgress.progress?.find(x => x.moduleId === moduleId);
    if (p?.status === 'passed') return 'completed';
    if (moduleId === 1) return 'available';
    const prev = userProgress.progress?.find(x => x.moduleId === moduleId - 1);
    if (prev?.status === 'passed') return 'available';
    return 'locked';
  };

  // ============ ADMIN: BATCH CODE GENERATION ============
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
        body: JSON.stringify({ 
          students: validStudents, 
          trainingRoute, 
          selectedModules: trainingRoute === 'CUSTOM' ? selectedCustomModules : [] 
        }),
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

  const toggleModuleSelection = (moduleId) => {
    setSelectedCustomModules(prev =>
      prev.includes(moduleId) ? prev.filter(id => id !== moduleId) : [...prev, moduleId]
    );
  };

  const copyAllCodes = () => {
    const codesText = generatedCodes.map(c => `${c.name}: ${c.code}`).join('\n');
    navigator.clipboard.writeText(codesText);
    setSuccess('All codes copied to clipboard!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const printCodes = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head><title>Student Login Codes</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #4f46e5; color: white; }
      </style>
      </head>
      <body>
        <h1>Student Login Credentials</h1>
        <p>Generated on ${new Date().toLocaleString()}</p>
        <table><thead><tr><th>Name</th><th>Email</th><th>Code</th></tr></thead>
        <tbody>${generatedCodes.map(c => `<tr><td>${c.name}</td><td>${c.email}</td><td>${c.code}</td></tr>`).join('')}</tbody>
       </>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // ====== ADMIN: DELETE STUDENTS ======
  const deleteUser = async () => {
    if (deleteConfirmText !== 'DELETE') {
      setError('Please type DELETE to confirm');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/delete-user/${deleteUserId}`, { method: 'DELETE' });
      if (response.ok) {
        setSuccess('Student deleted successfully');
        fetchAllStudents();
        setShowDeleteConfirm(false);
        setDeleteUserId(null);
        setDeleteConfirmText('');
        setSelectedStudents([]);
        setSelectAll(false);
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

  // ============ ADMIN: GENERATE REPORT ============
  const generateFullReport = async (student) => {
    setReportLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/user/${student.id}/export`);
      const data = await res.json();
      setReportData(data);
      setShowReportModal(true);
    } catch (err) {
      setError('Failed to generate report');
    } finally {
      setReportLoading(false);
    }
  };

  const printReport = () => {
    if (!reportData) return;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head><title>Assessment Report</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .header { background: #1e293b; color: white; padding: 20px; text-align: center; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #4f46e5; color: white; }
        .passed { color: green; font-weight: bold; }
        .failed { color: red; font-weight: bold; }
      </style>
      </head>
      <body>
        <div class="header"><h1>Assessment Report</h1><p>${new Date().toLocaleString()}</p></div>
        <h3>Student: ${reportData.user?.name || reportData.user?.email}</h3>
        <p>Total Attempts: ${reportData.totalAttempts || 0}</p>
        <p>Passed Modules: ${reportData.passedModules || 0}</p>
        <p>Failed Modules: ${reportData.failedModules || 0}</p>
        <table><thead><tr><th>Module</th><th>Score</th><th>Status</th><th>Date</th></tr></thead>
        <tbody>${(reportData.attempts || []).map(a => `<tr><td>${a.module?.name}</td><td>${a.score}/20</td><td class="${a.passed ? 'passed' : 'failed'}">${a.passed ? 'PASSED' : 'FAILED'}</td><td>${new Date(a.completedAt).toLocaleString()}</td></tr>`).join('')}</tbody>
       </>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // Filter students on search
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

  // ============ LOGIN SCREEN ============
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl max-w-md w-full p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="text-white w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">CareWorks Training</h1>
            <p className="text-slate-500 text-sm mt-1">Assessment Portal</p>
          </div>
          <div className="flex gap-2 mb-6 bg-slate-100 rounded-xl p-1">
            <button onClick={() => { setLoginType('admin'); setError(''); setCode(''); setEmail(''); setPassword(''); }} 
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${loginType === 'admin' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>Admin</button>
            <button onClick={() => { setLoginType('trainee'); setError(''); setCode(''); setEmail(''); setPassword(''); }} 
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${loginType === 'trainee' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>Trainee</button>
          </div>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}
          {loginType === 'admin' ? (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} 
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                placeholder="admin@careworks.com" required />
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} 
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                placeholder="Password" required />
              <button type="submit" disabled={loading} 
                className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition">
                {loading ? 'Logging in...' : 'Login as Admin'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleTraineeLogin} className="space-y-4">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} 
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                placeholder="your.email@dsca.co.uk" required />
              <input type="text" value={code} onChange={e => setCode(e.target.value)} 
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-center tracking-widest font-mono text-xl" 
                placeholder="000000" maxLength="6" required />
              <button type="submit" disabled={loading} 
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition">
                {loading ? 'Verifying...' : 'Access Training'}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // ============ ASSESSMENT SCREEN ============
  if (selectedModule && !showResults) {
    const questions = selectedModule.questions || [];
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200 sticky top-0 z-10 px-6 py-4 flex justify-between items-center">
          <button onClick={() => setSelectedModule(null)} className="text-slate-600 hover:text-slate-900">← Back to Dashboard</button>
          <div className="flex items-center gap-3">
            <Clock size={16} className="text-slate-400" />
            <span className="text-sm text-slate-500">{Math.floor((Date.now() - startTime) / 1000)}s</span>
            <span className="text-sm font-medium text-slate-700">{user.name || user.email}</span>
          </div>
        </div>
        <div className="max-w-3xl mx-auto p-6">
          <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-400">Question {currentQuestion + 1} of {questions.length}</span>
                <span className="text-sm text-slate-400">Answered: {Object.keys(answers).length}/{questions.length}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full transition-all duration-300" style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }}></div>
              </div>
              <h3 className="text-xl font-medium text-slate-900 mt-4">{questions[currentQuestion]?.text}</h3>
            </div>
            <div className="space-y-3">
              {questions[currentQuestion]?.options?.map((opt, idx) => (
                <label key={idx} className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${answers[currentQuestion] === idx ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}>
                  <input type="radio" checked={answers[currentQuestion] === idx} onChange={() => setAnswers({...answers, [currentQuestion]: idx})} className="w-4 h-4 text-indigo-600" />
                  <span className="ml-3 text-slate-700">{opt}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-between mt-8">
              <button disabled={currentQuestion === 0} onClick={() => setCurrentQuestion(v => v - 1)} className="px-6 py-2 text-slate-600 disabled:opacity-30 hover:text-slate-800 transition">← Previous</button>
              {currentQuestion < questions.length - 1 ? (
                <button disabled={answers[currentQuestion] === undefined} onClick={() => setCurrentQuestion(v => v + 1)} className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition">Next →</button>
              ) : (
                <button disabled={Object.keys(answers).length < questions.length || loading} onClick={submitAssessment} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50">
                  {loading ? 'Submitting...' : 'Submit Assessment'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showResults && result) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl border border-slate-200 p-8 max-w-md text-center shadow-lg">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${result.passed ? 'bg-green-100' : 'bg-red-100'}`}>
            {result.passed ? <CheckCircle className="w-12 h-12 text-green-600" /> : <AlertCircle className="w-12 h-12 text-red-600" />}
          </div>
          <h2 className="text-2xl font-bold mb-2">{result.passed ? 'Congratulations! 🎉' : 'Not This Time ❌'}</h2>
          <p className="text-slate-600 mb-4">You scored <strong className="text-2xl">{result.score}</strong> out of <strong>{result.total}</strong></p>
          <button onClick={() => { setSelectedModule(null); setShowResults(false); fetchUserProgress(user.id); }} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">Return to Dashboard</button>
        </div>
      </div>
    );
  }

  // ============ ADMIN DASHBOARD ============
  if (user.role !== 'TRAINEE') {
    const totalStudents = allStudents.length;
    const totalAttempts = allStudents.reduce((acc, s) => acc + (s.moduleAttempts?.length || 0), 0);
    const totalPassed = allStudents.reduce((acc, s) => acc + (s.moduleAttempts?.filter(a => a.passed).length || 0), 0);
    const passRate = totalAttempts > 0 ? Math.round((totalPassed / totalAttempts) * 100) : 0;
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200 sticky top-0 z-10 px-6 py-4 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center shadow-md"><Shield className="w-5 h-5 text-white" /></div>
            <div><h1 className="font-bold text-slate-800">CareWorks Admin Portal</h1><p className="text-xs text-slate-500">{user.email}</p></div>
          </div>
          <button onClick={() => setUser(null)} className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition">Logout</button>
        </div>
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex gap-2 mb-6 border-b">
            <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-2 text-sm font-medium transition-all ${activeTab === 'dashboard' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>📊 Dashboard</button>
            <button onClick={() => { setActiveTab('generate'); setShowCodes(false); }} className={`px-4 py-2 text-sm font-medium transition-all ${activeTab === 'generate' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>🎫 Generate Codes</button>
            <button onClick={() => setActiveTab('students')} className={`px-4 py-2 text-sm font-medium transition-all ${activeTab === 'students' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>👥 Students</button>
          </div>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4">{error}</div>}
          {success && <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg mb-4">{success}</div>}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <div className="bg-white rounded-xl border p-6 shadow-sm"><div className="text-2xl font-bold">{totalStudents}</div><p className="text-sm text-gray-500">Total Students</p></div>
              <div className="bg-white rounded-xl border p-6 shadow-sm"><div className="text-2xl font-bold">{modules.length}</div><p className="text-sm text-gray-500">Total Modules</p></div>
              <div className="bg-white rounded-xl border p-6 shadow-sm"><div className="text-2xl font-bold">{totalAttempts}</div><p className="text-sm text-gray-500">Total Attempts</p></div>
              <div className="bg-white rounded-xl border p-6 shadow-sm"><div className="text-2xl font-bold">{passRate}%</div><p className="text-sm text-gray-500">Pass Rate</p></div>
            </div>
          )}
          {activeTab === 'generate' && (
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">🎫 Batch Login Code Generation</h2>
              <div className="mb-6 p-4 bg-slate-50 rounded-lg border">
                <label className="block font-semibold text-gray-700 mb-3">Access Level:</label>
                <div className="flex gap-6 mb-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="trainingRoute" value="FULL_22" checked={trainingRoute === 'FULL_22'} onChange={() => { setTrainingRoute('FULL_22'); setSelectedCustomModules([]); }} className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm font-medium">✅ Full Access (All Modules)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="trainingRoute" value="CUSTOM" checked={trainingRoute === 'CUSTOM'} onChange={() => setTrainingRoute('CUSTOM')} className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm font-medium">🔧 Custom Selection</span>
                  </label>
                </div>
                {trainingRoute === 'CUSTOM' && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-600 mb-2">Select modules for this batch:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto p-2 border rounded-lg bg-white">
                      {allModulesList.map(module => (
                        <label key={module.id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-slate-50 p-1 rounded">
                          <input type="checkbox" checked={selectedCustomModules.includes(module.id)} onChange={() => toggleModuleSelection(module.id)} className="w-4 h-4 text-indigo-600 rounded" />
                          <span>{module.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <p className="text-sm text-slate-500 mb-4">Email format: <strong className="font-mono bg-slate-100 px-2 py-1 rounded">Surname.Initial@dsca.co.uk</strong></p>
              <div className="space-y-3 mb-4">
                {studentBatch.map((student, idx) => (
                  <div key={idx} className="flex gap-3">
                    <input type="text" placeholder="Surname" value={student.surname} onChange={e => updateStudent(idx, 'surname', e.target.value)} className="flex-1 px-4 py-2 border rounded-lg" />
                    <input type="text" placeholder="First Name" value={student.firstName} onChange={e => updateStudent(idx, 'firstName', e.target.value)} className="flex-1 px-4 py-2 border rounded-lg" />
                    {studentBatch.length > 1 && <button onClick={() => removeStudentField(idx)} className="p-2 text-red-500">🗑️</button>}
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={addStudentField} disabled={studentBatch.length >= 20} className="px-4 py-2 border rounded-lg text-sm disabled:opacity-50">+ Add ({studentBatch.length}/20)</button>
                <button onClick={batchGenerateCodes} disabled={loading} className="px-6 py-2 bg-slate-900 text-white rounded-lg text-sm">Generate Codes</button>
              </div>
              {showCodes && generatedCodes.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <div className="flex justify-between items-center mb-4"><h3 className="font-semibold">Generated Credentials</h3><div className="flex gap-2"><button onClick={copyAllCodes} className="px-3 py-1 text-sm border rounded-lg">📋 Copy All</button><button onClick={printCodes} className="px-3 py-1 text-sm border rounded-lg">🖨️ Print</button></div></div>
                  <table className="w-full text-sm"><thead><tr className="bg-slate-50"><th className="p-2 text-left">Name</th><th className="p-2 text-left">Email</th><th className="p-2 text-left">Code</th></tr></thead><tbody>{generatedCodes.map((s, idx) => <tr key={idx} className="border-t"><td className="p-2">{s.name}</td><td className="p-2">{s.email}</td><td className="p-2"><code className="bg-slate-100 px-2 py-1 rounded">{s.code}</code></td></tr>)}</tbody></table>
                </div>
              )}
            </div>
          )}
          {activeTab === 'students' && (
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
              {selectedStudents.length > 0 && (
                <div className="bg-indigo-50 border-b border-indigo-200 px-4 py-3 flex justify-between items-center">
                  <div className="flex items-center gap-3"><CheckSquare className="w-5 h-5 text-indigo-600" /><span className="text-sm text-indigo-800">{selectedStudents.length} student(s) selected</span></div>
                  <button onClick={() => setShowBulkDeleteConfirm(true)} className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"><Trash2 size={16} /> Delete Selected</button>
                </div>
              )}
              <div className="p-4 border-b flex justify-between items-center flex-wrap gap-2">
                <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type="text" placeholder="Search students..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border rounded-lg w-64" /></div>
                <div className="flex items-center gap-4"><button onClick={toggleSelectAll} className="flex items-center gap-2 text-sm text-slate-600">{selectAll ? 'Deselect All' : 'Select All'}</button><span className="text-sm text-slate-500">{filteredStudents.length} students</span></div>
              </div>
              <table className="w-full"><thead className="bg-slate-50 border-b"><tr><th className="p-4 w-10"><input type="checkbox" checked={selectAll} onChange={toggleSelectAll} /></th><th className="p-4 text-left">Name</th><th className="p-4 text-left">Email</th><th className="p-4 text-left">Attempts</th><th className="p-4 text-left">Passed</th><th className="p-4 text-left">Actions</th></tr></thead>
              <tbody>{filteredStudents.map(student => (<tr key={student.id} className="hover:bg-slate-50 transition"><td className="p-4"><input type="checkbox" checked={selectedStudents.includes(student.id)} onChange={() => toggleStudentSelection(student.id)} /></td><td className="p-4">{student.name || '-'}</td><td className="p-4 text-sm">{student.email}</td><td className="p-4">{student.moduleAttempts?.length || 0}</td><td className="p-4">{student.moduleAttempts?.filter(a => a.passed).length || 0}</td><td className="p-4"><button onClick={() => generateFullReport(student)} className="text-indigo-600 text-sm hover:underline">Report</button><button onClick={() => { setDeleteUserId(student.id); setShowDeleteConfirm(true); }} className="text-red-600 text-sm hover:underline ml-2">Delete</button></td></tr>))}</tbody></table>
            </div>
          )}
        </div>
        {showDeleteConfirm && (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-2xl max-w-md w-full p-6"><h3 className="text-xl font-bold mb-4">Delete Student</h3><p>Type DELETE to confirm:</p><input type="text" value={deleteConfirmText} onChange={e => setDeleteConfirmText(e.target.value)} className="w-full border rounded p-2 my-2" placeholder="DELETE" /><button onClick={deleteUser} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button><button onClick={() => setShowDeleteConfirm(false)} className="ml-2 px-4 py-2 border rounded">Cancel</button></div></div>)}
        {showBulkDeleteConfirm && (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-2xl max-w-md w-full p-6"><h3 className="text-xl font-bold mb-4">Bulk Delete Students</h3><p>Delete {selectedStudents.length} student(s). Type DELETE to confirm:</p><input type="text" value={bulkDeleteConfirmText} onChange={e => setBulkDeleteConfirmText(e.target.value)} className="w-full border rounded p-2 my-2" placeholder="DELETE" /><button onClick={bulkDeleteUsers} className="bg-red-600 text-white px-4 py-2 rounded">Delete All</button><button onClick={() => setShowBulkDeleteConfirm(false)} className="ml-2 px-4 py-2 border rounded">Cancel</button></div></div>)}
        {showReportModal && reportData && (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6"><h3 className="text-xl font-bold mb-4">Student Assessment Report</h3><pre className="text-sm">{JSON.stringify(reportData, null, 2)}</pre><button onClick={printReport} className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded">Print Report</button><button onClick={() => setShowReportModal(false)} className="ml-2 px-4 py-2 border rounded">Close</button></div></div>)}
      </div>
    );
  }

  // ============ TRAINEE DASHBOARD ============
  const stats = {
    total: modules.length,
    completed: userProgress.progress?.filter(p => p.status === 'passed').length || 0,
    inProgress: userProgress.progress?.filter(p => p.status === 'failed').length || 0,
    locked: modules.length - (userProgress.progress?.length || 0)
  };
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-md"><BookOpen className="w-5 h-5 text-white" /></div>
          <div><h1 className="font-bold text-slate-800">CareWorks Training</h1><p className="text-xs text-slate-500">Trainee Dashboard</p></div>
        </div>
        <button onClick={() => setUser(null)} className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition">Logout</button>
      </div>
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-xl p-6 mb-8 text-white shadow-lg">
          <h2 className="text-2xl font-bold mb-1">Welcome back, {user.name || 'Trainee'}! 🎉</h2>
          <p className="text-indigo-100">Complete your mandatory training assessments</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-xl border p-5 shadow-sm"><div className="text-2xl font-bold text-indigo-600">{stats.total}</div><p className="text-sm text-slate-500">Total Modules</p></div>
          <div className="bg-white rounded-xl border p-5 shadow-sm"><div className="text-2xl font-bold text-green-600">{stats.completed}</div><p className="text-sm text-slate-500">Completed ✅</p></div>
          <div className="bg-white rounded-xl border p-5 shadow-sm"><div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div><p className="text-sm text-slate-500">In Progress</p></div>
          <div className="bg-white rounded-xl border p-5 shadow-sm"><div className="text-2xl font-bold text-slate-400">{stats.locked}</div><p className="text-sm text-slate-500">Locked 🔒</p></div>
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">📚 Your Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map(m => {
            const status = getModuleStatus(m.id);
            return (
              <div key={m.id} className="bg-white rounded-xl border p-5 transition-all cursor-pointer hover:shadow-lg hover:scale-[1.02]">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded">#{m.id}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${status === 'completed' ? 'bg-green-100 text-green-700' : status === 'available' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                        {status === 'completed' ? '✅ Completed' : status === 'available' ? 'Available' : '🔒 Locked'}
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-1">{m.name}</h3>
                    <p className="text-xs text-slate-500">Pass mark: {m.passMark}/20 (75%)</p>
                  </div>
                  {status === 'completed' && <CheckCircle className="text-green-500 w-5 h-5 flex-shrink-0" />}
                  {status === 'available' && <PlayCircle className="text-blue-500 w-5 h-5 flex-shrink-0" />}
                  {status === 'locked' && <Lock className="text-gray-400 w-5 h-5 flex-shrink-0" />}
                </div>
                {status === 'available' && (
                  <button onClick={() => startModule(m)} className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-2 rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition text-sm font-medium shadow-sm">
                    Start Module →
                  </button>
                )}
                {status === 'locked' && (
                  <button disabled className="w-full mt-4 bg-gray-100 text-gray-400 py-2 rounded-lg text-sm font-medium cursor-not-allowed">
                    🔒 Complete Previous Module First
                  </button>
                )}
                {status === 'completed' && (
                  <div className="w-full mt-4 bg-green-50 text-green-600 py-2 rounded-lg text-sm font-medium text-center flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Completed
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
