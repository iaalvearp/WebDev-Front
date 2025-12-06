export interface Promocion {
    id: number;
    titulo: string;
    descripcion: string;
    imagen: string; // URL relativa o absoluta
    descuento?: string;
    codigo?: string;
}

const API_URL = '/api/promociones';

interface BackendPromocion {
    id: number;
    title: string;
    description: string;
    discount: string;
    validity: string;
    image: string;
}

export const getPromociones = async (): Promise<Promocion[]> => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Error fetching promociones');
        }
        const data: BackendPromocion[] = await response.json();

        return data.map(item => ({
            id: item.id,
            titulo: item.title,
            descripcion: item.description,
            imagen: item.image,
            descuento: item.discount,
            codigo: item.validity // Mapeamos validity a codigo para que se muestre en el componente
        }));
    } catch (error) {
        console.error('Error fetching promociones:', error);
        return [];
    }
};
