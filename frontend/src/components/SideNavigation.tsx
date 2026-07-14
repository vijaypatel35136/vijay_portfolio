import React, { useState, useEffect } from 'react';

export const SideNavigation: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('hero');

  const sections = [
    { id: 'hero', label: '01' },
    { id: 'about', label: '02' },
    { id: 'skills', label: '03' },
    { id: 'experience', label: '04' },
    { id: 'projects', label: '05' },
    { id: 'contact', label: '06' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 300;
      
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed right-6 md:right-12 top-1/2 transform -translate-y-1/2 z-40 hidden md:flex flex-col gap-3">
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => scrollToSection(section.id)}
          className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
            activeSection === section.id
              ? 'bg-accent scale-125 shadow-lg shadow-accent/50'
              : 'bg-slate-700 hover:bg-slate-500'
          }`}
          aria-label={`Scroll to ${section.label}`}
        />
      ))}
    </div>
  );
};

export default SideNavigation;
