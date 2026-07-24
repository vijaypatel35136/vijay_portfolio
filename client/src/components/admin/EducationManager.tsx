import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Save, X, GraduationCap } from 'lucide-react'
import { motion } from 'framer-motion'
import { educationStorage } from '../../lib/storage'
import ConfirmationModal from './ConfirmationModal'

interface Education {
  id: number
  degree: string
  institution: string
  location: string
  start_date: string
  end_date: string | null
  gpa: string | null
  description?: string
}

interface EducationManagerProps {
  onUpdate: () => void
}

export default function EducationManager({ onUpdate }: EducationManagerProps) {
  const [educations, setEducations] = useState<Education[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    degree: '',
    institution: '',
    location: '',
    start_date: '',
    end_date: '',
    gpa: '',
    description: ''
  })

  // Modal state
  const [deleteId, setDeleteId] = useState<number | null>(null)

  useEffect(() => {
    fetchEducations()
  }, [])

  const fetchEducations = () => {
    const data = educationStorage.get()
    setEducations(data.map((edu) => ({
      ...edu,
      end_date: edu.end_date || null
    })))
    setLoading(false)
  }

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    educationStorage.add({
      ...formData,
      gpa: formData.gpa || null,
      description: formData.description || undefined
    })
    setFormData({
      degree: '',
      institution: '',
      location: '',
      start_date: '',
      end_date: '',
      gpa: '',
      description: ''
    })
    setShowAddForm(false)
    fetchEducations()
    onUpdate()
  }

  const handleUpdate = (id: number) => {
    const edu = educations.find(e => e.id === id)
    if (!edu) return
    educationStorage.update(id, {
      ...edu
    })
    fetchEducations()
    onUpdate()
    setEditingId(null)
  }

  const handleDelete = () => {
    if (deleteId === null) return
    educationStorage.delete(deleteId)
    fetchEducations()
    onUpdate()
    setDeleteId(null)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-gray-500 mt-4">Loading education...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteId !== null}
        title="Delete Education"
        message="Are you sure you want to delete this education entry? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="font-heading text-2xl font-bold text-navy-800">Education Manager</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          <Plus size={18} />
          Add Education
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <h3 className="font-heading text-lg font-semibold text-navy-800 mb-4">Add New Education</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-navy-800 mb-2">Degree</label>
                <input
                  type="text"
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  placeholder="e.g., Bachelor of Computer Science"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy-800 mb-2">Institution</label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  placeholder="e.g., University of Technology"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-navy-800 mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., New York, NY"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-navy-800 mb-2">Start Date</label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy-800 mb-2">End Date</label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-navy-800 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                placeholder="Describe your studies, achievements, etc."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                Add Education
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Education List */}
      <div className="space-y-4">
        {educations.map((edu) => (
          <div key={edu.id} className="bg-white rounded-xl border border-gray-200 p-6">
            {editingId === edu.id ? (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEducations(educations.map(item => item.id === edu.id ? { ...item, degree: e.target.value } : item))}
                    className="px-3 py-2 border border-gray-300 rounded text-sm"
                    placeholder="Degree"
                  />
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEducations(educations.map(item => item.id === edu.id ? { ...item, institution: e.target.value } : item))}
                    className="px-3 py-2 border border-gray-300 rounded text-sm"
                    placeholder="Institution"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={edu.location}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEducations(educations.map(item => item.id === edu.id ? { ...item, location: e.target.value } : item))}
                    className="px-3 py-2 border border-gray-300 rounded text-sm"
                    placeholder="Location"
                  />
                  <input
                    type="date"
                    value={edu.start_date}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEducations(educations.map(item => item.id === edu.id ? { ...item, start_date: e.target.value } : item))}
                    className="px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="date"
                    value={edu.end_date || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEducations(educations.map(item => item.id === edu.id ? { ...item, end_date: e.target.value || null } : item))}
                    className="px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                  <textarea
                    value={edu.description || ''}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEducations(educations.map(item => item.id === edu.id ? { ...item, description: e.target.value } : item))}
                    rows={2}
                    className="px-3 py-2 border border-gray-300 rounded text-sm"
                    placeholder="Description"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => handleUpdate(edu.id)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                  >
                    <Save size={18} />
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="p-2 text-gray-600 hover:bg-gray-50 rounded transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-teal-100 text-teal-700 rounded-lg">
                      <GraduationCap size={24} />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-bold text-navy-800">{edu.degree}</h3>
                      <p className="text-teal-600 font-semibold">{edu.institution}</p>
                      <p className="text-sm text-gray-600">{edu.location}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {edu.start_date} – {edu.end_date || 'Present'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingId(edu.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => setDeleteId(edu.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                {edu.description && (
                  <div className="pl-16">
                    <p className="text-gray-700">{edu.description}</p>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}