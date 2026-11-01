import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, User, ArrowLeft } from 'lucide-react';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

export default function AttendanceForm() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [form, setForm] = useState({
        learnerName: '', learnerPhone: '', trainerName: '',
        sessionDate: new Date().toISOString().slice(0,10), arrivalTime: '', departureTime: '',
        lateFlag: false, lateReason: '', noShowFlag: false, trainerNotes: '', selectedCourses: []
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [recordId, setRecordId] = useState('');

    useEffect(() => {
        fetch(`${API_URL}/api/courses`).then(r => r.json()).then(data => setCourses(Array.isArray(data) ? data : [])).catch(err => console.error(err));
    }, []);

    const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
    
    const toggleCourse = (title) => {
        setForm(p => {
            const selected = p.selectedCourses.includes(title) ? p.selectedCourses.filter(c => c !== title) : [...p.selectedCourses, title];
            return { ...p, selectedCourses: selected };
        });
    };
    
    const selectAll = () => setForm(p => ({ ...p, selectedCourses: courses.map(c => c.title) }));
    const clearAll = () => setForm(p => ({ ...p, selectedCourses: [] }));

    const submit = async (e) => {
        e.preventDefault(); 
        if (form.selectedCourses.length === 0) { setError('Please select at least one course.'); return; }
        setSubmitting(true); setError('');
        const payloads = form.selectedCourses.map(course => ({
            learnerName: form.learnerName, learnerPhone: form.learnerPhone, trainerName: form.trainerName,
            sessionDate: form.sessionDate, arrivalTime: form.arrivalTime, departureTime: form.departureTime,
            lateFlag: form.lateFlag, lateReason: form.lateReason, noShowFlag: form.noShowFlag,
            trainerNotes: form.trainerNotes, courseName: course
        }));
        try {
            let lastId = '';
            for (const payload of payloads) {
                const res = await fetch(`${API_URL}/api/attendance`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Failed');
                lastId = data.attendanceId;
            }
            setRecordId(`${lastId} (${payloads.length} courses)`);
        } catch (err) { setError(err.message); } finally { setSubmitting(false); }
    };

    if (recordId) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            {/* Navigation Button */}
            <div className="fixed top-4 left-4 z-50 print:hidden">
                {window.location.pathname.startsWith('/admin/') ? (
                    <Link to="/admin" className="flex items-center gap-2 bg-white text-slate-700 px-4 py-2 rounded-lg shadow-md border border-slate-200 hover:bg-slate-50 transition font-medium text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                        Back to Data Hub
                    </Link>
                ) : (
                    <Link to="/" className="flex items-center gap-2 bg-white text-slate-700 px-4 py-2 rounded-lg shadow-md border border-slate-200 hover:bg-slate-50 transition font-medium text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                        Back to Home
                    </Link>
                )}
            </div>

            

            
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
            
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6 mt-8">
                <div className="mb-4">
                    <Link to="/" className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-[#1E664E] transition">← Back</Link>
                </div>
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
                            <label className="block">
                                <span className="text-xs font-medium text-slate-500">Trainer Name</span>
                                <input type="text" placeholder="Your name" value={form.trainerName} onChange={set('trainerName')} className="mt-1 w-full border rounded-lg p-2" />
                            </label>
                            <label className="block">
                                <span className="text-xs font-medium text-slate-500">Session Date *</span>
                                <input required type="date" value={form.sessionDate} onChange={set('sessionDate')} className="mt-1 w-full border rounded-lg p-2" />
                            </label>
                        </div>
                    </div>

                    <div className="border rounded-xl p-4">
                        <div className="flex justify-between items-center mb-3 border-b pb-2">
                            <h3 className="text-sm font-semibold">2. Courses Attended *</h3>
                            <div className="flex gap-2">
                                <button type="button" onClick={selectAll} className="text-xs bg-[#1E664E] text-white px-3 py-1 rounded hover:bg-[#0F4A38]">Select All</button>
                                <button type="button" onClick={clearAll} className="text-xs bg-slate-200 text-slate-700 px-3 py-1 rounded hover:bg-slate-300">Clear</button>
                            </div>
                        </div>
                        <div className="max-h-64 overflow-y-auto space-y-1 pr-2">
                            {courses.length === 0 ? (
                                <p className="text-sm text-slate-400">Loading courses...</p>
                            ) : (
                                courses.map(c => (
                                    <label key={c.id} className="flex items-start gap-2 cursor-pointer hover:bg-slate-50 p-1.5 rounded transition">
                                        <input type="checkbox" checked={form.selectedCourses.includes(c.title)} onChange={() => toggleCourse(c.title)} className="mt-0.5 w-4 h-4 text-[#1E664E] rounded border-slate-300 focus:ring-[#1E664E]" />
                                        <span className="text-sm text-slate-700">{c.title}</span>
                                    </label>
                                ))
                            )}
                        </div>
                        <p className="text-xs font-medium text-emerald-700 mt-3 bg-emerald-50 p-2 rounded">Selected: {form.selectedCourses.length} course(s)</p>
                    </div>

                    <div className="bg-slate-50 border rounded-xl p-4">
                        <h3 className="text-sm font-semibold mb-3">3. Time & Status</h3>
                        <div className="grid grid-cols-2 gap-4 mb-3">
                            <label className="block">
                                <span className="text-xs font-medium text-slate-500">Arrival Time</span>
                                <input type="time" value={form.arrivalTime} onChange={set('arrivalTime')} className="mt-1 w-full border rounded-lg p-2" />
                            </label>
                            <label className="block">
                                <span className="text-xs font-medium text-slate-500">Departure Time</span>
                                <input type="time" value={form.departureTime} onChange={set('departureTime')} className="mt-1 w-full border rounded-lg p-2" />
                            </label>
                        </div>
                        <div className="flex gap-6">
                            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.lateFlag} onChange={set('lateFlag')} className="w-4 h-4 rounded" /> Late?</label>
                            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.noShowFlag} onChange={set('noShowFlag')} className="w-4 h-4 rounded" /> No Show?</label>
                        </div>
                    </div>

                    <button type="submit" disabled={submitting || form.selectedCourses.length === 0} className="w-full bg-[#1E664E] text-white py-3 rounded-xl font-semibold hover:bg-[#0F4A38] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md">
                        {submitting ? 'Saving...' : `Save Attendance for ${form.selectedCourses.length} Course(s)`}
                    </button>
                </form>
            </div>
        </div>
    );
}
