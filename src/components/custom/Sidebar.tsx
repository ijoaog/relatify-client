// src/components/custom/Sidebar.tsx
'use client';
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePathname } from 'next/navigation';
import Link from 'next/link';


const Sidebar: React.FC = () => {
    const { user } = useAuth();
    const pathname = usePathname();

    const navItems = [
        { label: 'Home', href: '/home', role: 'official_agent' },
        { label: 'Registrar', href: '/register', role: 'register' },
        { label: 'Relatórios', href: '/reports', role: 'official_agent' },
        { label: 'Sobre', href: '/about', role: 'official_agent' },
    ];

    if (!user) return null;

    const filteredNavItems = navItems.filter(
        (item) => user.role === 'admin' || item.role === 'official_agent'
    );

    return (
        <div className='sideBarContainer hidden h-full w-44 flex-col bg-gray-600 p-4 text-white sm:flex'>
            <h2 className='mb-6 text-2xl font-bold'>Menu</h2>
            <ul className='space-y-2'>
                {filteredNavItems.map((item) => (
                    <li key={item.href}>
                        <Link href={item.href}>
                            <div
                                className={`block rounded px-4 py-2 transition-colors duration-200 ${
                                    pathname === item.href
                                        ? 'bg-gray-900'
                                        : 'hover:bg-gray-800'
                                }`}
                            >
                                {item.label}
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
