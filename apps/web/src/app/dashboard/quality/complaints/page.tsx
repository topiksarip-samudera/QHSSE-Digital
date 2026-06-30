'use client'; import { useState, useEffect, useCallback } from 'react'; import { qualityApi } from '@/lib/api';
const sevColors: Record<string,string> = { low:'bg-green-100 text-green-800', medium:'bg-yellow-100 text-yellow-800', high:'bg-orange-100 text-orange-800', critical:'bg-red-100 text-red-800' };
const statusColors: Record<string,string> = { open:'bg-blue-100 text-blue-700', in_progress:'bg-yellow-100 text-yellow-700', resolved:'bg-green-100 text-green-700', closed:'bg-gray-200 text-gray-500' };

export default function ComplaintsPage() {
  const [data, setData] = useState<any[]>([]); const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false); const [form, setForm] = useState<any>({ title:'', customerName:'', complaintDate:'', severity:'medium' });

  const fetch = useCallback(async () => { try { const r = await qualityApi.getComplaints(); setData(r.data.data||[]); } catch(e){console.error(e)} finally { setLoading(false); } }, []);
  useEffect(()=>{fetch()},[fetch]);

  const handleCreate = async () => { try { await qualityApi.createComplaint({...form, complaintDate: form.complaintDate||new Date().toISOString().split('T')[0]}); setShowForm(false); setForm({ title:'', customerName:'', complaintDate:'', severity:'medium' }); fetch(); } catch(e:any){alert(e.response?.data?.message||'Error')} };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold text-gray-900">Customer Complaints</h1><button onClick={()=>setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">{showForm?'Cancel':'New Complaint'}</button></div>
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 space-y-4 max-w-2xl">
          <div><label className="block text-sm font-medium mb-1">Title</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-1">Customer Name</label><input value={form.customerName} onChange={e=>setForm({...form,customerName:e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-1">Complaint Date</label><input type="date" value={form.complaintDate} onChange={e=>setForm({...form,complaintDate:e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-1">Severity</label><select value={form.severity} onChange={e=>setForm({...form,severity:e.target.value})} className="w-full px-3 py-2 border rounded-lg"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option></select></div>
          <button onClick={handleCreate} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm">Create Complaint</button>
        </div>
      )}
      <div className="bg-white rounded-lg shadow overflow-hidden"><table className="w-full"><thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Title</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Customer</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Severity</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th></tr></thead><tbody>{data.map((d:any)=>(<tr key={d.id} className="border-t"><td className="px-4 py-3 text-sm">{d.title}</td><td className="px-4 py-3 text-sm">{d.customerName}</td><td className="px-4 py-3 text-sm text-gray-500">{new Date(d.complaintDate).toLocaleDateString()}</td><td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${sevColors[d.severity]||''}`}>{d.severity}</span></td><td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${statusColors[d.status]||''}`}>{d.status}</span></td></tr>))}</tbody></table></div>
    </div>
  );
}
