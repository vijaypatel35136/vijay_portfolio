import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('theme') as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Experience', href: '#experience' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleLinkClick = (href: string) => {
    setIsOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-950/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50 py-3 shadow-lg'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-2xl font-bold tracking-tight text-white dark:text-white"
        >
          Vijay<span className="text-accent">.</span>
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(link.href);
                  }}
                  className="text-sm font-medium text-slate-300 hover:text-accent transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="h-4 w-px bg-slate-800"></div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-slate-800 hover:border-accent/40 text-slate-400 hover:text-accent transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* CTA */}
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('#contact');
            }}
            className="px-5 py-2 rounded-lg border border-accent/40 bg-accent/10 hover:bg-accent hover:text-white text-accent font-semibold text-sm transition-all duration-300 hire-me-glow"
          >
            Hire Me
          </a>
        </div>

        {/* Mobile Nav Toggle */}
        <div className="flex md:hidden items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-slate-800 text-slate-400 hover:text-accent cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg border border-slate-800 text-slate-400 hover:text-accent cursor-pointer"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 top-[60px] bg-slate-950/95 z-40 flex flex-col items-center justify-center p-6 transition-all duration-300">
          <ul className="flex flex-col gap-8 text-center mb-12">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(link.href);
                  }}
                  className="text-2xl font-semibold text-slate-300 hover:text-accent transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('#contact');
            }}
            className="w-full text-center px-8 py-3 rounded-lg border border-accent/40 bg-accent/10 text-accent font-semibold transition-all hover:bg-accent hover:text-white"
          >
            Hire Me
          </a>
        </div>
      )}
    </nav>
  );
};
export default Navbar;
