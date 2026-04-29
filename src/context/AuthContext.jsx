import { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { demoUsers } from '@/data/mockData';

const AuthContext = createContext(null);

const STORAGE_KEY = 'rop_auth';

function loadStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadStored());

  const login = useCallback((role, credentials) => {
    const demo = demoUsers[role];
    if (!demo) return false;
    const next = {
      role,
      userId: demo.id,
      displayName: credentials?.username || demo.label.split('(')[0].trim(),
      email: credentials?.email || `${role}@society.rop.local`,
      remember: Boolean(credentials?.remember),
      profileComplete: false,
    };
    setUser(next);
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    if (next.remember) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } else {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
    return true;
  }, []);

  const updateProfile = useCallback((profileData) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        ...profileData,
        profileComplete: true,
      };
      const storage = prev.remember ? localStorage : sessionStorage;
      storage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
      updateProfile,
    }),
    [user, login, logout, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
