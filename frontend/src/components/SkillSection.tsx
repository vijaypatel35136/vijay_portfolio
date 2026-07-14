import React from 'react';
import { motion } from 'framer-motion';

interface Skill {
  id: number;
  category: string;
  name: string;
}

interface SkillSectionProps {
  skills: Skill[];
}

export const SkillSection: React.FC<SkillSectionProps> = ({ skills }) => {
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { type: 'spring' as const, stiffness: 100, damping: 10 } },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {Object.entries(groupedSkills).map(([category, items], catIdx) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: catIdx * 0.1 }}
          className="p-6 rounded-xl border border-slate-800 bg-slate-900/30 backdrop-blur-sm shadow-md flex flex-col text-left"
        >
          <h3 className="text-lg font-bold text-slate-100 border-b border-slate-800 pb-3 mb-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent"></span>
            {category}
          </h3>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-wrap gap-2.5"
          >
            {items.map((skill) => (
              <motion.span
                key={skill.id}
                variants={itemVariants}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(14, 124, 123, 0.15)' }}
                className="text-sm font-medium px-3.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:text-accent hover:border-accent/40 cursor-default transition-colors duration-200"
              >
                {skill.name}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};
export default SkillSection;
