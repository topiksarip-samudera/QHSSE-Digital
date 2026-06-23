'use client';

import { useState, useEffect, useCallback } from 'react';
import { attachmentApi, AttachmentData, AttachmentStats } from '@/lib/api';
import Link from 'next/link';

const MIME_ICONS: Record<string, string> = {
  'image/jpeg': '🖼️',
  'image/png': '🖼️',
  'image/gif': '🖼️',
  'image/webp': '🖼️',
  'application/pdf': '📄',
  'application/msword': '📝',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '📝',
  'application/vnd.ms-excel': '📊',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '📊',
  'text/plain': '📃',
  'text/csv': '📊',
  'application/zip': '📦',
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AttachmentsPage() {
  const [attachments, setAttachments] = useState<AttachmentData[]>([]);
  const [stats, setStats] = useState<AttachmentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [recordTypeFilter, setRecordTypeFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [attRes, statsRes] = await Promise.all([
        attachmentApi.getAttachments({ page, limit: 20, recordType: recordTypeFilter || undefined }),
        attachmentApi.getStats(),
      ]);
      setAttachments(attRes.data.data || []);
      setTotalPages(attRes.data.meta?.totalPages || 1);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Failed to load attachments', err);
    } finally {
      setLoading(false);
    }
  }, [page, recordTypeFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this attachment?')) return;
    try {
      await attachmentApi.deleteAttachment(id);
      fetchData();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Delete ${selectedIds.length} attachment(s)?`)) return;
    try {
      await attachmentApi.bulkDelete(selectedIds);
      setSelectedIds([]);
      fetchData();
    } catch (err) {
      console.error('Bulk delete failed', err);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const recordTypes = stats?.byType || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attachments & Evidence</h1>
          <p className="text-gray-600 mt-1">Manage uploaded files and evidence documents</p>
        </div>
        {selectedIds.length > 0 && (
          <button onClick={handleBulkDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Delete Selected ({selectedIds.length})
          </button>
        )}
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Total Attachments</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalAttachments}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Total Size</p>
            <p className="text-2xl font-bold text-gray-900">{formatSize(stats.totalSize)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Record Types</p>
            <p className="text-2xl font-bold text-gray-900">{recordTypes.length}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3 items-center">
        <select
          value={recordTypeFilter}
          onChange={(e) => { setRecordTypeFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="">All Record Types</option>
          {recordTypes.map((rt) => (
            <option key={rt.recordType} value={rt.recordType}>
              {rt.recordType} ({rt.count})
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading attachments...</div>
      ) : attachments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">No attachments found</p>
          <p className="text-gray-400 text-sm mt-1">Upload files from module records (incidents, audits, etc.)</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === attachments.length}
                    onChange={(e) => setSelectedIds(e.target.checked ? attachments.map((a) => a.id) : [])}
                    className="rounded"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">File</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Record</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uploaded</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {attachments.map((att) => (
                <tr key={att.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(att.id)}
                      onChange={() => toggleSelect(att.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{MIME_ICONS[att.file?.mimeType || ''] || '📎'}</span>
                      <div>
                        <Link href={`/dashboard/attachments/${att.id}`} className="text-sm font-medium text-blue-600 hover:underline">
                          {att.file?.originalName || 'Unknown'}
                        </Link>
                        <p className="text-xs text-gray-400">{att.file?.mimeType}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      {att.recordType}
                    </span>
                    <p className="text-xs text-gray-400 mt-0.5">{att.recordId}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{formatSize(att.file?.size || 0)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{new Date(att.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <a
                      href={attachmentApi.getDownloadUrl(att.id)}
                      className="text-sm text-blue-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download
                    </a>
                    <button onClick={() => handleDelete(att.id)} className="text-sm text-red-600 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 text-sm border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 text-sm border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
