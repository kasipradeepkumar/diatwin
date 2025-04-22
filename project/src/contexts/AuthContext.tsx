import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock authentication functions - would be replaced with actual auth implementation
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCurrentUser({
      id: '123',
      email,
      profileComplete: false,
    });
    setIsLoading(false);
    localStorage.setItem('user', JSON.stringify({ id: '123', email, profileComplete: false }));
  };

  const signUp = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCurrentUser({
      id: '123',
      email,
      name,
      profileComplete: false,
    });
    setIsLoading(false);
    localStorage.setItem('user', JSON.stringify({ id: '123', email, name, profileComplete: false }));
  };

  const signOut = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setCurrentUser(null);
    setIsLoading(false);
    localStorage.removeItem('user');
  };

  // Check for existing user session
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setIsLoading(false);
  }, []);

  const value = {
    currentUser,
    isLoading,
    signIn,
    signUp,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};