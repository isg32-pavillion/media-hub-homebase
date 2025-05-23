
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Role = 'admin' | 'user' | null;

interface AuthContextType {
  isAuthenticated: boolean;
  role: Role;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [role, setRole] = useState<Role>(null);

  // In a real app, check if user is authenticated on page load
  useEffect(() => {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      const { authenticated, userRole } = JSON.parse(storedAuth);
      setIsAuthenticated(authenticated);
      setRole(userRole);
    }
  }, []);

  // Mock login function - would be replaced with real authentication
  const login = async (email: string, password: string): Promise<boolean> => {
    // For demo purposes only - would be replaced with real auth
    if (email === 'admin@example.com' && password === 'admin') {
      setIsAuthenticated(true);
      setRole('admin');
      localStorage.setItem('auth', JSON.stringify({ authenticated: true, userRole: 'admin' }));
      return true;
    } else if (email === 'user@example.com' && password === 'user') {
      setIsAuthenticated(true);
      setRole('user');
      localStorage.setItem('auth', JSON.stringify({ authenticated: true, userRole: 'user' }));
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setRole(null);
    localStorage.removeItem('auth');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
