import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, CheckCircle, XCircle } from 'lucide-react'
import { api } from '../utils/api'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus('idle')
    setErrorMessage('')

    try {
      const response = await api.post('/api/contact', formData)
      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', message: '' })
        
        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setStatus('idle')
        }, 5000)
      } else {
        setStatus('error')
        setErrorMessage(data.error || 'Failed to send message')
      }
    } catch (error) {
      setStatus('error')
      setErrorMessage('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="stats-card p-6 rounded-xl relative"
      onSubmit={handleSubmit}
    >
      <AnimatePresence>
        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-4 bg-teal-500/20 border border-teal-500 rounded-lg flex items-start gap-3"
          >
            <CheckCircle className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-teal-400 font-semibold">Message sent successfully!</p>
              <p className="text-teal-300 text-sm mt-1">Thanks for reaching out. I'll get back to you within 24 hours.</p>
            </div>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg flex items-start gap-3"
          >
            <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-400 font-semibold">Failed to send message</p>
              <p className="text-red-300 text-sm mt-1">{errorMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-5">
        <div>
          <label className="block text-sm text-gray-400 mb-2">NAME</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            className="w-full px-4 py-3 bg-navy-700 border border-navy-600 rounded-lg text-gray-100 placeholder-gray-500 focus:border-teal-500 transition-colors"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">EMAIL</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@company.com"
            className="w-full px-4 py-3 bg-navy-700 border border-navy-600 rounded-lg text-gray-100 placeholder-gray-500 focus:border-teal-500 transition-colors"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">MESSAGE</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell me about your project..."
            rows={4}
            className="w-full px-4 py-3 bg-navy-700 border border-navy-600 rounded-lg text-gray-100 placeholder-gray-500 focus:border-teal-500 transition-colors resize-none"
            required
          />
        </div>
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          className="w-full py-3 bg-teal-500 text-white font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-teal-600 transition-colors cta-glow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send size={18} /> Send Message
            </>
          )}
        </motion.button>
      </div>
    </motion.form>
  )
}