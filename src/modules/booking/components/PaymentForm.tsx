import { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard, Lock, Calendar, Film, MapPin } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { useBooking } from '@/modules/booking/context/BookingContext';
import { cinemas } from '@/data/mockData';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function PaymentForm() {
  const {
    selectedMovie,
    selectedShowtime,
    selectedDate,
    selectedTickets,
    selectedSnacks,
    cinema,
    setStep,
    selectedPromotion,
    confirmBooking
  } = useBooking();

  const [timeLeft, setTimeLeft] = useState(720); // 12 minutes
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Detect Theme (JS Force Mode)
  useEffect(() => {
    const checkTheme = () => setIsDark(document.documentElement.classList.contains('dark'));
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

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

  // Totals
  const ticketsTotal = selectedTickets.reduce((sum, t) => sum + (t.type.price * t.quantity), 0);
  const snacksTotal = selectedSnacks.reduce((sum, s) => sum + (s.price * s.quantity), 0);
  const subTotal = ticketsTotal + snacksTotal;

  // Calculate discount
  let discount = 0;
  if (selectedPromotion) {
    if (selectedPromotion.descuento?.includes('50%')) discount = subTotal * 0.5;
    else if (selectedPromotion.descuento?.includes('20%')) discount = subTotal * 0.2;
    else discount = subTotal * 0.1;
  }

  const finalTotal = subTotal - discount;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePayment = async () => {
    if (!acceptTerms) {
      toast.error("Debes aceptar los términos y condiciones");
      return;
    }
    if (cardNumber.length < 16 || cvc.length < 3) {
      toast.error("Verifica los datos de tu tarjeta");
      return;
    }

    setIsProcessing(true);
    const success = await confirmBooking();
    setIsProcessing(false);

    if (success) {
      setStep('receipt');
    }
  };

  // Card Formatting
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 16);
    setCardNumber(val);
  };
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length >= 2) {
      val = val.slice(0, 2) + '/' + val.slice(2, 4);
    }
    setExpiry(val);
  };

  return (
    <div className="h-full lg:h-[calc(100vh-80px)] overflow-y-auto lg:overflow-hidden bg-background text-foreground p-4">
      {/* Header */}
      <div className="container mx-auto flex justify-between items-center py-6 mb-8 border-b border-border/10">
        <Button variant="ghost" onClick={() => setStep('snacks')} className="text-foreground hover:bg-white/10 gap-2">
          <ArrowLeft className="w-5 h-5" /> Volver
        </Button>
        <div className="flex items-center gap-2 bg-destructive/10 px-4 py-2 rounded-full border border-destructive/20">
          <span className="text-destructive text-sm font-medium">Tiempo Restante:</span>
          <span className="text-destructive font-mono font-bold">{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl h-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-full">

          {/* LEFT COLUMN: PAYMENT FORM (INTERACTIVE CARD) */}
          <div className="space-y-8 flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <CreditCard className="text-primary" />
              Pago Seguro
            </h2>

            {/* VISUAL CARD WRAPPER - Fixed 3D Flip & Layout */}
            <div
              className="w-full max-w-md mx-auto lg:mx-0 h-56 relative mb-8 group cursor-pointer"
              onClick={() => setIsFlipped(!isFlipped)}
              style={{ perspective: '1000px' }}
            >
              <div
                className="w-full h-full transition-all duration-700 relative rounded-2xl shadow-2xl"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
              >
                {/* FRONT */}
                <div
                  className="absolute inset-0 rounded-2xl p-6 flex flex-col justify-between bg-gradient-to-tr from-neutral-900 to-neutral-800 border-2 border-[#F5B041]/30 shadow-[0_0_20px_rgba(245,176,65,0.1)] overflow-hidden"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(0deg)' }}
                >
                  <div className="absolute top-0 right-0 p-32 bg-[#F5B041]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                  {/* Top Row: Brand & Stripes */}
                  <div className="flex justify-between items-start z-10 w-full relative">
                    {/* Brand Text - Yellow */}
                    <div className="font-bold text-lg tracking-wider text-[#F5B041]">To Talk</div>

                    {/* Stripes (Rayas) - Top Right */}
                    <svg width="40" height="20" viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 20L20 0H16L6 20H10Z" fill="white" />
                      <path d="M22 20L32 0H28L18 20H22Z" fill="white" />
                      <path d="M34 20L44 0H40L30 20H34Z" fill="white" />
                      {/* Adjusting for 6 stripes as seen in typical generic logos or asking "rayas" */}
                      <path d="M-2 20L8 0H4L-6 20H-2Z" fill="white" />
                      <path d="M46 20L56 0H52L42 20H46Z" fill="white" />
                      {/* Simplified purely aesthetic stripes matching '//////' */}
                      <g transform="skewX(-20)">
                        <rect x="10" y="0" width="3" height="20" fill="white" />
                        <rect x="16" y="0" width="3" height="20" fill="white" />
                        <rect x="22" y="0" width="3" height="20" fill="white" />
                        <rect x="28" y="0" width="3" height="20" fill="white" />
                        <rect x="34" y="0" width="3" height="20" fill="white" />
                        <rect x="40" y="0" width="3" height="20" fill="white" />
                      </g>
                    </svg>
                  </div>

                  {/* Chip - Middle Right */}
                  <div className="absolute top-1/2 right-6 -translate-y-1/2 z-10">
                    <svg className="w-12 h-10" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="chipGradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#F5B041" />
                          <stop offset="100%" stopColor="#F9C74F" stopOpacity="0.8" />
                        </linearGradient>
                      </defs>
                      <rect width="48" height="48" rx="8" fill="url(#chipGradient)" fillOpacity="0.8" />
                      <path d="M0 14H48M14 0V48M34 0V48M0 34H48" stroke="black" strokeWidth="2" strokeOpacity="0.3" />
                      <rect x="16" y="16" width="16" height="16" rx="4" stroke="black" strokeWidth="2" strokeOpacity="0.3" />
                    </svg>
                  </div>

                  {/* Name - Absolute Bottom Left */}
                  <div className="z-10 absolute bottom-6 left-6">
                    <p className="text-[10px] uppercase text-gray-400 tracking-wider mb-1">Titular</p>
                    <p className="text-lg font-medium tracking-wide uppercase text-white truncate max-w-[200px]">{cardName || 'NOMBRE COMPLETO'}</p>
                  </div>
                </div>

                {/* BACK */}
                <div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-neutral-900 to-neutral-800 border-2 border-[#F5B041]/30 overflow-hidden"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  {/* Magnetic Strip */}
                  <div className="w-full h-10 bg-black mt-6"></div>

                  {/* Expiry & CVV - Centered Row */}
                  <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 px-6 flex justify-end gap-6 z-10">
                    <div className="text-right">
                      <p className="text-[10px] uppercase text-gray-400">Vence</p>
                      <p className="font-mono text-white text-sm">{expiry || 'MM/AA'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-gray-400 text-right">CVC</p>
                      <div className="bg-white text-black p-1 px-2 text-right font-mono font-bold text-sm min-w-[40px] rounded">
                        {cvc || '123'}
                      </div>
                    </div>
                  </div>

                  {/* Number - Absolute Bottom Left */}
                  <div className="absolute bottom-6 left-6 z-10 w-full">
                    <p className="text-xl font-mono tracking-widest text-white drop-shadow-md">
                      {cardNumber.padEnd(16, '•').match(/.{1,4}/g)?.join(' ') || '•••• •••• •••• ••••'}
                    </p>
                  </div>

                </div>
              </div>
            </div>

            {/* FORM INPUTS */}
            <div className="space-y-4 bg-card p-6 rounded-xl border border-border/10 shadow-sm">
              <div>
                <Label className="text-gray-400 text-xs uppercase tracking-wider">Número de Tarjeta</Label>
                <Input
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  maxLength={16}
                  className="mt-2 bg-black/50 border-white/20 text-white font-mono focus:border-primary focus:ring-primary/20 transition-colors"
                  placeholder="0000 0000 0000 0000"
                  onFocus={() => setIsFlipped(true)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground text-xs uppercase tracking-wider">Titular</Label>
                  <Input
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value.toUpperCase())}
                    className="mt-2 bg-secondary/50 border-input text-foreground focus:border-primary focus:ring-primary/20 transition-colors"
                    placeholder="JHON DOE"
                    onFocus={() => setIsFlipped(false)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-gray-400 text-xs uppercase tracking-wider">Vence</Label>
                    <Input
                      value={expiry}
                      onChange={handleExpiryChange}
                      maxLength={5}
                      className="mt-2 bg-black/50 border-white/20 text-white font-mono focus:border-primary focus:ring-primary/20 transition-colors"
                      placeholder="MM/AA"
                      onFocus={() => setIsFlipped(true)}
                    />
                  </div>
                  <div>
                    <Label className="text-gray-400 text-xs uppercase tracking-wider">CVC</Label>
                    <Input
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value.slice(0, 4))}
                      maxLength={4}
                      className="mt-2 bg-black/50 border-white/20 text-white font-mono focus:border-primary focus:ring-primary/20 transition-colors"
                      placeholder="123"
                      onFocus={() => setIsFlipped(true)}
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: SUMMARY */}
          <div className={`bg-card border rounded-2xl p-8 h-fit space-y-6 sticky top-8 text-foreground shadow-sm transition-colors ${isDark ? 'border-white/10 bg-black/40 backdrop-blur-md' : 'border-border/10'
            }`}>
            <h3 className={`text-xl font-bold border-b pb-4 ${isDark ? 'border-white/10 text-white' : 'border-black/10 text-foreground'}`}>Resumen de Compra</h3>

            <div className="space-y-4 text-sm">
              {/* Movie Info Short */}
              <div className={`flex gap-4 items-start pb-4 border-b border-dashed ${isDark ? 'border-white/10' : 'border-black/10'}`}>
                <img src={selectedMovie.poster} alt="poster" className="w-16 h-20 object-cover rounded shadow" />
                <div className="flex-1 space-y-1">
                  <h4 className={`font-bold text-base ${isDark ? 'text-white' : 'text-foreground'}`}>{selectedMovie.title}</h4>
                  <p className={`${isDark ? 'text-white/60' : 'text-zinc-500'}`}>{selectedShowtime.format} | {selectedShowtime.roomType}</p>
                  <div className={`flex items-center gap-2 text-xs ${isDark ? 'text-white/60' : 'text-zinc-500'}`}>
                    <Calendar className="w-3 h-3" />
                    {format(selectedDate, "d MMM", { locale: es })}
                    <Film className="w-3 h-3 ml-2" />
                    {selectedShowtime.time}
                  </div>
                </div>
              </div>

              {/* Breakdown */}
              <div className="space-y-3 pt-2">
                <div className={`flex justify-between font-medium ${isDark ? 'text-white/60' : 'text-zinc-600'}`}>
                  <span className="flex gap-2 items-center"><div className="w-1 h-4 bg-primary rounded-full" /> Entradas ({selectedTickets.reduce((a, b) => a + b.quantity, 0)})</span>
                  <span>${ticketsTotal.toFixed(2)}</span>
                </div>
                {snacksTotal > 0 && (
                  <div className={`flex justify-between font-medium ${isDark ? 'text-white/60' : 'text-zinc-600'}`}>
                    <span className="flex gap-2 items-center"><div className="w-1 h-4 bg-pink-500 rounded-full" /> Snacks</span>
                    <span>${snacksTotal.toFixed(2)}</span>
                  </div>
                )}
                {discount > 0 && (
                  <div className={`flex justify-between font-medium ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                    <span>Descuento Aplicado</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className={`border-t pt-4 mt-4 ${isDark ? 'border-white/10' : 'border-black/10'}`}>
                <div className="flex justify-between items-end">
                  <span className={`${isDark ? 'text-white/60' : 'text-zinc-500'}`}>Total a Pagar</span>
                  <span className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>${finalTotal.toFixed(2)}</span>
                </div>
                <p className={`text-xs text-right mt-1 ${isDark ? 'text-white/40' : 'text-zinc-400'}`}>Incluye impuestos de ley</p>
              </div>

              {/* Terms */}
              <div className={`flex items-start gap-3 mt-6 p-4 rounded-lg border ${isDark ? 'bg-white/5 border-white/10' : 'bg-[#F5B041]/10 border-[#F5B041]/20'
                }`}>
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                  className="mt-1 data-[state=checked]:bg-[#F5B041] data-[state=checked]:text-black border-zinc-400"
                />
                <label htmlFor="terms" className={`text-xs leading-tight cursor-pointer font-medium ${isDark ? 'text-white/60' : 'text-zinc-600'
                  }`}>
                  Acepto los términos y condiciones de compra, y confirmo que la función seleccionada es correcta.
                </label>
              </div>

              <Button
                className="w-full h-14 bg-gradient-to-r from-[#F5B041] to-[#E59830] hover:from-[#E59830] hover:to-[#F5B041] text-black font-bold text-lg shadow-lg shadow-[#F5B041]/20 mt-4 transition-all"
                onClick={handlePayment}
                disabled={isProcessing}
              >
                {isProcessing ? "Procesando..." : "PAGAR AHORA"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
