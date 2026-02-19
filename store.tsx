
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Mosque, MosqueStatus, User } from './types';
import { db, auth } from './firebase';
import { collection, addDoc, onSnapshot, query, updateDoc, doc } from 'firebase/firestore';
import { signInAnonymously, signOut } from 'firebase/auth';

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
  rateMosque: (mosqueId: string, isThumbsUp: boolean) => Promise<void>;
  getUserRating: (mosqueId: string) => 'up' | 'down' | null;
  login: (email: string) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    console.log('Firebase config check:', {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? 'Set' : 'Missing',
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'Missing'
    });

    // Since Firestore rules allow public read, we can skip authentication
    // Just check if admin user exists in localStorage
    const savedUser = localStorage.getItem('tf_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    // Set auth as ready immediately since we don't need it for reading
    setAuthReady(true);
    console.log('Auth not required for public read access');
  }, []);

  useEffect(() => {
    // Subscribe to Firestore mosques collection
    // No authentication required since rules allow public read
    if (!authReady) {
      console.log('Waiting for initialization...');
      return;
    }

    console.log('Subscribing to Firestore...');
    
    // Set a timeout to stop loading if Firestore doesn't respond
    const timeoutId = setTimeout(() => {
      console.error('Firestore connection timeout');
      setLoading(false);
    }, 3000);

    const q = query(collection(db, 'mosques'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      clearTimeout(timeoutId);
      console.log(`Received ${snapshot.size} mosques from Firestore`);
      const mosquesData: Mosque[] = [];
      snapshot.forEach((doc) => {
        mosquesData.push({ id: doc.id, ...doc.data() } as Mosque);
      });
      setMosques(mosquesData);
      setLoading(false);
    }, (error) => {
      clearTimeout(timeoutId);
      console.error('Error fetching mosques:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      setLoading(false);
    });

    return () => {
      clearTimeout(timeoutId);
      unsubscribe();
    };
  }, [authReady]);

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

  const login = useCallback(async (email: string) => {
    try {
      // Sign in anonymously to Firebase when admin logs in
      console.log('Admin login: signing in anonymously to Firebase...');
      await signInAnonymously(auth);
      console.log('Anonymous authentication successful for admin');
      
      const newUser: User = { uid: 'admin_1', email, role: 'admin' };
      setUser(newUser);
      localStorage.setItem('tf_user', JSON.stringify(newUser));
    } catch (error) {
      console.error('Error during admin login:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      // Sign out from Firebase when admin logs out
      console.log('Admin logout: signing out from Firebase...');
      await signOut(auth);
      console.log('Firebase sign out successful');
      
      setUser(null);
      localStorage.removeItem('tf_user');
    } catch (error) {
      console.error('Error during admin logout:', error);
      // Still clear local state even if Firebase signout fails
      setUser(null);
      localStorage.removeItem('tf_user');
    }
  }, []);

  // Rating functions
  const rateMosque = useCallback(async (mosqueId: string, isThumbsUp: boolean) => {
    try {
      const deviceId = getDeviceId();
      const ratingKey = `rating_${mosqueId}`;
      const existingRating = localStorage.getItem(ratingKey);

      // Check if user already rated
      if (existingRating) {
        console.log('User already rated this mosque');
        return;
      }

      // Update mosque rating count
      const mosqueRef = doc(db, 'mosques', mosqueId);
      const mosque = mosques.find(m => m.id === mosqueId);
      
      if (mosque) {
        const currentThumbsUp = mosque.thumbsUp || 0;
        const currentThumbsDown = mosque.thumbsDown || 0;
        
        await updateDoc(mosqueRef, {
          thumbsUp: isThumbsUp ? currentThumbsUp + 1 : currentThumbsUp,
          thumbsDown: !isThumbsUp ? currentThumbsDown + 1 : currentThumbsDown
        });

        // Store rating in localStorage
        localStorage.setItem(ratingKey, isThumbsUp ? 'up' : 'down');
      }
    } catch (error) {
      console.error('Error rating mosque:', error);
      throw error;
    }
  }, [mosques]);

  const getUserRating = useCallback((mosqueId: string): 'up' | 'down' | null => {
    const ratingKey = `rating_${mosqueId}`;
    const rating = localStorage.getItem(ratingKey);
    return rating as 'up' | 'down' | null;
  }, []);

  // Helper function to get device ID
  const getDeviceId = () => {
    let deviceId = localStorage.getItem('device_id');
    if (!deviceId) {
      deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('device_id', deviceId);
    }
    return deviceId;
  };

  return (
    <AppContext.Provider value={{ mosques, user, loading, addMosque, updateMosqueStatus, rateMosque, getUserRating, login, logout }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
