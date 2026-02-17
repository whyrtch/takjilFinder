
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../store';

const BottomNav: React.FC = () => {
  const { user } = useApp();
  const location = useLocation();
  
  const navItems = [
    { label: 'Home', icon: 'home', path: '/' },
    { label: 'List', icon: 'format_list_bulleted', path: '/list' },
    { label: 'Submit', icon: 'add_location', path: '/submit', primary: true },
    { label: user ? 'Admin' : 'Login', icon: 'admin_panel_settings', path: user ? '/admin/pending' : '/admin', badge: user ? true : false },
    { label: 'About', icon: 'info', path: '/about' },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/95 dark:bg-background-dark/95 ios-blur border-t border-slate-100 dark:border-white/5 px-4 pb-8 pt-2 z-50 shadow-[0_-4px_24px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex flex-col items-center gap-1 transition-all duration-300 w-full relative
              ${isActive ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}
            `}
          >
            {item.primary ? (
              <div className="bg-primary text-white p-3 rounded-full -mt-10 shadow-lg shadow-primary/30 border-4 border-white dark:border-background-dark active:scale-90 transition-transform">
                <span className="material-symbols-outlined text-2xl">add</span>
              </div>
            ) : (
              <span className={`material-symbols-outlined text-2xl ${location.pathname === item.path ? 'fill-1' : ''}`}>
                {item.icon}
              </span>
            )}
            <span className={`text-[10px] font-bold uppercase tracking-wider ${item.primary ? 'mt-1' : ''}`}>
              {item.label}
            </span>
            {item.badge && (
              <div className="absolute top-0 right-1/4 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></div>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
