
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store';

const SubmitForm: React.FC = () => {
  const navigate = useNavigate();
  const { addMosque } = useApp();
  
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [menu, setMenu] = useState(['']);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAddMenuItem = () => setMenu([...menu, '']);
  const handleRemoveMenuItem = (index: number) => setMenu(menu.filter((_, i) => i !== index));
  const handleMenuChange = (index: number, val: string) => {
    const newMenu = [...menu];
    newMenu[index] = val;
    setMenu(newMenu);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address) return;
    
    setIsSubmitting(true);
    // Simulate API delay
    setTimeout(() => {
      addMosque({
        name,
        address,
        location: { lat: -6.2 + Math.random() * 0.1, lng: 106.8 + Math.random() * 0.1 },
        menu: menu.filter(m => m.trim() !== ''),
        notes
      });
      setIsSubmitting(false);
      setSuccess(true);
    }, 1500);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-screen px-8 text-center geometric-pattern">
        <div className="size-24 rounded-full bg-primary/10 flex items-center justify-center mb-6 animate-bounce">
          <span className="material-symbols-outlined text-primary text-5xl">check_circle</span>
        </div>
        <h2 className="text-2xl font-bold mb-2">Submission Successful!</h2>
        <p className="text-slate-500 text-sm mb-8">
          Thank you for contributing! Your submission is currently being reviewed by our team.
        </p>
        <button 
          onClick={() => navigate('/')}
          className="w-full max-w-xs bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-background-dark/80 ios-blur border-b border-slate-100 dark:border-white/5 px-4 pt-12 pb-4">
        <h1 className="text-xl font-bold tracking-tight">Submit New Mosque</h1>
        <p className="text-xs text-slate-400 mt-1">Help the community find iftar by sharing details.</p>
      </header>

      <main className="p-4 flex-1">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-white/5 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-white/5 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold block">Mosque Name</label>
              <input 
                required
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Al-Markaz Al-Islami"
                className="w-full bg-slate-100 dark:bg-white/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold block">Location Picker</label>
              <div className="relative h-32 rounded-xl bg-slate-100 dark:bg-white/10 overflow-hidden group cursor-pointer border border-dashed border-slate-300 dark:border-white/20">
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-3xl mb-1">my_location</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Tap to Pin on Map</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold block">Street Address</label>
              <textarea 
                required
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter full address details..."
                className="w-full bg-slate-100 dark:bg-white/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 resize-none"
              ></textarea>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold block">Takjil / Menu Items</label>
                <button 
                  type="button"
                  onClick={handleAddMenuItem}
                  className="bg-primary/10 text-primary p-1 rounded-lg"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                </button>
              </div>
              <div className="space-y-2">
                {menu.map((item, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input 
                      type="text" 
                      value={item}
                      onChange={(e) => handleMenuChange(idx, e.target.value)}
                      placeholder="e.g., Dates, Mineral Water"
                      className="flex-1 bg-slate-100 dark:bg-white/5 border-none rounded-xl py-2 px-4 text-sm focus:ring-2 focus:ring-primary/20"
                    />
                    {menu.length > 1 && (
                      <button 
                        type="button"
                        onClick={() => handleRemoveMenuItem(idx)}
                        className="text-slate-400"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold block">Notes (Optional)</label>
              <input 
                type="text" 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Specific info (e.g., every Friday only)"
                className="w-full bg-slate-100 dark:bg-white/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="pt-2">
            <button 
              disabled={isSubmitting}
              type="submit"
              className={`w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'shadow-primary/20'}`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Mosque'}
              {!isSubmitting && <span className="material-symbols-outlined text-xl">send</span>}
            </button>
            
            <div className="mt-6 flex flex-col items-center gap-2 px-4 opacity-50">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">shield</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">Submission Pending Review</span>
              </div>
              <p className="text-[10px] text-center leading-relaxed">
                To maintain data quality, all new submissions are verified by the TakjilFinder team before appearing on the map.
              </p>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default SubmitForm;
