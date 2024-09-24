"use client"; // Necessário para usar hooks no Next.js

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Button } from "@/components/ui/button";

const LoginPage = () => {
  const { login, user } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login(username, password);
      const userRole = user?.role;
      switch (userRole) {
        case 'admin':
          router.push('/admin');
          break;
        case 'user':
          router.push('/home');
          break;
        default:
          router.push('/login');
          break;
      }
    } catch (err) {
      setError('Erro no servidor. Tente novamente mais tarde.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="containerFull flex justify-center items-center w-full h-screen">
      <div className="flex flex-col md:flex-row w-3/4 h-3/4 shadow-xl rounded-2xl overflow-hidden">
        <div className="leftBox flex w-full md:w-[65%] h-[30%] md:h-full justify-center items-center text-center bg-gradient-to-r from-gray-300 via-gray-200 to-white shadow-md">
          <p className="text-6xl font-semibold text-black tracking-widest">
            Relatify
          </p>
        </div>
        <div className='rightBox flex flex-col gap-4 w-full md:w-[35%] md:h-full h-[70%] bg-gradient-to-br from-red-300 to-red-600 text-center justify-center items-center p-8 shadow-lg'>
          <h1 className="text-2xl font-light mb-4">Login</h1>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <input 
            type="text" 
            placeholder="Username" 
            className='text-black border rounded p-2 mb-4'
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
          />
          <input 
            type="password" 
            className='text-black border rounded p-2 mb-4'
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <Button className="flex justify-center items-center" onClick={handleLogin} disabled={loading}>
            {loading ? (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8l4.88 4.88A8.002 8.002 0 014 12z"></path>
              </svg>
            ) : (
              'Login'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
