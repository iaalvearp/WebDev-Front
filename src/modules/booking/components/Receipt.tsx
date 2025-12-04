import { Download, Share2, Home, QrCode } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useBooking } from '@/modules/booking/context/BookingContext';
import { cinemas } from '@/data/mockData';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function Receipt() {
  const {
    selectedMovie,
    selectedShowtime,
    selectedDate,
    selectedTickets,
    selectedSeats,
    cinema,
    getTotal,
    resetBooking,
  } = useBooking();

  if (!selectedMovie || !selectedShowtime) return null;

  const cinemaInfo = cinemas.find(c => c.id === cinema);
  const total = getTotal();
  const orderNumber = `ORD-${Date.now().toString().slice(-8)}`;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-lg mx-auto">
          {/* Success Message */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">¡Compra Exitosa!</h1>
            <p className="text-muted-foreground">Tu pedido ha sido confirmado</p>
          </div>

          {/* Receipt Card */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-xl animate-slide-up">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-cinema-gold-light p-6 text-center">
              <h2 className="text-xl font-bold text-primary-foreground">CinePlus</h2>
              <p className="text-primary-foreground/80 text-sm">Boleto Electrónico</p>
            </div>

            {/* QR Code */}
            <div className="p-8 flex justify-center bg-white">
              <div className="relative">
                <div className="w-48 h-48 bg-foreground rounded-xl p-4 flex items-center justify-center">
                  <QrCode className="w-full h-full text-background" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-background p-2 rounded-lg">
                    <span className="text-xs font-mono text-foreground">{orderNumber}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ticket Details */}
            <div className="p-6 space-y-4">
              {/* Movie */}
              <div className="flex gap-4">
                <img
                  src={selectedMovie.poster}
                  alt={selectedMovie.title}
                  className="w-16 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-foreground">{selectedMovie.title}</h3>
                  <p className="text-sm text-muted-foreground">{selectedShowtime.format}</p>
                  <p className="text-sm text-primary font-medium mt-1">{selectedMovie.rating}</p>
                </div>
              </div>

              <div className="border-t border-dashed border-border my-4" />

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Cine</p>
                  <p className="font-medium text-foreground">{cinemaInfo?.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Sala</p>
                  <p className="font-medium text-foreground">{selectedShowtime.room}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Fecha</p>
                  <p className="font-medium text-foreground">
                    {format(selectedDate, "d 'de' MMMM, yyyy", { locale: es })}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Hora</p>
                  <p className="font-medium text-foreground">{selectedShowtime.time}</p>
                </div>
              </div>

              <div className="border-t border-dashed border-border my-4" />

              {/* Seats */}
              <div>
                <p className="text-muted-foreground text-sm mb-2">Asientos</p>
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

              {/* Tickets */}
              <div>
                <p className="text-muted-foreground text-sm mb-2">Boletos</p>
                <div className="space-y-1">
                  {selectedTickets.map(ticket => (
                    <div key={ticket.type.id} className="flex justify-between text-sm">
                      <span className="text-foreground">{ticket.quantity}x {ticket.type.name}</span>
                      <span className="text-muted-foreground">${(ticket.type.price * ticket.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-dashed border-border my-4" />

              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-foreground">Total Pagado</span>
                <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-muted/50 p-4 text-center">
              <p className="text-xs text-muted-foreground">
                Presenta este código QR en la entrada del cine
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground gap-2"
              >
                <Download className="w-4 h-4" />
                Descargar PDF
              </Button>
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground gap-2"
              >
                <Share2 className="w-4 h-4" />
                Compartir
              </Button>
            </div>
            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
              onClick={resetBooking}
            >
              <Home className="w-4 h-4" />
              Volver al Inicio
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
