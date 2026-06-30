'use client'; import { useState, useEffect, useCallback } from 'react'; import { trainingApi } from '@/lib/api';

const STATUS_COLORS: Record<string, string> = { planned: 'bg-yellow-100 text-yellow-800', in_progress: 'bg-blue-100 text-blue-800', completed: 'bg-green-100 text-green-800', cancelled: 'bg-red-100 text-red-800' };

interface SessionForm { title: string; description: string; location: string; startDate: string; endDate: string; instructor: string; matrixId: string; planId: string; }

export default function SessionsPage() {
  const [sessions, setSessions] = useState<any[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false); const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<SessionForm>({ title: '', description: '', location: '', startDate: '', endDate: '', instructor: '', matrixId: '', planId: '' });
  const [submitting, setSubmitting] = useState(false); const [actionMsg, setActionMsg] = useState('');

  const fetchSessions = useCallback(async () => { setLoading(true); try { const r = await trainingApi.getSessions(); setSessions(r.data.data || []); } catch { setError('Failed to load sessions'); } finally { setLoading(false); } }, []);
  useEffect(() => { fetchSessions(); }, [fetchSessions]);

  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setSubmitting(true); setActionMsg(''); try { if (editingId) { await trainingApi.updateSession(editingId, form); setActionMsg('Session updated'); } else { await trainingApi.createSession(form); setActionMsg('Session created'); } setShowForm(false); setEditingId(null); setForm({ title: '', description: '', location: '', startDate: '', endDate: '', instructor: '', matrixId: '', planId: '' }); fetchSessions(); } catch { setActionMsg('Failed to save session'); } finally { setSubmitting(false); } };

  const handleEdit = (s: any) => { setEditingId(s.id); setForm({ title: s.title || '', description: s.description || '', location: s.location || '', startDate: s.startDate ? s.startDate.slice(0, 16) : '', endDate: s.endDate ? s.endDate.slice(0, 16) : '', instructor: s.instructor || '', matrixId: s.matrixId || '', planId: s.planId || '' }); setShowForm(true); };

  const handleClose = async (id: string) => { if (!confirm('Close this session?')) return; try { await trainingApi.closeSession(id); fetchSessions(); } catch { alert('Failed to close session'); } };

  const resetForm = () => { setShowForm(false); setEditingId(null); setForm({ title: '', description: '', location: '', startDate: '', endDate: '', instructor: '', matrixId: '', planId: '' }); };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading sessions...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Training Sessions</h1><p className="text-gray-600 mt-1">Manage all training sessions</p></div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">+ New Session</button>
      </div>

      {actionMsg && <div className={`px-4 py-2 rounded-lg text-sm ${actionMsg.includes('Failed') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>{actionMsg}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-6 space-y-4">
          <h2 className="font-semibold text-lg">{editingId ? 'Edit Session' : 'New Session'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Title *</label><input type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Session title" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Instructor</label><input type="text" value={form.instructor} onChange={e => setForm({ ...form, instructor: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Instructor name" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Location</label><input type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Venue or online" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label><input type="datetime-local" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">End Date</label><input type="datetime-local" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Matrix</label><input type="text" value={form.matrixId} onChange={e => setForm({ ...form, matrixId: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Matrix ID" /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" rows={2} placeholder="Session description" /></div>
          </div>
          <div className="flex gap-3"><button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm disabled:opacity-50">{submitting ? 'Saving...' : editingId ? 'Update' : 'Create'}</button><button type="button" onClick={resetForm} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">Cancel</button></div>
        </form>
      )}

      {error && sessions.length === 0 ? <div className="text-center py-12 bg-white rounded-lg shadow"><p className="text-red-500">{error}</p><button onClick={fetchSessions} className="mt-2 text-blue-600 hover:underline text-sm">Retry</button></div> : sessions.length === 0 ? <div className="text-center py-12 bg-white rounded-lg shadow"><p className="text-gray-500 text-lg">No sessions found</p><button onClick={() => { resetForm(); setShowForm(true); }} className="mt-2 text-blue-600 hover:underline text-sm">Create a session</button></div> : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Instructor</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead>
            <tbody className="divide-y divide-gray-200">
              {sessions.map((s: any) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{s.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{s.instructor || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{s.location || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{s.startDate ? new Date(s.startDate).toLocaleDateString() : '-'}</td>
                  <td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[s.status] || 'bg-gray-100 text-gray-800'}`}>{s.status?.replace('_', ' ') || '-'}</span></td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => handleEdit(s)} className="text-blue-600 hover:underline text-sm">Edit</button>
                      {s.status !== 'completed' && s.status !== 'cancelled' && <button onClick={() => handleClose(s.id)} className="text-red-600 hover:underline text-sm">Close</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
