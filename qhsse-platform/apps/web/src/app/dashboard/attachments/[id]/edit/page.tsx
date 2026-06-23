'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { attachmentApi, AttachmentData, FileLinkData } from '@/lib/api';
import Link from 'next/link';

export default function EditAttachmentPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [attachment, setAttachment] = useState<AttachmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [description, setDescription] = useState('');
  const [fileLinks, setFileLinks] = useState<FileLinkData[]>([]);
  const [newLink, setNewLink] = useState({ linkedModule: '', linkedRecordType: '', linkedRecordId: '', linkContext: '' });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await attachmentApi.getAttachment(id);
      setAttachment(res.data);
      setDescription(res.data.description || '');

      const linksRes = await attachmentApi.getFileLinksByAttachment(id);
      setFileLinks(linksRes.data || []);
    } catch (err) {
      console.error('Failed to load attachment', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await attachmentApi.updateAttachment(id, { description });
      router.push(`/dashboard/attachments/${id}`);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleAddLink = async () => {
    if (!newLink.linkedModule || !newLink.linkedRecordType || !newLink.linkedRecordId) return;
    try {
      await attachmentApi.createFileLink({
        attachmentId: id,
        ...newLink,
      });
      setNewLink({ linkedModule: '', linkedRecordType: '', linkedRecordId: '', linkContext: '' });
      fetchData();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to add link');
    }
  };

  const handleRemoveLink = async (fileLinkId: string) => {
    try {
      await attachmentApi.deleteFileLink(fileLinkId);
      fetchData();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to remove link');
    }
  };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading attachment...</div>;
  if (!attachment) return <div className="text-center py-12 text-red-500">Attachment not found</div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/dashboard/attachments" className="hover:text-blue-600">Attachments</Link>
        <span>/</span>
        <Link href={`/dashboard/attachments/${id}`} className="hover:text-blue-600">
          {attachment.file?.originalName || 'Detail'}
        </Link>
        <span>/</span>
        <span className="text-gray-900">Edit</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Attachment</h1>
        <p className="text-gray-600 mt-1">{attachment.file?.originalName}</p>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); handleSave(); }}
        className="bg-white rounded-lg shadow p-6 space-y-6"
      >
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
        )}

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Add a description..."
          />
        </div>

        {/* Linked Records */}
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Linked Records</h3>
          {fileLinks.length === 0 ? (
            <p className="text-sm text-gray-400">No additional links</p>
          ) : (
            <ul className="space-y-2 mb-4">
              {fileLinks.map((fl) => (
                <li key={fl.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-sm">
                  <div>
                    <span className="font-medium text-gray-700">{fl.linkedModule}</span>
                    <span className="text-gray-400 mx-1">/</span>
                    <span className="text-gray-600">{fl.linkedRecordType}</span>
                    <span className="text-gray-400 mx-1">/</span>
                    <span className="font-mono text-gray-500">{fl.linkedRecordId}</span>
                    {fl.linkContext && (
                      <span className="text-gray-400 ml-2">({fl.linkContext})</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveLink(fl.id)}
                    className="text-red-500 hover:text-red-700 text-xs"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="grid grid-cols-4 gap-2 p-3 bg-blue-50 rounded-lg">
            <input
              type="text"
              value={newLink.linkedModule}
              onChange={(e) => setNewLink({ ...newLink, linkedModule: e.target.value })}
              placeholder="Module"
              className="px-2 py-1.5 border border-gray-300 rounded text-xs"
            />
            <input
              type="text"
              value={newLink.linkedRecordType}
              onChange={(e) => setNewLink({ ...newLink, linkedRecordType: e.target.value })}
              placeholder="Record Type"
              className="px-2 py-1.5 border border-gray-300 rounded text-xs"
            />
            <input
              type="text"
              value={newLink.linkedRecordId}
              onChange={(e) => setNewLink({ ...newLink, linkedRecordId: e.target.value })}
              placeholder="Record ID"
              className="px-2 py-1.5 border border-gray-300 rounded text-xs"
            />
            <div className="flex gap-1">
              <input
                type="text"
                value={newLink.linkContext}
                onChange={(e) => setNewLink({ ...newLink, linkContext: e.target.value })}
                placeholder="Context"
                className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-xs"
              />
              <button
                type="button"
                onClick={handleAddLink}
                className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <Link
            href={`/dashboard/attachments/${id}`}
            className="px-6 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
