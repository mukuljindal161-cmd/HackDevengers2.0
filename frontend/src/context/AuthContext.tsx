import React, { createContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import type { User } from '../services/api';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    api.getMe()
      .then(currentUser => {
        if (isMounted) setUser(currentUser);
      })
      .catch(() => {
        // Fallback check for local demo user session
        const savedOfflineUser = localStorage.getItem('realitygraph_offline_user');
        if (savedOfflineUser && isMounted) {
          try {
            setUser(JSON.parse(savedOfflineUser));
          } catch {
            setUser(null);
          }
        } else if (isMounted) {
          setUser(null);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.login({ email, password });
      api.setToken(res.access_token);
      localStorage.setItem('realitygraph_offline_user', JSON.stringify(res.user));
      setUser(res.user);
    } catch (err: any) {
      if (err.message?.includes('NETWORK_ERROR') || err.message?.includes('fetch') || err.message?.includes('Network')) {
        console.warn('Backend server offline/unreachable. Activating local demo session.');
        const fallbackUser: User = {
          id: 'demo-user-1',
          email: email || 'alex.morgan@campus.edu',
          name: 'Alex Morgan',
          created_at: new Date().toISOString(),
        };
        api.setToken('demo-mock-jwt-token');
        localStorage.setItem('realitygraph_offline_user', JSON.stringify(fallbackUser));
        setUser(fallbackUser);
        return;
      }
      throw err;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const res = await api.register({ email, password, name });
      api.setToken(res.access_token);
      localStorage.setItem('realitygraph_offline_user', JSON.stringify(res.user));
      setUser(res.user);
    } catch (err: any) {
      if (err.message?.includes('NETWORK_ERROR') || err.message?.includes('fetch') || err.message?.includes('Network')) {
        console.warn('Backend server offline/unreachable. Activating local demo session.');
        const fallbackUser: User = {
          id: 'demo-user-1',
          email: email || 'alex.morgan@campus.edu',
          name: name || 'Alex Morgan',
          created_at: new Date().toISOString(),
        };
        api.setToken('demo-mock-jwt-token');
        localStorage.setItem('realitygraph_offline_user', JSON.stringify(fallbackUser));
        setUser(fallbackUser);
        return;
      }
      throw err;
    }
  };

  const logout = () => {
    api.clearToken();
    localStorage.removeItem('realitygraph_offline_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
