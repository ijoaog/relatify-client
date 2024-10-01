import { loadEnvVariables } from '@/configs/centralConfigs';
import { MonitoringLog } from './MonitoringService';

const envVariables = loadEnvVariables();

export async function sendJsonFromPDF(
    json: MonitoringLog[]
): Promise<Blob> {
    try {
        const response = await fetch(
            `${envVariables.BACKEND_URL}/pdf/generate`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${envVariables.BEARER_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(json),
            }
        );

        if (!response.ok) {
            throw new Error(
                `Erro na requisição: ${response.status} ${response.statusText}`
            );
        }

        // Retornar a resposta como um Blob
        return await response.blob();
    } catch (error) {
        console.error('Erro ao enviar JSON:', error);
        throw new Error(
            `Erro ao enviar JSON: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
        );
    }
}

export const downloadPDF = (pdfBlob: Blob, fileName: string) => {
    // Criar um URL para o blob
    const url = window.URL.createObjectURL(pdfBlob);

    // Criar um link temporário para o download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName); // Nome do arquivo
    document.body.appendChild(link);
    link.click();

    // Remover o link temporário após o download
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url); // Liberar o URL do blob
};
