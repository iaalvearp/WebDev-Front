# Sistema de Temas - To Talk Cinema

## 🌓 Características del Sistema de Temas

Este proyecto incluye un sistema completo de temas con las siguientes características avanzadas:

### ✅ Tres Modos de Tema
1. **🌞 Claro**: Tema claro con tonos suaves y brillantes
2. **🌙 Oscuro**: Tema oscuro con colores profundos y alto contraste
3. **🖥️ Automático**: Sigue las preferencias del sistema operativo del usuario

### 🔄 Ciclo de Temas
- Clic en el botón para ciclar entre: Claro → Auto → Oscuro → Claro
- Cada modo tiene su propio icono distintivo:
  - ☀️ Sol para modo claro
  - 🖥️ Monitor para modo automático (con indicador pulsante)
  - 🌙 Luna para modo oscuro

### ⚡ Transiciones Suaves
- Todos los cambios de color tienen transiciones CSS suaves de 300ms
- Incluye transiciones para:
  - Colores de fondo
  - Colores de texto
  - Colores de borde
  - Sombras

### 💾 Persistencia Inteligente
- Guarda el **modo** seleccionado (no solo el tema aplicado)
- Si seleccionas "Automático", siempre seguirá el sistema
- El modo se mantiene entre sesiones

### 🎯 Sin Flash de Tema
- Script inline en el `<head>` que detecta y aplica el tema antes del renderizado
- Experiencia fluida sin parpadeos molestos

### 🎨 Dos Componentes Disponibles

#### 1. **ThemeToggle** (Actual)
- Botón simple que cicla entre los 3 modos
- Animaciones suaves de rotación y escala
- Indicador visual cuando está en modo "Auto"

#### 2. **ThemeSelector** (Alternativo)
- Menú dropdown con las 3 opciones
- Muestra checkmark en el modo activo
- Cuando está en "Auto", muestra qué tema está aplicado actualmente
- Mejor para usuarios que prefieren ver todas las opciones

## 📁 Archivos del Sistema

```
src/
├── hooks/
│   └── useTheme.ts                    # Hook con soporte para 3 modos
├── shared/components/
│   ├── ThemeToggle.tsx                # Botón toggle con ciclo
│   ├── ThemeSelector.tsx              # Selector dropdown
│   └── HeaderClient.tsx               # Header con toggle integrado
├── layouts/
│   └── Layout.astro                   # Layout con script anti-flash
└── styles/
    └── global.css                     # Variables CSS + transiciones
```

## 🎯 Uso

### Automático por Defecto
Por defecto, la aplicación usa el modo "Automático", que detecta y sigue las preferencias del sistema operativo del usuario.

### Cambiar Manualmente
Los usuarios pueden:
1. Hacer clic en el botón para ciclar: Claro → Auto → Oscuro
2. Ver visualmente qué modo está activo
3. Si está en "Auto", el indicador pulsante muestra que sigue el sistema

### Persistencia
- La preferencia se guarda en `localStorage` como `themeMode`
- El valor guardado puede ser: `'light'`, `'dark'`, o `'auto'`
- Se mantiene entre sesiones del navegador

## 🛠️ API del Hook

```typescript
const { 
  mode,          // 'light' | 'dark' | 'auto' - Modo seleccionado
  appliedTheme,  // 'light' | 'dark' - Tema actualmente aplicado
  setThemeMode,  // (mode: ThemeMode) => void - Establece un modo específico
  cycleTheme     // () => void - Cicla entre los 3 modos
} = useTheme();
```

### Ejemplos de Uso

```typescript
// Ciclar entre temas
<Button onClick={cycleTheme}>Cambiar Tema</Button>

// Establecer tema específico
<Button onClick={() => setThemeMode('dark')}>Modo Oscuro</Button>
<Button onClick={() => setThemeMode('auto')}>Modo Auto</Button>

// Mostrar tema actual
<span>Modo: {mode}</span>
<span>Aplicado: {appliedTheme}</span>

// Mostrar si está siguiendo el sistema
{mode === 'auto' && <Badge>Siguiendo el sistema</Badge>}
```

## 🎨 Personalización de Transiciones

### Ajustar Velocidad
En `global.css`, puedes modificar la duración de las transiciones:

```css
* {
  transition: background-color 0.3s ease,  /* Cambiar 0.3s a tu gusto */
              color 0.3s ease, 
              border-color 0.3s ease,
              box-shadow 0.3s ease;
}
```

### Desactivar Transiciones
Si prefieres cambios instantáneos, elimina o comenta las propiedades `transition`.

### Transiciones Personalizadas
Puedes usar diferentes curvas de timing:
- `ease` - Suave (predeterminado)
- `linear` - Constante
- `ease-in` - Acelera al final
- `ease-out` - Desacelera al final
- `ease-in-out` - Acelera y desacelera
- `cubic-bezier(...)` - Personalizado

## 📱 Ubicación del Toggle

- **Desktop**: Header principal, después de la navegación
- **Mobile**: Menú móvil con etiqueta "Tema"

## 🔄 Cambiar entre ThemeToggle y ThemeSelector

Para usar el selector dropdown en lugar del toggle:

En `HeaderClient.tsx`:
```tsx
// Cambiar la importación
import { ThemeSelector } from "@/shared/components/ThemeSelector"

// Cambiar el componente
<ThemeSelector />  // En lugar de <ThemeToggle />
```

## 🌍 Comportamiento del Modo Automático

Cuando está en modo "Auto":
1. Detecta la preferencia del sistema al cargar
2. Aplica el tema correspondiente (claro u oscuro)
3. Escucha cambios en las preferencias del sistema
4. Se actualiza automáticamente si el usuario cambia el tema del SO
5. Muestra un indicador pulsante en el botón

## 🎯 Casos de Uso

### Escenario 1: Usuario prefiere tema oscuro siempre
- Hacer clic hasta llegar a modo "Oscuro" (🌙)
- El tema oscuro se aplicará siempre, independientemente del sistema

### Escenario 2: Usuario quiere que siga el sistema
- Dejar en modo "Automático" (🖥️) o hacer clic hasta llegar a él
- El tema cambiará automáticamente si cambian la preferencia del sistema

### Escenario 3: Usuario cambia entre día y noche
- Modo "Automático" es ideal
- Durante el día: tema claro
- Durante la noche: tema oscuro
- Todo automático

## 🔧 Solución de Problemas

### El tema no persiste
- Verifica que localStorage esté habilitado
- Verifica la consola para errores de localStorage

### El modo Auto no detecta cambios del sistema
- Verifica que el navegador soporte `window.matchMedia`
- Algunos navegadores pueden necesitar permisos especiales

### Transiciones muy lentas/rápidas
- Ajusta el valor de `0.3s` en `global.css`

## 🎨 Colores del Tema Cinema

Variables personalizadas disponibles:
```css
--cinema-gold: 38 92% 50%;        /* Dorado principal */
--cinema-gold-light: 43 96% 58%;  /* Dorado claro */
--primary: 38 92% 50%;            /* Color primario */
```

Estas variables mantienen su valor en ambos temas para consistencia de marca.
