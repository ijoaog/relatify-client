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
import { Detainee } from '@/api/DetaineeService';

interface RemovalTableProps {
    logs: Detainee[];
}

export function RemovalTable({ logs }: RemovalTableProps) {
    const sortedLogs = logs.sort((a, b) => {
        return new Date(b.id).getTime() - new Date(a.id).getTime();
    });

    return (
        <div className='my-5 flex h-full items-center justify-center'>
            <Table>
                <TableCaption>Tornozeleira removidas.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>CPF</TableHead>
                        <TableHead>Nome Completo</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedLogs.map((log) => {
                       
                        return (
                            <TableRow key={log.id}>
                                <TableCell>{log.cpf}</TableCell>
                                <TableCell className='font-medium'>
                                    {log.fullName}
                                </TableCell>
                                <TableCell>{log.monitoringStatus ? 'Removida' : 'N/A'}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
