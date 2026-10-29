import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import App from "./App"
import Register from "./Register"
import "./index.css"
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
        <Route path="/discovery" element={<DiscoveryForm />} />
        <Route path="/risk-log" element={<RiskLogForm />} />
        <Route path="/attendance" element={<AttendanceForm />} />
        <Route path="/faq" element={<FAQForm />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/courses" element={<CourseManager />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)