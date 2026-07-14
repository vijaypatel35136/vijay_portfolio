import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';

interface TimelineItemProps {
  index: number;
  title: string;
  company: string;
  location: string;
  start_date: string;
  end_date: string;
  bullets: string[];
}

export const TimelineItem: React.FC<TimelineItemProps> = ({
  index,
  title,
  company,
  location,
  start_date,
  end_date,
  bullets,
}) => {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: 'easeOut' }}
      className={`relative flex flex-col md:flex-row w-full my-8 ${
        isEven ? 'md:flex-row-reverse' : ''
      }`}
    >
      {/* Node indicator */}
      <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 border-2 border-accent text-accent shadow-md z-10">
        <Briefcase size={14} />
      </div>

      {/* Content box */}
      <div className="w-full md:w-1/2 pl-12 md:pl-0 md:px-8">
        <div className="relative p-6 rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm shadow-lg hover:border-accent/30 transition-all duration-300">
          <span className="text-xs font-mono font-bold text-accent px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20">
            {start_date} – {end_date}
          </span>

          <h3 className="text-xl font-bold text-slate-100 mt-3">{title}</h3>
          <h4 className="text-sm font-semibold text-slate-300 mt-1">
            {company} • <span className="text-slate-400 font-normal">{location}</span>
          </h4>

          <ul className="mt-4 space-y-2 text-slate-400 text-sm list-none pl-0">
            {bullets.map((bullet, idx) => (
              <li key={idx} className="relative pl-5 before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-accent">
                {bullet}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Spacer for empty side of timeline in desktop */}
      <div className="hidden md:block w-1/2" />
    </motion.div>
  );
};
export default TimelineItem;
