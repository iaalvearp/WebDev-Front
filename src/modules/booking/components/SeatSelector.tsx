import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useBooking } from '@/modules/booking/context/BookingContext';
import { generateSeats, ticketTypes } from '@/data/mockData';
import { cn } from '@/lib/utils';

type Seat = {
  id: string;
  row: string;
  number: number;
  status: 'available' | 'taken' | 'selected';
};

export function SeatSelector() {
  const { selectedMovie, selectedShowtime, selectedSeats, addSeat, removeSeat, setStep, setSelectedTickets } = useBooking();
  const [seats, setSeats] = useState<Seat[]>([]);

  useEffect(() => {
    setSeats(generateSeats());
  }, []);

  if (!selectedMovie || !selectedShowtime) return null;

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'taken') return;

    const isSelected = selectedSeats.some(s => s.id === seat.id);
    
    if (isSelected) {
      removeSeat(seat.id);
      setSeats(prev => prev.map(s => 
        s.id === seat.id ? { ...s, status: 'available' } : s
      ));
    } else {
      addSeat({ id: seat.id, row: seat.row, number: seat.number });
      setSeats(prev => prev.map(s => 
        s.id === seat.id ? { ...s, status: 'selected' } : s
      ));
    }
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0) return;
    
    // Auto-assign general tickets based on seat count
    const defaultTicket = ticketTypes.find(t => t.id === 'general');
    if (defaultTicket) {
      setSelectedTickets([{ type: defaultTicket, quantity: selectedSeats.length }]);
    }
    setStep('tickets');
  };

  const rows = [...new Set(seats.map(s => s.row))];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground gap-2"
              onClick={() => setStep('movie')}
            >
              <ArrowLeft className="w-5 h-5" />
              Regresar
            </Button>
            <div className="text-center">
              <h1 className="font-semibold text-foreground">{selectedMovie.title}</h1>
              <p className="text-sm text-muted-foreground">
                {selectedShowtime.format} • {selectedShowtime.time}
              </p>
            </div>
            <div className="w-24" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Screen */}
          <div className="mb-12 text-center">
            <div className="relative">
              <div className="h-2 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full mb-2" />
              <div className="w-3/4 h-1 bg-primary/30 mx-auto rounded-full blur-sm" />
              <p className="text-muted-foreground text-sm mt-4">Pantalla</p>
            </div>
          </div>

          {/* Seats Grid */}
          <div className="space-y-3 mb-8">
            {rows.map(row => {
              const rowSeats = seats.filter(s => s.row === row);
              return (
                <div key={row} className="flex items-center justify-center gap-2">
                  <span className="w-6 text-center text-muted-foreground font-medium">
                    {row}
                  </span>
                  <div className="flex gap-1 sm:gap-2">
                    {rowSeats.map(seat => {
                      const isSelected = selectedSeats.some(s => s.id === seat.id);
                      return (
                        <button
                          key={seat.id}
                          className={cn(
                            'w-7 h-7 sm:w-9 sm:h-9 rounded-t-lg text-xs font-medium transition-all',
                            seat.status === 'taken' && 'seat-taken',
                            seat.status === 'available' && !isSelected && 'seat-available',
                            isSelected && 'seat-selected text-primary-foreground'
                          )}
                          onClick={() => handleSeatClick(seat)}
                          disabled={seat.status === 'taken'}
                        >
                          {seat.number}
                        </button>
                      );
                    })}
                  </div>
                  <span className="w-6 text-center text-muted-foreground font-medium">
                    {row}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-6 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-t-lg seat-available" />
              <span className="text-sm text-muted-foreground">Disponible</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-t-lg seat-selected" />
              <span className="text-sm text-muted-foreground">Seleccionado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-t-lg seat-taken" />
              <span className="text-sm text-muted-foreground">Ocupado</span>
            </div>
          </div>

          {/* Selected Seats Summary */}
          {selectedSeats.length > 0 && (
            <div className="bg-card rounded-xl p-4 border border-border mb-6">
              <h3 className="font-semibold text-foreground mb-2">Asientos seleccionados</h3>
              <div className="flex flex-wrap gap-2">
                {selectedSeats.map(seat => (
                  <span
                    key={seat.id}
                    className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium"
                  >
                    {seat.row}{seat.number}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Continue Button */}
          <Button
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-lg"
            disabled={selectedSeats.length === 0}
            onClick={handleContinue}
          >
            Continuar ({selectedSeats.length} {selectedSeats.length === 1 ? 'asiento' : 'asientos'})
          </Button>
        </div>
      </div>
    </div>
  );
}
