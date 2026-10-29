import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo01 from './assets/logo01.jpg';
import logo2 from './assets/logo2.jpg';
import { CheckCircle, AlertCircle, Printer, Download, ArrowLeft } from 'lucide-react';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

export default function AttendanceForm() {
    const [form, setForm] = useState({ enrollmentId: '', learnerId: '', sessionDate: new Date().toISOString().slice(0,10), arrivalTime: '', departureTime: '', lateFlag: false, lateReason: '', noShowFlag: false, trainerNotes: '' });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [recordId, setRecordId] = useState('');
    const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

    const submit = async (e) => {
        e.preventDefault(); setSubmitting(true); setError('');
        try {
            const res = await fetch(`${API_URL}/api/attendance`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed');
            setRecordId(data.attendanceId);
        } catch (err) { setError(err.message); } finally { setSubmitting(false); }
    };

    if (recordId) return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 text-center">
            <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h1 className="text-2xl font-bold mb-2">Attendance Saved</h1>
                <p className="text-4xl font-mono font-bold text-emerald-800 mb-6">{recordId}</p>
                <div className="flex gap-3 justify-center">
                    <button onClick={() => window.print()} className="px-5 py-2 bg-[#1E664E] text-white rounded-lg flex items-center gap-2"><Printer size={18}/> Print</button>
                    <Link to="/" className="px-5 py-2 bg-slate-200 rounded-lg flex items-center gap-2"><ArrowLeft size={18}/> Home</Link>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6">
                <h1 className="text-2xl font-bold text-[#1E664E] mb-4 border-b pb-2">Log Attendance</h1>
                {error && <div className="bg-red-50 text-red-700 p-3 rounded mb-4">{error}</div>}
                <form onSubmit={submit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <label><span className="text-sm font-medium">Enrollment ID *</span><input required type="text" value={form.enrollmentId} onChange={set('enrollmentId')} className="mt-1 w-full border rounded p-2" /></label>
                        <label><span className="text-sm font-medium">Learner ID *</span><input required type="text" value={form.learnerId} onChange={set('learnerId')} className="mt-1 w-full border rounded p-2" /></label>
                    </div>
                    <label><span className="text-sm font-medium">Session Date *</span><input required type="date" value={form.sessionDate} onChange={set('sessionDate')} className="mt-1 w-full border rounded p-2" /></label>
                    <div className="grid grid-cols-2 gap-4">
                        <label><span className="text-sm font-medium">Arrival Time</span><input type="time" value={form.arrivalTime} onChange={set('arrivalTime')} className="mt-1 w-full border rounded p-2" /></label>
                        <label><span className="text-sm font-medium">Departure Time</span><input type="time" value={form.departureTime} onChange={set('departureTime')} className="mt-1 w-full border rounded p-2" /></label>
                    </div>
                    <div className="flex gap-6">
                        <label className="flex items-center gap-2"><input type="checkbox" checked={form.lateFlag} onChange={set('lateFlag')} className="w-4 h-4" /> Late arrival?</label>
                        <label className="flex items-center gap-2"><input type="checkbox" checked={form.noShowFlag} onChange={set('noShowFlag')} className="w-4 h-4" /> No show?</label>
                    </div>
                    {form.lateFlag && <label><span className="text-sm font-medium">Late reason</span><input type="text" value={form.lateReason} onChange={set('lateReason')} className="mt-1 w-full border rounded p-2" /></label>}
                    <label><span className="text-sm font-medium">Trainer Notes</span><textarea rows={2} value={form.trainerNotes} onChange={set('trainerNotes')} className="mt-1 w-full border rounded p-2" /></label>
                    <button type="submit" disabled={submitting} className="w-full bg-[#1E664E] text-white py-3 rounded-xl font-semibold">{submitting ? 'Saving...' : 'Save Attendance'}</button>
                </form>
            </div>
        </div>
    );
}
