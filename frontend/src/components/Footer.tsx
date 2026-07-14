import React, { useState, useEffect } from 'react';
import { ArrowUp, Terminal } from 'lucide-react';

export const Footer: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="relative border-t border-slate-900 bg-slate-950/40 py-12 px-6 md:px-12 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <span className="text-lg font-bold text-white">
            Vijay Bhesaniya<span className="text-accent">.</span>
          </span>
          <span className="text-xs text-slate-500 mt-1">
            Shopify Liquid & Python Developer
          </span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
          <a href="#about" className="hover:text-accent transition-colors">About</a>
          <a href="#skills" className="hover:text-accent transition-colors">Skills</a>
          <a href="#experience" className="hover:text-accent transition-colors">Experience</a>
          <a href="#projects" className="hover:text-accent transition-colors">Projects</a>
          <a href="#contact" className="hover:text-accent transition-colors">Contact</a>
        </div>

        {/* Admin Login & Copyright */}
        <div className="flex flex-col items-center md:items-end text-center md:text-right text-xs text-slate-600 gap-2">
          <span>&copy; {new Date().getFullYear()} Vijay Bhesaniya. All rights reserved.</span>
          <a
            href="/admin"
            className="flex items-center gap-1 hover:text-accent/50 text-[10px] uppercase tracking-wider transition-colors border border-slate-900 rounded px-1.5 py-0.5"
          >
            <Terminal size={10} />
            <span>Admin Console</span>
          </a>
        </div>
      </div>

      {/* Floating Scroll To Top Button */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-accent text-white shadow-lg hover:bg-accent/80 transition-all duration-300 transform hover:-translate-y-1 z-40 cursor-pointer"
          aria-label="Back to top"
        >
          <ArrowUp size={18} />
        </button>
      )}
    </footer>
  );
};
export default Footer;
