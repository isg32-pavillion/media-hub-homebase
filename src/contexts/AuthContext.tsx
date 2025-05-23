
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { credentialsService } from '@/services/credentialsService';

type Role = 'admin' | 'user' | null;

interface AuthContextType {
  isAuthenticated: boolean;
  role: Role;
  login: (username: string, password: string) => Promise<boolean>;
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

  useEffect(() => {
    const storedAuth = localStorage.getItem('auth_session');
    if (storedAuth) {
      const { authenticated, userRole } = JSON.parse(storedAuth);
      setIsAuthenticated(authenticated);
      setRole(userRole);
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    const result = credentialsService.authenticate(username, password);
    if (result.success && result.role) {
      setIsAuthenticated(true);
      setRole(result.role);
      localStorage.setItem('auth_session', JSON.stringify({ 
        authenticated: true, 
        userRole: result.role 
      }));
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setRole(null);
    localStorage.removeItem('auth_session');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
