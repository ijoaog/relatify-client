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
import { AlertTableLastMonth } from '@/components/custom/tables/AlertsTable';
import { ActiveTable } from '@/components/custom/tables/ActiveTable';
import { RemovalTable } from '@/components/custom/tables/RemovalTable';
import { PendingTable } from '@/components/custom/tables/PendingTable';

const HomePage = () => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [monitoringLogs, setMonitoringLogs] = useState<MonitoringLog[]>([]);
    const [detaineesInfos, setDetaineesInfos] = useState<Detainee[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [theLastMonthLogs, setTheLastMonthLogs] = useState<MonitoringLog[]>(
        []
    );
    // States for loading each card
    const [loadingMonitoring, setLoadingMonitoring] = useState(true);
    const [loadingDetainees, setLoadingDetainees] = useState(true);
    const [loadingAlerts, setLoadingAlerts] = useState(true); // Novo estado para AlertTableLastMonth
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    useEffect(() => {
        const fetchMonitoringData = async () => {
            try {
                const monitoringService = new MonitoringService();
                const logs = await monitoringService.getAllMonitoring();
                const theLastMonthLogs =
                    await monitoringService.getAlertsInLastMonth();

                setMonitoringLogs(logs);
                setTheLastMonthLogs(theLastMonthLogs);
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
                setLoadingMonitoring(false);
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
                setLoadingDetainees(false);
            }
        };

        const fetchAlerts = async () => {
            try {
                const monitoringService = new MonitoringService();
                const alertsData =
                    await monitoringService.getAlertsInLastMonth();
                setTheLastMonthLogs(alertsData);
            } catch (error) {
                console.error(
                    'Erro ao carregar os alertas do último mês:',
                    error
                );
            } finally {
                setLoadingAlerts(false); // Atualiza o estado de carregamento da tabela de alertas
            }
        };

        if (!loading && user) {
            fetchDetaineesInfos();
            fetchMonitoringData();
            fetchAlerts(); // Chama a nova função para carregar os alertas
        } else if (!loading && !user) {
            router.push('/');
        }

        setIsInitialLoading(false);
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
                {loadingDetainees ? (
                    <Loader />
                ) : (
                    <InfoCard
                        title='Tornozeleiras Ativas'
                        description='Total de tornozeleiras que estão ativas.'
                        count={prisonersInfos.activeBracelets}
                        details={
                            <ActiveTable
                                logs={detaineesInfos.filter(
                                    (detainee) =>
                                        detainee.monitoringStatus ===
                                        'em_monitoramento'
                                )}
                            />
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
                            <RemovalTable
                                logs={detaineesInfos.filter(
                                    (detainee) =>
                                        detainee.monitoringStatus ===
                                        'concluído'
                                )}
                            />
                        }
                        props='text-gray-500'
                        icon={faLinkSlash}
                    />
                )}

                {loadingDetainees ? (
                    <Loader />
                ) : (
                    <InfoCard
                        title='Tornozeleiras Pendentes'
                        description='Número de tornozeleiras a serem instaladas.'
                        count={prisonersInfos.pendingBracelets}
                        details={
                            <PendingTable
                                logs={detaineesInfos.filter(
                                    (detainee) =>
                                        detainee.monitoringStatus === 'pendente'
                                )}
                            />
                        }
                        props='text-red-500'
                        icon={faCircleExclamation}
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
                    {loadingMonitoring ? (
                        <Loader />
                    ) : (
                        <InfoCard
                            title='Total de registros'
                            description='Quantidade total de registros ativos no momento.'
                            count={prisonersInfos.totalRecords}
                            details={
                                loadingAlerts ? (
                                    <Loader />
                                ) : (
                                    <AlertTableLastMonth
                                        logs={theLastMonthLogs}
                                    />
                                )
                            } // Adiciona o Loader aqui
                            icon={faPeopleLine}
                            clickable={false} // Torna o card não clicável
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
                                loadingAlerts ? (
                                    <Loader />
                                ) : (
                                    <p>Detalhes sobre os alertas recentes...</p>
                                )
                            } // Adiciona o Loader aqui
                            icon={faTriangleExclamation}
                            clickable={false} // Torna o card não clicável
                        />
                    )}
                </div>
            </div>
            <div className='tableDiv border-1 border-dark mt-2 flex h-[400px] rounded-sm border p-2 shadow-sm'>
                {loadingAlerts ? (
                    <Loader />
                ) : (
                    <AlertTableLastMonth logs={theLastMonthLogs} />
                )}
            </div>
        </div>
    );
};

export default HomePage;
