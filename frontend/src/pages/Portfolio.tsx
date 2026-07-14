import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, GitBranch, Globe, FileText, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { saveContactMessage, initDatabase } from '../lib/db';
import Layout from '../components/Layout';
import Typewriter from '../components/Typewriter';
import SkillSection from '../components/SkillSection';
import TimelineItem from '../components/TimelineItem';
import ProjectCard from '../components/ProjectCard';

interface Profile {
  name: string;
  taglines: string[];
  intro_text: string;
  about_text: string;
  location: string;
  experience_years: string;
  projects_delivered: number;
  education_summary: string;
  profile_photo_url?: string;
  resume_pdf_url?: string;
  email: string;
  phone: string;
  linkedin_url: string;
  github_url: string;
}

interface Skill {
  id: number;
  category: string;
  name: string;
}

interface Experience {
  id: number;
  title: string;
  company: string;
  location: string;
  start_date: string;
  end_date: string;
  bullets: string[];
}

interface Project {
  id: number;
  name: string;
  url?: string;
  description: string;
  tech_stack: string[];
  thumbnail_url?: string;
  is_featured: boolean;
  category: string;
}

interface Education {
  id: number;
  institution: string;
  degree: string;
  location: string;
  date_range: string;
}

export const Portfolio: React.FC = () => {
  // Static portfolio data
  const [profile] = useState<Profile>({
    name: 'Vijay Bhesaniya',
    taglines: ['Shopify Developer', 'Python Developer', 'Full Stack Developer'],
    intro_text: 'I build high-converting Shopify stores and robust Python applications.',
    about_text: 'Experienced developer specializing in Shopify Liquid, Python systems, and full-stack development. I help businesses scale with custom solutions.',
    location: 'India',
    experience_years: '5+ years',
    projects_delivered: 50,
    education_summary: 'B.Tech Computer Science',
    email: 'vijay@example.com',
    phone: '+91 9876543210',
    linkedin_url: 'https://linkedin.com/in/vijay',
    github_url: 'https://github.com/vijay'
  });

  const [skills] = useState<Skill[]>([
    { id: 1, category: 'Shopify', name: 'Liquid' },
    { id: 2, category: 'Shopify', name: 'Theme Development' },
    { id: 3, category: 'Python', name: 'FastAPI' },
    { id: 4, category: 'Python', name: 'Django' },
    { id: 5, category: 'Frontend', name: 'React' },
    { id: 6, category: 'Frontend', name: 'TypeScript' },
    { id: 7, category: 'Database', name: 'PostgreSQL' },
    { id: 8, category: 'Database', name: 'SQLite' },
  ]);

  const [experiences] = useState<Experience[]>([
    {
      id: 1,
      title: 'Senior Shopify Developer',
      company: 'Tech Solutions Inc',
      location: 'Remote',
      start_date: '2022-01',
      end_date: 'Present',
      bullets: ['Developed 20+ custom Shopify themes', 'Improved store performance by 40%', 'Led a team of 3 developers']
    },
    {
      id: 2,
      title: 'Python Developer',
      company: 'Data Systems Ltd',
      location: 'Mumbai',
      start_date: '2020-06',
      end_date: '2021-12',
      bullets: ['Built REST APIs with FastAPI', 'Developed data processing pipelines', 'Integrated third-party services']
    }
  ]);

  const [projects] = useState<Project[]>([
    {
      id: 1,
      name: 'E-commerce Platform',
      url: 'https://example.com',
      description: 'Custom Shopify store with advanced features',
      tech_stack: ['Shopify', 'Liquid', 'JavaScript'],
      is_featured: true,
      category: 'shopify'
    },
    {
      id: 2,
      name: 'Inventory System',
      url: 'https://example.com',
      description: 'Python-based inventory management system',
      tech_stack: ['Python', 'FastAPI', 'PostgreSQL'],
      is_featured: false,
      category: 'python'
    },
    {
      id: 3,
      name: 'Corporate Website',
      url: 'https://example.com',
      description: 'WordPress site with custom theme',
      tech_stack: ['WordPress', 'PHP', 'JavaScript'],
      is_featured: false,
      category: 'wordpress'
    }
  ]);

  const [educations] = useState<Education[]>([
    {
      id: 1,
      institution: 'University of Mumbai',
      degree: 'B.Tech Computer Science',
      location: 'Mumbai',
      date_range: '2016-2020'
    }
  ]);

  const [loading, setLoading] = useState(false);

  // Filter category
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Contact Form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState<boolean | null>(null);
  const [contactError, setContactError] = useState<string | null>(null);

  useEffect(() => {
    initDatabase();
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) {
      setContactError('Please fill out all fields.');
      return;
    }
    setContactSubmitting(true);
    setContactSuccess(null);
    setContactError(null);

    try {
      await saveContactMessage({
        name: contactName,
        email: contactEmail,
        message: contactMessage,
      });
      setContactSuccess(true);
      setContactName('');
      setContactEmail('');
      setContactMessage('');
    } catch (err: any) {
      setContactError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setContactSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-accent/20 border-t-accent animate-spin" />
        <span className="font-mono text-sm tracking-widest text-accent uppercase animate-pulse">
          Loading Portfolio...
        </span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="text-center p-6 border border-slate-900 rounded-xl max-w-md">
          <AlertCircle className="mx-auto text-accent mb-4" size={40} />
          <h2 className="text-xl font-bold text-white mb-2">No Active Profile</h2>
          <p className="text-sm">The database has not been initialized. Please seed the database or check backend connections.</p>
        </div>
      </div>
    );
  }

  // Filter projects by category
  const filteredProjects = projects.filter((proj) => {
    if (proj.is_featured) return false; // Render featured project separately
    if (filterCategory === 'all') return true;
    return proj.category.toLowerCase() === filterCategory.toLowerCase();
  });

  const featuredProject = projects.find((proj) => proj.is_featured);

  return (
    <Layout>
      {/* 1. HERO SECTION */}
      <section id="hero" className="min-h-[85vh] flex flex-col justify-center relative overflow-hidden py-10">
        <div className="max-w-4xl text-left">
          <motion.p
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-accent font-mono tracking-widest text-sm md:text-base mb-4 uppercase font-bold"
          >
            Welcome to my space
          </motion.p>
          
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-8xl font-black text-white tracking-tight mb-4 leading-none"
          >
            {profile.name}
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl sm:text-3xl font-bold text-slate-300 mb-6 flex flex-wrap gap-x-2"
          >
            <span>I am a</span>
            <Typewriter words={profile.taglines} />
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-slate-400 text-base sm:text-xl max-w-2xl leading-relaxed mb-10"
          >
            {profile.intro_text}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-4 items-center mb-12"
          >
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 rounded-lg bg-accent text-white font-semibold shadow-lg hover:bg-accent/80 transition-colors shadow-accent/15 cursor-pointer"
            >
              View Projects
            </a>
            
            {profile.resume_pdf_url && (
              <a
                href={profile.resume_pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-lg border border-slate-700 bg-slate-900/50 hover:bg-slate-800 text-slate-300 font-semibold transition-colors flex items-center gap-2"
              >
                <FileText size={18} />
                <span>Download Resume</span>
              </a>
            )}

            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 rounded-lg border border-accent/40 bg-accent/5 text-accent font-semibold hover:bg-accent/15 transition-all duration-300 hire-me-glow cursor-pointer"
            >
              Hire Me
            </a>
          </motion.div>

          {/* Social Row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex items-center gap-4 text-slate-400"
          >
            <a href={`mailto:${profile.email}`} className="p-2.5 rounded-full border border-slate-800 hover:border-accent hover:text-accent bg-slate-900/50 transition-all duration-200">
              <Mail size={20} />
            </a>
            <a href={`tel:${profile.phone}`} className="p-2.5 rounded-full border border-slate-800 hover:border-accent hover:text-accent bg-slate-900/50 transition-all duration-200">
              <Phone size={20} />
            </a>
            <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full border border-slate-800 hover:border-accent hover:text-accent bg-slate-900/50 transition-all duration-200">
              <Globe size={20} />
            </a>
            <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full border border-slate-800 hover:border-accent hover:text-accent bg-slate-900/50 transition-all duration-200">
              <GitBranch size={20} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* 2. ABOUT ME SECTION */}
      <section id="about" className="py-20 border-t border-slate-900 relative">
        <div className="flex flex-col md:flex-row gap-12 items-start">
          <div className="w-full md:w-3/5 text-left">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">About Me</h2>
            <p className="text-slate-400 text-base md:text-lg leading-relaxed mb-6 whitespace-pre-line">
              {profile.about_text}
            </p>
          </div>

          <div className="w-full md:w-2/5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/20 backdrop-blur-sm text-left">
              <MapPin className="text-accent mb-3" size={24} />
              <h4 className="text-slate-400 text-xs font-bold font-mono tracking-wider uppercase mb-1">Location</h4>
              <p className="text-sm font-semibold text-slate-100">{profile.location}</p>
            </div>
            
            <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/20 backdrop-blur-sm text-left">
              <Briefcase className="text-accent mb-3" size={24} />
              <h4 className="text-slate-400 text-xs font-bold font-mono tracking-wider uppercase mb-1">Experience</h4>
              <p className="text-sm font-semibold text-slate-100">{profile.experience_years}</p>
            </div>

            <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/20 backdrop-blur-sm text-left">
              <CheckCircle className="text-accent mb-3" size={24} />
              <h4 className="text-slate-400 text-xs font-bold font-mono tracking-wider uppercase mb-1">Projects Done</h4>
              <p className="text-sm font-semibold text-slate-100">{profile.projects_delivered}+ Completed</p>
            </div>

            <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/20 backdrop-blur-sm text-left">
              <GraduationCap className="text-accent mb-3" size={24} />
              <h4 className="text-slate-400 text-xs font-bold font-mono tracking-wider uppercase mb-1">Education</h4>
              <p className="text-sm font-semibold text-slate-100">{profile.education_summary}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SKILLS SECTION */}
      <section id="skills" className="py-20 border-t border-slate-900">
        <h2 className="text-3xl md:text-5xl font-black text-white text-left mb-12">Technical Skills</h2>
        <SkillSection skills={skills} />
      </section>

      {/* 4. EXPERIENCE TIMELINE */}
      <section id="experience" className="py-20 border-t border-slate-900 relative">
        <h2 className="text-3xl md:text-5xl font-black text-white text-left mb-16">Work History</h2>
        
        <div className="relative">
          {/* Vertical Center Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent to-slate-950/20 transform md:-translate-x-1/2" />
          
          {experiences.map((exp, idx) => (
            <TimelineItem
              key={exp.id}
              index={idx}
              title={exp.title}
              company={exp.company}
              location={exp.location}
              start_date={exp.start_date}
              end_date={exp.end_date}
              bullets={exp.bullets}
            />
          ))}
        </div>
      </section>

      {/* 5. PROJECTS SECTION */}
      <section id="projects" className="py-20 border-t border-slate-900">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="text-left">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-2">Projects</h2>
            <p className="text-slate-400 text-sm md:text-base">Browse live Shopify, WordPress, and Python sites and integrations.</p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 text-sm bg-slate-900/60 border border-slate-800 p-1.5 rounded-lg w-fit">
            {['all', 'shopify', 'wordpress', 'python'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-1.5 rounded-md font-medium tracking-wide uppercase text-xs transition-all cursor-pointer ${
                  filterCategory === cat
                    ? 'bg-accent text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Project */}
        {featuredProject && (
          <div className="mb-12">
            <ProjectCard
              name={featuredProject.name}
              description={featuredProject.description}
              url={featuredProject.url}
              techStack={featuredProject.tech_stack}
              thumbnailUrl={featuredProject.thumbnail_url}
              isFeatured={true}
              category={featuredProject.category}
            />
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => (
            <ProjectCard
              key={proj.id}
              name={proj.name}
              description={proj.description}
              url={proj.url}
              techStack={proj.tech_stack}
              thumbnailUrl={proj.thumbnail_url}
              category={proj.category}
            />
          ))}
        </div>
      </section>

      {/* 6. EDUCATION SECTION */}
      <section id="education" className="py-20 border-t border-slate-900">
        <h2 className="text-3xl md:text-5xl font-black text-white text-left mb-12">Education</h2>
        <div className="space-y-6">
          {educations.map((edu) => (
            <div
              key={edu.id}
              className="p-6 rounded-xl border border-slate-850 bg-slate-900/20 backdrop-blur-sm text-left max-w-3xl hover:border-accent/20 transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-xl font-bold text-slate-100">{edu.degree}</h3>
                  <p className="text-slate-400 text-sm font-medium mt-1">{edu.institution} • {edu.location}</p>
                </div>
                <span className="text-xs font-mono font-bold text-accent px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20 w-fit">
                  {edu.date_range}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. CONTACT SECTION */}
      <section id="contact" className="py-20 border-t border-slate-900 relative">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Left info column */}
          <div className="md:col-span-5 text-left flex flex-col justify-between">
            <div>
              <p className="text-accent font-mono text-sm font-bold tracking-widest uppercase mb-4">06 - Contact</p>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
                Let's build <span className="text-accent">something.</span>
              </h2>
              <p className="text-slate-400 text-base leading-relaxed mb-8">
                Have a Shopify project, Python system, or WordPress build in mind? Drop a message — I usually reply within 24 hours.
              </p>
            </div>
          </div>

          {/* Right form column */}
          <div className="md:col-span-7">
            <div className="p-6 md:p-8 rounded-2xl border border-slate-800 bg-slate-900/30 backdrop-blur-sm shadow-xl text-left">
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label htmlFor="contact-name" className="text-xs font-semibold text-slate-400 mb-2 font-mono uppercase tracking-wider">Name</label>
                    <input
                      type="text"
                      id="contact-name"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Your name"
                      className="px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                      required
                    />
                  </div>
                  
                  <div className="flex flex-col">
                    <label htmlFor="contact-email" className="text-xs font-semibold text-slate-400 mb-2 font-mono uppercase tracking-wider">Email</label>
                    <input
                      type="email"
                      id="contact-email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label htmlFor="contact-message" className="text-xs font-semibold text-slate-400 mb-2 font-mono uppercase tracking-wider">Message</label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Tell me about your project..."
                    className="px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors resize-none"
                    required
                  ></textarea>
                </div>

                {/* Message display */}
                {contactSuccess && (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/35 rounded-lg text-emerald-400 text-sm flex items-center gap-3">
                    <CheckCircle size={18} />
                    <span>Thank you! Your message has been sent successfully.</span>
                  </div>
                )}

                {contactError && (
                  <div className="p-4 bg-rose-500/10 border border-rose-500/35 rounded-lg text-rose-400 text-sm flex items-center gap-3">
                    <AlertCircle size={18} />
                    <span>{contactError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={contactSubmitting}
                  className="w-full sm:w-auto px-6 py-3 rounded-lg bg-accent text-white font-semibold flex items-center justify-center gap-2 hover:bg-accent/80 transition-colors shadow-lg hover:shadow-accent/25 disabled:opacity-50 cursor-pointer"
                >
                  {contactSubmitting ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};
export default Portfolio;
