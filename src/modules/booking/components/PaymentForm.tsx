import { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard, Film, MapPin, Calendar, Clock } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { useBooking } from '@/modules/booking/context/BookingContext';
import { cinemas } from '@/data/mockData';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function PaymentForm() {
  const {
    selectedMovie,
    selectedShowtime,
    selectedDate,
    selectedTickets,
    cinema,
    setStep,
    getTotal,
  } = useBooking();

  const [timeLeft, setTimeLeft] = useState(720); // 12 minutes
  const [acceptTerms, setAcceptTerms] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!selectedMovie || !selectedShowtime) return null;

  const cinemaInfo = cinemas.find(c => c.id === cinema);
  const total = getTotal();
  const tax = total * 0.15;
  const subtotal = total - tax;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePayment = () => {
    setStep('receipt');
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
              onClick={() => setStep('tickets')}
            >
              <ArrowLeft className="w-5 h-5" />
              Carrito
            </Button>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>Tiempo restante</span>
              <span className="font-mono font-bold text-foreground">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[1fr,400px] gap-8">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-yellow-500 flex items-center justify-center">
                  <Film className="w-5 h-5 text-white" />
                </div>
                <h2 className="font-semibold text-foreground">{cinemaInfo?.name}</h2>
              </div>

              {/* Tickets */}
              <div className="space-y-4 mb-6">
                <h3 className="text-muted-foreground">Boletos</h3>
                {selectedTickets.map(ticket => (
                  <div key={ticket.type.id} className="flex justify-between items-center">
                    <span className="text-foreground">
                      {selectedShowtime.roomType} - {ticket.type.name} ({ticket.quantity})
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-foreground">${(ticket.type.price * ticket.quantity).toFixed(2)}</span>
                      <button className="text-muted-foreground hover:text-foreground">×</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Warning */}
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 mb-6">
                <p className="text-sm text-primary">
                  <span className="mr-2">ℹ️</span>
                  Recuerda: Al comprar boletos de CineFAN, tercera edad o discapacitado se solicitará su cédula de identidad al ingreso de la función
                </p>
              </div>

              <div className="border-t border-dashed border-border my-4" />

              {/* Movie Details */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-primary">
                  <Film className="w-4 h-4" />
                  <span>{selectedMovie.title}, {selectedShowtime.format}</span>
                </div>
                <div className="flex items-center gap-2 text-primary">
                  <MapPin className="w-4 h-4" />
                  <span>{cinemaInfo?.name} ({cinemaInfo?.city})</span>
                </div>
                <div className="flex items-center gap-2 text-primary">
                  <Calendar className="w-4 h-4" />
                  <span>{format(selectedDate, "EEEE d 'de' MMMM", { locale: es })} • {selectedShowtime.time}</span>
                </div>
                <div className="flex items-center gap-2 text-primary">
                  <Clock className="w-4 h-4" />
                  <span>{selectedMovie.genre[0]} - {selectedMovie.rating}</span>
                </div>
              </div>

              <div className="border-t border-dashed border-border my-4" />

              {/* Terms */}
              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                />
                <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                  <span className="font-semibold text-foreground">Confirmar mi compra en {cinemaInfo?.name}</span>
                  <br />
                  {cinemaInfo?.address}
                  <br />
                  <span className="text-xs">Una vez realizada la compra no se acepta cambio o devoluciones</span>
                </label>
              </div>
            </div>

            {/* Snacks */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-muted-foreground mb-4">Dulcería</h3>
              <Button
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                Agregar snacks
              </Button>
            </div>
          </div>

          {/* Sidebar - Payment */}
          <div className="lg:sticky lg:top-24 h-fit space-y-4">
            {/* Summary */}
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Impuestos:</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-foreground">
                  <span>Total del pedido:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <Button variant="ghost" className="w-full text-primary text-sm">
                Ver detalle de tu orden
              </Button>
            </div>

            {/* Payment Card */}
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center gap-2 mb-6">
                <CreditCard className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Datos de Pago</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="card">Número de Tarjeta</Label>
                  <Input
                    id="card"
                    placeholder="1234 5678 9012 3456"
                    className="mt-1 bg-secondary border-border"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Fecha de Vencimiento</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/AA"
                      className="mt-1 bg-secondary border-border"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      className="mt-1 bg-secondary border-border"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="name">Nombre del Titular</Label>
                  <Input
                    id="name"
                    placeholder="Como aparece en la tarjeta"
                    className="mt-1 bg-secondary border-border"
                  />
                </div>
              </div>
            </div>

            {/* Pay Button */}
            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-lg"
              onClick={handlePayment}
              disabled={!acceptTerms}
            >
              Usar datos de tarjeta
            </Button>
            <Button
              variant="outline"
              className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground py-6"
              onClick={handlePayment}
              disabled={!acceptTerms}
            >
              Ir a pagar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
