import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo01 from './assets/logo01.jpg';
import logo2 from './assets/logo2.jpg';
import { CheckCircle, AlertCircle, Printer, Download, ArrowLeft } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

const AREAS = ['Data protection','Course info','Attendance','Venue','Equipment','Finance','Staffing','Other'];
const LEVELS = ['Low','Medium','High'];

export default function RiskLogForm() {
    const [form, setForm] = useState({
        area: '', description: '', likelihood: '', impact: '', owner: '', mitigation: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [riskId, setRiskId] = useState('');

    const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        setSubmitting(true); setError('');
        try {
            const res = await fetch(`${API_URL}/api/risk-log`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Submission failed');
            setRiskId(data.riskId);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const downloadCsv = () => {
        const csv = [
            ['risk_id','area','description','likelihood','impact','owner','mitigation'].join(','),
            [riskId, form.area, form.description, form.likelihood, form.impact, form.owner, form.mitigation]
                .map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')
        ].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = `${riskId}.csv`; a.click();
    };

    const Header = () => (
        <div className="bg-gradient-to-r from-[#1E664E] to-[#0F4A38] shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <img src={logo01} alt="COHT" className="h-12 w-auto object-contain bg-white rounded-xl p-1.5 shadow-md" onError={(e) => { e.target.style.display = 'none'; }} />
                    <div className="hidden md:block border-l-2 border-emerald-400 pl-3">
                        <div className="text-white font-bold text-sm">Centre of Healthcare Training</div>
                        <div className="text-emerald-200 text-[10px]">Phase 1 — Data Capture</div>
                    </div>
                </div>
                <div className="text-white font-semibold text-sm md:text-base">Risk &amp; Issues Log</div>
                <img src={logo2} alt="Accredited" className="h-11 w-auto object-contain bg-white rounded-xl p-1.5 shadow-md" onError={(e) => { e.target.style.display = 'none'; }} />
            </div>
        </div>
    );

    if (riskId) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-slate-50 py-12 px-4">
                    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 text-center">
                        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-slate-800 mb-2">Risk logged successfully</h1>
                        <p className="text-slate-600 mb-6">This issue is now in the system and visible to admins.</p>
                        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6 mb-6">
                            <p className="text-xs uppercase text-amber-700 font-semibold mb-1">Risk ID</p>
                            <p className="text-3xl font-mono font-bold text-amber-800 tracking-wider">{riskId}</p>
                        </div>
                        <div className="flex flex-wrap gap-3 justify-center">
                            <button onClick={() => window.print()} className="flex items-center gap-2 px-5 py-2 bg-[#1E664E] text-white rounded-lg"><Printer size={18} /> Print</button>
                            <button onClick={downloadCsv} className="flex items-center gap-2 px-5 py-2 bg-slate-900 text-white rounded-lg"><Download size={18} /> CSV</button>
                            <Link to="/" className="flex items-center gap-2 px-5 py-2 bg-slate-100 text-slate-700 rounded-lg"><ArrowLeft size={18} /> Home</Link>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-slate-50 py-8 px-4">
                <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8">
                    <div className="mb-6 border-b pb-4">
                        <h1 className="text-2xl font-bold text-[#1E664E]">Log a Risk or Issue</h1>
                        <p className="text-sm text-slate-500 mt-1">Nothing is too simple to list.</p>
                    </div>
                    {error && <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4 flex items-center gap-2"><AlertCircle size={18} /> {error}</div>}
                    <form onSubmit={submit} className="space-y-4">
                        <label className="block">
                            <span className="text-sm font-medium">Area *</span>
                            <p className="text-xs text-slate-500 mt-0.5">Which part of COHT does this affect?</p>
                            <select required value={form.area} onChange={set('area')} className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1E664E]">
                                <option value="">Select...</option>
                                {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                            </select>
                        </label>
                        <label className="block">
                            <span className="text-sm font-medium">Description *</span>
                            <textarea required rows={3} value={form.description} onChange={set('description')} className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1E664E]" />
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <label className="block">
                                <span className="text-sm font-medium">Likelihood *</span>
                                <p className="text-xs text-slate-500 mt-0.5">How likely is this to happen again?</p>
                                <select required value={form.likelihood} onChange={set('likelihood')} className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1E664E]">
                                    <option value="">Select...</option>
                                    {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                                </select>
                            </label>
                            <label className="block">
                                <span className="text-sm font-medium">Impact *</span>
                                <p className="text-xs text-slate-500 mt-0.5">How bad is it if it does?</p>
                                <select required value={form.impact} onChange={set('impact')} className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1E664E]">
                                    <option value="">Select...</option>
                                    {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                                </select>
                            </label>
                        </div>
                        <label className="block">
                            <span className="text-sm font-medium">Owner *</span>
                            <p className="text-xs text-slate-500 mt-0.5">Who is responsible for fixing this?</p>
                            <input required type="text" value={form.owner} onChange={set('owner')} className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1E664E]" />
                        </label>
                        <label className="block">
                            <span className="text-sm font-medium">Mitigation</span>
                            <textarea rows={2} value={form.mitigation} onChange={set('mitigation')} className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1E664E]" />
                        </label>
                        <button type="submit" disabled={submitting} className="w-full bg-[#1E664E] text-white py-3 rounded-xl font-semibold hover:bg-[#0F4A38] transition">
                            {submitting ? 'Saving...' : 'Save Risk Log'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
