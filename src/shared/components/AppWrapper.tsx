import type { ReactNode } from 'react';
import { BookingProvider } from '@/modules/booking/context/BookingContext';

import { Toaster } from '@/shared/components/ui/sonner';

interface AppWrapperProps {
    children: ReactNode;
    initialStep?: any;
    [key: string]: any;
}

export function AppWrapper({ children, initialStep }: AppWrapperProps) {
    return (
        <BookingProvider initialStep={initialStep}>
            {children}
            <Toaster />
        </BookingProvider>
    );
}
