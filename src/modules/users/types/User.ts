export interface User {
    id?: number;
    nombre: string;
    email: string;
    password?: string; // Optional for display, required for creation/update if changing
    rol: 'ADMIN' | 'USER';
}
