
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

const AppContent: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const { user } = useApp();
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) return <SplashScreen />;

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark max-w-md mx-auto relative overflow-hidden shadow-2xl">
      <main className="flex-1 overflow-y-auto hide-scrollbar pb-24">
        <Routes>
          <Route path="/" element={<HomeMap />} />
          <Route path="/list" element={<ListView />} />
          <Route path="/submit" element={<SubmitForm />} />
          <Route path="/admin" element={user ? <Navigate to="/admin/pending" /> : <AdminPortal />} />
          <Route path="/admin/pending" element={user ? <AdminPending /> : <Navigate to="/admin" />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>
      <BottomNav />
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
