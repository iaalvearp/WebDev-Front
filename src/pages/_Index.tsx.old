import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
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
import { BookingProvider, useBooking } from '@/modules/booking/context/BookingContext';

function CinemaApp() {
  const [isDark, setIsDark] = useState(true);
  const { step } = useBooking();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const renderContent = () => {
    switch (step) {
      case 'cartelera':
        return (
          <>
            <HeroCarousel />
            <MovieGrid />
          </>
        );
      case 'movie':
        return <MovieDetail />;
      case 'seats':
        return <SeatSelector />;
      case 'tickets':
        return <TicketSelection />;
      case 'payment':
        return <PaymentForm />;
      case 'receipt':
        return <Receipt />;
      case 'dulceria':
        return <Dulceria />;
      case 'beneficios':
        return <Beneficios />;
      case 'promociones':
        return <Promociones />;
      case 'perfil':
        return <Perfil />;
      default:
        return (
          <>
            <HeroCarousel />
            <MovieGrid />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header isDark={isDark} toggleTheme={toggleTheme} />
      <main>{renderContent()}</main>

      {/* Footer - Only on home */}
      {step === 'cartelera' && (
        <footer className="bg-card border-t border-border py-8 mt-12">
          <div className="container mx-auto px-4 text-center text-muted-foreground">
            <p className="text-sm">© 2024 CinePlus. Todos los derechos reservados.</p>
          </div>
        </footer>
      )}
    </div>
  );
}

const Index = () => {
  return (
    <BookingProvider>
      <CinemaApp />
    </BookingProvider>
  );
};

export default Index;
