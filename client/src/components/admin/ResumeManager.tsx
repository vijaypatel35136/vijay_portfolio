import { useState, useEffect } from 'react'
import { Save, FileText, ExternalLink, Upload } from 'lucide-react'
import { motion } from 'framer-motion'
import { profileStorage } from '../../lib/storage'

interface ResumeManagerProps {
  onUpdate: () => void
}

export default function ResumeManager({ onUpdate }: ResumeManagerProps) {
  const [resumeUrl, setResumeUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const profile = profileStorage.get()
    setResumeUrl(profile.resume_url || '')
  }, [])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      profileStorage.update({ resume_url: resumeUrl })
      setMessage('Resume URL updated successfully!')
      onUpdate()
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('Error updating resume URL')
    } finally {
      setSaving(false)
    }
  }

  const handleTestLink = () => {
    if (resumeUrl) {
      window.open(resumeUrl, '_blank')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 p-8"
    >
      <h2 className="font-heading text-2xl font-bold text-navy-800 mb-6">Resume Settings</h2>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-navy-800 mb-2">
            Resume URL
          </label>
          <p className="text-sm text-gray-500 mb-3">
            Enter the URL to your resume file (PDF, DOC, etc.). This can be a link to Google Drive, Dropbox, or any hosted file.
          </p>
          <div className="flex gap-2">
            <input
              type="url"
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
              placeholder="https://drive.google.com/file/d/your-resume-id/view"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
            />
            {resumeUrl && (
              <button
                type="button"
                onClick={handleTestLink}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <ExternalLink size={16} />
                Test
              </button>
            )}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <FileText className="text-blue-600 mt-0.5" size={20} />
            <div className="flex-1">
              <h3 className="font-semibold text-blue-800 mb-1">How to host your resume</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Upload to Google Drive and share as "Anyone with the link"</li>
                <li>• Upload to Dropbox and create a shareable link</li>
                <li>• Host on GitHub Pages or any static file hosting</li>
                <li>• Ensure the link is publicly accessible</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
