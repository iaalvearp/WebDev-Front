import { useState } from 'react';
import { Menu, X, Film, Candy, Gift, Percent, User, ShoppingCart, Sun, Moon } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { cities, cinemas } from '@/data/mockData';
import { useBooking } from '@/modules/booking/context/BookingContext';
import { cn } from '@/lib/utils';

interface HeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const menuItems = [
  { id: 'cartelera', label: 'Cartelera', icon: Film },
  { id: 'dulceria', label: 'Dulcería', icon: Candy },
  { id: 'beneficios', label: 'Beneficios', icon: Gift },
  { id: 'promociones', label: 'Promociones', icon: Percent },
  { id: 'perfil', label: 'Perfil', icon: User },
];

export function Header({ isDark, toggleTheme }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { city, cinema, setCity, setCinema, setStep, getTotalTickets } = useBooking();

  const filteredCinemas = cinemas.filter(c => c.city === city);
  const totalTickets = getTotalTickets();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 glass-effect">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setStep('cartelera')}
          >
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
                {cities.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={cinema} onValueChange={setCinema}>
              <SelectTrigger className="w-44 bg-secondary border-border">
                <SelectValue placeholder="Cine" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {filteredCinemas.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {menuItems.map(item => (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-foreground/80 hover:text-primary hover:bg-primary/10"
                onClick={() => setStep(item.id as any)}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-foreground/80 hover:text-primary"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            <Button variant="ghost" size="icon" className="relative text-foreground/80 hover:text-primary">
              <ShoppingCart className="w-5 h-5" />
              {totalTickets > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-semibold">
                  {totalTickets}
                </span>
              )}
            </Button>

            <Button className="hidden sm:flex bg-primary text-primary-foreground hover:bg-primary/90">
              Ingresar
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'lg:hidden absolute top-full left-0 right-0 glass-effect border-b border-border/40 transition-all duration-300 overflow-hidden',
          mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
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
                {cities.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={cinema} onValueChange={setCinema}>
              <SelectTrigger className="w-full bg-secondary border-border">
                <SelectValue placeholder="Cine" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {filteredCinemas.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Mobile Nav Items */}
          <nav className="flex flex-col gap-1">
            {menuItems.map(item => (
              <Button
                key={item.id}
                variant="ghost"
                className="w-full justify-start gap-3 text-foreground/80 hover:text-primary hover:bg-primary/10"
                onClick={() => {
                  setStep(item.id as any);
                  setMobileMenuOpen(false);
                }}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Button>
            ))}
          </nav>

          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            Ingresar
          </Button>
        </div>
      </div>
    </header>
  );
}
