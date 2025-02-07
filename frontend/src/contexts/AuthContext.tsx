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
  login: (email: string, password: string) => Promise<void>;
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

  useEffect(() => {
    if (!loading) {
      const publicRoutes = ['/', '/login', '/register', '/explore'];
      const isPublicRoute = publicRoutes.includes(router.pathname);

      if (!user && !isPublicRoute) {
        router.push('/login');
        return;
      }

      if (user && router.pathname === '/login') {
        if (user.role === 'admin') {
          router.push('/admin/dashboard');
        } else if (user.role === 'creator') {
          router.push('/dashboard');
        } else {
          router.push('/subscriber-dashboard');
        }
      }
    }
  }, [loading, user, router.pathname]);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await api.get('/auth/me');
        setUser(response.data);
      }
    } catch (error) {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setUser(user);

      // Aguardar a atualização do estado antes de redirecionar
      await new Promise(resolve => setTimeout(resolve, 100));

      // Redirecionar baseado no papel do usuário
      if (user.role === 'admin') {
        await router.push('/admin/dashboard');
      } else if (user.role === 'creator') {
        await router.push('/dashboard');
      } else {
        await router.push('/subscriber-dashboard');
      }
    } catch (error) {
      console.error('Erro no login:', error);
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
    await router.push('/');
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