'use client';

import { useState } from 'react';
import { globalSearchApi } from '@/lib/api';
import Link from 'next/link';

export default function GlobalSearchPage() {
  const [query, setQuery] = useState('');
  const [module, setModule] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState<any[]>([]);
  const [showSaved, setShowSaved] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try { const r = await globalSearchApi.search({ query, module: module || undefined }); setResults(r.data); } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleSaveSearch = async () => {
    try { await globalSearchApi.saveSearch({ name: query, query }); alert('Saved!'); } catch (e) { console.error(e); }
  };

  const loadSaved = async () => {
    try { const r = await globalSearchApi.getSaved(); setSaved(r.data.data || []); setShowSaved(true); } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div><h1 className="text-2xl font-bold text-gray-900">Global Search</h1><p className="text-gray-600 mt-1">Search across all modules, actions, workflows, and more</p></div>

      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="flex gap-3 items-end">
          <div className="flex-1"><label className="block text-sm font-medium mb-1">Search</label><input type="text" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} placeholder="Search anything..." className="w-full px-4 py-2 border rounded-lg text-sm" /></div>
          <div><label className="block text-sm font-medium mb-1">Module</label><select value={module} onChange={(e) => setModule(e.target.value)} className="px-3 py-2 border rounded-lg text-sm"><option value="">All</option><option value="action">Actions</option><option value="user">Users</option><option value="company">Companies</option><option value="workflow">Workflows</option><option value="notification">Notifications</option><option value="form">Forms</option><option value="checklist">Checklists</option><option value="template">Templates</option><option value="schedule">Schedules</option><option value="audit">Audit Logs</option></select></div>
          <button onClick={handleSearch} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">{loading ? 'Searching...' : 'Search'}</button>
        </div>
        <div className="flex gap-2">
          <button onClick={handleSaveSearch} className="text-xs text-blue-600 hover:underline" disabled={!query}>Save this search</button>
          <button onClick={loadSaved} className="text-xs text-gray-600 hover:underline">Saved searches</button>
        </div>
      </div>

      {showSaved && saved.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-3">Saved Searches</h2>
          <ul className="space-y-1">{saved.map((s: any) => (<li key={s.id} className="text-sm flex justify-between"><span className="cursor-pointer hover:text-blue-600" onClick={() => { setQuery(s.query); setShowSaved(false); handleSearch(); }}>{s.name}</span><button onClick={async () => { await globalSearchApi.deleteSaved(s.id); loadSaved(); }} className="text-xs text-red-500">×</button></li>))}</ul>
        </div>
      )}

      {results && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Results ({results.total})</h2>
            <span className="text-xs text-gray-400">query: "{results.query}"</span>
          </div>
          {results.results?.length === 0 ? <p className="text-sm text-gray-400">No results found</p> : (
            <ul className="space-y-2">
              {results.results.map((r: any, i: number) => (
                <li key={i} className="flex items-center gap-3 text-sm p-2 hover:bg-gray-50 rounded">
                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded font-medium text-gray-600">{r.module}</span>
                  <Link href={r.url} className="text-blue-600 hover:underline truncate">{r.title}</Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
