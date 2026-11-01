import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Register from './Register'
import './index.css'
import DiscoveryForm from './DiscoveryForm'
import RiskLogForm from './RiskLogForm'
import AttendanceForm from './AttendanceForm'
import FAQForm from './FAQForm'
import AdminDashboard from './AdminDashboard'
import CourseManager from './CourseManager'

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/register" element={<Register />} />
        
        {/* Public Trainee Routes */}
        <Route path="/discovery" element={<DiscoveryForm />} />
        <Route path="/risk-log" element={<RiskLogForm />} />
        <Route path="/attendance" element={<AttendanceForm />} />
        <Route path="/faq" element={<FAQForm />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/courses" element={<CourseManager />} />
        
        {/* Dedicated Admin Form Routes for correct navigation */}
        <Route path="/admin/discovery" element={<DiscoveryForm />} />
        <Route path="/admin/attendance" element={<AttendanceForm />} />
        <Route path="/admin/risk-log" element={<RiskLogForm />} />
        <Route path="/admin/faq" element={<FAQForm />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
