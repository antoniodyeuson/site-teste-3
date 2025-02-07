import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import api from '@/services/api';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'creator' | 'subscriber' | 'admin';
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<User | null>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await api.get('/auth/me');
        setUser(response.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
      }
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const protectedRoutes = ['/dashboard', '/subscriber-dashboard', '/admin/dashboard'];
    const publicRoutes = ['/', '/login', '/register', '/explore'];
    
    if (!loading) {
      const path = router.pathname;
      
      if (protectedRoutes.includes(path) && !user) {
        router.push('/login');
      }
      
      if (user && ['/login', '/register'].includes(path)) {
        const redirectPath = user.role === 'creator' 
          ? '/dashboard' 
          : user.role === 'admin'
          ? '/admin/dashboard'
          : '/subscriber-dashboard';
        router.push(redirectPath);
      }
    }
  }, [loading, user, router.pathname]);

  const login = async (credentials: { email: string; password: string }): Promise<User | null> => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, user } = response.data;
      
      if (token && user) {
        localStorage.setItem('token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(user);
        return user;
      }
      return null;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (data: any) => {
    const response = await api.post('/auth/register', data);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);
    
    if (user.role === 'creator') {
      router.push('/dashboard');
    } else if (user.role === 'admin') {
      router.push('/admin/dashboard');
    } else {
      router.push('/subscriber-dashboard');
    }
  };

  const logout = async () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    router.push('/');
  };

  const updateUser = async (data: Partial<User>) => {
    const response = await api.patch('/auth/profile', data);
    setUser(response.data);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 