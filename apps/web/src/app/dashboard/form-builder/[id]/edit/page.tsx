'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { formApi, FormData } from '@/lib/api';
import Link from 'next/link';

export default function EditFormPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [form, setForm] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [sections, setSections] = useState<any[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await formApi.getForm(id);
      const f = res.data;
      setForm(f);
      setName(f.name || '');
      setDescription(f.description || '');
      setSections(f.sections?.map((s: any) => ({
        title: s.title,
        sortOrder: s.sortOrder,
        fields: s.fields?.map((fld: any) => ({
          label: fld.label, key: fld.key, type: fld.type, required: fld.required,
          placeholder: fld.placeholder, helpText: fld.helpText, sortOrder: fld.sortOrder,
          options: fld.options?.map((o: any) => ({ label: o.label, value: o.value, sortOrder: o.sortOrder })),
        })) || [],
      })) || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const addSection = () => setSections([...sections, { title: '', sortOrder: sections.length, fields: [] }]);
  const removeSection = (si: number) => setSections(sections.filter((_, i) => i !== si));
  const updateSection = (si: number, field: string, value: any) => {
    const updated = [...sections]; (updated[si] as any)[field] = value; setSections(updated);
  };
  const addField = (si: number) => {
    const updated = [...sections];
    updated[si].fields = [...updated[si].fields, { label: '', key: '', type: 'text', required: false, sortOrder: updated[si].fields.length, options: [] }];
    setSections(updated);
  };
  const updateField = (si: number, fi: number, field: string, value: any) => {
    const updated = [...sections]; (updated[si].fields[fi] as any)[field] = value; setSections(updated);
  };
  const removeField = (si: number, fi: number) => {
    const updated = [...sections]; updated[si].fields = updated[si].fields.filter((_: any, i: number) => i !== fi); setSections(updated);
  };

  const handleSave = async () => {
    setSaving(true); setError('');
    try {
      await formApi.updateForm(id, {
        name,
        description: description || undefined,
        sections: sections.length > 0 ? sections.map((s) => ({
          title: s.title, sortOrder: s.sortOrder,
          fields: s.fields.map((f: any) => ({
            label: f.label, key: f.key, type: f.type, required: f.required,
            placeholder: f.placeholder, helpText: f.helpText, sortOrder: f.sortOrder,
            options: f.options?.length > 0 ? f.options.map((o: any) => ({ label: o.label, value: o.value, sortOrder: o.sortOrder })) : undefined,
          })),
        })) : undefined,
      });
      router.push(`/dashboard/form-builder/${id}`);
    } catch (err: any) { setError(err?.response?.data?.message || 'Failed'); } finally { setSaving(false); }
  };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;
  if (!form) return <div className="text-center py-12 text-red-500">Form not found</div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/dashboard/form-builder" className="hover:text-blue-600">Form Builder</Link><span>/</span><Link href={`/dashboard/form-builder/${id}`} className="hover:text-blue-600">{form.name}</Link><span>/</span><span className="text-gray-900">Edit</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-900">Edit Form</h1>
      {error && <div className="p-3 bg-red-50 border rounded-lg text-sm text-red-700">{error}</div>}

      <div className="bg-white rounded-lg shadow p-6 space-y-5">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Name</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Sections ({sections.length})</h3>
            <button type="button" onClick={addSection} className="text-sm text-blue-600 hover:underline">+ Add Section</button>
          </div>
          {sections.map((s, si) => (
            <div key={si} className="border rounded-lg p-4 mb-3">
              <div className="flex items-center justify-between mb-2">
                <input type="text" value={s.title} onChange={(e) => updateSection(si, 'title', e.target.value)} placeholder="Section title" className="w-48 px-2 py-1 border rounded text-sm font-medium" />
                <button type="button" onClick={() => removeSection(si)} className="text-xs text-red-500 hover:underline">Remove</button>
              </div>
              <div className="ml-4 space-y-2">
                {s.fields.map((f: any, fi: number) => (
                  <div key={fi} className="flex items-center gap-2">
                    <input type="text" value={f.label} onChange={(e) => updateField(si, fi, 'label', e.target.value)} placeholder="Label" className="w-28 px-2 py-1 border rounded text-xs" />
                    <input type="text" value={f.key} onChange={(e) => updateField(si, fi, 'key', e.target.value)} placeholder="Key" className="w-24 px-2 py-1 border rounded text-xs font-mono" />
                    <select value={f.type} onChange={(e) => updateField(si, fi, 'type', e.target.value)} className="w-24 px-2 py-1 border rounded text-xs">
                      <option value="text">Text</option><option value="number">Number</option><option value="textarea">Textarea</option><option value="select">Select</option><option value="radio">Radio</option><option value="checkbox">Checkbox</option><option value="date">Date</option><option value="email">Email</option>
                    </select>
                    <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={f.required} onChange={(e) => updateField(si, fi, 'required', e.target.checked)} className="rounded" />Req</label>
                    <button type="button" onClick={() => removeField(si, fi)} className="text-xs text-red-400 hover:underline">×</button>
                  </div>
                ))}
                <button type="button" onClick={() => addField(si)} className="text-xs text-blue-500 hover:underline ml-1">+ Add Field</button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm">{saving ? 'Saving...' : 'Save Changes'}</button>
          <Link href={`/dashboard/form-builder/${id}`} className="px-6 py-2 border rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancel</Link>
        </div>
      </div>
    </div>
  );
}
