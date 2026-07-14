import React, { useEffect, useState } from 'react';
import { FolderGit, Save, Trash2, Edit2, X, Upload, CheckSquare, Square, FileJson } from 'lucide-react';
import api from '../../utils/api';
import AdminLayout from '../../components/AdminLayout';

interface Project {
  id: number;
  name: string;
  url?: string;
  description: string;
  tech_stack: string[];
  thumbnail_url?: string;
  is_featured: boolean;
  category: string;
  sort_order: number;
}

export const ProjectsManager: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [techStackText, setTechStackText] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [category, setCategory] = useState('shopify');

  // Bulk Import state
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkJson, setBulkJson] = useState('');

  const fetchProjects = async () => {
    try {
      const data = await api.get('/projects');
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const response = await api.upload(file);
      setThumbnailUrl(response.url);
      alert('Thumbnail uploaded successfully!');
    } catch (err: any) {
      alert(err.message || 'File upload failed.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const tech_stack = techStackText
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const payload = {
      name: name.trim(),
      url: url.trim() || undefined,
      description: description.trim(),
      tech_stack,
      thumbnail_url: thumbnailUrl.trim() || undefined,
      is_featured: isFeatured,
      category,
      sort_order: editingId ? projects.find((p) => p.id === editingId)?.sort_order || 0 : projects.length + 1,
    };

    try {
      if (editingId) {
        await api.put(`/projects/${editingId}`, payload);
      } else {
        await api.post('/projects', payload);
      }
      resetForm();
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (proj: Project) => {
    setEditingId(proj.id);
    setName(proj.name);
    setUrl(proj.url || '');
    setDescription(proj.description);
    setTechStackText(proj.tech_stack.join(', '));
    setThumbnailUrl(proj.thumbnail_url || '');
    setIsFeatured(proj.is_featured);
    setCategory(proj.category);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleBulkImport = async () => {
    try {
      const parsed = JSON.parse(bulkJson);
      const list = Array.isArray(parsed) ? parsed : parsed.projects;
      if (!Array.isArray(list)) {
        alert('Invalid JSON: Must be a JSON array of projects, or an object containing a "projects" array.');
        return;
      }

      await api.post('/projects/bulk-import', { projects: list });
      alert('Projects imported successfully!');
      setBulkJson('');
      setBulkOpen(false);
      fetchProjects();
    } catch (err: any) {
      alert(err.message || 'Bulk import failed. Please verify that JSON fits the schemas format.');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setUrl('');
    setDescription('');
    setTechStackText('');
    setThumbnailUrl('');
    setIsFeatured(false);
    setCategory('shopify');
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <div className="w-10 h-10 rounded-full border-4 border-slate-700 border-t-accent animate-spin mb-4" />
          <span className="font-mono text-xs tracking-wider uppercase">Loading Projects...</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="text-left">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-black text-white">Projects Manager</h1>
          <button
            onClick={() => setBulkOpen(!bulkOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-800 hover:border-accent hover:text-accent rounded text-xs font-semibold text-slate-400 cursor-pointer transition-colors"
          >
            <FileJson size={14} />
            <span>Bulk JSON Import</span>
          </button>
        </div>
        <p className="text-slate-400 text-sm mb-8">Manage highlighted showcase project and filterable grids.</p>

        {/* Bulk JSON Import Panel */}
        {bulkOpen && (
          <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/30 backdrop-blur-sm mb-8 space-y-4">
            <h2 className="text-base font-bold text-white">Bulk Projects Upload</h2>
            <p className="text-xs text-slate-400">Paste a raw JSON array matching Project schema parameters:</p>
            <pre className="p-3 bg-slate-950 text-[10px] text-slate-500 rounded font-mono overflow-x-auto leading-relaxed border border-slate-850">
{`[
  {
    "name": "Project Alpha",
    "url": "https://example.com",
    "description": "Short bio description",
    "tech_stack": ["React", "Shopify"],
    "category": "shopify",
    "is_featured": false
  }
]`}
            </pre>
            <textarea
              value={bulkJson}
              onChange={(e) => setBulkJson(e.target.value)}
              rows={6}
              placeholder="Paste JSON here..."
              className="w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-lg text-slate-200 font-mono text-xs focus:outline-none focus:border-accent"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setBulkOpen(false)}
                className="px-4 py-2 border border-slate-800 hover:bg-slate-800 text-slate-400 text-xs font-semibold rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkImport}
                className="px-4 py-2 bg-accent text-white font-semibold text-xs rounded hover:bg-accent/80 transition-colors"
              >
                Import Projects
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form */}
          <div className="lg:col-span-5 p-6 rounded-xl border border-slate-800 bg-slate-900/30 backdrop-blur-sm">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FolderGit size={18} className="text-accent" />
              <span>{editingId ? 'Edit Project' : 'Add Project'}</span>
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-slate-400 mb-2 font-mono uppercase tracking-wider">Project Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Trade Vehicle Parts"
                  className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-accent"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-semibold text-slate-400 mb-2 font-mono uppercase tracking-wider">Live URL (Optional)</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://tradevehicleparts.co.uk"
                  className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-slate-400 mb-2 font-mono uppercase tracking-wider">Category Filter</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-accent"
                  >
                    <option value="shopify">Shopify</option>
                    <option value="wordpress">WordPress</option>
                    <option value="python">Python</option>
                  </select>
                </div>
                
                {/* Featured project toggle */}
                <div className="flex flex-col justify-end">
                  <button
                    type="button"
                    onClick={() => setIsFeatured(!isFeatured)}
                    className="flex items-center gap-2.5 px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-left text-slate-300 hover:text-white transition-colors"
                  >
                    {isFeatured ? (
                      <CheckSquare size={16} className="text-accent" />
                    ) : (
                      <Square size={16} className="text-slate-600" />
                    )}
                    <span className="text-xs font-semibold uppercase tracking-wider font-mono">Featured</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-semibold text-slate-400 mb-2 font-mono uppercase tracking-wider">Tech Stack Tags</label>
                <input
                  type="text"
                  value={techStackText}
                  onChange={(e) => setTechStackText(e.target.value)}
                  placeholder="e.g. React, Contentful CMS, Tailwind CSS"
                  className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-accent"
                  required
                />
                <span className="text-[10px] text-slate-500 font-mono mt-1">Comma-separated lists</span>
              </div>

              {/* Thumbnail URL / Upload */}
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-slate-400 mb-2 font-mono uppercase tracking-wider">Thumbnail Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    placeholder="/uploads/myimage.jpg"
                    className="flex-1 px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-accent"
                  />
                  
                  <input
                    type="file"
                    accept="image/*"
                    id="thumb-upload"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="thumb-upload"
                    className="px-4 py-2 border border-slate-800 hover:border-accent hover:text-accent rounded-lg text-slate-400 cursor-pointer flex items-center justify-center transition-colors"
                    title="Upload thumbnail"
                  >
                    <Upload size={16} />
                  </label>
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-semibold text-slate-400 mb-2 font-mono uppercase tracking-wider">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Describe what you accomplished in this project..."
                  className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-accent leading-relaxed"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-accent text-white font-semibold text-sm rounded-lg hover:bg-accent/80 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save size={16} />
                  <span>{editingId ? 'Update Project' : 'Create Project'}</span>
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
            <h2 className="text-lg font-bold text-white mb-4">Project Directory</h2>

            {projects.length === 0 ? (
              <p className="text-slate-500 text-sm py-4">No projects registered.</p>
            ) : (
              <div className="space-y-4">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-4 rounded-lg bg-slate-950 border border-slate-850 flex justify-between items-start gap-4"
                  >
                    <div className="text-left flex gap-4 items-center min-w-0">
                      {proj.thumbnail_url && (
                        <img
                          src={proj.thumbnail_url}
                          alt=""
                          className="w-12 h-12 object-cover rounded bg-slate-900 border border-slate-800 flex-shrink-0"
                        />
                      )}
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-200 text-sm truncate flex items-center gap-2">
                          <span>{proj.name}</span>
                          {proj.is_featured && (
                            <span className="px-1.5 py-0.5 text-[8px] font-mono uppercase tracking-wider font-bold rounded bg-accent/15 border border-accent/25 text-accent">
                              Featured
                            </span>
                          )}
                        </h3>
                        <p className="text-slate-400 text-[10px] uppercase font-mono tracking-wider mt-1">
                          Filter: {proj.category}
                        </p>
                        <p className="text-slate-500 text-xs truncate max-w-sm mt-0.5">{proj.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(proj)}
                        className="p-1.5 rounded text-slate-500 hover:text-accent cursor-pointer"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(proj.id)}
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
export default ProjectsManager;
