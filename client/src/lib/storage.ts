// Local storage utility for managing portfolio data
// This replaces the backend API with client-side storage

export interface Profile {
  name: string
  title: string
  tagline: string
  tagline_roles: string[]
  summary: string        // was: bio
  email: string
  phone: string
  linkedin: string
  github: string
  location: string
  avatar_url: string
  experience_years: number
  projects_count: number
  resume_url?: string    // Added field
}

export interface Skill {
  id: number
  category: string
  skill: string
}

export interface Experience {
  id: number
  title: string
  company: string
  location: string
  start_date: string
  end_date: string | null
  description: string[]
  is_current: boolean    // added
}

export interface Project {
  id: number
  name: string           // was: title
  description: string
  category: string
  image_url: string
  github_url: string
  url: string            // was: live_url
  tech_stack: string[]
  is_featured: boolean
}

export interface Education {
  id: number
  degree: string
  institution: string
  location: string
  start_date: string
  end_date: string | null
  gpa: string | null
  description?: string
}

export interface ContactMessage {
  id: number
  name: string
  email: string
  message: string
  created_at: string
  is_read: boolean
}

// Default data
const defaultProfile: Profile = {
  name: 'Vijay Bhesaniya',
  title: 'Shopify Liquid & Python Developer',
  tagline: 'Building digital experiences',
  tagline_roles: [
    'Shopify Liquid Developer',
    'Python Developer',
    'WordPress Developer',
    'eCommerce Performance Specialist',
  ],
  summary:
    'Results-driven Shopify Liquid, Python, and WordPress developer with 2+ years of experience building high-converting eCommerce storefronts, internal business systems, and content-managed websites.',
  email: 'bhesaniyav38@gmail.com',
  phone: '+91 95104 26764',
  linkedin: 'https://linkedin.com/in/bhesaniya-vijay-355b7020b',
  github: 'https://vijaybhesaniya.github.io/portfolio/',
  location: 'Ahmedabad, India',
  avatar_url: '',
  experience_years: 2,
  projects_count: 15,
  resume_url: ''
}

const defaultSkills: Skill[] = [
  { id: 1, category: 'Shopify & eCommerce', skill: 'Shopify Liquid' },
  { id: 2, category: 'Shopify & eCommerce', skill: 'Shopify CLI' },
  { id: 3, category: 'Shopify & eCommerce', skill: 'Dawn Theme' },
  { id: 4, category: 'Shopify & eCommerce', skill: 'Shopify APIs' },
  { id: 5, category: 'Python Development', skill: 'Python' },
  { id: 6, category: 'Python Development', skill: 'Flask' },
  { id: 7, category: 'Python Development', skill: 'Django' },
  { id: 8, category: 'Python Development', skill: 'Automation Scripts' },
  { id: 9, category: 'Frontend', skill: 'React' },
  { id: 10, category: 'Frontend', skill: 'TypeScript' },
  { id: 11, category: 'Frontend', skill: 'Tailwind CSS' },
  { id: 12, category: 'WordPress', skill: 'WordPress' },
  { id: 13, category: 'WordPress', skill: 'Elementor' },
  { id: 14, category: 'WordPress', skill: 'WooCommerce' },
]

const defaultExperiences: Experience[] = [
  {
    id: 1,
    title: 'Shopify Liquid Developer',
    company: 'Freelance / Self-Employed',
    location: 'Ahmedabad, India',
    start_date: '2022',
    end_date: null,
    is_current: true,
    description: [
      'Built and customised Shopify storefronts using Liquid, Dawn theme, and Shopify CLI.',
      'Integrated third-party apps and Shopify APIs to extend store functionality.',
      'Developed Python scripts to automate inventory management and reporting.',
      'Delivered 15+ projects across various eCommerce niches.',
    ],
  },
]

const defaultProjects: Project[] = [
  {
    id: 1,
    name: 'Shopify Custom Storefront',
    description: 'Fully custom Shopify store built with Liquid templating and Dawn theme overrides.',
    category: 'Shopify',
    image_url: '',
    github_url: '',
    url: 'https://vijaypatel35136.github.io/vijay_portfolio/',
    tech_stack: ['Shopify Liquid', 'Dawn Theme', 'CSS', 'JavaScript'],
    is_featured: true,
  },
  {
    id: 2,
    name: 'Python Inventory Automation',
    description: 'Python script to sync inventory between Shopify and a local database automatically.',
    category: 'Python',
    image_url: '',
    github_url: 'https://github.com/vijaypatel35136/vijay_portfolio',
    url: 'https://github.com/vijaypatel35136/vijay_portfolio',
    tech_stack: ['Python', 'Shopify API', 'SQLite'],
    is_featured: false,
  },
  {
    id: 3,
    name: 'WordPress Business Site',
    description: 'Responsive business website built on WordPress with custom Elementor layouts.',
    category: 'WordPress',
    image_url: '',
    github_url: '',
    url: 'https://vijaypatel35136.github.io/vijay_portfolio/',
    tech_stack: ['WordPress', 'Elementor', 'WooCommerce'],
    is_featured: false,
  },
]

const defaultEducation: Education[] = [
  {
    id: 1,
    degree: 'B.E. Computer Engineering',
    institution: 'Gujarat Technological University',
    location: 'Ahmedabad, Gujarat',
    start_date: '2019',
    end_date: '2023',
    gpa: null,
  },
]

// Storage keys
const STORAGE_KEYS = {
  PROFILE: 'portfolio_profile',
  SKILLS: 'portfolio_skills',
  EXPERIENCES: 'portfolio_experiences',
  PROJECTS: 'portfolio_projects',
  EDUCATION: 'portfolio_education',
  MESSAGES: 'portfolio_messages',
  ADMIN_TOKEN: 'portfolio_admin_token',
}

const STORAGE_VERSION = 'v3'

// Initialize storage with default data
function initializeStorage() {
  // Clear old incompatible storage if version changed
  if (localStorage.getItem('portfolio_version') !== STORAGE_VERSION) {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key))
    localStorage.setItem('portfolio_version', STORAGE_VERSION)
  }

  if (!localStorage.getItem(STORAGE_KEYS.PROFILE)) {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(defaultProfile))
  }
  if (!localStorage.getItem(STORAGE_KEYS.SKILLS)) {
    localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(defaultSkills))
  }
  if (!localStorage.getItem(STORAGE_KEYS.EXPERIENCES)) {
    localStorage.setItem(STORAGE_KEYS.EXPERIENCES, JSON.stringify(defaultExperiences))
  }
  if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(defaultProjects))
  }
  if (!localStorage.getItem(STORAGE_KEYS.EDUCATION)) {
    localStorage.setItem(STORAGE_KEYS.EDUCATION, JSON.stringify(defaultEducation))
  }
  if (!localStorage.getItem(STORAGE_KEYS.MESSAGES)) {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify([]))
  }
}

// Initialize on load
initializeStorage()

// Generic storage operations
function getStorage<T>(key: string): T | null {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : null
}

function setStorage<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data))
}

// Profile operations
export const profileStorage = {
  get: (): Profile => getStorage<Profile>(STORAGE_KEYS.PROFILE) || defaultProfile,
  update: (data: Partial<Profile>): Profile => {
    const current = profileStorage.get()
    const updated = { ...current, ...data }
    setStorage(STORAGE_KEYS.PROFILE, updated)
    return updated
  },
}

// Skills operations
export const skillsStorage = {
  get: (): Skill[] => getStorage<Skill[]>(STORAGE_KEYS.SKILLS) || defaultSkills,
  add: (skill: Omit<Skill, 'id'>): Skill => {
    const skills = skillsStorage.get()
    const newSkill = { ...skill, id: Date.now() }
    setStorage(STORAGE_KEYS.SKILLS, [...skills, newSkill])
    return newSkill
  },
  update: (id: number, data: Partial<Skill>): Skill => {
    const skills = skillsStorage.get()
    const updated = skills.map(s => s.id === id ? { ...s, ...data } : s)
    setStorage(STORAGE_KEYS.SKILLS, updated)
    return updated.find(s => s.id === id)!
  },
  delete: (id: number): void => {
    const skills = skillsStorage.get()
    setStorage(STORAGE_KEYS.SKILLS, skills.filter(s => s.id !== id))
  },
}

// Experience operations
export const experienceStorage = {
  get: (): Experience[] => getStorage<Experience[]>(STORAGE_KEYS.EXPERIENCES) || defaultExperiences,
  add: (experience: Omit<Experience, 'id'>): Experience => {
    const experiences = experienceStorage.get()
    const newExp = { ...experience, id: Date.now() }
    setStorage(STORAGE_KEYS.EXPERIENCES, [...experiences, newExp])
    return newExp
  },
  update: (id: number, data: Partial<Experience>): Experience => {
    const experiences = experienceStorage.get()
    const updated = experiences.map(e => e.id === id ? { ...e, ...data } : e)
    setStorage(STORAGE_KEYS.EXPERIENCES, updated)
    return updated.find(e => e.id === id)!
  },
  delete: (id: number): void => {
    const experiences = experienceStorage.get()
    setStorage(STORAGE_KEYS.EXPERIENCES, experiences.filter(e => e.id !== id))
  },
}

// Projects operations
export const projectsStorage = {
  get: (): Project[] => getStorage<Project[]>(STORAGE_KEYS.PROJECTS) || defaultProjects,
  add: (project: Omit<Project, 'id'>): Project => {
    const projects = projectsStorage.get()
    const newProject = { ...project, id: Date.now() }
    setStorage(STORAGE_KEYS.PROJECTS, [...projects, newProject])
    return newProject
  },
  update: (id: number, data: Partial<Project>): Project => {
    const projects = projectsStorage.get()
    const updated = projects.map(p => p.id === id ? { ...p, ...data } : p)
    setStorage(STORAGE_KEYS.PROJECTS, updated)
    return updated.find(p => p.id === id)!
  },
  delete: (id: number): void => {
    const projects = projectsStorage.get()
    setStorage(STORAGE_KEYS.PROJECTS, projects.filter(p => p.id !== id))
  },
}

// Education operations
export const educationStorage = {
  get: (): Education[] => getStorage<Education[]>(STORAGE_KEYS.EDUCATION) || defaultEducation,
  add: (education: Omit<Education, 'id'>): Education => {
    const educations = educationStorage.get()
    const newEdu = { ...education, id: Date.now() }
    setStorage(STORAGE_KEYS.EDUCATION, [...educations, newEdu])
    return newEdu
  },
  update: (id: number, data: Partial<Education>): Education => {
    const educations = educationStorage.get()
    const updated = educations.map(e => e.id === id ? { ...e, ...data } : e)
    setStorage(STORAGE_KEYS.EDUCATION, updated)
    return updated.find(e => e.id === id)!
  },
  delete: (id: number): void => {
    const educations = educationStorage.get()
    setStorage(STORAGE_KEYS.EDUCATION, educations.filter(e => e.id !== id))
  },
}

// Messages operations
export const messagesStorage = {
  get: (): ContactMessage[] => getStorage<ContactMessage[]>(STORAGE_KEYS.MESSAGES) || [],
  add: (message: Omit<ContactMessage, 'id' | 'created_at' | 'is_read'>): ContactMessage => {
    const messages = messagesStorage.get()
    const newMessage = {
      ...message,
      id: Date.now(),
      created_at: new Date().toISOString(),
      is_read: false,
    }
    setStorage(STORAGE_KEYS.MESSAGES, [...messages, newMessage])
    return newMessage
  },
  markAsRead: (id: number): void => {
    const messages = messagesStorage.get()
    const updated = messages.map(m => m.id === id ? { ...m, is_read: true } : m)
    setStorage(STORAGE_KEYS.MESSAGES, updated)
  },
  delete: (id: number): void => {
    const messages = messagesStorage.get()
    setStorage(STORAGE_KEYS.MESSAGES, messages.filter(m => m.id !== id))
  },
}

// Auth operations
export const authStorage = {
  setToken: (token: string): void => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, token)
  },
  getToken: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN)
  },
  removeToken: (): void => {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN)
  },
  login: (email: string, password: string): boolean => {
    if (email === 'admin@vijay.dev' && password === 'admin123') {
      const token = btoa(`${email}:${Date.now()}`)
      authStorage.setToken(token)
      return true
    }
    return false
  },
  logout: (): void => {
    authStorage.removeToken()
  },
  isAuthenticated: (): boolean => {
    return !!authStorage.getToken()
  },
}

