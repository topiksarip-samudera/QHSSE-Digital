'use client';

import { useState, useEffect, useCallback } from 'react';
import { templateApi } from '@/lib/api';
import Link from 'next/link';

export default function TemplateSettingsPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [newCat, setNewCat] = useState({ name: '', description: '' });
  const [saved, setSaved] = useState(false);

  const fetchCategories = useCallback(async () => {
    try { const res = await templateApi.getCategories(); setCategories(res.data || []); } catch (e) { console.error(e); }
  }, []);
  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const handleAddCategory = async () => {
    if (!newCat.name.trim()) return;
    try { await templateApi.createCategory(newCat); setNewCat({ name: '', description: '' }); fetchCategories(); } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-2 text-sm text-gray-500"><Link href="/dashboard/templates" className="hover:text-blue-600">Templates</Link><span>/</span><span className="text-gray-900">Categories</span></div>
      <div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold text-gray-900">Template Categories</h1></div><button onClick={() => setSaved(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">{saved ? '✓ Saved' : 'Save'}</button></div>
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold mb-2">Categories</h2>
        {categories.length === 0 ? <p className="text-sm text-gray-400">No categories</p> : (
          <ul className="space-y-2">{categories.map((c: any) => (<li key={c.id} className="text-sm text-gray-700 py-1">{c.name}{c.description && <span className="text-xs text-gray-400 ml-2">- {c.description}</span>}</li>))}</ul>
        )}
        <div className="border-t pt-4">
          <h3 className="text-sm font-semibold mb-2">Add Category</h3>
          <div className="flex gap-2">
            <input type="text" value={newCat.name} onChange={(e) => setNewCat({ ...newCat, name: e.target.value })} placeholder="Category name" className="flex-1 px-3 py-2 border rounded-lg text-sm" />
            <button onClick={handleAddCategory} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">Add</button>
          </div>
        </div>
      </div>
    </div>
  );
}
