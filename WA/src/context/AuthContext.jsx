import { createContext, useContext, useState, useEffect } from 'react';
import { setAuthToken, getAuthToken } from '../services/api';
import { apiLogin } from '../services/endpoints';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      // TODO: Verify token và load user info
      setAuthToken(token);
      // For now, just set a dummy user
      setUser({ role: 'admin', fullName: 'Admin', phone: '0912345678' });
    } else {
      // Tạm thời tự động set user admin để test UI
      setUser({ role: 'admin', fullName: 'Admin', phone: '0912345678' });
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await apiLogin(credentials);
      if (response.token) {
        setAuthToken(response.token);
        setUser(response.user || { role: 'admin', fullName: 'Admin' });
        return response;
      }
      throw new Error('Invalid response');
    } catch (error) {
      // Nếu backend chưa chạy hoặc lỗi network, vẫn cho phép login để test UI
      if (error.code === 'ERR_NETWORK' || error.message?.includes('Network') || !error.response) {
        // Tạo token giả và user mặc định để test UI
        const mockToken = 'mock_token_' + Date.now();
        setAuthToken(mockToken);
        setUser({ 
          role: 'admin', 
          fullName: 'Admin',
          phone: credentials.identifier 
        });
        return { token: mockToken, user: { role: 'admin' } };
      }
      throw error;
    }
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

