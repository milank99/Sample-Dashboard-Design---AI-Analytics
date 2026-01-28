import React from 'react';
import { UtilityItem } from '../types';
import UtilityCard from './UtilityCard';
import { Sparkles, Activity } from 'lucide-react';

interface CategorySectionProps {
  title: string;
  items: UtilityItem[];
  type: 'AI' | 'Analytics';
  variant?: 'split' | 'full';
  className?: string;
}

const CategorySection: React.FC<CategorySectionProps> = ({ 
  title, 
  items, 
  type, 
  variant = 'split',
  className = '' 
}) => {
  if (items.length === 0) return null;

  const isAI = type === 'AI';

  // Grid configuration based on layout variant
  // split: Optimized for side-by-side columns (1 col on lg, 2 cols on xl)
  // full: Optimized for full-width sections (3 cols on lg, 4 cols on xl)
  const gridClass = variant === 'split'
    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2'
    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="flex items-center gap-3 mb-6 px-2">
        <div className={`p-2 rounded-lg ${isAI ? 'bg-indigo-500/10' : 'bg-emerald-500/10'}`}>
          {isAI ? (
            <Sparkles className="text-indigo-400" size={24} />
          ) : (
            <Activity className="text-emerald-400" size={24} />
          )}
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          {title}
        </h2>
        <div className="h-px flex-grow bg-gradient-to-r from-slate-800 to-transparent ml-4 opacity-50" />
        <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">
          {items.length}
        </span>
      </div>

      <div className={`grid gap-4 ${gridClass}`}>
        {items.map((item, idx) => (
          <UtilityCard key={`${item.name}-${idx}`} item={item} index={idx} />
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
