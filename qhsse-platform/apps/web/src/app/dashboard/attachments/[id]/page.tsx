'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { attachmentApi, AttachmentData } from '@/lib/api';
import Link from 'next/link';

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AttachmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [attachment, setAttachment] = useState<AttachmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [description, setDescription] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await attachmentApi.getAttachment(id);
      setAttachment(res.data);
      setDescription(res.data.description || '');
    } catch (err) {
      console.error('Failed to load attachment', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleUpdate = async () => {
    try {
      await attachmentApi.updateAttachment(id, { description });
      setEditing(false);
      fetchData();
    } catch (err) {
      console.error('Update failed', err);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this attachment?')) return;
    try {
      await attachmentApi.deleteAttachment(id);
      router.push('/dashboard/attachments');
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const handleRestore = async () => {
    try {
      await attachmentApi.restoreAttachment(id);
      fetchData();
    } catch (err) {
      console.error('Restore failed', err);
    }
  };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading attachment...</div>;
  if (!attachment) return <div className="text-center py-12 text-red-500">Attachment not found</div>;

  const file = attachment.file;
  const isDeleted = !!attachment.deletedAt;

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/dashboard/attachments" className="hover:text-blue-600">Attachments</Link>
        <span>/</span>
        <span className="text-gray-900">{file?.originalName || 'Detail'}</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{file?.originalName}</h1>
          {isDeleted && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 mt-1">
              Deleted
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {!isDeleted && (
            <>
              <a
                href={attachmentApi.getDownloadUrl(id)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download
              </a>
              <Link
                href={`/dashboard/attachments/${id}/edit`}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
              >
                Edit
              </Link>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
                Delete
              </button>
            </>
          )}
          {isDeleted && (
            <button onClick={handleRestore} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
              Restore
            </button>
          )}
        </div>
      </div>

      {/* File Info */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">File Information</h2>
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm text-gray-500">Original Name</dt>
            <dd className="text-sm font-medium text-gray-900">{file?.originalName}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">MIME Type</dt>
            <dd className="text-sm font-medium text-gray-900">{file?.mimeType}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Size</dt>
            <dd className="text-sm font-medium text-gray-900">{formatSize(file?.size || 0)}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Storage</dt>
            <dd className="text-sm font-medium text-gray-900">{file?.bucket}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Hash (MD5)</dt>
            <dd className="text-sm font-mono text-gray-600">{file?.hash || 'N/A'}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Uploaded</dt>
            <dd className="text-sm font-medium text-gray-900">{new Date(attachment.createdAt).toLocaleString()}</dd>
          </div>
        </dl>
      </div>

      {/* Record Link */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Linked Record</h2>
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm text-gray-500">Record Type</dt>
            <dd>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                {attachment.recordType}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Record ID</dt>
            <dd className="text-sm font-mono text-gray-600">{attachment.recordId}</dd>
          </div>
        </dl>
      </div>

      {/* Description */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Description</h2>
          {!editing && !isDeleted && (
            <button onClick={() => setEditing(true)} className="text-sm text-blue-600 hover:underline">Edit</button>
          )}
        </div>
        {editing ? (
          <div className="space-y-3">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="Add a description..."
            />
            <div className="flex gap-2">
              <button onClick={handleUpdate} className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                Save
              </button>
              <button onClick={() => { setEditing(false); setDescription(attachment.description || ''); }} className="px-3 py-1.5 border rounded text-sm hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-600">{attachment.description || 'No description'}</p>
        )}
      </div>

      {/* File Links */}
      {attachment.fileLinks && attachment.fileLinks.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Additional Linked Records</h2>
          <ul className="space-y-2">
            {attachment.fileLinks.map((fl: any) => (
              <li key={fl.id} className="flex items-center gap-2 text-sm">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                  {fl.linkedModule}
                </span>
                <span className="text-gray-400">/</span>
                <span className="text-gray-600">{fl.linkedRecordType}</span>
                <span className="text-gray-400">/</span>
                <span className="font-mono text-gray-500">{fl.linkedRecordId}</span>
                {fl.linkContext && (
                  <span className="text-gray-400 text-xs">({fl.linkContext})</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
