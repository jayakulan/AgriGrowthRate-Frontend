'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService } from '@/services/authService';
import { GoogleOAuthProvider } from '@react-oauth/google';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'farmer' | 'consumer' | 'admin';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string, role?: 'farmer' | 'consumer', phone?: string, otp?: string) => Promise<User>;
  loginWithGoogle: (credential?: string, accessToken?: string) => Promise<User>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const savedUser = localStorage.getItem('agri_user');
      
      if (savedUser && savedUser !== 'undefined') {
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
        }
      }
      setLoading(false);
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

  const register = async (name: string, email: string, password: string, role: 'farmer' | 'consumer' = 'consumer', phone?: string, otp?: string) => {
    const response = await authService.register({ name, email, password, role, phone, otp });
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

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <GoogleOAuthProvider clientId="565853486536-3uokv8na3nvksjg9o393p5uhvn9jkfes.apps.googleusercontent.com">
      <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout, isAuthenticated: !!user }}>
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
