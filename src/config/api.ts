export const API_BASE_URL = 'http://localhost:8080/api';

export const API_ENDPOINTS = {
    // Películas
    PELICULAS: `${API_BASE_URL}/peliculas`,

    // Funciones
    FUNCIONES: `${API_BASE_URL}/funciones`,

    // Ubicación
    CITIES: `${API_BASE_URL}/cities`,
    CINEMAS: `${API_BASE_URL}/cinemas`,

    // Booking
    SALAS: `${API_BASE_URL}/salas`,
    TIPOS_ENTRADAS: `${API_BASE_URL}/tipos-entradas`,

    // Snacks
    SNACKS: `${API_BASE_URL}/snacks`,

    // Marketing
    BENEFICIOS: `${API_BASE_URL}/beneficios`,
    PROMOCIONES: `${API_BASE_URL}/promociones`,

    // Auth
    AUTH_LOGIN: `${API_BASE_URL}/auth/login`,
    USUARIOS: `${API_BASE_URL}/usuarios`,
};

// Helper para construir URLs con query params
export const buildUrl = (baseUrl: string, params?: Record<string, string | number>): string => {
    if (!params || Object.keys(params).length === 0) {
        return baseUrl;
    }

    const queryString = new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
            acc[key] = value.toString();
            return acc;
        }, {} as Record<string, string>)
    ).toString();

    return `${baseUrl}?${queryString}`;
};
