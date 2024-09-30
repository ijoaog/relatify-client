import { loadEnvVariables } from '@/configs/centralConfigs';
import { MonitoringLog } from './MonitoringService';

export interface Detainee {
    id: number;
    fullName: string;
    cpf: string;
    birthDate: string;
    caseNumber: string;
    prisonId: number;
    monitoringStatus: string;
    createdAt: string;
    monitoringReports: MonitoringLog[];
}

export default class DetaineeService {
    private baseUrl: string;
    private bearerToken: string;

    constructor() {
        const envVariables = loadEnvVariables();

        if (!envVariables.BACKEND_URL) {
            throw new Error('BACKEND_URL is not defined');
        }

        if (!envVariables.BEARER_TOKEN) {
            throw new Error('BEARER_TOKEN is not defined');
        }

        this.baseUrl = envVariables.BACKEND_URL;
        this.bearerToken = envVariables.BEARER_TOKEN;
    }

    public async getAllDetainees(): Promise<Detainee[]> {
        try {
            const response = await fetch(
                `${this.baseUrl}/monitored-individuals`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${this.bearerToken}`,
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

            const detainees: Detainee[] = await response.json();

            if (!Array.isArray(detainees)) {
                throw new Error('Response is not an array');
            }

            return detainees;
        } catch (error: unknown) {
            // Faz um type narrowing para garantir que lidamos com o erro da forma correta
            if (error instanceof Error) {
                console.error('Error fetching data:', error.message);
                throw new Error(error.message); // Relança o erro para ser tratado externamente
            } else {
                console.error('An unknown error occurred');
                throw new Error('An unknown error occurred');
            }
        }
    }
}
