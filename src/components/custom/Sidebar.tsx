// src/components/custom/Sidebar.tsx
'use client';
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const Sidebar: React.FC = () => {
    const { user } = useAuth();
    const pathname = usePathname();

    if (!user) return null; // Retorna null se o usuário não estiver logado

    return (
        <aside className='h-scrren w-[11%] bg-gray-600 p-4 text-white'>
            <h2 className='mb-6 text-2xl font-bold'>Menu</h2>
            <ul className='space-y-2'>
                <li>
                    <Link href='/home'>
                        <div
                            className={`block rounded px-4 py-2 transition-colors duration-200 ${
                                pathname === '/home'
                                    ? 'bg-gray-900'
                                    : 'hover:bg-gray-800'
                            }`}
                        >
                            Home
                        </div>
                    </Link>
                </li>
                {user.role === 'admin' && (
                    <li>
                        <Link href='/admin'>
                            <div
                                className={`block rounded px-4 py-2 transition-colors duration-200 ${
                                    pathname === '/admin'
                                        ? 'bg-gray-900'
                                        : 'hover:bg-gray-800'
                                }`}
                            >
                                Administrador
                            </div>
                        </Link>
                    </li>
                )}
                <li>
                    <Link href='/reports'>
                        <div
                            className={`block rounded px-4 py-2 transition-colors duration-200 ${
                                pathname === '/reports'
                                    ? 'bg-gray-900'
                                    : 'hover:bg-gray-800'
                            }`}
                        >
                            Relatórios
                        </div>
                    </Link>
                </li>
                <li>
                    <Link href='/about'>
                        <div
                            className={`block rounded px-4 py-2 transition-colors duration-200 ${
                                pathname === '/about'
                                    ? 'bg-gray-900'
                                    : 'hover:bg-gray-800'
                            }`}
                        >
                            Sobre
                        </div>
                    </Link>
                </li>
            </ul>
        </aside>
    );
};

export default Sidebar;
