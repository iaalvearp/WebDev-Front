import { useEffect } from 'react';
import { AppWrapper } from './AppWrapper';
import HeaderClient from './HeaderClient';
import { useBooking } from '@/modules/booking/context/BookingContext';

// Imports for all screens
// Imports for all screens
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
import { RegisterForm } from '@/modules/users/components/RegisterForm';
import { SnacksUpsell } from '@/modules/booking/components/SnacksUpsell';

const Content = () => {
    const { step } = useBooking();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [step]);

    const renderContent = () => {
        switch (step) {
            case 'movie': return <MovieDetail />;
            case 'seats': return <SeatSelector />;
            case 'tickets': return <TicketSelection />;
            case 'snacks': return <SnacksUpsell />;
            case 'payment': return <PaymentForm />;
            case 'receipt': return <Receipt />;
            case 'dulceria': return <Dulceria />;
            case 'beneficios': return <Beneficios />;
            case 'promociones': return <Promociones />;
            case 'perfil': return <Perfil />;
            case 'login': return <LoginForm />;
            case 'register': return <RegisterForm />;
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

    return (
        <div className="min-h-screen bg-background text-foreground animate-fade-in flex flex-col">
            <HeaderClient currentPage={step} />
            <main>
                {renderContent()}
            </main>
            <footer className="bg-card border-t border-border py-8 mt-12">
                <div className="container mx-auto px-4 text-center text-muted-foreground">
                    <p className="text-sm">
                        © 2025 To Talk. Todos los derechos reservados.
                    </p>
                </div>
            </footer>
        </div>
    );
};

interface HomeProps {
    initialStep?: string;
}

export const Home = ({ initialStep }: HomeProps) => {
    return (
        <AppWrapper initialStep={initialStep}>
            <Content />
        </AppWrapper>
    );
};
