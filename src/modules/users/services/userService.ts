import type { User } from '../types/User';

const API_URL = 'http://localhost:8080/api/usuarios';

export const userService = {
    getAll: async (): Promise<User[]> => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Error al obtener usuarios');
            return await response.json();
        } catch (error) {
            console.error('Error in getAll:', error);
            throw error;
        }
    },

    getById: async (id: number): Promise<User> => {
        try {
            const response = await fetch(`${API_URL}/${id}`);
            if (!response.ok) throw new Error('Error al obtener usuario');
            return await response.json();
        } catch (error) {
            console.error('Error in getById:', error);
            throw error;
        }
    },

    create: async (user: User): Promise<User> => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user),
            });
            if (!response.ok) throw new Error('Error al crear usuario');
            return await response.json();
        } catch (error) {
            console.error('Error in create:', error);
            throw error;
        }
    },

    update: async (id: number, user: Partial<User>): Promise<User> => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user),
            });
            if (!response.ok) throw new Error('Error al actualizar usuario');
            return await response.json();
        } catch (error) {
            console.error('Error in update:', error);
            throw error;
        }
    },

    delete: async (id: number): Promise<void> => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Error al eliminar usuario');
        } catch (error) {
            console.error('Error in delete:', error);
            throw error;
        }
    },
};
