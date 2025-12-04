export interface Movie {
    id: string;
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
    isPreSale?: boolean;
    trailerUrl?: string;
}
