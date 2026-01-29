import React from 'react';
import { UtilityItem } from '../types';
import { ExternalLink, BrainCircuit, BarChart3, Box } from 'lucide-react';
import { motion } from 'framer-motion';

interface UtilityCardProps {
  item: UtilityItem;
  index: number;
}

const UtilityCard: React.FC<UtilityCardProps> = ({ item, index }) => {
  const isAI = item.type.toLowerCase() === 'ai';
  const isAnalytics = item.type.toLowerCase() === 'analytics';
  
  // High contrast light mode styles
  const getThemeStyles = () => {
    if (isAI) {
      return {
        card: 'bg-violet-50/50 border-violet-200 hover:border-violet-500 hover:bg-violet-50 shadow-[0_2px_10px_rgba(139,92,246,0.08)] hover:shadow-[0_12px_40px_rgba(139,92,246,0.12)]',
        iconBg: 'bg-violet-600 text-white',
        badge: 'border-violet-200 text-violet-700 bg-violet-100',
        titleColor: 'text-violet-950',
        descColor: 'text-violet-800/70',
        accentColor: 'text-violet-500',
      };
    } else if (isAnalytics) {
      return {
        card: 'bg-teal-50/50 border-teal-200 hover:border-teal-500 hover:bg-teal-50 shadow-[0_2px_10px_rgba(20,184,166,0.08)] hover:shadow-[0_12px_40px_rgba(20,184,166,0.12)]',
        iconBg: 'bg-teal-600 text-white',
        badge: 'border-teal-200 text-teal-700 bg-teal-100',
        titleColor: 'text-teal-950',
        descColor: 'text-teal-800/70',
        accentColor: 'text-teal-500',
      };
    } else {
      return {
        card: 'bg-slate-100/50 border-slate-300 hover:border-slate-500 shadow-sm hover:shadow-xl',
        iconBg: 'bg-slate-700 text-white',
        badge: 'border-slate-300 text-slate-700 bg-slate-200',
        titleColor: 'text-slate-950',
        descColor: 'text-slate-600',
        accentColor: 'text-slate-400',
      };
    }
  };

  const styles = getThemeStyles();
  
  return (
    <div className="relative flex w-full">
      <motion.a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className={`
          group relative flex-1 overflow-hidden rounded-2xl border-2 transition-all duration-300 ease-out
          ${styles.card}
        `}
      >
        <div className="relative p-6 flex flex-col h-full z-10">
          <div className="flex justify-between items-start mb-5">
            <div className={`
              p-3 rounded-xl transition-transform duration-300 group-hover:scale-105
              ${styles.iconBg}
            `}>
              {isAI ? <BrainCircuit size={24} /> : isAnalytics ? <BarChart3 size={24} /> : <Box size={24} />}
            </div>
            
            <div className={`
              flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border
              ${styles.badge}
            `}>
              {item.type}
            </div>
          </div>

          <h3 className={`text-xl font-black mb-2 tracking-tight transition-colors ${styles.titleColor}`}>
            {item.name}
          </h3>
          
          <p className={`text-sm leading-relaxed mb-6 font-medium line-clamp-2 transition-colors ${styles.descColor}`}>
            {item.description}
          </p>

          <div className="mt-auto flex justify-between items-center pt-4 border-t border-black/5">
            <span className={`text-[10px] font-black uppercase tracking-widest transition-opacity group-hover:opacity-100 opacity-60 ${styles.titleColor}`}>
              Open Protocol
            </span>
            <div className={`p-1.5 rounded-full transition-colors group-hover:bg-white`}>
              <ExternalLink size={18} className={`transition-all duration-300 ${styles.accentColor} group-hover:translate-x-0.5 group-hover:-translate-y-0.5`} />
            </div>
          </div>
        </div>
      </motion.a>
    </div>
  );
};

export default UtilityCard;