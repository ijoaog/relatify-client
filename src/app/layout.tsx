// src/app/layout.tsx
import type { Metadata } from 'next';

import './globals.css';

import { AuthProvider } from '../context/AuthContext';
import Header from '../components/custom/Header';
import Sidebar from '../components/custom/Sidebar';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
    title: 'Relatify',
    description: 'Sistema de Relatórios.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en'>
            <body className='antialiased'>
                <AuthProvider>
                        <div className='flex h-screen flex-col'>
                            <Header />
                            <div className='flex flex-1'>
                                <Sidebar />
                                <main className='flex flex-1 items-center justify-center overflow-y-auto p-4 text-center'>
                                    {children}
                                </main>
                            </div>
                        </div>
                        <Toaster />
                </AuthProvider>
            </body>
        </html>
    );
}
