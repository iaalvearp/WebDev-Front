export type FieldType = 'text' | 'number' | 'date' | 'time' | 'datetime' | 'textarea' | 'select' | 'multi-select' | 'boolean';

export interface AdminField {
    name: string;
    label: string;
    type: FieldType;
    sourceEndpoint?: string;
    sourceLabel?: string;
    sourceValue?: string;
    readOnly?: boolean;
    dependentField?: string;
    dependentParam?: string;
    virtual?: boolean;
}

export interface AdminTableConfig {
    label: string;
    endpoint: string;
    fields: AdminField[];
}

export const adminSchema: AdminTableConfig[] = [
    {
        label: 'PELICULAS',
        endpoint: '/api/peliculas',
        fields: [
            { name: 'title', label: 'Título', type: 'text' },
            { name: 'synopsis', label: 'Sinopsis', type: 'textarea' },
            { name: 'director', label: 'Director', type: 'text' },
            { name: 'duration', label: 'Duración (ej: 2h 15m)', type: 'text' },
            { name: 'rating', label: 'Clasificación', type: 'text' },
            { name: 'poster', label: 'Poster URL', type: 'text' },
            { name: 'backdrop', label: 'Banner URL', type: 'text' },
            { name: 'genre', label: 'Géneros', type: 'multi-select', sourceEndpoint: '/api/generos', sourceLabel: 'nombre', sourceValue: 'nombre' }, // Java guarda el string, no el ID
            { name: 'cast', label: 'Actores', type: 'textarea' }, // Simplificado para MVP
            { name: 'formats', label: 'Formatos', type: 'multi-select', sourceEndpoint: '/api/formatos', sourceLabel: 'name', sourceValue: 'name' },
            { name: 'anio', label: 'Año', type: 'number' },
            { name: 'preSale', label: 'Pre-venta', type: 'boolean' }
        ]
    },
    {
        label: 'SNACKS',
        endpoint: '/api/snacks',
        fields: [
            { name: 'name', label: 'Nombre', type: 'text' },
            { name: 'description', label: 'Descripción', type: 'textarea' },
            { name: 'price', label: 'Precio', type: 'number' },
            { name: 'category', label: 'Categoría', type: 'text' },
            { name: 'image', label: 'URL Imagen', type: 'text' }
        ]
    },
    {
        label: 'CINES',
        endpoint: '/api/cinemas', // CORREGIDO (Inglés)
        fields: [
            { name: 'name', label: 'Nombre', type: 'text' }, // CORREGIDO (name)
            { name: 'address', label: 'Dirección', type: 'text' }, // CORREGIDO (address)
            { name: 'cityId', label: 'Ciudad', type: 'select', sourceEndpoint: '/api/cities', sourceLabel: 'name', sourceValue: 'id' } // CORREGIDO
        ]
    },
    {
        label: "FUNCIONES",
        endpoint: "/api/funciones",
        fields: [
            { name: "salaId", label: "Sala", type: "select", sourceEndpoint: "/api/salas", sourceLabel: "name", sourceValue: "id" },
            { name: "movieId", label: "Película", type: "select", sourceEndpoint: "/api/peliculas", sourceLabel: "title", sourceValue: "id" },
            { name: "date", label: "Fecha", type: "date" },
            { name: "time", label: "Hora", type: "time" },
            { name: "format", label: "Formato (2D, 3D)", type: "text" },
            { name: "language", label: "Idioma (ESP, SUB)", type: "text" },
            { name: "price", label: "Precio", type: "number" },
            { name: "available", label: "Disponible", type: "boolean" }
        ]
    },
    {
        label: "SALAS",
        endpoint: "/api/salas",
        fields: [
            { name: "name", label: "Nombre", type: 'text' },
            { name: "type", label: "Tipo (Normal, VIP, IMAX, 4D)", type: "text" },
            { name: "capacity", label: "Capacidad", type: "number" },
            { name: "cinemaId", label: "Cine", type: "select", sourceEndpoint: '/api/cinemas', sourceLabel: "name", sourceValue: "id" }
        ]
    },
    {
        label: "TARIFAS",
        endpoint: "/api/tipos-entradas",
        fields: [
            { name: "name", label: "Nombre", type: "text" },
            { name: "price", label: "Precio", type: "number" },
            { name: "description", label: "Descripción", type: "text" }
        ]
    },
    {
        label: 'USUARIOS',
        endpoint: '/api/usuarios',
        fields: [
            { name: 'nombre', label: 'Nombre', type: 'text' },
            { name: 'email', label: 'Email', type: 'text' },
            { name: 'password', label: 'Contraseña', type: 'text' },
            { name: 'rol', label: 'Rol (USER/ADMIN)', type: 'text' }
        ]
    },
    {
        label: 'CIUDADES',
        endpoint: '/api/cities', // CORREGIDO (Inglés)
        fields: [
            { name: 'id', label: 'ID (ej: quito)', type: 'text' },
            { name: 'name', label: 'Nombre', type: 'text' }
        ]
    },
    {
        label: 'BENEFICIOS',
        endpoint: '/api/beneficios',
        fields: [
            { name: 'title', label: 'Título', type: 'text' },
            { name: 'description', label: 'Descripción', type: 'textarea' },
            { name: 'icon', label: 'Icono', type: 'text' },
            { name: 'color', label: 'Color', type: 'text' }
        ]
    },
    {
        label: 'PROMOCIONES',
        endpoint: '/api/promociones',
        fields: [
            { name: 'title', label: 'Título', type: 'text' },
            { name: 'description', label: 'Descripción', type: 'textarea' },
            { name: 'discount', label: 'Descuento', type: 'text' },
            { name: 'validity', label: 'Validez', type: 'text' },
            { name: 'image', label: 'Emoji/Icono', type: 'text' }
        ]
    },
    {
        label: 'GÉNEROS',
        endpoint: '/api/generos',
        fields: [
            { name: 'nombre', label: 'Nombre', type: 'text' }
        ]
    }
];