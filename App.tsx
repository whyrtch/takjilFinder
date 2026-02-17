
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './store';
import BottomNav from './components/BottomNav';
import SplashScreen from './components/SplashScreen';
import HomeMap from './views/HomeMap';
import ListView from './views/ListView';
import SubmitForm from './views/SubmitForm';
import AdminPortal from './views/AdminPortal';
import AdminPending from './views/AdminPending';
import AboutPage from './views/AboutPage';
import MosqueDetail from './views/MosqueDetail';

const AppContent: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const { user } = useApp();
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) return <SplashScreen />;

  const hideBottomNav = location.pathname.startsWith('/mosque/');

  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark max-w-md mx-auto relative shadow-2xl">
      <main className="flex-1 overflow-y-auto hide-scrollbar">
        <Routes>
          <Route path="/" element={<HomeMap />} />
          <Route path="/list" element={<ListView />} />
          <Route path="/mosque/:id" element={<MosqueDetail />} />
          <Route path="/submit" element={<SubmitForm />} />
          <Route path="/admin" element={user ? <Navigate to="/admin/pending" /> : <AdminPortal />} />
          <Route path="/admin/pending" element={user ? <AdminPending /> : <Navigate to="/admin" />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>
      {!hideBottomNav && <BottomNav />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </HashRouter>
  );
};

export default App;
