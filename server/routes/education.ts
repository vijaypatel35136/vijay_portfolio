import { Router } from 'express'
import pool from '../db/connection.js'
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js'

const router = Router()

// Get all education (public)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM education ORDER BY display_order')
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch education' })
  }
})

// Add education (admin only)
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { degree, institution, location, start_date, end_date, description } = req.body
    const result = await pool.query(`
      INSERT INTO education (degree, institution, location, start_date, end_date, description, display_order)
      VALUES ($1, $2, $3, $4, $5, $6, (SELECT COALESCE(MAX(display_order), -1) + 1 FROM education))
      RETURNING id
    `, [degree, institution, location, start_date, end_date, description])
    res.json({ id: result.rows[0].id })
  } catch (error) {
    res.status(500).json({ error: 'Failed to add education' })
  }
})

// Update education (admin only)
router.put('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params
    const { degree, institution, location, start_date, end_date, description } = req.body
    await pool.query(`
      UPDATE education SET 
        degree = $1, institution = $2, location = $3, start_date = $4, end_date = $5, description = $6
      WHERE id = $7
    `, [degree, institution, location, start_date, end_date, description, id])
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to update education' })
  }
})

// Delete education (admin only)
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params
    await pool.query('DELETE FROM education WHERE id = $1', [id])
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete education' })
  }
})

export default router