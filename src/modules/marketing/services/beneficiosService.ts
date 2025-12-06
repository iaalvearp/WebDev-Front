export interface Beneficio {
    id: number;
    titulo: string;
    descripcion: string;
    imagen: string; // URL relativa o absoluta
}

const API_URL = '/api/beneficios';

interface BackendBeneficio {
    id: number;
    title: string;
    description: string;
    icon: string;
    color: string;
}

export const getBeneficios = async (): Promise<Beneficio[]> => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Error fetching beneficios');
        }
        const data: BackendBeneficio[] = await response.json();

        return data.map(item => ({
            id: item.id,
            titulo: item.title,
            descripcion: item.description,
            imagen: '' // Dejamos vacío para que use los iconos por defecto del frontend
        }));
    } catch (error) {
        console.error('Error fetching beneficios:', error);
        return [];
    }
};
