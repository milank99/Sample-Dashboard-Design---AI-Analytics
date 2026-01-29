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
GenAI Playground,Interactive sandbox for testing Gemini and other LLM prompts with temperature controls.,https://ai.internal.corp/playground,AI
Log Sentinel,Real-time distributed log aggregation and anomaly detection dashboard.,https://analytics.internal.corp/logs,Analytics
Vision Lab,Computer vision model training status and dataset visualization tools.,https://ai.internal.corp/vision,AI
Traffic Pulse,Network latency and throughput monitoring for microservices.,https://analytics.internal.corp/traffic,Analytics
Model Registry,Central repository for ML model versioning and deployment artifacts.,https://ai.internal.corp/registry,AI
User Cohorts,Behavioral analytics and user segmentation visualization platform.,https://analytics.internal.corp/cohorts,Analytics
Code Weaver,AI-assisted code generation and refactoring tool for internal libraries.,https://ai.internal.corp/weaver,AI
Metric Scout,Custom metric exploration and dashboard creation tool.,https://analytics.internal.corp/scout,Analytics`;
        
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
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans overflow-x-hidden selection:bg-indigo-200">
      
      {/* Light Theme Enhanced Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
         <div className="absolute top-[-5%] left-[5%] w-[50%] h-[50%] bg-indigo-200/50 rounded-full blur-[120px] opacity-40 animate-pulse" />
         <div className="absolute bottom-[-5%] right-[5%] w-[50%] h-[50%] bg-teal-200/50 rounded-full blur-[120px] opacity-40 animate-pulse" style={{ animationDelay: '3s' }} />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-20"></div>
      </div>

      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 lg:px-8 py-10 flex flex-col min-h-screen">
        
        {/* Top Header */}
        <header className="flex flex-col items-center justify-center mb-12 pt-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-600 border border-indigo-500 shadow-lg shadow-indigo-200 text-xs font-mono text-white mb-8">
            <Terminal size={12} />
            <span className="tracking-widest font-bold">ENGINEERING CORE v2.5</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-center tracking-tighter mb-10 text-slate-900 leading-none">
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-700 to-indigo-500">AI</span>
            <span className="mx-4 text-slate-300 font-light">&</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-teal-700 to-teal-500">Analytics</span>
          </h1>

          {/* Search Bar */}
          <div className="w-full max-w-xl relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
            </div>
            <input
              type="text"
              placeholder="Query utilities, protocols, or nodes..."
              className="w-full pl-14 pr-6 py-4 bg-white border-2 border-slate-100 rounded-2xl shadow-xl shadow-slate-200/50 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 text-slate-800 placeholder-slate-400 transition-all font-medium text-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        {/* 2-Column Layout */}
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center">
             <div className="relative">
                <div className="w-20 h-20 border-t-4 border-b-4 border-indigo-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-indigo-600">
                  <Cpu size={32} />
                </div>
             </div>
             <p className="mt-6 text-slate-500 font-mono text-xs font-bold uppercase tracking-widest animate-pulse">Establishing Node Connection...</p>
          </div>
        ) : error ? (
           <div className="flex-1 flex flex-col items-center justify-center text-red-500">
            <AlertCircle size={64} className="mb-4 opacity-20" />
            <p className="text-xl font-black tracking-tight uppercase">{error}</p>
          </div>
        ) : filteredItems.length === 0 ? (
           <div className="text-center py-20 bg-white/40 rounded-3xl border-2 border-dashed border-slate-200">
             <Search size={48} className="mx-auto text-slate-300 mb-4" />
             <p className="text-slate-500 text-lg font-bold">No endpoints found matching "{search}"</p>
             <button onClick={() => setSearch('')} className="mt-4 text-indigo-600 font-bold hover:underline">Clear current filters</button>
           </div>
        ) : (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start pb-20">
            
            {/* Left Column: AI */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 mb-2 pb-4 border-b-2 border-indigo-100">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-700">
                   <Cpu size={24} />
                </div>
                <h2 className="text-2xl font-black text-indigo-900 tracking-tight">AI Subsystems</h2>
                <div className="ml-auto px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold border border-indigo-100">
                  {aiItems.length} Nodes
                </div>
              </div>
              
              {aiItems.map((item, idx) => (
                <UtilityCard 
                  key={`ai-${idx}`} 
                  item={item} 
                  index={idx} 
                />
              ))}
              {aiItems.length === 0 && <div className="text-slate-400 italic py-4 font-medium">No active AI modules detected</div>}
            </div>

            {/* Right Column: Analytics */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 mb-2 pb-4 border-b-2 border-teal-100">
                <div className="p-2 bg-teal-100 rounded-lg text-teal-700">
                   <Network size={24} />
                </div>
                <h2 className="text-2xl font-black text-teal-900 tracking-tight">Analytics & Ops</h2>
                <div className="ml-auto px-3 py-1 bg-teal-50 text-teal-600 rounded-full text-xs font-bold border border-teal-100">
                  {analyticsItems.length} Nodes
                </div>
              </div>

              {analyticsItems.map((item, idx) => (
                <UtilityCard 
                  key={`analytics-${idx}`} 
                  item={item} 
                  index={idx} 
                />
              ))}
               {analyticsItems.length === 0 && <div className="text-slate-400 italic py-4 font-medium">No observation nodes detected</div>}
            </div>
            
          </div>
        )}

        {/* Other Items Section */}
        {otherItems.length > 0 && !loading && (
          <div className="flex flex-col items-center border-t-2 border-slate-200 pt-16">
            <h3 className="text-slate-900 text-sm font-black uppercase tracking-[0.2em] mb-12 bg-slate-200 px-6 py-2 rounded-full">Auxiliary Resources</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl px-4">
              {otherItems.map((item, idx) => (
                <UtilityCard 
                   key={`other-${idx}`} 
                   item={item} 
                   index={idx}
                />
              ))}
            </div>
          </div>
        )}

        <footer className="mt-auto pt-16 pb-10 text-center flex flex-col items-center">
          <div className="h-1 w-20 bg-slate-200 rounded-full mb-6"></div>
          <p className="text-slate-400 text-[10px] font-mono font-bold tracking-[0.3em] uppercase">
            EST. 2024 • ENGR_PORTAL_SYSTEM • ENCRYPTED_CHANNEL_42
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;