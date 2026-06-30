'use client'; import { useState, useEffect } from 'react'; import { trainingApi } from '@/lib/api';

export default function CertificatesPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<any>({ userId: '', certificateType: '', issuedBy: '', issuedDate: '', expiryDate: '', certificateNumber: '', status: 'active' });
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [renewId, setRenewId] = useState<string | null>(null);
  const [renewForm, setRenewForm] = useState<any>({ issuedDate: '', expiryDate: '' });

  const load = async () => { setLoading(true); try { const r = await trainingApi.getCertificates(); setData(r.data?.data || []); } catch(e){console.error(e);} finally{setLoading(false);} };
  useEffect(() => { load(); }, []);

  const save = async () => { try { if (editId) await trainingApi.updateCertificate(editId, form); else await trainingApi.createCertificate(form); setShowForm(false); setEditId(null); setForm({}); load(); } catch(e){console.error(e);} };
  const del = async (id: string) => { if (confirm('Delete?')) { await trainingApi.deleteCertificate(id); load(); } };
  const revoke = async (id: string) => { if (confirm('Revoke certificate?')) { await trainingApi.revokeCertificate(id); load(); } };
  const renew = async () => { try { await trainingApi.renewCertificate(renewId!, renewForm); setRenewId(null); setRenewForm({}); load(); } catch(e){console.error(e);} };
  const edit = (r: any) => { setForm({ ...r, issuedDate: r.issuedDate?.slice(0,10)||'', expiryDate: r.expiryDate?.slice(0,10)||'' }); setEditId(r.id); setShowForm(true); };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold text-gray-900">Certificate Records</h1><button onClick={()=>{setForm({status:'active'});setEditId(null);setShowForm(true)}} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">+ Issue Certificate</button></div>
      {showForm && (
        <div className="bg-white rounded-lg shadow p-4 space-y-3">
          <input placeholder="User ID" value={form.userId||''} onChange={e=>setForm({...form,userId:e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm"/>
          <input placeholder="Certificate Type" value={form.certificateType||''} onChange={e=>setForm({...form,certificateType:e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm"/>
          <input placeholder="Issued By" value={form.issuedBy||''} onChange={e=>setForm({...form,issuedBy:e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm"/>
          <div className="grid grid-cols-2 gap-3">
            <input type="date" value={form.issuedDate||''} onChange={e=>setForm({...form,issuedDate:e.target.value})} className="px-3 py-2 border rounded-lg text-sm"/>
            <input type="date" value={form.expiryDate||''} onChange={e=>setForm({...form,expiryDate:e.target.value})} className="px-3 py-2 border rounded-lg text-sm"/>
          </div>
          <input placeholder="Certificate Number" value={form.certificateNumber||''} onChange={e=>setForm({...form,certificateNumber:e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm"/>
          <select value={form.status||'active'} onChange={e=>setForm({...form,status:e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm">
            <option value="active">Active</option><option value="expired">Expired</option><option value="suspended">Suspended</option><option value="revoked">Revoked</option><option value="pending_renewal">Pending Renewal</option>
          </select>
          <div className="flex gap-2"><button onClick={save} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm">Save</button><button onClick={()=>setShowForm(false)} className="px-4 py-2 bg-gray-300 rounded-lg text-sm">Cancel</button></div>
        </div>
      )}
      {renewId && (
        <div className="bg-white rounded-lg shadow p-4 space-y-3">
          <h2 className="text-lg font-semibold">Renew Certificate</h2>
          <input type="date" value={renewForm.issuedDate||''} onChange={e=>setRenewForm({...renewForm,issuedDate:e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm"/>
          <input type="date" value={renewForm.expiryDate||''} onChange={e=>setRenewForm({...renewForm,expiryDate:e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm"/>
          <div className="flex gap-2"><button onClick={renew} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm">Renew</button><button onClick={()=>setRenewId(null)} className="px-4 py-2 bg-gray-300 rounded-lg text-sm">Cancel</button></div>
        </div>
      )}
      {loading ? <div className="text-center py-12 text-gray-500">Loading...</div> : data.length===0 ? <div className="text-center py-12 bg-white rounded-lg shadow"><p className="text-gray-500">No certificate records.</p></div> : (
        <div className="bg-white rounded-lg shadow overflow-hidden"><table className="w-full text-sm"><thead className="bg-gray-50"><tr><th className="text-left px-4 py-3">User</th><th className="text-left px-4 py-3">Type</th><th className="text-left px-4 py-3">Issued</th><th className="text-left px-4 py-3">Expiry</th><th className="text-left px-4 py-3">Status</th><th className="text-right px-4 py-3">Actions</th></tr></thead><tbody>{data.map((r:any)=>(<tr key={r.id} className="border-t"><td className="px-4 py-3">{r.userId}</td><td className="px-4 py-3">{r.certificateType}</td><td className="px-4 py-3">{r.issuedDate?new Date(r.issuedDate).toLocaleDateString():'-'}</td><td className="px-4 py-3">{r.expiryDate?new Date(r.expiryDate).toLocaleDateString():'-'}</td><td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs ${r.status==='active'?'bg-green-100 text-green-800':r.status==='expired'?'bg-red-100 text-red-800':r.status==='revoked'?'bg-gray-100 text-gray-500':'bg-yellow-100 text-yellow-800'}`}>{r.status}</span></td><td className="px-4 py-3 text-right"><button onClick={()=>edit(r)} className="text-blue-600 hover:underline mr-2">Edit</button><button onClick={()=>setRenewId(r.id)} className="text-green-600 hover:underline mr-2">Renew</button><button onClick={()=>revoke(r.id)} className="text-yellow-600 hover:underline mr-2">Revoke</button><button onClick={()=>del(r.id)} className="text-red-600 hover:underline">Delete</button></td></tr>))}</tbody></table></div>
      )}
    </div>
  );
}
