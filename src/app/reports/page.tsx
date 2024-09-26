'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/custom/Loader';

const RelatoriosPage = () => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/'); 
        }
    }, [loading, user, router]);

    if (loading) {
        return (
            <div className='reportsMainContainer flex h-screen items-center justify-center'>
                <Loader />
            </div>
        );
    }

    return (
        <div className=''>
            <h1>Relatórios</h1>
            <p>Esta é a página de relatórios do nosso site.</p>
        </div>
    );
};

export default RelatoriosPage;