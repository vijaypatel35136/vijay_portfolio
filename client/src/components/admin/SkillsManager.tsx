import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { skillsStorage } from '../../lib/storage'
import ConfirmationModal from './ConfirmationModal'

interface Skill {
  id: number
  category: string
  skill: string
}

interface SkillsManagerProps {
  onUpdate: () => void
}

export default function SkillsManager({ onUpdate }: SkillsManagerProps) {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({ category: '', skill: '' })
  
  // Modal state
  const [deleteId, setDeleteId] = useState<number | null>(null)

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = () => {
    setSkills(skillsStorage.get())
    setLoading(false)
  }

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    skillsStorage.add(formData)
    setFormData({ category: '', skill: '' })
    setShowAddForm(false)
    fetchSkills()
    onUpdate()
  }

  const handleUpdate = (id: number, data: { category: string; skill: string }) => {
    skillsStorage.update(id, data)
    fetchSkills()
    onUpdate()
    setEditingId(null)
  }

  const handleDelete = () => {
    if (deleteId === null) return
    skillsStorage.delete(deleteId)
    fetchSkills()
    onUpdate()
    setDeleteId(null)
  }

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = []
    }
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-gray-500 mt-4">Loading skills...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteId !== null}
        title="Delete Skill"
        message="Are you sure you want to delete this skill? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="font-heading text-2xl font-bold text-navy-800">Skills Manager</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          <Plus size={18} />
          Add Skill
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <h3 className="font-heading text-lg font-semibold text-navy-800 mb-4">Add New Skill</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-navy-800 mb-2">Skill Name</label>
                <input
                  type="text"
                  value={formData.skill}
                  onChange={(e) => setFormData({ ...formData, skill: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy-800 mb-2">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Frontend, Backend"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
                  required
                />
              </div>
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
                Add Skill
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Skills Grouped Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {Object.entries(groupedSkills).map(([category, skillList]) => (
          <div key={category} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-heading text-lg font-bold text-navy-800 mb-4 pb-2 border-b border-gray-100">{category}</h3>
            <div className="space-y-3">
              {skillList.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  {editingId === skill.id ? (
                    <div className="flex gap-2 w-full">
                      <input
                        type="text"
                        defaultValue={skill.skill}
                        id={`skill-${skill.id}`}
                        className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm text-black"
                      />
                      <button
                        onClick={() => {
                          const skillInput = document.getElementById(`skill-${skill.id}`) as HTMLInputElement
                          handleUpdate(skill.id, {
                            category: skill.category,
                            skill: skillInput.value
                          })
                        }}
                        className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                      >
                        <Save size={16} />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="text-gray-700">{skill.skill}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingId(skill.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteId(skill.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}