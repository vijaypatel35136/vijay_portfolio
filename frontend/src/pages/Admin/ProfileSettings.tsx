import React, { useEffect, useState } from 'react';
import { User, FileText, Camera, Save, RefreshCw } from 'lucide-react';
import api from '../../utils/api';
import AdminLayout from '../../components/AdminLayout';

interface Profile {
  name: string;
  taglines: string[];
  intro_text: string;
  about_text: string;
  location: string;
  experience_years: string;
  projects_delivered: number;
  education_summary: string;
  profile_photo_url?: string;
  resume_pdf_url?: string;
  email: string;
  phone: string;
  linkedin_url: string;
  github_url: string;
}

export const ProfileSettings: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [taglineInput, setTaglineInput] = useState('');

  const fetchProfile = async () => {
    try {
      const data = await api.get('/profile');
      setProfile(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleAddTagline = () => {
    if (!taglineInput.trim()) return;
    setProfile((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        taglines: [...prev.taglines, taglineInput.trim()],
      };
    });
    setTaglineInput('');
  };

  const handleRemoveTagline = (idx: number) => {
    setProfile((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        taglines: prev.taglines.filter((_, i) => i !== idx),
      };
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'profile_photo_url' | 'resume_pdf_url') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const response = await api.upload(file);
      setProfile((prev) => (prev ? { ...prev, [field]: response.url } : null));
      alert(`${field === 'profile_photo_url' ? 'Photo' : 'Resume'} uploaded successfully!`);
    } catch (err: any) {
      alert(err.message || 'File upload failed.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    
    setSubmitting(true);
    try {
      await api.put('/profile', profile);
      alert('Profile updated successfully!');
      fetchProfile();
    } catch (err: any) {
      alert(err.message || 'Failed to update profile.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <div className="w-10 h-10 rounded-full border-4 border-slate-700 border-t-accent animate-spin mb-4" />
          <span className="font-mono text-xs tracking-wider uppercase">Loading Profile...</span>
        </div>
      </AdminLayout>
    );
  }

  if (!profile) return null;

  return (
    <AdminLayout>
      <div className="text-left">
        <h1 className="text-3xl font-black text-white mb-2">Profile Settings</h1>
        <p className="text-slate-400 text-sm mb-8 font-medium">Update Hero taglines, About text, Resume attachments, and Social link metadata.</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Main Card */}
          <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/30 backdrop-blur-sm space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-850">
              <User size={18} className="text-accent" />
              <span>Bio & Base Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-slate-400 mb-2 font-mono uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                  className="px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-accent"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-semibold text-slate-400 mb-2 font-mono uppercase tracking-wider">Location</label>
                <input
                  type="text"
                  name="location"
                  value={profile.location}
                  onChange={handleInputChange}
                  className="px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-accent"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-semibold text-slate-400 mb-2 font-mono uppercase tracking-wider">Years of Experience</label>
                <input
                  type="text"
                  name="experience_years"
                  value={profile.experience_years}
                  onChange={handleInputChange}
                  className="px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-accent"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-semibold text-slate-400 mb-2 font-mono uppercase tracking-wider">Projects Completed</label>
                <input
                  type="number"
                  name="projects_delivered"
                  value={profile.projects_delivered}
                  onChange={handleInputChange}
                  className="px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-accent"
                  required
                />
              </div>
            </div>

            {/* Typewriter Taglines (Roles list) */}
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-slate-400 mb-2 font-mono uppercase tracking-wider">Typewriter taglines (Roles)</label>
              
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={taglineInput}
                  onChange={(e) => setTaglineInput(e.target.value)}
                  placeholder="e.g. WordPress Developer"
                  className="flex-1 px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-accent"
                />
                <button
                  type="button"
                  onClick={handleAddTagline}
                  className="px-4 py-2 rounded-lg bg-accent text-white font-semibold text-sm hover:bg-accent/80 transition-colors"
                >
                  Add Role
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {profile.taglines.map((role, idx) => (
                  <span
                    key={idx}
                    className="flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300"
                  >
                    <span>{role}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTagline(idx)}
                      className="text-slate-500 hover:text-rose-400 font-bold"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-semibold text-slate-400 mb-2 font-mono uppercase tracking-wider">Short Hero Intro</label>
              <textarea
                name="intro_text"
                value={profile.intro_text}
                onChange={handleInputChange}
                rows={3}
                className="px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-accent resize-none"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-semibold text-slate-400 mb-2 font-mono uppercase tracking-wider">Full About Bio</label>
              <textarea
                name="about_text"
                value={profile.about_text}
                onChange={handleInputChange}
                rows={6}
                className="px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-accent"
                required
              />
            </div>
          </div>

          {/* Media & Attachments Card */}
          <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/30 backdrop-blur-sm space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-850">
              <FileText size={18} className="text-accent" />
              <span>Attachments & Media</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Profile Photo */}
              <div className="p-4 rounded-lg bg-slate-950 border border-slate-850 flex flex-col items-center gap-4 text-center">
                <Camera className="text-slate-600" size={28} />
                <div className="w-full">
                  <h4 className="text-sm font-semibold text-slate-200 mb-1">Profile Photo</h4>
                  <p className="text-xs text-slate-500 mb-3 truncate">
                    {profile.profile_photo_url || 'No photo uploaded'}
                  </p>
                  
                  <input
                    type="file"
                    accept="image/*"
                    id="photo-upload"
                    onChange={(e) => handleFileUpload(e, 'profile_photo_url')}
                    className="hidden"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="inline-flex px-4 py-1.5 border border-slate-800 hover:border-accent hover:text-accent rounded text-xs font-semibold text-slate-400 cursor-pointer transition-colors"
                  >
                    Upload Photo
                  </label>
                </div>
              </div>

              {/* Resume PDF */}
              <div className="p-4 rounded-lg bg-slate-950 border border-slate-850 flex flex-col items-center gap-4 text-center">
                <FileText className="text-slate-600" size={28} />
                <div className="w-full">
                  <h4 className="text-sm font-semibold text-slate-200 mb-1">Resume PDF</h4>
                  <p className="text-xs text-slate-500 mb-3 truncate">
                    {profile.resume_pdf_url || 'No resume uploaded'}
                  </p>

                  <input
                    type="file"
                    accept=".pdf"
                    id="resume-upload"
                    onChange={(e) => handleFileUpload(e, 'resume_pdf_url')}
                    className="hidden"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="inline-flex px-4 py-1.5 border border-slate-800 hover:border-accent hover:text-accent rounded text-xs font-semibold text-slate-400 cursor-pointer transition-colors"
                  >
                    Upload Resume
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links Card */}
          <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/30 backdrop-blur-sm space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-850">
              <User size={18} className="text-accent" />
              <span>Contact & Social URLs</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-slate-400 mb-2 font-mono uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleInputChange}
                  className="px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-accent"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-semibold text-slate-400 mb-2 font-mono uppercase tracking-wider">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleInputChange}
                  className="px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-accent"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-semibold text-slate-400 mb-2 font-mono uppercase tracking-wider">LinkedIn URL</label>
                <input
                  type="url"
                  name="linkedin_url"
                  value={profile.linkedin_url}
                  onChange={handleInputChange}
                  className="px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-accent"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-semibold text-slate-400 mb-2 font-mono uppercase tracking-wider">GitHub URL</label>
                <input
                  type="text"
                  name="github_url"
                  value={profile.github_url}
                  onChange={handleInputChange}
                  className="px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-accent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 rounded-lg bg-accent text-white font-semibold flex items-center gap-2 hover:bg-accent/80 transition-colors shadow-lg hover:shadow-accent/25 disabled:opacity-50 cursor-pointer"
            >
              {submitting ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
              <span>Save Profile Settings</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};
export default ProfileSettings;
