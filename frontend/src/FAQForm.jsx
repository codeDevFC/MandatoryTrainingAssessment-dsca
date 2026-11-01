import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Printer, Download, ArrowLeft } from 'lucide-react';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

export default function FAQForm() {
    const navigate = useNavigate();
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

    if (faqId) return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 text-center">
            {/* Back Navigation Button */}
            <div className="fixed top-4 left-4 z-50 print:hidden">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 bg-white text-slate-700 px-4 py-2 rounded-lg shadow-md border border-slate-200 hover:bg-slate-50 transition font-medium text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    Back
                </button>
            </div>
        
            <div className="max-w-3xl mx-auto w-full px-4 pt-4 print:hidden">
                
            </div>
    
            
        
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <div className="mb-4 print:hidden">
                
            </div>
            
                <h1 className="text-2xl font-bold mb-2">FAQ Saved</h1>
                <p className="text-4xl font-mono font-bold text-emerald-800 mb-6">{faqId}</p>
                <div className="flex gap-3 justify-center">
                    <Link to="/" className="px-5 py-2 bg-slate-200 rounded-lg flex items-center gap-2"><ArrowLeft size={18}/> Home</Link>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6">
                    <div className="mb-4">
                        <Link to="/" className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-[#1E664E] transition">← Back to Home</Link>
                    </div>
                <h1 className="text-2xl font-bold text-[#1E664E] mb-4 border-b pb-2">Log FAQ</h1>
                {error && <div className="bg-red-50 text-red-700 p-3 rounded mb-4">{error}</div>}
                <form onSubmit={submit} className="space-y-4">
                    <label><span className="text-sm font-medium">Question *</span><textarea required rows={2} value={form.question} onChange={set('question')} className="mt-1 w-full border rounded p-2" /></label>
                    <div className="grid grid-cols-2 gap-4">
                        <label><span className="text-sm font-medium">Course (optional)</span><input type="text" value={form.courseId} onChange={set('courseId')} className="mt-1 w-full border rounded p-2" /></label>
                        <label><span className="text-sm font-medium">Frequency</span>
                            <select value={form.frequency} onChange={set('frequency')} className="mt-1 w-full border rounded p-2">
                                <option value="Rare">Rare</option><option value="Occasional">Occasional</option><option value="Every session">Every session</option>
                            </select>
                        </label>
                    </div>
                    <label><span className="text-sm font-medium">Answer *</span><textarea required rows={3} value={form.answer} onChange={set('answer')} className="mt-1 w-full border rounded p-2" /></label>
                    <label><span className="text-sm font-medium">Added By *</span><input required type="text" value={form.addedBy} onChange={set('addedBy')} className="mt-1 w-full border rounded p-2" /></label>
                    <button type="submit" disabled={submitting} className="w-full bg-[#1E664E] text-white py-3 rounded-xl font-semibold">{submitting ? 'Saving...' : 'Save FAQ'}</button>
                </form>
            </div>
        </div>
    );
}
