import { useRef } from 'react';
import { Download, Share2, Home } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useBooking } from '@/modules/booking/context/BookingContext';
import { cinemas } from '@/data/mockData';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
// @ts-ignore
import QRCode from 'react-qr-code'; // Assuming usage of a QR lib or keeping current SVG if simple

export function Receipt() {
  const {
    selectedMovie,
    selectedShowtime,
    selectedDate,
    selectedTickets,
    selectedSeats,
    selectedSnacks,
    cinema,
    getTotal,
    resetBooking,
  } = useBooking();

  const receiptRef = useRef<HTMLDivElement>(null);

  if (!selectedMovie || !selectedShowtime) return null;

  const cinemaInfo = cinemas.find(c => c.id === cinema);
  const total = getTotal();
  const orderNumber = `ORD-${Date.now().toString().slice(-8)}`;

  const handleDownloadPDF = async () => {
    const element = document.getElementById('receipt-card');
    if (!element) return;

    try {
      // Clone to avoid modifying the visible DOM and to fix PDF issues
      const clone = element.cloneNode(true) as HTMLElement;
      clone.style.position = 'absolute';
      clone.style.left = '-9999px';
      clone.style.top = '0';
      // Remove backdrop blur from clone to prevent rendering issues
      const blurOverlay = clone.querySelector('.backdrop-blur-md');
      if (blurOverlay) {
        blurOverlay.classList.remove('backdrop-blur-md');
        blurOverlay.classList.add('bg-black/80'); // Darker overlay to compensate
      }
      document.body.appendChild(clone);

      const canvas = await html2canvas(clone, {
        scale: 2,
        backgroundColor: '#000000', // Force solid hex background
        useCORS: true,
        logging: false,
      });

      document.body.removeChild(clone);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`ToTalk-Ticket-${orderNumber}.pdf`);
    } catch (err) {
      console.error("PDF generation failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-8 lg:py-0">
      <div className="container mx-auto px-4 h-full">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:h-[calc(100vh-80px)] lg:items-center">

          {/* LEFT COLUMN (Desktop): Message & Actions */}
          <div className="flex flex-col items-center justify-center text-center space-y-8 animate-fade-in mb-12 lg:mb-0">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-green-500/10 flex items-center justify-center animate-pulse">
                <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center">
                  <svg className="w-12 h-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-linear-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                ¡Compra Exitosa!
              </h1>
              <p className="text-xl text-muted-foreground max-w-md mx-auto">
                Hemos enviado los detalles de tu compra a tu correo electrónico.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
              <Button
                variant="outline"
                className="flex-1 h-12 font-bold text-lg"
                onClick={handleDownloadPDF}
              >
                <Download className="w-5 h-5 mr-2" />
                Ticket PDF
              </Button>
              <Button
                className="flex-1 bg-linear-to-r from-emerald-400 to-green-500 text-white hover:opacity-90 transition-opacity h-12 font-bold text-lg border-0"
                onClick={resetBooking}
              >
                <Home className="w-5 h-5 mr-2" />
                Inicio
              </Button>
            </div>
          </div>

          {/* RIGHT COLUMN (Desktop): Ticket Card */}
          <div className="flex justify-center animate-slide-up">
            <div
              id="receipt-card"
              className="relative w-full max-w-md overflow-hidden shadow-2xl dark:shadow-[0_0_30px_rgba(255,255,255,0.1)] rounded-3xl text-white"
            >
              {/* Background Poster with Blur */}
              <div
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${selectedMovie.poster})` }}
              />
              <div className="absolute inset-0 z-0 bg-black/60 backdrop-blur-md" />

              {/* Content Container */}
              <div className="relative z-10">
                {/* Header Image (Clear) */}
                <div className="relative h-48">
                  <img
                    src={selectedMovie.poster}
                    alt={selectedMovie.title}
                    className="w-full h-full object-cover object-top mask-image-bottom"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-6">
                    <h2 className="text-3xl font-bold leading-none text-white drop-shadow-md">{selectedMovie.title}</h2>
                    <p className="text-sm opacity-90 mt-1 text-[#F5B041] font-semibold tracking-wide">{selectedShowtime.format}</p>
                  </div>
                </div>

                <div className="p-8 pt-6">
                  {/* QR Code */}
                  <div className="flex justify-center mb-8 relative">
                    <div className="bg-white p-3 rounded-2xl shadow-xl">
                      <svg viewBox="0 0 100 100" className="w-32 h-32 text-black">
                        <path fill="currentColor" d="M0 0h100v100H0z" fillOpacity="0" />
                        <path fill="currentColor" d="M10 10h30v30H10zm40 0h10v10H50zm20 0h20v20H70zm-20 20h10v10H50zm10 20h20v20H60zm-30 10h10v10H30zm40 10h10v10H70zM10 60h30v30H10z" />
                        <rect x="15" y="15" width="20" height="20" fill="currentColor" />
                        <rect x="15" y="65" width="20" height="20" fill="currentColor" />
                        <rect x="65" y="15" width="20" height="20" fill="currentColor" />
                      </svg>
                    </div>
                    <div className="absolute -bottom-6 bg-black/80 px-3 py-1 rounded-full border border-white/10">
                      <p className="text-[10px] font-mono text-white tracking-widest">{orderNumber}</p>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-y-6 gap-x-4 text-sm mb-8">
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Cine</p>
                      <p className="font-bold text-lg leading-tight text-white">{cinemaInfo?.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Sala</p>
                      <p className="font-bold text-lg text-[#F5B041]">{selectedShowtime.room}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Fecha</p>
                      <p className="font-bold text-white">{format(selectedDate, "d MMM yyyy", { locale: es })}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Hora</p>
                      <p className="font-bold text-white">{selectedShowtime.time}</p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t-2 border-dashed border-white/20 mb-6 relative">
                    <div className="absolute -left-10 -top-3 w-6 h-6 bg-black rounded-full" />
                    <div className="absolute -right-10 -top-3 w-6 h-6 bg-black rounded-full" />
                  </div>

                  {/* Seats & Info */}
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-gray-400 text-xs uppercase tracking-wider">Asientos</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedSeats.map(s => (
                          <span key={s.id} className="bg-[#F5B041] text-black text-xs font-bold px-3 py-1 rounded-md shadow-lg shadow-orange-500/20">
                            {s.row}{s.number}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-end pt-2 border-t border-white/10">
                      <span className="text-gray-400 font-medium text-sm uppercase tracking-wider">Total</span>
                      <span className="text-3xl font-black text-white">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Brand Footer */}
                  <div className="mt-8 text-center pt-4 opacity-50">
                    <p className="font-bold tracking-[0.3em] text-[10px] uppercase">To Talk Cinema</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
