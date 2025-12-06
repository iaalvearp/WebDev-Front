import { useEffect, useState } from 'react';

type ThemeMode = 'light' | 'dark' | 'auto';
type AppliedTheme = 'light' | 'dark';

export function useTheme() {
    // Detectar el tema preferido del sistema
    const getSystemTheme = (): AppliedTheme => {
        if (typeof window === 'undefined') return 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    // Obtener el modo guardado o usar 'auto' por defecto
    const getInitialMode = (): ThemeMode => {
        if (typeof window === 'undefined') return 'auto';

        const savedMode = localStorage.getItem('themeMode') as ThemeMode | null;
        return savedMode || 'auto';
    };

    const [mode, setMode] = useState<ThemeMode>(getInitialMode);
    const [appliedTheme, setAppliedTheme] = useState<AppliedTheme>(() => {
        if (typeof window === 'undefined') return 'dark';
        const initialMode = getInitialMode();
        return initialMode === 'auto' ? getSystemTheme() : initialMode;
    });

    // Aplicar el tema al elemento HTML
    const applyTheme = (theme: AppliedTheme) => {
        const root = document.documentElement;

        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }

        setAppliedTheme(theme);
    };

    useEffect(() => {
        // Determinar qué tema aplicar según el modo
        let themeToApply: AppliedTheme;

        if (mode === 'auto') {
            themeToApply = getSystemTheme();
        } else {
            themeToApply = mode;
        }

        applyTheme(themeToApply);

        // Guardar modo en localStorage
        localStorage.setItem('themeMode', mode);
    }, [mode]);

    // Escuchar cambios en la preferencia del sistema (solo si está en modo auto)
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = (e: MediaQueryListEvent) => {
            if (mode === 'auto') {
                applyTheme(e.matches ? 'dark' : 'light');
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [mode]);

    const setThemeMode = (newMode: ThemeMode) => {
        setMode(newMode);
    };

    const cycleTheme = () => {
        const modes: ThemeMode[] = ['light', 'auto', 'dark'];
        const currentIndex = modes.indexOf(mode);
        const nextIndex = (currentIndex + 1) % modes.length;
        setMode(modes[nextIndex]);
    };

    return {
        mode,           // 'light' | 'dark' | 'auto'
        appliedTheme,   // 'light' | 'dark' (tema actualmente aplicado)
        setThemeMode,
        cycleTheme
    };
}
