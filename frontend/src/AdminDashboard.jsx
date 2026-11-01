import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Printer, Download, Search } from 'lucide-react';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

const TABS = [
    { id: 'attendance', label: 'Attendance', endpoint: '/api/admin/attendance' },
    { id: 'discovery', label: 'Discovery', endpoint: '/api/admin/discovery' },
    { id: 'risk', label: 'Risk Log', endpoint: '/api/admin/risk-log' },
    { id: 'faq', label: 'FAQ', endpoint: '/api/admin/faq' },
];

export default function AdminDashboard() {
    useEffect(() => {
        // Set session role for smart navigation buttons
        sessionStorage.setItem("userRole", "ADMIN");
    }, []);

    const [activeTab, setActiveTab] = useState('attendance');
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');

    const fetchData = async (tabId) => {
        setLoading(true); setError(''); setRecords([]); setSearchTerm('');
        const tab = TABS.find(t => t.id === tabId);
        try {
            const res = await fetch(`${API_URL}${tab.endpoint}`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to load');
            setRecords(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(activeTab); }, [activeTab]);

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

    const getDateField = (rec) => {
        if (activeTab === 'discovery') return rec.createdAt;
        if (activeTab === 'risk') return rec.dateRaised;
        if (activeTab === 'faq') return rec.createdAt;
        return rec.sessionDate;
    };

    const filtered = records.filter(r => {
        if (start && end) {
            const d = getDateField(r);
            if (!d) return false;
            const dateStr = new Date(d).toISOString().slice(0, 10);
            if (dateStr < start || dateStr > end) return false;
        }
        if (searchTerm) {
            const blob = JSON.stringify(r).toLowerCase();
            return blob.includes(searchTerm.toLowerCase());
        }
        return true;
    });

    const handleExport = () => {
        const endpoint = activeTab === 'attendance'
            ? `/api/admin/attendance/export?start=${start}&end=${end}`
            : activeTab === 'discovery'
                ? '/api/admin/discovery/export'
                : activeTab === 'risk'
                    ? '/api/admin/risk-log/export'
                    : '/api/admin/faq/export';
        window.open(`${API_URL}${endpoint}`, '_blank');
    };

    const renderTable = () => {
        if (loading) return <div className="p-8 text-center text-slate-400">Loading...</div>;
        if (error) return <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>;
        if (filtered.length === 0) return <div className="p-8 text-center text-slate-400">No records found.</div>;

        if (activeTab === 'attendance') {
            return (
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
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(r => (
                            <tr key={r.id} className="border-b hover:bg-slate-50">
                                <td className="p-2 border font-mono text-xs">{r.attendanceId}</td>
                                <td className="p-2 border font-medium">{r.learnerName}</td>
                                <td className="p-2 border">{r.courseName}</td>
                                <td className="p-2 border">{new Date(r.sessionDate).toLocaleDateString()}</td>
                                <td className="p-2 border">{r.arrivalTime || '-'}</td>
                                <td className="p-2 border">{r.departureTime || '-'}</td>
                                <td className="p-2 border">{r.hoursAttended ? r.hoursAttended.toFixed(1) : '-'}</td>
                                <td className="p-2 border">
                                    {r.noShowFlag ? <span className="text-red-600">No Show</span>
                                     : r.lateFlag ? <span className="text-amber-600">Late</span>
                                     : <span className="text-green-600">Present</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        }

        if (activeTab === 'discovery') {
            return (
                <table className="w-full text-sm border-collapse">
                    <thead>
                        <tr className="bg-slate-100 text-left print:bg-gray-200">
                            <th className="p-2 border">Learner ID</th>
                            <th className="p-2 border">Name</th>
                            <th className="p-2 border">Phone</th>
                            <th className="p-2 border">Course</th>
                            <th className="p-2 border">Source</th>
                            <th className="p-2 border">Consent</th>
                            <th className="p-2 border">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(r => (
                            <tr key={r.id} className="border-b hover:bg-slate-50">
                                <td className="p-2 border font-mono text-xs">{r.learnerId}</td>
                                <td className="p-2 border font-medium">{r.firstName} {r.lastName}</td>
                                <td className="p-2 border font-mono text-xs">{r.phone}</td>
                                <td className="p-2 border">{r.courseAppliedFor || '-'}</td>
                                <td className="p-2 border">{r.sourceChannel || '-'}</td>
                                <td className="p-2 border">{r.consentGiven ? '✓ Yes' : '✗ No'}</td>
                                <td className="p-2 border text-xs">{new Date(r.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        }

        if (activeTab === 'risk') {
            return (
                <table className="w-full text-sm border-collapse">
                    <thead>
                        <tr className="bg-slate-100 text-left print:bg-gray-200">
                            <th className="p-2 border">Risk ID</th>
                            <th className="p-2 border">Area</th>
                            <th className="p-2 border">Description</th>
                            <th className="p-2 border">Likelihood</th>
                            <th className="p-2 border">Impact</th>
                            <th className="p-2 border">Owner</th>
                            <th className="p-2 border">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(r => (
                            <tr key={r.id} className="border-b hover:bg-slate-50">
                                <td className="p-2 border font-mono text-xs">{r.riskId}</td>
                                <td className="p-2 border">{r.area}</td>
                                <td className="p-2 border max-w-md truncate">{r.description}</td>
                                <td className="p-2 border">{r.likelihood}</td>
                                <td className="p-2 border">{r.impact}</td>
                                <td className="p-2 border">{r.owner}</td>
                                <td className="p-2 border">{r.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        }

        return (
            <table className="w-full text-sm border-collapse">
                <thead>
                    <tr className="bg-slate-100 text-left print:bg-gray-200">
                        <th className="p-2 border">FAQ ID</th>
                        <th className="p-2 border">Question</th>
                        <th className="p-2 border">Frequency</th>
                        <th className="p-2 border">Answer</th>
                        <th className="p-2 border">Added By</th>
                        <th className="p-2 border">Publish</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map(r => (
                        <tr key={r.id} className="border-b hover:bg-slate-50">
                            <td className="p-2 border font-mono text-xs">{r.faqId}</td>
                            <td className="p-2 border">{r.question}</td>
                            <td className="p-2 border">{r.frequency}</td>
                            <td className="p-2 border max-w-md truncate">{r.answer}</td>
                            <td className="p-2 border">{r.addedBy}</td>
                            <td className="p-2 border">{r.publishReady ? '✓' : '—'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            {/* Floating Data Hub Button */}
            <div className="fixed top-20 left-4 z-50 print:hidden">
                <Link to="/admin" className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-slate-700 transition font-medium text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Back to Dashboard
        </Link>
            </div>
            
            <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-6 print:shadow-none print:p-0">
                <div className="flex justify-between items-center mb-6 print:hidden">
                    <div>
                        <h1 className="text-2xl font-bold text-[#1E664E]">Admin Data Hub</h1>
                        <p className="text-sm text-slate-500">All records, one place. Filter, search, export, print.</p>
                    </div>
                    <div className="flex gap-2">
                        <Link to="/admin/courses" className="text-sm text-slate-500 hover:text-[#1E664E] px-3 py-1.5">Courses</Link>
                        <Link to="/admin" className="text-sm text-slate-500 hover:text-[#1E664E] px-3 py-1.5 flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Back to Dashboard
        </Link>
                    </div>
                </div>

                <div className="flex gap-2 mb-6 border-b print:hidden">
                    {TABS.map(t => (
                        <button key={t.id} onClick={() => setActiveTab(t.id)}
                            className={`px-4 py-2 text-sm font-medium transition-all ${activeTab === t.id ? 'border-b-2 border-[#1E664E] text-[#1E664E]' : 'text-slate-500 hover:text-slate-700'}`}>
                            {t.label}
                        </button>
                    ))}
                </div>

                <div className="bg-slate-50 p-4 rounded-xl mb-6 print:hidden flex flex-wrap gap-4 items-center">
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
                    </div>
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                            placeholder="Search records..." className="w-full pl-10 pr-3 py-1.5 border rounded text-sm" />
                    </div>
                    <div className="flex gap-2 ml-auto">
                        <button onClick={handleExport} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-1.5 rounded text-sm hover:bg-slate-800"><Download size={16} /> CSV</button>
                        <button onClick={() => window.print()} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-1.5 rounded text-sm hover:bg-indigo-700"><Printer size={16} /> Print</button>
                    </div>
                </div>

                <div className="hidden print:block mb-6 text-center">
                    <h1 className="text-2xl font-bold">Centre of Healthcare Training</h1>
                    <p className="text-lg">{TABS.find(t => t.id === activeTab)?.label} Register</p>
                    <p className="text-sm text-gray-500">{start || 'All dates'} {start && end ? `to ${end}` : ''}</p>
                </div>

                <div className="overflow-x-auto">{renderTable()}</div>

                <div className="hidden print:block mt-12 pt-8 border-t">
                    <div className="flex justify-between">
                        <p>Trainer Signature: _______________________</p>
                        <p>Manager Signature: _______________________</p>
                    </div>
                </div>

                <div className="mt-4 text-xs text-slate-500 print:hidden">
                    Showing {filtered.length} of {records.length} records · Data source: Neon PostgreSQL
                </div>
            </div>
        </div>
    );
}
