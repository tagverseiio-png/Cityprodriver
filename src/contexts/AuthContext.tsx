import { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'customer' | 'driver';

export interface User {
  id: string;
  name: string;
  email?: string;
  phone: string;
  role: UserRole;
  isVerified?: boolean;
  profileCompletion?: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (phone: string, role: UserRole) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (phone: string, role: UserRole) => {
    // Mock login - in production, this would be API-based
    setUser({
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      phone,
      role,
      isVerified: false,
      profileCompletion: role === 'driver' ? 20 : 50,
    });
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
