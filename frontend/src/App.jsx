import React, { useState, useEffect } from 'react';
import { 
  LogOut, BookOpen, FileText, ChevronLeft, ChevronRight, Target, CheckCircle, AlertCircle, 
  Users, TrendingUp, Shield, Mail, Key, Eye, EyeOff, Plus, Trash2, Copy, Printer, Download, 
  Search, GraduationCap, CheckSquare, Square, X, Clock, Award, Calendar, UserCheck, 
  FileSpreadsheet, BarChart3, AlertTriangle, Zap, PlayCircle, Lock, CreditCard, Send, 
  MessageCircle, UserPlus, Filter, Eye as EyeIcon, RefreshCw, Home, ClipboardList, 
  UserCog, LayoutDashboard, FileBarChart, Building2, Phone, MapPin, Award as AwardIcon, 
  Calendar as CalendarIcon, BarChart, PieChart, KeyRound 
} from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import StudentDetailsPanel from './components/StudentDetailsPanel';
import PracticalCodeModal from './components/PracticalCodeModal';
import ModulePickerModal from './components/ModulePickerModal';
import { Link } from 'react-router-dom';
import logo01 from './assets/logo01.jpg';
import logo2 from './assets/logo2.jpg';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

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
  const [registeredStudents, setRegisteredStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [studentBatch, setStudentBatch] = useState([{ surname: '', firstName: '', phone: '' }]);
  const [generatedCodes, setGeneratedCodes] = useState([]);
  const [showCodes, setShowCodes] = useState(false);
  const [trainingRoute, setTrainingRoute] = useState('FULL_ACCESS');
  const [selectedCustomModules, setSelectedCustomModules] = useState([]);
  const [allModulesList, setAllModulesList] = useState([]);
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
  const [showStudentDetails, setShowStudentDetails] = useState(false);
  const [selectedStudentDetails, setSelectedStudentDetails] = useState(null);
  const [generatedLoginDetails, setGeneratedLoginDetails] = useState(null);
  const [studentRoutes, setStudentRoutes] = useState({});
  const [studentCustomModules, setStudentCustomModules] = useState({});
  const [showModulePicker, setShowModulePicker] = useState(false);
  const [currentPickerStudent, setCurrentPickerStudent] = useState(null);
  const [pickerRouteType, setPickerRouteType] = useState("CUSTOMIZED_01");
  const [showPracticalModal, setShowPracticalModal] = useState(false);
  const [pendingPracticalModule, setPendingPracticalModule] = useState(null);
  const [practicalModuleName, setPracticalModuleName] = useState('');
  const [practicalCode, setPracticalCode] = useState('');
  const [practicalCodeExpiry, setPracticalCodeExpiry] = useState(null);
  const [generatingPracticalCode, setGeneratingPracticalCode] = useState(false);

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

  const updateStudentRoute = (studentId, route) => {
    setStudentRoutes(prev => ({ ...prev, [studentId]: route }));
    if (route === 'CUSTOMIZED_01' || route === 'CUSTOMIZED_02') {
      setStudentCustomModules(prev => ({ ...prev, [studentId]: [] }));
    }
  };

  const updateStudentCustomModules = (studentId, modules) => {
    setStudentCustomModules(prev => ({ ...prev, [studentId]: modules }));
  };

  const fetchRegisteredStudents = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/all-students-with-status`);
      const data = await res.json();
      setRegisteredStudents(Array.isArray(data) ? data : []);
      setFilteredStudents(Array.isArray(data) ? data : []);
      const routes = {};
      const customMods = {};
      data.forEach(student => {
        routes[student.id] = student.trainingRoute || 'FULL_ACCESS';
        customMods[student.id] = student.selectedModules ? JSON.parse(student.selectedModules || '[]') : [];
      });
      setStudentRoutes(routes);
      setStudentCustomModules(customMods);
    } catch (err) {
      console.error('Fetch registered students error:', err);
      setRegisteredStudents([]);
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

  const fetchStudentFullDetails = async (studentId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/student-with-login/${studentId}`);
      const data = await response.json();
      if (response.ok) {
        setSelectedStudentDetails(data.student);
        setGeneratedLoginDetails(data.loginDetails);
        setShowStudentDetails(true);
      } else {
        setError(data.error || 'Failed to fetch student details');
      }
    } catch (err) {
      console.error('Fetch student error:', err);
      setError('Failed to fetch student details');
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentPracticalCode = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/current-practical-code`);
      const data = await response.json();
      if (response.ok && data.code) {
        setPracticalCode(data.code);
        setPracticalCodeExpiry(data.expiresAt);
      }
    } catch (err) {
      console.error('Failed to fetch practical code:', err);
    }
  };

  const handlePracticalCodeSuccess = () => {
    setSuccess('✅ Practical code verified! You can now access the module.');
    setTimeout(() => setSuccess(''), 5000);
    if (user?.id) {
      fetchModules(user.id);
    }
  };

  const handlePracticalCodeError = (errorMsg) => {
    setError(errorMsg || 'Failed to verify practical code. Please try again.');
    setTimeout(() => setError(''), 5000);
  };

  const requestPracticalCode = (module) => {
    setPendingPracticalModule(module);
    setPracticalModuleName(module.name);
    setShowPracticalModal(true);
  };

  const generatePracticalCode = async () => {
    setGeneratingPracticalCode(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/generate-practical-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ generatedBy: user?.email || 'admin' })
      });
      const data = await response.json();
      if (response.ok) {
        setPracticalCode(data.code);
        setPracticalCodeExpiry(data.expiresAt);
        setSuccess(`✅ New practical code generated: ${data.code}`);
        setTimeout(() => setSuccess(''), 5000);
      } else {
        setError(data.error || 'Failed to generate practical code');
      }
    } catch (err) {
      setError('Failed to generate practical code');
    } finally {
      setGeneratingPracticalCode(false);
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
        await fetchModules();
        await fetchAllModulesForSelection();
        await fetchRegisteredStudents();
        await fetchCurrentPracticalCode();
        setActiveTab('students');
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

  const handleRefreshCredentials = async () => {
    if (!selectedStudentDetails) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/generate-code-with-route/${selectedStudentDetails.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trainingRoute: 'FULL_ACCESS', selectedModules: [] })
      });
      const data = await response.json();
      if (response.ok) {
        await fetchStudentFullDetails(selectedStudentDetails.id);
        setSuccess('Credentials regenerated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to regenerate credentials');
      }
    } catch (err) {
      setError('Failed to regenerate credentials');
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
        await fetchUserProgress(user.id);
      } else {
        await fetchRegisteredStudents();
      }
    } catch (err) {
      setError('Submission failed');
    } finally {
      setLoading(false);
    }
  };

  const getModuleStatus = (moduleId) => {
    if (user?.role !== 'TRAINEE') return 'available';
    
    const route = user?.trainingRoute || 'FULL_ACCESS';
    const progress = userProgress.progress || [];
    const moduleProgress = progress.find(x => x.moduleId === moduleId);
    
    if (moduleProgress?.status === 'passed') return 'completed';
    
    const isPractical = moduleId === 8 || moduleId === 17;
    
    if (isPractical) {
      let practicalModules = {};
      if (user?.practicalModules) {
        try {
          practicalModules = typeof user.practicalModules === 'string' 
            ? JSON.parse(user.practicalModules) 
            : user.practicalModules;
        } catch (e) { 
          practicalModules = {}; 
        }
      }
      
      if (practicalModules[moduleId]?.completed) {
        return 'available';
      }
      
      if (route === 'CUSTOMIZED_02') {
        const theoryModules = [1,2,3,4,5,6,7,9,10,11,12,13,14,15,16,18,19,20,21,22,23];
        const allTheoryPassed = theoryModules.every(id => {
          const p = progress.find(x => x.moduleId === id);
          return p?.status === 'passed';
        });
        if (!allTheoryPassed) {
          return 'locked';
        }
      }
      
      return 'practical_locked';
    }
    
    if (route === 'CUSTOMIZED_01') {
      const selectedModules = user?.selectedModules ? JSON.parse(user.selectedModules) : [];
      if (!selectedModules.includes(moduleId)) {
        return 'locked';
      }
      return 'available';
    }
    
    if (moduleId === 1) return 'available';
    
    let prevId = moduleId - 1;
    while (prevId === 8 || prevId === 17) {
      prevId--;
    }
    if (prevId < 1) return 'available';
    
    const prevProgress = progress.find(x => x.moduleId === prevId);
    if (prevProgress?.status === 'passed') return 'available';
    
    return 'locked';
  };

  const batchGenerateCodes = async () => {
    const validStudents = studentBatch.filter(s => s.surname.trim() && s.firstName.trim() && s.phone.trim());
    if (validStudents.length === 0) {
      setError('Please add at least one student');
      return;
    }
    const phoneRegex = /^\+44\d{10}$/;
    for (const student of validStudents) {
      if (!phoneRegex.test(student.phone)) {
        setError(`Invalid phone number for ${student.firstName} ${student.surname}. Must start with +44`);
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
          selectedModules: trainingRoute === 'CUSTOMIZED_01' ? selectedCustomModules : [] 
        })
      });
      const data = await response.json();
      if (response.ok) {
        setGeneratedCodes(data.codes);
        setShowCodes(true);
        setSuccess(`Successfully generated ${data.count} login codes!`);
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
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Code</th></tr></thead>
          <tbody>${generatedCodes.map(c => `<tr><td>${c.name}</td><td>${c.email}</td><td><code>${c.code}</code></td></tr>`).join('')}</tbody>
        </table>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const confirmPayment = async (studentId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/confirm-payment/${studentId}`, { method: 'POST' });
      if (response.ok) {
        setSuccess('Payment confirmed! Student can now receive login credentials.');
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

  const generateCodeForSingleStudent = async (studentId) => {
    setLoading(true);
    const route = studentRoutes[studentId] || 'FULL_ACCESS';
    const customModules = studentCustomModules[studentId] || [];
    try {
      const response = await fetch(`${API_URL}/api/admin/generate-code-with-route/${studentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trainingRoute: route, selectedModules: route === 'CUSTOMIZED_01' ? customModules : [] })
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess(data.message || 'Login code generated successfully!');
        if (data.whatsappLink) window.open(data.whatsappLink, '_blank');
        fetchRegisteredStudents();
        setTimeout(() => setSuccess(''), 5000);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to generate code');
    } finally {
      setLoading(false);
    }
  };

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
    const totalDuration = reportData.totalTimeSpent || 0;
    const hours = Math.floor(totalDuration / 3600);
    const minutes = Math.floor((totalDuration % 3600) / 60);
    
    const passedModules = reportData.passedModules || 0;
    const failedModules = reportData.failedModules || 0;
    const totalAttempts = reportData.totalAttempts || 0;
    const passRate = totalAttempts > 0 ? Math.round((passedModules / totalAttempts) * 100) : 0;
    const avgScore = reportData.averageScore ? reportData.averageScore.toFixed(1) : '0';

    const getValue = (obj, path, defaultValue = 'N/A') => {
        return path.split('.').reduce((o, p) => (o && o[p] !== undefined ? o[p] : defaultValue), obj);
    };

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>COHT Training Assessment Report - ${getValue(reportData, 'user.name', 'Student')}</title>
        <meta charset="UTF-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; 
            background: #f0f2f5; 
            padding: 40px; 
            margin: 0 auto; 
          }
          .report-container { 
            max-width: 1100px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 20px; 
            box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); 
            overflow: hidden; 
          }
          .header { 
            background: linear-gradient(135deg, #1e664e 0%, #0f4a38 100%); 
            color: white; 
            padding: 30px 20px; 
            text-align: center; 
          }
          .header-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            max-width: 950px;
            margin: 0 auto;
          }
          .header-logo {
            height: 70px;
            width: auto;
            background: white;
            padding: 8px;
            border-radius: 12px;
            object-fit: contain;
          }
          .header-text-container { 
            flex: 1; 
            text-align: center; 
          }
          .header h1 { 
            font-size: 24px; 
            margin: 0; 
            letter-spacing: 0.5px; 
          }
          .header p { 
            opacity: 0.9; 
            font-size: 13px; 
            margin-top: 5px; 
          }
          .section { 
            padding: 28px 32px; 
            border-bottom: 1px solid #e2e8f0; 
          }
          .section-title { 
            font-size: 18px; 
            font-weight: bold; 
            color: #1e293b; 
            margin-bottom: 20px; 
            padding-bottom: 8px; 
            border-bottom: 3px solid #1e664e; 
            display: inline-block; 
          }
          .info-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
            gap: 20px; 
            margin-top: 20px; 
          }
          .info-card { 
            background: #f8fafc; 
            padding: 18px 20px; 
            border-radius: 12px; 
            border-left: 4px solid #1e664e; 
          }
          .info-card label { 
            font-size: 11px; 
            color: #64748b; 
            display: block; 
            margin-bottom: 6px; 
            text-transform: uppercase; 
            letter-spacing: 0.5px; 
            font-weight: 600; 
          }
          .info-card .value { 
            font-size: 15px; 
            font-weight: 600; 
            color: #1e293b; 
          }
          .stats-grid { 
            display: grid; 
            grid-template-columns: repeat(4, 1fr); 
            gap: 16px; 
            margin: 24px 0; 
          }
          .stat-card { 
            text-align: center; 
            padding: 24px 16px; 
            border-radius: 12px; 
          }
          .stat-card.total { 
            background: linear-gradient(135deg, #e0e7ff, #c7d2fe); 
            color: #3730a3; 
          }
          .stat-card.passed { 
            background: linear-gradient(135deg, #d1fae5, #a7f3d0); 
            color: #065f46; 
          }
          .stat-card.failed { 
            background: linear-gradient(135deg, #fee2e2, #fecaca); 
            color: #991b1b; 
          }
          .stat-card.time { 
            background: linear-gradient(135deg, #fef3c7, #fde68a); 
            color: #92400e; 
          }
          .stat-number { 
            font-size: 36px; 
            font-weight: bold; 
            margin-bottom: 8px; 
          }
          .stat-label { 
            font-size: 13px; 
            font-weight: 500; 
          }
          .module-card { 
            background: #ffffff; 
            border-radius: 12px; 
            margin-bottom: 24px; 
            overflow: hidden; 
            border: 1px solid #e2e8f0; 
            box-shadow: 0 2px 4px rgba(0,0,0,0.05); 
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .module-header { 
            padding: 16px 20px; 
            background: linear-gradient(135deg, #f8fafc, #f1f5f9); 
            border-bottom: 2px solid #1e664e; 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            flex-wrap: wrap; 
            gap: 10px; 
          }
          .module-name { 
            font-size: 16px; 
            font-weight: bold; 
            color: #1e293b; 
          }
          .module-score { 
            display: inline-block; 
            padding: 4px 12px; 
            border-radius: 20px; 
            font-size: 13px; 
            font-weight: 600; 
          }
          .score-passed { 
            background: #d1fae5; 
            color: #065f46; 
          }
          .score-failed { 
            background: #fee2e2; 
            color: #991b1b; 
          }
          .module-date {
            padding: 8px 20px;
            background: #fafbfc;
            font-size: 12px;
            color: #64748b;
            border-bottom: 1px solid #e2e8f0;
          }
          .error-table { 
            width: calc(100% - 40px); 
            border-collapse: collapse; 
            margin: 16px 20px; 
          }
          .error-table th { 
            background: #1e664e; 
            color: white; 
            padding: 12px; 
            text-align: left; 
            font-size: 12px; 
            font-weight: 600; 
          }
          .error-table td { 
            padding: 12px; 
            border-bottom: 1px solid #e2e8f0; 
            font-size: 12px; 
            vertical-align: top; 
          }
          .error-table tr:hover { 
            background: #f8fafc; 
          }
          .wrong-answer { 
            color: #dc2626; 
            font-weight: 500; 
          }
          .correct-answer { 
            color: #16a34a; 
            font-weight: 500; 
          }
          .no-errors { 
            padding: 20px; 
            text-align: center; 
            color: #16a34a; 
            background: #f0fdf4; 
            border-radius: 8px; 
            margin: 16px 20px; 
          }
          .practical-badge {
            display: inline-block;
            background: #f59e0b;
            color: white;
            font-size: 10px;
            padding: 2px 10px;
            border-radius: 12px;
            font-weight: 600;
            margin-left: 10px;
          }
          .footer { 
            text-align: center; 
            padding: 24px; 
            background: #f8fafc; 
            font-size: 11px; 
            color: #64748b; 
            border-top: 1px solid #e2e8f0; 
          }
          .no-print { 
            text-align: center; 
            margin-top: 20px; 
            padding-bottom: 40px; 
          }
          .no-print button {
            padding: 12px 30px;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-weight: bold;
            margin-right: 10px;
          }
          .no-print .print-btn {
            background: #1e664e;
            color: white;
          }
          .no-print .close-btn {
            background: #64748b;
            color: white;
          }
          @media print { 
            body { background: white; padding: 0; } 
            .no-print { display: none; } 
            .report-container { box-shadow: none; border-radius: 0; }
            .module-card { break-inside: avoid; page-break-inside: avoid; }
            .error-table { break-inside: auto; }
          }
          @media (max-width: 768px) { 
            body { padding: 20px; } 
            .stats-grid { grid-template-columns: repeat(2, 1fr); } 
            .info-grid { grid-template-columns: 1fr; } 
            .header-content { flex-direction: column; gap: 15px; }
          }
        </style>
      </head>
      <body>
        <div class="report-container">
          <!-- HEADER WITH DUAL LOGOS -->
          <div class="header">
            <div class="header-content" style="display: flex; align-items: center; justify-content: space-between; max-width: 950px; margin: 0 auto;">
              <img src="${logo01}" style="height: 70px; background: white; padding: 8px; border-radius: 12px;" />
              <div style="flex: 1; text-align: center;">
                <h1 style="font-size: 24px; margin: 0;">Training Assessment Report</h1>
                <p style="opacity: 0.9; font-size: 13px; margin-top: 5px;">Official Training Record - Generated on ${new Date().toLocaleString()}</p>
              </div>
              <img src="${logo2}" style="height: 70px; background: white; padding: 8px; border-radius: 12px;" />
            </div>
          </div>
          </div>

          <!-- TRAINEE INFORMATION -->
          <div class="section">
            <div class="section-title">📋 Trainee Information</div>
            <div class="info-grid">
              <div class="info-card">
                <label>Full Name</label>
                <div class="value">${getValue(reportData, 'user.name', 'N/A')}</div>
              </div>
              <div class="info-card">
                <label>Email Address</label>
                <div class="value">${getValue(reportData, 'user.email', 'N/A')}</div>
              </div>
              <div class="info-card">
                <label>Phone Number</label>
                <div class="value">${getValue(reportData, 'user.phone', 'N/A')}</div>
              </div>
              <div class="info-card">
                <label>Training Route</label>
                <div class="value">${getValue(reportData, 'user.trainingRoute', 'Full Access') === 'CUSTOMIZED_01' ? '🎯 Custom Selection' : getValue(reportData, 'user.trainingRoute', 'Full Access') === 'CUSTOMIZED_02' ? '🔐 Theory + Practical' : '📋 Full Access (All Modules)'}</div>
              </div>
              <div class="info-card">
                <label>Joined Date</label>
                <div class="value">${reportData.user?.joinedAt ? new Date(reportData.user.joinedAt).toLocaleDateString() : 'N/A'}</div>
              </div>
              <div class="info-card">
                <label>Report ID</label>
                <div class="value">${Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
              </div>
            </div>
          </div>

          <!-- PERFORMANCE SUMMARY -->
          <div class="section">
            <div class="section-title">📊 Performance Summary</div>
            <div class="stats-grid">
              <div class="stat-card total">
                <div class="stat-number">${totalAttempts}</div>
                <div class="stat-label">Total Attempts</div>
              </div>
              <div class="stat-card passed">
                <div class="stat-number">${passedModules}</div>
                <div class="stat-label">✅ Passed Modules</div>
              </div>
              <div class="stat-card failed">
                <div class="stat-number">${failedModules}</div>
                <div class="stat-label">❌ Failed Modules</div>
              </div>
              <div class="stat-card time">
                <div class="stat-number">${hours}h ${minutes}m</div>
                <div class="stat-label">⏱️ Total Time Spent</div>
              </div>
            </div>
            <div class="info-card" style="text-align: center; background: #f0fdf4; margin-top: 16px;">
              <label>📈 Overall Pass Rate & Average Score</label>
              <div class="value" style="font-size: 24px;">${passRate}% Pass Rate | ${avgScore}% Average Score</div>
            </div>
          </div>

          <!-- MODULE RESULTS -->
          <div class="section">
            <div class="section-title">📝 Detailed Module Results</div>
            ${(reportData.attempts || []).map(attempt => {
              const percentage = Math.round((attempt.score / 20) * 100);
              const isPractical = attempt.module?.id === 8 || attempt.module?.id === 17;
              const isPassed = attempt.passed;
              let errors = [];
              if (attempt.errors) {
                if (typeof attempt.errors === 'string') {
                  try { errors = JSON.parse(attempt.errors); } catch(e) { errors = []; }
                } else if (Array.isArray(attempt.errors)) {
                  errors = attempt.errors;
                }
              }
              return `
                <div class="module-card">
                  <div class="module-header">
                    <span class="module-name">${isPractical ? '🔐 ' : '📘 '} ${attempt.module?.name || 'Unknown Module'}${isPractical ? ' <span class="practical-badge">PRACTICAL</span>' : ''}</span>
                    <span class="module-score ${isPassed ? 'score-passed' : 'score-failed'}">
                      ${attempt.score}/20 (${percentage}%) - ${isPassed ? '✅ PASSED' : '❌ FAILED'}
                    </span>
                  </div>
                  <div class="module-date">
                    Completed: ${new Date(attempt.completedAt).toLocaleString()}
                  </div>
                  ${errors && errors.length > 0 ? `
                    <table class="error-table">
                      <thead>
                        <tr>
                          <th style="width: 8%">#</th>
                          <th style="width: 47%">Question</th>
                          <th style="width: 20%">Student's Answer</th>
                          <th style="width: 20%">Correct Answer</th>
                          <th style="width: 5%">Result</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${errors.map((err, idx) => `
                          <tr>
                            <td>${err.questionNumber || idx + 1}</td>
                            <td>${err.questionText || 'N/A'}</td>
                            <td class="wrong-answer">❌ ${err.userAnswer || 'N/A'}</td>
                            <td class="correct-answer">✅ ${err.correctAnswer || 'N/A'}</td>
                            <td>❌</td>
                          </tr>
                        `).join('')}
                      </tbody>
                    </table>
                  ` : `
                    <div class="no-errors">
                      ✅ Perfect! No incorrect answers in this module.
                    </div>
                  `}
                </div>
              `;
            }).join('')}
            ${(!reportData.attempts || reportData.attempts.length === 0) ? `
              <div style="text-align: center; padding: 40px; color: #64748b;">
                📭 No module attempts recorded yet.
              </div>
            ` : ''}
          </div>

          <!-- FOOTER -->
          <div class="footer">
            <p>This is an official training record generated by COHT Training Platform.</p>
            <p>© ${new Date().getFullYear()} Centre of Healthcare Training - All Rights Reserved</p>
            <p style="margin-top: 4px; font-size: 10px;">trainercourses.com</p>
          </div>
        </div>

        <!-- PRINT CONTROLS -->
        <div class="no-print">
          <button class="print-btn" onclick="window.print()">🖨️ Print Report / Save as PDF</button>
          <button class="close-btn" onclick="window.close()">✕ Close</button>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
  };;;

  useEffect(() => {
    if (searchTerm) {
      setFilteredStudents(registeredStudents.filter(s =>
        (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    } else {
      setFilteredStudents(registeredStudents);
    }
  }, [searchTerm, registeredStudents]);

  // ============ LOGIN SCREEN ============
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
                  placeholder="your.email@coht.co.uk" required />
                <input type="text" value={code} onChange={e => setCode(e.target.value)} 
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-center tracking-widest font-mono text-xl" 
                  placeholder="000000" maxLength="6" required />
                <button type="submit" disabled={loading} 
                  className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition">
                  {loading ? 'Verifying...' : 'Access Training'}
                </button>
              </form>
            )}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <div className="text-center mb-3"><span className="text-sm text-slate-500">Don't have an account?</span></div>
              <Link to="/register" className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold transition shadow-md">
                <UserPlus size={18} /> Register as New Student
              </Link>
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
              <button disabled={currentQuestion === 0} onClick={() => setCurrentQuestion(v => v - 1)} className="px-6 py-2 text-slate-600 disabled:opacity-30 hover:text-slate-800 transition">Previous</button>
              {currentQuestion < questions.length - 1 ? (
                <button disabled={answers[currentQuestion] === undefined} onClick={() => setCurrentQuestion(v => v + 1)} className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition">Next</button>
              ) : (
                <button disabled={Object.keys(answers).length < questions.length || loading} onClick={submitAssessment} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50">
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

  // ============ RESULTS SCREEN ============
  if (showResults && result) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-xl border border-slate-200 p-8 max-w-md text-center shadow-lg">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${result.passed ? 'bg-green-100' : 'bg-red-100'}`}>
              {result.passed ? <CheckCircle className="w-12 h-12 text-green-600" /> : <AlertCircle className="w-12 h-12 text-red-600" />}
            </div>
            <h2 className="text-2xl font-bold mb-2">{result.passed ? 'Congratulations! 🎉' : 'Not This Time 💪'}</h2>
            <p className="text-slate-600 mb-4">You scored <strong className="text-2xl">{result.score}</strong> out of <strong>{result.total}</strong></p>
            <button onClick={() => { setSelectedModule(null); setShowResults(false); fetchUserProgress(user.id); }} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">Return to Dashboard</button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ============ ADMIN DASHBOARD ============
  if (user.role !== 'TRAINEE') {
    const confirmedCount = registeredStudents.filter(s => s.paymentConfirmed).length;
    const pendingCount = registeredStudents.filter(s => !s.paymentConfirmed).length;
    const totalStudents = registeredStudents.length;

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
          <div className="flex flex-wrap gap-2 mb-6 border-b">
            <button onClick={() => setActiveTab('dashboard')} className={`px-5 py-2.5 rounded-t-lg font-medium transition-all flex items-center gap-2 ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              <LayoutDashboard size={18} /> Dashboard
            </button>
            <button onClick={() => setActiveTab('students')} className={`px-5 py-2.5 rounded-t-lg font-medium transition-all flex items-center gap-2 ${activeTab === 'students' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              <Users size={18} /> Students
            </button>
            <button onClick={() => { setActiveTab('generate'); setShowCodes(false); }} className={`px-5 py-2.5 rounded-t-lg font-medium transition-all flex items-center gap-2 ${activeTab === 'generate' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              <FileBarChart size={18} /> Generate Codes
            </button>
            <button onClick={() => setActiveTab('practical')} className={`px-5 py-2.5 rounded-t-lg font-medium transition-all flex items-center gap-2 ${activeTab === 'practical' ? 'bg-amber-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              <KeyRound size={18} /> 🔐 Practical Code
            </button>
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 flex items-center gap-2"><AlertCircle size={18} /> {error}</div>}
          {success && <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg mb-4 flex items-center gap-2"><CheckCircle size={18} /> {success}</div>}

          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
                  <button onClick={fetchRegisteredStudents} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2">
                    <RefreshCw size={16} /> Refresh
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="p-4 text-left">Name</th>
                      <th className="p-4 text-left">Email</th>
                      <th className="p-4 text-left">Phone</th>
                      <th className="p-4 text-left">Payment</th>
                      <th className="p-4 text-left">Route</th>
                      <th className="p-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map(student => (
                      <tr key={student.id} className="border-t hover:bg-gray-50">
                        <td className="p-4 font-medium">{student.name || '-'}</td>
                        <td className="p-4 text-sm">{student.email}</td>
                        <td className="p-4 text-sm font-mono">{student.phone || '-'}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${student.paymentConfirmed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {student.paymentConfirmed ? 'Confirmed' : 'Pending'}
                          </span>
                        </td>
                        <td className="p-4">
                          <select 
                            value={studentRoutes[student.id] || "FULL_ACCESS"} 
                            onChange={(e) => {
                              const newRoute = e.target.value;
                              setStudentRoutes(prev => ({ ...prev, [student.id]: newRoute }));
                              if (newRoute === "CUSTOMIZED_01" || newRoute === "CUSTOMIZED_02") {
                                setStudentCustomModules(prev => ({ ...prev, [student.id]: [] }));
                                setCurrentPickerStudent(student.id);
                                setPickerRouteType(newRoute);
                                setShowModulePicker(true);
                              }
                            }} 
                            className="text-xs border rounded px-2 py-1 bg-white focus:ring-2 focus:ring-indigo-500 w-32"
                          >
                            <option value="FULL_ACCESS">📋 Full Access</option>
                            <option value="CUSTOMIZED_01">🎯 Custom-01</option>
                            <option value="CUSTOMIZED_02">🔐 Custom-02</option>
                          </select>
                          {(studentRoutes[student.id] === "CUSTOMIZED_01" || studentRoutes[student.id] === "CUSTOMIZED_02") && (
                            <button 
                              onClick={() => { 
                                setCurrentPickerStudent(student.id); 
                                setPickerRouteType(studentRoutes[student.id] || "CUSTOMIZED_01");
                                setShowModulePicker(true); 
                              }} 
                              className="ml-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                            >
                              📋 Pick
                            </button>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-2">
                            {!student.paymentConfirmed && (
                              <button onClick={() => confirmPayment(student.id)} className="text-green-600 text-sm hover:underline">Confirm</button>
                            )}
                            {student.paymentConfirmed && (
                              <button onClick={() => generateCodeForSingleStudent(student.id)} className="text-indigo-600 text-sm hover:underline">Generate</button>
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
                {filteredStudents.length === 0 && (
                  <div className="text-center p-8 text-gray-500">No students found</div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'generate' && (
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Batch Login Code Generation</h2>
              
              <div className="mb-6 p-4 bg-slate-50 rounded-lg border">
                <label className="block font-semibold text-gray-700 mb-3">Access Level:</label>
                <div className="flex gap-6 mb-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="trainingRoute" value="FULL_ACCESS" checked={trainingRoute === "FULL_ACCESS"} 
                      onChange={() => { setTrainingRoute("FULL_ACCESS"); setSelectedCustomModules([]); }} className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm font-medium">📋 Full Access (Sequential)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="trainingRoute" value="CUSTOMIZED_01" checked={trainingRoute === "CUSTOMIZED_01"} 
                      onChange={() => setTrainingRoute("CUSTOMIZED_01")} className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm font-medium">🎯 Customized-01 (Admin Selects)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="trainingRoute" value="CUSTOMIZED_02" checked={trainingRoute === "CUSTOMIZED_02"} 
                      onChange={() => { setTrainingRoute("CUSTOMIZED_02"); setSelectedCustomModules([]); }} className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm font-medium">🔐 Customized-02 (Theory + Practical)</span>
                  </label>
                </div>

                {trainingRoute === 'CUSTOMIZED_01' && (
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
              <div className="space-y-3 mb-4">
                {studentBatch.map((student, idx) => (
                  <div key={idx} className="flex flex-wrap gap-3">
                    <input type="text" placeholder="Surname" value={student.surname} onChange={e => updateStudent(idx, 'surname', e.target.value)} className="flex-1 min-w-[120px] px-4 py-2 border rounded-lg" />
                    <input type="text" placeholder="First Name" value={student.firstName} onChange={e => updateStudent(idx, 'firstName', e.target.value)} className="flex-1 min-w-[120px] px-4 py-2 border rounded-lg" />
                    <input type="tel" placeholder="Phone (+44...)" value={student.phone} onChange={e => updateStudent(idx, 'phone', e.target.value)} className="flex-1 min-w-[150px] px-4 py-2 border rounded-lg font-mono" />
                    {studentBatch.length > 1 && <button onClick={() => removeStudentField(idx)} className="p-2 text-red-500">✕</button>}
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={addStudentField} disabled={studentBatch.length >= 20} className="px-4 py-2 border rounded-lg text-sm disabled:opacity-50">+ Add Student ({studentBatch.length}/20)</button>
                <button onClick={batchGenerateCodes} disabled={loading} className="px-6 py-2 bg-slate-900 text-white rounded-lg text-sm">Generate Codes</button>
              </div>
              {showCodes && generatedCodes.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">Generated Credentials</h3>
                    <div className="flex gap-2">
                      <button onClick={copyAllCodes} className="px-3 py-1 text-sm border rounded-lg">Copy All</button>
                      <button onClick={printCodes} className="px-3 py-1 text-sm border rounded-lg">Print</button>
                    </div>
                  </div>
                  <table className="w-full text-sm">
                    <thead><tr className="bg-slate-50"><th className="p-2">Name</th><th className="p-2">Email</th><th className="p-2">Code</th></tr></thead>
                    <tbody>{generatedCodes.map((s, idx) => <tr key={idx} className="border-t"><td className="p-2">{s.name}</td><td className="p-2 text-xs">{s.email}</td><td className="p-2"><code className="bg-slate-100 px-2 py-1 rounded">{s.code}</code></td></tr>)}</tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'practical' && (
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <KeyRound className="text-amber-600" /> Practical Access Code Management
              </h2>
              
              <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-sm text-amber-800 mb-3">
                  <strong>About Practical Codes:</strong> Modules 8 (First Aid) and 17 (Moving &amp; Handling) 
                  require a practical access code. Generate a new code below and share it with trainees.
                </p>
                <div className="flex items-center gap-2 text-xs text-amber-700">
                  <Clock size={14} />
                  <span>Code expires in 365 days</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-xl p-6 border">
                  <h3 className="font-semibold text-gray-700 mb-3">Current Practical Code</h3>
                  {practicalCode ? (
                    <div className="space-y-3">
                      <div className="bg-white rounded-lg p-4 border-2 border-amber-300">
                        <code className="text-2xl font-mono tracking-wider text-amber-700 block text-center">
                          {practicalCode}
                        </code>
                      </div>
                      {practicalCodeExpiry && (
                        <p className="text-xs text-gray-500">Expires: {new Date(practicalCodeExpiry).toLocaleDateString()}</p>
                      )}
                      <button 
                        onClick={() => navigator.clipboard.writeText(practicalCode)}
                        className="text-sm text-indigo-600 hover:underline flex items-center gap-1"
                      >
                        <Copy size={14} /> Copy Code
                      </button>
                    </div>
                  ) : (
                    <p className="text-gray-500">No active practical code. Generate one below.</p>
                  )}
                </div>

                <div className="bg-slate-50 rounded-xl p-6 border">
                  <h3 className="font-semibold text-gray-700 mb-3">Generate New Code</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Generate a new 8-character alphanumeric code. 
                    <span className="text-amber-600 font-medium"> This will invalidate the current code.</span>
                  </p>
                  <button
                    onClick={generatePracticalCode}
                    disabled={generatingPracticalCode}
                    className="w-full bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {generatingPracticalCode ? (
                      <>Generating...</>
                    ) : (
                      <><KeyRound size={18} /> Generate New Practical Code</>
                    )}
                  </button>
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    Modules 8 (First Aid) and 17 (Moving &amp; Handling)
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDeleteConfirm(false)}>
            <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
              <h3 className="text-xl font-bold mb-4">Delete Student</h3>
              <p>Type <strong className="font-mono bg-slate-100 px-2 py-1 rounded">DELETE</strong> to confirm:</p>
              <input type="text" value={deleteConfirmText} onChange={e => setDeleteConfirmText(e.target.value)} className="w-full border rounded p-2 my-2" placeholder="DELETE" />
              <div className="flex gap-3 mt-4">
                <button onClick={deleteUser} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
                <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 border rounded">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {showReportModal && reportData && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowReportModal(false)}>
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Assessment Report</h3>
                <button onClick={() => setShowReportModal(false)} className="text-gray-500">×</button>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p><strong>{reportData.user?.name}</strong></p>
                <p className="text-sm">{reportData.user?.email}</p>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-100 rounded"><div className="text-2xl font-bold">{reportData.totalAttempts || 0}</div><div className="text-xs">Attempts</div></div>
                <div className="text-center p-3 bg-green-100 rounded"><div className="text-2xl font-bold text-green-600">{reportData.passedModules || 0}</div><div className="text-xs">Passed</div></div>
                <div className="text-center p-3 bg-red-100 rounded"><div className="text-2xl font-bold text-red-600">{reportData.failedModules || 0}</div><div className="text-xs">Failed</div></div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={printReport} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">Print Report</button>
                <button onClick={() => setShowReportModal(false)} className="flex-1 bg-gray-200 py-2 rounded-lg hover:bg-gray-300 transition">Close</button>
              </div>
            </div>
          </div>
        )}

        {showStudentDetails && selectedStudentDetails && (
          <StudentDetailsPanel 
            student={selectedStudentDetails} 
            loginDetails={generatedLoginDetails} 
            onClose={() => { setShowStudentDetails(false); setSelectedStudentDetails(null); setGeneratedLoginDetails(null); }} 
            onRefresh={handleRefreshCredentials} 
          />
        )}
        
        {showModulePicker && currentPickerStudent && (
          <ModulePickerModal
            isOpen={showModulePicker}
            onClose={() => { setShowModulePicker(false); setCurrentPickerStudent(null); }}
            studentId={currentPickerStudent}
            studentName={registeredStudents.find(s => s.id === currentPickerStudent)?.name || 'Student'}
            availableModules={allModulesList}
            selectedModules={studentCustomModules[currentPickerStudent] || []}
            onSave={(studentId, modules) => {
              setStudentCustomModules(prev => ({ ...prev, [studentId]: modules }));
              setSuccess(`✅ ${modules.length} modules selected`);
              setTimeout(() => setSuccess(''), 3000);
            }}
            routeType={pickerRouteType}
          />
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
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            <div>
              <h1 className="font-bold text-slate-800">Trainee Dashboard</h1>
              <p className="text-xs text-slate-500">{user.name || user.email}</p>
            </div>
          </div>
          <button onClick={() => setUser(null)} className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
      
      <div className="flex-1 max-w-7xl mx-auto p-6">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-xl p-6 mb-8 text-white shadow-lg">
          <h2 className="text-2xl font-bold mb-1">Welcome back, {user.name || 'Trainee'}! 🎉</h2>
          <p className="text-indigo-100">Complete your mandatory training assessments</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-xl border p-5"><div className="text-2xl font-bold text-indigo-600">{stats.total}</div><p className="text-sm">Total Modules</p></div>
          <div className="bg-white rounded-xl border p-5"><div className="text-2xl font-bold text-green-600">{stats.completed}</div><p className="text-sm">Completed ✅</p></div>
          <div className="bg-white rounded-xl border p-5"><div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div><p className="text-sm">In Progress</p></div>
          <div className="bg-white rounded-xl border p-5"><div className="text-2xl font-bold text-slate-400">{stats.locked}</div><p className="text-sm">Locked 🔒</p></div>
        </div>

        <h2 className="text-xl font-bold text-slate-800 mb-4">📚 Training Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {modules.filter(m => m.id !== 8 && m.id !== 17).map(m => {
            const status = getModuleStatus(m.id);
            return (
              <div key={m.id} className="bg-white rounded-xl border p-5 hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold">{m.name}</h3>
                    <p className="text-xs text-slate-500">Pass: {m.passMark}/20 (75%)</p>
                  </div>
                  {status === 'completed' && <CheckCircle className="text-green-500 w-5 h-5" />}
                  {status === 'available' && <PlayCircle className="text-blue-500 w-5 h-5" />}
                  {status === 'locked' && <Lock className="text-gray-400 w-5 h-5" />}
                </div>
                
                <div className="mb-3">
                  {status === 'completed' && <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">✅ Completed</span>}
                  {status === 'available' && <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">Available</span>}
                  {status === 'locked' && <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-500">🔒 Locked</span>}
                </div>
                
                {status === 'available' && (
                  <button onClick={() => startModule(m)} className="w-full mt-2 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">Start Module →</button>
                )}
                {status === 'locked' && (
                  <button disabled className="w-full mt-2 bg-gray-100 text-gray-400 py-2 rounded-lg cursor-not-allowed">
                    {user?.trainingRoute === 'CUSTOMIZED_01' ? '🚫 Not in your selection' : '🔒 Complete Previous First'}
                  </button>
                )}
                {status === 'completed' && (
                  <div className="w-full mt-2 bg-green-50 text-green-600 py-2 rounded-lg text-center">✅ Completed</div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 pt-8 border-t-2 border-slate-200">
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-amber-900 flex items-center gap-2 mb-2">
              <Lock className="w-5 h-5" /> Final Practical Assessment
            </h2>
            <p className="text-amber-700 text-sm mb-6">
              Modules 8 (First Aid) &amp; 17 (Manual Handling) are only accessible after passing all 21 theory modules.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {modules.filter(m => m.id === 8 || m.id === 17).map(m => {
                const status = getModuleStatus(m.id);
                return (
                  <div key={m.id} className="bg-white rounded-xl border p-5 hover:shadow-lg transition">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">{m.name}</h3>
                        <p className="text-xs text-slate-500">Pass: {m.passMark}/20 (75%)</p>
                      </div>
                      {status === 'completed' && <CheckCircle className="text-green-500 w-5 h-5" />}
                      {status === 'available' && <PlayCircle className="text-blue-500 w-5 h-5" />}
                      {status === 'practical_locked' && <KeyRound className="text-amber-500 w-5 h-5" />}
                      {status === 'locked' && <Lock className="text-gray-400 w-5 h-5" />}
                    </div>
                    
                    <div className="mb-3">
                      {status === 'completed' && <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">✅ Completed</span>}
                      {status === 'available' && <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">Available</span>}
                      {status === 'practical_locked' && (
                        <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700 flex items-center gap-1">
                          <KeyRound size={12} /> 🔐 Practical Code Required
                        </span>
                      )}
                      {status === 'locked' && <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-500">🔒 Locked</span>}
                    </div>
                    
                    {status === 'available' && (
                      <button onClick={() => startModule(m)} className="w-full mt-2 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">Start Module →</button>
                    )}
                    {status === 'practical_locked' && (
                      <button onClick={() => requestPracticalCode(m)} className="w-full mt-2 bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition flex items-center justify-center gap-2">
                        <KeyRound size={16} /> Enter Practical Code
                      </button>
                    )}
                    {status === 'locked' && (
                      <button disabled className="w-full mt-2 bg-gray-100 text-gray-400 py-2 rounded-lg cursor-not-allowed">
                        Complete All Theory First
                      </button>
                    )}
                    {status === 'completed' && (
                      <div className="w-full mt-2 bg-green-50 text-green-600 py-2 rounded-lg text-center">✅ Completed</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
      
      {showPracticalModal && pendingPracticalModule && (
        <PracticalCodeModal
          isOpen={showPracticalModal}
          onClose={() => { setShowPracticalModal(false); setPendingPracticalModule(null); }}
          moduleId={pendingPracticalModule.id}
          moduleName={practicalModuleName}
          userId={user.id}
          onSuccess={handlePracticalCodeSuccess}
          onError={handlePracticalCodeError}
          onRefreshModules={() => fetchModules(user.id)}
        />
      )}
    </div>
  );
}

export default App;
