'use client'; // Necessário para usar hooks no Next.js

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Loader from '@/components/custom/Loader';
import { toast } from 'sonner';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";

const LoginPage = () => {
    const { login } = useAuth();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            await login(username, password);
        } catch (err) {
            let errorMessage = 'Erro desconhecido';

            if (err instanceof Error) {
                errorMessage = err.message;
            }

            toast.error(`Erro no login:`, {
                description: errorMessage,
                duration: 5000,
                position: 'bottom-right',
                style: {
                    borderRadius: '8px',
                    fontSize: '16px',
                },
            });
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
            <div className='flex h-3/4 w-3/4 flex-col overflow-hidden rounded-2xl shadow-xl sm:flex-row'>
                <div className='leftBox flex h-[30%] w-full items-center justify-center bg-gradient-to-r from-gray-300 via-gray-200 to-white text-center shadow-md sm:h-full sm:w-[65%]'>
                    <p className='text-6xl font-semibold tracking-widest text-black'>
                        Relatify
                    </p>
                </div>
                <div className='rightBox flex h-[70%] w-full flex-col items-center justify-center gap-4 bg-gradient-to-br from-red-300 to-red-600 p-8 text-center shadow-lg sm:h-full sm:w-[35%]'>
                    <h1 className='mb-4 text-2xl font-light'>Entrar</h1>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <Input
                        type='text'
                        placeholder='Usuário'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <Input
                        type='password'
                        placeholder='Senha'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <Button
                        className='flex items-center justify-center'
                        onClick={handleLogin}
                        disabled={loading}
                    >
                        {loading ? <Loader height={20} width={20} /> : 'Entrar'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
