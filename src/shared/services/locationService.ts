const API_URL = 'http://localhost:8080/api';

export interface City {
    id: string;
    name: string;
}

export interface Cinema {
    id: string;
    name: string;
    city: string;
    address: string;
}

interface BackendCity {
    id: number;
    nombre: string;
}

interface BackendCinema {
    id: number;
    nombre: string;
    ciudad: string | { id: number; nombre: string };
    direccion: string;
}

export const getCities = async (): Promise<City[]> => {
    try {
        const response = await fetch(`${API_URL}/cities`);
        if (!response.ok) {
            throw new Error('Error fetching cities');
        }
        const data: BackendCity[] = await response.json();

        return data.map(city => ({
            id: city.id.toString(),
            name: city.nombre,
        }));
    } catch (error) {
        console.error('Error fetching cities:', error);
        return [];
    }
};

export const getCinemas = async (cityId?: string): Promise<Cinema[]> => {
    try {
        let url = `${API_URL}/cinemas`;
        if (cityId) {
            url += `?city=${cityId}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error fetching cinemas');
        }
        const data: BackendCinema[] = await response.json();

        return data.map(cinema => ({
            id: cinema.id.toString(),
            name: cinema.nombre,
            city: typeof cinema.ciudad === 'string' ? cinema.ciudad : cinema.ciudad.nombre,
            address: cinema.direccion,
        }));
    } catch (error) {
        console.error('Error fetching cinemas:', error);
        return [];
    }
};
