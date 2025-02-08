import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { api } from '@/services/api';
import Cookies from 'js-cookie';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'creator' | 'subscriber';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = Cookies.get('token');
      if (token) {
        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await api.get('/auth/me');
          setUser(response.data);
        } catch (error) {
          Cookies.remove('token');
          delete api.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;

      // Salva o token apenas nos cookies
      Cookies.set('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);

      // Redireciona baseado no papel do usuário
      switch (user.role) {
        case 'admin':
          await router.push('/admin/dashboard');
          break;
        case 'creator':
          await router.push('/dashboard');
          break;
        case 'subscriber':
          await router.push('/subscriber-dashboard');
          break;
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao fazer login');
    }
  };

  const logout = async () => {
    Cookies.remove('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    await router.push('/');
  };

  const register = async (name: string, email: string, password: string, role: string) => {
    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
        role
      });

      const { token, user } = response.data;
      
      // Salvar token
      Cookies.set('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);

      // Redirecionar baseado no role
      if (user.role === 'creator') {
        router.push('/dashboard');
      } else if (user.role === 'subscriber') {
        router.push('/subscriber-dashboard');
      } else if (user.role === 'admin') {
        router.push('/admin/dashboard');
      }
    } catch (error: any) {
      console.error('Erro no registro:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 