import React, { useEffect, useState } from 'react';
import { GraduationCap, Save, Trash2, Edit2, X } from 'lucide-react';
import api from '../../utils/api';
import AdminLayout from '../../components/AdminLayout';

interface Education {
  id: number;
  institution: string;
  degree: string;
  location: string;
  date_range: string;
  sort_order: number;
}

export const EducationManager: React.FC = () => {
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [institution, setInstitution] = useState('');
  const [degree, setDegree] = useState('');
  const [location, setLocation] = useState('');
  const [dateRange, setDateRange] = useState('');

  const fetchEducations = async () => {
    try {
      const data = await api.get('/education');
      setEducations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducations();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!institution.trim() || !degree.trim()) return;

    const payload = {
      institution: institution.trim(),
      degree: degree.trim(),
      location: location.trim(),
      date_range: dateRange.trim(),
      sort_order: editingId ? educations.find((ed) => ed.id === editingId)?.sort_order || 0 : educations.length + 1,
    };

    try {
      if (editingId) {
        await api.put(`/education/${editingId}`, payload);
      } else {
        await api.post('/education', payload);
      }
      resetForm();
      fetchEducations();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (edu: Education) => {
    setEditingId(edu.id);
    setInstitution(edu.institution);
    setDegree(edu.degree);
    setLocation(edu.location);
    setDateRange(edu.date_range);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this education entry?')) return;
    try {
      await api.delete(`/education/${id}`);
      fetchEducations();
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setInstitution('');
    setDegree('');
    setLocation('');
    setDateRange('');
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <div className="w-10 h-10 rounded-full border-4 border-slate-700 border-t-accent animate-spin mb-4" />
          <span className="font-mono text-xs tracking-wider uppercase">Loading Education...</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="text-left">
        <h1 className="text-3xl font-black text-white mb-2">Education Manager</h1>
        <p className="text-slate-400 text-sm mb-8">Manage the academic degree accomplishments shown on the site.</p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form */}
          <div className="lg:col-span-5 p-6 rounded-xl border border-slate-800 bg-slate-900/30 backdrop-blur-sm">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <GraduationCap size={18} className="text-accent" />
              <span>{editingId ? 'Edit Entry' : 'Add Entry'}</span>
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-slate-400 mb-2 font-mono uppercase tracking-wider">Degree / Qualification</label>
                <input
                  type="text"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  placeholder="e.g. Bachelor of Engineering — Computer Engineering"
                  className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-accent"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-semibold text-slate-400 mb-2 font-mono uppercase tracking-wider">Institution Name</label>
                <input
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g. Om Engineering College"
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
                    placeholder="e.g. Junagadh, Gujarat"
                    className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-accent"
                    required
                  />
                </div>
                
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-slate-400 mb-2 font-mono uppercase tracking-wider">Date Range</label>
                  <input
                    type="text"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    placeholder="e.g. 2019 – 2023"
                    className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-accent"
                    required
                  />
                </div>
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
            <h2 className="text-lg font-bold text-white mb-4">Academic History</h2>

            {educations.length === 0 ? (
              <p className="text-slate-500 text-sm py-4">No entries registered.</p>
            ) : (
              <div className="space-y-4">
                {educations.map((edu) => (
                  <div
                    key={edu.id}
                    className="p-4 rounded-lg bg-slate-950 border border-slate-850 flex justify-between items-start gap-4"
                  >
                    <div className="text-left">
                      <h3 className="font-bold text-slate-200 text-sm">{edu.degree}</h3>
                      <p className="text-slate-400 text-xs mt-1">
                        {edu.institution} • {edu.location}
                      </p>
                      <span className="inline-block mt-2 text-[10px] font-mono font-bold text-accent px-2 py-0.5 rounded bg-accent/5 border border-accent/15">
                        {edu.date_range}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleEdit(edu)}
                        className="p-1.5 rounded text-slate-500 hover:text-accent cursor-pointer"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(edu.id)}
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
export default EducationManager;
