'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/custom/Loader';
import InfoCard from '../../components/custom/cards/InfoCardAndModal';
import { PieChartsComponent } from '../../components/custom/graphics/pieCharts';
import MonitoringService, { MonitoringLog } from '../../api/MonitoringService';
import {
    faPeopleLine,
    faBroadcastTower,
    faTriangleExclamation,
    faLinkSlash,
    faCircleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import DetaineeService, { Detainee } from '@/api/DetaineeService';
import { toast } from 'sonner';

const HomePage = () => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [monitoringLogs, setMonitoringLogs] = useState<MonitoringLog[]>([]);
    const [detaineesInfos, setDetaineesInfos] = useState<Detainee[]>([]);
    const [error, setError] = useState<string | null>(null);

    // States for loading each card
    const [loadingMonitoring, setLoadingMonitoring] = useState(true);
    const [loadingDetainees, setLoadingDetainees] = useState(true);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    useEffect(() => {
        const fetchMonitoringData = async () => {
            try {
                const monitoringService = new MonitoringService();
                const logs = await monitoringService.getAllMonitoring();
                setMonitoringLogs(logs);
            } catch (err) {
                toast.error(`Erro no carregamento:`, {
                    description: 'Erro ao carregar os dados de monitoramento.',
                    duration: 5000,
                    position: 'bottom-right',
                    style: {
                        borderRadius: '8px',
                        fontSize: '16px',
                    },
                });
                console.error(
                    'Erro ao carregar os dados de monitoramento:',
                    err
                );
                setError('Erro ao carregar os dados de monitoramento.');
            } finally {
                setLoadingMonitoring(false); // Set loading to false when data is fetched or on error
            }
        };

        const fetchDetaineesInfos = async () => {
            try {
                const detaineeService = new DetaineeService();
                const detaineesData = await detaineeService.getAllDetainees();
                setDetaineesInfos(detaineesData);
            } catch (error) {
                console.error('Erro ao carregar os dados dos detentos:', error);
            } finally {
                setLoadingDetainees(false); // Set loading to false when data is fetched or on error
            }
        };

        if (!loading && user) {
            fetchDetaineesInfos();
            fetchMonitoringData();
        } else if (!loading && !user) {
            router.push('/');
        }

        setIsInitialLoading(false); // Initial loading completed
    }, [loading, user, router]);

    if (loading || isInitialLoading) {
        return (
            <div className='mainContainer flex h-screen items-center justify-center'>
                <Loader />
            </div>
        );
    }

    if (error) {
        return (
            <div className='mainContainer flex h-screen items-center justify-center'>
                <p className='text-red-500'>{error}</p>
            </div>
        );
    }

    const prisonersInfos = {
        totalRecords: monitoringLogs.length,
        activeBracelets: detaineesInfos.filter(
            (log) => log.monitoringStatus === 'em_monitoramento'
        ).length,
        removedBracelets: detaineesInfos.filter(
            (log) => log.monitoringStatus === 'concluído'
        ).length,
        pendingBracelets: detaineesInfos.filter(
            (log) => log.monitoringStatus === 'pendente'
        ).length,
        recentAlerts: monitoringLogs.filter((log) => log.alerts).length,
    };

    return (
        <div className='conteiner mx-auto max-w-7xl px-4 py-8'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {loadingMonitoring ? (
                    <Loader />
                ) : (
                    <InfoCard
                        title='Total de registros'
                        description='Quantidade total de registros ativos no momento.'
                        count={prisonersInfos.totalRecords}
                        details={
                            <p>Detalhes sobre os prisioneiros monitorados...</p>
                        }
                        icon={faPeopleLine}
                    />
                )}
                {loadingDetainees ? (
                    <Loader />
                ) : (
                    <InfoCard
                        title='Tornozeleiras Ativas'
                        description='Total de tornozeleiras que estão ativas.'
                        count={prisonersInfos.activeBracelets}
                        details={
                            <p>Detalhes sobre as tornozeleiras ativas...</p>
                        }
                        props='text-green-500'
                        icon={faBroadcastTower}
                    />
                )}
                {loadingDetainees ? (
                    <Loader />
                ) : (
                    <InfoCard
                        title='Tornozeleiras Removidas'
                        description='Exibir número de tornozeleira removidas (concluído).'
                        count={prisonersInfos.removedBracelets}
                        details={
                            <p>Detalhes sobre as tornozeleiras removidas...</p>
                        }
                        props='text-gray-500'
                        icon={faLinkSlash}
                    />
                )}
            </div>

            <div className='mt-8 flex flex-col gap-6 md:flex-row'>
                <div className='flex flex-1 flex-col gap-4'>
                    {loadingDetainees ? (
                        <Loader />
                    ) : (
                        <PieChartsComponent
                            activeBracelets={prisonersInfos.activeBracelets}
                            removedBracelets={prisonersInfos.removedBracelets}
                            violatedBracelets={prisonersInfos.pendingBracelets}
                        />
                    )}
                </div>
                <div className='flex w-full flex-col gap-4 md:w-1/3'>
                    {loadingDetainees ? (
                        <Loader />
                    ) : (
                        <InfoCard
                            title='Tornozeleiras Pendentes'
                            description='Número de tornozeleiras a serem instaladas.'
                            count={prisonersInfos.pendingBracelets}
                            details={
                                <p>
                                    Detalhes sobre as tornozeleiras violadas...
                                </p>
                            }
                            props='text-red-500'
                            icon={faCircleExclamation}
                        />
                    )}
                    {loadingMonitoring ? (
                        <Loader />
                    ) : (
                        <InfoCard
                            title='Alertas Recentes'
                            description='Alertas recentes que foram gerados.'
                            count={prisonersInfos.recentAlerts}
                            details={
                                <p>Detalhes sobre os alertas recentes...</p>
                            }
                            props='text-yellow-500'
                            icon={faTriangleExclamation}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
