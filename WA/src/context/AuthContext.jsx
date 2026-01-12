import { useState, useEffect } from 'react';
import { setAuthToken, getAuthToken } from '../services/api';
import { apiLogin, apiRegisterAdmin, apiMe } from '../services/endpoints';
import { AuthContext } from './AuthContextBase';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      const token = getAuthToken();
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        setAuthToken(token);
        const me = await apiMe();
        setUser(me?.user || me || null);
      } catch {
        setAuthToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const login = async (credentials) => {
    const response = await apiLogin(credentials);
    if (response.token) {
      setAuthToken(response.token);
      setUser(response.user || null);
      return response;
    }
    throw new Error('Invalid response');
  };

  const register = async (payload) => {
    const response = await apiRegisterAdmin(payload);
    if (response.token) {
      setAuthToken(response.token);
      setUser(response.user || null);
      return response;
    }
    throw new Error('Invalid response');
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
