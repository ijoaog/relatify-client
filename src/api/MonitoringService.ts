import loadEnvVariables from '../configs/centralConfigs';
import { Detainee } from './DetaineeService';

export interface MonitoringLog {
    detainee_id: number;
    device_serial: string;
    install_date: string;
    removal_date: string;
    status: string;
    location: string;
    last_violation: string;
    alerts: string;
    notes: string;
    created_at: string;
    updated_at: string;
    detainee: Detainee;
}

export default class MonitoringService {
    private baseUrl: string;
    private bearerToken: string;
    constructor() {
        const envVariables = loadEnvVariables();
        if (!envVariables.BACKEND_URL) {
            throw new Error('BACKEND_URL is not defined');
        }

        if (!envVariables.BEARER_TOKEN) {
            throw new Error('BACKEND_URL is not defined');
        }
        this.baseUrl = envVariables.BACKEND_URL;
        this.bearerToken = envVariables.BEARER_TOKEN;
    }

    async getAllMonitoring(): Promise<MonitoringLog[]> {
        try {
            const response = await fetch(`${this.baseUrl}/anklet-monitoring`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.bearerToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(
                    `Error fetching data: ${response.status} - ${errorText}`
                );
            }

            const monitoringLogs: MonitoringLog[] = await response.json();

            if (!Array.isArray(monitoringLogs)) {
                throw new Error('Response is not an array');
            }

            return monitoringLogs;
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Error fetching data:', error.message);
                throw new Error(error.message);
            } else {
                console.error('An unknown error occurred');
                throw new Error('An unknown error occurred');
            }
        }
    }

    async getAlertsInLastMonth(): Promise<MonitoringLog[]> {
        try {
            const response = await fetch(
                `${this.baseUrl}/anklet-monitoring/last-month`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(
                    `Error fetching data: ${response.status} - ${errorText}`
                );
            }
            const monitoringLogsLastMonth: MonitoringLog[] = await response.json();

            if (!Array.isArray(monitoringLogsLastMonth)) {
                throw new Error('Response is not an array');
            }

            return monitoringLogsLastMonth;
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Error fetching data:', error.message);
                throw new Error(error.message);
            } else {
                console.error('An unknown error occurred');
                throw new Error('An unknown error occurred');
            }
        }
    }
}
