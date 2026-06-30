'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { apiClient } from '@/lib/api';
import Link from 'next/link';

interface Conversation { id: string; title: string; createdAt: string; updatedAt: string; }
interface Message { id: string; role: 'user' | 'assistant'; content: string; createdAt: string; }

export default function AIChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [msgsLoading, setMsgsLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const msgEndRef = useRef<HTMLDivElement>(null);

  const loadConversations = useCallback(async () => {
    try {
      const res = await apiClient.get('/ai/conversations');
      setConversations(res.data.data || []);
    } catch (e) { console.error('Failed to load conversations', e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadConversations(); }, [loadConversations]);

  useEffect(() => {
    if (!selectedId) { setMessages([]); return; }
    (async () => {
      setMsgsLoading(true);
      try {
        const res = await apiClient.get(`/ai/conversations/${selectedId}`);
        setMessages(res.data.data?.messages || res.data.data || []);
      } catch (e) { console.error('Failed to load messages', e); }
      finally { setMsgsLoading(false); }
    })();
  }, [selectedId]);

  useEffect(() => { msgEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleCreate = async () => {
    try {
      const res = await apiClient.post('/ai/conversations', { title: 'New Conversation' });
      const conv = res.data.data;
      setConversations((prev) => [conv, ...prev]);
      setSelectedId(conv.id);
    } catch (e) { console.error('Failed to create conversation', e); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this conversation?')) return;
    try {
      await apiClient.delete(`/ai/conversations/${id}`);
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (selectedId === id) setSelectedId(null);
    } catch (e) { console.error('Failed to delete conversation', e); }
  };

  const handleSend = async () => {
    if (!input.trim() || !selectedId || sending) return;
    const text = input.trim();
    setInput('');
    setSending(true);
    setMessages((prev) => [...prev, { id: 'temp-' + Date.now(), role: 'user', content: text, createdAt: new Date().toISOString() }]);
    try {
      const res = await apiClient.post(`/ai/conversations/${selectedId}/messages`, { content: text });
      setMessages((prev) => [...prev.filter((m) => !m.id.startsWith('temp-')), res.data.data]);
      loadConversations();
    } catch (e) { console.error('Failed to send message', e); }
    finally { setSending(false); }
  };

  const handleExport = async () => {
    if (!selectedId) return;
    try {
      const res = await apiClient.get(`/ai/conversations/${selectedId}/export`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a'); a.href = url; a.download = `conversation-${selectedId}.json`; a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) { console.error('Failed to export', e); }
  };

  const formatTime = (s: string) => new Date(s).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex h-[calc(100vh-8rem)]">
      {/* Sidebar */}
      <div className="w-72 border-r bg-white flex flex-col flex-shrink-0">
        <div className="p-3 border-b flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Conversations</h2>
          <button onClick={handleCreate} className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700">+ New</button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="text-center py-8 text-gray-400 text-sm">Loading...</div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-2xl mb-2">💬</div>
              <p className="text-sm text-gray-400">No conversations</p>
            </div>
          ) : (
            conversations.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={`flex items-center justify-between px-3 py-2.5 cursor-pointer border-b transition ${
                  selectedId === c.id ? 'bg-blue-50 border-l-2 border-l-blue-600' : 'hover:bg-gray-50'
                }`}
              >
                <div className="min-w-0">
                  <p className="text-sm text-gray-900 truncate">{c.title || 'Untitled'}</p>
                  <p className="text-xs text-gray-400">{new Date(c.updatedAt).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(c.id); }}
                  className="text-xs text-red-400 hover:text-red-600 ml-2 flex-shrink-0"
                >✕</button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {!selectedId ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-3">🤖</div>
              <p className="text-gray-500">Select a conversation or create a new one</p>
            </div>
          </div>
        ) : (
          <>
            <div className="px-4 py-2 border-b bg-white flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">
                {conversations.find((c) => c.id === selectedId)?.title || 'Conversation'}
              </h3>
              <button onClick={handleExport} className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 border rounded">Export</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {msgsLoading ? (
                <div className="text-center py-8 text-gray-400 text-sm">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">No messages yet. Start the conversation.</div>
              ) : (
                messages.map((m) => (
                  <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                      m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border text-gray-800'
                    }`}>
                      <p className="whitespace-pre-wrap break-words">{m.content}</p>
                      <p className={`text-xs mt-0.5 ${m.role === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>{formatTime(m.createdAt)}</p>
                    </div>
                  </div>
                ))
              )}
              <div ref={msgEndRef} />
            </div>
            <div className="border-t bg-white p-3 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={sending}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || sending}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {sending ? 'Sending...' : 'Send'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
