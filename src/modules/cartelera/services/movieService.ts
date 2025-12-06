import type { Movie } from '@/modules/cartelera/types/Movie';

// Interfaz que representa la estructura exacta que devuelve el backend
interface BackendMovie {
    id: number | string;
    title: string;
    originalTitle?: string;
    poster: string;
    backdrop?: string;
    duration: string;
    rating: string;
    genre: string[];
    synopsis: string;
    director: string;
    cast: string[];
    releaseDate: string;
    language: string;
    format: string[];
    preSale?: boolean; // El backend usa 'preSale', pero el frontend espera 'isPreSale'
}

// URL del backend (usando proxy para evitar CORS)
const API_URL = '/api/peliculas';

// Removed mapTitleToFilename as backend provides full paths

/**
 * Adaptador para transformar una película del backend al formato del frontend.
 */
const adaptMovie = (backendMovie: BackendMovie): Movie => {
    // Backend provides paths like /images/banner/gladiador-banner.webp
    // These should work directly if served by backend or present in public folder

    // Ensure paths start with / if they are relative and not empty
    let posterPath = backendMovie.poster;
    if (posterPath && !posterPath.startsWith('http') && !posterPath.startsWith('/')) {
        posterPath = `/${posterPath}`;
    }

    let backdropPath = backendMovie.backdrop || '';
    if (backdropPath && !backdropPath.startsWith('http') && !backdropPath.startsWith('/')) {
        backdropPath = `/${backdropPath}`;
    }

    return {
        id: String(backendMovie.id),
        title: backendMovie.title,
        originalTitle: backendMovie.originalTitle,
        poster: posterPath,
        backdrop: backdropPath,
        duration: backendMovie.duration,
        rating: backendMovie.rating,
        genre: backendMovie.genre,
        synopsis: backendMovie.synopsis,
        director: backendMovie.director,
        cast: backendMovie.cast,
        releaseDate: backendMovie.releaseDate,
        language: backendMovie.language,
        format: backendMovie.format,
        isPreSale: backendMovie.preSale || false,
    };
};

/**
 * Servicio para obtener las películas desde el backend.
 */
export const movieService = {
    getMovies: async (): Promise<Movie[]> => {
        try {
            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error(`Error fetching movies: ${response.statusText}`);
            }

            const data: BackendMovie[] = await response.json();
            // console.log('Raw movies data from backend:', data);

            // Transformamos cada película usando el adaptador
            return data.map(adaptMovie);
        } catch (error) {
            console.error('Error in movieService.getMovies:', error);
            throw error;
        }
    },
};
