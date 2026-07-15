import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

import authRoutes from './routes/auth.js'
import profileRoutes from './routes/profile.js'
import skillsRoutes from './routes/skills.js'
import experienceRoutes from './routes/experience.js'
import projectsRoutes from './routes/projects.js'
import educationRoutes from './routes/education.js'
import contactRoutes from './routes/contact.js'
import adminRoutes from './routes/admin.js'
import uploadRoutes from './routes/upload.js'
import { initDatabase } from './db/database.js'

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '../.env') })

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Backend is running',
    timestamp: new Date().toISOString(),
    port: PORT
  })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/skills', skillsRoutes)
app.use('/api/experience', experienceRoutes)
app.use('/api/projects', projectsRoutes)
app.use('/api/education', educationRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/uploads', uploadRoutes)

// Serve static files from client build
app.use(express.static(path.join(__dirname, '../dist')))

// Handle SPA routing
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../dist/index.html'))
  }
})

// Initialize database and start server
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  })
}).catch((error) => {
  console.error('Failed to initialize database:', error)
  console.log('Starting server without database initialization...')
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  })
})