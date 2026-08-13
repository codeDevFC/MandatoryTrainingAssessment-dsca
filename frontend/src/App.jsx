import React, { useState, useEffect } from 'react';
import { 
 LogOut, BookOpen, ChevronLeft, ChevronRight, CheckCircle, AlertCircle, 
 Users, Shield, Mail, Key, Eye, EyeOff, Plus, Trash2, Copy, Printer, 
 Search, GraduationCap, CheckSquare, Square, X, Clock, Award, UserCheck, 
 FileSpreadsheet, AlertTriangle, PlayCircle, Lock, CreditCard, Send, 
 MessageCircle, UserPlus, RefreshCw, LayoutDashboard, FileBarChart,
 KeyRound, Star, ChevronDown, ChevronUp, Unlock
} from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import StudentDetailsPanel from './components/StudentDetailsPanel';
import PracticalCodeModal from './components/PracticalCodeModal';
import ModulePickerModal from './components/ModulePickerModal';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

// Module section definitions
const FULL_ACCESS_IDS = [1,2,3,4,6,7,8,10,11,12,14,15,16,17,18,19,21,22,23];
const PRACTICAL_IDS = [8,17];
const EXTRA_ADD_ON_IDS = [5,9,13,20];

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

 // ===== FETCH FUNCTIONS =====
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
     const currentModules = studentCustomModules[studentId] || [];
     if (currentModules.length === 0) {
       const allModuleIds = allModulesList.map(m => m.id);
       setStudentCustomModules(prev => ({ ...prev, [studentId]: allModuleIds }));
     }
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

 // ===== PRACTICAL CODE HANDLERS =====
 const handlePracticalCodeSuccess = () => {
   setSuccess('Practical code verified! You can now access the module.');
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
       setSuccess(`New practical code generated: ${data.code}`);
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

 // ===== LOGIN HANDLERS =====
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

 // ===== MODULE ASSESSMENT =====
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
     if (user?.role === 'TRAINEE') {
       await fetchUserProgress(user.id);
       await fetchModules(user.id);
     } else {
       await fetchRegisteredStudents();
     }
   } catch (err) {
     setError('Submission failed');
   } finally {
     setLoading(false);
   }
 };

 // ===== GET MODULE STATUS =====
 const getModuleStatus = (moduleId) => {
   if (user?.role !== 'TRAINEE') return 'available';
   
   const route = user?.trainingRoute || 'FULL_ACCESS';
   const progress = userProgress.progress || [];
   const moduleProgress = progress.find(x => x.moduleId === moduleId);
   
   if (moduleProgress?.status === 'passed') return 'completed';
   
   const isPractical = moduleId === 8 || moduleId === 17;
   
   // CUSTOMIZED_01: ALL selected modules available immediately
   if (route === 'CUSTOMIZED_01') {
     let selectedModules = [];
     if (user?.selectedModules) {
       try {
         selectedModules = typeof user.selectedModules === 'string' 
           ? JSON.parse(user.selectedModules) 
           : user.selectedModules;
       } catch (e) {
         selectedModules = [];
       }
     }
     if (selectedModules.length === 0) return 'available';
     if (!selectedModules.includes(moduleId)) return 'locked';
     return 'available';
   }
   
   // CUSTOMIZED_02: Theory sequential, practical requires all theory passed
   if (route === 'CUSTOMIZED_02') {
     if (isPractical) {
       const theoryModules = [1,2,3,4,5,6,7,9,10,11,12,13,14,15,16,18,19,20,21,22,23];
       const allTheoryPassed = theoryModules.every(id => {
         const p = progress.find(x => x.moduleId === id);
         return p?.status === 'passed';
       });
       if (!allTheoryPassed) return 'locked';
       let practicalModules = {};
       if (user?.practicalModules) {
         try {
           practicalModules = typeof user.practicalModules === 'string' 
             ? JSON.parse(user.practicalModules) 
             : user.practicalModules;
         } catch (e) { practicalModules = {}; }
       }
       if (practicalModules[moduleId]?.completed) return 'available';
       return 'practical_locked';
     } else {
       if (moduleId === 1) return 'available';
       let prevId = moduleId - 1;
       while (prevId === 8 || prevId === 17) prevId--;
       if (prevId < 1) return 'available';
       const prevProgress = progress.find(x => x.moduleId === prevId);
       if (prevProgress?.status === 'passed') return 'available';
       return 'locked';
     }
   }
   
   // FULL_ACCESS: Sequential unlocking
   const currentIndex = FULL_ACCESS_IDS.indexOf(moduleId);
   if (moduleId === 1 || currentIndex === 0) return 'available';
   
   if (currentIndex === -1) {
     if (EXTRA_ADD_ON_IDS.includes(moduleId)) return 'available';
     if (PRACTICAL_IDS.includes(moduleId)) {
       const allFullAccessPassed = FULL_ACCESS_IDS.every(id => {
         const p = progress.find(x => x.moduleId === id);
         return p?.status === 'passed';
       });
       if (!allFullAccessPassed) return 'locked';
       let practicalModules = {};
       if (user?.practicalModules) {
         try {
           practicalModules = typeof user.practicalModules === 'string' 
             ? JSON.parse(user.practicalModules) 
             : user.practicalModules;
         } catch (e) { practicalModules = {}; }
       }
       if (practicalModules[moduleId]?.completed) return 'available';
       return 'practical_locked';
     }
     return 'locked';
   }
   
   const prevModuleId = FULL_ACCESS_IDS[currentIndex - 1];
   const prevProgress = progress.find(x => x.moduleId === prevModuleId);
   if (prevProgress?.status === 'passed') return 'available';
   return 'locked';
 };

 // ===== ADMIN FUNCTIONS =====
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

 // ===== PRINT REPORT FUNCTION - SHOWS ALL 20 QUESTIONS =====
 const printReport = () => {
   if (!reportData) return;

   const printWindow = window.open("", "_blank");
   if (!printWindow) {
     alert("Please allow popups to print the report");
     return;
   }

   const totalDuration = reportData.totalTimeSpent || 0;
   const hours = Math.floor(totalDuration / 3600);
   const minutes = Math.floor((totalDuration % 3600) / 60);
   const passedModules = reportData.passedModules || 0;
   const failedModules = reportData.failedModules || 0;
   const totalAttempts = reportData.totalAttempts || 0;
   const passRate = totalAttempts > 0 ? Math.round((passedModules / totalAttempts) * 100) : 0;

   const esc = (str) => {
     if (str === null || str === undefined) return "N/A";
     return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
   };

   const studentName = esc(reportData.user?.name || "N/A");
   const studentEmail = esc(reportData.user?.email || "N/A");
   const studentPhone = esc(reportData.user?.phone || "N/A");
   const studentRole = esc(reportData.user?.role || "Trainee");
   const reportTrainingRoute = esc(reportData.user?.trainingRoute || "Full Access");

   let html = "";
   html += "<!DOCTYPE html>";
   html += "<html>";
   html += "<head>";
   html += "<title>COHT Training Assessment Report - " + studentName + "</title>";
   html += "<meta charset='UTF-8'>";
   html += "<style>";
   html += "* { margin: 0; padding: 0; box-sizing: border-box; }";
   html += "body { font-family: 'Segoe UI', Arial, sans-serif; background: #f0f2f5; padding: 40px; margin: 0 auto; }";
   html += ".report-container { max-width: 1100px; margin: 0 auto; background: white; border-radius: 20px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); overflow: hidden; }";
   html += ".header { background: linear-gradient(135deg, #1e664e 0%, #0f4a38 100%); color: white; padding: 30px 20px; text-align: center; }";
   html += ".header h1 { font-size: 24px; margin: 0; letter-spacing: 0.5px; }";
   html += ".header p { opacity: 0.9; font-size: 13px; margin-top: 5px; }";
   html += ".section { padding: 28px 32px; border-bottom: 1px solid #e2e8f0; }";
   html += ".section-title { font-size: 18px; font-weight: bold; color: #1e293b; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 3px solid #1e664e; display: inline-block; }";
   html += ".info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-top: 20px; }";
   html += ".info-card { background: #f8fafc; padding: 18px 20px; border-radius: 12px; border-left: 4px solid #1e664e; }";
   html += ".info-card label { font-size: 11px; color: #64748b; display: block; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; }";
   html += ".info-card .value { font-size: 15px; font-weight: 600; color: #1e293b; }";
   html += ".stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 24px 0; }";
   html += ".stat-card { text-align: center; padding: 24px 16px; border-radius: 12px; }";
   html += ".stat-card.total { background: linear-gradient(135deg, #e0e7ff, #c7d2fe); color: #3730a3; }";
   html += ".stat-card.passed { background: linear-gradient(135deg, #d1fae5, #a7f3d0); color: #065f46; }";
   html += ".stat-card.failed { background: linear-gradient(135deg, #fee2e2, #fecaca); color: #991b1b; }";
   html += ".stat-card.time { background: linear-gradient(135deg, #fef3c7, #fde68a); color: #92400e; }";
   html += ".stat-number { font-size: 36px; font-weight: bold; margin-bottom: 8px; }";
   html += ".stat-label { font-size: 13px; font-weight: 500; }";
   html += ".module-card { background: #ffffff; border-radius: 12px; margin-bottom: 24px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.05); page-break-inside: avoid; break-inside: avoid; }";
   html += ".module-header { padding: 16px 20px; background: linear-gradient(135deg, #f8fafc, #f1f5f9); border-bottom: 2px solid #1e664e; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; }";
   html += ".module-name { font-size: 16px; font-weight: bold; color: #1e293b; }";
   html += ".module-score { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 600; }";
   html += ".score-passed { background: #d1fae5; color: #065f46; }";
   html += ".score-failed { background: #fee2e2; color: #991b1b; }";
   html += ".module-date { padding: 8px 20px; background: #fafbfc; font-size: 12px; color: #64748b; border-bottom: 1px solid #e2e8f0; }";
   html += ".question-table { width: calc(100% - 40px); border-collapse: collapse; margin: 16px 20px; }";
   html += ".question-table th { background: #1e664e; color: white; padding: 12px; text-align: left; font-size: 12px; font-weight: 600; }";
   html += ".question-table td { padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px; vertical-align: top; }";
   html += ".question-table tr.correct { background: #f0fdf4; }";
   html += ".question-table tr.incorrect { background: #fef2f2; }";
   html += ".answer-correct { color: #16a34a; font-weight: 600; }";
   html += ".answer-incorrect { color: #dc2626; font-weight: 600; }";
   html += ".no-questions { padding: 20px; text-align: center; color: #64748b; background: #f8fafc; border-radius: 8px; margin: 16px 20px; }";
   html += ".footer { text-align: center; padding: 24px; background: #f8fafc; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; }";
   html += "@media print { body { background: white; padding: 0; } .no-print { display: none; } .module-card { break-inside: avoid; page-break-inside: avoid; } }";
   html += "@media (max-width: 768px) { body { padding: 20px; } .stats-grid { grid-template-columns: repeat(2, 1fr); } .info-grid { grid-template-columns: 1fr; } }";
   html += "</style>";
   html += "</head>";
   html += "<body>";
   html += '<div class="report-container">';
   html += '<div class="header">';
   html += "<h1>COHT Training Assessment Report</h1>";
   html += "<p>Official Training Record - Generated on " + new Date().toLocaleString() + "</p>";
   html += "</div>";
   html += '<div class="section">';
   html += '<div class="section-title">Trainee Information</div>';
   html += '<div class="info-grid">';
   html += '<div class="info-card"><label>Full Name</label><div class="value">' + studentName + "</div></div>";
   html += '<div class="info-card"><label>Email</label><div class="value">' + studentEmail + "</div></div>";
   html += '<div class="info-card"><label>Phone</label><div class="value">' + studentPhone + "</div></div>";
   html += '<div class="info-card"><label>Role</label><div class="value">' + studentRole + "</div></div>";
   html += '<div class="info-card"><label>Training Route</label><div class="value">' + (reportTrainingRoute === "CUSTOM" ? "Custom Selection" : "Full Access") + "</div></div>";
   html += '<div class="info-card"><label>Report ID</label><div class="value">' + Math.random().toString(36).substr(2, 8).toUpperCase() + "</div></div>";
   html += "</div>";
   html += "</div>";
   html += '<div class="section">';
   html += '<div class="section-title">Performance Summary</div>';
   html += '<div class="stats-grid">';
   html += '<div class="stat-card total"><div class="stat-number">' + totalAttempts + '</div><div class="stat-label">Total Attempts</div></div>';
   html += '<div class="stat-card passed"><div class="stat-number">' + passedModules + '</div><div class="stat-label">Passed</div></div>';
   html += '<div class="stat-card failed"><div class="stat-number">' + failedModules + '</div><div class="stat-label">Failed</div></div>';
   html += '<div class="stat-card time"><div class="stat-number">' + hours + "h " + minutes + 'm</div><div class="stat-label">Total Time</div></div>';
   html += "</div>";
   html += '<div class="info-card" style="text-align: center; background: #f0fdf4; margin-top: 16px;">';
   html += "<label>Overall Pass Rate</label>";
   html += '<div class="value" style="font-size: 24px;">' + passRate + "% Pass Rate</div>";
   html += "</div>";
   html += "</div>";
   html += '<div class="section">';
   html += '<div class="section-title">Module Results - Full Question Breakdown</div>';

   const attempts = reportData.attempts || [];
   if (attempts.length === 0) {
     html += '<div style="text-align: center; padding: 40px; color: #64748b;">No module attempts recorded yet.</div>';
   } else {
     attempts.forEach(function(attempt) {
       const percentage = Math.round((attempt.score / 20) * 100);
       const isPassed = attempt.passed;
       const moduleName = esc(attempt.module?.name || "Unknown Module");
       const completedAt = attempt.completedAt ? new Date(attempt.completedAt).toLocaleString() : "N/A";

       let allQuestions = [];
       if (attempt.detailedAnswers) {
         if (typeof attempt.detailedAnswers === "string") {
           try { allQuestions = JSON.parse(attempt.detailedAnswers); } catch(e) { allQuestions = []; }
         } else if (Array.isArray(attempt.detailedAnswers)) {
           allQuestions = attempt.detailedAnswers;
         }
       }

       if (allQuestions.length === 0 && attempt.errors) {
         let errors = [];
         if (typeof attempt.errors === "string") {
           try { errors = JSON.parse(attempt.errors); } catch(e) { errors = []; }
         } else if (Array.isArray(attempt.errors)) {
           errors = attempt.errors;
         }
         allQuestions = errors.map(function(err) {
           return {
             questionNumber: err.questionNumber || 0,
             questionText: err.questionText || "N/A",
             userAnswer: err.userAnswer || "N/A",
             correctAnswer: err.correctAnswer || "N/A",
             isCorrect: err.userAnswer === err.correctAnswer
           };
         });
       }

       if (allQuestions.length === 0 && attempt.module && attempt.answers) {
         try {
           const questions = JSON.parse(attempt.module.questions || "[]");
           const parsedAnswers = JSON.parse(attempt.answers || "{}");
           allQuestions = questions.map(function(q, idx) {
             return {
               questionNumber: idx + 1,
               questionText: q.text,
               userAnswer: q.options ? q.options[parsedAnswers[idx]] : (parsedAnswers[idx] === 0 ? "True" : "False"),
               correctAnswer: q.options ? q.options[q.correct] : (q.correct === 0 ? "True" : "False"),
               isCorrect: parsedAnswers[idx] === q.correct
             };
           });
         } catch(e) {
           allQuestions = [];
         }
       }

       html += '<div class="module-card">';
       html += '<div class="module-header">';
       html += '<span class="module-name">' + moduleName + "</span>";
       html += '<span class="module-score ' + (isPassed ? "score-passed" : "score-failed") + '">';
       html += attempt.score + "/20 (" + percentage + "%) - " + (isPassed ? "PASSED" : "FAILED");
       html += "</span>";
       html += "</div>";
       html += '<div class="module-date">Completed: ' + completedAt + "</div>";

       if (allQuestions.length > 0) {
         html += '<table class="question-table">';
         html += "<thead>";
         html += "<tr>";
         html += '<th style="width: 8%">#</th>';
         html += '<th style="width: 42%">Question</th>';
         html += '<th style="width: 20%">Your Answer</th>';
         html += '<th style="width: 20%">Correct Answer</th>';
         html += '<th style="width: 10%">Result</th>';
         html += "</tr>";
         html += "</thead>";
         html += "<tbody>";
         allQuestions.forEach(function(ans, idx) {
           const isCorrect = ans.isCorrect !== undefined ? ans.isCorrect : (ans.userAnswer === ans.correctAnswer);
           const userAns = esc(ans.userAnswer || "N/A");
           const correctAns = esc(ans.correctAnswer || "N/A");
           const qText = esc(ans.questionText || "N/A");
           html += '<tr class="' + (isCorrect ? "correct" : "incorrect") + '">';
           html += "<td>" + (idx + 1) + "</td>";
           html += "<td>" + qText + "</td>";
           html += '<td class="' + (isCorrect ? "answer-correct" : "answer-incorrect") + '">' + userAns + "</td>";
           html += '<td class="answer-correct">' + correctAns + "</td>";
           html += "<td>" + (isCorrect ? "?" : "?") + "</td>";
           html += "</tr>";
         });
         html += "</tbody>";
         html += "</table>";
       } else {
         html += '<div class="no-questions">No detailed question data available for this module.</div>';
       }
       html += "</div>";
     });
   }

   html += "</div>";
   html += '<div class="footer">';
   html += "<p>© " + new Date().getFullYear() + " Centre of Healthcare Training - All Rights Reserved</p>";
   html += '<p style="margin-top: 4px; font-size: 10px;">trainercourses.com</p>';
   html += "</div>";
   html += "</div>";
   html += '<div class="no-print">';
   html += '<button class="print-btn" onclick="window.print()">Print / Save as PDF</button>';
   html += '<button class="close-btn" onclick="window.close()">Close</button>';
   html += "</div>";
   html += "</body>";
   html += "</html>";

   printWindow.document.write(html);
   printWindow.document.close();
 };

 // ===== EFFECTS =====
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

 useEffect(() => {
   setSelectedStudents([]);
   setSelectAll(false);
 }, [registeredStudents]);

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
           <h2 className="text-2xl font-bold mb-2">{result.passed ? 'Congratulations!' : 'Not This Time'}</h2>
           <p className="text-slate-600 mb-4">You scored <strong className="text-2xl">{result.score}</strong> out of <strong>{result.total}</strong></p>
           <button onClick={() => { setSelectedModule(null); setShowResults(false); fetchUserProgress(user.id); }} 
             className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">Return to Dashboard</button>
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
           <button onClick={() => setActiveTab('students')} className={`px-5 py-2.5 rounded-t-lg font-medium transition-all flex items-center gap-2 ${activeTab === 'students' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
             <Users size={18} /> Students
           </button>
           <button onClick={() => setActiveTab('dashboard')} className={`px-5 py-2.5 rounded-t-lg font-medium transition-all flex items-center gap-2 ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
             <LayoutDashboard size={18} /> Dashboard
           </button>
           <button onClick={() => { setActiveTab('generate'); setShowCodes(false); }} className={`px-5 py-2.5 rounded-t-lg font-medium transition-all flex items-center gap-2 ${activeTab === 'generate' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
             <FileBarChart size={18} /> Generate Codes
           </button>
         </div>
         {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 flex items-center gap-2"><AlertCircle size={18} /> {error}</div>}
         {success && <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg mb-4 flex items-center gap-2"><CheckCircle size={18} /> {success}</div>}
         
         {activeTab === 'dashboard' && (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
             <div className="bg-white rounded-xl border p-6 shadow-sm">
               <div className="text-2xl font-bold">{registeredStudents.length}</div>
               <p className="text-sm text-gray-500">Total Students</p>
             </div>
             <div className="bg-white rounded-xl border p-6 shadow-sm">
               <div className="text-2xl font-bold">{confirmedCount}</div>
               <p className="text-sm text-gray-500">Payment Confirmed</p>
             </div>
             <div className="bg-white rounded-xl border p-6 shadow-sm">
               <div className="text-2xl font-bold">{pendingCount}</div>
               <p className="text-sm text-gray-500">Awaiting Payment</p>
             </div>
             <div className="bg-white rounded-xl border p-6 shadow-sm">
               <div className="text-2xl font-bold">{modules.length}</div>
               <p className="text-sm text-gray-500">Total Modules</p>
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
                   <button onClick={fetchRegisteredStudents} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2">
                     <RefreshCw size={16} /> Refresh
                   </button>
                 </div>
               </div>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full">
                 <thead className="bg-gray-50 border-b">
                   <tr>
                     <th className="p-4 w-10"><input type="checkbox" checked={selectAll} onChange={toggleSelectAll} className="w-4 h-4 text-indigo-600 rounded" /></th>
                     <th className="p-4 text-left">Name</th>
                     <th className="p-4 text-left">Email</th>
                     <th className="p-4 text-left">Phone</th>
                     <th className="p-4 text-left">Payment</th>
                     <th className="p-4 text-left">Actions</th>
                   </tr>
                 </thead>
                 <tbody>
                   {filteredStudents.map(student => (
                     <tr key={student.id} className="border-t hover:bg-gray-50">
                       <td className="p-4"><input type="checkbox" checked={selectedStudents.includes(student.id)} onChange={() => toggleStudentSelection(student.id)} className="w-4 h-4 text-indigo-600 rounded" /></td>
                       <td className="p-4 font-medium">{student.name || '-'}</td>
                       <td className="p-4 text-sm">{student.email}</td>
                       <td className="p-4 text-sm font-mono">{student.phone || '-'}</td>
                       <td className="p-4">
                         <span className={`px-2 py-1 rounded-full text-xs ${student.paymentConfirmed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                           {student.paymentConfirmed ? 'Confirmed' : 'Pending'}
                         </span>
                       </td>
                       <td className="p-4">
                         <div className="flex flex-wrap gap-2">
                           {!student.paymentConfirmed && <button onClick={() => confirmPayment(student.id)} className="text-green-600 text-sm hover:underline">Confirm Payment</button>}
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
               {filteredStudents.length === 0 && (
                 <div className="text-center p-8 text-gray-500">No students found</div>
               )}
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
                   {studentBatch.length > 1 && <button onClick={() => removeStudentField(idx)} className="p-2 text-red-500">??</button>}
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
                 <table className="w-full text-sm"><thead><tr className="bg-slate-50"><th className="p-2">Name</th><th className="p-2">Email</th><th className="p-2">Code</th></tr></thead><tbody>{generatedCodes.map((s, idx) => <tr key={idx} className="border-t"><td className="p-2">{s.name}</td><td className="p-2 text-xs">{s.email}</td><td className="p-2"><code className="bg-slate-100 px-2 py-1 rounded">{s.code}</code></td></tr>)}</tbody></table>
               </div>
             )}
           </div>
         )}
       </div>
       
       {/* Modals */}
       {showDeleteConfirm && (
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-2xl max-w-md w-full p-6">
             <h3 className="text-xl font-bold mb-4">Delete Student</h3>
             <p>Type <strong>DELETE</strong> to confirm:</p>
             <input type="text" value={deleteConfirmText} onChange={e => setDeleteConfirmText(e.target.value)} className="w-full border rounded p-2 my-2" placeholder="DELETE" />
             <div className="flex gap-3 mt-4">
               <button onClick={deleteUser} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
               <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 border rounded">Cancel</button>
             </div>
           </div>
         </div>
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
             setSuccess(`? ${modules.length} modules selected`);
             setTimeout(() => setSuccess(''), 3000);
           }}
           routeType={pickerRouteType}
         />
       )}
       
       {showStudentDetails && selectedStudentDetails && (
         <StudentDetailsPanel 
           student={selectedStudentDetails} 
           loginDetails={generatedLoginDetails} 
           onClose={() => { setShowStudentDetails(false); setSelectedStudentDetails(null); setGeneratedLoginDetails(null); }} 
           onRefresh={handleRefreshCredentials} 
         />
       )}
       
       {showReportModal && reportData && (
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto p-6">
             <div className="flex justify-between items-center mb-4">
               <h3 className="text-xl font-bold">Assessment Report</h3>
               <button onClick={() => setShowReportModal(false)} className="text-gray-500">?</button>
             </div>
             <div className="bg-gray-50 p-4 rounded-lg mb-4">
               <p><strong>{reportData.user?.name}</strong></p>
               <p className="text-sm">{reportData.user?.email}</p>
               <p className="text-sm">Phone: {reportData.user?.phone || 'N/A'}</p>
             </div>
             <div className="grid grid-cols-3 gap-4 mb-6">
               <div className="text-center p-3 bg-gray-100 rounded"><div className="text-2xl font-bold">{reportData.totalAttempts || 0}</div><div className="text-xs">Attempts</div></div>
               <div className="text-center p-3 bg-green-100 rounded"><div className="text-2xl font-bold text-green-600">{reportData.passedModules || 0}</div><div className="text-xs">Passed</div></div>
               <div className="text-center p-3 bg-red-100 rounded"><div className="text-2xl font-bold text-red-600">{reportData.failedModules || 0}</div><div className="text-xs">Failed</div></div>
             </div>
             <div className="flex gap-3 mt-6">
               <button onClick={printReport} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg">Print Report</button>
               <button onClick={() => setShowReportModal(false)} className="flex-1 bg-gray-200 py-2 rounded-lg">Close</button>
             </div>
           </div>
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
         <div className="flex items-center gap-3">
           <BookOpen className="w-6 h-6 text-indigo-600" />
           <div><h1 className="font-bold text-slate-800">Trainee Dashboard</h1><p className="text-xs text-slate-500">{user.name || user.email}</p></div>
         </div>
         <button onClick={() => setUser(null)} className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition">
           <LogOut size={16} /> Logout
         </button>
       </div>
     </div>
     <div className="flex-1 max-w-7xl mx-auto p-6">
       <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-xl p-6 mb-8 text-white shadow-lg">
         <h2 className="text-2xl font-bold mb-1">Welcome back, {user.name || 'Trainee'}! ?</h2>
         <p className="text-indigo-100">Complete your mandatory training assessments</p>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
         <div className="bg-white rounded-xl border p-5"><div className="text-2xl font-bold text-indigo-600">{stats.total}</div><p className="text-sm">Total Modules</p></div>
         <div className="bg-white rounded-xl border p-5"><div className="text-2xl font-bold text-green-600">{stats.completed}</div><p className="text-sm">Completed ?</p></div>
         <div className="bg-white rounded-xl border p-5"><div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div><p className="text-sm">In Progress</p></div>
         <div className="bg-white rounded-xl border p-5"><div className="text-2xl font-bold text-slate-400">{stats.locked}</div><p className="text-sm">Locked ?</p></div>
       </div>
       <h2 className="text-xl font-bold mb-4">? Your Modules</h2>
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
               {status === 'available' && <button onClick={() => startModule(m)} className="w-full mt-3 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">Start Module ?</button>}
               {status === 'locked' && <button disabled className="w-full mt-3 bg-gray-100 text-gray-400 py-2 rounded-lg cursor-not-allowed">Complete Previous First</button>}
               {status === 'completed' && <div className="w-full mt-3 bg-green-50 text-green-600 py-2 rounded-lg text-center">? Completed</div>}
             </div>
           );
         })}
       </div>
     </div>
     <Footer />
     
     {/* Practical Code Modal */}
     {showPracticalModal && pendingPracticalModule && (
       <PracticalCodeModal
         isOpen={showPracticalModal}
         onClose={() => { setShowPracticalModal(false); setPendingPracticalModule(null); }}
         moduleId={pendingPracticalModule.id}
         moduleName={practicalModuleName}
         userId={user.id}
         onSuccess={handlePracticalCodeSuccess}
         onError={handlePracticalCodeError}
       />
     )}
   </div>
 );
}

export default App;
