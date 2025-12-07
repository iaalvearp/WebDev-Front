const API_URL = 'http://localhost:8080/api';

export interface City {
    id: string;
    name: string;
}

export interface Cinema {
    id: string;
    name: string;
    cityId: string;
    address: string;
}

export const getCities = async (): Promise<City[]> => {
    try {
        const response = await fetch(`${API_URL}/cities`);
        if (!response.ok) {
            throw new Error('Error fetching cities');
        }
        const data = await response.json();
        return data.map((city: any) => ({
            id: city.id.toString(),
            name: city.name,
        }));
    } catch (error) {
        console.error('Error fetching cities:', error);
        return [];
    }
};

export const getCinemas = async (cityId?: string): Promise<Cinema[]> => {
    try {
        // Fetch all cinemas or filter by city if the API supported it
        // Based on user input, we get the list and can filter client side or just return all
        // The header component handles filtering
        const response = await fetch(`${API_URL}/cinemas`);
        if (!response.ok) {
            throw new Error('Error fetching cinemas');
        }
        const data = await response.json();

        const mappedCinemas = data.map((cinema: any) => ({
            id: cinema.id.toString(),
            name: cinema.name,
            cityId: cinema.cityId,
            address: cinema.address,
        }));

        if (cityId) {
            return mappedCinemas.filter((c: Cinema) => c.cityId === cityId);
        }

        return mappedCinemas;
    } catch (error) {
        console.error('Error fetching cinemas:', error);
        return [];
    }
};
