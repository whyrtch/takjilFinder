
import React, { useState } from 'react';

const AboutPage: React.FC = () => {
  const [showCopied, setShowCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href.replace(window.location.hash, '');
    
    try {
      if (navigator.share) {
        // Use native share if available
        await navigator.share({
          title: 'TakjilFinder',
          text: 'Find mosques offering free Iftar during Ramadan',
          url: url
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(url);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-background-dark/80 ios-blur border-b border-slate-100 dark:border-white/5 px-4 pt-12 pb-4">
        <h1 className="text-xl font-bold tracking-tight">About TakjilFinder</h1>
      </header>

      <main className="flex-1">
        <div className="relative w-full h-64 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/30 to-background-light dark:to-background-dark z-10"></div>
          <img 
            alt="Ramadan Night Scene" 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBy66SwA_qOlQkna6jbIbVos9fTU098Pd_HUhGOk-s2Cz6OxFEcAbeUry7B-gXJKHXfc8Q_WOvWzt4s2kEiz-nUBj-mkjJyPJAMC7hLoNANYjAacSQIq2gyux8KpAXoW6v-Djo4SwuzdQ1fydOuiPD4oxkNV5AAsmpS2KfNXx1tXgIFeIPwjtfrUU9SR573d5bdqvUrMM1zHxR47L8x5in3kJHFSviJSOVuqIz8IuwKZLDzEIctq1ZewAh_BhFpibJDZwVKK_LwhHc" 
          />
          <div className="absolute bottom-6 left-6 right-6 z-20">
            <h2 className="text-3xl font-extrabold text-primary mb-1">Connecting Hearts</h2>
            <p className="text-sm font-bold opacity-60 uppercase tracking-[0.2em]">Ramadan 1445 H</p>
          </div>
        </div>

        <div className="px-6 space-y-8 mt-6">
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined !fill-1">info</span>
              <h3 className="text-lg font-bold">What is TakjilFinder?</h3>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              TakjilFinder is a community-driven platform designed to help Muslims find local mosques and community centers offering free Iftar (Takjil) during the holy month of Ramadan. 
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              We believe that no one should break their fast alone. Our app maps out locations, schedules, and menus shared by users like you to foster the spirit of giving and togetherness.
            </p>
          </section>

          <section className="bg-white dark:bg-white/5 rounded-3xl p-6 shadow-sm border border-primary/10">
            <h3 className="text-lg font-bold text-primary mb-6">Our Mission</h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary">volunteer_activism</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm">Support Local Masjids</h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Helping mosques distribute their Iftar meals to those who need them most.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary">groups</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm">Community Driven</h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Empowering users to contribute new locations and real-time updates.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary">celebration</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm">Spirit of Ramadan</h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Spreading the joy of sharing and hospitality across the Ummah.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4 pb-12">
            <h3 className="text-lg font-bold">Connect With Us</h3>
            <div className="grid grid-cols-1 gap-3">
              <a 
                href="mailto:fandiakost@gmail.com?subject=TakjilFinder Support&body=Hello TakjilFinder Team,"
                className="flex items-center justify-between p-4 bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">mail</span>
                  <span className="text-sm font-semibold">Support Email</span>
                </div>
                <span className="material-symbols-outlined text-slate-300">chevron_right</span>
              </a>
              <a href="#" className="flex items-center justify-between p-4 bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">language</span>
                  <span className="text-sm font-semibold">Official Website</span>
                </div>
                <span className="material-symbols-outlined text-slate-300">chevron_right</span>
              </a>
            </div>

            <div className="flex justify-center gap-6 pt-6 relative">
              <button 
                onClick={handleShare}
                className="size-12 rounded-full bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20 active:scale-90 transition-transform"
              >
                <span className="material-symbols-outlined">share</span>
              </button>
              {showCopied && (
                <div className="absolute -top-12 bg-slate-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg">
                  Link copied!
                </div>
              )}
              <button className="size-12 rounded-full bg-[#1da1f2] flex items-center justify-center text-white shadow-lg shadow-blue-400/20 active:scale-90 transition-transform">
                <span className="material-symbols-outlined">public</span>
              </button>
            </div>

            <div className="pt-10 flex flex-col items-center opacity-40">
              <p className="text-[10px] font-bold uppercase tracking-widest text-center">
                Version 2.4.0 • Made with ❤️ for the Ummah
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AboutPage;
