'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { formApi } from '@/lib/api';
import Link from 'next/link';

export default function CreateFormPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('Form name is required'); return; }
    setSaving(true);
    try {
      const res = await formApi.createForm({ name, description: description || undefined });
      router.push(`/dashboard/form-builder/${res.data.id}`);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create form');
    } finally { setSaving(false); }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/dashboard/form-builder" className="hover:text-blue-600">Form Builder</Link><span>/</span><span className="text-gray-900">New Form</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-900">Create Form</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-5">
        {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Form Name *</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" required /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
        <p className="text-xs text-gray-400">After creating the form, you can add sections and fields on the detail page.</p>
        <div className="flex gap-3 pt-4 border-t">
          <button type="submit" disabled={saving} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm">{saving ? 'Creating...' : 'Create Form'}</button>
          <Link href="/dashboard/form-builder" className="px-6 py-2 border rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
