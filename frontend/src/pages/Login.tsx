import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Key, Mail, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/auth/login', { email, password });
      if (response && response.access_token) {
        login(response.access_token);
        navigate('/admin');
      } else {
        setError('Login failed. Please check credentials.');
      }
    } catch (err: any) {
      setError(err.message || 'Incorrect email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 relative">
      {/* Background radial glow */}
      <div className="glow-blob top-[25%] left-[25%] opacity-50" />

      {/* Back link */}
      <a
        href="/"
        onClick={(e) => {
          e.preventDefault();
          navigate('/');
        }}
        className="absolute top-8 left-8 flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-accent uppercase tracking-wider transition-colors"
      >
        <ArrowLeft size={14} />
        <span>Back to site</span>
      </a>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-full bg-accent/10 border border-accent/25 text-accent mb-4">
            <Shield size={32} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Admin Console</h1>
          <p className="text-slate-400 text-sm mt-2">Sign in to manage your portfolio content</p>
        </div>

        <div className="p-6 md:p-8 rounded-2xl border border-slate-800 bg-slate-900/30 backdrop-blur-md shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col text-left">
              <label htmlFor="email" className="text-xs font-semibold text-slate-400 mb-2 font-mono uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-500">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@portfolio.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col text-left">
              <label htmlFor="password" className="text-xs font-semibold text-slate-400 mb-2 font-mono uppercase tracking-wider">Password</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-500">
                  <Key size={16} />
                </span>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/35 rounded-lg text-rose-400 text-sm flex items-center gap-3 text-left">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 rounded-lg bg-accent text-white font-semibold flex items-center justify-center gap-2 hover:bg-accent/80 transition-colors shadow-lg hover:shadow-accent/25 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <span>Access Console</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Login;
