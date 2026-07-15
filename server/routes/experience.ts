import { Router } from 'express'
import pool from '../db/connection.js'
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js'

const router = Router()

// Get all experience (public)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM experience ORDER BY display_order')
    const formatted = result.rows.map(exp => ({
      ...exp,
      description: exp.description ? JSON.parse(exp.description) : [],
      is_current: Boolean(exp.is_current)
    }))
    res.json(formatted)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch experience' })
  }
})

// Add experience (admin only)
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { title, company, location, start_date, end_date, description, is_current } = req.body
    const result = await pool.query(`
      INSERT INTO experience (title, company, location, start_date, end_date, description, is_current, display_order)
      VALUES ($1, $2, $3, $4, $5, $6, $7, (SELECT COALESCE(MAX(display_order), -1) + 1 FROM experience))
      RETURNING id
    `, [title, company, location, start_date, end_date, JSON.stringify(description), is_current])
    res.json({ id: result.rows[0].id })
  } catch (error) {
    res.status(500).json({ error: 'Failed to add experience' })
  }
})

// Update experience (admin only)
router.put('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params
    const { title, company, location, start_date, end_date, description, is_current } = req.body
    await pool.query(`
      UPDATE experience SET 
        title = $1, company = $2, location = $3, start_date = $4, end_date = $5, 
        description = $6, is_current = $7
      WHERE id = $8
    `, [title, company, location, start_date, end_date, JSON.stringify(description), is_current, id])
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to update experience' })
  }
})

// Delete experience (admin only)
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params
    await pool.query('DELETE FROM experience WHERE id = $1', [id])
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete experience' })
  }
})

export default router