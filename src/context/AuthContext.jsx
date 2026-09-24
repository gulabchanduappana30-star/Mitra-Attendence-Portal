import React, { createContext, useContext, useState, useEffect } from 'react';
import { dataService } from '@backend/services/dataService';
import { isFirebaseConfigured, auth } from '@backend/config/firebase';
import { signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Always require fresh login when opening the app/link
  useEffect(() => {
    localStorage.removeItem('mitra_active_user');
    setUser(null);
    setLoading(false);
  }, []);


  const login = async (identifier, password) => {
    setLoading(true);
    try {
      if (isFirebaseConfigured() && auth && identifier.includes('@')) {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, identifier, password);
          const dbUser = await dataService.getUserById(userCredential.user.uid);
          if (dbUser) {
            setUser(dbUser);
            localStorage.setItem('mitra_active_user', JSON.stringify(dbUser));
            setLoading(false);
            return { success: true, user: dbUser };
          }
        } catch (firebaseErr) {
          console.warn('Firebase auth failed, falling back to local authentication check', firebaseErr);
        }
      }

      // Local / Mock Authentication Check (supports Name, Student ID / USN, Email + Password)
      const matchedUser = await dataService.findUserByIdentifier(identifier);

      if (!matchedUser) {
        setLoading(false);
        return { success: false, message: 'No account found matching that Name, Student ID, or Email.' };
      }

      // Password verification (supports exact password or common admin aliases)
      const cleanPass = (password || '').trim();
      const isPasswordValid = 
        !matchedUser.password || 
        matchedUser.password === cleanPass ||
        (matchedUser.role === 'admin' && (
          cleanPass === 'mitra@1234' || 
          cleanPass === 'admin' || 
          cleanPass === 'mitra123' || 
          cleanPass.toLowerCase() === 'admin' ||
          cleanPass === 'mitra@123'
        ));

      if (!isPasswordValid) {
        setLoading(false);
        return { success: false, message: 'Invalid password. Please check your credentials.' };
      }

      setUser(matchedUser);
      localStorage.setItem('mitra_active_user', JSON.stringify(matchedUser));
      setLoading(false);
      return { success: true, user: matchedUser };
    } catch (err) {
      setLoading(false);
      return { success: false, message: err.message || 'Authentication error' };
    }
  };

  const logout = async () => {
    if (isFirebaseConfigured() && auth) {
      try {
        await firebaseSignOut(auth);
      } catch (e) { console.warn('Firebase signout error', e); }
    }
    setUser(null);
    localStorage.removeItem('mitra_active_user');
  };

  const switchPersona = async (userId) => {
    const persona = await dataService.getUserById(userId);
    if (persona) {
      setUser(persona);
      localStorage.setItem('mitra_active_user', JSON.stringify(persona));
      return persona;
    }
    return null;
  };

  const value = {
    user,
    loading,
    isAdmin: user?.role === 'admin',
    isStudent: user?.role === 'student',
    login,
    logout,
    switchPersona
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
