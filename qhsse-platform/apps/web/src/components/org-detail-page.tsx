'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface DetailField {
  key: string;
  label: string;
  render?: (val: any, data: any) => React.ReactNode;
}

interface DetailPageProps {
  title: string;
  backHref: string;
  editHref: string;
  api: {
    get: (id: string) => Promise<any>;
    delete?: (id: string) => Promise<any>;
  };
  fields: DetailField[];
  id: string;
}

export default function OrgDetailPage({ title, backHref, editHref, api, fields, id }: DetailPageProps) {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    api.get(id).then((res) => {
      setData(res.data.data);
    }).catch((err) => {
      setError(err.response?.data?.error?.message || 'Failed to load data');
    }).finally(() => setLoading(false));
  }, [api, id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      if (api.delete) await api.delete(id);
      router.push(backHref);
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Delete failed');
    }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!data) return <div className="p-8 text-center text-muted-foreground">Not found</div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href={backHref} className="text-sm text-muted-foreground hover:text-foreground mb-2 inline-block">← Back to {title}</Link>
          <h1 className="text-2xl font-bold">{data.name || title}</h1>
        </div>
        <div className="flex gap-2">
          <Link href={editHref} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Edit</Link>
          {api.delete && (
            <button onClick={handleDelete} className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50">Delete</button>
          )}
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {fields.map((field) => (
            <div key={field.key}>
              <dt className="text-sm font-medium text-muted-foreground">{field.label}</dt>
              <dd className="mt-1 text-sm">{field.render ? field.render(data[field.key], data) : (data[field.key] || '—')}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
