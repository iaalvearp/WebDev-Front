"use client"

import { useState } from "react"
import { Film, Candy, Gift, Percent, User } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { ThemeToggle } from "@/shared/components/ThemeToggle"
import { cities, cinemas } from "@/data/mockData"
import { useBooking } from "@/modules/booking/context/BookingContext"
import { cn } from "@/lib/utils"

interface HeaderClientProps {
    currentPage?: string
    [key: string]: any
}

const menuItems = [
    { id: "cartelera", label: "Cartelera", icon: Film },
    { id: "dulceria", label: "Dulcería", icon: Candy },
    { id: "beneficios", label: "Beneficios", icon: Gift },
    { id: "promociones", label: "Promociones", icon: Percent },
    { id: "perfil", label: "Perfil", icon: User },
]

export default function HeaderClient({ currentPage = "cartelera" }: HeaderClientProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { city, cinema, setCity, setCinema, getTotalTickets, user, logout } = useBooking()

    const filteredCinemas = cinemas.filter((c) => c.city === city)
    const totalTickets = getTotalTickets()

    const navigateTo = (path: string) => {
        window.location.href = `/${path}`
        // console.log(`Navigating to /${path}`)
        setMobileMenuOpen(false)
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 glass-effect">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigateTo("cartelera")}>
                        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                            <Film className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold text-gradient hidden sm:block">To Talk</span>
                    </div>

                    {/* Dropdowns - Desktop */}
                    <div className="hidden md:flex items-center gap-3">
                        <Select value={city} onValueChange={setCity}>
                            <SelectTrigger className="w-36 bg-secondary border-border">
                                <SelectValue placeholder="Ciudad" />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border-border">
                                {cities.map((c) => (
                                    <SelectItem key={c.id} value={c.id}>
                                        {c.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={cinema} onValueChange={setCinema}>
                            <SelectTrigger className="w-44 bg-secondary border-border">
                                <SelectValue placeholder="Cine" />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border-border">
                                {filteredCinemas.map((c) => (
                                    <SelectItem key={c.id} value={c.id}>
                                        {c.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Navigation - Desktop */}
                    <nav className="hidden xl:flex items-center gap-1">
                        {menuItems.map((item) => {
                            const isProfile = item.id === 'perfil'
                            const isActive = currentPage === item.id
                            return (
                                <Button
                                    key={item.id}
                                    variant="ghost"
                                    size="sm"
                                    className={cn(
                                        "flex items-center gap-2 transition-all duration-200 border-none",
                                        !isProfile && !isActive && "text-foreground/80 hover:text-cinema-gold hover:bg-transparent",
                                        !isProfile && isActive && "bg-white text-black font-bold",
                                        isProfile && "text-black hover:opacity-90 shadow-sm font-bold"
                                    )}
                                    style={(isActive && !isProfile) ? { boxShadow: '-20px -20px 28px #FFFFFF, 20px 20px 28px rgba(13, 39, 80, 0.18)' } : (isProfile ? { background: 'linear-gradient(to right, hsl(var(--cinema-gold)), hsl(var(--cinema-gold-light)))' } : undefined)}
                                    onClick={() => navigateTo(item.id)}
                                >
                                    <item.icon className={cn(
                                        "w-4 h-4",
                                        (!isProfile && isActive) ? "text-black" : ""
                                    )} />
                                    <span>{item.id === 'perfil' && user ? user.nombre : item.label}</span>
                                </Button>
                            )
                        })}

                        {/* Theme Toggle - Desktop */}
                        <div className="ml-2 pl-2 border-l border-border/40">
                            <ThemeToggle />
                        </div>
                    </nav>

                    {/* Mobile Menu Toggle Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="xl:hidden text-foreground hover:bg-transparent"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18" /><path d="m6 6 18 12" /></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
                        )}
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={cn(
                    "xl:hidden absolute top-full left-0 right-0 glass-effect border-b border-border/40 transition-all duration-300 overflow-hidden",
                    mobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0",
                )}
            >
                <div className="container mx-auto px-4 py-4 space-y-4">
                    {/* Mobile Dropdowns */}
                    <div className="flex flex-col gap-3">
                        <Select value={city} onValueChange={setCity}>
                            <SelectTrigger className="w-full bg-secondary border-border">
                                <SelectValue placeholder="Ciudad" />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border-border">
                                {cities.map((c) => (
                                    <SelectItem key={c.id} value={c.id}>
                                        {c.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={cinema} onValueChange={setCinema}>
                            <SelectTrigger className="w-full bg-secondary border-border">
                                <SelectValue placeholder="Cine" />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border-border">
                                {filteredCinemas.map((c) => (
                                    <SelectItem key={c.id} value={c.id}>
                                        {c.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Mobile Nav Items */}
                    <nav className="flex flex-col gap-1">
                        {menuItems.map((item) => (
                            <Button
                                key={item.id}
                                variant="ghost"
                                className={cn(
                                    "w-full justify-start gap-3 text-foreground/80 hover:text-primary hover:bg-primary/10 transition-colors",
                                    currentPage === item.id && "bg-primary/10 text-primary",
                                )}
                                onClick={() => navigateTo(item.id)}
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </Button>
                        ))}
                    </nav>

                    {/* Theme Toggle - Mobile */}
                    <div className="flex items-center justify-between py-2 px-3 border-y border-border/40">
                        <span className="text-sm text-muted-foreground">Tema</span>
                        <ThemeToggle />
                    </div>

                    {user ? (
                        <Button
                            className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => {
                                logout();
                                setMobileMenuOpen(false);
                            }}
                        >
                            Cerrar Sesión
                        </Button>
                    ) : (
                        <Button
                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                            onClick={() => navigateTo('perfil')}
                        >
                            Ingresar
                        </Button>
                    )}
                </div>
            </div>
        </header>
    )
}
