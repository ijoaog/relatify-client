'use client'; // Necessário para usar hooks no Next.js

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';

const LoginPage = () => {
    const { login } = useAuth();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        setError(null); // Reseta o erro ao tentar logar
        try {
            await login(username, password); // Chama a função de login
        } catch (err) {
            setError(String(err).replace(/^Error: /, ''));
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <div className='containerFull flex h-screen w-full items-center justify-center'>
            <div className='flex h-3/4 w-3/4 flex-col overflow-hidden rounded-2xl shadow-xl md:flex-row'>
                <div className='leftBox flex h-[30%] w-full items-center justify-center bg-gradient-to-r from-gray-300 via-gray-200 to-white text-center shadow-md md:h-full md:w-[65%]'>
                    <p className='text-6xl font-semibold tracking-widest text-black'>
                        Relatify
                    </p>
                </div>
                <div className='rightBox flex h-[70%] w-full flex-col items-center justify-center gap-4 bg-gradient-to-br from-red-300 to-red-600 p-8 text-center shadow-lg md:h-full md:w-[35%]'>
                    <h1 className='mb-4 text-2xl font-light'>Login</h1>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <input
                        type='text'
                        placeholder='Username'
                        className='mb-4 rounded border p-2 text-black'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyDown={handleKeyDown} // Usando onKeyDown aqui
                    />
                    <input
                        type='password'
                        className='mb-4 rounded border p-2 text-black'
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handleKeyDown} // E aqui também
                    />
                    <Button
                        className='flex items-center justify-center'
                        onClick={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <svg
                                className='h-5 w-5 animate-spin'
                                viewBox='0 0 24 24'
                            >
                                <circle
                                    className='opacity-25'
                                    cx='12'
                                    cy='12'
                                    r='10'
                                    stroke='currentColor'
                                    strokeWidth='4'
                                ></circle>
                                <path
                                    className='opacity-75'
                                    fill='currentColor'
                                    d='M4 12a8 8 0 018-8v8l4.88 4.88A8.002 8.002 0 014 12z'
                                ></path>
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