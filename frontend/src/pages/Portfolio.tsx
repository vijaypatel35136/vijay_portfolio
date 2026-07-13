import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Link2 as Github, 
  UserCircle as Linkedin, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Calendar, 
  GraduationCap, 
  ExternalLink, 
  FileText, 
  Send, 
  ArrowUp,
  Moon,
  Sun,
  Code2 as Code
} from 'lucide-react';
import { apiService } from '../services/api';

interface Profile {
  name: string;
  bio: string;
  typewriter_roles: string[];
  resume_path: string;
  profile_photo_path: string;
  phone: string;
  email: string;
  github: string;
  linkedin: string;
  address: string;
}

interface Skill {
  id: number;
  name: string;
}

interface SkillCategory {
  id: number;
  name: string;
  skills: Skill[];
}

interface Experience {
  id: number;
  title: string;
  company: string;
  location: string;
  start_date: string;
  end_date: string;
  points: string[];
}

interface Project {
  id: number;
  title: string;
  url: string;
  description: string;
  tags: string[];
  thumbnail_path: string;
  is_featured: boolean;
}

interface Education {
  id: number;
  institution: string;
  degree: string;
  location: string;
  date_range: string;
}

export default function Portfolio() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<SkillCategory[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  
  // Typewriter effect
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  // Filter & Toggle states
  const [projectFilter, setProjectFilter] = useState<'All' | 'Shopify' | 'WordPress' | 'Python'>('All');
  const [darkMode, setDarkMode] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Form state
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  // Fetch all initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileData = await apiService.get<Profile>('/api/profile');
        setProfile(profileData);
      } catch (err) {
        console.error('Failed to load profile', err);
      }

      try {
        const skillsData = await apiService.get<SkillCategory[]>('/api/skills');
        setSkills(skillsData);
      } catch (err) {
        console.error('Failed to load skills', err);
      }

      try {
        const expData = await apiService.get<Experience[]>('/api/experience');
        setExperiences(expData);
      } catch (err) {
        console.error('Failed to load experience', err);
      }

      try {
        const projectsData = await apiService.get<Project[]>('/api/projects');
        setProjects(projectsData);
      } catch (err) {
        console.error('Failed to load projects', err);
      }

      try {
        const eduData = await apiService.get<Education[]>('/api/education');
        setEducation(eduData);
      } catch (err) {
        console.error('Failed to load education', err);
      }
    };

    fetchData();

    // Scroll top visibility check
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Theme Toggle Effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.remove('light-mode');
    } else {
      document.documentElement.classList.add('light-mode');
    }
  }, [darkMode]);

  // Typewriter Loop
  useEffect(() => {
    if (!profile || !profile.typewriter_roles || profile.typewriter_roles.length === 0) return;

    const roles = profile.typewriter_roles;
    const fullText = roles[currentRoleIndex];

    const handleType = () => {
      if (!isDeleting) {
        // Typing
        setCurrentText(fullText.substring(0, currentText.length + 1));
        setTypingSpeed(100);
        if (currentText === fullText) {
          // Pause before deleting
          setTypingSpeed(2000);
          setIsDeleting(true);
        }
      } else {
        // Deleting
        setCurrentText(fullText.substring(0, currentText.length - 1));
        setTypingSpeed(50);
        if (currentText === '') {
          setIsDeleting(false);
          setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
        }
      }
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentRoleIndex, profile, typingSpeed]);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormSuccess(false);
    setFormError('');

    try {
      await apiService.post('/api/contact', formData);
      setFormSuccess(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (err: any) {
      setFormError(err.message || 'Failed to send message.');
    } finally {
      setFormLoading(false);
    }
  };

  const filteredProjects = projects.filter(p => {
    if (projectFilter === 'All') return true;
    return p.tags?.some(tag => tag.toLowerCase().includes(projectFilter.toLowerCase()));
  });

  const featuredProject = projects.find(p => p.is_featured);

  return (
    <div style={{ position: 'relative' }}>
      {/* Dark / Light Toggle */}
      <div style={{ position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 100 }}>
        <button 
          onClick={() => setDarkMode(!darkMode)} 
          className="glass" 
          style={{ width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          {darkMode ? <Sun size={20} color="#0E7C7B" /> : <Moon size={20} color="#0E7C7B" />}
        </button>
      </div>

      {/* --- HERO SECTION --- */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '4rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '3rem', alignItems: 'center' }}>
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h4 style={{ color: 'var(--accent)', fontWeight: 500, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1rem' }}>
                Welcome to my space
              </h4>
              <h1 style={{ fontSize: '3.8rem', lineHeight: '1.1', marginBottom: '1.5rem' }}>
                Hi, I'm <span style={{ color: 'var(--accent)', textShadow: '0 0 20px var(--accent-glow)' }}>{profile?.name || 'Vijay Bhesaniya'}</span>
              </h1>
              
              <div style={{ minHeight: '40px', fontSize: '1.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>&lt;</span>
                <span style={{ color: 'var(--accent)' }}>{currentText}</span>
                <span className="typewriter-cursor" style={{ width: '2px', height: '1.8rem', background: 'var(--accent)', animation: 'blink 0.75s step-end infinite' }}>|</span>
                <span>/&gt;</span>
              </div>
              
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2.5rem', maxWidth: '600px' }}>
                {profile?.bio?.slice(0, 220)}...
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
                <a href="#projects" className="btn btn-primary">View Projects</a>
                <a href="#contact" className="btn btn-hire">Hire Me</a>
                {profile?.resume_path && (
                  <a href={`http://localhost:8000${profile.resume_path}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ gap: '0.5rem' }}>
                    <FileText size={18} />
                    Download Resume
                  </a>
                )}
              </div>

              {/* Social row */}
              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                {profile?.email && (
                  <a href={`mailto:${profile.email}`} target="_blank" rel="noreferrer" className="contact-icon-wrapper" style={{ width: '40px', height: '40px' }}>
                    <Mail size={18} />
                  </a>
                )}
                {profile?.phone && (
                  <a href={`tel:${profile.phone}`} target="_blank" rel="noreferrer" className="contact-icon-wrapper" style={{ width: '40px', height: '40px' }}>
                    <Phone size={18} />
                  </a>
                )}
                {profile?.linkedin && (
                  <a href={profile.linkedin} target="_blank" rel="noreferrer" className="contact-icon-wrapper" style={{ width: '40px', height: '40px' }}>
                    <Linkedin size={18} />
                  </a>
                )}
                {profile?.github && (
                  <a href={profile.github} target="_blank" rel="noreferrer" className="contact-icon-wrapper" style={{ width: '40px', height: '40px' }}>
                    <Github size={18} />
                  </a>
                )}
              </div>
            </motion.div>

            {/* Profile Avatar / Mock design */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <div className="glass" style={{ width: '300px', height: '300px', borderRadius: '50%', overflow: 'hidden', padding: '8px', border: '2px solid var(--accent)' }}>
                {profile?.profile_photo_path ? (
                  <img 
                    src={`http://localhost:8000${profile.profile_photo_path}`} 
                    alt="Vijay Bhesaniya" 
                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Code size={100} color="#ffffff" />
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- ABOUT ME SECTION --- */}
      <section id="about" style={{ background: 'rgba(255,255,255,0.01)' }}>
        <div className="container">
          <div className="section-header">
            <h2>About Me</h2>
            <p>A short preview of my professional path</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '3rem' }}>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: 'var(--accent)' }}>My Journey</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                {profile?.bio}
              </p>
            </motion.div>

            {/* Quick Facts Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="glass" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Quick Facts</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="contact-icon-wrapper" style={{ width: '40px', height: '40px' }}>
                      <MapPin size={18} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Location</h4>
                      <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{profile?.address || 'Ahmedabad, Gujarat, India'}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="contact-icon-wrapper" style={{ width: '40px', height: '40px' }}>
                      <Briefcase size={18} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Experience</h4>
                      <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>2+ Years</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="contact-icon-wrapper" style={{ width: '40px', height: '40px' }}>
                      <Code size={18} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Projects Delivered</h4>
                      <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>15+ Completed</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="contact-icon-wrapper" style={{ width: '40px', height: '40px' }}>
                      <GraduationCap size={18} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Education</h4>
                      <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>B.E. Computer Engineering</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- SKILLS SECTION --- */}
      <section id="skills">
        <div className="container">
          <div className="section-header">
            <h2>Skills & Expertise</h2>
            <p>Technical libraries and core domains I specialize in</p>
          </div>

          <div className="skills-container">
            {skills.map((category, idx) => (
              <motion.div 
                key={category.id}
                className="glass skills-category"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <h3>{category.name}</h3>
                <div className="skills-list">
                  {category.skills.map((skill) => (
                    <span key={skill.id} className="skill-pill">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- EXPERIENCE SECTION --- */}
      <section id="experience" style={{ background: 'rgba(255,255,255,0.01)' }}>
        <div className="container">
          <div className="section-header">
            <h2>Work Experience</h2>
            <p>My professional career timeline</p>
          </div>

          <div className="timeline">
            {experiences.map((exp, idx) => (
              <motion.div 
                key={exp.id} 
                className="timeline-item"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
              >
                <div className="timeline-dot"></div>
                <div className="glass timeline-content">
                  <div className="timeline-header">
                    <div>
                      <h3 className="timeline-role">{exp.title}</h3>
                      <span className="timeline-company">{exp.company}</span>
                      {exp.location && <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginLeft: '0.75rem' }}>({exp.location})</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                      <Calendar size={14} />
                      <span className="timeline-date">{exp.start_date} – {exp.end_date || 'Present'}</span>
                    </div>
                  </div>
                  <ul className="timeline-points">
                    {exp.points?.map((pt, pIdx) => (
                      <li key={pIdx}>{pt}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PROJECTS SECTION --- */}
      <section id="projects">
        <div className="container">
          <div className="section-header">
            <h2>Featured Projects</h2>
            <p>Showcasing my eCommerce development and custom application expertise</p>
          </div>

          {/* Highlight Featured Project */}
          {featuredProject && (
            <motion.div 
              className="glass featured-project-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              {featuredProject.thumbnail_path ? (
                <img 
                  src={`http://localhost:8000${featuredProject.thumbnail_path}`} 
                  alt={featuredProject.title} 
                  className="project-thumbnail" 
                  style={{ height: '100%', minHeight: '300px' }}
                />
              ) : (
                <div className="project-placeholder" style={{ height: '100%', minHeight: '300px' }}>
                  <Code size={60} />
                </div>
              )}
              <div className="project-content" style={{ justifyContent: 'center' }}>
                <span className="tag" style={{ alignSelf: 'flex-start', marginBottom: '1rem', background: 'var(--accent)', color: '#ffffff' }}>Featured Project</span>
                <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{featuredProject.title}</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '1.05rem' }}>
                  {featuredProject.description}
                </p>
                <div className="project-tags">
                  {featuredProject.tags?.map((t, idx) => <span key={idx} className="tag">{t}</span>)}
                </div>
                {featuredProject.url && (
                  <a href={featuredProject.url} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                    Visit Website <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </motion.div>
          )}

          {/* Project Filtering Header */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
            {(['All', 'Shopify', 'WordPress', 'Python'] as const).map(filter => (
              <button 
                key={filter} 
                className="btn" 
                style={{ 
                  background: projectFilter === filter ? 'var(--accent)' : 'transparent',
                  color: projectFilter === filter ? '#ffffff' : 'var(--text-primary)',
                  border: '1px solid var(--accent)',
                  padding: '0.5rem 1.5rem'
                }}
                onClick={() => setProjectFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="project-grid">
            {filteredProjects.map((p, idx) => (
              <motion.div 
                key={p.id} 
                className="glass project-card"
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
              >
                {p.thumbnail_path ? (
                  <img src={`http://localhost:8000${p.thumbnail_path}`} alt={p.title} className="project-thumbnail" />
                ) : (
                  <div className="project-placeholder">
                    <Code size={40} />
                  </div>
                )}
                <div className="project-content">
                  <h3 className="project-title">{p.title}</h3>
                  <p className="project-desc">{p.description || "Live Client Storefront Project"}</p>
                  <div className="project-tags">
                    {p.tags?.map((t, index) => <span key={index} className="tag">{t}</span>)}
                  </div>
                  {p.url && (
                    <a href={p.url} target="_blank" rel="noreferrer" className="project-link">
                      Visit Site <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- EDUCATION SECTION --- */}
      <section id="education" style={{ background: 'rgba(255,255,255,0.01)' }}>
        <div className="container">
          <div className="section-header">
            <h2>Education</h2>
            <p>Degree & credentials details</p>
          </div>

          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {education.map(edu => (
              <motion.div 
                key={edu.id} 
                className="glass" 
                style={{ padding: '2rem', display: 'flex', gap: '2rem', alignItems: 'center' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="contact-icon-wrapper" style={{ width: '60px', height: '60px', borderRadius: '12px' }}>
                  <GraduationCap size={32} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{edu.degree}</h3>
                  <h4 style={{ fontSize: '1.05rem', color: 'var(--accent)', fontWeight: 500, marginBottom: '0.5rem' }}>{edu.institution}</h4>
                  <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    <span>{edu.location}</span>
                    <span>•</span>
                    <span>{edu.date_range}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CONTACT SECTION --- */}
      <section id="contact">
        <div className="container">
          <div className="section-header">
            <h2>Get In Touch</h2>
            <p>Let's build something exceptional together</p>
          </div>

          <div className="contact-grid">
            <motion.div 
              className="contact-info"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Contact Details</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Feel free to drop a message or reach out via phone/email directly. I'll get back to you within 24 hours.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {profile?.phone && (
                  <div className="contact-item">
                    <div className="contact-icon-wrapper">
                      <Phone size={20} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Phone</h4>
                      <p style={{ fontSize: '1.05rem', fontWeight: 600 }}>{profile.phone}</p>
                    </div>
                  </div>
                )}

                {profile?.email && (
                  <div className="contact-item">
                    <div className="contact-icon-wrapper">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Email</h4>
                      <p style={{ fontSize: '1.05rem', fontWeight: 600 }}>{profile.email}</p>
                    </div>
                  </div>
                )}

                <div className="contact-item">
                  <div className="contact-icon-wrapper">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Address</h4>
                    <p style={{ fontSize: '1.05rem', fontWeight: 600 }}>{profile?.address || 'Ahmedabad, Gujarat, India'}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div 
              className="glass contact-form"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Send a Message</h3>
              <form onSubmit={handleContactSubmit}>
                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label htmlFor="name">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    required 
                    className="form-control" 
                    value={formData.name} 
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label htmlFor="email">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    required 
                    className="form-control" 
                    value={formData.email} 
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label htmlFor="message">Message</label>
                  <textarea 
                    id="message" 
                    rows={5} 
                    required 
                    className="form-control" 
                    value={formData.message} 
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                  ></textarea>
                </div>

                <button type="submit" disabled={formLoading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  {formLoading ? 'Sending...' : 'Send Message'} <Send size={16} />
                </button>

                {formSuccess && (
                  <p style={{ color: 'var(--accent)', marginTop: '1rem', textAlign: 'center', fontWeight: 500 }}>
                    Message successfully sent!
                  </p>
                )}
                {formError && (
                  <p style={{ color: '#ff6b6b', marginTop: '1rem', textAlign: 'center', fontWeight: 500 }}>
                    {formError}
                  </p>
                )}
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer style={{ background: 'var(--primary)', padding: '3rem 0', borderTop: '1px solid var(--card-border)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <h3 style={{ color: '#ffffff' }}>Vijay Bhesaniya</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Shopify Liquid & Python Developer</p>
          </div>
          
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#about" style={{ color: 'var(--text-secondary)' }}>About</a>
            <a href="#skills" style={{ color: 'var(--text-secondary)' }}>Skills</a>
            <a href="#experience" style={{ color: 'var(--text-secondary)' }}>Experience</a>
            <a href="#projects" style={{ color: 'var(--text-secondary)' }}>Projects</a>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            © {new Date().getFullYear()} Vijay Bhesaniya. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="glass" 
          style={{ position: 'fixed', bottom: '2rem', right: '2rem', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 100 }}
        >
          <ArrowUp size={24} color="var(--accent)" />
        </button>
      )}
    </div>
  );
}
