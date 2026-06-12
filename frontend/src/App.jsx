import React, { useState, useEffect } from 'react';
import { 
  LogOut, BookOpen, FileText, ChevronLeft, ChevronRight, Target, CheckCircle, AlertCircle, 
  Users, TrendingUp, Shield, Mail, Key, Eye, EyeOff, Plus, Trash2, Copy, Printer, Download, 
  Search, GraduationCap, CheckSquare, Square, X, Clock, Award, Calendar, UserCheck, 
  FileSpreadsheet, BarChart3, AlertTriangle, Zap, PlayCircle, Lock, CreditCard, Send, 
  MessageCircle, UserPlus, Filter, Eye as EyeIcon, RefreshCw, Home, ClipboardList, 
  UserCog, LayoutDashboard, FileBarChart
} from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'https://dsca-backend.onrender.com';

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
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [studentBatch, setStudentBatch] = useState([{ surname: '', firstName: '', phone: '' }]);
  const [generatedCodes, setGeneratedCodes] = useState([]);
  const [showCodes, setShowCodes] = useState(false);
  const [trainingRoute, setTrainingRoute] = useState('FULL_22');
  const [selectedCustomModules, setSelectedCustomModules] = useState([]);
  const [allModulesList, setAllModulesList] = useState([]);

  // Registration and payment state
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

  // Selection state
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [bulkDeleteConfirmText, setBulkDeleteConfirmText] = useState('');

  // Report state
  const [reportData, setReportData] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);
  const [selectedStudentForDetails, setSelectedStudentForDetails] = useState(null);
  const [generatedLoginDetails, setGeneratedLoginDetails] = useState(null);
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
      console.error('Fetch registered students error:', err);
      setRegisteredStudents([]);
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

  // ============ PAYMENT AND CODE GENERATION ============
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

  // ============ MODULE ASSESSMENT ============
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

  // ============ BATCH CODE GENERATION ============
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
        <table><thead><tr><th>Name/Email</th><th>Code</th><tr></thead>
        <tbody>${generatedCodes.map(c => `<tr><td>${c.name || c.email}</td>}<code>${c.code}</code></td></tr>`).join('')}</tbody>
      </table>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // ============ ADMIN: DELETE STUDENTS ============
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

  // ============ REPORT GENERATION ============
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
      <head>
        <title>Assessment Report - ${reportData.user?.name || reportData.user?.email}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; max-width: 1200px; margin: 0 auto; background: #f5f5f5; }
          .report-container { background: white; border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); overflow: hidden; }
          .header { background: linear-gradient(135deg, #1e293b, #0f172a); color: white; padding: 40px; text-align: center; }
          .header h1 { font-size: 28px; margin-bottom: 8px; }
          .section { padding: 24px 32px; border-bottom: 1px solid #e2e8f0; }
          .section-title { font-size: 18px; font-weight: bold; color: #1e293b; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #4f46e5; display: inline-block; }
          .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; margin-top: 16px; }
          .info-card { background: #f8fafc; padding: 16px; border-radius: 12px; }
          .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 20px 0; }
          .stat-card { text-align: center; padding: 20px; border-radius: 12px; }
          .stat-card.total { background: #e0e7ff; color: #3730a3; }
          .stat-card.passed { background: #dcfce7; color: #166534; }
          .stat-card.failed { background: #fee2e2; color: #991b1b; }
          .stat-number { font-size: 32px; font-weight: bold; }
          .module-card { background: #f8fafc; border-radius: 12px; margin-bottom: 24px; overflow: hidden; border: 1px solid #e2e8f0; }
          .module-header { padding: 16px 20px; background: #f1f5f9; border-bottom: 2px solid #4f46e5; }
          .error-table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          .error-table th { background: #4f46e5; color: white; padding: 12px; text-align: left; }
          .error-table td { padding: 12px; border-bottom: 1px solid #e2e8f0; }
          .wrong-answer { color: #dc2626; font-weight: 500; }
          .correct-answer { color: #16a34a; font-weight: 500; }
          .footer { text-align: center; padding: 24px; background: #f8fafc; font-size: 12px; color: #64748b; }
          @media print { body { padding: 0; background: white; } .report-container { box-shadow: none; } }
        </style>
      </head>
      <body>
        <div class="report-container">
          <div class="header"><h1>COHT Training Assessment Report</h1><p>Generated on ${new Date().toLocaleString()}</p></div>
          <div class="section"><div class="section-title">Trainee Information</div>
          <div class="info-grid">
            <div class="info-card"><label>Name</label><value>${reportData.user?.name || 'N/A'}</value></div>
            <div class="info-card"><label>Email</label><value>${reportData.user?.email || 'N/A'}</value></div>
          </div></div>
          <div class="section"><div class="section-title">Performance Summary</div>
          <div class="stats-grid">
            <div class="stat-card total"><div class="stat-number">${reportData.totalAttempts || 0}</div><div class="stat-label">Total Attempts</div></div>
            <div class="stat-card passed"><div class="stat-number">${reportData.passedModules || 0}</div><div class="stat-label">Passed</div></div>
            <div class="stat-card failed"><div class="stat-number">${reportData.failedModules || 0}</div><div class="stat-label">Failed</div></div>
          </div></div>
          <div class="section"><div class="section-title">Detailed Module Results & Incorrect Answers</div>`);
    
    for (const attempt of (reportData.attempts || [])) {
      htmlContent += `<div class="module-card"><div class="module-header"><strong>${attempt.module?.name}</strong> - Score: ${attempt.score}/20 (${attempt.passed ? 'PASSED' : 'FAILED'})</div>`;
      if (attempt.errors && attempt.errors.length > 0) {
        htmlContent += `<table class="error-table"><thead><tr><th>#</th><th>Question</th><th>Your Answer</th><th>Correct Answer</th></tr></thead><tbody>`;
        for (const err of attempt.errors) {
          htmlContent += `<tr><td>${err.questionNumber}</td><td>${err.questionText}</td><td class="wrong-answer">${err.userAnswer}</td><td class="correct-answer">${err.correctAnswer}</td></tr>`;
        }
        htmlContent += `</tbody></table>`;
      } else {
        htmlContent += `<div style="padding: 20px; text-align: center; color: #16a34a;">✅ Perfect! No incorrect answers.</div>`;
      }
      htmlContent += `</div>`;
    }
    
    htmlContent += `<div class="footer"><p>Generated by COHT Training Platform</p></div></div></body></html>`;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // Filter students
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

  // ============ LOGIN SCREEN with Registration Link ============
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xl max-w-md w-full p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#1E664E] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="text-white w-8 h-8" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
              <p className="text-slate-500 text-sm mt-1">Sign in to continue your training</p>
            </div>
            
            <div className="flex gap-2 mb-6 bg-slate-100 rounded-xl p-1">
              <button onClick={() => { setLoginType('admin'); setError(''); setCode(''); setEmail(''); setPassword(''); }} 
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${loginType === 'admin' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>
                <Shield size={16} className="inline mr-1" /> Admin
              </button>
              <button onClick={() => { setLoginType('trainee'); setError(''); setCode(''); setEmail(''); setPassword(''); }} 
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${loginType === 'trainee' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>
                <UserCheck size={16} className="inline mr-1" /> Trainee
              </button>
            </div>
            
            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}
            {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">{success}</div>}
            
            {loginType === 'admin' ? (
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} 
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                    placeholder="admin@careworks.com" required />
                </div>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} 
                    className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                    placeholder="Password" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <button type="submit" disabled={loading} 
                  className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition">
                  {loading ? 'Logging in...' : 'Login as Admin'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleTraineeLogin} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} 
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                    placeholder="your.email@coht.co.uk" required />
                </div>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input type="text" value={code} onChange={e => setCode(e.target.value)} 
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl text-center tracking-widest font-mono text-xl" 
                    placeholder="000000" maxLength="6" required />
                </div>
                <button type="submit" disabled={loading} 
                  className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition">
                  {loading ? 'Verifying...' : 'Access Training'}
                </button>
              </form>
            )}
            
            {/* VISIBLE REGISTRATION BUTTON - NOT JUST A LINK */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <div className="text-center mb-3">
                <span className="text-sm text-slate-500">Don't have an account?</span>
              </div>
              <Link to="/register" 
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold transition shadow-md">
                <UserPlus size={18} /> Register as New Student
              </Link>
              <p className="text-center text-xs text-slate-400 mt-3">
                Register now to start your mandatory training
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ============ ASSESSMENT SCREEN ============
  if (selectedModule && !showResults) {
    const questions = selectedModule.questions || [];
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <div className="bg-white border-b border-slate-200 sticky top-0 z-10 px-6 py-4 flex justify-between items-center shadow-sm">
          <button onClick={() => setSelectedModule(null)} className="text-slate-600 hover:text-slate-900 flex items-center gap-1">
            <ChevronLeft size={18} /> Back to Dashboard
          </button>
          <div className="flex items-center gap-3">
            <Clock size={16} className="text-slate-400" />
            <span className="text-sm text-slate-500">{Math.floor((Date.now() - startTime) / 1000)}s</span>
            <span className="text-sm font-medium text-slate-700">{user.name || user.email}</span>
          </div>
        </div>
        <div className="flex-1 max-w-3xl mx-auto p-6">
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
              <button disabled={currentQuestion === 0} onClick={() => setCurrentQuestion(v => v - 1)} 
                className="px-6 py-2 text-slate-600 disabled:opacity-30 hover:text-slate-800 transition flex items-center gap-1">
                <ChevronLeft size={16} /> Previous
              </button>
              {currentQuestion < questions.length - 1 ? (
                <button disabled={answers[currentQuestion] === undefined} onClick={() => setCurrentQuestion(v => v + 1)} 
                  className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition flex items-center gap-1">
                  Next <ChevronRight size={16} />
                </button>
              ) : (
                <button disabled={Object.keys(answers).length < questions.length || loading} onClick={submitAssessment} 
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50">
                  {loading ? 'Submitting...' : 'Submit Assessment'}
                </button>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (showResults && result) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-xl border border-slate-200 p-8 max-w-md text-center shadow-lg">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${result.passed ? 'bg-green-100' : 'bg-red-100'}`}>
              {result.passed ? <CheckCircle className="w-12 h-12 text-green-600" /> : <AlertCircle className="w-12 h-12 text-red-600" />}
            </div>
            <h2 className="text-2xl font-bold mb-2">{result.passed ? 'Congratulations! 🎉' : 'Not This Time ❌'}</h2>
            <p className="text-slate-600 mb-4">You scored <strong className="text-2xl">{result.score}</strong> out of <strong>{result.total}</strong></p>
            <button onClick={() => { setSelectedModule(null); setShowResults(false); fetchUserProgress(user.id); }} 
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
              Return to Dashboard
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ============ ADMIN DASHBOARD ============
  if (user.role !== 'TRAINEE') {
    const totalStudents = allStudents.length;
    const totalAttempts = allStudents.reduce((acc, s) => acc + (s.moduleAttempts?.length || 0), 0);
    const totalPassed = allStudents.reduce((acc, s) => acc + (s.moduleAttempts?.filter(a => a.passed).length || 0), 0);
    const passRate = totalAttempts > 0 ? Math.round((totalPassed / totalAttempts) * 100) : 0;
    const confirmedCount = registeredStudents.filter(s => s.paymentConfirmed).length;
    const pendingCount = registeredStudents.filter(s => !s.paymentConfirmed).length;
    
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <div className="bg-white border-b border-slate-200 sticky top-0 z-10 px-6 py-3 shadow-sm">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-indigo-600" />
              <div><h1 className="font-bold text-slate-800">Admin Portal</h1><p className="text-xs text-slate-500">{user.email}</p></div>
            </div>
            <button onClick={() => setUser(null)} className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto p-6 flex-1">
          {/* VISIBLE TABS - Clear and Professional */}
          <div className="flex flex-wrap gap-2 mb-6 border-b">
            <button onClick={() => setActiveTab('dashboard')} 
              className={`px-5 py-2.5 rounded-t-lg font-medium transition-all flex items-center gap-2 ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              <LayoutDashboard size={18} /> Dashboard
            </button>
            <button onClick={() => setActiveTab('students')} 
              className={`px-5 py-2.5 rounded-t-lg font-medium transition-all flex items-center gap-2 ${activeTab === 'students' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              <Users size={18} /> Students
            </button>
            <button onClick={() => { setActiveTab('generate'); setShowCodes(false); }} 
              className={`px-5 py-2.5 rounded-t-lg font-medium transition-all flex items-center gap-2 ${activeTab === 'generate' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              <FileBarChart size={18} /> Generate Codes
            </button>
          </div>
          
          {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 flex items-center gap-2"><AlertCircle size={18} /> {error}</div>}
          {success && <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg mb-4 flex items-center gap-2"><CheckCircle size={18} /> {success}</div>}
          
          {activeTab === 'dashboard' && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <div className="bg-white rounded-xl border p-6 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center"><Users className="w-6 h-6 text-blue-600" /></div>
                    <div className="text-2xl font-bold text-gray-800">{totalStudents}</div>
                  </div>
                  <p className="text-sm text-gray-500">Total Students</p>
                </div>
                <div className="bg-white rounded-xl border p-6 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center"><CheckCircle className="w-6 h-6 text-green-600" /></div>
                    <div className="text-2xl font-bold text-gray-800">{confirmedCount}</div>
                  </div>
                  <p className="text-sm text-gray-500">Payment Confirmed</p>
                </div>
                <div className="bg-white rounded-xl border p-6 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center"><Clock className="w-6 h-6 text-yellow-600" /></div>
                    <div className="text-2xl font-bold text-gray-800">{pendingCount}</div>
                  </div>
                  <p className="text-sm text-gray-500">Awaiting Payment</p>
                </div>
                <div className="bg-white rounded-xl border p-6 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center"><TrendingUp className="w-6 h-6 text-purple-600" /></div>
                    <div className="text-2xl font-bold text-gray-800">{passRate}%</div>
                  </div>
                  <p className="text-sm text-gray-500">Pass Rate</p>
                </div>
              </div>
              <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b bg-slate-50"><h3 className="font-semibold text-gray-800">Recent Registrations</h3></div>
                <div className="divide-y">
                  {registeredStudents.slice(0, 5).map(student => (
                    <div key={student.id} className="px-6 py-3 flex justify-between items-center hover:bg-slate-50">
                      <div><p className="font-medium text-gray-800">{student.name || student.email}</p><p className="text-xs text-gray-500">Registered: {new Date(student.createdAt).toLocaleDateString()}</p></div>
                      <span className={`px-2 py-1 rounded-full text-xs ${student.paymentConfirmed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{student.paymentConfirmed ? 'Confirmed' : 'Pending'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'students' && (
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <div className="p-4 border-b bg-slate-50">
                <div className="flex flex-wrap justify-between items-center gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="Search students..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} 
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter size={16} className="text-gray-500" />
                    <button onClick={() => setPaymentFilter('all')} className={`px-3 py-1 rounded-lg text-sm ${paymentFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>All</button>
                    <button onClick={() => setPaymentFilter('confirmed')} className={`px-3 py-1 rounded-lg text-sm ${paymentFilter === 'confirmed' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>Confirmed</button>
                    <button onClick={() => setPaymentFilter('pending')} className={`px-3 py-1 rounded-lg text-sm ${paymentFilter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-200'}`}>Pending</button>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr><th className="p-4 text-left">Name</th><th className="p-4 text-left">Email</th><th className="p-4 text-left">Phone</th><th className="p-4 text-left">Payment</th><th className="p-4 text-left">Actions</th></tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map(student => (
                      <tr key={student.id} className="border-t hover:bg-gray-50">
                        <td className="p-4 font-medium">{student.name || '-'}</td>
                        <td className="p-4 text-sm">{student.email}</td>
                        <td className="p-4 text-sm font-mono">{student.phone || '-'}</td>
                        <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs ${student.paymentConfirmed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{student.paymentConfirmed ? 'Confirmed' : 'Pending'}</span></td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-2">
                            {!student.paymentConfirmed && (
                              <button onClick={() => confirmPayment(student.id)} className="text-green-600 text-sm hover:underline">Confirm Payment</button>
                            )}
                            {student.paymentConfirmed && (
                              <>
                                <select value={studentRoutes[student.id] || 'FULL_22'} onChange={(e) => updateStudentRoute(student.id, e.target.value)} className="text-xs border rounded px-2 py-1">
                                  <option value="FULL_22">Full Access</option>
                                  <option value="CUSTOM">Custom</option>
                                </select>
                                {studentRoutes[student.id] === 'CUSTOM' && (
                                  <button onClick={() => { setCurrentPickerStudent(student.id); setShowModulePicker(true); }} className="text-xs bg-gray-200 px-2 py-1 rounded">Pick Modules</button>
                                )}
                                <button onClick={() => generateCodeForSingleStudent(student.id)} className="text-indigo-600 text-sm hover:underline">Generate Code</button>
                              </>
                            )}
                            <button onClick={() => fetchStudentFullDetails(student.id)} className="text-blue-600 text-sm hover:underline">Details</button>
                            <button onClick={() => generateFullReport(student)} className="text-green-600 text-sm hover:underline">Report</button>
                            <button onClick={() => { setDeleteUserId(student.id); setShowDeleteConfirm(true); }} className="text-red-600 text-sm hover:underline">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {activeTab === 'generate' && (
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Batch Code Generation</h2>
              <div className="mb-6 p-4 bg-slate-50 rounded-lg border">
                <label className="block font-semibold text-gray-700 mb-3">Access Level:</label>
                <div className="flex gap-6 mb-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="trainingRoute" value="FULL_22" checked={trainingRoute === 'FULL_22'} onChange={() => { setTrainingRoute('FULL_22'); setSelectedCustomModules([]); }} className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm font-medium">Full Access (All Modules)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="trainingRoute" value="CUSTOM" checked={trainingRoute === 'CUSTOM'} onChange={() => setTrainingRoute('CUSTOM')} className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm font-medium">Custom Selection</span>
                  </label>
                </div>
                {trainingRoute === 'CUSTOM' && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-600 mb-2">Select modules:</p>
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
              <div className="space-y-3 mb-4">
                {studentBatch.map((student, idx) => (
                  <div key={idx} className="flex flex-wrap gap-3">
                    <input type="text" placeholder="Surname" value={student.surname} onChange={e => updateStudent(idx, 'surname', e.target.value)} className="flex-1 min-w-[120px] px-4 py-2 border rounded-lg" />
                    <input type="text" placeholder="First Name" value={student.firstName} onChange={e => updateStudent(idx, 'firstName', e.target.value)} className="flex-1 min-w-[120px] px-4 py-2 border rounded-lg" />
                    <input type="tel" placeholder="Phone (+44...)" value={student.phone} onChange={e => updateStudent(idx, 'phone', e.target.value)} className="flex-1 min-w-[150px] px-4 py-2 border rounded-lg font-mono" />
                    {studentBatch.length > 1 && <button onClick={() => removeStudentField(idx)} className="p-2 text-red-500">🗑️</button>}
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={addStudentField} disabled={studentBatch.length >= 20} className="px-4 py-2 border rounded-lg text-sm">+ Add Student ({studentBatch.length}/20)</button>
                <button onClick={batchGenerateCodes} disabled={loading} className="px-6 py-2 bg-slate-900 text-white rounded-lg text-sm">Generate Codes</button>
              </div>
              {showCodes && generatedCodes.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <div className="flex justify-between items-center mb-4"><h3 className="font-semibold">Generated Credentials</h3><div className="flex gap-2"><button onClick={copyAllCodes} className="px-3 py-1 text-sm border rounded-lg">Copy All</button><button onClick={printCodes} className="px-3 py-1 text-sm border rounded-lg">Print</button></div></div>
                  <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="bg-slate-50"><th className="p-2">Name</th><th className="p-2">Email</th><th className="p-2">Code</th></tr></thead><tbody>{generatedCodes.map((s, idx) => <tr key={idx} className="border-t"><td className="p-2">{s.name}</td><td className="p-2 text-xs">{s.email}</td><td className="p-2"><code className="bg-slate-100 px-2 py-1 rounded">{s.code}</code></td></tr>)}</tbody></table></div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Modals */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6"><h3 className="text-xl font-bold mb-4">Delete Student</h3><p>Type DELETE to confirm:</p><input type="text" value={deleteConfirmText} onChange={e => setDeleteConfirmText(e.target.value)} className="w-full border rounded p-2 my-2" placeholder="DELETE" /><div className="flex gap-3"><button onClick={deleteUser} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button><button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 border rounded">Cancel</button></div></div>
          </div>
        )}
        
        {showModulePicker && currentPickerStudent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[80vh] overflow-y-auto"><h3 className="text-xl font-bold mb-4">Select Modules</h3><div className="grid grid-cols-2 gap-2 mb-4">{allModulesList.map(module => (<label key={module.id} className="flex items-center gap-2"><input type="checkbox" checked={studentCustomModules[currentPickerStudent]?.includes(module.id)} onChange={(e) => { const current = studentCustomModules[currentPickerStudent] || []; if (e.target.checked) { updateStudentCustomModules(currentPickerStudent, [...current, module.id]); } else { updateStudentCustomModules(currentPickerStudent, current.filter(id => id !== module.id)); } }} className="w-4 h-4 rounded" /><span className="text-sm">{module.name}</span></label>))}</div><div className="flex gap-3"><button onClick={() => setShowModulePicker(false)} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg">Done</button></div></div>
          </div>
        )}
        
        {showStudentDetails && selectedStudentDetails && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6"><h3 className="text-xl font-bold mb-4">Student Details</h3><p><strong>Name:</strong> {selectedStudentDetails.name}</p><p><strong>Email:</strong> {selectedStudentDetails.email}</p><p><strong>Phone:</strong> {selectedStudentDetails.phone}</p><p><strong>Address:</strong> {selectedStudentDetails.address}</p><p><strong>Payment:</strong> {selectedStudentDetails.paymentConfirmed ? 'Confirmed' : 'Pending'}</p><div className="flex gap-3 mt-4"><button onClick={() => setShowStudentDetails(false)} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg">Close</button></div></div>
          </div>
        )}
        

        {showDetailsPanel && selectedStudentForDetails && (
          <StudentDetailsPanel 
            student={selectedStudentForDetails} 
            loginDetails={generatedLoginDetails} 
            onClose={() => { setShowDetailsPanel(false); setSelectedStudentForDetails(null); setGeneratedLoginDetails(null); }} 
            onRefresh={() => showStudentFullDetails(selectedStudentForDetails)} 
          />
        )}
        {showReportModal && reportData && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto p-6"><div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold">Assessment Report</h3><button onClick={() => setShowReportModal(false)} className="text-gray-500">✕</button></div><div className="bg-gray-50 p-4 rounded-lg mb-4"><p><strong>{reportData.user?.name}</strong><br />{reportData.user?.email}</p></div><div className="grid grid-cols-3 gap-4 mb-6"><div className="text-center p-3 bg-gray-100 rounded"><div className="text-2xl font-bold">{reportData.totalAttempts}</div><div className="text-xs">Attempts</div></div><div className="text-center p-3 bg-green-100 rounded"><div className="text-2xl font-bold text-green-600">{reportData.passedModules}</div><div className="text-xs">Passed</div></div><div className="text-center p-3 bg-red-100 rounded"><div className="text-2xl font-bold text-red-600">{reportData.failedModules}</div><div className="text-xs">Failed</div></div></div><div className="space-y-4">{reportData.attempts?.map(attempt => (<div key={attempt.id} className="border rounded-lg p-4"><div className="flex justify-between items-center mb-2"><h4 className="font-semibold">{attempt.module?.name}</h4><span className={`px-2 py-1 rounded text-xs ${attempt.passed ? 'bg-green-100' : 'bg-red-100'}`}>{attempt.passed ? 'PASSED' : 'FAILED'} {attempt.score}/20</span></div>{attempt.errors?.length > 0 && (<div className="mt-2"><p className="text-sm font-medium text-red-600">Incorrect Questions:</p>{attempt.errors.map((err, i) => (<div key={i} className="text-sm bg-red-50 p-2 rounded mt-1"><p className="font-medium">Q{err.questionNumber}: {err.questionText}</p><p className="text-red-600">Your answer: {err.userAnswer}</p><p className="text-green-600">Correct: {err.correctAnswer}</p></div>))}</div>)}</div>))}</div><div className="flex gap-3 mt-6"><button onClick={printReport} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg">Print Report</button><button onClick={() => setShowReportModal(false)} className="flex-1 bg-gray-200 py-2 rounded-lg">Close</button></div></div>
          </div>
        )}
        
        <Footer />
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
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 px-6 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3"><BookOpen className="w-6 h-6 text-indigo-600" /><div><h1 className="font-bold text-slate-800">Trainee Dashboard</h1><p className="text-xs text-slate-500">{user.name || user.email}</p></div></div>
          <button onClick={() => setUser(null)} className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"><LogOut size={16} /> Logout</button>
        </div>
      </div>
      <div className="flex-1 max-w-7xl mx-auto p-6">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-xl p-6 mb-8 text-white shadow-lg">
          <h2 className="text-2xl font-bold mb-1">Welcome back, {user.name || 'Trainee'}! 🎉</h2>
          <p className="text-indigo-100">Complete your mandatory training assessments</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-xl border p-5"><div className="text-2xl font-bold text-indigo-600">{stats.total}</div><p className="text-sm">Total Modules</p></div>
          <div className="bg-white rounded-xl border p-5"><div className="text-2xl font-bold text-green-600">{stats.completed}</div><p className="text-sm">Completed ✓</p></div>
          <div className="bg-white rounded-xl border p-5"><div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div><p className="text-sm">In Progress</p></div>
          <div className="bg-white rounded-xl border p-5"><div className="text-2xl font-bold text-slate-400">{stats.locked}</div><p className="text-sm">Locked 🔒</p></div>
        </div>
        <h2 className="text-xl font-bold mb-4">📚 Your Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map(m => {
            const status = getModuleStatus(m.id);
            return (
              <div key={m.id} className="bg-white rounded-xl border p-5 hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-3">
                  <div><h3 className="font-semibold">{m.name}</h3><p className="text-xs text-slate-500">Pass: {m.passMark}/20 (75%)</p></div>
                  {status === 'completed' && <CheckCircle className="text-green-500 w-5 h-5" />}
                  {status === 'available' && <PlayCircle className="text-blue-500 w-5 h-5" />}
                  {status === 'locked' && <Lock className="text-gray-400 w-5 h-5" />}
                </div>
                {status === 'available' && <button onClick={() => startModule(m)} className="w-full mt-3 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">Start Module →</button>}
                {status === 'locked' && <button disabled className="w-full mt-3 bg-gray-100 text-gray-400 py-2 rounded-lg cursor-not-allowed">Complete Previous First</button>}
                {status === 'completed' && <div className="w-full mt-3 bg-green-50 text-green-600 py-2 rounded-lg text-center">✓ Completed</div>}
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
