'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/custom/Loader';

const AboutPage = () => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/');
        }
    }, [loading, user, router]);

    if (loading) {
        return (
            <div className='aboutMainContainer flex h-full items-center justify-center text-center'>
                <Loader />
            </div>
        );
    }

    return (
        <div className=''>
            <h1>AQUI É INFORMAÇÃO SOBRE OS PRESOS ATIVOS</h1>
            <p>Esta é a página sobre nosso site.</p>
        </div>
    );
};

export default AboutPage;
