import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';
const AREAS = ['Data protection','Course info','Attendance','Venue','Equipment','Finance','Staffing','Other'];
const LEVELS = ['Low','Medium','High'];

export default function RiskLogForm() {
    const location = useLocation();
    const isAdminView = location.pathname.startsWith('/admin');
    const [form, setForm] = useState({ area: '', description: '', likelihood: '', impact: '', owner: '', mitigation: '' });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [riskId, setRiskId] = useState('');
    
    const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault(); setSubmitting(true); setError('');
        try {
            const res = await fetch(`${API_URL}/api/risk-log`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Submission failed');
            setRiskId(data.riskId);
        } catch (err) { setError(err.message); } finally { setSubmitting(false); }
    };

    const renderTopLink = () => isAdminView ? (
        <div className="fixed top-4 left-4 z-50 print:hidden">
            <Link to="/admin" className="flex items-center gap-2 bg-white text-slate-700 px-4 py-2 rounded-lg shadow-md border border-slate-200 hover:bg-slate-50 transition font-medium text-sm">
                <ArrowLeft size={16} /> Back to Data Hub
            </Link>
        </div>
    ) : null;

    if (riskId) {
        return (
            <div className="min-h-screen bg-slate-50 py-12 px-4">
                {renderTopLink()}
                <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 text-center mt-8">
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">Risk logged successfully</h1>
                    <p className="text-3xl font-mono font-bold text-amber-800 tracking-wider mb-6">{riskId}</p>
                    <Link to="/" className="inline-block px-5 py-2 bg-slate-200 rounded-lg"><ArrowLeft size={16} className="inline mr-2"/> Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4">
            {renderTopLink()}
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8 mt-8">
                <div className="mb-6 border-b pb-4">
                    <h1 className="text-2xl font-bold text-[#1E664E]">Log a Risk or Issue</h1>
                </div>
                {error && <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">{error}</div>}
                <form onSubmit={submit} className="space-y-4">
                    <label className="block"><span className="text-sm font-medium">Area *</span><select required value={form.area} onChange={set('area')} className="mt-1 w-full px-3 py-2 border rounded-lg"><option value="">Select...</option>{AREAS.map(a => <option key={a} value={a}>{a}</option>)}</select></label>
                    <label className="block"><span className="text-sm font-medium">Description *</span><textarea required rows={3} value={form.description} onChange={set('description')} className="mt-1 w-full px-3 py-2 border rounded-lg" /></label>
                    <div className="grid grid-cols-2 gap-4">
                        <label className="block"><span className="text-sm font-medium">Likelihood *</span><select required value={form.likelihood} onChange={set('likelihood')} className="mt-1 w-full px-3 py-2 border rounded-lg"><option value="">Select...</option>{LEVELS.map(l => <option key={l} value={l}>{l}</option>)}</select></label>
                        <label className="block"><span className="text-sm font-medium">Impact *</span><select required value={form.impact} onChange={set('impact')} className="mt-1 w-full px-3 py-2 border rounded-lg"><option value="">Select...</option>{LEVELS.map(l => <option key={l} value={l}>{l}</option>)}</select></label>
                    </div>
                    <label className="block"><span className="text-sm font-medium">Owner *</span><input required type="text" value={form.owner} onChange={set('owner')} className="mt-1 w-full px-3 py-2 border rounded-lg" /></label>
                    <button type="submit" disabled={submitting} className="w-full bg-[#1E664E] text-white py-3 rounded-xl font-semibold hover:bg-[#0F4A38] transition">{submitting ? 'Saving...' : 'Save Risk Log'}</button>
                </form>
            </div>
        </div>
    );
}
