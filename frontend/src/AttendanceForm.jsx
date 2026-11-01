import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Clock, ArrowLeft } from 'lucide-react';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

export default function AttendanceForm() {
    const location = useLocation();
    const isAdminView = location.pathname.startsWith('/admin');
    const [courses, setCourses] = useState([]);
    const [form, setForm] = useState({ learnerName: '', learnerPhone: '', trainerName: '', sessionDate: new Date().toISOString().slice(0,10), arrivalTime: '', departureTime: '', lateFlag: false, lateReason: '', noShowFlag: false, trainerNotes: '', selectedCourses: [] });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [recordId, setRecordId] = useState('');

    useEffect(() => { fetch(`${API_URL}/api/courses`).then(r => r.json()).then(data => setCourses(Array.isArray(data) ? data : [])).catch(err => console.error(err)); }, []);
    const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
    const toggleCourse = (title) => setForm(p => ({ ...p, selectedCourses: p.selectedCourses.includes(title) ? p.selectedCourses.filter(c => c !== title) : [...p.selectedCourses, title] }));

    const submit = async (e) => {
        e.preventDefault(); 
        if (form.selectedCourses.length === 0) { setError('Please select at least one course.'); return; }
        setSubmitting(true); setError('');
        try {
            let lastId = '';
            for (const course of form.selectedCourses) {
                const payload = { ...form, courseName: course };
                const res = await fetch(`${API_URL}/api/attendance`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Failed');
                lastId = data.attendanceId;
            }
            setRecordId(`${lastId} (${form.selectedCourses.length} courses)`);
        } catch (err) { setError(err.message); } finally { setSubmitting(false); }
    };

    const renderTopLink = () => isAdminView ? (
        <div className="fixed top-4 left-4 z-50 print:hidden">
            <Link to="/admin" className="flex items-center gap-2 bg-white text-slate-700 px-4 py-2 rounded-lg shadow-md border border-slate-200 hover:bg-slate-50 transition font-medium text-sm">
                <ArrowLeft size={16} /> Back to Data Hub
            </Link>
        </div>
    ) : null;

    if (recordId) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            {renderTopLink()}
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h1 className="text-2xl font-bold mb-2">Attendance Logged</h1>
                <p className="text-xl font-mono font-bold text-emerald-800 mb-6">{recordId}</p>
                <div className="flex gap-3 justify-center">
                    <button onClick={() => setRecordId('')} className="px-5 py-2 bg-[#1E664E] text-white rounded-lg">Log Another</button>
                    <Link to="/" className="px-5 py-2 bg-slate-200 rounded-lg">Home</Link>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4">
            {renderTopLink()}
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6 mt-8">
                <div className="flex items-center gap-2 mb-6 border-b pb-4">
                    <Clock className="w-6 h-6 text-[#1E664E]" />
                    <h1 className="text-2xl font-bold text-[#1E664E]">Trainer Check-in</h1>
                </div>
                {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>}
                <form onSubmit={submit} className="space-y-5">
                    <div className="bg-slate-50 border rounded-xl p-4">
                        <h3 className="text-sm font-semibold mb-3">1. Learner Details</h3>
                        <div className="grid grid-cols-2 gap-4 mb-3">
                            <input required type="text" placeholder="Learner Full Name" value={form.learnerName} onChange={set('learnerName')} className="w-full border rounded-lg p-2" />
                            <input type="tel" placeholder="Phone Number (optional)" value={form.learnerPhone} onChange={set('learnerPhone')} className="w-full border rounded-lg p-2" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <label className="block"><span className="text-xs font-medium text-slate-500">Trainer Name</span><input type="text" placeholder="Your name" value={form.trainerName} onChange={set('trainerName')} className="mt-1 w-full border rounded-lg p-2" /></label>
                            <label className="block"><span className="text-xs font-medium text-slate-500">Session Date *</span><input required type="date" value={form.sessionDate} onChange={set('sessionDate')} className="mt-1 w-full border rounded-lg p-2" /></label>
                        </div>
                    </div>
                    <div className="border rounded-xl p-4">
                        <div className="flex justify-between items-center mb-3 border-b pb-2">
                            <h3 className="text-sm font-semibold">2. Courses Attended *</h3>
                        </div>
                        <div className="max-h-64 overflow-y-auto space-y-1 pr-2">
                            {courses.map(c => (
                                <label key={c.id} className="flex items-start gap-2 cursor-pointer hover:bg-slate-50 p-1.5 rounded transition">
                                    <input type="checkbox" checked={form.selectedCourses.includes(c.title)} onChange={() => toggleCourse(c.title)} className="mt-0.5 w-4 h-4 text-[#1E664E] rounded" />
                                    <span className="text-sm text-slate-700">{c.title}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <button type="submit" disabled={submitting || form.selectedCourses.length === 0} className="w-full bg-[#1E664E] text-white py-3 rounded-xl font-semibold hover:bg-[#0F4A38] transition disabled:opacity-50">
                        {submitting ? 'Saving...' : `Save Attendance for ${form.selectedCourses.length} Course(s)`}
                    </button>
                </form>
            </div>
        </div>
    );
}
