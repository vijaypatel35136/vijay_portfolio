import { Router } from 'express'
import pool from '../db/connection.js'
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js'

const router = Router()

// Get all skills (public)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM skills ORDER BY category, display_order')
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch skills' })
  }
})

// Add skill (admin only)
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { category, skill } = req.body
    const result = await pool.query(
      'INSERT INTO skills (category, skill) VALUES ($1, $2) RETURNING id',
      [category, skill]
    )
    res.json({ id: result.rows[0].id, category, skill })
  } catch (error) {
    res.status(500).json({ error: 'Failed to add skill' })
  }
})

// Update skill (admin only)
router.put('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params
    const { category, skill } = req.body
    await pool.query(
      'UPDATE skills SET category = $1, skill = $2 WHERE id = $3',
      [category, skill, id]
    )
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to update skill' })
  }
})

// Delete skill (admin only)
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params
    await pool.query('DELETE FROM skills WHERE id = $1', [id])
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete skill' })
  }
})

export default router