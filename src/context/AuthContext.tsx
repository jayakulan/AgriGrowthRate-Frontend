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
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: 'farmer' | 'consumer', phone?: string, otp?: string) => Promise<void>;
  loginWithGoogle: (credential?: string, accessToken?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('agri_token');
    const savedUser = localStorage.getItem('agri_user');
    
    if (savedToken && savedToken !== 'undefined' && savedUser && savedUser !== 'undefined') {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('agri_token');
        localStorage.removeItem('agri_user');
      }
    } else if (savedToken === 'undefined' || savedUser === 'undefined') {
      localStorage.removeItem('agri_token');
      localStorage.removeItem('agri_user');
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    const userObj = response.data;
    const tokenStr = response.accessToken;

    setToken(tokenStr);
    setUser(userObj);
    localStorage.setItem('agri_token', tokenStr);
    localStorage.setItem('agri_user', JSON.stringify(userObj));
  };

  const register = async (name: string, email: string, password: string, role: 'farmer' | 'consumer' = 'consumer', phone?: string, otp?: string) => {
    const response = await authService.register({ name, email, password, role, phone, otp });
    const userObj = response.data;
    const tokenStr = response.accessToken;

    setToken(tokenStr);
    setUser(userObj);
    localStorage.setItem('agri_token', tokenStr);
    localStorage.setItem('agri_user', JSON.stringify(userObj));
  };

  const loginWithGoogle = async (credential?: string, accessToken?: string) => {
    const response = await authService.googleLogin({ credential, accessToken });
    const userObj = response.data;
    const tokenStr = response.accessToken;

    setToken(tokenStr);
    setUser(userObj);
    localStorage.setItem('agri_token', tokenStr);
    localStorage.setItem('agri_user', JSON.stringify(userObj));
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  return (
    <GoogleOAuthProvider clientId="565853486536-3uokv8na3nvksjg9o393p5uhvn9jkfes.apps.googleusercontent.com">
      <AuthContext.Provider value={{ user, token, loading, login, register, loginWithGoogle, logout, isAuthenticated: !!user }}>
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
