'use client'; // Certifique-se de que este componente é um Client Component
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Importa o useRouter do next/navigation
import { useAuth } from '../../context/AuthContext'; // Importa o contexto de autenticação
import Loader from '../../components/custom/Loader'; // Importa o componente Loader
import { ExampleChart } from '../../components/charts'; // Importa o componente ExampleChart

const HomePage = () => {
    const { user, loading } = useAuth(); // Obtém o estado do usuário e o estado de carregamento do contexto de autenticação
    const router = useRouter(); // Cria uma instância do roteador

    useEffect(() => {
        if (!user) {
            router.push('/'); 
        }
    }, [loading, user, router]);

    if (loading) {
        return (
            <div className='mainContainer flex h-screen items-center justify-center'>
                <Loader />
            </div>
        );
    }

    return (
        <div className=''>
            <h1>Home</h1>
            <ExampleChart />
            <p>Bem-vindo ao nosso site!</p>
        </div>
    );
};

export default HomePage;
