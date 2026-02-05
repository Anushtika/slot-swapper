import React, { createContext, useContext, useState } from 'react';

export interface AuthContextType {
  user: { id: string; name: string } | null;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthContextType['user']>(null);

  const login = async (credentials: { username: string; password: string }) => {
    setUser({ id: '1', name: 'John Doe' }); // Mock data; replace with implementation
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;