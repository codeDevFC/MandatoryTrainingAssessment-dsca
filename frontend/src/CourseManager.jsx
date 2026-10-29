import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, BookOpen } from 'lucide-react';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

export default function CourseManager() {
    const [courses, setCourses] = useState([]);
    const [form, setForm] = useState({ title: '', type: 'Short Course', description: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchCourses = async () => {
        try {
            const res = await fetch(`${API_URL}/api/courses`);
            const data = await res.json();
            setCourses(data);
        } catch (err) { setError('Failed to load courses'); }
    };

    useEffect(() => { fetchCourses(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault(); setLoading(true); setError(''); setSuccess('');
        try {
            const res = await fetch(`${API_URL}/api/admin/courses`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setSuccess(`Course ${data.courseId} created`);
            setForm({ title: '', type: 'Short Course', description: '' });
            fetchCourses();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) { setError(err.message); } finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Archive this course? It will no longer appear in dropdowns.')) return;
        try {
            await fetch(`${API_URL}/api/admin/courses/${id}`, { method: 'DELETE' });
            fetchCourses();
        } catch (err) { setError('Failed to archive course'); }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <div className="flex items-center gap-2">
                        <BookOpen className="w-6 h-6 text-[#1E664E]" />
                        <h1 className="text-2xl font-bold text-[#1E664E]">Course Catalogue</h1>
                    </div>
                    <Link to="/admin" className="text-sm text-slate-500 hover:underline">Back to Dashboard</Link>
                </div>

                {error && <div className="bg-red-50 text-red-700 p-3 rounded mb-4">{error}</div>}
                {success && <div className="bg-green-50 text-green-700 p-3 rounded mb-4">{success}</div>}

                <div className="bg-slate-50 rounded-xl p-4 mb-6 border">
                    <h2 className="font-semibold mb-3">Add a New Course</h2>
                    <form onSubmit={handleSubmit} className="flex flex-wrap gap-3">
                        <input required type="text" placeholder="Course Title (e.g. CPR Refresher)" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="flex-1 border rounded p-2 min-w-[200px]" />
                        <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="border rounded p-2">
                            <option value="Short Course">Short Course</option>
                            <option value="Full Access">Full Access (23 Modules)</option>
                        </select>
                        <input type="text" placeholder="Description (optional)" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="flex-1 border rounded p-2 min-w-[200px]" />
                        <button type="submit" disabled={loading} className="bg-[#1E664E] text-white px-4 py-2 rounded font-semibold flex items-center gap-2">
                            <Plus size={16} /> {loading ? 'Saving...' : 'Add Course'}
                        </button>
                    </form>
                </div>

                <table className="w-full text-sm border-collapse">
                    <thead>
                        <tr className="bg-slate-100 text-left">
                            <th className="p-2 border">Course ID</th>
                            <th className="p-2 border">Title</th>
                            <th className="p-2 border">Type</th>
                            <th className="p-2 border">Description</th>
                            <th className="p-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map(c => (
                            <tr key={c.id} className="border-b hover:bg-slate-50">
                                <td className="p-2 border font-mono text-xs">{c.courseId}</td>
                                <td className="p-2 border font-medium">{c.title}</td>
                                <td className="p-2 border">{c.type}</td>
                                <td className="p-2 border text-slate-500">{c.description || '-'}</td>
                                <td className="p-2 border">
                                    <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:text-red-700 flex items-center gap-1"><Trash2 size={14} /> Archive</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
