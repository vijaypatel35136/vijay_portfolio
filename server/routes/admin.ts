import { Router } from 'express'
import pool from '../db/connection.js'

const router = Router()

// Get dashboard stats (admin only)
router.get('/stats', async (req, res) => {
  try {
    const [projectsCount, messagesCount, unreadCount, experienceCount] = await Promise.all([
      pool.query('SELECT COUNT(*) as count FROM projects'),
      pool.query('SELECT COUNT(*) as count FROM messages'),
      pool.query('SELECT COUNT(*) as count FROM messages WHERE is_read = false'),
      pool.query('SELECT COUNT(*) as count FROM experience')
    ])
    
    res.json({
      totalProjects: parseInt(projectsCount.rows[0].count) || 0,
      totalMessages: parseInt(messagesCount.rows[0].count) || 0,
      unreadMessages: parseInt(unreadCount.rows[0].count) || 0,
      totalExperience: parseInt(experienceCount.rows[0].count) || 0
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
})

export default router