import React from 'react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../../ui/table';
import { MonitoringLog } from '@/api/MonitoringService';

interface AlertTableLastMonthProps {
    logs: MonitoringLog[];
}

export function AlertTableLastMonth({ logs }: AlertTableLastMonthProps) {
    // Criar uma cópia do array para evitar mutações
    const sortedLogs = [...logs].sort((a, b) => {
        return (
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
    });

    return (
        <Table>
            <TableCaption>Atualizações do último mês.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead className='hidden md:flex sm:hidden'>CPF</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ultima Violação</TableHead>
                    <TableHead>Alerta</TableHead>
                    <TableHead className='hidden md:flex sm:hidden'>Atualizado em</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {sortedLogs.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={6} className='text-center'>
                            Nenhum registro encontrado.
                        </TableCell>
                    </TableRow>
                ) : (
                    sortedLogs.map((log) => (
                        <TableRow key={log.detainee_id}>
                            <TableCell className='font-medium'>
                                {log.detainee.fullName}
                            </TableCell>
                            <TableCell className='hidden md:flex sm:hidden'>{log.detainee.cpf}</TableCell>
                            <TableCell>{log.status}</TableCell>
                            <TableCell>
                                {log.last_violation && log.last_violation.trim() !== ''
                                    ? new Date(log.last_violation).toLocaleDateString()
                                    : 'Sem violação'}
                            </TableCell>
                            <TableCell>
                                {log.alerts ? log.alerts : 'N/A'}
                            </TableCell>
                            <TableCell className='hidden md:flex sm:hidden'>
                                {new Date(log.updated_at).toLocaleDateString()}
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );
}