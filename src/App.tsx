import { BookingProvider, useBooking } from '@/modules/booking/context/BookingContext';
import { Header } from '@/shared/components/Header';
import { HeroCarousel } from '@/modules/cartelera/components/HeroCarousel';
import { MovieGrid } from '@/modules/cartelera/components/MovieGrid';
import { MovieDetail } from '@/modules/cartelera/components/MovieDetail';
import { SeatSelector } from '@/modules/booking/components/SeatSelector';
import { TicketSelection } from '@/modules/booking/components/TicketSelection';
import { PaymentForm } from '@/modules/booking/components/PaymentForm';
import { Receipt } from '@/modules/booking/components/Receipt';
import { Dulceria } from '@/modules/snacks/components/Dulceria';
import { Beneficios } from '@/modules/marketing/components/Beneficios';
import { Promociones } from '@/modules/marketing/components/Promociones';
import { Perfil } from '@/modules/users/components/Perfil';
import { LoginForm } from '@/modules/users/components/LoginForm';
import { Toaster } from '@/shared/components/ui/sonner';
import { useState, useEffect } from 'react';

// El controlador de vistas que decide qué mostrar
const MainContent = () => {
  const { step } = useBooking();

  // Scroll al top cuando cambia el paso
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  switch (step) {
    case 'movie': return <MovieDetail />;
    case 'seats': return <SeatSelector />;
    case 'tickets': return <TicketSelection />;
    case 'payment': return <PaymentForm />;
    case 'receipt': return <Receipt />;
    case 'dulceria': return <Dulceria />;
    case 'beneficios': return <Beneficios />;
    case 'promociones': return <Promociones />;
    case 'perfil': return <Perfil />;
    case 'login': return <LoginForm />; // <--- NUEVA PANTALLA AGREGADA
    case 'cartelera':
    default:
      return (
        <>
          <HeroCarousel />
          <MovieGrid />
        </>
      );
  }
};

export const App = () => {
  // Inicialización inteligente: Lee la preferencia del sistema
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true; // Default dark
  });

  // Manejo manual del tema dark
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  return (
    // Envuelve toda la app en el contexto de reservas
    <BookingProvider>
      <div className={`min-h-screen bg-background text-foreground ${isDark ? 'dark' : ''}`}>
        <Header isDark={isDark} toggleTheme={() => setIsDark(!isDark)} />
        <main>
          <MainContent />
        </main>
        <Toaster />
      </div>
    </BookingProvider>
  );
};