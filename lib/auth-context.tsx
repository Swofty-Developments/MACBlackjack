'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { User } from './types';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateChips: (newChips: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  loading: true,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
  updateChips: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);

      if (firebaseUser && db) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data() as User);
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string) => {
    if (!auth || !db) throw new Error('Firebase not initialized');

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const newUser: User = {
      uid: userCredential.user.uid,
      email: userCredential.user.email!,
      chips: 500, // Starting chips
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(doc(db, 'users', userCredential.user.uid), newUser);
    setUser(newUser);
  };

  const signIn = async (email: string, password: string) => {
    if (!auth) throw new Error('Firebase not initialized');
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signOut = async () => {
    if (!auth) throw new Error('Firebase not initialized');
    await firebaseSignOut(auth);
    setUser(null);
    setFirebaseUser(null);
  };

  const updateChips = async (newChips: number) => {
    if (!user || !db) return;

    const updatedUser = {
      ...user,
      chips: newChips,
      updatedAt: new Date(),
    };

    await setDoc(doc(db, 'users', user.uid), updatedUser);
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, signUp, signIn, signOut, updateChips }}>
      {children}
    </AuthContext.Provider>
  );
}
