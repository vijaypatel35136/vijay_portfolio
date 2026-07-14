import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, User, Code, Briefcase, GraduationCap, Mail, Settings, LogOut, ExternalLink, Menu, X 
} from 'lucide-react';
import api from '../utils/api';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchUnread = async () => {
        try {
          const messages = await api.get('/messages');
          const unread = messages.filter((m: any) => !m.is_read).length;
          setUnreadCount(unread);
        } catch (err) {
          console.error(err);
        }
      };
      fetchUnread();
      // Poll every 30s
      const interval = setInterval(fetchUnread, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-400">
        <div className="w-8 h-8 rounded-full border-4 border-slate-700 border-t-accent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Profile Settings', path: '/admin/profile', icon: User },
    { label: 'Skills Manager', path: '/admin/skills', icon: Code },
    { label: 'Experience Manager', path: '/admin/experience', icon: Briefcase },
    { label: 'Education Manager', path: '/admin/education', icon: GraduationCap },
    { label: 'Projects Manager', path: '/admin/projects', icon: Briefcase },
    { label: 'Messages Inbox', path: '/admin/messages', icon: Mail, badge: unreadCount },
    { label: 'Site Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Header Bar */}
      <div className="md:hidden flex justify-between items-center bg-slate-900 px-6 py-4 border-b border-slate-800">
        <span className="text-xl font-bold tracking-tight text-white">
          Admin Panel<span className="text-accent">.</span>
        </span>
        <div className="flex items-center gap-4">
          <a href="/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white">
            <ExternalLink size={18} />
          </a>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-slate-400 hover:text-white">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between py-6 px-4 z-40 transform transition-transform duration-300 md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Logo / Brand */}
          <div className="flex items-center justify-between mb-8 px-2">
            <span className="text-xl font-extrabold text-white hidden md:block">
              Admin Panel<span className="text-accent">.</span>
            </span>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-accent flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              <span>View Site</span>
              <ExternalLink size={12} />
            </a>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <a
                  key={item.label}
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileOpen(false);
                    navigate(item.path);
                  }}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-accent text-white shadow-md shadow-accent/10'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'} />
                    <span>{item.label}</span>
                  </div>
                  {!!item.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-500 text-white animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </a>
              );
            })}
          </nav>
        </div>

        {/* Log out option */}
        <div className="border-t border-slate-800 pt-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-all cursor-pointer"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main CMS Display Content */}
      <main className="flex-1 min-w-0 py-8 px-6 md:px-12 overflow-y-auto z-10">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
export default AdminLayout;
