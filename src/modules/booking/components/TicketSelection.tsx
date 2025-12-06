import { ArrowLeft, Minus, Plus, AlertCircle } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useBooking } from '@/modules/booking/context/BookingContext';
import { ticketTypes, cinemas } from '@/data/mockData';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function TicketSelection() {
  const {
    selectedMovie,
    selectedShowtime,
    selectedDate,
    selectedSeats,
    selectedTickets,
    cinema,
    setStep,
    updateTicketQuantity,
    setSelectedTickets,
    getTotal,
    getTotalTickets,
  } = useBooking();

  if (!selectedMovie || !selectedShowtime) return null;

  const cinemaInfo = cinemas.find(c => c.id === cinema);
  const total = getTotal();
  const totalTickets = getTotalTickets();
  const maxTickets = selectedSeats.length;

  const handleQuantityChange = (typeId: string, delta: number) => {
    const current = selectedTickets.find(t => t.type.id === typeId);
    const currentQty = current?.quantity || 0;
    const newQty = Math.max(0, currentQty + delta);

    // Check if we're not exceeding max tickets
    const otherTicketsCount = selectedTickets
      .filter(t => t.type.id !== typeId)
      .reduce((sum, t) => sum + t.quantity, 0);

    if (newQty + otherTicketsCount > maxTickets) return;

    if (current) {
      updateTicketQuantity(typeId, newQty);
    } else if (delta > 0) {
      const ticketType = ticketTypes.find(t => t.id === typeId);
      if (ticketType) {
        setSelectedTickets([...selectedTickets, { type: ticketType, quantity: 1 }]);
      }
    }
  };

  const getQuantity = (typeId: string) => {
    return selectedTickets.find(t => t.type.id === typeId)?.quantity || 0;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground gap-2"
              onClick={() => setStep('seats')}
            >
              <ArrowLeft className="w-5 h-5" />
              Regresar
            </Button>
            <h1 className="font-semibold text-foreground">Selecciona tus boletos</h1>
            <div className="w-24" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[1fr,350px] gap-8">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Voucher Input */}
            <div className="bg-card rounded-xl p-4 border border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span>¿Tienes un boleto?</span>
                  <AlertCircle className="w-4 h-4" />
                </div>
                <Button variant="ghost" className="text-primary">
                  Aplicar
                </Button>
              </div>
              <input
                type="text"
                placeholder="Ingresa tu código de 16 dígitos aquí"
                className="w-full mt-2 bg-transparent border-b border-border py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
            </div>

            {/* Ticket Types */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">
                {selectedShowtime.roomType}
              </h2>

              {ticketTypes
                .filter(t =>
                  selectedShowtime.roomType === '4D'
                    ? t.id.includes('4d')
                    : !t.id.includes('4d')
                )
                .map(ticketType => {
                  const qty = getQuantity(ticketType.id);
                  return (
                    <div
                      key={ticketType.id}
                      className="bg-card rounded-xl p-4 border border-border flex items-center justify-between"
                    >
                      <div>
                        <h3 className="font-medium text-foreground">{ticketType.name}</h3>
                        <p className="text-primary font-semibold">${ticketType.price.toFixed(2)}</p>
                        {ticketType.description && (
                          <div className="mt-2 flex items-center gap-2 text-xs text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                            <AlertCircle className="w-3 h-3" />
                            {ticketType.description}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 rounded-full border-primary text-primary"
                          onClick={() => handleQuantityChange(ticketType.id, -1)}
                          disabled={qty === 0}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center text-foreground font-medium">
                          {qty}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 rounded-full border-primary text-primary"
                          onClick={() => handleQuantityChange(ticketType.id, 1)}
                          disabled={totalTickets >= maxTickets}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
            </div>

            <p className="text-sm text-muted-foreground">
              Debes seleccionar {maxTickets} boleto(s) para los {maxTickets} asiento(s) elegidos.
              Actualmente: {totalTickets}/{maxTickets}
            </p>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              {/* Movie Info */}
              <div className="flex gap-4 p-4 border-b border-border">
                <img
                  src={selectedMovie.poster}
                  alt={selectedMovie.title}
                  className="w-20 h-28 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex gap-2 mb-1">
                    <span className="text-xs text-muted-foreground">{selectedMovie.genre[0]}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{selectedMovie.rating}</span>
                  </div>
                  <h3 className="font-semibold text-foreground">{selectedMovie.title}</h3>
                  <p className="text-sm text-muted-foreground">{cinemaInfo?.name} - {selectedShowtime.room}</p>
                  <p className="text-primary font-medium mt-1">
                    {format(selectedDate, "EEE d 'de' MMM", { locale: es })} • {selectedShowtime.time}
                  </p>
                </div>
              </div>

              {/* Tickets */}
              <div className="p-4 border-b border-border">
                <h4 className="text-muted-foreground mb-3">Tus boletos</h4>
                {selectedTickets.length > 0 ? (
                  <div className="space-y-2">
                    {selectedTickets.map(ticket => (
                      <div key={ticket.type.id} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded bg-primary/20 text-primary text-sm flex items-center justify-center font-medium">
                            {ticket.quantity}
                          </span>
                          <span className="text-foreground">{ticket.type.name}</span>
                        </div>
                        <span className="text-muted-foreground">
                          ${(ticket.type.price * ticket.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">Selecciona tus boletos</p>
                )}
              </div>

              {/* Continue Button */}
              <div className="p-4">
                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 justify-between py-6"
                  disabled={totalTickets !== maxTickets}
                  onClick={() => setStep('payment')}
                >
                  <span>Continuar</span>
                  <span className="font-bold">${total.toFixed(2)}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Fixed Bottom */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-card border-t border-border p-4">
        <Button
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 justify-between py-6"
          disabled={totalTickets !== maxTickets}
          onClick={() => setStep('payment')}
        >
          <span>Continuar ({totalTickets} boletos)</span>
          <span className="font-bold">${total.toFixed(2)}</span>
        </Button>
      </div>
    </div>
  );
}
