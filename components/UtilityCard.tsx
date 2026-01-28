import React from 'react';
import { UtilityItem } from '../types';
import { ExternalLink, BrainCircuit, BarChart3, ChevronRight, Box } from 'lucide-react';
import { motion } from 'framer-motion';

interface UtilityCardProps {
  item: UtilityItem;
  index: number;
  direction?: 'left' | 'right'; // For mindmap layout
}

const UtilityCard: React.FC<UtilityCardProps> = ({ item, index, direction }) => {
  const isAI = item.type.toLowerCase() === 'ai';
  const isAnalytics = item.type.toLowerCase() === 'analytics';
  
  // Theme colors based on type
  const themeColor = isAI 
    ? 'indigo' 
    : isAnalytics 
      ? 'emerald' 
      : 'slate';

  return (
    <div className={`relative flex items-center ${direction === 'left' ? 'flex-row' : 'flex-row-reverse'} w-full max-w-md`}>
      
      {/* Connector Line (Desktop Mindmap Only) */}
      {direction && (
        <div className={`hidden lg:block absolute top-1/2 ${direction === 'left' ? '-right-12' : '-left-12'} w-12 h-px bg-gradient-to-r ${
           direction === 'left' 
             ? `from-${themeColor}-500/50 to-slate-800` 
             : `from-slate-800 to-${themeColor}-500/50`
        }`}>
          <div className={`absolute ${direction === 'left' ? 'right-0' : 'left-0'} top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-${themeColor}-500 shadow-[0_0_8px_rgba(var(--${themeColor}-500),0.8)]`} />
        </div>
      )}

      <motion.a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, x: direction === 'left' ? -20 : 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        className={`
          group relative flex-1 overflow-hidden rounded-xl border backdrop-blur-sm transition-all duration-300
          hover:shadow-2xl hover:scale-[1.02] z-10
          ${isAI 
            ? 'bg-indigo-950/30 border-indigo-500/30 hover:border-indigo-400 hover:shadow-indigo-500/20' 
            : isAnalytics
              ? 'bg-emerald-950/30 border-emerald-500/30 hover:border-emerald-400 hover:shadow-emerald-500/20'
              : 'bg-slate-900/50 border-slate-700 hover:border-slate-500'
          }
        `}
      >
        {/* Hover Gradient */}
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${
          isAI ? 'from-indigo-400 to-purple-400' : isAnalytics ? 'from-emerald-400 to-teal-400' : 'from-slate-400 to-white'
        }`} />

        <div className="relative p-5 flex flex-col h-full">
          <div className="flex justify-between items-start mb-3">
            <div className={`
              p-2 rounded-lg bg-opacity-20 backdrop-blur-md
              ${isAI ? 'bg-indigo-500 text-indigo-300' : isAnalytics ? 'bg-emerald-500 text-emerald-300' : 'bg-slate-700 text-slate-300'}
            `}>
              {isAI ? <BrainCircuit size={20} /> : isAnalytics ? <BarChart3 size={20} /> : <Box size={20} />}
            </div>
            
            <div className={`
              flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border
              ${isAI 
                ? 'border-indigo-500/30 text-indigo-300 bg-indigo-500/10' 
                : isAnalytics 
                  ? 'border-emerald-500/30 text-emerald-300 bg-emerald-500/10'
                  : 'border-slate-500/30 text-slate-400'
              }
            `}>
              {item.type}
            </div>
          </div>

          <h3 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300">
            {item.name}
          </h3>
          
          <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2 group-hover:line-clamp-none transition-all">
            {item.description}
          </p>

          <div className="mt-auto flex justify-end">
            <ExternalLink size={16} className={`opacity-50 group-hover:opacity-100 transition-opacity ${
              isAI ? 'text-indigo-400' : isAnalytics ? 'text-emerald-400' : 'text-slate-400'
            }`} />
          </div>
        </div>
      </motion.a>
    </div>
  );
};

export default UtilityCard;
