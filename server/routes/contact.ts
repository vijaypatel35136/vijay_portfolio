import { Router } from 'express'
import pool from '../db/connection.js'

const router = Router()

// Submit contact form (public)
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body
    
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' })
    }

    const result = await pool.query(
      'INSERT INTO messages (name, email, subject, message) VALUES ($1, $2, $3, $4) RETURNING id',
      [name, email, subject || '', message]
    )
    res.json({ success: true, id: result.rows[0].id })
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit message' })
  }
})

// Get all messages (admin only)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM messages ORDER BY created_at DESC')
    const formatted = result.rows.map(msg => ({
      ...msg,
      is_read: Boolean(msg.is_read)
    }))
    res.json(formatted)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' })
  }
})

// Get unread count (admin only)
router.get('/unread-count', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) as count FROM messages WHERE is_read = false')
    res.json({ count: parseInt(result.rows[0].count) || 0 })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch unread count' })
  }
})

// Mark message as read (admin only)
router.put('/:id/read', async (req, res) => {
  try {
    const { id } = req.params
    await pool.query('UPDATE messages SET is_read = true WHERE id = $1', [id])
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark message as read' })
  }
})

// Delete message (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    await pool.query('DELETE FROM messages WHERE id = $1', [id])
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete message' })
  }
})

export default router