import React, { useEffect, useState, useMemo } from 'react';
import Papa from 'papaparse';
import { UtilityItem, CsvRow, UtilityType } from './types';
import UtilityCard from './components/UtilityCard';
import { Search, Terminal, AlertCircle, Cpu, Network } from 'lucide-react';
import { motion } from 'framer-motion';

const App: React.FC = () => {
  const [items, setItems] = useState<UtilityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCSV = async () => {
      try {
        const response = await fetch('utilities.csv');
        if (!response.ok) {
           console.warn("Could not fetch utilities.csv, using internal fallback for demonstration.");
           throw new Error("Failed to fetch utilities.csv");
        }
        const csvText = await response.text();

        Papa.parse<CsvRow>(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const parsedItems: UtilityItem[] = results.data.map((row) => ({
              name: row.Name,
              description: row.Description,
              url: row.Url,
              type: (row.Type?.trim() as UtilityType) || 'Other',
            })).filter(item => item.name && item.url);

            setItems(parsedItems);
            setLoading(false);
          },
          error: (err: Error) => {
             setError(`Failed to parse CSV: ${err.message}`);
             setLoading(false);
          }
        });
      } catch (err: unknown) {
        // Fallback data
        const fallbackData = `Name,Description,Url,Type
GenAI Playground,Interactive sandbox for testing Gemini and other LLM prompts.,#,AI
Log Sentinel,Real-time distributed log aggregation dashboard.,#,Analytics
Vision Lab,Computer vision model training status.,#,AI
Traffic Pulse,Network latency monitoring for microservices.,#,Analytics
Model Registry,Central repository for ML model versioning and deployment.,#,AI
User Cohorts,Behavioral analytics and user segmentation.,#,Analytics
Code Weaver,AI-assisted code generation tool.,#,AI
Metric Scout,Custom metric exploration dashboard.,#,Analytics`;
        
        Papa.parse<CsvRow>(fallbackData, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                 const parsedItems: UtilityItem[] = results.data.map((row) => ({
                    name: row.Name,
                    description: row.Description,
                    url: row.Url,
                    type: (row.Type?.trim() as UtilityType) || 'Other',
                  })).filter(item => item.name);
                  setItems(parsedItems);
                  setError(null);
                  setLoading(false);
            }
        });
      }
    };

    fetchCSV();
  }, []);

  const filteredItems = useMemo(() => {
    const lowerSearch = search.toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(lowerSearch) ||
        item.description.toLowerCase().includes(lowerSearch)
    );
  }, [items, search]);

  const aiItems = filteredItems.filter(i => i.type.toLowerCase() === 'ai');
  const analyticsItems = filteredItems.filter(i => i.type.toLowerCase() === 'analytics');
  const otherItems = filteredItems.filter(i => 
    i.type.toLowerCase() !== 'ai' && i.type.toLowerCase() !== 'analytics'
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans overflow-x-hidden selection:bg-indigo-500/30">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
         <div className="absolute top-[-10%] left-[20%] w-[50%] h-[50%] bg-indigo-900/10 rounded-full blur-[120px] opacity-40 animate-pulse" />
         <div className="absolute bottom-[-10%] right-[20%] w-[50%] h-[50%] bg-emerald-900/10 rounded-full blur-[120px] opacity-40 animate-pulse" style={{ animationDelay: '2s' }} />
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 w-full max-w-[1800px] mx-auto px-4 lg:px-8 py-8 flex flex-col min-h-screen">
        
        {/* Top Header */}
        <header className="flex flex-col items-center justify-center mb-12 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-400 mb-6 backdrop-blur-md">
            <Terminal size={12} />
            <span>ENGINEERING PORTAL v2.0</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-center tracking-tight mb-8">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-200">AI</span>
            <span className="mx-4 text-slate-700 font-light">&</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">Analytics</span>
          </h1>

          {/* Search Bar */}
          <div className="w-full max-w-lg relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
            </div>
            <input
              type="text"
              placeholder="Filter nodes..."
              className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-800 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-white placeholder-slate-600 backdrop-blur-md transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        {/* Mind Map Layout */}
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center">
             <div className="relative">
                <div className="w-16 h-16 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-indigo-500">
                  <Cpu size={24} />
                </div>
             </div>
             <p className="mt-4 text-slate-500 font-mono text-sm animate-pulse">Initializing Neural Map...</p>
          </div>
        ) : error ? (
           <div className="flex-1 flex flex-col items-center justify-center text-red-400">
            <AlertCircle size={48} className="mb-4" />
            <p className="text-lg font-medium">{error}</p>
          </div>
        ) : filteredItems.length === 0 ? (
           <div className="text-center py-20 opacity-50">
             <p className="text-slate-500 text-lg">No nodes found matching signal "{search}"</p>
           </div>
        ) : (
          <div className="flex-1 flex flex-col lg:flex-row relative">
            
            {/* 1. Left Branch: AI */}
            <div className="flex-1 flex flex-col gap-6 items-center lg:items-end lg:pr-12 py-8 order-2 lg:order-1">
              <div className="lg:hidden text-indigo-400 font-bold mb-2 flex items-center gap-2">
                <Cpu size={16} /> AI Intelligence
              </div>
              {aiItems.map((item, idx) => (
                <UtilityCard 
                  key={`ai-${idx}`} 
                  item={item} 
                  index={idx} 
                  direction="left" 
                />
              ))}
              {aiItems.length === 0 && <div className="text-slate-600 italic py-4">No AI modules active</div>}
            </div>

            {/* 2. Central Spine (Desktop Only) */}
            <div className="hidden lg:flex flex-col items-center justify-start w-24 relative order-2">
               {/* The Vertical Line */}
               <div className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-slate-700 to-transparent"></div>
               
               {/* The Central Hub Node */}
               <div className="sticky top-10 z-20 flex flex-col items-center">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="w-16 h-16 rounded-full bg-slate-900 border border-slate-700 shadow-[0_0_30px_rgba(99,102,241,0.15)] flex items-center justify-center relative z-20"
                  >
                    <Network className="text-slate-300" size={32} />
                    {/* Pulsing effects */}
                    <div className="absolute inset-0 rounded-full border border-indigo-500/30 animate-ping opacity-20" />
                  </motion.div>
                  <div className="mt-4 px-3 py-1 rounded bg-slate-900/80 border border-slate-800 text-[10px] text-slate-500 font-mono tracking-widest backdrop-blur uppercase">
                    Core
                  </div>
               </div>
            </div>

            {/* 3. Right Branch: Analytics */}
            <div className="flex-1 flex flex-col gap-6 items-center lg:items-start lg:pl-12 py-8 order-3 lg:order-3">
              <div className="lg:hidden text-emerald-400 font-bold mb-2 mt-8 flex items-center gap-2">
                <Network size={16} /> Analytics & Obs
              </div>
              {analyticsItems.map((item, idx) => (
                <UtilityCard 
                  key={`analytics-${idx}`} 
                  item={item} 
                  index={idx} 
                  direction="right" 
                />
              ))}
               {analyticsItems.length === 0 && <div className="text-slate-600 italic py-4">No Analytics modules active</div>}
            </div>
            
          </div>
        )}

        {/* Other Items Section (Bottom Center) */}
        {otherItems.length > 0 && !loading && (
          <div className="mt-12 flex flex-col items-center border-t border-slate-800/50 pt-12">
            <h3 className="text-slate-500 text-sm font-mono uppercase tracking-widest mb-6">Additional Resources</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
              {otherItems.map((item, idx) => (
                <UtilityCard 
                   key={`other-${idx}`} 
                   item={item} 
                   index={idx}
                   // No direction prop implies standard card
                />
              ))}
            </div>
          </div>
        )}

        <footer className="mt-auto pt-16 pb-6 text-center text-slate-700 text-xs font-mono">
          <p>ENGINEERING UTILITY HUB • {new Date().getFullYear()} • INTERNAL USE ONLY</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
