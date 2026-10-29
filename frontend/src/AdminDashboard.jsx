import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Printer, Download } from 'lucide-react';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

export default function AdminDashboard() {
    const [records, setRecords] = useState([]);
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchRecords = async () => {
        setLoading(true); setError('');
        try {
            const res = await fetch(`${API_URL}/api/admin/attendance?start=${start}&end=${end}`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setRecords(data);
        } catch (err) { setError(err.message); } finally { setLoading(false); }
    };

    const setPreset = (preset) => {
        const today = new Date();
        let s = new Date(), e = new Date();
        if (preset === 'this_week') {
            const day = today.getDay() || 7; 
            s.setDate(today.getDate() - day + 1);
        } else if (preset === 'last_week') {
            const day = today.getDay() || 7;
            s.setDate(today.getDate() - day - 6);
            e.setDate(today.getDate() - day);
        } else if (preset === 'this_month') {
            s.setDate(1);
        } else if (preset === 'last_month') {
            s.setMonth(today.getMonth() - 1, 1);
            e.setDate(0); 
        }
        setStart(s.toISOString().slice(0,10));
        setEnd(e.toISOString().slice(0,10));
    };

    useEffect(() => { fetchRecords(); }, []);

    const handleExport = () => {
        window.open(`${API_URL}/api/admin/attendance/export?start=${start}&end=${end}`);
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6 print:shadow-none print:p-0">
                
                <div className="flex justify-between items-center mb-6 print:hidden">
                    <div>
                        <h1 className="text-2xl font-bold text-[#1E664E]">Attendance Dashboard</h1>
                        <p className="text-sm text-slate-500">Filter, view, and export records for inspections</p>
                    </div>
                    <Link to="/" className="text-sm text-slate-500 hover:underline">Back to Forms</Link>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl mb-6 print:hidden flex flex-wrap gap-4 items-end">
                    <div className="flex gap-2">
                        <button onClick={() => setPreset('this_week')} className="px-3 py-1.5 text-sm bg-white border rounded hover:bg-slate-100">This Week</button>
                        <button onClick={() => setPreset('last_week')} className="px-3 py-1.5 text-sm bg-white border rounded hover:bg-slate-100">Last Week</button>
                        <button onClick={() => setPreset('this_month')} className="px-3 py-1.5 text-sm bg-white border rounded hover:bg-slate-100">This Month</button>
                        <button onClick={() => setPreset('last_month')} className="px-3 py-1.5 text-sm bg-white border rounded hover:bg-slate-100">Last Month</button>
                    </div>
                    <div className="flex gap-2 items-center">
                        <input type="date" value={start} onChange={e => setStart(e.target.value)} className="border rounded px-2 py-1.5 text-sm" />
                        <span className="text-slate-400">to</span>
                        <input type="date" value={end} onChange={e => setEnd(e.target.value)} className="border rounded px-2 py-1.5 text-sm" />
                        <button onClick={fetchRecords} className="bg-[#1E664E] text-white px-4 py-1.5 rounded text-sm hover:bg-[#0F4A38]">Filter</button>
                    </div>
                    <div className="flex gap-2 ml-auto">
                        <button onClick={handleExport} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-1.5 rounded text-sm hover:bg-slate-800"><Download size={16} /> CSV</button>
                        <button onClick={() => window.print()} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-1.5 rounded text-sm hover:bg-indigo-700"><Printer size={16} /> Print / PDF</button>
                    </div>
                </div>

                <div className="hidden print:block mb-6 text-center">
                    <h1 className="text-2xl font-bold">Centre of Healthcare Training</h1>
                    <p className="text-lg">Attendance Register</p>
                    <p className="text-sm text-gray-500">Date Range: {start || 'Start'} to {end || 'Today'}</p>
                </div>

                {error && <div className="bg-red-50 text-red-700 p-3 rounded mb-4 print:hidden">{error}</div>}

                <table className="w-full text-sm border-collapse">
                    <thead>
                        <tr className="bg-slate-100 text-left print:bg-gray-200">
                            <th className="p-2 border">ID</th>
                            <th className="p-2 border">Learner Name</th>
                            <th className="p-2 border">Course</th>
                            <th className="p-2 border">Date</th>
                            <th className="p-2 border">Arrival</th>
                            <th className="p-2 border">Departure</th>
                            <th className="p-2 border">Hours</th>
                            <th className="p-2 border">Status</th>
                            <th className="p-2 border print:hidden">Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map(r => (
                            <tr key={r.id} className="border-b">
                                <td className="p-2 border text-xs font-mono">{r.attendanceId}</td>
                                <td className="p-2 border font-medium">{r.learnerName}</td>
                                <td className="p-2 border">{r.courseName}</td>
                                <td className="p-2 border">{new Date(r.sessionDate).toLocaleDateString()}</td>
                                <td className="p-2 border">{r.arrivalTime || '-'}</td>
                                <td className="p-2 border">{r.departureTime || '-'}</td>
                                <td className="p-2 border">{r.hoursAttended ? r.hoursAttended.toFixed(1) : '-'}</td>
                                <td className="p-2 border">
                                    {r.noShowFlag ? <span className="text-red-600 font-semibold">No Show</span> : 
                                     r.lateFlag ? <span className="text-amber-600 font-semibold">Late</span> : 
                                     <span className="text-green-600">Present</span>}
                                </td>
                                <td className="p-2 border text-xs text-slate-500 print:hidden">{r.trainerNotes}</td>
                            </tr>
                        ))}
                        {records.length === 0 && !loading && (
                            <tr><td colSpan="9" className="p-8 text-center text-slate-400">No records found for this date range.</td></tr>
                        )}
                    </tbody>
                </table>
                
                <div className="hidden print:block mt-12 pt-8 border-t">
                    <div className="flex justify-between">
                        <p>Trainer Signature: _______________________</p>
                        <p>Manager Signature: _______________________</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
