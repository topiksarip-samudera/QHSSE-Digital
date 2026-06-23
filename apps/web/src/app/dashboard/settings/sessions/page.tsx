'use client';

import { useState, useEffect } from 'react';
import { authApi } from '@/lib/api';

interface Session {
  id: string;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  expiresAt: string;
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadSessions = async () => {
    try {
      setLoading(true);
      const res = await authApi.getSessions();
      setSessions(res.data.data || []);
    } catch (err: any) {
      setError('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleRevoke = async (sessionId: string) => {
    if (!confirm('Revoke this session? The device will be logged out.')) return;
    try {
      await authApi.revokeSession(sessionId);
      setSuccess('Session revoked');
      loadSessions();
    } catch {
      setError('Failed to revoke session');
    }
  };

  const handleRevokeAll = async () => {
    if (!confirm('Revoke ALL sessions? You will be logged out from all devices.')) return;
    try {
      const res = await authApi.revokeAllSessions();
      setSuccess(res.data.data?.message || 'All sessions revoked');
      loadSessions();
    } catch {
      setError('Failed to revoke sessions');
    }
  };

  const parseUserAgent = (ua: string | null) => {
    if (!ua) return 'Unknown device';
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return ua.substring(0, 50);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString();
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Active Sessions</h1>
        <button
          onClick={handleRevokeAll}
          className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
        >
          Revoke All Sessions
        </button>
      </div>

      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800">{success}</p>
        </div>
      )}

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading sessions...</div>
      ) : sessions.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center text-gray-500">
          No active sessions found.
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
          {sessions.map((session) => (
            <div key={session.id} className="p-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">
                    {parseUserAgent(session.userAgent)}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
                <div className="mt-1 text-xs text-gray-500 space-x-3">
                  <span>IP: {session.ipAddress || 'N/A'}</span>
                  <span>Started: {formatDate(session.createdAt)}</span>
                  <span>Expires: {formatDate(session.expiresAt)}</span>
                </div>
              </div>
              <button
                onClick={() => handleRevoke(session.id)}
                className="ml-4 text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Revoke
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
