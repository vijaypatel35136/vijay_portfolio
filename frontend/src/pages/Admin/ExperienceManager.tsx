import React, { useEffect, useState } from 'react';
import { Briefcase, Trash2, Edit2, Save, X, ArrowUp, ArrowDown } from 'lucide-react';
import api from '../../utils/api';
import AdminLayout from '../../components/AdminLayout';

interface Experience {
  id: number;
  title: string;
  company: string;
  location: string;
  start_date: string;
  end_date: string;
  bullets: string[];
  sort_order: number;
}

export const ExperienceManager: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [bulletText, setBulletText] = useState('');

  const fetchExperiences = async () => {
    try {
      const data = await api.get('/experience');
      setExperiences(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !company.trim()) return;

    // Split text by lines to construct bullets list
    const bullets = bulletText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const payload = {
      title: title.trim(),
      company: company.trim(),
      location: location.trim(),
      start_date: startDate.trim(),
      end_date: endDate.trim() || 'Present',
      bullets,
      sort_order: editingId ? experiences.find((ex) => ex.id === editingId)?.sort_order || 0 : experiences.length + 1,
    };

    try {
      if (editingId) {
        await api.put(`/experience/${editingId}`, payload);
      } else {
        await api.post('/experience', payload);
      }
      resetForm();
      fetchExperiences();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (exp: Experience) => {
    setEditingId(exp.id);
    setTitle(exp.title);
    setCompany(exp.company);
    setLocation(exp.location);
    setStartDate(exp.start_date);
    setEndDate(exp.end_date);
    setBulletText(exp.bullets.join('\n'));
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this experience entry?')) return;
    try {
      await api.delete(`/experience/${id}`);
      fetchExperiences();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= experiences.length) return;

    const currentExp = experiences[index];
    const targetExp = experiences[targetIdx];

    // Swap sort orders
    const tempOrder = currentExp.sort_order;
    currentExp.sort_order = targetExp.sort_order;
    targetExp.sort_order = tempOrder;

    try {
      await Promise.all([
        api.put(`/experience/${currentExp.id}`, currentExp),
        api.put(`/experience/${targetExp.id}`, targetExp),
      ]);
      fetchExperiences();
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setCompany('');
    setLocation('');
    setStartDate('');
    setEndDate('');
    setBulletText('');
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <div className="w-10 h-10 rounded-full border-4 border-slate-700 border-t-accent animate-spin mb-4" />
          <span className="font-mono text-xs tracking-wider uppercase">Loading Experiences...</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="text-left">
        <h1 className="text-3xl font-black text-white mb-2">Experience Manager</h1>
        <p className="text-slate-400 text-sm mb-8">Manage the job positions displayed on the public timeline.</p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form */}
          <div className="lg:col-span-5 p-6 rounded-xl border border-slate-800 bg-slate-900/30 backdrop-blur-sm">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Briefcase size={18} className="text-accent" />
              <span>{editingId ? 'Edit Work Entry' : 'Add Work Entry'}</span>
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-slate-400 mb-2 font-mono uppercase tracking-wider">Job Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Shopify Liquid Developer"
                  className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-accent"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-semibold text-slate-400 mb-2 font-mono uppercase tracking-wider">Company Name</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Ecodesoft Solutions"
                  className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-accent"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-slate-400 mb-2 font-mono uppercase tracking-wider">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Ahmedabad, India"
                    className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-accent"
                    required
                  />
                </div>
                
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-slate-400 mb-2 font-mono uppercase tracking-wider">Dates (Start - End)</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      placeholder="Sep 2025"
                      className="w-1/2 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-accent"
                      required
                    />
                    <span className="text-slate-600 text-xs font-bold font-mono">-</span>
                    <input
                      type="text"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      placeholder="Present"
                      className="w-1/2 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-slate-400 font-mono uppercase tracking-wider">Accomplishments (Bullets)</label>
                  <span className="text-[10px] text-slate-500 font-mono">One bullet per line</span>
                </div>
                <textarea
                  value={bulletText}
                  onChange={(e) => setBulletText(e.target.value)}
                  rows={6}
                  placeholder="Designed an in-house HRMS to automate attendance...&#10;Integrated CRM payment gateways using Shopify CLI..."
                  className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-accent leading-relaxed"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-accent text-white font-semibold text-sm rounded-lg hover:bg-accent/80 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save size={16} />
                  <span>{editingId ? 'Update Entry' : 'Create Entry'}</span>
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-slate-800 hover:bg-slate-800 text-slate-400 text-sm font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* List */}
          <div className="lg:col-span-7 p-6 rounded-xl border border-slate-800 bg-slate-900/30 backdrop-blur-sm space-y-4">
            <h2 className="text-lg font-bold text-white mb-4">Timeline Entries</h2>

            {experiences.length === 0 ? (
              <p className="text-slate-500 text-sm py-4">No jobs registered.</p>
            ) : (
              <div className="space-y-4">
                {experiences.map((exp, idx) => (
                  <div
                    key={exp.id}
                    className="p-4 rounded-lg bg-slate-950 border border-slate-850 flex justify-between items-start gap-4"
                  >
                    <div className="text-left">
                      <h3 className="font-bold text-slate-200 text-base">{exp.title}</h3>
                      <h4 className="text-slate-400 text-xs font-semibold mt-1">
                        {exp.company} • {exp.location}
                      </h4>
                      <span className="inline-block mt-2 text-[10px] font-mono font-bold text-accent px-2 py-0.5 rounded bg-accent/5 border border-accent/15">
                        {exp.start_date} – {exp.end_date}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Sort Shifters */}
                      <button
                        onClick={() => handleMove(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1.5 rounded text-slate-500 hover:text-white disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        onClick={() => handleMove(idx, 'down')}
                        disabled={idx === experiences.length - 1}
                        className="p-1.5 rounded text-slate-500 hover:text-white disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowDown size={14} />
                      </button>

                      <div className="w-px h-4 bg-slate-850 mx-1"></div>

                      <button
                        onClick={() => handleEdit(exp)}
                        className="p-1.5 rounded text-slate-500 hover:text-accent cursor-pointer"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(exp.id)}
                        className="p-1.5 rounded text-slate-500 hover:text-rose-500 cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
export default ExperienceManager;
