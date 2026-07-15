import { Pool } from 'pg'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'vijay_portfolio',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
})

export async function getDb() {
  return pool
}

export async function initDatabase() {
  const client = await pool.connect()

  try {
    // Create tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS profile (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        name TEXT NOT NULL DEFAULT 'Vijay Bhesaniya',
        tagline_roles TEXT NOT NULL DEFAULT '["Shopify Liquid Developer", "Python Developer", "WordPress Developer", "eCommerce Performance Specialist"]',
        summary TEXT,
        profile_photo TEXT,
        resume_pdf TEXT,
        email TEXT DEFAULT 'bhesaniyav38@gmail.com',
        phone TEXT DEFAULT '+91 95104 26764',
        linkedin TEXT DEFAULT 'https://linkedin.com/in/bhesaniya-vijay-355b7020b',
        github TEXT DEFAULT 'https://vijaybhesaniya.github.io/portfolio/',
        location TEXT DEFAULT 'Ahmedabad, Gujarat, India',
        experience_years INTEGER DEFAULT 2,
        projects_count INTEGER DEFAULT 15,
        education TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS skills (
        id SERIAL PRIMARY KEY,
        category TEXT NOT NULL,
        skill TEXT NOT NULL,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS experience (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        company TEXT NOT NULL,
        location TEXT,
        start_date TEXT NOT NULL,
        end_date TEXT,
        description TEXT NOT NULL,
        is_current BOOLEAN DEFAULT false,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        url TEXT NOT NULL,
        description TEXT,
        tech_stack TEXT,
        category TEXT DEFAULT 'Shopify',
        thumbnail TEXT,
        is_featured BOOLEAN DEFAULT false,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS education (
        id SERIAL PRIMARY KEY,
        degree TEXT NOT NULL,
        institution TEXT NOT NULL,
        location TEXT,
        start_date TEXT,
        end_date TEXT,
        description TEXT,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        key TEXT PRIMARY KEY,
        value TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Check if admin exists
    const adminResult = await client.query("SELECT * FROM admin WHERE email = $1", ['admin@vijay.dev'])
    if (adminResult.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10)
      await client.query("INSERT INTO admin (email, password) VALUES ($1, $2)", ['admin@vijay.dev', hashedPassword])
      console.log('✅ Default admin created: admin@vijay.dev / admin123')
    }

    // Check if profile exists
    const profileResult = await client.query("SELECT * FROM profile WHERE id = 1")
    if (profileResult.rows.length === 0) {
      await client.query(`
        INSERT INTO profile (id, name, tagline_roles, summary, location, experience_years, projects_count, education)
        VALUES (1, $1, $2, $3, $4, $5, $6, $7)
      `, [
        'Vijay Bhesaniya',
        JSON.stringify(['Shopify Liquid Developer', 'Python Developer', 'WordPress Developer', 'eCommerce Performance Specialist']),
        'Results-driven Shopify Liquid, Python, and WordPress Developer with 2+ years of experience building high-converting eCommerce storefronts, internal business systems, and content-managed websites.',
        'Ahmedabad, Gujarat, India',
        2,
        15,
        'Bachelor of Engineering — Computer Engineering, Om Engineering College, Junagadh, Gujarat | 2019 – 2023'
      ])
      console.log('✅ Default profile created')
    }

    // Seed skills if empty
    const skillsResult = await client.query("SELECT COUNT(*) as count FROM skills")
    const skillsCount = parseInt(skillsResult.rows[0].count)
    if (skillsCount === 0) {
      const skills = [
        { category: 'Shopify & eCommerce', skill: 'Shopify Liquid Development' },
        { category: 'Shopify & eCommerce', skill: 'Custom Theme Design & Sections' },
        { category: 'Shopify & eCommerce', skill: 'Shopify CLI & App Development' },
        { category: 'Shopify & eCommerce', skill: 'Shopify API & Third-Party Integrations' },
        { category: 'Shopify & eCommerce', skill: 'WooCommerce-to-Shopify Migration' },
        { category: 'Shopify & eCommerce', skill: 'A/B Testing & Conversion Optimization' },
        { category: 'Web Development', skill: 'WordPress Development (PHP)' },
        { category: 'Web Development', skill: 'HTML5, CSS3, JavaScript' },
        { category: 'Web Development', skill: 'Bootstrap, React' },
        { category: 'Web Development', skill: 'Contentful (Headless CMS)' },
        { category: 'Backend / Python', skill: 'Python Application Development' },
        { category: 'Backend / Python', skill: 'HRMS/BMS System Design' },
        { category: 'Backend / Python', skill: 'Data-driven Analytics Apps' },
        { category: 'Performance & SEO', skill: 'Website Speed & Performance Optimization' },
        { category: 'Performance & SEO', skill: 'SEO & Schema Markup' },
        { category: 'Performance & SEO', skill: 'Cross-Browser QA & Debugging' },
        { category: 'Performance & SEO', skill: 'Responsive / Mobile-First Design' },
      ]
      
      for (let i = 0; i < skills.length; i++) {
        await client.query("INSERT INTO skills (category, skill, display_order) VALUES ($1, $2, $3)", [skills[i].category, skills[i].skill, i])
      }
      console.log('✅ Skills seeded')
    }

    // Seed experience if empty
    const expResult = await client.query("SELECT COUNT(*) as count FROM experience")
    const expCount = parseInt(expResult.rows[0].count)
    if (expCount === 0) {
      const experiences = [
        {
          title: 'Shopify & Python Developer',
          company: 'Trilok Ninfotech Pvt. Ltd.',
          location: 'Ahmedabad, India',
          start_date: '2025-09-01',
          end_date: null,
          description: JSON.stringify([
            'Designing and building an in-house HRMS (Human Resource Management System)',
            'Developing a BMS (Business Management System) for core operations',
            'Building a Shopify analytics application for store insights',
            'Leading 2-3 parallel projects end-to-end'
          ]),
          is_current: true
        },
        {
          title: 'Shopify Developer',
          company: 'Ecodesoft Solutions',
          location: 'Ahmedabad, India',
          start_date: '2023-12-01',
          end_date: '2025-08-31',
          description: JSON.stringify([
            'Built and customized 10+ Shopify themes',
            'Integrated third-party apps and APIs',
            'Improved Core Web Vitals through optimization',
            'Led zero-downtime WooCommerce-to-Shopify migration'
          ]),
          is_current: false
        },
        {
          title: 'Shopify Developer - Intern',
          company: 'Hopiant Pvt. Ltd.',
          location: 'Junagadh, India',
          start_date: '2023-03-01',
          end_date: '2023-11-30',
          description: JSON.stringify([
            'Designed and customized Shopify storefronts using Liquid',
            'Collaborated with senior developers on responsive features',
            'Performed QA testing and debugging'
          ]),
          is_current: false
        }
      ]

      for (let i = 0; i < experiences.length; i++) {
        await client.query(
          "INSERT INTO experience (title, company, location, start_date, end_date, description, is_current, display_order) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
          [experiences[i].title, experiences[i].company, experiences[i].location, experiences[i].start_date, experiences[i].end_date, experiences[i].description, experiences[i].is_current, i]
        )
      }
      console.log('✅ Experience seeded')
    }

    // Seed projects if empty
    const projResult = await client.query("SELECT COUNT(*) as count FROM projects")
    const projCount = parseInt(projResult.rows[0].count)
    if (projCount === 0) {
      const projects = [
        { name: 'Body of Evidence', url: 'https://bodyofevidence.com.au/', description: 'A fast, dynamic web experience built on Contentful headless CMS with a React front end.', tech_stack: 'Contentful CMS, React, Headless Architecture', category: 'Shopify', is_featured: true },
        { name: 'Trade Vehicle Parts', url: 'https://tradevehicleparts.co.uk/', category: 'Shopify', is_featured: false },
        { name: 'Whitaker Brothers', url: 'https://www.whitakerbrothers.com/', category: 'Shopify', is_featured: false },
        { name: 'The Crafty Black Dog', url: 'https://thecraftyblackdog.co.uk/', category: 'Shopify', is_featured: false },
        { name: 'Van Junkies', url: 'https://vanjunkies.co.uk/', category: 'Shopify', is_featured: false },
        { name: 'Loxley Arts', url: 'https://loxleyarts.com/', category: 'Shopify', is_featured: false },
        { name: 'Alex Davis PCS', url: 'https://alexdavispcs.co.uk/', category: 'Shopify', is_featured: false },
        { name: 'Dervans Fashions', url: 'https://dervansfashions.ie/', category: 'Shopify', is_featured: false },
        { name: 'The Kennel Store', url: 'https://www.kennelstore.co.uk/', category: 'Shopify', is_featured: false },
        { name: 'Mushroom Spawn Store', url: 'https://mushroomspawnstore.com/', category: 'Shopify', is_featured: false },
        { name: 'Aliver Cosmetics', url: 'https://alivercosmetics.com/', category: 'Shopify', is_featured: false },
        { name: 'All City Candy', url: 'https://allcitycandy.com/', category: 'Shopify', is_featured: false },
        { name: 'Gold Label Car Care', url: 'https://www.goldlabelcarcare.co.uk/', category: 'Shopify', is_featured: false },
        { name: 'Healthy Hub', url: 'https://healthyhub.ca/', category: 'Shopify', is_featured: false },
        { name: 'Last Elf on the Left', url: 'https://lastelfontheleft.com/', category: 'Shopify', is_featured: false },
        { name: 'Signal and Power', url: 'https://www.signalandpower.com/', category: 'Shopify', is_featured: false },
      ]

      for (let i = 0; i < projects.length; i++) {
        await client.query(
          "INSERT INTO projects (name, url, description, tech_stack, category, is_featured, display_order) VALUES ($1, $2, $3, $4, $5, $6, $7)",
          [projects[i].name, projects[i].url, projects[i].description || '', projects[i].tech_stack || '', projects[i].category, projects[i].is_featured, i]
        )
      }
      console.log('✅ Projects seeded')
    }

    // Seed education if empty
    const eduResult = await client.query("SELECT COUNT(*) as count FROM education")
    const eduCount = parseInt(eduResult.rows[0].count)
    if (eduCount === 0) {
      await client.query(`
        INSERT INTO education (degree, institution, location, start_date, end_date, display_order)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, ['Bachelor of Engineering — Computer Engineering', 'Om Engineering College', 'Junagadh, Gujarat', '2019-06-01', '2023-05-31', 0])
      console.log('✅ Education seeded')
    }

    console.log('✅ Database initialized successfully')
  } finally {
    client.release()
  }
}

// Helper function to run queries and return results as objects
export async function queryAll(sql: string, params: any[] = []): Promise<any[]> {
  const client = await pool.connect()
  try {
    const result = await client.query(sql, params)
    return result.rows
  } finally {
    client.release()
  }
}

export async function queryOne(sql: string, params: any[] = []): Promise<any | null> {
  const results = await queryAll(sql, params)
  return results.length > 0 ? results[0] : null
}

export async function run(sql: string, params: any[] = []): Promise<{ lastInsertRowid: number }> {
  const client = await pool.connect()
  try {
    const result = await client.query(sql, params)
    return { lastInsertRowid: Number(result.rows[0]?.id) || 0 }
  } finally {
    client.release()
  }
}