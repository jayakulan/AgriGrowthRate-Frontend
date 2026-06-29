'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { authService } from '@/services/authService';
import { GoogleOAuthProvider } from '@react-oauth/google';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'farmer' | 'consumer' | 'admin';
  avatar?: string;
  phone?: string;
  address?: string;
  location?: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string, role?: 'farmer' | 'consumer', phone?: string, otp?: string, farmerCardNo?: string) => Promise<User>;
  loginWithGoogle: (credential?: string, accessToken?: string) => Promise<User>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  updateUser: (updatedUser: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const updateUser = useCallback((updatedFields: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const merged = { ...prev, ...updatedFields };
      localStorage.setItem('agri_user', JSON.stringify(merged));
      return merged;
    });
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      const savedUser = localStorage.getItem('agri_user');
      if (!savedUser || savedUser === 'undefined') {
        setLoading(false);
        return;
      }

      try {
        const response = await authService.getMe();
        if (response.success && response.data) {
          setUser(response.data);
          localStorage.setItem('agri_user', JSON.stringify(response.data));
        } else {
          localStorage.removeItem('agri_user');
          setUser(null);
        }
      } catch (error) {
        console.error('Session validation failed on startup:', error);
        localStorage.removeItem('agri_user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    const userObj = response.data;

    setUser(userObj);
    localStorage.setItem('agri_user', JSON.stringify(userObj));
    return userObj;
  };

  const register = async (name: string, email: string, password: string, role: 'farmer' | 'consumer' = 'consumer', phone?: string, otp?: string, farmerCardNo?: string) => {
    const response = await authService.register({ name, email, password, role, phone, otp, farmerCardNo });
    const userObj = response.data;

    setUser(userObj);
    localStorage.setItem('agri_user', JSON.stringify(userObj));
    return userObj;
  };

  const loginWithGoogle = async (credential?: string, accessToken?: string) => {
    const response = await authService.googleLogin({ credential, accessToken });
    const userObj = response.data;

    setUser(userObj);
    localStorage.setItem('agri_user', JSON.stringify(userObj));
    return userObj;
  };

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  // Inactivity timeout: 30 minutes
  useEffect(() => {
    if (!user) return;

    const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
    let lastWrite = 0;

    const updateActivity = () => {
      const now = Date.now();
      // Throttle updates to localStorage to once every 5 seconds
      if (now - lastWrite > 5000) {
        localStorage.setItem('agri_last_activity', now.toString());
        lastWrite = now;
      }
    };

    // Initialize activity timestamp on login/mount
    localStorage.setItem('agri_last_activity', Date.now().toString());

    // Event listeners for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach((event) => {
      window.addEventListener(event, updateActivity);
    });

    // Periodically check if the inactivity timeout has been exceeded
    const intervalId = setInterval(async () => {
      const lastActivityStr = localStorage.getItem('agri_last_activity');
      if (lastActivityStr) {
        const lastActivity = parseInt(lastActivityStr, 10);
        const elapsed = Date.now() - lastActivity;
        if (elapsed >= INACTIVITY_TIMEOUT) {
          clearInterval(intervalId);
          await logout();
          window.location.href = '/login?reason=timeout';
        }
      }
    }, 10000); // Check every 10 seconds

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, updateActivity);
      });
      clearInterval(intervalId);
    };
  }, [user, logout]);

  return (
    <GoogleOAuthProvider clientId="565853486536-3uokv8na3nvksjg9o393p5uhvn9jkfes.apps.googleusercontent.com">
      <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout, isAuthenticated: !!user, updateUser }}>
        {children}
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
