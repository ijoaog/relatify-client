// src/context/AuthContext.tsx

"use client"; // Necessário para usar hooks no Next.js

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Definindo a interface para o contexto de autenticação
interface AuthContextType {
  user: any; // Você pode definir um tipo mais específico para o usuário
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

// Criação do contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider do AuthContext
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null); // Mantenha o estado do usuário aqui

  const login = async (username: string, password: string) => {
    
    // Lógica para fazer login e obter o usuário
    const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
          
    if (!response.ok) {
      throw new Error('Failed to login');
    }

    const data = await response.json();
    console.log("dataa", data.access_token);
    localStorage.setItem('token', data.access_token);
    setUser(data.user); //
  };

  const logout = () => {
    localStorage.setItem('token', '');
    setUser(null); // Limpa o estado do usuário
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};