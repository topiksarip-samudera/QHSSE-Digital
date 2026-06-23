'use client';

import { useState } from 'react';
import Link from 'next/link';

const ALLOWED_TYPES_DEFAULT = [
  { mimeType: 'image/jpeg', label: 'JPEG Image', category: 'Images', enabled: true },
  { mimeType: 'image/png', label: 'PNG Image', category: 'Images', enabled: true },
  { mimeType: 'image/gif', label: 'GIF Image', category: 'Images', enabled: true },
  { mimeType: 'image/webp', label: 'WebP Image', category: 'Images', enabled: true },
  { mimeType: 'image/svg+xml', label: 'SVG Image', category: 'Images', enabled: true },
  { mimeType: 'application/pdf', label: 'PDF Document', category: 'Documents', enabled: true },
  { mimeType: 'application/msword', label: 'Word (DOC)', category: 'Documents', enabled: true },
  { mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', label: 'Word (DOCX)', category: 'Documents', enabled: true },
  { mimeType: 'application/vnd.ms-excel', label: 'Excel (XLS)', category: 'Documents', enabled: true },
  { mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', label: 'Excel (XLSX)', category: 'Documents', enabled: true },
  { mimeType: 'application/vnd.ms-powerpoint', label: 'PowerPoint (PPT)', category: 'Documents', enabled: true },
  { mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', label: 'PowerPoint (PPTX)', category: 'Documents', enabled: true },
  { mimeType: 'text/plain', label: 'Text File', category: 'Documents', enabled: true },
  { mimeType: 'text/csv', label: 'CSV File', category: 'Documents', enabled: true },
  { mimeType: 'application/zip', label: 'ZIP Archive', category: 'Archives', enabled: true },
  { mimeType: 'application/x-rar-compressed', label: 'RAR Archive', category: 'Archives', enabled: true },
  { mimeType: 'application/x-7z-compressed', label: '7Z Archive', category: 'Archives', enabled: true },
];

export default function AttachmentSettingsPage() {
  const [maxFileSize, setMaxFileSize] = useState(50);
  const [allowedTypes, setAllowedTypes] = useState(ALLOWED_TYPES_DEFAULT);
  const [storageType, setStorageType] = useState('local');
  const [saved, setSaved] = useState(false);

  const toggleType = (index: number) => {
    const updated = [...allowedTypes];
    updated[index].enabled = !updated[index].enabled;
    setAllowedTypes(updated);
  };

  const handleSave = () => {
    // In production, save to company settings via API
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const enabledCount = allowedTypes.filter((t) => t.enabled).length;

  const categories = [...new Set(allowedTypes.map((t) => t.category))];

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/dashboard/attachments" className="hover:text-blue-600">Attachments</Link>
        <span>/</span>
        <span className="text-gray-900">Settings</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attachment Settings</h1>
          <p className="text-gray-600 mt-1">Configure upload settings and file type restrictions</p>
        </div>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
        >
          {saved ? '✓ Saved' : 'Save Settings'}
        </button>
      </div>

      {/* Max File Size */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Maximum File Size</h2>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={1}
            max={100}
            value={maxFileSize}
            onChange={(e) => setMaxFileSize(Number(e.target.value))}
            className="flex-1"
          />
          <span className="text-sm font-medium text-gray-700 w-16 text-right">{maxFileSize} MB</span>
        </div>
        <p className="text-xs text-gray-400 mt-1">Files larger than this limit will be rejected</p>
      </div>

      {/* Storage Type */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Storage Backend</h2>
        <div className="space-y-2">
          {[
            { value: 'local', label: 'Local Storage', desc: 'Store files on server disk' },
            { value: 'minio', label: 'MinIO', desc: 'S3-compatible object storage' },
            { value: 's3', label: 'AWS S3', desc: 'Amazon S3 cloud storage' },
          ].map((opt) => (
            <label
              key={opt.value}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${
                storageType === opt.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name="storage"
                value={opt.value}
                checked={storageType === opt.value}
                onChange={(e) => setStorageType(e.target.value)}
                className="text-blue-600"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">{opt.label}</p>
                <p className="text-xs text-gray-500">{opt.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Allowed File Types */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Allowed File Types</h2>
          <span className="text-xs text-gray-500">{enabledCount} of {allowedTypes.length} enabled</span>
        </div>

        {categories.map((cat) => (
          <div key={cat} className="mb-4">
            <h3 className="text-sm font-medium text-gray-600 mb-2 uppercase">{cat}</h3>
            <div className="space-y-1">
              {allowedTypes
                .filter((t) => t.category === cat)
                .map((t, idx) => {
                  const realIdx = allowedTypes.indexOf(t);
                  return (
                    <label
                      key={t.mimeType}
                      className="flex items-center gap-3 py-1.5 px-2 rounded hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={t.enabled}
                        onChange={() => toggleType(realIdx)}
                        className="rounded text-blue-600"
                      />
                      <span className="text-sm text-gray-700">{t.label}</span>
                      <span className="text-xs text-gray-400 font-mono">{t.mimeType}</span>
                    </label>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
