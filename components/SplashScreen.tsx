
import React, { useState, useEffect } from 'react';

const SplashScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev < 100 ? prev + 1 : 100));
    }, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-background-light flex flex-col items-center justify-between geometric-pattern p-8 z-[9999]">
      <div className="h-12 w-full"></div>
      
      <div className="flex flex-col items-center justify-center flex-grow text-center animate-in fade-in duration-1000">
        <div className="relative mb-8 flex items-center justify-center">
          <div className="text-[120px] text-primary">
            <span className="material-symbols-outlined !text-[120px]" style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}>
              brightness_3
            </span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center pt-2 pl-4">
            <span className="material-symbols-outlined text-accent-gold !text-[48px]" style={{ fontVariationSettings: "'FILL' 1, 'wght' 500" }}>
              temple_buddhist
            </span>
          </div>
        </div>
        
        <h1 className="text-[#111815] text-[42px] font-extrabold tracking-tight leading-none mb-2">
          TakjilFinder
        </h1>
        <p className="text-primary font-medium tracking-widest uppercase text-xs">
          Find Iftar Near You
        </p>
      </div>

      <div className="w-full max-w-xs flex flex-col items-center gap-6 pb-12">
        <div className="w-full flex flex-col gap-2">
          <div className="flex justify-between items-end px-1">
            <span className="text-[#111815]/40 text-[10px] font-bold uppercase tracking-widest">Initializing</span>
            <span className="text-[#111815]/60 text-xs font-semibold">{progress}%</span>
          </div>
          <div className="h-1.5 w-full bg-primary/10 rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-300 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-[#111815]/30">
          <span className="material-symbols-outlined !text-sm">group</span>
          <span className="text-[10px] font-semibold tracking-wider uppercase">Community Driven</span>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
