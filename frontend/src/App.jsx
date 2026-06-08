import React, { useState, useEffect } from 'react';
import {
  LogOut, BookOpen, FileText, ChevronLeft, ChevronRight,
  Target, CheckCircle, AlertCircle, Users, TrendingUp,
  Shield, Mail, Key, Eye, EyeOff, Plus, Trash2, Copy,
  Printer, Download, Search, GraduationCap, CheckSquare,
  Square, X, Clock, Award, Calendar, UserCheck,
  FileSpreadsheet, BarChart3, AlertTriangle, Zap,
  PlayCircle, Lock, CreditCard, Send, MessageCircle,
  UserPlus, UserCheckIcon, Filter, Eye as EyeIcon,
  RefreshCw, AlertTriangle as AlertTriangleIcon
} from 'lucide-react';

const API_URL = 'http://localhost:3002';

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [loginType, setLoginType] = useState('admin');
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
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [studentBatch, setStudentBatch] = useState([{ surname: '', firstName: '', phone: '' }]);
  const [generatedCodes, setGeneratedCodes] = useState([]);
  const [showCodes, setShowCodes] = useState(false);
  const [trainingRoute, setTrainingRoute] = useState('FULL_22');
  const [selectedCustomModules, setSelectedCustomModules] = useState([]);
  const [allModulesList, setAllModulesList] = useState([]);
  
  const [registeredStudents, setRegisteredStudents] = useState([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [bulkPaymentFilter, setBulkPaymentFilter] = useState('confirmed');
  
  const [showStudentDetails, setShowStudentDetails] = useState(false);
  const [selectedStudentDetails, setSelectedStudentDetails] = useState(null);
  const [resendingCode, setResendingCode] = useState(false);
  const [generatingSingleCode, setGeneratingSingleCode] = useState(false);
  
  const [studentRoutes, setStudentRoutes] = useState({});
  const [studentCustomModules, setStudentCustomModules] = useState({});
  const [showModulePicker, setShowModulePicker] = useState(false);
  const [currentPickerStudent, setCurrentPickerStudent] = useState(null);

  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [bulkDeleteConfirmText, setBulkDeleteConfirmText] = useState('');

  const [reportData, setReportData] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);

  const fetchModules = async (userId = null) => {
    try {
      const url = userId ? `${API_URL}/api/modules?userId=${userId}` : `${API_URL}/api/modules`;
      const res = await fetch(url);
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
      applyFilters(data, searchTerm, paymentFilter);
    } catch (err) {
      setAllStudents([]);
      setFilteredStudents([]);
    }
  };

  const fetchRegisteredStudents = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/all-students-with-status`);
      const data = await res.json();
      setRegisteredStudents(Array.isArray(data) ? data : []);
      const routes = {};
      const customMods = {};
      data.forEach(student => {
        routes[student.id] = 'FULL_22';
        customMods[student.id] = [];
      });
      setStudentRoutes(routes);
      setStudentCustomModules(customMods);
    } catch (err) {
      setRegisteredStudents([]);
    }
  };

  const applyFilters = (students, term, filter) => {
    let filtered = [...students];
    if (term) {
      filtered = filtered.filter(s =>
        (s.name || '').toLowerCase().includes(term.toLowerCase()) ||
        (s.email || '').toLowerCase().includes(term.toLowerCase()) ||
        (s.phone || '').includes(term)
      );
    }
    if (filter === 'confirmed') {
      filtered = filtered.filter(s => s.paymentConfirmed === true);
    } else if (filter === 'pending') {
      filtered = filtered.filter(s => s.paymentConfirmed === false);
    }
    setFilteredStudents(filtered);
  };

  const fetchStudentFullDetails = async (studentId) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/student-full-details/${studentId}`);
      const data = await res.json();
      setSelectedStudentDetails(data);
      setShowStudentDetails(true);
    } catch (err) {
      setError('Failed to fetch student details');
    }
  };

  const confirmPayment = async (studentId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/confirm-payment/${studentId}`, { method: 'POST' });
      if (response.ok) {
        setSuccess('Payment confirmed! Student can now receive login credentials.');
        fetchAllStudents();
        fetchRegisteredStudents();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to confirm payment');
      }
    } catch (err) {
      setError('Failed to confirm payment');
    } finally {
      setLoading(false);
    }
  };

  const updateStudentRoute = (studentId, route) => {
    setStudentRoutes(prev => ({ ...prev, [studentId]: route }));
  };

  const updateStudentCustomModules = (studentId, modules) => {
    setStudentCustomModules(prev => ({ ...prev, [studentId]: modules }));
  };

  const generateCodeForSingleStudent = async (studentId) => {
    setGeneratingSingleCode(true);
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
        setSuccess(data.message);
        if (data.whatsappLink) {
          window.open(data.whatsappLink, '_blank');
        }
        fetchAllStudents();
        fetchRegisteredStudents();
        setTimeout(() => setSuccess(''), 5000);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to generate code');
    } finally {
      setGeneratingSingleCode(false);
    }
  };

  const resendLoginDetails = async (studentId) => {
    setResendingCode(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/resend-login-details/${studentId}`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        if (data.whatsappLink) {
          window.open(data.whatsappLink, '_blank');
        }
        setSuccess('WhatsApp message opened! Send to resend credentials.');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to resend credentials');
    } finally {
      setResendingCode(false);
    }
  };

  const fetchUserProgress = async (userId) => {
    try {
      const res = await fetch(`${API_URL}/api/user/${userId}/progress`);
      const data = await res.json();
      setUserProgress({ progress: data.progress || [], attempts: data.attempts || [] });
    } catch (err) {
      setUserProgress({ progress: [], attempts: [] });
    }
  };

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
        fetchRegisteredStudents();
        setActiveTab('dashboard');
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

  const bulkGenerateCodes = async () => {
    if (selectedStudentIds.length === 0) {
      setError('Please select at least one student');
      return;
    }
    setLoading(true);
    const results = [];
    for (const studentId of selectedStudentIds) {
      const route = studentRoutes[studentId] || 'FULL_22';
      const customModules = studentCustomModules[studentId] || [];
      try {
        const response = await fetch(`${API_URL}/api/admin/generate-code-with-route/${studentId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ trainingRoute: route, selectedModules: route === 'CUSTOM' ? customModules : [] })
        });
        const data = await response.json();
        if (response.ok) {
          results.push({ studentId, email: data.loginEmail, code: data.code });
        }
      } catch (err) {
        console.error('Error generating for student:', studentId, err);
      }
    }
    setGeneratedCodes(results);
    setShowCodes(true);
    setSuccess(`Successfully generated ${results.length} login codes!`);
    fetchRegisteredStudents();
    fetchAllStudents();
    setSelectedStudentIds([]);
    setTimeout(() => setSuccess(''), 3000);
    setLoading(false);
  };

  const toggleStudentSelection = (studentId) => {
    setSelectedStudentIds(prev =>
      prev.includes(studentId) ? prev.filter(id => id !== studentId) : [...prev, studentId]
    );
  };

  const toggleSelectAllStudents = () => {
    if (selectedStudentIds.length === filteredBulkStudents.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(filteredBulkStudents.map(s => s.id));
    }
  };

  const filteredBulkStudents = registeredStudents.filter(student => {
    if (bulkPaymentFilter === 'confirmed') return student.paymentConfirmed === true;
    if (bulkPaymentFilter === 'pending') return student.paymentConfirmed === false;
    return true;
  });

  useEffect(() => {
    applyFilters(allStudents, searchTerm, paymentFilter);
  }, [searchTerm, paymentFilter, allStudents]);

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
        fetchRegisteredStudents();
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
        fetchRegisteredStudents();
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

  const toggleStudentSelectionDelete = (studentId) => {
    setSelectedStudents(prev =>
      prev.includes(studentId) ? prev.filter(id => id !== studentId) : [...prev, studentId]
    );
  };

  const toggleSelectAllDelete = () => {
    if (selectAll) {
      setSelectedStudents([]);
      setSelectAll(false);
    } else {
      const allIds = filteredStudents.map(s => s.id);
      setSelectedStudents(allIds);
      setSelectAll(true);
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
    const isCustomRoute = user?.trainingRoute === 'CUSTOM';
    const progress = userProgress.progress || [];
    const moduleProgress = progress.find(x => x.moduleId === moduleId);
    if (moduleProgress?.status === 'passed') return 'completed';
    if (isCustomRoute) {
      const selectedMods = user?.selectedModules || [];
      return selectedMods.includes(moduleId) ? 'available' : 'locked';
    }
    if (moduleId === 1) return 'available';
    const prevProgress = progress.find(x => x.moduleId === moduleId - 1);
    return prevProgress?.status === 'passed' ? 'available' : 'locked';
  };

  const batchGenerateCodes = async () => {
    const validStudents = studentBatch.filter(s => s.surname.trim() && s.firstName.trim() && s.phone.trim());
    if (validStudents.length === 0) {
      setError('Please add at least one student with surname, first name, and phone number');
      return;
    }
    
    const phoneRegex = /^\+44\d{10}$/;
    for (const student of validStudents) {
      if (!phoneRegex.test(student.phone)) {
        setError(`Invalid phone number for ${student.firstName} ${student.surname}. Must start with +44 (e.g., +447123456789)`);
        return;
      }
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
        fetchRegisteredStudents();
        setStudentBatch([{ surname: '', firstName: '', phone: '' }]);
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
      setStudentBatch([...studentBatch, { surname: '', firstName: '', phone: '' }]);
    }
  };

  const removeStudentField = (index) => {
    const newBatch = studentBatch.filter((_, i) => i !== index);
    setStudentBatch(newBatch.length ? newBatch : [{ surname: '', firstName: '', phone: '' }]);
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
    const codesText = generatedCodes.map(c => `${c.name || c.email}: ${c.code}`).join('\n');
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
        <table><thead><tr><th>Name/Email</th><th>Code</th></tr></thead>
        <tbody>${generatedCodes.map(c => `<tr><td>${c.name || c.email}</td><td><code>${c.code}</code></td></tr>`).join('')}</tbody>
      </table>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

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
        <tr><thead><tr><th>Module</th><th>Score</th><th>Status</th><th>Date</th></tr></thead>
        <tbody>${(reportData.attempts || []).map(a => `<tr><td>${a.module?.name}</td><td>${a.score}/20</td><td class="${a.passed ? 'passed' : 'failed'}">${a.passed ? 'PASSED' : 'FAILED'}</td><td>${new Date(a.completedAt).toLocaleString()}</td></tr>`).join('')}</tbody>
      </table>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl max-w-md w-full p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="text-white w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">COHT Assessment</h1>
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
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="admin@careworks.com" required />
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none pr-12" placeholder="Password" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition">
                {loading ? 'Logging in...' : 'Login as Admin'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleTraineeLogin} className="space-y-4">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="your.email@coht.co.uk" required />
              <input type="text" value={code} onChange={e => setCode(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-xl text-center tracking-widest font-mono text-xl" placeholder="000000" maxLength="6" required />
              <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition">
                {loading ? 'Verifying...' : 'Access Training'}
              </button>
            </form>
          )}
          <div className="text-center mt-4">
            <a href="/register" className="text-sm text-indigo-600 hover:underline">📝 New Student? Register Here</a>
          </div>
        </div>
      </div>
    );
  }

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

  if (user.role !== 'TRAINEE') {
    const totalStudents = allStudents.length;
    const totalAttempts = allStudents.reduce((acc, s) => acc + (s.moduleAttempts?.length || 0), 0);
    const totalPassed = allStudents.reduce((acc, s) => acc + (s.moduleAttempts?.filter(a => a.passed).length || 0), 0);
    const passRate = totalAttempts > 0 ? Math.round((totalPassed / totalAttempts) * 100) : 0;
    const confirmedCount = registeredStudents.filter(s => s.paymentConfirmed).length;
    const pendingCount = registeredStudents.filter(s => !s.paymentConfirmed).length;

    return (
      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200 sticky top-0 z-10 px-6 py-4 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center shadow-md"><Shield className="w-5 h-5 text-white" /></div>
            <div><h1 className="font-bold text-slate-800">COHT Admin Portal</h1><p className="text-xs text-slate-500">{user.email}</p></div>
          </div>
          <button onClick={() => setUser(null)} className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition">Logout</button>
        </div>
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex gap-2 mb-6 border-b overflow-x-auto">
            <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-2 text-sm font-medium transition-all ${activeTab === 'dashboard' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>📊 Dashboard</button>
            <button onClick={() => { setActiveTab('generate'); setShowCodes(false); }} className={`px-4 py-2 text-sm font-medium transition-all ${activeTab === 'generate' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>🎫 Bulk Generate</button>
            <button onClick={() => setActiveTab('students')} className={`px-4 py-2 text-sm font-medium transition-all ${activeTab === 'students' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>👥 Students</button>
          </div>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4">{error}</div>}
          {success && <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg mb-4">{success}</div>}

          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
              <div className="bg-white rounded-xl border p-6 shadow-sm"><div className="text-2xl font-bold">{totalStudents}</div><p className="text-sm text-gray-500">Total Students</p></div>
              <div className="bg-white rounded-xl border p-6 shadow-sm"><div className="text-2xl font-bold">{confirmedCount}</div><p className="text-sm text-gray-500">Payment Confirmed</p></div>
              <div className="bg-white rounded-xl border p-6 shadow-sm"><div className="text-2xl font-bold">{pendingCount}</div><p className="text-sm text-gray-500">Awaiting Payment</p></div>
              <div className="bg-white rounded-xl border p-6 shadow-sm"><div className="text-2xl font-bold">{totalAttempts}</div><p className="text-sm text-gray-500">Total Attempts</p></div>
              <div className="bg-white rounded-xl border p-6 shadow-sm"><div className="text-2xl font-bold">{passRate}%</div><p className="text-sm text-gray-500">Pass Rate</p></div>
            </div>
          )}

          {activeTab === 'generate' && (
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">🎫 Bulk Code Generation</h2>
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2"><Users size={18} /> Select Students for Bulk Generation</h3>
                <div className="flex gap-4 mb-4">
                  <div className="flex items-center gap-2"><Filter size={16} className="text-gray-500" /><span className="text-sm text-gray-600">Filter:</span></div>
                  <button onClick={() => setBulkPaymentFilter('all')} className={`px-3 py-1 rounded-lg text-sm ${bulkPaymentFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}>All ({registeredStudents.length})</button>
                  <button onClick={() => setBulkPaymentFilter('confirmed')} className={`px-3 py-1 rounded-lg text-sm ${bulkPaymentFilter === 'confirmed' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Confirmed ({confirmedCount})</button>
                  <button onClick={() => setBulkPaymentFilter('pending')} className={`px-3 py-1 rounded-lg text-sm ${bulkPaymentFilter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Pending ({pendingCount})</button>
                </div>
                <div className="border rounded-lg overflow-hidden bg-white max-h-80 overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b sticky top-0">
                      <tr>
                        <th className="p-3 w-10"><input type="checkbox" checked={selectedStudentIds.length === filteredBulkStudents.length && filteredBulkStudents.length > 0} onChange={toggleSelectAllStudents} className="w-4 h-4 rounded" /></th>
                        <th className="p-3 text-left">Name</th>
                        <th className="p-3 text-left">Email</th>
                        <th className="p-3 text-left">Phone</th>
                        <th className="p-3 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredBulkStudents.map(student => (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="p-3"><input type="checkbox" checked={selectedStudentIds.includes(student.id)} onChange={() => toggleStudentSelection(student.id)} disabled={!student.paymentConfirmed} className="w-4 h-4 rounded" /></td>
                          <td className="p-3 font-medium">{student.name || '-'}</td>
                          <td className="p-3 text-sm">{student.email}</td>
                          <td className="p-3 text-sm font-mono">{student.phone || '-'}</td>
                          <td className="p-3"><span className={`px-2 py-1 rounded-full text-xs ${student.paymentConfirmed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{student.paymentConfirmed ? '✅ Confirmed' : '⏳ Pending'}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <div className="text-sm text-gray-600">Selected: <strong>{selectedStudentIds.length}</strong> student(s)</div>
                  <button onClick={bulkGenerateCodes} disabled={selectedStudentIds.filter(id => registeredStudents.find(s => s.id === id)?.paymentConfirmed).length === 0 || loading} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 flex items-center gap-2"><Send size={16} /> Generate Codes</button>
                </div>
              </div>
              
              <div className="relative my-6"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div><div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">OR Add New Students Manually</span></div></div>
              
              <div className="mb-6 p-4 bg-slate-50 rounded-lg border">
                <label className="block font-semibold text-gray-700 mb-3">Access Level:</label>
                <div className="flex gap-6 mb-3">
                  <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="trainingRoute" value="FULL_22" checked={trainingRoute === 'FULL_22'} onChange={() => { setTrainingRoute('FULL_22'); setSelectedCustomModules([]); }} className="w-4 h-4 text-indigo-600" /><span className="text-sm font-medium">🎓 Full Access</span></label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="trainingRoute" value="CUSTOM" checked={trainingRoute === 'CUSTOM'} onChange={() => setTrainingRoute('CUSTOM')} className="w-4 h-4 text-indigo-600" /><span className="text-sm font-medium">⚙️ Custom Selection</span></label>
                </div>
                {trainingRoute === 'CUSTOM' && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-600 mb-2">Select modules:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto p-2 border rounded-lg bg-white">
                      {allModulesList.map(module => (
                        <label key={module.id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-slate-50 p-2 rounded">
                          <input type="checkbox" checked={selectedCustomModules.includes(module.id)} onChange={() => toggleModuleSelection(module.id)} className="w-4 h-4 text-indigo-600 rounded" />
                          <span>{module.name}</span>
                        </label>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Selected: {selectedCustomModules.length} module(s)</p>
                  </div>
                )}
              </div>
              
              <p className="text-sm text-slate-500 mb-2">Email format: <strong className="font-mono bg-slate-100 px-2 py-1 rounded">surname.initial@coht.co.uk</strong></p>
              <p className="text-sm text-slate-500 mb-4">Phone format: <strong className="font-mono bg-slate-100 px-2 py-1 rounded">+447123456789</strong></p>
              
              <div className="space-y-3 mb-4">
                {studentBatch.map((student, idx) => (
                  <div key={idx} className="flex flex-wrap gap-3">
                    <input type="text" placeholder="Surname" value={student.surname} onChange={e => updateStudent(idx, 'surname', e.target.value)} className="flex-1 min-w-[120px] px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                    <input type="text" placeholder="First Name" value={student.firstName} onChange={e => updateStudent(idx, 'firstName', e.target.value)} className="flex-1 min-w-[120px] px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                    <input type="tel" placeholder="Phone (+44...)" value={student.phone} onChange={e => updateStudent(idx, 'phone', e.target.value)} className="flex-1 min-w-[150px] px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono" />
                    {studentBatch.length > 1 && <button onClick={() => removeStudentField(idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition">🗑️</button>}
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={addStudentField} disabled={studentBatch.length >= 20} className="px-4 py-2 border rounded-lg text-sm disabled:opacity-50 hover:bg-slate-50 transition">+ Add Student ({studentBatch.length}/20)</button>
                <button onClick={batchGenerateCodes} disabled={loading} className="px-6 py-2 bg-slate-900 text-white rounded-lg text-sm hover:bg-slate-800 transition shadow-sm">🎫 Generate Codes</button>
              </div>
              {showCodes && generatedCodes.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-800">✅ Generated Credentials</h3>
                    <div className="flex gap-2">
                      <button onClick={copyAllCodes} className="px-3 py-1 text-sm border rounded-lg hover:bg-slate-50 transition">📋 Copy All</button>
                      <button onClick={printCodes} className="px-3 py-1 text-sm border rounded-lg hover:bg-slate-50 transition">🖨️ Print</button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead><tr className="bg-slate-50"><th className="p-2 text-left">Name/Email</th><th className="p-2 text-left">Code</th></tr></thead>
                      <tbody>
                        {generatedCodes.map((c, idx) => (
                          <tr key={idx} className="border-t">
                            <td className="p-2">{c.name || c.email}</td>
                            <td className="p-2"><code className="bg-slate-100 px-2 py-1 rounded font-mono">{c.code}</code></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'students' && (
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <div className="p-4 border-b bg-slate-50">
                <div className="flex flex-wrap justify-between items-center gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="Search by name, email or phone..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Filter size={16} className="text-gray-500" />
                      <span className="text-sm text-gray-600">Payment:</span>
                      <button onClick={() => setPaymentFilter('all')} className={`px-3 py-1 rounded-lg text-sm ${paymentFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}>All</button>
                      <button onClick={() => setPaymentFilter('confirmed')} className={`px-3 py-1 rounded-lg text-sm ${paymentFilter === 'confirmed' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Confirmed</button>
                      <button onClick={() => setPaymentFilter('pending')} className={`px-3 py-1 rounded-lg text-sm ${paymentFilter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Pending</button>
                    </div>
                    {selectedStudents.length > 0 && (
                      <button onClick={() => setShowBulkDeleteConfirm(true)} className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm">
                        <Trash2 size={16} /> Delete Selected ({selectedStudents.length})
                      </button>
                    )}
                  </div>
                </div>
              </div>
              {selectedStudents.length > 0 && (
                <div className="bg-red-50 border-b border-red-200 px-4 py-2 flex justify-between items-center">
                  <div className="flex items-center gap-2"><CheckSquare className="w-4 h-4 text-red-600" /><span className="text-sm text-red-700">{selectedStudents.length} student(s) selected for deletion</span></div>
                  <button onClick={toggleSelectAllDelete} className="text-sm text-red-600 hover:underline">{selectAll ? 'Deselect All' : 'Select All'}</button>
                </div>
              )}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="p-4 w-10"><input type="checkbox" checked={selectAll && filteredStudents.length > 0} onChange={toggleSelectAllDelete} className="w-4 h-4 rounded" /></th>
                      <th className="p-4 text-left">Name</th>
                      <th className="p-4 text-left">Email</th>
                      <th className="p-4 text-left">Phone</th>
                      <th className="p-4 text-left">Payment</th>
                      <th className="p-4 text-left">Registered</th>
                      <th className="p-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredStudents.map(student => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="p-4"><input type="checkbox" checked={selectedStudents.includes(student.id)} onChange={() => toggleStudentSelectionDelete(student.id)} className="w-4 h-4 rounded" /></td>
                        <td className="p-4 font-medium">{student.name || '-'}</td>
                        <td className="p-4 text-sm font-mono">{student.email}</td>
                        <td className="p-4 text-sm font-mono">{student.phone || '-'}</td>
                        <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs ${student.paymentConfirmed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{student.paymentConfirmed ? '✅ Confirmed' : '⏳ Pending'}</span></td>
                        <td className="p-4 text-sm">{new Date(student.createdAt).toLocaleDateString()}</td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-2 items-center">
                            {!student.paymentConfirmed && (
                              <button onClick={() => confirmPayment(student.id)} disabled={loading} className="text-green-600 text-sm hover:underline flex items-center gap-1">
                                <CreditCard size={14} /> Confirm Payment
                              </button>
                            )}
                            {student.paymentConfirmed && (
                              <>
                                <select 
                                  value={studentRoutes[student.id] || 'FULL_22'}
                                  onChange={(e) => updateStudentRoute(student.id, e.target.value)}
                                  className="text-xs border rounded px-2 py-1"
                                >
                                  <option value="FULL_22">Full Access</option>
                                  <option value="CUSTOM">Custom Selection</option>
                                </select>
                                {studentRoutes[student.id] === 'CUSTOM' && (
                                  <button 
                                    onClick={() => {
                                      setCurrentPickerStudent(student.id);
                                      setShowModulePicker(true);
                                    }}
                                    className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded transition"
                                  >
                                    Pick Modules ({studentCustomModules[student.id]?.length || 0})
                                  </button>
                                )}
                                <button onClick={() => generateCodeForSingleStudent(student.id)} disabled={generatingSingleCode} className="text-indigo-600 text-sm hover:underline flex items-center gap-1">
                                  <Send size={14} /> Generate Code
                                </button>
                              </>
                            )}
                            <button onClick={() => fetchStudentFullDetails(student.id)} className="text-blue-600 text-sm hover:underline flex items-center gap-1">
                              <EyeIcon size={14} /> Details
                            </button>
                            <button onClick={() => generateFullReport(student)} className="text-green-600 text-sm hover:underline flex items-center gap-1">
                              <FileSpreadsheet size={14} /> Report
                            </button>
                            <button onClick={() => { setDeleteUserId(student.id); setShowDeleteConfirm(true); }} className="text-red-600 text-sm hover:underline flex items-center gap-1">
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredStudents.length === 0 && (
                      <tr><td colSpan="7" className="text-center p-8 text-gray-500">No students found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Module Picker Modal */}
        {showModulePicker && currentPickerStudent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => { setShowModulePicker(false); setCurrentPickerStudent(null); }}>
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">📚 Select Modules for {registeredStudents.find(s => s.id === currentPickerStudent)?.name}</h3>
                <button onClick={() => { setShowModulePicker(false); setCurrentPickerStudent(null); }} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto mb-4">
                {allModulesList.map(module => (
                  <label key={module.id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-slate-50 p-2 rounded">
                    <input 
                      type="checkbox" 
                      checked={studentCustomModules[currentPickerStudent]?.includes(module.id) || false}
                      onChange={(e) => {
                        const current = studentCustomModules[currentPickerStudent] || [];
                        if (e.target.checked) {
                          updateStudentCustomModules(currentPickerStudent, [...current, module.id]);
                        } else {
                          updateStudentCustomModules(currentPickerStudent, current.filter(id => id !== module.id));
                        }
                      }}
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                    <span>{module.name}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => updateStudentCustomModules(currentPickerStudent, allModulesList.map(m => m.id))} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition">Select All</button>
                <button onClick={() => updateStudentCustomModules(currentPickerStudent, [])} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition">Clear All</button>
                <button onClick={() => { setShowModulePicker(false); setCurrentPickerStudent(null); }} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">Done</button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDeleteConfirm(false)}>
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center gap-3 text-red-600 mb-4"><AlertTriangleIcon className="w-8 h-8" /><h3 className="text-xl font-bold">🗑️ Delete Student</h3></div>
              <p className="text-slate-600 mb-4">Type <strong>DELETE</strong> to confirm:</p>
              <input type="text" value={deleteConfirmText} onChange={e => setDeleteConfirmText(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-4 font-mono focus:ring-2 focus:ring-red-500 outline-none" placeholder="DELETE" />
              <div className="flex gap-3"><button onClick={deleteUser} disabled={deleteConfirmText !== 'DELETE'} className="flex-1 bg-red-600 text-white py-2 rounded-lg disabled:opacity-50 hover:bg-red-700 transition">Delete</button><button onClick={() => { setShowDeleteConfirm(false); setDeleteUserId(null); setDeleteConfirmText(''); }} className="flex-1 bg-slate-200 text-slate-700 py-2 rounded-lg hover:bg-slate-300 transition">Cancel</button></div>
            </div>
          </div>
        )}

        {/* Bulk Delete Modal */}
        {showBulkDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowBulkDeleteConfirm(false)}>
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center gap-3 text-red-600 mb-4"><AlertTriangleIcon className="w-8 h-8" /><h3 className="text-xl font-bold">🗑️ Bulk Delete Students</h3></div>
              <p className="text-slate-600 mb-2">Delete <strong className="text-red-600">{selectedStudents.length}</strong> student(s).</p>
              <p className="text-slate-600 mb-4">Type <strong>DELETE</strong> to confirm:</p>
              <input type="text" value={bulkDeleteConfirmText} onChange={e => setBulkDeleteConfirmText(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-4 font-mono focus:ring-2 focus:ring-red-500 outline-none" placeholder="DELETE" />
              <div className="flex gap-3"><button onClick={bulkDeleteUsers} disabled={bulkDeleteConfirmText !== 'DELETE'} className="flex-1 bg-red-600 text-white py-2 rounded-lg disabled:opacity-50 hover:bg-red-700 transition">Delete All</button><button onClick={() => { setShowBulkDeleteConfirm(false); setBulkDeleteConfirmText(''); }} className="flex-1 bg-slate-200 text-slate-700 py-2 rounded-lg hover:bg-slate-300 transition">Cancel</button></div>
            </div>
          </div>
        )}

        {/* Student Details Modal */}
        {showStudentDetails && selectedStudentDetails && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => { setShowStudentDetails(false); setSelectedStudentDetails(null); }}>
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold text-gray-800">👤 Student Details</h3><button onClick={() => { setShowStudentDetails(false); setSelectedStudentDetails(null); }} className="text-gray-400 hover:text-gray-600">✕</button></div>
              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 border-b pb-1 mb-2">📝 Registration Details</h4>
                <p><strong>Name:</strong> {selectedStudentDetails.name || '-'}</p>
                <p><strong>Registration Email:</strong> {selectedStudentDetails.originalRegistrationEmail || selectedStudentDetails.email}</p>
                <p><strong>Phone:</strong> {selectedStudentDetails.phone || '-'}</p>
                <p><strong>Address:</strong> {selectedStudentDetails.address || '-'}</p>
                <p><strong>Post Code:</strong> {selectedStudentDetails.postCode || '-'}</p>
                <p><strong>Registered:</strong> {new Date(selectedStudentDetails.createdAt).toLocaleString()}</p>
              </div>
              {selectedStudentDetails.currentCode && (
                <div className="mb-4 p-3 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">🔐 Login Credentials (Generated)</h4>
                  <p><strong>Login Email:</strong> <code className="bg-white px-2 py-1 rounded">{selectedStudentDetails.email}</code></p>
                  <p><strong>Login Code:</strong> <code className="bg-white px-2 py-1 rounded font-mono text-lg">{selectedStudentDetails.currentCode}</code></p>
                  <p><strong>Code Expires:</strong> {new Date(selectedStudentDetails.codeExpiresAt).toLocaleString()}</p>
                  <p><strong>Training Route:</strong> {selectedStudentDetails.trainingRoute === 'CUSTOM' ? 'Custom Selection' : 'Full Access'}</p>
                </div>
              )}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 border-b pb-1 mb-2">💰 Payment Status</h4>
                <p><strong>Status:</strong> <span className={`px-2 py-1 rounded-full text-xs ${selectedStudentDetails.paymentConfirmed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{selectedStudentDetails.paymentConfirmed ? '✅ Confirmed' : '⏳ Pending'}</span></p>
                {selectedStudentDetails.paymentConfirmedAt && <p><strong>Confirmed At:</strong> {new Date(selectedStudentDetails.paymentConfirmedAt).toLocaleString()}</p>}
              </div>
              <div className="flex gap-3 mt-6">
                {selectedStudentDetails.currentCode && (
                  <button onClick={() => resendLoginDetails(selectedStudentDetails.id)} disabled={resendingCode} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2">
                    <RefreshCw size={16} /> {resendingCode ? 'Sending...' : 'Resend via WhatsApp'}
                  </button>
                )}
                <button onClick={() => { setShowStudentDetails(false); setSelectedStudentDetails(null); }} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition">Close</button>
              </div>
            </div>
          </div>
        )}

        {/* Report Modal */}
        {showReportModal && reportData && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => { setShowReportModal(false); setReportData(null); }}>
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center"><h3 className="text-xl font-bold text-gray-800">📊 Student Assessment Report</h3><button onClick={() => { setShowReportModal(false); setReportData(null); }} className="text-gray-400 hover:text-gray-600">✕</button></div>
              <div className="p-6 space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl"><p className="font-semibold text-gray-800 text-lg">{reportData.user?.name || '-'}</p><p className="text-sm text-gray-600 font-mono">{reportData.user?.email || '-'}</p></div>
                <div className="grid grid-cols-3 gap-4"><div className="text-center p-4 bg-gray-50 rounded-xl"><div className="text-2xl font-bold text-gray-800">{reportData.totalAttempts || 0}</div><div className="text-xs text-gray-500">Total Attempts</div></div><div className="text-center p-4 bg-green-50 rounded-xl"><div className="text-2xl font-bold text-green-600">{reportData.passedModules || 0}</div><div className="text-xs text-gray-500">Passed</div></div><div className="text-center p-4 bg-red-50 rounded-xl"><div className="text-2xl font-bold text-red-600">{reportData.failedModules || 0}</div><div className="text-xs text-gray-500">Failed</div></div></div>
                <button onClick={printReport} className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2"><Printer size={16} /> Print / PDF</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const stats = {
    total: modules.length,
    completed: userProgress.progress?.filter(p => p.status === 'passed').length || 0,
    inProgress: userProgress.progress?.filter(p => p.status === 'failed').length || 0,
    locked: modules.length - (userProgress.progress?.length || 0)
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3"><div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-md"><BookOpen className="w-5 h-5 text-white" /></div><div><h1 className="font-bold text-slate-800">COHT Assessment</h1><p className="text-xs text-slate-500">Trainee Dashboard</p></div></div>
        <button onClick={() => setUser(null)} className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition">Logout</button>
      </div>
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-xl p-6 mb-8 text-white shadow-lg"><h2 className="text-2xl font-bold mb-1">Welcome back, {user.name || 'Trainee'}! 🎓</h2><p className="text-indigo-100">Complete your mandatory training assessments</p></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-xl border p-5 shadow-sm"><div className="text-2xl font-bold text-indigo-600">{stats.total}</div><p className="text-sm text-slate-500">Total Modules</p></div>
          <div className="bg-white rounded-xl border p-5 shadow-sm"><div className="text-2xl font-bold text-green-600">{stats.completed}</div><p className="text-sm text-slate-500">Completed ✓</p></div>
          <div className="bg-white rounded-xl border p-5 shadow-sm"><div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div><p className="text-sm text-slate-500">In Progress</p></div>
          <div className="bg-white rounded-xl border p-5 shadow-sm"><div className="text-2xl font-bold text-slate-400">{stats.locked}</div><p className="text-sm text-slate-500">Locked 🔒</p></div>
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">📚 Your Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map(m => {
            const status = getModuleStatus(m.id);
            return (
              <div key={m.id} className="bg-white rounded-xl border p-5 transition-all cursor-pointer hover:shadow-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded">#{m.id}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${status === 'completed' ? 'bg-green-100 text-green-700' : status === 'available' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                        {status === 'completed' ? '✓ Completed' : status === 'available' ? 'Available' : '🔒 Locked'}
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-1">{m.name}</h3>
                    <p className="text-xs text-slate-500">Pass mark: {m.passMark}/20 (75%)</p>
                  </div>
                </div>
                {status === 'available' && <button onClick={() => startModule(m)} className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition text-sm font-medium">Start Module →</button>}
                {status === 'locked' && <button disabled className="w-full mt-4 bg-gray-100 text-gray-400 py-2 rounded-lg text-sm font-medium cursor-not-allowed">🔒 Complete previous first</button>}
                {status === 'completed' && <div className="w-full mt-4 bg-green-50 text-green-600 py-2 rounded-lg text-center">✓ Completed</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
