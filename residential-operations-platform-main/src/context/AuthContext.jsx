/**
 * Authentication context.
 *
 * Wraps the app with login / logout / updateProfile. login() POSTs to
 * /api/auth/login and stashes the resulting user (role, userId, displayName,
 * email, phone) in local- or session-storage based on "remember me".
 */
import { createContext, useContext, useMemo, useState, useCallback } from 'react';
import api from '@/lib/api';

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

  const login = useCallback(async (role, credentials) => {
    const res = await api.post('/auth/login', {
      role,
      email: credentials?.email || credentials?.username || '',
      password: credentials?.password || '',
    });
    const data = res.data;
    const next = {
      role: data.role,
      userId: data.userId,
      displayName: data.displayName,
      email: data.email,
      phone: data.phone || '',
      remember: Boolean(credentials?.remember),
      profileComplete: true,
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
