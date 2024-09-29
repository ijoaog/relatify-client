'use client'; // Certifique-se de que este componente é um Client Component
import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext'; // Importa o contexto de autenticação
import Loader from '../../components/custom/Loader'; // Importa o componente Loader
import InfoCard from '../../components/custom/cards/InfoCardAndModal'; // Importa o componente InfoCard
import { PieChartsComponent } from '../../components/custom/graphics/pieCharts';
import { LineChartsComponent } from '../../components/custom/graphics/LinesCharts';

import {
    faPeopleLine,
    faBroadcastTower,
    faTriangleExclamation,
    faLinkSlash,
    faCircleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';

const HomePage = () => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/'); // Redireciona para a página de login se não houver usuário
        }
    }, [loading, user, router]);

    // Exibe loader enquanto está carregando
    if (loading) {
        return (
            <div className='mainContainer flex h-screen items-center justify-center'>
                <Loader />
            </div>
        );
    }

    
    let prisonersInfos = {
        totalRecords: 322,
        activeBracelets: 89,
        removedBracelets: 32,
        violatedBracelets: 3,
        recentAlerts: 3,
    };

    return (
        <div className='mx-auto max-w-7xl px-4 py-8'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                <InfoCard
                    title='Total de registros'
                    description='Quantidade total de registros ativos no momento.'
                    count={prisonersInfos.totalRecords}
                    details={
                        <p>Detalhes sobre os prisioneiros monitorados...</p>
                    }
                    icon={faPeopleLine}
                />
                <InfoCard
                    title='Tornozeleiras Ativas'
                    description='Total de tornozeleiras que estão ativas.'
                    count={prisonersInfos.activeBracelets}
                    details={<p>Detalhes sobre as tornozeleiras ativas...</p>}
                    props='text-green-500'
                    icon={faBroadcastTower}
                />
                <InfoCard
                    title='Tornozeleiras Removidas'
                    description='Exibir número de alertas gerados nas últimas 24 horas.'
                    count={prisonersInfos.removedBracelets}
                    details={
                        <p>Detalhes sobre as tornozeleiras removidas...</p>
                    }
                    props='text-gray-500'
                    icon={faLinkSlash}
                />
            </div>

            <div className='mt-8 flex flex-col gap-6 md:flex-row'>
                <div className='flex flex-1 flex-col gap-4'>
                    <LineChartsComponent />
                    <PieChartsComponent
                        activeBracelets={prisonersInfos.activeBracelets}
                        removedBracelets={prisonersInfos.removedBracelets}
                        violatedBracelets={prisonersInfos.violatedBracelets}
                    />
                </div>
                <div className='flex w-full flex-col gap-4 md:w-1/3'>
                    <InfoCard
                        title='Tornozeleiras Violadas'
                        description='Número de tornozeleiras violadas.'
                        count={prisonersInfos.violatedBracelets}
                        details={
                            <p>Detalhes sobre as tornozeleiras violadas...</p>
                        }
                        props='text-red-500'
                        icon={faCircleExclamation}
                    />
                    <InfoCard
                        title='Alertas Recentes'
                        description='Alertas recentes que foram gerados.'
                        count={prisonersInfos.recentAlerts}
                        details={<p>Detalhes sobre os alertas recentes...</p>}
                        props='text-yellow-500'
                        icon={faTriangleExclamation}
                    />
                </div>
            </div>
        </div>
    );
};

export default HomePage;
