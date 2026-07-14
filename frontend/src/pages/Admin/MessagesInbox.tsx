import React, { useEffect, useState } from 'react';
import { Mail, MailOpen, Trash2, ChevronDown, ChevronUp, Reply, Inbox } from 'lucide-react';
import api from '../../utils/api';
import AdminLayout from '../../components/AdminLayout';

interface Message {
  id: number;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export const MessagesInbox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const fetchMessages = async () => {
    try {
      const data = await api.get('/messages');
      setMessages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleToggleExpand = async (msg: Message) => {
    if (expandedId === msg.id) {
      setExpandedId(null);
    } else {
      setExpandedId(msg.id);
      // Mark as read automatically on expansion if unread
      if (!msg.is_read) {
        try {
          await api.put(`/messages/${msg.id}/read`);
          // Update local state directly to prevent full re-render jump
          setMessages((prev) =>
            prev.map((m) => (m.id === msg.id ? { ...m, is_read: true } : m))
          );
        } catch (err) {
          console.error(err);
        }
      }
    }
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await api.delete(`/messages/${id}`);
      if (expandedId === id) setExpandedId(null);
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredMessages = messages.filter((msg) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !msg.is_read;
    return msg.is_read;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <div className="w-10 h-10 rounded-full border-4 border-slate-700 border-t-accent animate-spin mb-4" />
          <span className="font-mono text-xs tracking-wider uppercase">Loading Inbox...</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="text-left">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-white mb-2">Messages Inbox</h1>
            <p className="text-slate-400 text-sm">Review client inquiries and contact forms sent from the main website.</p>
          </div>

          {/* Filters */}
          <div className="flex gap-2 text-sm bg-slate-900 border border-slate-800 p-1.5 rounded-lg w-fit">
            {(['all', 'unread', 'read'] as const).map((opt) => (
              <button
                key={opt}
                onClick={() => setFilter(opt)}
                className={`px-3 py-1 rounded text-xs font-semibold tracking-wide uppercase transition-all cursor-pointer ${
                  filter === opt
                    ? 'bg-accent text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Message Panel */}
        {filteredMessages.length === 0 ? (
          <div className="p-12 text-center border border-slate-800 bg-slate-900/30 rounded-xl text-slate-500">
            <Inbox className="mx-auto mb-3 opacity-30 text-accent" size={36} />
            <p className="text-sm font-medium">No messages found in this category.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMessages.map((msg) => {
              const isExpanded = expandedId === msg.id;
              
              return (
                <div
                  key={msg.id}
                  onClick={() => handleToggleExpand(msg)}
                  className={`rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden ${
                    isExpanded
                      ? 'border-accent bg-slate-900/50'
                      : !msg.is_read
                      ? 'border-slate-800 bg-slate-900/20 shadow-md font-semibold text-white'
                      : 'border-slate-850 bg-slate-950/40 text-slate-300'
                  }`}
                >
                  {/* Header Row */}
                  <div className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <span className={msg.is_read ? 'text-slate-600' : 'text-accent'}>
                        {msg.is_read ? <MailOpen size={16} /> : <Mail size={16} className="animate-bounce" />}
                      </span>
                      <div className="min-w-0">
                        <span className="text-sm">{msg.name}</span>
                        <span className="hidden sm:inline text-xs text-slate-500 font-normal ml-3">
                          &lt;{msg.email}&gt;
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 flex-shrink-0">
                      <span className="text-[10px] font-mono text-slate-500">
                        {new Date(msg.created_at).toLocaleString()}
                      </span>
                      <button
                        onClick={(e) => handleDelete(msg.id, e)}
                        className="p-1.5 rounded text-slate-500 hover:text-rose-500 transition-colors"
                        title="Delete message"
                      >
                        <Trash2 size={14} />
                      </button>
                      <span className="text-slate-500">
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </span>
                    </div>
                  </div>

                  {/* Expanded Content Box */}
                  {isExpanded && (
                    <div className="px-12 pb-5 border-t border-slate-850 pt-4 text-left bg-slate-950/60">
                      <div className="sm:hidden text-xs text-slate-500 mb-3 font-mono">
                        From Email: {msg.email}
                      </div>
                      
                      <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap mb-5">
                        {msg.message}
                      </div>

                      {/* Reply Button */}
                      <a
                        href={`mailto:${msg.email}?subject=Re: Portfolio Inquiry (Vijay Bhesaniya)`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent text-white font-semibold text-xs rounded hover:bg-accent/80 transition-colors shadow shadow-accent/10"
                      >
                        <Reply size={12} />
                        <span>Reply via Email</span>
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
export default MessagesInbox;
