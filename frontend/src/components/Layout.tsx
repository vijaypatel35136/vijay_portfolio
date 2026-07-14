import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import SideNavigation from './SideNavigation';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden selection:bg-accent selection:text-white">
      {/* Ambient decorative glowing blobs */}
      <div className="glow-blob top-[10%] left-[-15%] opacity-80" />
      <div className="glow-blob top-[45%] right-[-15%] opacity-60" />
      <div className="glow-blob bottom-[5%] left-[10%] opacity-70" />

      <Navbar />
      <SideNavigation />
      
      <main className="relative pt-24 max-w-7xl mx-auto px-6 md:px-12 z-10">
        {children}
      </main>

      <Footer />
    </div>
  );
};
export default Layout;
