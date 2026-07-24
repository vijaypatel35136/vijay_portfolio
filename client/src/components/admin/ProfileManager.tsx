import { useState, useEffect } from 'react'
import { Save, Loader } from 'lucide-react'
import { motion } from 'framer-motion'
import { profileStorage } from '../../lib/storage'

interface ProfileForm {
  name: string
  tagline_roles: string[]
  summary: string
  email: string
  phone: string
  linkedin: string
  github: string
  location: string
  experience_years: number
  projects_count: number
  resume_url: string
}

interface ProfileManagerProps {
  onUpdate: () => void
}

export default function ProfileManager({ onUpdate }: ProfileManagerProps) {
  const [profile, setProfile] = useState<ProfileForm | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = () => {
    const data = profileStorage.get()
    setProfile({
      name: data.name,
      tagline_roles: data.tagline_roles || [],
      summary: data.summary || '',
      email: data.email,
      phone: data.phone,
      linkedin: data.linkedin,
      github: data.github,
      location: data.location,
      experience_years: data.experience_years || 0,
      projects_count: data.projects_count || 0,
      resume_url: data.resume_url || '',
    })
    setLoading(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    setSaving(true)
    setMessage('')

    try {
      profileStorage.update({
        name: profile.name,
        tagline_roles: profile.tagline_roles,
        summary: profile.summary,
        email: profile.email,
        phone: profile.phone,
        linkedin: profile.linkedin,
        github: profile.github,
        location: profile.location,
        experience_years: profile.experience_years,
        projects_count: profile.projects_count,
        resume_url: profile.resume_url,
      })
      setMessage('Profile updated successfully!')
      onUpdate()
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('Error updating profile')
    } finally {
      setSaving(false)
    }
  }

  const handleRoleChange = (index: number, value: string) => {
    if (!profile) return
    const newRoles = [...profile.tagline_roles]
    newRoles[index] = value
    setProfile({ ...profile, tagline_roles: newRoles })
  }

  const addRole = () => {
    if (!profile) return
    setProfile({ ...profile, tagline_roles: [...profile.tagline_roles, ''] })
  }

  const removeRole = (index: number) => {
    if (!profile) return
    const newRoles = profile.tagline_roles.filter((_, i) => i !== index)
    setProfile({ ...profile, tagline_roles: newRoles })
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-gray-500 mt-4">Loading profile...</p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <p className="text-red-500">Failed to load profile</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 p-8"
    >
      <h2 className="font-heading text-2xl font-bold text-navy-800 mb-6">Edit Profile</h2>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-navy-800 mb-2">Full Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-navy-800 mb-2">Location</label>
            <input
              type="text"
              value={profile.location}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
            />
          </div>
        </div>

        {/* Tagline Roles */}
        <div>
          <label className="block text-sm font-semibold text-navy-800 mb-2">Tagline Roles</label>
          <div className="space-y-2">
            {profile.tagline_roles.map((role, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={role}
                  onChange={(e) => handleRoleChange(index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
                  placeholder="e.g., Shopify Developer"
                />
                <button
                  type="button"
                  onClick={() => removeRole(index)}
                  className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addRole}
              className="px-4 py-2 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition-colors"
            >
              + Add Role
            </button>
          </div>
        </div>

        {/* Summary */}
        <div>
          <label className="block text-sm font-semibold text-navy-800 mb-2">Summary / Bio</label>
          <textarea
            value={profile.summary}
            onChange={(e) => setProfile({ ...profile, summary: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
          />
        </div>

        {/* Contact Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-navy-800 mb-2">Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-navy-800 mb-2">Phone</label>
            <input
              type="text"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-navy-800 mb-2">LinkedIn URL</label>
            <input
              type="url"
              value={profile.linkedin}
              onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-navy-800 mb-2">GitHub / Portfolio URL</label>
            <input
              type="url"
              value={profile.github}
              onChange={(e) => setProfile({ ...profile, github: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-navy-800 mb-2">Years of Experience</label>
            <input
              type="number"
              min={0}
              value={profile.experience_years}
              onChange={(e) => setProfile({ ...profile, experience_years: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-navy-800 mb-2">Projects Completed</label>
            <input
              type="number"
              min={0}
              value={profile.projects_count}
              onChange={(e) => setProfile({ ...profile, projects_count: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
            />
          </div>
        </div>
        
        {/* Resume URL */}
        <div>
          <label className="block text-sm font-semibold text-navy-800 mb-2">Resume Document URL / Link</label>
          <input
            type="url"
            value={profile.resume_url}
            onChange={(e) => setProfile({ ...profile, resume_url: e.target.value })}
            placeholder="https://drive.google.com/... or /resume.pdf"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader className="animate-spin" size={18} />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  )
}