import { useState, useEffect } from 'react'
import { Save, FileText, ExternalLink, Upload, X, File } from 'lucide-react'
import { motion } from 'framer-motion'
import { profileStorage } from '../../lib/storage'

interface ResumeManagerProps {
  onUpdate: () => void
}

export default function ResumeManager({ onUpdate }: ResumeManagerProps) {
  const [resumeUrl, setResumeUrl] = useState('')
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [resumeFileData, setResumeFileData] = useState('')
  const [resumeFileName, setResumeFileName] = useState('')
  const [resumeFileType, setResumeFileType] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url')

  useEffect(() => {
    const profile = profileStorage.get()
    setResumeUrl(profile.resume_url || '')
    setResumeFileData(profile.resume_file_data || '')
    setResumeFileName(profile.resume_file_name || '')
    setResumeFileType(profile.resume_file_type || '')
    if (profile.resume_file_data) {
      setUploadMethod('file')
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setResumeFile(file)
      setResumeFileName(file.name)
      setResumeFileType(file.type)
      
      const reader = new FileReader()
      reader.onload = (event) => {
        setResumeFileData(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleClearFile = () => {
    setResumeFile(null)
    setResumeFileData('')
    setResumeFileName('')
    setResumeFileType('')
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      if (uploadMethod === 'file') {
        profileStorage.update({
          resume_url: '',
          resume_file_data: resumeFileData,
          resume_file_name: resumeFileName,
          resume_file_type: resumeFileType
        })
        setMessage('Resume file uploaded successfully!')
      } else {
        profileStorage.update({
          resume_url: resumeUrl,
          resume_file_data: '',
          resume_file_name: '',
          resume_file_type: ''
        })
        setMessage('Resume URL updated successfully!')
      }
      onUpdate()
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('Error saving resume')
    } finally {
      setSaving(false)
    }
  }

  const handleTestLink = () => {
    if (resumeUrl) {
      window.open(resumeUrl, '_blank')
    } else if (resumeFileData) {
      const link = document.createElement('a')
      link.href = resumeFileData
      link.download = resumeFileName || 'resume'
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
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
          <label className="block text-sm font-semibold text-navy-800 mb-3">
            Upload Method
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setUploadMethod('url')}
              className={`flex-1 px-4 py-3 rounded-lg border-2 transition-colors ${
                uploadMethod === 'url'
                  ? 'border-teal-500 bg-teal-50 text-teal-700'
                  : 'border-gray-300 text-gray-600 hover:border-gray-400'
              }`}
            >
              <ExternalLink size={18} className="inline mr-2" />
              External URL
            </button>
            <button
              type="button"
              onClick={() => setUploadMethod('file')}
              className={`flex-1 px-4 py-3 rounded-lg border-2 transition-colors ${
                uploadMethod === 'file'
                  ? 'border-teal-500 bg-teal-50 text-teal-700'
                  : 'border-gray-300 text-gray-600 hover:border-gray-400'
              }`}
            >
              <Upload size={18} className="inline mr-2" />
              Upload File
            </button>
          </div>
        </div>

        {uploadMethod === 'url' ? (
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
        ) : (
          <div>
            <label className="block text-sm font-semibold text-navy-800 mb-2">
              Upload Resume File
            </label>
            <p className="text-sm text-gray-500 mb-3">
              Upload your resume file (PDF, DOC, DOCX). The file will be stored locally in your browser.
            </p>
            
            {resumeFileData ? (
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <File className="text-teal-600" size={24} />
                    <div>
                      <p className="font-medium text-gray-800">{resumeFileName}</p>
                      <p className="text-sm text-gray-500">{resumeFileType}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleClearFile}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-teal-500 transition-colors">
                <input
                  type="file"
                  id="resume-upload"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="resume-upload"
                  className="cursor-pointer flex flex-col items-center gap-3"
                >
                  <Upload className="text-gray-400" size={32} />
                  <div>
                    <p className="font-medium text-gray-700">Click to upload resume</p>
                    <p className="text-sm text-gray-500">PDF, DOC, DOCX (Max 5MB)</p>
                  </div>
                </label>
              </div>
            )}
          </div>
        )}

        {uploadMethod === 'url' && (
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
        )}

        <div className="flex justify-end gap-3">
          {(resumeUrl || resumeFileData) && (
            <button
              type="button"
              onClick={handleTestLink}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ExternalLink size={18} />
              Test Resume
            </button>
          )}
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
