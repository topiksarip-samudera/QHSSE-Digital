'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { auditLogApi, AuditLogEntry } from '@/lib/api';
import Link from 'next/link';

const ACTION_COLORS: Record<string, string> = {
  create: 'bg-green-100 text-green-800',
  update: 'bg-blue-100 text-blue-800',
  delete: 'bg-red-100 text-red-800',
  view: 'bg-gray-100 text-gray-800',
  export: 'bg-purple-100 text-purple-800',
};

function JsonView({ data }: { data: any }) {
  if (!data) return <span className="text-gray-400 text-sm">N/A</span>;
  return (
    <pre className="text-xs bg-gray-50 p-3 rounded-lg overflow-x-auto max-h-64 overflow-y-auto font-mono text-gray-700">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}

export default function AuditLogDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [log, setLog] = useState<AuditLogEntry | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await auditLogApi.getAuditLogById(id);
      setLog(res.data);
    } catch (err) {
      console.error('Failed to load audit log', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return <div className="text-center py-12 text-gray-500">Loading audit log...</div>;
  if (!log) return <div className="text-center py-12 text-red-500">Audit log not found</div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/dashboard/audit-log" className="hover:text-blue-600">Audit Log</Link>
        <span>/</span>
        <span className="text-gray-900">Detail</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Audit Log Detail</h1>
        <p className="text-gray-600 mt-1 font-mono text-sm">{log.id}</p>
      </div>

      {/* Main Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Event Information</h2>
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm text-gray-500">Timestamp</dt>
            <dd className="text-sm font-medium text-gray-900">{new Date(log.createdAt).toLocaleString()}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Module</dt>
            <dd>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                {log.module}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Action</dt>
            <dd>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${ACTION_COLORS[log.action] || 'bg-gray-100 text-gray-800'}`}>
                {log.action}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Record Type</dt>
            <dd className="text-sm font-medium text-gray-900">{log.recordType || '-'}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Record ID</dt>
            <dd className="text-sm font-mono text-gray-600">{log.recordId || '-'}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Actor</dt>
            <dd className="text-sm font-medium text-gray-900">
              {log.actor ? `${log.actor.firstName} ${log.actor.lastName} (${log.actor.email})` : log.actorId}
            </dd>
          </div>
        </dl>
      </div>

      {/* Network Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Network Information</h2>
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm text-gray-500">IP Address</dt>
            <dd className="text-sm font-mono text-gray-600">{log.ipAddress || '-'}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Company ID</dt>
            <dd className="text-sm font-mono text-gray-600">{log.companyId || '-'}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-sm text-gray-500 mb-1">User Agent</dt>
            <dd className="text-xs text-gray-600 break-all">{log.userAgent || '-'}</dd>
          </div>
        </dl>
      </div>

      {/* Values */}
      {log.oldValue && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Old Value</h2>
          <JsonView data={log.oldValue} />
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">New Value</h2>
        <JsonView data={log.newValue} />
      </div>

      {log.metadata && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Metadata</h2>
          <JsonView data={log.metadata} />
        </div>
      )}
    </div>
  );
}
