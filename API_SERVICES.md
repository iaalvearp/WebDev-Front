# 🔌 Servicios de API - To Talk Cinema

## 📝 Resumen

Este documento describe todos los servicios creados para conectar el frontend con el backend Spring Boot.

---

## 🏗️ Estructura de Servicios

Todos los servicios siguen la **Screaming Architecture** y están organizados por módulo:

```
src/
├── config/
│   └── api.ts                    # Configuración central de API
├── shared/services/
│   └── locationService.ts        # Ciudades y Cines
└── modules/
    ├── cartelera/services/
    │   ├── peliculasService.ts   # Películas
    │   └── funcionesService.ts   # Funciones/Horarios
    ├── booking/services/
    │   └── bookingService.ts     # Salas y Tipos de Entradas
    ├── snacks/services/
    │   └── snacksService.ts      # Dulcería
    └── marketing/services/
        ├── beneficiosService.ts  # Beneficios
        └── promocionesService.ts # Promociones
```

---

## 🎬 Módulo Cartelera

### **peliculasService.ts**

```typescript
import { getPeliculas, getPeliculaById } from '@/modules/cartelera/services/peliculasService';

// Obtener todas las películas
const peliculas = await getPeliculas();

// Obtener una película específica
const pelicula = await getPeliculaById(1);
```

**Endpoints:**
- `GET http://localhost:8080/api/peliculas`
- `GET http://localhost:8080/api/peliculas/{id}`

---

### **funcionesService.ts**

```typescript
import { getFunciones, getFuncionById } from '@/modules/cartelera/services/funcionesService';

// Obtener todas las funciones
const funciones = await getFunciones();

// Filtrar por película
const funcionesPelicula = await getFunciones({ peliculaId: 1 });

// Filtrar por fecha
const funcionesFecha = await getFunciones({ fecha: '2024-12-05' });

// Filtrar por ambos
const funcionesFiltradas = await getFunciones({ 
  peliculaId: 1, 
  fecha: '2024-12-05' 
});

// Obtener una función específica
const funcion = await getFuncionById(1);
```

**Endpoints:**
- `GET http://localhost:8080/api/funciones`
- `GET http://localhost:8080/api/funciones?peliculaId=1`
- `GET http://localhost:8080/api/funciones?fecha=2024-12-05`
- `GET http://localhost:8080/api/funciones/{id}`

---

## 📍 Módulo Ubicación (Shared)

### **locationService.ts**

```typescript
import { getCities, getCinemas } from '@/shared/services/locationService';

// Obtener todas las ciudades
const cities = await getCities();

// Obtener todos los cines
const cinemas = await getCinemas();

// Filtrar cines por ciudad
const cinemasQuito = await getCinemas('quito');
```

**Endpoints:**
- `GET http://localhost:8080/api/cities`
- `GET http://localhost:8080/api/cinemas`
- `GET http://localhost:8080/api/cinemas?city=quito`

---

## 🎟️ Módulo Booking

### **bookingService.ts**

```typescript
import { getSalas, getTiposEntradas } from '@/modules/booking/services/bookingService';

// Obtener todas las salas
const salas = await getSalas();

// Filtrar salas por cine
const salasCine = await getSalas(1);

// Obtener todos los tipos de entradas
const tiposEntradas = await getTiposEntradas();

// Filtrar por tipo de sala
const entradasVIP = await getTiposEntradas('VIP');
```

**Endpoints:**
- `GET http://localhost:8080/api/salas`
- `GET http://localhost:8080/api/salas?cinemaId=1`
- `GET http://localhost:8080/api/tipos-entradas`
- `GET http://localhost:8080/api/tipos-entradas?tipoSala=VIP`

---

## 🍿 Módulo Snacks

### **snacksService.ts**

```typescript
import { getSnacks, getSnacksByCategory } from '@/modules/snacks/services/snacksService';

// Obtener todos los snacks
const snacks = await getSnacks();

// Filtrar por categoría
const combos = await getSnacksByCategory('combos');
const popcorn = await getSnacksByCategory('popcorn');
const bebidas = await getSnacksByCategory('bebidas');
```

**Endpoints:**
- `GET http://localhost:8080/api/snacks`

---

## 🎁 Módulo Marketing

### **beneficiosService.ts**

```typescript
import { getBeneficios } from '@/modules/marketing/services/beneficiosService';

// Obtener todos los beneficios
const beneficios = await getBeneficios();
```

**Endpoints:**
- `GET http://localhost:8080/api/beneficios`

---

### **promocionesService.ts**

```typescript
import { getPromociones, getPromocionesActivas } from '@/modules/marketing/services/promocionesService';

// Obtener todas las promociones
const promociones = await getPromociones();

// Solo promociones activas
const activas = await getPromocionesActivas();
```

**Endpoints:**
- `GET http://localhost:8080/api/promociones`

---

## 🔧 Configuración API (api.ts)

El archivo `src/config/api.ts` contiene:

### **Constantes**
```typescript
export const API_BASE_URL = 'http://localhost:8080/api';
export const API_ENDPOINTS = { /* ... todos los endpoints ... */ };
```

### **Helper buildUrl**
```typescript
import { buildUrl, API_ENDPOINTS } from '@/config/api';

// Construir URL con query params
const url = buildUrl(API_ENDPOINTS.FUNCIONES, { 
  peliculaId: 1, 
  fecha: '2024-12-05' 
});
// Resultado: http://localhost:8080/api/funciones?peliculaId=1&fecha=2024-12-05
```

---

## 📦 Tipos de Datos

Todos los servicios tienen interfaces TypeScript bien definidas:

- **Pelicula**: Coincide con el backend (campos en camelCase)
- **Showtime**: Mapea desde `Funcion` del backend
- **Snack**: Mapea desde backend con categorías tipadas
- **TipoEntrada**: Tipos de entradas con precios
- **Sala**: Información de salas de cine
- **City** & **Cinema**: Datos de ubicación

---

## 🔄 Mapeo Backend → Frontend

Todos los servicios incluyen funciones de mapeo para convertir:
- Nombres de campos del backend (español/snake_case/camelCase)
- A nombres del frontend (camelCase consistente)
- Con tipos TypeScript correctos

Ejemplo en `funcionesService.ts`:
```typescript
// Backend devuelve:
{
  id: 1,
  hora: "14:30",
  sala: { nombre: "Sala IMAX", tipo: "IMAX" }
}

// Frontend recibe:
{
  id: 1,
  time: "14:30",
  room: "Sala IMAX",
  roomType: "IMAX"
}
```

---

## 🚀 Próximos Pasos

Para usar estos servicios en los componentes:

1. **Reemplazar imports de mockData** por imports de servicios
2. **Usar useEffect o React Query** para fetch de datos
3. **Manejar estados de loading y error**
4. **Actualizar tipos** donde sea necesario

Ejemplo:
```typescript
// ANTES
import { movies } from '@/data/mockData';

// DESPUÉS
import { useEffect, useState } from 'react';
import { getPeliculas, type Pelicula } from '@/modules/cartelera/services/peliculasService';

function Component() {
  const [movies, setMovies] = useState<Pelicula[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPeliculas().then(data => {
      setMovies(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Cargando...</div>;
  return <div>{/* render movies */}</div>;
}
```

---

## ⚠️ Notas Importantes

1. **CORS**: Asegúrate de que el backend tenga CORS configurado para `http://localhost:4321` (o el puerto de Astro)
2. **Error Handling**: Todos los servicios devuelven arrays vacíos o null en caso de error y logean en consola
3. **URL Base**: Cambiar `API_BASE_URL` en `config/api.ts` para deploy a producción
4. **Testing**: Los servicios son fáciles de mockear para pruebas unitarias

---

## 📝 Estado Actual

✅ Todos los servicios creados  
✅ Tipos TypeScript definidos  
✅ Mapeo de datos implementado  
⏳ Pendiente: Integrar en componentes  
⏳ Pendiente: Eliminar mockData.ts cuando todo esté migrado
