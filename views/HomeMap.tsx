
import React, { useState } from 'react';
import { useApp } from '../store';
import { Mosque, MosqueStatus } from '../types';

const HomeMap: React.FC = () => {
  const { mosques } = useApp();
  const [selectedMosque, setSelectedMosque] = useState<Mosque | null>(null);

  const verifiedMosques = mosques.filter(m => m.status === MosqueStatus.VERIFIED);

  return (
    <div className="relative h-screen w-full bg-slate-200 overflow-hidden">
      {/* Mock Map Background */}
      <div className="absolute inset-0 bg-[#f9f5ed]">
        <div className="absolute inset-0 opacity-10 geometric-pattern"></div>
        {/* Mock Map Grid Lines */}
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#0f9f59 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        {/* Mock Markers */}
        {verifiedMosques.map(mosque => (
          <button
            key={mosque.id}
            onClick={() => setSelectedMosque(mosque)}
            className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform active:scale-90"
            style={{ 
              top: `${50 + (mosque.location.lat + 6.2) * 500}%`, 
              left: `${50 + (mosque.location.lng - 106.8) * 500}%` 
            }}
          >
            <div className="relative flex items-center justify-center">
              <div className="absolute animate-ping bg-primary/20 rounded-full w-12 h-12"></div>
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white
                ${selectedMosque?.id === mosque.id ? 'bg-accent-gold' : 'bg-primary'}
              `}>
                <span className="material-symbols-outlined text-white text-xl fill-1">mosque</span>
              </div>
              <div className="absolute -bottom-1 w-2 h-2 bg-white rotate-45 transform"></div>
            </div>
          </button>
        ))}
      </div>

      {/* Top Search Bar Overlay */}
      <div className="absolute top-6 left-0 right-0 px-4 z-20">
        <div className="flex gap-3">
          <div className="flex-1 bg-white dark:bg-background-dark shadow-xl rounded-2xl flex items-center px-4 py-3 border border-slate-100 dark:border-white/10">
            <span className="material-symbols-outlined text-slate-400 mr-2">search</span>
            <input 
              type="text" 
              placeholder="Find nearby mosques..." 
              className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm"
            />
          </div>
          <button className="bg-white dark:bg-background-dark p-3 rounded-2xl shadow-xl border border-slate-100 dark:border-white/10 text-primary">
            <span className="material-symbols-outlined">tune</span>
          </button>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="absolute right-4 bottom-32 flex flex-col gap-3 z-10">
        <button className="bg-white p-3 rounded-xl shadow-lg text-slate-600">
          <span className="material-symbols-outlined">add</span>
        </button>
        <button className="bg-white p-3 rounded-xl shadow-lg text-slate-600">
          <span className="material-symbols-outlined">remove</span>
        </button>
        <button className="bg-primary text-white p-3 rounded-xl shadow-lg">
          <span className="material-symbols-outlined">my_location</span>
        </button>
      </div>

      {/* Bottom Sheet Card */}
      {selectedMosque && (
        <div className="absolute bottom-24 left-0 right-0 px-4 z-40 animate-in slide-in-from-bottom duration-300">
          <div className="bg-white dark:bg-background-dark rounded-3xl p-5 shadow-2xl border border-primary/10 relative overflow-hidden">
             {/* Handle for visual aesthetic */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-slate-200 dark:bg-white/10 rounded-full"></div>
            
            <button 
              onClick={() => setSelectedMosque(null)}
              className="absolute top-4 right-4 text-slate-300 hover:text-slate-500"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="flex items-start gap-3 mt-2">
              <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary text-3xl">mosque</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold leading-tight">{selectedMosque.name}</h3>
                  <span className="material-symbols-outlined text-accent-gold text-lg fill-1">verified</span>
                </div>
                <p className="text-slate-500 text-xs flex items-center gap-1 mb-3">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  {selectedMosque.address}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedMosque.menu.map(item => (
                    <span key={item} className="px-2 py-1 bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-wider rounded-md border border-primary/10">
                      {item}
                    </span>
                  ))}
                </div>
                <button className="w-full bg-primary text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all">
                  <span className="material-symbols-outlined">directions</span>
                  Get Directions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeMap;
