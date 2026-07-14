import React, { useEffect, useState } from 'react';
import { Settings, Save, RefreshCw } from 'lucide-react';
import api from '../../utils/api';
import AdminLayout from '../../components/AdminLayout';

interface Setting {
  id?: number;
  default_theme: string;
  seo_title: string;
  seo_description: string;
  seo_og_image?: string;
  analytics_key?: string;
}

export const SiteSettings: React.FC = () => {
  const [settings, setSettings] = useState<Setting | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchSettings = async () => {
    try {
      const data = await api.get('/settings');
      setSettings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSubmitting(true);
    try {
      await api.put('/settings', settings);
      alert('Site settings updated successfully!');
      fetchSettings();
    } catch (err: any) {
      alert(err.message || 'Failed to update settings.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <div className="w-10 h-10 rounded-full border-4 border-slate-700 border-t-accent animate-spin mb-4" />
          <span className="font-mono text-xs tracking-wider uppercase">Loading Settings...</span>
        </div>
      </AdminLayout>
    );
  }

  if (!settings) return null;

  return (
    <AdminLayout>
      <div className="text-left">
        <h1 className="text-3xl font-black text-white mb-2">Site Settings</h1>
        <p className="text-slate-400 text-sm mb-8">Manage metadata, default themes, and external analytical trackers.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/30 backdrop-blur-sm space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-850">
              <Settings size={18} className="text-accent" />
              <span>SEO & Metadata Fields</span>
            </h2>

            <div className="flex flex-col">
              <label className="text-xs font-semibold text-slate-400 mb-2 font-mono uppercase tracking-wider">SEO Page Title</label>
              <input
                type="text"
                name="seo_title"
                value={settings.seo_title}
                onChange={handleInputChange}
                className="px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-accent"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-semibold text-slate-400 mb-2 font-mono uppercase tracking-wider">SEO Meta Description</label>
              <textarea
                name="seo_description"
                value={settings.seo_description}
                onChange={handleInputChange}
                rows={4}
                className="px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-accent"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-slate-400 mb-2 font-mono uppercase tracking-wider">Default Site Theme</label>
                <select
                  name="default_theme"
                  value={settings.default_theme}
                  onChange={handleInputChange}
                  className="px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-accent"
                >
                  <option value="dark">Dark Theme</option>
                  <option value="light">Light Theme</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-semibold text-slate-400 mb-2 font-mono uppercase tracking-wider">Google Analytics ID / Plausible Key</label>
                <input
                  type="text"
                  name="analytics_key"
                  value={settings.analytics_key || ''}
                  onChange={handleInputChange}
                  placeholder="G-XXXXXXXXXX"
                  className="px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 rounded-lg bg-accent text-white font-semibold flex items-center gap-2 hover:bg-accent/80 transition-colors shadow-lg hover:shadow-accent/25 disabled:opacity-50 cursor-pointer"
            >
              {submitting ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
              <span>Save Site Settings</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};
export default SiteSettings;
