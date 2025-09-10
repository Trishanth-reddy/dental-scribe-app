import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'patient' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  patientId?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string, patientId?: string) => Promise<boolean>;
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
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    // Mock authentication - in real app this would call backend API
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data based on role
      if (role === 'admin' && email === 'admin@dental.com' && password === 'admin123') {
        setUser({
          id: 'admin-1',
          name: 'Dr. Sarah Johnson',
          email: 'admin@dental.com',
          role: 'admin'
        });
        return true;
      } else if (role === 'patient') {
        // Mock patient login - accept any valid email/password format
        if (email.includes('@') && password.length >= 6) {
          setUser({
            id: `patient-${Date.now()}`,
            name: email.split('@')[0],
            email,
            role: 'patient',
            patientId: `P${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
          });
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, patientId?: string): Promise<boolean> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock registration success
      setUser({
        id: `patient-${Date.now()}`,
        name,
        email,
        role: 'patient',
        patientId: patientId || `P${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
      });
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};