
import React, { useState } from 'react';
import { useApp } from '../store';

const AdminPortal: React.FC = () => {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const adminEmail = import.meta.env.VITE_ADMIN_ACCOUNT;
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (email === adminEmail && password === adminPassword) {
      setLoading(true);
      try {
        await login(email);
        // Navigation will happen automatically via App.tsx when user state changes
      } catch (err) {
        setError('Failed to authenticate. Please try again.');
        console.error('Login error:', err);
      } finally {
        setLoading(false);
      }
    } else {
      setError('Invalid credentials.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-primary pt-16 pb-12 px-8 flex flex-col items-center text-center rounded-b-[40px] shadow-2xl">
        <div className="size-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-6 border border-white/30">
          <span className="material-symbols-outlined text-white text-4xl">admin_panel_settings</span>
        </div>
        <h1 className="text-white text-3xl font-extrabold mb-1 tracking-tight">Admin Portal</h1>
        <p className="text-white/70 text-sm font-medium">Management Dashboard Access</p>
      </div>

      <main className="px-6 -mt-10">
        <div className="bg-white dark:bg-background-dark rounded-3xl p-8 shadow-xl border border-primary/10">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 block px-1">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">mail</span>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={"email@email.com"}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 block px-1">Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">lock</span>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-500 text-xs font-bold rounded-xl flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">error</span>
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Authenticating...
                </>
              ) : (
                <>
                  Login as Admin
                  <span className="material-symbols-outlined text-xl">login</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-slate-100 dark:border-white/5 flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-2 opacity-30">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">Secure Access</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed max-w-[200px]">
              Authorized personnel only. All access attempts are logged and monitored for security.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPortal;
