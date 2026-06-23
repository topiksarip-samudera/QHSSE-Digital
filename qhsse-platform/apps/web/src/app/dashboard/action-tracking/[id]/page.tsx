'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { actionApi, ActionData } from '@/lib/api';
import Link from 'next/link';

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-800', submitted: 'bg-blue-100 text-blue-800',
  in_review: 'bg-yellow-100 text-yellow-800', approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800', closed: 'bg-green-200 text-green-900', cancelled: 'bg-gray-100 text-gray-500',
};
const PRIORITY_COLORS: Record<string, string> = {
  low: 'bg-green-100 text-green-800', medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800', critical: 'bg-red-100 text-red-800',
};

export default function ActionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [action, setAction] = useState<ActionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [verifyNotes, setVerifyNotes] = useState('');
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await actionApi.getAction(id);
      setAction(res.data);
    } catch (err) {
      console.error('Failed to load action', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleComment = async () => {
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      await actionApi.addComment(id, { content: comment });
      setComment('');
      fetchData();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try { await actionApi.submitForVerification(id); fetchData(); } catch (err: any) { setError(err?.response?.data?.message || 'Failed'); } finally { setSubmitting(false); }
  };

  const handleVerify = async () => {
    setSubmitting(true);
    try { await actionApi.verify(id, { notes: verifyNotes || undefined }); fetchData(); } catch (err: any) { setError(err?.response?.data?.message || 'Failed'); } finally { setSubmitting(false); }
  };

  const handleReject = async () => {
    setSubmitting(true);
    try { await actionApi.rejectVerification(id, { notes: verifyNotes || undefined }); fetchData(); } catch (err: any) { setError(err?.response?.data?.message || 'Failed'); } finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this action?')) return;
    try { await actionApi.deleteAction(id); router.push('/dashboard/action-tracking'); } catch (err) { console.error(err); }
  };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading action...</div>;
  if (!action) return <div className="text-center py-12 text-red-500">Action not found</div>;

  const canSubmit = action.status === 'draft' || action.status === 'rejected';
  const canVerify = action.status === 'submitted' || action.status === 'in_review';

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/dashboard/action-tracking" className="hover:text-blue-600">Action Tracking</Link>
        <span>/</span>
        <span className="text-gray-900 truncate">{action.title}</span>
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{action.title}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[action.status] || ''}`}>{action.status.replace('_', ' ')}</span>
            <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${PRIORITY_COLORS[action.priority] || ''}`}>{action.priority}</span>
          </div>
        </div>
        <div className="flex gap-2">
          {canSubmit && <button onClick={handleSubmit} disabled={submitting} className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">Submit</button>}
          {canVerify && <>
            <button onClick={handleVerify} disabled={submitting} className="px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700">Verify</button>
            <button onClick={handleReject} disabled={submitting} className="px-3 py-1.5 bg-red-600 text-white rounded text-sm hover:bg-red-700">Reject</button>
          </>}
          <Link href={`/dashboard/action-tracking/${id}/edit`} className="px-3 py-1.5 border rounded text-sm hover:bg-gray-50">Edit</Link>
          <button onClick={handleDelete} className="px-3 py-1.5 border border-red-300 text-red-600 rounded text-sm hover:bg-red-50">Delete</button>
        </div>
      </div>

      {/* Info */}
      <div className="bg-white rounded-lg shadow p-6 grid grid-cols-2 gap-4">
        <div><dt className="text-sm text-gray-500">Assignee</dt><dd className="text-sm font-medium">{action.assignee?.email || action.assignedTo}</dd></div>
        <div><dt className="text-sm text-gray-500">Creator</dt><dd className="text-sm">{action.creator?.email || action.createdBy}</dd></div>
        <div><dt className="text-sm text-gray-500">Due Date</dt><dd className="text-sm">{action.dueDate ? new Date(action.dueDate).toLocaleDateString() : '-'}</dd></div>
        <div><dt className="text-sm text-gray-500">Source</dt><dd className="text-sm">{action.sourceType ? `${action.sourceType} / ${action.sourceId}` : '-'}</dd></div>
        <div className="col-span-2"><dt className="text-sm text-gray-500">Description</dt><dd className="text-sm mt-1">{action.description || 'No description'}</dd></div>
      </div>

      {/* Verification notes */}
      {(canVerify) && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-3">Verification Notes</h2>
          <textarea value={verifyNotes} onChange={(e) => setVerifyNotes(e.target.value)} rows={2} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Add notes for verification/rejection..." />
        </div>
      )}

      {/* Evidences */}
      {action.evidences && action.evidences.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-3">Evidence ({action.evidences.length})</h2>
          <ul className="space-y-2">
            {action.evidences.map((ev: any) => (
              <li key={ev.id} className="flex items-center justify-between text-sm">
                <span className="text-gray-700">{ev.description || ev.attachment?.file?.originalName || 'File'}</span>
                <span className="text-xs text-gray-400">{new Date(ev.createdAt).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Comments */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-3">Comments ({action.comments?.length || 0})</h2>
        <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
          {action.comments?.map((c: any) => (
            <div key={c.id} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-gray-700">{c.user?.email || c.userId}</span>
                <span className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleString()}</span>
              </div>
              <p className="text-sm text-gray-600">{c.content}</p>
            </div>
          ))}
          {(!action.comments || action.comments.length === 0) && <p className="text-sm text-gray-400">No comments yet</p>}
        </div>
        {action.status !== 'closed' && action.status !== 'cancelled' && (
          <div className="flex gap-2">
            <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleComment()} placeholder="Add a comment..." className="flex-1 px-3 py-2 border rounded-lg text-sm" />
            <button onClick={handleComment} disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">Send</button>
          </div>
        )}
      </div>

      {/* History */}
      {action.histories && action.histories.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-3">History</h2>
          <ul className="space-y-2">
            {action.histories.map((h: any) => (
              <li key={h.id} className="text-sm flex items-center gap-2">
                <span className="text-gray-500 w-32">{new Date(h.createdAt).toLocaleString()}</span>
                <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[h.event] || 'bg-gray-100'}`}>{h.event}</span>
                <span className="text-xs text-gray-400">{h.user?.email || h.userId}</span>
                {h.notes && <span className="text-xs text-gray-500 truncate">- {h.notes}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
