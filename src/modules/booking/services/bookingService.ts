const API_URL = 'http://localhost:8080/api';

export interface Sala {
    id: number;
    nombre: string;
    tipo: string;
    capacidad: number;
    filas: number;
    asientosPorFila: number;
    cinemaId: number;
}

export interface TipoEntrada {
    id: string;
    name: string;
    price: number;
    description?: string;
    roomType?: string;
}

interface BackendSala {
    id: number;
    nombre: string;
    tipo: string;
    capacidad: number;
    filas: number;
    asientosPorFila: number;
    cinema: {
        id: number;
        nombre: string;
    };
}

interface BackendTipoEntrada {
    id: number;
    nombre: string;
    precio: number;
    descripcion?: string;
    tipoSala?: string;
}

export const getSalas = async (cinemaId?: number): Promise<Sala[]> => {
    try {
        let url = `${API_URL}/salas`;
        if (cinemaId) {
            url += `?cinemaId=${cinemaId}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error fetching salas');
        }
        const data: BackendSala[] = await response.json();

        return data.map(sala => ({
            id: sala.id,
            nombre: sala.nombre,
            tipo: sala.tipo,
            capacidad: sala.capacidad,
            filas: sala.filas,
            asientosPorFila: sala.asientosPorFila,
            cinemaId: sala.cinema.id,
        }));
    } catch (error) {
        console.error('Error fetching salas:', error);
        return [];
    }
};

export const getTiposEntradas = async (tipoSala?: string): Promise<TipoEntrada[]> => {
    try {
        let url = `${API_URL}/tipos-entradas`;
        if (tipoSala) {
            url += `?tipoSala=${tipoSala}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error fetching tipos de entradas');
        }
        const data: BackendTipoEntrada[] = await response.json();

        return data.map(tipo => ({
            id: tipo.id.toString(),
            name: tipo.nombre,
            price: tipo.precio,
            description: tipo.descripcion,
            roomType: tipo.tipoSala,
        }));
    } catch (error) {
        console.error('Error fetching tipos de entradas:', error);
        return [];
    }
};
