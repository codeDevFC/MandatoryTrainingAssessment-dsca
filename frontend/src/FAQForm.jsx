import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, ArrowLeft } from 'lucide-react';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

export default function FAQForm() {
    const location = useLocation();
    const isAdminView = location.pathname.startsWith('/admin');
    const [form, setForm] = useState({ question: '', courseId: '', frequency: 'Occasional', answer: '', addedBy: '' });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [faqId, setFaqId] = useState('');
    
    const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault(); setSubmitting(true); setError('');
        try {
            const res = await fetch(`${API_URL}/api/faq`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed');
            setFaqId(data.faqId);
        } catch (err) { setError(err.message); } finally { setSubmitting(false); }
    };

    const renderTopLink = () => isAdminView ? (
        <div className="fixed top-4 left-4 z-50 print:hidden">
            <Link to="/admin" className="flex items-center gap-2 bg-white text-slate-700 px-4 py-2 rounded-lg shadow-md border border-slate-200 hover:bg-slate-50 transition font-medium text-sm">
                <ArrowLeft size={16} /> Back to Data Hub
            </Link>
        </div>
    ) : null;

    if (faqId) {
        return (
            <div className="min-h-screen bg-slate-50 py-12 px-4 text-center">
                {renderTopLink()}
                <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 mt-8">
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold mb-2">FAQ Saved</h1>
                    <p className="text-4xl font-mono font-bold text-emerald-800 mb-6">{faqId}</p>
                    <Link to="/" className="px-5 py-2 bg-slate-200 rounded-lg inline-flex items-center gap-2"><ArrowLeft size={18}/> Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4">
            {renderTopLink()}
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6 mt-8">
                <h1 className="text-2xl font-bold text-[#1E664E] mb-4 border-b pb-2">Log FAQ</h1>
                {error && <div className="bg-red-50 text-red-700 p-3 rounded mb-4">{error}</div>}
                <form onSubmit={submit} className="space-y-4">
                    <label><span className="text-sm font-medium">Question *</span><textarea required rows={2} value={form.question} onChange={set('question')} className="mt-1 w-full border rounded p-2" /></label>
                    <label><span className="text-sm font-medium">Answer *</span><textarea required rows={3} value={form.answer} onChange={set('answer')} className="mt-1 w-full border rounded p-2" /></label>
                    <label><span className="text-sm font-medium">Added By *</span><input required type="text" value={form.addedBy} onChange={set('addedBy')} className="mt-1 w-full border rounded p-2" /></label>
                    <button type="submit" disabled={submitting} className="w-full bg-[#1E664E] text-white py-3 rounded-xl font-semibold">{submitting ? 'Saving...' : 'Save FAQ'}</button>
                </form>
            </div>
        </div>
    );
}
