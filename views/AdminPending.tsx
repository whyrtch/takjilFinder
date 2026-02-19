
import React from 'react';
import { useApp } from '../store';
import { MosqueStatus } from '../types';

const AdminPending: React.FC = () => {
  const { mosques, updateMosqueStatus, logout } = useApp();
  
  const pending = mosques.filter(m => m.status === MosqueStatus.PENDING);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-background-dark/80 ios-blur border-b border-primary/10 px-4 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <span className="material-symbols-outlined text-primary text-2xl">admin_panel_settings</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Pending Review</h1>
              <p className="text-xs text-primary font-bold">{pending.length} submissions found</p>
            </div>
          </div>
          <button 
            onClick={async () => {
              try {
                await logout();
              } catch (error) {
                console.error('Logout error:', error);
              }
            }}
            className="size-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <span className="material-symbols-outlined">logout</span>
          </button>
        </div>
      </header>

      <main className="p-4 space-y-4">
        {pending.map((mosque) => (
          <div key={mosque.id} className="bg-white dark:bg-white/5 rounded-2xl overflow-hidden shadow-sm border border-primary/5">
            <div className="p-4 space-y-4">
              <div>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-lg leading-tight">{mosque.name}</h3>
                  <span className="px-2 py-1 rounded-lg bg-orange-100 text-orange-600 text-[10px] font-bold uppercase tracking-wider">Urgent</span>
                </div>
                <p className="text-slate-500 text-xs flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  {mosque.address}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Submitted Menu</p>
                <div className="flex flex-wrap gap-2">
                  {mosque.menu.map(item => (
                    <span key={item} className="px-3 py-1 bg-primary/5 text-primary rounded-lg text-xs font-bold border border-primary/10">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {mosque.notes && (
                <div className="bg-slate-50 dark:bg-white/5 p-3 rounded-xl border border-slate-100 dark:border-white/5 italic text-slate-500 text-xs leading-relaxed">
                  "{mosque.notes}"
                </div>
              )}

              <div className="pt-2 flex items-center justify-between border-t border-slate-50 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-xl">account_circle</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold">Community Contributor</p>
                    <p className="text-[10px] text-slate-400">Submitted 2 hours ago</p>
                  </div>
                </div>
                <button className="text-primary text-xs font-bold underline">View Details</button>
              </div>
            </div>

            <div className="grid grid-cols-2 p-3 gap-3 bg-primary/5 border-t border-primary/10">
              <button 
                onClick={() => updateMosqueStatus(mosque.id, MosqueStatus.REJECTED)}
                className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-red-500/20 text-red-500 font-bold text-sm bg-white hover:bg-red-50 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
                Reject
              </button>
              <button 
                onClick={() => updateMosqueStatus(mosque.id, MosqueStatus.VERIFIED)}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-md shadow-primary/20 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-lg">check_circle</span>
                Approve
              </button>
            </div>
          </div>
        ))}

        {pending.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-slate-400 text-center px-8">
            <span className="material-symbols-outlined text-6xl mb-4 text-primary opacity-20">inventory_2</span>
            <p className="text-sm font-bold mb-1">Queue Empty</p>
            <p className="text-xs opacity-60">All mosque submissions have been reviewed.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPending;
