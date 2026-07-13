import { useEffect, useState } from 'react';
import { 
  Lock, 
  LayoutDashboard, 
  User, 
  Award, 
  Briefcase, 
  FolderGit, 
  GraduationCap, 
  Mail, 
  Settings, 
  LogOut, 
  Plus, 
  Trash2, 
  Check, 
  Edit, 
  FileText,
  Upload,
  Globe
} from 'lucide-react';
import { apiService } from '../services/api';

// Types
interface DashboardSummary {
  total_projects: number;
  total_messages: number;
  unread_messages: number;
  total_experience: number;
  site_views: number;
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  
  // Navigation
  const [activeTab, setActiveTab] = useState<'dashboard' | 'profile' | 'skills' | 'experience' | 'projects' | 'education' | 'messages' | 'settings'>('dashboard');
  
  // Notification Toast state
  const [toasts, setToasts] = useState<{ id: string; message: string }[]>([]);

  // State lists
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);

  // Form states (new / edits)
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [profileForm, setProfileForm] = useState<any>({ name: '', bio: '', typewriter_roles: [], phone: '', email: '', github: '', linkedin: '', address: '' });
  const [roleInput, setRoleInput] = useState('');
  const [skillCatForm, setSkillCatForm] = useState({ name: '', sort_order: 0 });
  const [newSkillForm, setNewSkillForm] = useState({ name: '', category_id: 0, sort_order: 0 });
  const [expForm, setExpForm] = useState<{ title: string; company: string; location: string; start_date: string; end_date: string; points: string[]; sort_order: number }>({ title: '', company: '', location: '', start_date: '', end_date: '', points: [], sort_order: 0 });
  const [expPointInput, setExpPointInput] = useState('');
  const [projectForm, setProjectForm] = useState<{ title: string; url: string; description: string; tags: string[]; is_featured: boolean; sort_order: number }>({ title: '', url: '', description: '', tags: [], is_featured: false, sort_order: 0 });
  const [projectTagInput, setProjectTagInput] = useState('');
  const [eduForm, setEduForm] = useState({ institution: '', degree: '', location: '', date_range: '' });
  const [settingsForm, setSettingsForm] = useState({ dark_mode_default: true, seo_title: '', seo_description: '', ga_key: '' });

  // File Upload states
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [selectedResume, setSelectedResume] = useState<File | null>(null);
  const [selectedProjectThumbs, setSelectedProjectThumbs] = useState<Record<number, File>>({});

  // Toast trigger helper
  const addToast = (message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // Auth Hook
  useEffect(() => {
    if (apiService.isAuthenticated()) {
      setIsAuthenticated(true);
      loadAllData();
    }

    const handleAuthExpired = () => {
      setIsAuthenticated(false);
      addToast('Session expired. Please log in again.');
    };

    window.addEventListener('auth-expired', handleAuthExpired);
    return () => window.removeEventListener('auth-expired', handleAuthExpired);
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      
      const res = await apiService.post<any>('/api/auth/login', formData);
      apiService.setToken(res.access_token);
      setIsAuthenticated(true);
      addToast('Logged in successfully!');
    } catch (err: any) {
      setAuthError(err.message || 'Login failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    apiService.clearToken();
    setIsAuthenticated(false);
    addToast('Logged out successfully');
  };

  // Loader API calls
  const loadAllData = async () => {
    try {
      const summaryData = await apiService.get<DashboardSummary>('/api/dashboard-summary');
      setSummary(summaryData);
      
      const profileData = await apiService.get<any>('/api/profile');
      setProfile(profileData);
      setProfileForm({
        name: profileData.name || '',
        bio: profileData.bio || '',
        typewriter_roles: profileData.typewriter_roles || [],
        phone: profileData.phone || '',
        email: profileData.email || '',
        github: profileData.github || '',
        linkedin: profileData.linkedin || '',
        address: profileData.address || ''
      });

      const skillsData = await apiService.get<any[]>('/api/skills');
      setSkills(skillsData);
      if (skillsData.length > 0 && newSkillForm.category_id === 0) {
        setNewSkillForm(prev => ({ ...prev, category_id: skillsData[0].id }));
      }

      const expData = await apiService.get<any[]>('/api/experience');
      setExperiences(expData);

      const projectsData = await apiService.get<any[]>('/api/projects');
      setProjects(projectsData);

      const eduData = await apiService.get<any[]>('/api/education');
      setEducation(eduData);

      const messagesData = await apiService.get<any[]>('/api/messages');
      setMessages(messagesData);
      const settingsData = await apiService.get<any>('/api/settings');
      setSettingsForm({
        dark_mode_default: settingsData.dark_mode_default ?? true,
        seo_title: settingsData.seo_title || '',
        seo_description: settingsData.seo_description || '',
        ga_key: settingsData.ga_key || ''
      });
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    }
  };

  // --- CRUD FUNCTIONS ---

  // PROFILE
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.put('/api/profile', profileForm);
      addToast('Profile updated!');
      loadAllData();
    } catch (err: any) {
      addToast(err.message || 'Error updating profile');
    }
  };

  const handleUploadPhoto = async () => {
    if (!selectedPhoto) return;
    try {
      const fd = new FormData();
      fd.append('file', selectedPhoto);
      await apiService.post('/api/profile/upload-photo', fd);
      addToast('Profile photo updated!');
      setSelectedPhoto(null);
      loadAllData();
    } catch (err: any) {
      addToast(err.message || 'Photo upload failed');
    }
  };

  const handleUploadResume = async () => {
    if (!selectedResume) return;
    try {
      const fd = new FormData();
      fd.append('file', selectedResume);
      await apiService.post('/api/profile/upload-resume', fd);
      addToast('Resume updated!');
      setSelectedResume(null);
      loadAllData();
    } catch (err: any) {
      addToast(err.message || 'Resume upload failed');
    }
  };

  // SKILLS
  const handleCreateSkillCat = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.post('/api/skills/categories', skillCatForm);
      addToast('Skill category created!');
      setSkillCatForm({ name: '', sort_order: 0 });
      loadAllData();
    } catch (err: any) {
      addToast(err.message || 'Error creating category');
    }
  };

  const handleDeleteSkillCat = async (id: number) => {
    if (!window.confirm('Delete category and all its skills?')) return;
    try {
      await apiService.delete(`/api/skills/categories/${id}`);
      addToast('Category deleted');
      loadAllData();
    } catch (err: any) {
      addToast(err.message);
    }
  };

  const handleCreateSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.post('/api/skills', newSkillForm);
      addToast('Skill tag added!');
      setNewSkillForm(prev => ({ ...prev, name: '' }));
      loadAllData();
    } catch (err: any) {
      addToast(err.message);
    }
  };

  const handleDeleteSkill = async (id: number) => {
    try {
      await apiService.delete(`/api/skills/${id}`);
      addToast('Skill tag deleted');
      loadAllData();
    } catch (err: any) {
      addToast(err.message);
    }
  };

  // EXPERIENCE
  const handleSaveExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItemId) {
        await apiService.put(`/api/experience/${editingItemId}`, expForm);
        addToast('Experience updated!');
      } else {
        await apiService.post('/api/experience', expForm);
        addToast('Experience entry created!');
      }
      setEditingItemId(null);
      setExpForm({ title: '', company: '', location: '', start_date: '', end_date: '', points: [], sort_order: 0 });
      loadAllData();
    } catch (err: any) {
      addToast(err.message);
    }
  };

  const handleDeleteExperience = async (id: number) => {
    if (!window.confirm('Delete this experience entry?')) return;
    try {
      await apiService.delete(`/api/experience/${id}`);
      addToast('Experience entry deleted');
      loadAllData();
    } catch (err: any) {
      addToast(err.message);
    }
  };

  // PROJECTS
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let savedProject: any;
      if (editingItemId) {
        savedProject = await apiService.put(`/api/projects/${editingItemId}`, projectForm);
        addToast('Project updated!');
      } else {
        savedProject = await apiService.post('/api/projects', projectForm);
        addToast('Project created!');
      }

      // Handle thumbnail upload if selected
      const fileToUpload = selectedProjectThumbs[editingItemId || savedProject.id];
      if (fileToUpload) {
        const fd = new FormData();
        fd.append('file', fileToUpload);
        await apiService.post(`/api/projects/${editingItemId || savedProject.id}/upload-thumbnail`, fd);
        addToast('Thumbnail uploaded!');
        // Clear file state
        setSelectedProjectThumbs(prev => {
          const next = { ...prev };
          delete next[editingItemId || savedProject.id];
          return next;
        });
      }

      setEditingItemId(null);
      setProjectForm({ title: '', url: '', description: '', tags: [], is_featured: false, sort_order: 0 });
      loadAllData();
    } catch (err: any) {
      addToast(err.message);
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await apiService.delete(`/api/projects/${id}`);
      addToast('Project deleted');
      loadAllData();
    } catch (err: any) {
      addToast(err.message);
    }
  };

  // EDUCATION
  const handleSaveEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItemId) {
        await apiService.put(`/api/education/${editingItemId}`, eduForm);
        addToast('Education updated!');
      } else {
        await apiService.post('/api/education', eduForm);
        addToast('Education entry created!');
      }
      setEditingItemId(null);
      setEduForm({ institution: '', degree: '', location: '', date_range: '' });
      loadAllData();
    } catch (err: any) {
      addToast(err.message);
    }
  };

  const handleDeleteEducation = async (id: number) => {
    if (!window.confirm('Delete this education entry?')) return;
    try {
      await apiService.delete(`/api/education/${id}`);
      addToast('Education entry deleted');
      loadAllData();
    } catch (err: any) {
      addToast(err.message);
    }
  };

  // MESSAGES
  const handleMarkMessageRead = async (id: number) => {
    try {
      await apiService.put(`/api/messages/${id}/read`, {});
      addToast('Message marked as read');
      loadAllData();
    } catch (err: any) {
      addToast(err.message);
    }
  };

  const handleDeleteMessage = async (id: number) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await apiService.delete(`/api/messages/${id}`);
      addToast('Message deleted');
      loadAllData();
    } catch (err: any) {
      addToast(err.message);
    }
  };

  // SETTINGS
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.put('/api/settings', settingsForm);
      addToast('Site settings updated!');
      loadAllData();
    } catch (err: any) {
      addToast(err.message);
    }
  };

  // AUTH VIEW (LOGIN SCREEN)
  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)', padding: '1rem' }}>
        <div className="glass" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div className="contact-icon-wrapper" style={{ width: '60px', height: '60px', margin: '0 auto 1rem' }}>
              <Lock size={28} />
            </div>
            <h2 style={{ fontSize: '1.8rem' }}>Admin Portal</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Sign in to manage portfolio content</p>
          </div>

          {authError && (
            <div style={{ background: 'rgba(255, 107, 107, 0.1)', border: '1px solid #ff6b6b', borderRadius: '8px', padding: '0.75rem', marginBottom: '1.5rem', color: '#ff6b6b', fontSize: '0.9rem', textAlign: 'center' }}>
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input 
                type="text" 
                id="username" 
                className="form-control" 
                required 
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                className="form-control" 
                required 
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" disabled={authLoading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
              {authLoading ? 'Signing In...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // PORTAL MAIN LAYOUT
  return (
    <div className="admin-layout">
      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className="toast">
            <Check size={16} />
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* SIDEBAR NAVIGATION */}
      <div className="admin-sidebar">
        <div className="admin-sidebar-header">
          <Globe size={24} color="var(--accent)" />
          <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.5px' }}>CMS PANEL</span>
        </div>

        <div className="admin-nav">
          <div className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </div>
          <div className={`admin-nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
            <User size={18} />
            <span>Profile & Hero</span>
          </div>
          <div className={`admin-nav-item ${activeTab === 'skills' ? 'active' : ''}`} onClick={() => setActiveTab('skills')}>
            <Award size={18} />
            <span>Skills Manager</span>
          </div>
          <div className={`admin-nav-item ${activeTab === 'experience' ? 'active' : ''}`} onClick={() => setActiveTab('experience')}>
            <Briefcase size={18} />
            <span>Experience</span>
          </div>
          <div className={`admin-nav-item ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>
            <FolderGit size={18} />
            <span>Projects Grid</span>
          </div>
          <div className={`admin-nav-item ${activeTab === 'education' ? 'active' : ''}`} onClick={() => setActiveTab('education')}>
            <GraduationCap size={18} />
            <span>Education</span>
          </div>
          <div className={`admin-nav-item ${activeTab === 'messages' ? 'active' : ''}`} onClick={() => setActiveTab('messages')}>
            <Mail size={18} />
            <span>Messages {summary && summary.unread_messages > 0 && <span style={{ background: '#ff6b6b', color: '#ffffff', borderRadius: '50%', padding: '0.1rem 0.4rem', fontSize: '0.75rem', marginLeft: 'auto' }}>{summary.unread_messages}</span>}</span>
          </div>
          <div className={`admin-nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            <Settings size={18} />
            <span>Site Settings</span>
          </div>
        </div>

        <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button onClick={handleLogout} className="admin-nav-item" style={{ width: '100%', border: 'none', background: 'none', color: '#ff6b6b' }}>
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* DASHBOARD CONTENT BODY */}
      <div className="admin-main">
        {/* HEADER */}
        <div className="admin-header">
          <div>
            <h1 style={{ fontSize: '1.8rem', textTransform: 'capitalize' }}>{activeTab} Management</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Maintain and update your portfolio live content</p>
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Logged in as <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{username || 'Admin'}</span>
          </div>
        </div>

        {/* TAB VIEWS */}

        {/* 1. DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="admin-card-grid">
              <div className="glass admin-summary-card">
                <div className="icon-box"><FolderGit size={24} /></div>
                <div>
                  <h4>Total Projects</h4>
                  <p>{summary?.total_projects ?? 0}</p>
                </div>
              </div>
              <div className="glass admin-summary-card">
                <div className="icon-box" style={{ background: summary && summary.unread_messages > 0 ? 'rgba(255,107,107,0.1)' : 'rgba(14,124,123,0.1)', color: summary && summary.unread_messages > 0 ? '#ff6b6b' : 'var(--accent)' }}><Mail size={24} /></div>
                <div>
                  <h4>Unread Inbox</h4>
                  <p style={{ color: summary && summary.unread_messages > 0 ? '#ff6b6b' : 'inherit' }}>{summary?.unread_messages ?? 0}</p>
                </div>
              </div>
              <div className="glass admin-summary-card">
                <div className="icon-box"><Briefcase size={24} /></div>
                <div>
                  <h4>Jobs Timeline</h4>
                  <p>{summary?.total_experience ?? 0}</p>
                </div>
              </div>
              <div className="glass admin-summary-card">
                <div className="icon-box"><Globe size={24} /></div>
                <div>
                  <h4>Views (Mock)</h4>
                  <p>{summary?.site_views ?? 0}</p>
                </div>
              </div>
            </div>

            {/* Recent Messages list */}
            <div className="glass" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>Recent Messages</h3>
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Sender</th>
                      <th>Email</th>
                      <th>Message Snippet</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.slice(0, 5).map(m => (
                      <tr key={m.id}>
                        <td style={{ fontWeight: 600 }}>{m.name}</td>
                        <td>{m.email}</td>
                        <td style={{ color: 'var(--text-secondary)' }}>{m.message.slice(0, 60)}...</td>
                        <td>
                          <span className={`badge ${m.is_read ? 'badge-read' : 'badge-unread'}`}>
                            {m.is_read ? 'Read' : 'Unread'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {!m.is_read && (
                              <button onClick={() => handleMarkMessageRead(m.id)} className="glass" style={{ padding: '0.4rem', borderRadius: '4px', cursor: 'pointer' }}>
                                <Check size={14} color="var(--accent)" />
                              </button>
                            )}
                            <button onClick={() => handleDeleteMessage(m.id)} className="glass" style={{ padding: '0.4rem', borderRadius: '4px', cursor: 'pointer' }}>
                              <Trash2 size={14} color="#ff6b6b" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {messages.length === 0 && (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No messages received yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 2. PROFILE EDIT */}
        {activeTab === 'profile' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem' }}>
            <div className="glass" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>Update Hero & Profile Info</h3>
              <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" className="form-control" value={profileForm.name} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} required />
                </div>
                
                <div className="form-group">
                  <label>Bio Summary</label>
                  <textarea rows={5} className="form-control" value={profileForm.bio} onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })} required></textarea>
                </div>

                <div className="form-group">
                  <label>Typewriter Taglines (Roles)</label>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input type="text" className="form-control" placeholder="Add Role..." value={roleInput} onChange={e => setRoleInput(e.target.value)} />
                    <button type="button" className="btn btn-secondary" onClick={() => {
                      if (!roleInput.trim()) return;
                      setProfileForm({ ...profileForm, typewriter_roles: [...profileForm.typewriter_roles, roleInput.trim()] });
                      setRoleInput('');
                    }}>Add</button>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {profileForm.typewriter_roles.map((role: string, idx: number) => (
                      <span key={idx} className="tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        {role}
                        <Trash2 size={12} style={{ cursor: 'pointer' }} onClick={() => {
                          setProfileForm({ ...profileForm, typewriter_roles: profileForm.typewriter_roles.filter((_: any, i: any) => i !== idx) });
                        }} />
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Phone</label>
                    <input type="text" className="form-control" value={profileForm.phone} onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" className="form-control" value={profileForm.email} onChange={e => setProfileForm({ ...profileForm, email: e.target.value })} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>GitHub</label>
                    <input type="text" className="form-control" value={profileForm.github} onChange={e => setProfileForm({ ...profileForm, github: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>LinkedIn</label>
                    <input type="text" className="form-control" value={profileForm.linkedin} onChange={e => setProfileForm({ ...profileForm, linkedin: e.target.value })} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Location/Address</label>
                  <input type="text" className="form-control" value={profileForm.address} onChange={e => setProfileForm({ ...profileForm, address: e.target.value })} />
                </div>

                <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Save Profile Details</button>
              </form>
            </div>

            {/* Asset Upload widgets */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div className="glass" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem' }}>Upload Profile Photo</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                  {profile?.profile_photo_path && (
                    <img src={`http://localhost:8000${profile.profile_photo_path}`} alt="Avatar" style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--accent)' }} />
                  )}
                  <input type="file" accept="image/*" onChange={e => setSelectedPhoto(e.target.files?.[0] || null)} />
                  <button onClick={handleUploadPhoto} disabled={!selectedPhoto} className="btn btn-secondary" style={{ gap: '0.4rem', width: '100%', justifyContent: 'center' }}>
                    <Upload size={16} /> Upload Photo
                  </button>
                </div>
              </div>

              <div className="glass" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem' }}>Upload Resume PDF</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {profile?.resume_path && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)' }}>
                      <FileText size={18} /> <span>Resume PDF Uploaded</span>
                    </div>
                  )}
                  <input type="file" accept=".pdf" onChange={e => setSelectedResume(e.target.files?.[0] || null)} />
                  <button onClick={handleUploadResume} disabled={!selectedResume} className="btn btn-secondary" style={{ gap: '0.4rem', width: '100%', justifyContent: 'center' }}>
                    <Upload size={16} /> Upload PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. SKILLS MANAGER */}
        {activeTab === 'skills' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* Categories list and Add Category */}
            <div className="glass" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>Skill Categories</h3>
              <form onSubmit={handleCreateSkillCat} style={{ display: 'flex', gap: '0.5rem', marginBottom: '2.5rem' }}>
                <input type="text" className="form-control" placeholder="Category Name (e.g. Shopify)..." value={skillCatForm.name} onChange={e => setSkillCatForm({ ...skillCatForm, name: e.target.value })} required />
                <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem 1.2rem' }}><Plus size={18} /></button>
              </form>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {skills.map(cat => (
                  <div key={cat.id} className="glass" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
                    <div>
                      <h4 style={{ fontWeight: 600 }}>{cat.name}</h4>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{cat.skills.length} skills tags</span>
                    </div>
                    <button onClick={() => handleDeleteSkillCat(cat.id)} className="glass" style={{ padding: '0.5rem', borderRadius: '4px', cursor: 'pointer' }}>
                      <Trash2 size={16} color="#ff6b6b" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills tags list & Add Skill Tag */}
            <div className="glass" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>Skills Tags</h3>
              {skills.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>Create a skill category first.</p>
              ) : (
                <form onSubmit={handleCreateSkill} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
                  <div className="form-group">
                    <label>Skill Name</label>
                    <input type="text" className="form-control" placeholder="e.g. Liquid templating..." value={newSkillForm.name} onChange={e => setNewSkillForm({ ...newSkillForm, name: e.target.value })} required />
                  </div>
                  
                  <div className="form-group">
                    <label>Category</label>
                    <select className="form-control" style={{ background: 'var(--bg-color)' }} value={newSkillForm.category_id} onChange={e => setNewSkillForm({ ...newSkillForm, category_id: parseInt(e.target.value) })}>
                      {skills.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  
                  <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Add Skill Tag</button>
                </form>
              )}

              {/* Tag pill displayer grouped by category */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {skills.map(cat => (
                  <div key={cat.id}>
                    <h4 style={{ fontSize: '0.9rem', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{cat.name}</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {cat.skills.map((s: any) => (
                        <span key={s.id} className="tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                          {s.name}
                          <Trash2 size={12} style={{ cursor: 'pointer' }} onClick={() => handleDeleteSkill(s.id)} />
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. EXPERIENCE MANAGER */}
        {activeTab === 'experience' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '2rem' }}>
            {/* Experience form */}
            <div className="glass" style={{ padding: '2rem', height: 'fit-content' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>{editingItemId ? 'Edit Experience' : 'Add Experience'}</h3>
              <form onSubmit={handleSaveExperience} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div className="form-group">
                  <label>Role/Title</label>
                  <input type="text" className="form-control" value={expForm.title} onChange={e => setExpForm({ ...expForm, title: e.target.value })} required />
                </div>
                
                <div className="form-group">
                  <label>Company</label>
                  <input type="text" className="form-control" value={expForm.company} onChange={e => setExpForm({ ...expForm, company: e.target.value })} required />
                </div>

                <div className="form-group">
                  <label>Location</label>
                  <input type="text" className="form-control" value={expForm.location} onChange={e => setExpForm({ ...expForm, location: e.target.value })} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Start Date</label>
                    <input type="text" className="form-control" placeholder="e.g. Sep 2025" value={expForm.start_date} onChange={e => setExpForm({ ...expForm, start_date: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>End Date</label>
                    <input type="text" className="form-control" placeholder="e.g. Present" value={expForm.end_date} onChange={e => setExpForm({ ...expForm, end_date: e.target.value })} />
                  </div>
                </div>

                {/* Points bullet-points */}
                <div className="form-group">
                  <label>Responsibility Points</label>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input type="text" className="form-control" placeholder="Add bullet point..." value={expPointInput} onChange={e => setExpPointInput(e.target.value)} />
                    <button type="button" className="btn btn-secondary" onClick={() => {
                      if (!expPointInput.trim()) return;
                      setExpForm({ ...expForm, points: [...expForm.points, expPointInput.trim()] });
                      setExpPointInput('');
                    }}>Add</button>
                  </div>
                  <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {(expForm.points || []).map((pt: string, idx: number) => (
                      <li key={idx} style={{ marginBottom: '0.4rem', position: 'relative' }}>
                        <span style={{ marginRight: '0.5rem' }}>{pt}</span>
                        <Trash2 size={12} style={{ cursor: 'pointer', color: '#ff6b6b', verticalAlign: 'middle' }} onClick={() => {
                          setExpForm({ ...expForm, points: expForm.points.filter((_: any, i: any) => i !== idx) });
                        }} />
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button type="submit" className="btn btn-primary">{editingItemId ? 'Update' : 'Create'}</button>
                  {editingItemId && (
                    <button type="button" className="btn btn-secondary" onClick={() => {
                      setEditingItemId(null);
                      setExpForm({ title: '', company: '', location: '', start_date: '', end_date: '', points: [], sort_order: 0 });
                    }}>Cancel</button>
                  )}
                </div>
              </form>
            </div>

            {/* Experience list */}
            <div className="glass" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>Timeline Directory</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {experiences.map(exp => (
                  <div key={exp.id} className="glass" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: 'rgba(255,255,255,0.02)' }}>
                    <div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{exp.title}</h4>
                      <span style={{ color: 'var(--accent)', fontWeight: 500 }}>{exp.company}</span>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{exp.start_date} – {exp.end_date || 'Present'}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => {
                        setEditingItemId(exp.id);
                        setExpForm(exp);
                      }} className="glass" style={{ padding: '0.5rem', borderRadius: '4px', cursor: 'pointer' }}>
                        <Edit size={14} color="var(--accent)" />
                      </button>
                      <button onClick={() => handleDeleteExperience(exp.id)} className="glass" style={{ padding: '0.5rem', borderRadius: '4px', cursor: 'pointer' }}>
                        <Trash2 size={14} color="#ff6b6b" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. PROJECTS GRID */}
        {activeTab === 'projects' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '2rem' }}>
            {/* Project Form */}
            <div className="glass" style={{ padding: '2rem', height: 'fit-content' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>{editingItemId ? 'Edit Project' : 'Add Project'}</h3>
              <form onSubmit={handleSaveProject} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div className="form-group">
                  <label>Project Title</label>
                  <input type="text" className="form-control" value={projectForm.title} onChange={e => setProjectForm({ ...projectForm, title: e.target.value })} required />
                </div>

                <div className="form-group">
                  <label>Live URL</label>
                  <input type="text" className="form-control" value={projectForm.url} onChange={e => setProjectForm({ ...projectForm, url: e.target.value })} />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea rows={4} className="form-control" value={projectForm.description} onChange={e => setProjectForm({ ...projectForm, description: e.target.value })}></textarea>
                </div>

                {/* Tech Tags */}
                <div className="form-group">
                  <label>Tech Stack Tags</label>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input type="text" className="form-control" placeholder="Add Tag (e.g. Shopify)..." value={projectTagInput} onChange={e => setProjectTagInput(e.target.value)} />
                    <button type="button" className="btn btn-secondary" onClick={() => {
                      if (!projectTagInput.trim()) return;
                      setProjectForm({ ...projectForm, tags: [...projectForm.tags, projectTagInput.trim()] });
                      setProjectTagInput('');
                    }}>Add</button>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {(projectForm.tags || []).map((t: string, idx: number) => (
                      <span key={idx} className="tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        {t}
                        <Trash2 size={12} style={{ cursor: 'pointer' }} onClick={() => {
                          setProjectForm({ ...projectForm, tags: projectForm.tags.filter((_: any, i: any) => i !== idx) });
                        }} />
                      </span>
                    ))}
                  </div>
                </div>

                <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="checkbox" id="is_featured" checked={projectForm.is_featured} onChange={e => setProjectForm({ ...projectForm, is_featured: e.target.checked })} />
                  <label htmlFor="is_featured" style={{ cursor: 'pointer' }}>Featured Highlight Card</label>
                </div>

                {/* Thumbnail upload */}
                <div className="form-group">
                  <label>Project Thumbnail Image</label>
                  <input type="file" accept="image/*" onChange={e => {
                    const file = e.target.files?.[0] || null;
                    if (file) {
                      // Save file temporarily with a negative or unique index representing the new project
                      setSelectedProjectThumbs(prev => ({
                        ...prev,
                        [editingItemId || 999999]: file
                      }));
                    }
                  }} />
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button type="submit" className="btn btn-primary">{editingItemId ? 'Update' : 'Create'}</button>
                  {editingItemId && (
                    <button type="button" className="btn btn-secondary" onClick={() => {
                      setEditingItemId(null);
                      setProjectForm({ title: '', url: '', description: '', tags: [], is_featured: false, sort_order: 0 });
                    }}>Cancel</button>
                  )}
                </div>
              </form>
            </div>

            {/* Projects list directory */}
            <div className="glass" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>Projects Directory</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {projects.map(p => (
                  <div key={p.id} className="glass" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)' }}>
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ fontWeight: 600 }}>{p.title}</h4>
                        {p.is_featured && <span className="tag" style={{ background: 'var(--accent)', color: '#ffffff', fontSize: '0.7rem' }}>Featured</span>}
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.url || 'No Live Link'}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                      <button onClick={() => {
                        setEditingItemId(p.id);
                        setProjectForm(p);
                      }} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}><Edit size={14} /> Edit</button>
                      <button onClick={() => handleDeleteProject(p.id)} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderColor: '#ff6b6b', color: '#ff6b6b' }}><Trash2 size={14} /> Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 6. EDUCATION */}
        {activeTab === 'education' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '2rem' }}>
            <div className="glass" style={{ padding: '2rem', height: 'fit-content' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>{editingItemId ? 'Edit Degree' : 'Add Degree'}</h3>
              <form onSubmit={handleSaveEducation} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div className="form-group">
                  <label>Institution</label>
                  <input type="text" className="form-control" value={eduForm.institution} onChange={e => setEduForm({ ...eduForm, institution: e.target.value })} required />
                </div>
                
                <div className="form-group">
                  <label>Degree / Certificate</label>
                  <input type="text" className="form-control" value={eduForm.degree} onChange={e => setEduForm({ ...eduForm, degree: e.target.value })} required />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Location</label>
                    <input type="text" className="form-control" value={eduForm.location} onChange={e => setEduForm({ ...eduForm, location: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Date / Year Range</label>
                    <input type="text" className="form-control" placeholder="e.g. 2019 – 2023" value={eduForm.date_range} onChange={e => setEduForm({ ...eduForm, date_range: e.target.value })} />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>{editingItemId ? 'Update' : 'Create'}</button>
              </form>
            </div>

            <div className="glass" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>Education Entries</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {education.map(edu => (
                  <div key={edu.id} className="glass" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
                    <div>
                      <h4 style={{ fontWeight: 600 }}>{edu.degree}</h4>
                      <p style={{ color: 'var(--accent)', fontSize: '0.95rem' }}>{edu.institution}</p>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{edu.location} | {edu.date_range}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => {
                        setEditingItemId(edu.id);
                        setEduForm(edu);
                      }} className="glass" style={{ padding: '0.5rem', borderRadius: '4px', cursor: 'pointer' }}>
                        <Edit size={14} color="var(--accent)" />
                      </button>
                      <button onClick={() => handleDeleteEducation(edu.id)} className="glass" style={{ padding: '0.5rem', borderRadius: '4px', cursor: 'pointer' }}>
                        <Trash2 size={14} color="#ff6b6b" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 7. MESSAGES INBOX */}
        {activeTab === 'messages' && (
          <div className="glass" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>Full Message Inbox</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {messages.map(m => (
                <div key={m.id} className="glass" style={{ padding: '1.5rem', borderLeft: m.is_read ? '1px solid var(--card-border)' : '4px solid var(--accent)', background: m.is_read ? 'rgba(255,255,255,0.01)' : 'rgba(14,124,123,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{m.name}</h4>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{m.email}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(m.created_at).toLocaleString()}</span>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {!m.is_read && (
                          <button onClick={() => handleMarkMessageRead(m.id)} className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}><Check size={12} /> Mark Read</button>
                        )}
                        <button onClick={() => handleDeleteMessage(m.id)} className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', borderColor: '#ff6b6b', color: '#ff6b6b' }}><Trash2 size={12} /> Delete</button>
                      </div>
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-primary)', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{m.message}</p>
                </div>
              ))}
              {messages.length === 0 && (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>No messages found.</p>
              )}
            </div>
          </div>
        )}

        {/* 8. SITE SETTINGS */}
        {activeTab === 'settings' && (
          <div className="glass" style={{ padding: '2rem', maxWidth: '600px' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>Site Settings & SEO</h3>
            <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" id="dark_mode" checked={settingsForm.dark_mode_default} onChange={e => setSettingsForm({ ...settingsForm, dark_mode_default: e.target.checked })} />
                <label htmlFor="dark_mode" style={{ cursor: 'pointer' }}>Default Dark Mode</label>
              </div>

              <div className="form-group">
                <label>SEO Meta Title</label>
                <input type="text" className="form-control" value={settingsForm.seo_title} onChange={e => setSettingsForm({ ...settingsForm, seo_title: e.target.value })} required />
              </div>

              <div className="form-group">
                <label>SEO Meta Description</label>
                <textarea rows={4} className="form-control" value={settingsForm.seo_description} onChange={e => setSettingsForm({ ...settingsForm, seo_description: e.target.value })} required></textarea>
              </div>

              <div className="form-group">
                <label>Google Analytics Integration Key</label>
                <input type="text" className="form-control" value={settingsForm.ga_key} onChange={e => setSettingsForm({ ...settingsForm, ga_key: e.target.value })} />
              </div>

              <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Save Settings</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
