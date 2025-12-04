import type { ReactNode } from 'react';
import { BookingProvider } from '@/modules/booking/context/BookingContext';

interface AppWrapperProps {
    children: ReactNode;
    [key: string]: any;
}

export function AppWrapper({ children }: AppWrapperProps) {
    return (
        <BookingProvider>
            {children}
        </BookingProvider>
    );
}
