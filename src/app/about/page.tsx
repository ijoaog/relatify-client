'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/custom/Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRegistered } from '@fortawesome/free-solid-svg-icons';

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
        <div className='flex h-screen flex-col justify-between'>
            <h1 className='mb-4 pt-12 text-center text-3xl font-bold md:text-4xl'>
                Sobre o Relatify
            </h1>
            <div className='flex flex-col items-center justify-center text-center'>
                <p className='mb-6 text-lg md:text-xl'>
                    O Relatify é um aplicativo inovador que fornece acesso a
                    dados de tornozeleiras eletrônicas e permite a criação de
                    relatórios para finalidades legais. Nossa plataforma visa
                    facilitar a coleta e apresentação de informações essenciais,
                    garantindo eficiência e conformidade legal.
                </p>
                <p className='text-lg md:text-xl'>Com o Relatify, você pode:</p>
                <ul className='mb-6 list-inside list-disc text-lg md:text-xl'>
                    <li>
                        Acessar dados em tempo real sobre o uso de tornozeleiras
                        eletrônicas
                    </li>
                    <li>
                        Gerar relatórios detalhados para apresentações legais
                    </li>
                    <li>
                        Facilitar a tomada de decisões informadas com base em
                        dados precisos
                    </li>
                </ul>
            </div>
            <div className='flex flex-col items-center justify-center p-4'>
                <p className='text-sm text-gray-500'>
                    <FontAwesomeIcon icon={faRegistered} /> reservados para
                    Relatify.
                </p>
            </div>
        </div>
    );
};

export default AboutPage;
