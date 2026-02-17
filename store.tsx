
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Mosque, MosqueStatus, User } from './types';
import { db, auth } from './firebase';
import { collection, addDoc, onSnapshot, query, updateDoc, doc } from 'firebase/firestore';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';

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
    // Sign in anonymously
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (error) {
        console.error('Error signing in anonymously:', error);
      }
    };

    initAuth();

    // Listen to auth state changes
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Check if admin user exists in localStorage
        const savedUser = localStorage.getItem('tf_user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    // Subscribe to Firestore mosques collection only after auth is ready
    if (!auth.currentUser) {
      console.log('Waiting for authentication...');
      return;
    }

    console.log('Auth ready, subscribing to Firestore...');
    const q = query(collection(db, 'mosques'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log(`Received ${snapshot.size} mosques from Firestore`);
      const mosquesData: Mosque[] = [];
      snapshot.forEach((doc) => {
        mosquesData.push({ id: doc.id, ...doc.data() } as Mosque);
      });
      setMosques(mosquesData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching mosques:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth.currentUser]);

  const addMosque = useCallback(async (newMosque: Omit<Mosque, 'id' | 'createdAt' | 'status'>) => {
    try {
      const mosque = {
        ...newMosque,
        createdAt: Date.now(),
        status: MosqueStatus.PENDING,
        image: `https://picsum.photos/seed/${Math.random()}/800/450`
      };
      await addDoc(collection(db, 'mosques'), mosque);
    } catch (error) {
      console.error('Error adding mosque:', error);
      throw error;
    }
  }, []);

  const updateMosqueStatus = useCallback(async (id: string, status: MosqueStatus) => {
    try {
      const mosqueRef = doc(db, 'mosques', id);
      await updateDoc(mosqueRef, { status });
    } catch (error) {
      console.error('Error updating mosque status:', error);
      throw error;
    }
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
