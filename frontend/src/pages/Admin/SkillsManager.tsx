import React, { useEffect, useState } from 'react';
import { Code, Trash2, Edit2, ArrowUp, ArrowDown, Save, X } from 'lucide-react';
import api from '../../utils/api';
import AdminLayout from '../../components/AdminLayout';

interface Skill {
  id: number;
  category: string;
  name: string;
  sort_order: number;
}

export const SkillsManager: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Shopify & eCommerce');
  const [sortOrder, setSortOrder] = useState(0);

  const categories = [
    'Shopify & eCommerce',
    'Web Development',
    'Backend / Python',
    'Performance & SEO'
  ];

  const fetchSkills = async () => {
    try {
      const data = await api.get('/skills');
      setSkills(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      if (editingId) {
        await api.put(`/skills/${editingId}`, { name, category, sort_order: sortOrder });
      } else {
        await api.post('/skills', { name, category, sort_order: skills.length + 1 });
      }
      resetForm();
      fetchSkills();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (skill: Skill) => {
    setEditingId(skill.id);
    setName(skill.name);
    setCategory(skill.category);
    setSortOrder(skill.sort_order);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this skill?')) return;
    try {
      await api.delete(`/skills/${id}`);
      fetchSkills();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= skills.length) return;

    const currentSkill = skills[index];
    const targetSkill = skills[targetIdx];

    // Swap sort order keys
    const tempOrder = currentSkill.sort_order;
    currentSkill.sort_order = targetSkill.sort_order;
    targetSkill.sort_order = tempOrder;

    try {
      await Promise.all([
        api.put(`/skills/${currentSkill.id}`, currentSkill),
        api.put(`/skills/${targetSkill.id}`, targetSkill),
      ]);
      fetchSkills();
    } catch (err) {
      console.error('Failed to swap orders', err);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setCategory('Shopify & eCommerce');
    setSortOrder(0);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <div className="w-10 h-10 rounded-full border-4 border-slate-700 border-t-accent animate-spin mb-4" />
          <span className="font-mono text-xs tracking-wider uppercase">Loading Skills...</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="text-left">
        <h1 className="text-3xl font-black text-white mb-2">Skills Manager</h1>
        <p className="text-slate-400 text-sm mb-8">Add, edit, delete, and reorder skill tags grouped by category.</p>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Editor Form */}
          <div className="md:col-span-4 p-6 rounded-xl border border-slate-800 bg-slate-900/30 backdrop-blur-sm">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Code size={18} className="text-accent" />
              <span>{editingId ? 'Edit Skill' : 'Create Skill'}</span>
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-slate-400 mb-2 font-mono uppercase tracking-wider">Skill Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Liquid templating"
                  className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-accent"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-semibold text-slate-400 mb-2 font-mono uppercase tracking-wider">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-accent"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-accent text-white font-semibold text-sm rounded-lg hover:bg-accent/80 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save size={16} />
                  <span>{editingId ? 'Update' : 'Create'}</span>
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

          {/* List display */}
          <div className="md:col-span-8 p-6 rounded-xl border border-slate-800 bg-slate-900/30 backdrop-blur-sm">
            <h2 className="text-lg font-bold text-white mb-6">Skills Directory</h2>

            {skills.length === 0 ? (
              <p className="text-slate-500 text-sm py-4">No skills preloaded.</p>
            ) : (
              <div className="space-y-6">
                {categories.map((cat) => {
                  const catSkills = skills.filter((s) => s.category === cat);
                  if (catSkills.length === 0) return null;

                  return (
                    <div key={cat} className="space-y-2 text-left">
                      <h3 className="text-xs font-bold font-mono tracking-wider uppercase text-slate-500 pb-2 border-b border-slate-850">
                        {cat}
                      </h3>
                      
                      <div className="divide-y divide-slate-850">
                        {catSkills.map((skill, _relativeIdx) => {
                          const globalIdx = skills.findIndex((s) => s.id === skill.id);

                          return (
                            <div key={skill.id} className="flex justify-between items-center py-2 text-sm text-slate-300">
                              <span>{skill.name}</span>
                              
                              <div className="flex items-center gap-1.5">
                                {/* Reordering buttons */}
                                <button
                                  type="button"
                                  onClick={() => handleMove(globalIdx, 'up')}
                                  disabled={globalIdx === 0}
                                  className="p-1 rounded text-slate-500 hover:text-white disabled:opacity-30 cursor-pointer"
                                >
                                  <ArrowUp size={14} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleMove(globalIdx, 'down')}
                                  disabled={globalIdx === skills.length - 1}
                                  className="p-1 rounded text-slate-500 hover:text-white disabled:opacity-30 cursor-pointer"
                                >
                                  <ArrowDown size={14} />
                                </button>
                                
                                <div className="w-px h-3 bg-slate-850 mx-1"></div>

                                {/* Actions */}
                                <button
                                  type="button"
                                  onClick={() => handleEdit(skill)}
                                  className="p-1 rounded text-slate-500 hover:text-accent cursor-pointer"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDelete(skill.id)}
                                  className="p-1 rounded text-slate-500 hover:text-rose-500 cursor-pointer"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
export default SkillsManager;
