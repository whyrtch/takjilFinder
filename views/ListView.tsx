
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store';
import { MosqueStatus } from '../types';

const ListView: React.FC = () => {
  const navigate = useNavigate();
  const { mosques, loading } = useApp();
  const [filterVerified, setFilterVerified] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = mosques.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterVerified ? m.status === MosqueStatus.VERIFIED : true;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-slate-500 text-sm">Loading mosques...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-background-dark/80 ios-blur border-b border-slate-100 dark:border-white/5 px-4 pt-12 pb-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-primary text-3xl font-bold">mosque</span>
          <h1 className="text-xl font-bold tracking-tight">Mosque Explorer</h1>
        </div>
        
        <div className="flex gap-3">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name..." 
              className="w-full bg-slate-100 dark:bg-white/5 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button 
            onClick={() => setFilterVerified(!filterVerified)}
            className={`p-2.5 rounded-xl border transition-all ${filterVerified ? 'bg-primary border-primary text-white' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400'}`}
          >
            <span className="material-symbols-outlined text-xl">verified</span>
          </button>
        </div>
      </header>

      <main className="flex-1 p-4 space-y-4">
        {filtered.map((mosque) => (
          <div key={mosque.id} className="bg-white dark:bg-white/5 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-white/5">
            <div className="relative bg-slate-200">
              <div className="absolute top-2 right-2 px-2 py-1 bg-white/90 dark:bg-black/50 rounded-lg text-[10px] font-bold text-primary backdrop-blur-sm">
                1.2 km away
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-base leading-tight">{mosque.name}</h3>
                  {mosque.status === MosqueStatus.VERIFIED && (
                    <span className="material-symbols-outlined text-accent-gold text-lg fill-1">verified</span>
                  )}
                </div>
              </div>
              <p className="text-slate-400 text-xs mb-3 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">location_on</span>
                {mosque.address}
              </p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {mosque.menu.map(item => (
                  <span key={item} className="bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider">
                    {item}
                  </span>
                ))}
              </div>
              <button 
                onClick={() => navigate(`/mosque/${mosque.id}`)}
                className="w-full bg-primary/5 text-primary font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-primary/10 transition-colors"
              >
                View Details
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <span className="material-symbols-outlined text-6xl mb-4 opacity-20">
              {mosques.length === 0 ? 'mosque' : 'search_off'}
            </span>
            <p className="text-sm font-medium">
              {mosques.length === 0 ? 'No mosques yet' : 'No results found'}
            </p>
            {mosques.length === 0 && (
              <p className="text-xs mt-2 text-center max-w-xs">
                Be the first to add a mosque! Click the + button below to submit one.
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ListView;
