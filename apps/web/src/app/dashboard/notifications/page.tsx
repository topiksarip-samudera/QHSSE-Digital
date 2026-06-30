'use client';

import { useState, useEffect, useCallback } from 'react';
import { notificationApi, NotificationData } from '@/lib/api';
import Link from 'next/link';

const TYPE_COLORS: Record<string, string> = {
  info: 'bg-blue-100 text-primary-foreground',
  warning: 'bg-yellow-100 text-warning-foreground',
  alert: 'bg-red-100 text-destructive-foreground',
  workflow: 'bg-purple-100 text-purple-800',
  action: 'bg-orange-100 text-orange-800',
  reminder: 'bg-success/20 text-success-foreground',
};

const TYPE_ICONS: Record<string, string> = {
  info: 'ℹ️',
  warning: '⚠️',
  alert: '🚨',
  workflow: '🔄',
  action: '✅',
  reminder: '🔔',
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [notifRes, unreadRes] = await Promise.all([
        notificationApi.getNotifications({
          isRead: filter === 'unread' ? false : undefined,
          type: typeFilter || undefined,
          page,
          limit: 20,
        }),
        notificationApi.getUnreadCount(),
      ]);
      setNotifications(notifRes.data.data?.data || []);
      setTotalPages(notifRes.data.data?.meta?.totalPages || 1);
      setUnreadCount(unreadRes.data.data?.count || 0);
    } catch (e) {
      console.error('Failed to load notifications', e);
    } finally {
      setLoading(false);
    }
  }, [filter, typeFilter, page]);

  useEffect(() => { load(); }, [load]);

  const handleMarkRead = async (id: string) => {
    await notificationApi.markAsRead(id);
    load();
  };

  const handleMarkAllRead = async () => {
    await notificationApi.markAllAsRead();
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this notification?')) return;
    await notificationApi.deleteNotification(id);
    load();
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="text-sm text-muted-foreground/80 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/dashboard/notifications/templates"
            className="px-4 py-2 text-sm border rounded-lg hover:bg-muted/50"
          >
            Templates
          </Link>
          <Link
            href="/dashboard/notifications/settings"
            className="px-4 py-2 text-sm border rounded-lg hover:bg-muted/50"
          >
            Settings
          </Link>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/80"
            >
              Mark All Read
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <div className="flex border rounded-lg overflow-hidden">
          {(['all', 'unread'] as const).map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(1); }}
              className={`px-4 py-2 text-sm capitalize ${filter === f ? 'bg-primary text-white' : 'bg-card text-foreground/80 hover:bg-muted/50'}`}
            >
              {f}
            </button>
          ))}
        </div>
        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All Types</option>
          {['info', 'warning', 'alert', 'workflow', 'action', 'reminder'].map((t) => (
            <option key={t} value={t} className="capitalize">{t}</option>
          ))}
        </select>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground/60">Loading notifications...</div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">🔔</div>
          <p className="text-muted-foreground/80">No notifications</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`flex items-start gap-3 p-4 rounded-lg border transition ${
                n.isRead ? 'bg-white' : 'bg-primary/10 border-blue-200'
              }`}
            >
              <span className="text-xl mt-0.5">{TYPE_ICONS[n.type] || '📬'}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm ${n.isRead ? 'text-foreground/80' : 'font-semibold text-foreground'}`}>
                    {n.title}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${TYPE_COLORS[n.type] || 'bg-muted text-muted-foreground'}`}>
                    {n.type}
                  </span>
                </div>
                {n.message && <p className="text-sm text-muted-foreground/80 mt-1 truncate">{n.message}</p>}
                {n.link && (
                  <Link href={n.link} className="text-xs text-primary hover:underline mt-1 inline-block">
                    View →
                  </Link>
                )}
                <p className="text-xs text-muted-foreground/60 mt-1">{timeAgo(n.createdAt)}</p>
              </div>
              <div className="flex gap-1">
                {!n.isRead && (
                  <button
                    onClick={() => handleMarkRead(n.id)}
                    className="text-xs text-primary hover:text-primary-foreground px-2 py-1"
                    title="Mark as read"
                  >
                    ✓
                  </button>
                )}
                <button
                  onClick={() => handleDelete(n.id)}
                  className="text-xs text-red-400 hover:text-destructive px-2 py-1"
                  title="Delete"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded text-sm disabled:opacity-40"
          >
            Prev
          </button>
          <span className="px-3 py-1 text-sm text-muted-foreground/80">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
