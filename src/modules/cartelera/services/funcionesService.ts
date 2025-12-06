const API_URL = 'http://localhost:8080/api/funciones';

export interface Showtime {
    id: number;
    time: string;
    date: string;
    format: string;
    room: string;
    roomType: string;
    language: string;
    available: boolean;
    availableSeats: number;
    movieId: number;
    salaId: number;
}

// Backend devuelve objetos anidados completos
interface BackendShowtime {
    id: number;
    fecha: string;
    hora: string;
    formato: string;
    idioma: string;
    disponible: boolean;
    asientosDisponibles: number;
    movie: {
        id: number;
        title: string;
    };
    sala: {
        id: number;
        nombre: string;
        tipo: string;
    };
}

export const getFunciones = async (filters?: {
    peliculaId?: number | string;
    fecha?: string;
}): Promise<Showtime[]> => {
    try {
        let url = API_URL;
        const params = new URLSearchParams();

        if (filters?.peliculaId) {
            params.append('peliculaId', filters.peliculaId.toString());
        }
        if (filters?.fecha) {
            params.append('fecha', filters.fecha);
        }

        if (params.toString()) {
            url += `?${params.toString()}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error fetching funciones');
        }
        const data: BackendShowtime[] = await response.json();

        return data.map(funcion => ({
            id: funcion.id,
            time: funcion.hora,
            date: funcion.fecha,
            format: funcion.formato,
            room: funcion.sala.nombre,
            roomType: funcion.sala.tipo,
            language: funcion.idioma,
            available: funcion.disponible,
            availableSeats: funcion.asientosDisponibles,
            movieId: funcion.movie.id,
            salaId: funcion.sala.id,
        }));
    } catch (error) {
        console.error('Error fetching funciones:', error);
        return [];
    }
};

export const getFuncionById = async (id: number): Promise<Showtime | null> => {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
            throw new Error('Error fetching función');
        }
        const funcion: BackendShowtime = await response.json();

        return {
            id: funcion.id,
            time: funcion.hora,
            date: funcion.fecha,
            format: funcion.formato,
            room: funcion.sala.nombre,
            roomType: funcion.sala.tipo,
            language: funcion.idioma,
            available: funcion.disponible,
            availableSeats: funcion.asientosDisponibles,
            movieId: funcion.movie.id,
            salaId: funcion.sala.id,
        };
    } catch (error) {
        console.error('Error fetching función:', error);
        return null;
    }
};
