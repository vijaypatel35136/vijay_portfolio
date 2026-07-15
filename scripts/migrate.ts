import pool from '../server/db/connection.js'
import bcrypt from 'bcryptjs'

async function migrate() {
  const client = await pool.connect()
  
  try {
    await client.query('BEGIN')

    // Create admin table
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✅ Admin table created')

    // Create profile table
    await client.query(`
      CREATE TABLE IF NOT EXISTS profile (
        id INTEGER PRIMARY KEY DEFAULT 1,
        name VARCHAR(255) NOT NULL DEFAULT 'Vijay Bhesaniya',
        tagline_roles TEXT NOT NULL DEFAULT '["Shopify Liquid Developer", "Python Developer", "WordPress Developer", "eCommerce Performance Specialist"]',
        summary TEXT,
        profile_photo TEXT,
        resume_pdf TEXT,
        email VARCHAR(255) DEFAULT 'bhesaniyav38@gmail.com',
        phone VARCHAR(50) DEFAULT '+91 95104 26764',
        linkedin VARCHAR(500) DEFAULT 'https://linkedin.com/in/bhesaniya-vijay-355b7020b',
        github VARCHAR(500) DEFAULT 'https://vijaybhesaniya.github.io/portfolio/',
        location VARCHAR(255) DEFAULT 'Ahmedabad, Gujarat, India',
        experience_years INTEGER DEFAULT 2,
        projects_count INTEGER DEFAULT 15,
        education TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✅ Profile table created')

    // Create skills table
    await client.query(`
      CREATE TABLE IF NOT EXISTS skills (
        id SERIAL PRIMARY KEY,
        category VARCHAR(255) NOT NULL,
        skill VARCHAR(255) NOT NULL,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✅ Skills table created')

    // Create experience table
    await client.query(`
      CREATE TABLE IF NOT EXISTS experience (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        company VARCHAR(255) NOT NULL,
        location VARCHAR(255),
        start_date DATE NOT NULL,
        end_date DATE,
        description TEXT NOT NULL,
        is_current BOOLEAN DEFAULT FALSE,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✅ Experience table created')

    // Create projects table
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        url VARCHAR(500) NOT NULL,
        description TEXT,
        tech_stack TEXT,
        category VARCHAR(100) DEFAULT 'Shopify',
        thumbnail TEXT,
        is_featured BOOLEAN DEFAULT FALSE,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✅ Projects table created')

    // Create education table
    await client.query(`
      CREATE TABLE IF NOT EXISTS education (
        id SERIAL PRIMARY KEY,
        degree VARCHAR(255) NOT NULL,
        institution VARCHAR(255) NOT NULL,
        location VARCHAR(255),
        start_date DATE,
        end_date DATE,
        description TEXT,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✅ Education table created')

    // Create messages table
    await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255),
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✅ Messages table created')

    // Create site_settings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        key VARCHAR(100) PRIMARY KEY,
        value TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✅ Site settings table created')

    // Seed default admin
    const adminExists = await client.query('SELECT * FROM admin WHERE email = $1', ['admin@vijay.dev'])
    if (adminExists.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10)
      await client.query('INSERT INTO admin (email, password) VALUES ($1, $2)', ['admin@vijay.dev', hashedPassword])
      console.log('✅ Default admin created')
    }

    // Seed default profile
    const profileExists = await client.query('SELECT * FROM profile WHERE id = 1')
    if (profileExists.rows.length === 0) {
      await client.query(`
        INSERT INTO profile (id, name, tagline_roles, summary, location, experience_years, projects_count, education)
        VALUES (1, 'Vijay Bhesaniya', $1, $2, 'Ahmedabad, Gujarat, India', 2, 15, $3)
      `, [
        JSON.stringify(['Shopify Liquid Developer', 'Python Developer', 'WordPress Developer', 'eCommerce Performance Specialist']),
        'Results-driven Shopify Liquid, Python, and WordPress Developer with 2+ years of experience building high-converting eCommerce storefronts, internal business systems, and content-managed websites.',
        'Bachelor of Engineering — Computer Engineering, Om Engineering College, Junagadh, Gujarat | 2019 – 2023'
      ])
      console.log('✅ Default profile created')
    }

    await client.query('COMMIT')
    console.log('🎉 Migration completed successfully!')
  } catch (e) {
    await client.query('ROLLBACK')
    console.error('Migration failed:', e)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

migrate()