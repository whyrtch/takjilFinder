
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Mosque, MosqueStatus, User } from './types';

// Mock Data
const INITIAL_MOSQUES: Mosque[] = [
  {
    id: '1',
    name: 'Al-Hikmah Central Mosque',
    address: 'Jalan Sudirman No. 45, Jakarta Pusat',
    location: { lat: -6.2146, lng: 106.8451 },
    menu: ['Nasi Kebuli', 'Dates', 'Mineral Water'],
    status: MosqueStatus.VERIFIED,
    createdAt: Date.now(),
    image: 'https://picsum.photos/seed/mosque1/800/450'
  },
  {
    id: '2',
    name: 'Istiqlal Grand Mosque',
    address: 'Jl. Taman Wijaya Kusuma, Sawah Besar',
    location: { lat: -6.1702, lng: 106.8314 },
    menu: ['Mixed Rice', 'Fried Snacks', 'Hot Tea'],
    status: MosqueStatus.VERIFIED,
    createdAt: Date.now(),
    image: 'https://picsum.photos/seed/mosque2/800/450'
  },
  {
    id: '3',
    name: 'Al-Barakah Hall',
    address: 'Blok M Plaza 3rd Floor, South Jakarta',
    location: { lat: -6.2442, lng: 106.7979 },
    menu: ['Fruit Platter', 'Sweet Tea'],
    status: MosqueStatus.PENDING,
    createdAt: Date.now(),
    image: 'https://picsum.photos/seed/mosque3/800/450'
  }
];

interface AppContextType {
  mosques: Mosque[];
  user: User | null;
  loading: boolean;
  addMosque: (mosque: Omit<Mosque, 'id' | 'createdAt' | 'status'>) => void;
  updateMosqueStatus: (id: string, status: MosqueStatus) => void;
  login: (email: string) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading from Firestore
    const savedMosques = localStorage.getItem('tf_mosques');
    if (savedMosques) {
      setMosques(JSON.parse(savedMosques));
    } else {
      setMosques(INITIAL_MOSQUES);
    }
    
    const savedUser = localStorage.getItem('tf_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    localStorage.setItem('tf_mosques', JSON.stringify(mosques));
  }, [mosques]);

  const addMosque = useCallback((newMosque: Omit<Mosque, 'id' | 'createdAt' | 'status'>) => {
    const mosque: Mosque = {
      ...newMosque,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
      status: MosqueStatus.PENDING,
      image: `https://picsum.photos/seed/${Math.random()}/800/450`
    };
    setMosques(prev => [...prev, mosque]);
  }, []);

  const updateMosqueStatus = useCallback((id: string, status: MosqueStatus) => {
    setMosques(prev => prev.map(m => m.id === id ? { ...m, status } : m));
  }, []);

  const login = useCallback((email: string) => {
    const newUser: User = { uid: 'admin_1', email, role: 'admin' };
    setUser(newUser);
    localStorage.setItem('tf_user', JSON.stringify(newUser));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('tf_user');
  }, []);

  return (
    <AppContext.Provider value={{ mosques, user, loading, addMosque, updateMosqueStatus, login, logout }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
