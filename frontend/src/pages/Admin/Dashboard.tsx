import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Mail, FolderGit, Check, Trash2, ShieldAlert } from 'lucide-react';
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

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    projects: 0,
    messages: 0,
    unreadMessages: 0,
    experiences: 0,
    educations: 0,
  });
  const [recentMessages, setRecentMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      const [projectsRes, messagesRes, expRes, eduRes] = await Promise.all([
        api.get('/projects'),
        api.get('/messages'),
        api.get('/experience'),
        api.get('/education'),
      ]);

      const unread = messagesRes.filter((m: any) => !m.is_read).length;
      
      setStats({
        projects: projectsRes.length,
        messages: messagesRes.length,
        unreadMessages: unread,
        experiences: expRes.length,
        educations: eduRes.length,
      });

      // Show top 5 recent messages
      setRecentMessages(messagesRes.slice(0, 5));
    } catch (err) {
      console.error('Error fetching dashboard statistics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleMarkAsRead = async (id: number) => {
    try {
      await api.put(`/messages/${id}/read`);
      fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMessage = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await api.delete(`/messages/${id}`);
      fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <div className="w-10 h-10 rounded-full border-4 border-slate-700 border-t-accent animate-spin mb-4" />
          <span className="font-mono text-xs tracking-wider uppercase">Loading stats...</span>
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    { label: 'Projects', value: stats.projects, icon: FolderGit, color: 'text-sky-500 bg-sky-500/10 border-sky-500/20', link: '/admin/projects' },
    { label: 'Work History', value: stats.experiences, icon: Briefcase, color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20', link: '/admin/experience' },
    { label: 'Unread Messages', value: stats.unreadMessages, icon: Mail, color: stats.unreadMessages > 0 ? 'text-rose-500 bg-rose-500/10 border-rose-500/20 font-bold' : 'text-slate-400 bg-slate-800/20 border-slate-700/20', link: '/admin/messages' },
    { label: 'Total Messages', value: stats.messages, icon: Mail, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', link: '/admin/messages' },
  ];

  return (
    <AdminLayout>
      <div className="text-left">
        <h1 className="text-3xl font-black text-white mb-2">Dashboard</h1>
        <p className="text-slate-400 text-sm mb-8">Overview of your portfolio site CMS modules.</p>
        
        {/* Stat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                onClick={() => navigate(card.link)}
                className={`p-6 rounded-xl border bg-slate-900/40 backdrop-blur-sm cursor-pointer hover:-translate-y-0.5 transition-all duration-200 ${card.color}`}
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-slate-400 text-xs font-bold font-mono tracking-wider uppercase">{card.label}</span>
                  <Icon size={20} />
                </div>
                <span className="text-3xl font-extrabold text-white">{card.value}</span>
              </div>
            );
          })}
        </div>

        {/* Recent Messages Panel */}
        <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/30 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Recent Inquiries</span>
              {stats.unreadMessages > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-rose-500 text-white animate-pulse">
                  {stats.unreadMessages} New
                </span>
              )}
            </h2>
            <button
              onClick={() => navigate('/admin/messages')}
              className="text-xs font-semibold text-accent hover:underline cursor-pointer"
            >
              View Inbox
            </button>
          </div>

          {recentMessages.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              <ShieldAlert className="mx-auto mb-2 opacity-50" size={28} />
              <p>No messages received yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 font-mono text-xs uppercase tracking-wider text-left">
                    <th className="pb-3 pl-2">From</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Message Snippet</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {recentMessages.map((msg) => (
                    <tr
                      key={msg.id}
                      className={`hover:bg-slate-900/10 text-slate-300 transition-colors ${
                        !msg.is_read ? 'bg-slate-900/20 font-semibold text-white' : ''
                      }`}
                    >
                      <td className="py-3.5 pl-2">{msg.name}</td>
                      <td className="py-3.5">{msg.email}</td>
                      <td className="py-3.5 max-w-xs truncate">{msg.message}</td>
                      <td className="py-3.5 text-xs font-mono text-slate-500">
                        {new Date(msg.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 text-right flex justify-end gap-2 pr-2">
                        {!msg.is_read && (
                          <button
                            onClick={() => handleMarkAsRead(msg.id)}
                            className="p-1.5 rounded-lg border border-slate-800 hover:border-emerald-500/30 hover:text-emerald-500 text-slate-500 hover:bg-emerald-500/10 transition-all cursor-pointer"
                            title="Mark as read"
                          >
                            <Check size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="p-1.5 rounded-lg border border-slate-800 hover:border-rose-500/30 hover:text-rose-500 text-slate-500 hover:bg-rose-500/10 transition-all cursor-pointer"
                          title="Delete message"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
export default Dashboard;
