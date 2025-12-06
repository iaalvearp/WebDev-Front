const API_URL = 'http://localhost:8080/api/peliculas';

export interface Pelicula {
    id: number;
    title: string;
    originalTitle?: string;
    poster: string;
    backdrop: string;
    duration: string;
    rating: string;
    genre: string[];
    synopsis: string;
    director: string;
    cast: string[];
    releaseDate: string;
    language: string;
    format: string[];
    isPreSale: boolean;
}

// Mapeo directo del backend (si los campos ya vienen en camelCase)
interface BackendPelicula {
    id: number;
    title: string;
    originalTitle?: string;
    poster: string;
    backdrop: string;
    duration: string;
    rating: string;
    genres: string[];
    synopsis: string;
    director: string;
    cast: string[];
    releaseDate: string;
    language: string;
    formats: string[];
    isPreSale: boolean;
}

export const getPeliculas = async (): Promise<Pelicula[]> => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Error fetching películas');
        }
        const data: BackendPelicula[] = await response.json();

        return data.map(movie => ({
            id: movie.id,
            title: movie.title,
            originalTitle: movie.originalTitle,
            poster: movie.poster,
            backdrop: movie.backdrop,
            duration: movie.duration,
            rating: movie.rating,
            genre: movie.genres,
            synopsis: movie.synopsis,
            director: movie.director,
            cast: movie.cast,
            releaseDate: movie.releaseDate,
            language: movie.language,
            format: movie.formats,
            isPreSale: movie.isPreSale,
        }));
    } catch (error) {
        console.error('Error fetching películas:', error);
        return [];
    }
};

export const getPeliculaById = async (id: number): Promise<Pelicula | null> => {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
            throw new Error('Error fetching película');
        }
        const movie: BackendPelicula = await response.json();

        return {
            id: movie.id,
            title: movie.title,
            originalTitle: movie.originalTitle,
            poster: movie.poster,
            backdrop: movie.backdrop,
            duration: movie.duration,
            rating: movie.rating,
            genre: movie.genres,
            synopsis: movie.synopsis,
            director: movie.director,
            cast: movie.cast,
            releaseDate: movie.releaseDate,
            language: movie.language,
            format: movie.formats,
            isPreSale: movie.isPreSale,
        };
    } catch (error) {
        console.error('Error fetching película:', error);
        return null;
    }
};
