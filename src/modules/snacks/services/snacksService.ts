const API_URL = 'http://localhost:8080/api/snacks';

export interface Snack {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    category: 'combos' | 'popcorn' | 'bebidas' | 'snacks' | 'dulces';
    available: boolean;
}

// Backend uses English keys as per user request
interface BackendSnack {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
}

export const getSnacks = async (): Promise<Snack[]> => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Error fetching snacks');
        }
        const data: BackendSnack[] = await response.json();

        return data.map(snack => ({
            id: snack.id,
            name: snack.name,
            description: snack.description,
            price: snack.price,
            image: snack.image,
            category: snack.category as Snack['category'],
            available: true, // API doesn't send availability, assume true
        }));
    } catch (error) {
        console.error('Error fetching snacks:', error);
        return [];
    }
};

export const getSnacksByCategory = async (
    category: Snack['category']
): Promise<Snack[]> => {
    const allSnacks = await getSnacks();
    return allSnacks.filter(snack => snack.category === category && snack.available);
};
