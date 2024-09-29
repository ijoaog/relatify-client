export async function getAllMonitoring() {
    try {
        const response = await fetch(
            'http://localhost:3090/anklet-monitoring',
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            const errorText = await response.text(); // Captura o corpo da resposta como texto
            console.error('Error fetching data:', response.status, errorText);
            return [];
        }

        const getAllMonitoringLogs = await response.json();
        console.log('hehe', getAllMonitoringLogs);
        return getAllMonitoringLogs;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}
