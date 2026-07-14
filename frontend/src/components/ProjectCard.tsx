import React, { useRef, useState } from 'react';
import { ExternalLink } from 'lucide-react';

interface ProjectCardProps {
  name: string;
  description: string;
  url?: string;
  techStack: string[];
  thumbnailUrl?: string;
  isFeatured?: boolean;
  category: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  name,
  description,
  url,
  techStack,
  thumbnailUrl,
  isFeatured = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Calculate relative mouse position from card center (-width/2 to +width/2)
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    
    // Convert to rotation angles (max 8 degrees for stability)
    const rotateX = (mouseY / (height / 2)) * -8;
    const rotateY = (mouseX / (width / 2)) * 8;
    
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const cardStyle = {
    transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(${isHovered ? 1.02 : 1}, ${isHovered ? 1.02 : 1}, 1)`,
    transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
  };

  // Image placeholder if no thumbnail uploaded
  const displayImage = thumbnailUrl || `https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop`;

  if (isFeatured) {
    return (
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={cardStyle}
        className="w-full relative overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-br from-primary/10 to-accent/5 backdrop-blur-md shadow-xl transition-all duration-300 p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-center cursor-default z-10"
      >
        <div className="absolute top-0 right-0 bg-accent text-white text-xs font-bold font-mono tracking-widest uppercase px-4 py-1.5 rounded-bl-xl shadow-md">
          Featured Project
        </div>
        
        <div className="w-full md:w-1/2 overflow-hidden rounded-xl border border-white/5 relative group/img shadow-lg">
          <img
            src={displayImage}
            alt={name}
            className="w-full h-64 object-cover object-center group-hover/img:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/60 to-transparent opacity-60"></div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col items-start text-left">
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-100 mb-3 hover:text-accent transition-colors">
            {name}
          </h3>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6">
            {description}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {techStack.map((tag) => (
              <span key={tag} className="text-xs font-mono font-medium px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent-light text-teal-400">
                {tag}
              </span>
            ))}
          </div>

          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-white font-medium hover:bg-accent/80 transition-colors shadow-lg hover:shadow-accent/25"
            >
              <span>Visit Live Website</span>
              <ExternalLink size={16} />
            </a>
          )}
        </div>
      </div>
    );
  }

  // Standard Project Card
  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={cardStyle}
      className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 hover:border-accent/40 backdrop-blur-sm transition-all duration-300 flex flex-col h-full cursor-default group"
    >
      <div className="overflow-hidden h-48 relative border-b border-slate-800">
        <img
          src={displayImage}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors duration-300"></div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow text-left">
        <h3 className="text-xl font-bold text-slate-100 mb-2 group-hover:text-accent transition-colors">
          {name}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-5 flex-grow">
          {description}
        </p>
        
        <div className="flex flex-wrap gap-1.5 mb-5">
          {techStack.map((tag) => (
            <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300">
              {tag}
            </span>
          ))}
        </div>

        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-teal-400 transition-colors mt-auto"
          >
            <span>Live Site</span>
            <ExternalLink size={14} />
          </a>
        )}
      </div>
    </div>
  );
};
export default ProjectCard;
