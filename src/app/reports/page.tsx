'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/custom/Loader';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardHeader,
    CardContent,
    CardDescription,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import DetaineeService from '../../api/DetaineeService';
import { Detainee as DetaineeInterface } from '../../api/DetaineeService';
import MonitoringService, { MonitoringLog } from '@/api/MonitoringService';
import { sendJsonFromPDF, downloadPDF } from '../../api/sendJsonFromPDF';
import { toast } from 'sonner';

const RelatoriosPage: React.FC = () => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [detaineeId, setDetaineeId] = useState<string>('');
    const [detainees, setDetainees] = useState<DetaineeInterface[]>([]);
    const [monitoringReports, setMonitoringReports] = useState<MonitoringLog[]>(
        []
    );
    const [filteredReports, setFilteredReports] = useState<MonitoringLog[]>([]);
    const [loadingReport, setLoadingReport] = useState<boolean>(false);
    const [loadingGeneralReport, setLoadingGeneralReport] =
        useState<boolean>(false);

    useEffect(() => {
        const fetchDetainees = async () => {
            try {
                const detaineeService = new DetaineeService();
                const detaineesData = await detaineeService.getAllDetainees();
                setDetainees(detaineesData);
            } catch (error) {
                console.error('Error fetching detainees:', error);
            }
        };

        const fetchReports = async () => {
            try {
                const reportsService = new MonitoringService();
                const detaineesReports =
                    await reportsService.getAllMonitoring();
                setMonitoringReports(detaineesReports);
            } catch (error) {
                console.error('Error fetching monitoring reports:', error);
            }
        };

        if (!user) {
            router.push('/');
        } else {
            fetchDetainees();
            fetchReports();
        }
    }, [loading, user, router]);

    useEffect(() => {
        const filtered = monitoringReports.filter(
            (report) => report.detainee.id === Number(detaineeId)
        );
        setFilteredReports(filtered);
    }, [detaineeId, monitoringReports]);

    const handleDetaineeReportSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        setLoadingReport(true);

        try {
            const pdfBlob = await sendJsonFromPDF(filteredReports);
            const fileName = `RelatorioIndividual_${new Date().toISOString().split('T')[0]}.pdf`;
            downloadPDF(pdfBlob, fileName);
        } catch (error) {
            toast.error(`Erro ao enviar relatório`, {
                description: 'Erro ao enviar relatório individual!',
                duration: 5000,
                position: 'bottom-right',
                style: {
                    borderRadius: '8px',
                    fontSize: '16px',
                },
            });
            console.error('Erro ao enviar relatório individual:', error);
        } finally {
            setLoadingReport(false);
        }
    };

    const handleGeneralReportSubmit = async () => {
        setLoadingGeneralReport(true);

        try {
            const pdfBlob = await sendJsonFromPDF(monitoringReports);
            const fileName = `RelatorioGeral_${new Date().toISOString().split('T')[0]}.pdf`;
            downloadPDF(pdfBlob, fileName);
        } catch (error) {
            toast.error(`Erro ao enviar relatório`, {
                description: 'Erro ao enviar relatório geral!',
                duration: 5000,
                position: 'bottom-right',
                style: {
                    borderRadius: '8px',
                    fontSize: '16px',
                },
            });
        } finally {
            setLoadingGeneralReport(false);
        }
    };

    if (loading) {
        return (
            <div className='reportsMainContainer flex h-screen items-center justify-center'>
                <Loader />
            </div>
        );
    }

    return (
        <div className='container mx-auto w-full px-4 py-8'>
            <h1 className='mb-4 text-2xl font-bold'>Relatórios</h1>
            <p className='mb-8'>Esta é a página de relatórios do nosso site.</p>

            <div className='grid grid-cols-1 gap-6'>
                <Card>
                    <CardHeader>
                        <h2 className='text-xl font-semibold'>
                            Relatório Individual
                        </h2>
                        <CardDescription>
                            Selecione a pessoa monitorada por tornozeleira
                            eletrônica para baixar o relatório.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className='flex items-center justify-center'>
                        <form
                            onSubmit={handleDetaineeReportSubmit}
                            className='space-y-4'
                        >
                            <Select
                                onValueChange={setDetaineeId}
                                value={detaineeId}
                            >
                                <SelectTrigger className='w-[350px]'>
                                    <SelectValue placeholder='Selecione o Detainee' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Indivíduos</SelectLabel>
                                        {detainees.map((detainee) => (
                                            <SelectItem
                                                key={detainee.id}
                                                value={String(detainee.id)}
                                            >
                                                {detainee.fullName}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <div className='buttonDiv flex items-center justify-center'>
                                <Button
                                    type='submit'
                                    disabled={!detaineeId || loadingReport}
                                >
                                    {loadingReport ? (
                                        <Loader width={20} height={20} />
                                    ) : (
                                        'Baixar Relatório'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <h2 className='text-xl font-semibold'>
                            Relatório Geral
                        </h2>
                        <CardDescription>
                            Ao clicar no botão abaixo, será baixado o relatório
                            de todas as pessoas monitoradas por tornozeleira
                            eletrônica.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='buttonDiv flex items-center justify-center'>
                            <Button
                                onClick={handleGeneralReportSubmit}
                                disabled={loadingGeneralReport}
                            >
                                {loadingGeneralReport ? (
                                    <Loader width={20} height={20} />
                                ) : (
                                    'Baixar Relatório Geral'
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default RelatoriosPage;
