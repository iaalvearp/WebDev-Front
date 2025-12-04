import type { Pelicula } from '../types/Pelicula';

// URL de tu Backend Java
// OJO: Astro corre en el navegador, así que localhost es tu máquina
const API_URL = 'http://localhost:8080/api/peliculas';

export const getPeliculas = async (): Promise<Pelicula[]> => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Error al conectar con el servidor Java');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Fallo al traer películas:", error);
        return [];
    }
};