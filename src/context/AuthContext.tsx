import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { DEFAULT_NOTIFICATION_PREFS } from '../data/mockData';
import {
  NotificationPrefs,
  StoredUserRecord,
  ThemePreference,
  UserProfile,
} from '../types';
import { readStorage, removeStorage, STORAGE_KEYS, writeStorage } from '../utils/storage';

interface AuthContextValue {
  user: UserProfile | null;
  isAuthenticated: boolean;
  theme: ThemePreference;
  notificationPrefs: NotificationPrefs;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  loginAsDemo: () => void;
  register: (fullName: string, email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  updateProfileName: (fullName: string) => void;
  updateTheme: (theme: ThemePreference) => void;
  updateNotificationPrefs: (prefs: NotificationPrefs) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'WV';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

const DEMO_USER: UserProfile = {
  id: 'user-demo-1',
  fullName: 'Alex Mercer',
  email: 'alex.mercer@warrantyvault.demo',
  avatarInitials: 'AM',
  createdAt: '2026-01-15T10:00:00.000Z',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() =>
    readStorage<UserProfile | null>(STORAGE_KEYS.USER, null)
  );

  const [theme, setTheme] = useState<ThemePreference>(() =>
    readStorage<ThemePreference>(STORAGE_KEYS.THEME, 'light')
  );

  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPrefs>(() =>
    readStorage<NotificationPrefs>(STORAGE_KEYS.NOTIFICATION_PREFS, DEFAULT_NOTIFICATION_PREFS)
  );

  useEffect(() => {
    const root = document.documentElement;
    const applyTheme = (mode: ThemePreference) => {
      if (mode === 'dark') {
        root.classList.add('dark');
      } else if (mode === 'light') {
        root.classList.remove('dark');
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.toggle('dark', prefersDark);
      }
    };
    applyTheme(theme);

    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => applyTheme('system');
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, [theme]);

  const login = useCallback((email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return { ok: false, error: 'Please enter a valid email address.' };
    }
    if (!password || password.length < 6) {
      return { ok: false, error: 'Password must be at least 6 characters.' };
    }

    const registeredUsers = readStorage<StoredUserRecord[]>(STORAGE_KEYS.REGISTERED_USERS, []);
    const matched = registeredUsers.find((u) => u.email.toLowerCase() === normalizedEmail);

    if (matched && matched.password !== password) {
      return { ok: false, error: 'Incorrect password for this account.' };
    }

    const displayName = matched
      ? matched.fullName
      : normalizedEmail
          .split('@')[0]
          .replace(/[._-]+/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase());

    const profile: UserProfile = {
      id: matched?.id ?? `user-${Date.now()}`,
      fullName: displayName,
      email: normalizedEmail,
      avatarInitials: getInitials(displayName),
      createdAt: matched?.createdAt ?? new Date().toISOString(),
    };

    setUser(profile);
    writeStorage(STORAGE_KEYS.USER, profile);
    return { ok: true };
  }, []);

  const loginAsDemo = useCallback(() => {
    setUser(DEMO_USER);
    writeStorage(STORAGE_KEYS.USER, DEMO_USER);
  }, []);

  const register = useCallback((fullName: string, email: string, password: string) => {
    const cleanName = fullName.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (cleanName.length < 2) {
      return { ok: false, error: 'Full name must be at least 2 characters.' };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return { ok: false, error: 'Please enter a valid email address.' };
    }
    if (password.length < 6) {
      return { ok: false, error: 'Password must be at least 6 characters.' };
    }

    const existing = readStorage<StoredUserRecord[]>(STORAGE_KEYS.REGISTERED_USERS, []);
    if (existing.some((u) => u.email.toLowerCase() === normalizedEmail)) {
      return { ok: false, error: 'An account with this email already exists. Please sign in.' };
    }

    const newRecord: StoredUserRecord = {
      id: `user-${Date.now()}`,
      fullName: cleanName,
      email: normalizedEmail,
      password,
      createdAt: new Date().toISOString(),
    };

    writeStorage(STORAGE_KEYS.REGISTERED_USERS, [...existing, newRecord]);

    const profile: UserProfile = {
      id: newRecord.id,
      fullName: cleanName,
      email: normalizedEmail,
      avatarInitials: getInitials(cleanName),
      createdAt: newRecord.createdAt,
    };

    setUser(profile);
    writeStorage(STORAGE_KEYS.USER, profile);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    removeStorage(STORAGE_KEYS.USER);
  }, []);

  const updateProfileName = useCallback((fullName: string) => {
    const clean = fullName.trim();
    if (!clean) return;
    setUser((prev) => {
      if (!prev) return prev;
      const updated: UserProfile = {
        ...prev,
        fullName: clean,
        avatarInitials: getInitials(clean),
      };
      writeStorage(STORAGE_KEYS.USER, updated);
      return updated;
    });
  }, []);

  const updateTheme = useCallback((nextTheme: ThemePreference) => {
    setTheme(nextTheme);
    writeStorage(STORAGE_KEYS.THEME, nextTheme);
  }, []);

  const updateNotificationPrefs = useCallback((prefs: NotificationPrefs) => {
    setNotificationPrefs(prefs);
    writeStorage(STORAGE_KEYS.NOTIFICATION_PREFS, prefs);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        theme,
        notificationPrefs,
        login,
        loginAsDemo,
        register,
        logout,
        updateProfileName,
        updateTheme,
        updateNotificationPrefs,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
