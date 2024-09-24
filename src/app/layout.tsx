// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

import { AuthProvider } from '../context/AuthContext';
import Header from '../components/custom/Header';
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
            <body className={`antialiased`}>
                <AuthProvider>
                    <Header />
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
