import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Movie, Showtime, TicketType } from '@/data/mockData';

interface SelectedTicket {
  type: TicketType;
  quantity: number;
}

interface SelectedSeat {
  id: string;
  row: string;
  number: number;
}

interface BookingState {
  selectedMovie: Movie | null;
  selectedDate: Date;
  selectedShowtime: Showtime | null;
  selectedSeats: SelectedSeat[];
  selectedTickets: SelectedTicket[];
  step: 'cartelera' | 'movie' | 'seats' | 'tickets' | 'payment' | 'receipt' | 'dulceria' | 'beneficios' | 'promociones' | 'perfil';
  city: string;
  cinema: string;
}

interface BookingContextType extends BookingState {
  setSelectedMovie: (movie: Movie | null) => void;
  setSelectedDate: (date: Date) => void;
  setSelectedShowtime: (showtime: Showtime | null) => void;
  addSeat: (seat: SelectedSeat) => void;
  removeSeat: (seatId: string) => void;
  setSelectedTickets: (tickets: SelectedTicket[]) => void;
  updateTicketQuantity: (typeId: string, quantity: number) => void;
  setStep: (step: BookingState['step']) => void;
  setCity: (city: string) => void;
  setCinema: (cinema: string) => void;
  getTotal: () => number;
  getTotalTickets: () => number;
  resetBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BookingState>({
    selectedMovie: null,
    selectedDate: new Date(),
    selectedShowtime: null,
    selectedSeats: [],
    selectedTickets: [],
    step: 'cartelera',
    city: 'quito',
    cinema: 'scala',
  });

  const setSelectedMovie = (movie: Movie | null) => {
    setState(prev => ({ ...prev, selectedMovie: movie, step: movie ? 'movie' : 'cartelera' }));
  };

  const setSelectedDate = (date: Date) => {
    setState(prev => ({ ...prev, selectedDate: date }));
  };

  const setSelectedShowtime = (showtime: Showtime | null) => {
    setState(prev => ({ ...prev, selectedShowtime: showtime }));
  };

  const addSeat = (seat: SelectedSeat) => {
    setState(prev => ({
      ...prev,
      selectedSeats: [...prev.selectedSeats, seat],
    }));
  };

  const removeSeat = (seatId: string) => {
    setState(prev => ({
      ...prev,
      selectedSeats: prev.selectedSeats.filter(s => s.id !== seatId),
    }));
  };

  const setSelectedTickets = (tickets: SelectedTicket[]) => {
    setState(prev => ({ ...prev, selectedTickets: tickets }));
  };

  const updateTicketQuantity = (typeId: string, quantity: number) => {
    setState(prev => {
      const existing = prev.selectedTickets.find(t => t.type.id === typeId);
      if (existing) {
        if (quantity <= 0) {
          return {
            ...prev,
            selectedTickets: prev.selectedTickets.filter(t => t.type.id !== typeId),
          };
        }
        return {
          ...prev,
          selectedTickets: prev.selectedTickets.map(t =>
            t.type.id === typeId ? { ...t, quantity } : t
          ),
        };
      }
      return prev;
    });
  };

  const setStep = (step: BookingState['step']) => {
    setState(prev => ({ ...prev, step }));
  };

  const setCity = (city: string) => {
    setState(prev => ({ ...prev, city }));
  };

  const setCinema = (cinema: string) => {
    setState(prev => ({ ...prev, cinema }));
  };

  const getTotal = () => {
    return state.selectedTickets.reduce((sum, t) => sum + t.type.price * t.quantity, 0);
  };

  const getTotalTickets = () => {
    return state.selectedTickets.reduce((sum, t) => sum + t.quantity, 0);
  };

  const resetBooking = () => {
    setState({
      selectedMovie: null,
      selectedDate: new Date(),
      selectedShowtime: null,
      selectedSeats: [],
      selectedTickets: [],
      step: 'cartelera',
      city: state.city,
      cinema: state.cinema,
    });
  };

  return (
    <BookingContext.Provider
      value={{
        ...state,
        setSelectedMovie,
        setSelectedDate,
        setSelectedShowtime,
        addSeat,
        removeSeat,
        setSelectedTickets,
        updateTicketQuantity,
        setStep,
        setCity,
        setCinema,
        getTotal,
        getTotalTickets,
        resetBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
