import React, { useState } from 'react';
import logo01 from './assets/logo01.jpg';
import logo2 from './assets/logo2.jpg';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, AlertCircle, Printer, Download, ArrowLeft } from 'lucide-react';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';
const SOURCE_CHANNELS = ['Referral', 'Word-of-mouth', 'Social media', 'WhatsApp group', 'Agency', 'Walk-in', 'Website', 'Phone', 'Email', 'Other'];
const BOOKING_METHODS = ['WhatsApp', 'Phone', 'Website', 'Walk-in', 'Email', 'Agency'];

const COHTHeader = () => (
 <div className="bg-gradient-to-r from-[#1E664E] to-[#0F4A38] shadow-lg sticky top-0 z-50">
   <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
     <div className="flex items-center gap-3">
       <img src={logo01} alt="COHT" className="h-12 w-auto object-contain bg-white rounded-xl p-1.5 shadow-md" onError={(e) => { e.target.style.display = 'none'; }} />
       <div className="hidden md:block border-l-2 border-emerald-400 pl-3">
         <div className="text-white font-bold text-sm leading-tight">Centre of Healthcare Training</div>
         <div className="text-emerald-200 text-[10px]">Mandatory Training Assessment</div>
       </div>
     </div>
     <div className="text-white font-semibold text-sm md:text-base">Learner Discovery</div>
     <img src={logo2} alt="Accredited" className="h-11 w-auto object-contain bg-white rounded-xl p-1.5 shadow-md" onError={(e) => { e.target.style.display = 'none'; }} />
   </div>
 </div>
);

const COHTFooter = () => (
 <footer className="bg-slate-900 text-white mt-auto mt-12">
   <div className="max-w-7xl mx-auto px-4 py-4 text-center">
     <div className="text-sm font-semibold">Centre of Healthcare Training</div>
     <div className="text-xs text-slate-400 mt-1">Mandatory Training Assessment Portal</div>
     <div className="text-[10px] text-slate-500 mt-2">© {new Date().getFullYear()} Centre of Healthcare Training · All rights reserved</div>
   </div>
 </footer>
);

export default function DiscoveryForm() {
 const navigate = useNavigate();
 const location = useLocation();
 const isAdminView = location.pathname.startsWith('/admin');
 const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', email: '', addressTown: '', country: 'UK', courseAppliedFor: '', firstCourse: false, sourceChannel: '', bookingMethod: '', reasonForChoice: '', priorExperience: '', experienceRating: 0, futurePlans: '', comments: '', consentGiven: false });
 const [submitting, setSubmitting] = useState(false);
 const [error, setError] = useState('');
 const [learnerId, setLearnerId] = useState('');

 const set = (field) => (e) => {
   const value = e.target.type === 'checkbox' ? e.target.checked : e.target.type === 'number' ? Number(e.target.value) : e.target.value;
   setForm(f => ({ ...f, [field]: value }));
 };

 const submit = async (e) => {
   e.preventDefault(); setSubmitting(true); setError('');
   try {
     const res = await fetch(`${API_URL}/api/discovery`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
     const data = await res.json();
     if (!res.ok) throw new Error(data.error || 'Submission failed');
     setLearnerId(data.learnerId);
   } catch (err) { setError(err.message); } finally { setSubmitting(false); }
 };

 const downloadCsv = () => {
   const headers = Object.keys(form);
   const row = Object.values(form).map(v => typeof v === 'boolean' ? (v ? 'Y' : 'N') : String(v ?? ''));
   const csv = [['learner_id', ...headers].join(','), [learnerId, ...row.map(v => `"${v.replace(/"/g, '""')}"`)].join(',')].join('\n');
   const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
   const url = URL.createObjectURL(blob);
   const a = document.createElement('a'); a.href = url; a.download = `${learnerId}.csv`; a.click(); URL.revokeObjectURL(url);
 };

 const renderTopLink = () => {
   if (isAdminView) {
     return (
       <div className="fixed top-4 left-4 z-50 print:hidden">
         <Link to="/admin" className="flex items-center gap-2 bg-white text-slate-700 px-4 py-2 rounded-lg shadow-md border border-slate-200 hover:bg-slate-50 transition font-medium text-sm">
           <ArrowLeft size={16} /> Back to Data Hub
         </Link>
       </div>
     );
   }
   return null;
 };

 if (learnerId) {
   return (
     <>
       <COHTHeader />
       <div className="min-h-screen bg-slate-50 py-12 px-4">
         {renderTopLink()}
         <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 text-center mt-8">
           <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
           <h1 className="text-2xl font-bold text-slate-800 mb-2">Form submitted</h1>
           <p className="text-slate-600 mb-6">Your details have been saved securely.</p>
           <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6 mb-6">
             <p className="text-xs uppercase text-emerald-700 font-semibold mb-1">Your Learner ID</p>
             <p className="text-3xl font-mono font-bold text-emerald-800 tracking-wider">{learnerId}</p>
           </div>
           <div className="flex flex-wrap gap-3 justify-center">
             <button onClick={() => window.print()} className="flex items-center gap-2 px-5 py-2 bg-[#1E664E] text-white rounded-lg"><Printer size={18} /> Print confirmation</button>
             <button onClick={downloadCsv} className="flex items-center gap-2 px-5 py-2 bg-slate-900 text-white rounded-lg"><Download size={18} /> Download CSV</button>
           </div>
         </div>
       </div>
       <COHTFooter />
     </>
   );
 }

 return (
   <>
     <COHTHeader />
     <div className="min-h-screen bg-slate-50 py-8 px-4">
         {renderTopLink()}
       <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8 mt-8">
         <div className="mb-4">
           <Link to="/" className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-[#1E664E] transition">← Back</Link>
         </div>
         <div className="mb-6 border-b border-slate-200 pb-4">
           <h1 className="text-2xl font-bold text-[#1E664E]">Learner Discovery Form</h1>
         </div>
         {error && (<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2"><AlertCircle size={18} /> {error}</div>)}
         <form onSubmit={submit} className="space-y-5">
           <section>
             <h2 className="text-lg font-semibold text-slate-800 mb-3 border-b pb-2">1. About you</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <label className="block"><span className="text-sm font-medium text-slate-700">First name *</span><input type="text" required value={form.firstName} onChange={set('firstName')} className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E664E] outline-none" /></label>
               <label className="block"><span className="text-sm font-medium text-slate-700">Last name *</span><input type="text" required value={form.lastName} onChange={set('lastName')} className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E664E] outline-none" /></label>
               <label className="block"><span className="text-sm font-medium text-slate-700">Phone (start with +44) *</span><input type="tel" required placeholder="+447123456789" value={form.phone} onChange={set('phone')} className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E664E] outline-none" /></label>
               <label className="block"><span className="text-sm font-medium text-slate-700">Email</span><input type="email" value={form.email} onChange={set('email')} className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E664E] outline-none" /></label>
               <label className="block"><span className="text-sm font-medium text-slate-700">Town / City</span><input type="text" value={form.addressTown} onChange={set('addressTown')} className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E664E] outline-none" /></label>
               <label className="block"><span className="text-sm font-medium text-slate-700">Country</span><input type="text" value={form.country} onChange={set('country')} className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E664E] outline-none" /></label>
             </div>
           </section>
           <section>
             <h2 className="text-lg font-semibold text-slate-800 mb-3 border-b pb-2">2. Your course</h2>
             <div className="space-y-3">
               <label className="block"><span className="text-sm font-medium text-slate-700">Course applying for</span><input type="text" value={form.courseAppliedFor} onChange={set('courseAppliedFor')} className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E664E] outline-none" /></label>
               <label className="flex items-center gap-2"><input type="checkbox" checked={form.firstCourse} onChange={set('firstCourse')} className="w-4 h-4 text-[#1E664E] rounded" /><span className="text-sm text-slate-700">This is my first course with COHT</span></label>
             </div>
           </section>
           <section>
             <h2 className="text-lg font-semibold text-slate-800 mb-3 border-b pb-2">3. How you found us</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <label className="block"><span className="text-sm font-medium text-slate-700">Where did you hear about us?</span><select value={form.sourceChannel} onChange={set('sourceChannel')} className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E664E] outline-none"><option value="">Select...</option>{SOURCE_CHANNELS.map(s => <option key={s} value={s}>{s}</option>)}</select></label>
               <label className="block"><span className="text-sm font-medium text-slate-700">How did you book?</span><select value={form.bookingMethod} onChange={set('bookingMethod')} className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E664E] outline-none"><option value="">Select...</option>{BOOKING_METHODS.map(s => <option key={s} value={s}>{s}</option>)}</select></label>
             </div>
           </section>
           <section className="bg-slate-50 border border-slate-200 rounded-xl p-5">
             <h2 className="text-lg font-semibold text-slate-800 mb-3">4. Consent & retention</h2>
             <label className="flex items-start gap-3 mb-3">
               <input type="checkbox" required checked={form.consentGiven} onChange={set('consentGiven')} className="mt-1 w-4 h-4 text-[#1E664E] rounded" />
               <span className="text-sm text-slate-700">I consent to COHT storing the information I have provided on this form.</span>
             </label>
           </section>
           <div className="flex gap-3 pt-2">
             <button type="submit" disabled={submitting} className="flex-1 bg-[#1E664E] text-white py-3 rounded-xl font-semibold hover:bg-[#0F4A38] transition disabled:opacity-50">{submitting ? 'Submitting…' : 'Submit form'}</button>
           </div>
         </form>
       </div>
     </div>
     <COHTFooter />
   </>
 );
}
