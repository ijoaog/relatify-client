'use client'; // Certifique-se de que este componente é um Client Component
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext'; // Importa o contexto de autenticação
import Loader from '../../components/custom/Loader'; // Importa o componente Loader
import InfoCard from '../../components/custom/cards/InfoCardAndModal'; // Importa o componente InfoCard
import { PieChartsComponent } from '../../components/custom/graphics/pieCharts';
import { LineChartsComponent } from '../../components/custom/graphics/LinesCharts';
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

const HomePage = () => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [monitoringLogs, setMonitoringLogs] = useState<MonitoringLog[]>([]); // Estado para armazenar logs de monitoramento
    const [detaineesInfos, setDetaineesInfos] = useState<Detainee[]>([]); // Estado para armazenar informações dos detentos
    const [error, setError] = useState<string | null>(null); // Estado para armazenar erros

    useEffect(() => {
        const fetchMonitoringData = async () => {
            try {
                const monitoringService = new MonitoringService();
                const logs = await monitoringService.getAllMonitoring();
                setMonitoringLogs(logs);
            } catch (err) {
                console.error('Erro ao carregar os dados de monitoramento:', err);
                setError('Erro ao carregar os dados de monitoramento.'); // Define o erro no estado
            }
        };

        const fetchDetaineesInfos = async  () => {
            try {
                const detaineeService = new DetaineeService();
                const detaineesData = await detaineeService.getAllDetainees();
                setDetaineesInfos(detaineesData);
            } catch (error) {
                console.error('Erro ao carregar os dados dos detentos:', error);
            }
        };

        if (!loading && !user) {
            router.push('/'); // Redireciona para a página de login se não houver usuário
        } else {
            fetchDetaineesInfos(); // Chama a função para buscar dados dos detentos
            fetchMonitoringData(); // Chama a função para buscar dados de monitoramento
        }
    }, [loading, user, router]);

    if (loading) {
        return (
            <div className='mainContainer flex h-screen items-center justify-center'>
                <Loader />
            </div>
        );
    }

    // Exibe mensagem de erro, se houver
    if (error) {
        return (
            <div className='mainContainer flex h-screen items-center justify-center'>
                <p className='text-red-500'>{error}</p>
            </div>
        );
    }

    // Exemplo de informações de prisioneiros
    const prisonersInfos = {
        totalRecords: monitoringLogs.length,
        activeBracelets: detaineesInfos.filter(log => log.monitoringStatus === 'em_monitoramento').length,
        removedBracelets: detaineesInfos.filter(log => log.monitoringStatus === 'concluído').length,
        pendingBracelets: detaineesInfos.filter(log => log.monitoringStatus === 'pendente').length,
        recentAlerts: monitoringLogs.filter(log => log.alerts).length,
    };

    const prisonersObj = {
        totalRecords: monitoringLogs,
        activeBracelets: detaineesInfos.filter(log => log.monitoringStatus === 'em_monitoramento'),
        removedBracelets: detaineesInfos.filter(log => log.monitoringStatus === 'concluído'),
        pendingBracelets: detaineesInfos.filter(log => log.monitoringStatus === 'pendente'),
        recentAlerts: monitoringLogs.filter(log => log.alerts)
    }
    console.log("ativados",prisonersObj.activeBracelets);
    
    return (
        <div className='conteiner mx-auto max-w-7xl px-4 py-8'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                <InfoCard
                    title='Total de registros'
                    description='Quantidade total de registros ativos no momento.'
                    count={prisonersInfos.totalRecords}
                    details={<p>Detalhes sobre os prisioneiros monitorados...</p>}
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
                    description='Exibir número de tornozeleira removidas (concluído).'
                    count={prisonersInfos.removedBracelets}
                    details={<p>Detalhes sobre as tornozeleiras removidas...</p>}
                    props='text-gray-500'
                    icon={faLinkSlash}
                />
            </div>

            <div className='mt-8 flex flex-col gap-6 md:flex-row'>
                <div className='flex flex-1 flex-col gap-4'>
                    <PieChartsComponent
                        activeBracelets={prisonersInfos.activeBracelets}
                        removedBracelets={prisonersInfos.removedBracelets}
                        violatedBracelets={prisonersInfos.pendingBracelets}
                    />
                </div>
                <div className='flex w-full flex-col gap-4 md:w-1/3'>
                    <InfoCard
                        title='Tornozeleiras Pendentes'
                        description='Número de tornozeleiras a serem instaladas.'
                        count={prisonersInfos.pendingBracelets}
                        details={<p>Detalhes sobre as tornozeleiras violadas...</p>}
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