"use client"

import { useTheme } from "@/hooks/useTheme";
import { Moon, Sun, MonitorSmartphone, Check } from "lucide-react";
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function ThemeSelector() {
    const { mode, appliedTheme, setThemeMode } = useTheme();

    const themes = [
        {
            id: 'light' as const,
            label: 'Claro',
            icon: Sun,
            description: 'Tema claro'
        },
        {
            id: 'auto' as const,
            label: 'Automático',
            icon: MonitorSmartphone,
            description: 'Sigue el sistema'
        },
        {
            id: 'dark' as const,
            label: 'Oscuro',
            icon: Moon,
            description: 'Tema oscuro'
        },
    ];

    const currentTheme = themes.find(t => t.id === mode) || themes[1];
    const CurrentIcon = currentTheme.icon;

    // Determinar color del icono basado en el tema APLICADO
    // Esto asegura que en modo auto, el color cambie con el sistema
    const getIconColor = () => {
        // Si está en modo auto, usar dorado siempre para el icono de monitor
        if (mode === 'auto') {
            return 'hsl(var(--cinema-gold))';
        }

        // Para otros modos, usar el tema aplicado actual
        if (appliedTheme === 'light') {
            return 'hsl(var(--foreground))';  // Negro en tema claro
        }
        return 'hsl(var(--cinema-gold))';  // Dorado en tema oscuro
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "relative w-10 h-10 rounded-full transition-all duration-300",
                        "hover:bg-primary/10 hover:scale-110",
                        "active:scale-95",
                        "[&_svg]:pointer-events-none [&_svg]:shrink-0"
                    )}
                >
                    <CurrentIcon
                        className="w-5 h-5 transition-all duration-300"
                        style={{ color: getIconColor() }}
                    />
                    {mode === 'auto' && (
                        <div
                            className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-primary animate-pulse"
                            aria-hidden="true"
                        />
                    )}
                    <span className="sr-only">Seleccionar tema</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                {themes.map((theme) => {
                    const Icon = theme.icon;
                    const isActive = mode === theme.id;
                    const isApplied = theme.id !== 'auto' && appliedTheme === theme.id;

                    return (
                        <DropdownMenuItem
                            key={theme.id}
                            onClick={() => setThemeMode(theme.id)}
                            className={cn(
                                "flex items-center gap-3 cursor-pointer",
                                isActive && "bg-primary/10"
                            )}
                        >
                            <Icon className="w-4 h-4" />
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span>{theme.label}</span>
                                    {isActive && <Check className="w-3 h-3 text-primary" />}
                                </div>
                                {mode === 'auto' && theme.id === 'auto' && (
                                    <span className="text-xs text-muted-foreground">
                                        Actualmente: {appliedTheme === 'dark' ? 'Oscuro' : 'Claro'}
                                    </span>
                                )}
                            </div>
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
