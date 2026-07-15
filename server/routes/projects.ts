import { Router } from 'express'
import pool from '../db/connection.js'
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js'

const router = Router()

// Get all projects (public)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM projects ORDER BY is_featured DESC, display_order')
    const formatted = result.rows.map(proj => ({
      ...proj,
      tech_stack: proj.tech_stack ? proj.tech_stack.split(', ') : [],
      is_featured: Boolean(proj.is_featured)
    }))
    res.json(formatted)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' })
  }
})

// Add project (admin only)
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { name, url, description, tech_stack, category, thumbnail, is_featured } = req.body
    const techStackStr = Array.isArray(tech_stack) ? tech_stack.join(', ') : tech_stack
    const result = await pool.query(`
      INSERT INTO projects (name, url, description, tech_stack, category, thumbnail, is_featured, display_order)
      VALUES ($1, $2, $3, $4, $5, $6, $7, (SELECT COALESCE(MAX(display_order), -1) + 1 FROM projects))
      RETURNING id
    `, [name, url, description, techStackStr, category || 'Shopify', thumbnail, is_featured])
    res.json({ id: result.rows[0].id })
  } catch (error) {
    res.status(500).json({ error: 'Failed to add project' })
  }
})

// Update project (admin only)
router.put('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params
    const { name, url, description, tech_stack, category, thumbnail, is_featured } = req.body
    const techStackStr = Array.isArray(tech_stack) ? tech_stack.join(', ') : tech_stack
    await pool.query(`
      UPDATE projects SET 
        name = $1, url = $2, description = $3, tech_stack = $4, category = $5,
        thumbnail = COALESCE($6, thumbnail), is_featured = $7
      WHERE id = $8
    `, [name, url, description, techStackStr, category, thumbnail, is_featured, id])
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project' })
  }
})

// Delete project (admin only)
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params
    await pool.query('DELETE FROM projects WHERE id = $1', [id])
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' })
  }
})

export default router