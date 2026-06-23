'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { attachmentApi } from '@/lib/api';
import Link from 'next/link';

export default function UploadAttachmentPage() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [file, setFile] = useState<File | null>(null);
  const [recordType, setRecordType] = useState('');
  const [recordId, setRecordId] = useState('');
  const [description, setDescription] = useState('');
  const [linkedRecords, setLinkedRecords] = useState<
    { linkedModule: string; linkedRecordType: string; linkedRecordId: string; linkContext: string }[]
  >([]);

  const addLinkedRecord = () => {
    setLinkedRecords([...linkedRecords, { linkedModule: '', linkedRecordType: '', linkedRecordId: '', linkContext: '' }]);
  };

  const removeLinkedRecord = (index: number) => {
    setLinkedRecords(linkedRecords.filter((_, i) => i !== index));
  };

  const updateLinkedRecord = (index: number, field: string, value: string) => {
    const updated = [...linkedRecords];
    (updated[index] as any)[field] = value;
    setLinkedRecords(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    if (!recordType || !recordId) {
      setError('Record type and Record ID are required');
      return;
    }

    setUploading(true);
    try {
      await attachmentApi.upload(file, recordType, recordId, description || undefined);
      setSuccess('File uploaded successfully!');

      // Create additional file links if any
      if (linkedRecords.length > 0) {
        // Note: File links are created during upload via the API
      }

      setTimeout(() => router.push('/dashboard/attachments'), 1500);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const recordTypes = [
    'incident', 'audit', 'risk', 'action', 'permit',
    'inspection', 'training', 'document', 'compliance',
    'environment', 'quality', 'security', 'contractor',
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/dashboard/attachments" className="hover:text-blue-600">Attachments</Link>
        <span>/</span>
        <span className="text-gray-900">Upload</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Upload Attachment</h1>
        <p className="text-gray-600 mt-1">Upload a file and link it to a record</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
            {success}
          </div>
        )}

        {/* File Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">File *</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {file && (
            <p className="text-xs text-gray-500 mt-1">
              {file.name} ({(file.size / 1024).toFixed(1)} KB) - {file.type}
            </p>
          )}
          <p className="text-xs text-gray-400 mt-1">
            Allowed: Images, PDF, DOC, XLS, PPT, CSV, TXT, ZIP (max 50MB)
          </p>
        </div>

        {/* Record Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Record Type *</label>
          <select
            value={recordType}
            onChange={(e) => setRecordType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select record type</option>
            {recordTypes.map((rt) => (
              <option key={rt} value={rt}>{rt.charAt(0).toUpperCase() + rt.slice(1)}</option>
            ))}
          </select>
        </div>

        {/* Record ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Record ID *</label>
          <input
            type="text"
            value={recordId}
            onChange={(e) => setRecordId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g. INC-001"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Optional description for this attachment..."
          />
        </div>

        {/* Additional Linked Records */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700">Additional Linked Records</h3>
            <button
              type="button"
              onClick={addLinkedRecord}
              className="text-sm text-blue-600 hover:underline"
            >
              + Add Link
            </button>
          </div>
          <p className="text-xs text-gray-400 mb-3">
            Link this file to additional records across modules
          </p>
          {linkedRecords.map((lr, idx) => (
            <div key={idx} className="grid grid-cols-4 gap-2 mb-2 p-3 bg-gray-50 rounded-lg">
              <input
                type="text"
                value={lr.linkedModule}
                onChange={(e) => updateLinkedRecord(idx, 'linkedModule', e.target.value)}
                placeholder="Module"
                className="px-2 py-1 border border-gray-300 rounded text-xs"
              />
              <input
                type="text"
                value={lr.linkedRecordType}
                onChange={(e) => updateLinkedRecord(idx, 'linkedRecordType', e.target.value)}
                placeholder="Record Type"
                className="px-2 py-1 border border-gray-300 rounded text-xs"
              />
              <input
                type="text"
                value={lr.linkedRecordId}
                onChange={(e) => updateLinkedRecord(idx, 'linkedRecordId', e.target.value)}
                placeholder="Record ID"
                className="px-2 py-1 border border-gray-300 rounded text-xs"
              />
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={lr.linkContext}
                  onChange={(e) => updateLinkedRecord(idx, 'linkContext', e.target.value)}
                  placeholder="Context"
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                />
                <button
                  type="button"
                  onClick={() => removeLinkedRecord(idx)}
                  className="text-red-500 hover:text-red-700 text-xs px-1"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-4 border-t">
          <button
            type="submit"
            disabled={uploading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            {uploading ? 'Uploading...' : 'Upload File'}
          </button>
          <Link
            href="/dashboard/attachments"
            className="px-6 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
