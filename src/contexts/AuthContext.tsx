import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authAPI } from '../services/api';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'parent' | 'specialist' | 'admin';
  avatar_url?: string;
  children?: Child[];
}

interface Child {
  id: number;
  first_name: string;
  last_name: string;
  birth_date: string;
  avatar_url?: string;
  diagnosis?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  currentChild: Child | null;
  setCurrentChild: (child: Child | null) => void;
}

interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role?: string;
  phone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentChild, setCurrentChild] = useState<Child | null>(null);

  // Проверяем токен при загрузке
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const response = await authAPI.me();
      setUser(response.data.user);
      // Устанавливаем первого ребенка как текущего
      if (response.data.user.children?.length > 0) {
        setCurrentChild(response.data.user.children[0]);
      }
    } catch (error: any) {
      localStorage.removeItem('token');
      setUser(null);
      // При 401 принудительно перенаправляем на логин
      if (error.response?.status === 401) {
        window.location.href = '/login';
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<User> => {
    const response = await authAPI.login(email, password);
    const { user, token } = response.data;
    
    localStorage.setItem('token', token);
    setUser(user);
    
    if (user.children?.length > 0) {
      setCurrentChild(user.children[0]);
    }
    
    return user;
  };

  const register = async (data: RegisterData) => {
    const response = await authAPI.register(data);
    const { user, token } = response.data;
    
    localStorage.setItem('token', token);
    setUser(user);
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setCurrentChild(null);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    currentChild,
    setCurrentChild,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
