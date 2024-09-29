export async function getAllDetainees() {
    try {
        const response = await fetch(
            'http://localhost:3090/monitored-individuals',
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error(
                'Error fetching data:',
                response.status,
                errorText
            );
            return [];
        }

        const getAllDetainee = await response.json();
        console.log('hehe', getAllDetainee);
        return getAllDetainee;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}