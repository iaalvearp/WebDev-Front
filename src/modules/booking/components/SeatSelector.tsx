"use client"

import { useState, useMemo, useEffect, useRef } from 'react';
import { ArrowLeft, MapPin, Calendar, Clock } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useBooking } from '@/modules/booking/context/BookingContext';
import { cn } from '@/lib/utils';

// --- ICONS ---

const SeatRegular = ({ className, strokeWidth = 1.5 }: { className?: string; strokeWidth?: number }) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 11a2 2 0 0 1 2 2v2h10v-2a2 2 0 1 1 4 0v4a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-4a2 2 0 0 1 2 -2z" />
    <path d="M5 11v-5a3 3 0 0 1 3 -3h8a3 3 0 0 1 3 3v5" />
    <path d="M6 19v2" />
    <path d="M18 19v2" />
  </svg>
);

const SeatVIP = ({ className, strokeWidth = 1.5 }: { className?: string; strokeWidth?: number }) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 11a2 2 0 0 1 2 2v1h12v-1a2 2 0 1 1 4 0v5a1 1 0 0 1 -1 1h-18a1 1 0 0 1 -1 -1v-5a2 2 0 0 1 2 -2z" />
    <path d="M4 11v-3a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v3" />
    <path d="M12 5v9" />
  </svg>
);

// --- INTERFACES ---

interface Seat {
  id: string;
  row: string;
  number: number;
  status: 'available' | 'taken' | 'selected';
  type: 'normal' | 'vip';
  price: number;
}

export function SeatSelector() {
  const { selectedShowtime, selectedSeats, addSeat, removeSeat, setStep, selectedMovie, setSelectedTickets } = useBooking();
  const [occupiedSeats, setOccupiedSeats] = useState<string[]>([]);
  const [isDark, setIsDark] = useState(false);

  // Detect Theme (JS Force Mode)
  useEffect(() => {
    const checkTheme = () => setIsDark(document.documentElement.classList.contains('dark'));
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Fetch occupied seats
  useEffect(() => {
    if (!selectedShowtime) return;

    const fetchOccupiedSeats = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/reservas?funcionId=${selectedShowtime.id}`);
        if (response.ok) {
          const reservations = await response.json();
          // Assuming reservations is an array of objects with a 'seats' property (string[])
          // based on the previous payload structure: { seats: ["A1", "A2"] }
          // If the backend returns just a list of reservations, we extract all seats.
          // Adjust logic based on actual response structure if known, otherwise:
          const taken: string[] = reservations.flatMap((r: any) => r.seats || []);
          setOccupiedSeats(taken);
        }
      } catch (error) {
        console.error("Failed to fetch occupied seats", error);
      }
    };

    fetchOccupiedSeats();
  }, [selectedShowtime]);

  if (!selectedShowtime || !selectedMovie) return null;

  // --- LOGIC ---

  const isVIPRoom = selectedShowtime.roomType?.toUpperCase().includes('VIP');

  // Generate Grid Dynamically
  const seatGrid = useMemo(() => {
    const grid: { row: string, seats: (Seat | null)[] }[] = [];

    if (isVIPRoom) {
      // VIP Layout: 2-4-2 (Total 8 columns logic but effectively 2, SPACE, 2, SPACE, 2)
      // Actually per instructions: "2 sillas - espacio - 2 sillas - espacio - 2 sillas" -> 2+1+2+1+2 = 8 cols total width?
      // Wait, 2+2+2 = 6 chairs.
      // Let's implement 8 columns grid.
      // Pattern: [Seat][Seat] [Gap] [Seat][Seat] [Gap] [Seat][Seat] -> wait that's 2,1,2,1,2 = 8 cols.
      // It implies 3 blocks of 2 seats.

      const rows = ['A', 'B', 'C', 'D'];
      rows.forEach(row => {
        const rowItems: (Seat | null)[] = [];
        let seatNum = 1;

        // 8 Columns
        // Col 1-2: Seats
        // Col 3: Gap
        // Col 4-5: Seats
        // Col 6: Gap
        // Col 7-8: Seats

        for (let col = 1; col <= 8; col++) {
          if (col === 3 || col === 6) {
            rowItems.push(null); // Gap
          } else {
            rowItems.push({
              id: `${row}${seatNum}`,
              row,
              number: seatNum++,
              status: 'available', // Randomly taken logical handled later or just clean state
              type: 'vip',
              price: selectedShowtime.price || 12.00
            });
          }
        }
        grid.push({ row, seats: rowItems });
      });
    } else {
      // Standard Layout: 14 Columns
      // Pattern: "Bloque central sólido con pasillos laterales pequeños"
      // Let's try: [2 seats] [Gap] [8 seats] [Gap] [2 seats] -> 2+1+8+1+2 = 14 cols.

      const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
      rows.forEach(row => {
        const rowItems: (Seat | null)[] = [];
        let seatNum = 1;

        for (let col = 1; col <= 14; col++) {
          // Gap at col 3 and 12
          if (col === 3 || col === 12) {
            rowItems.push(null);
          } else {
            rowItems.push({
              id: `${row}${seatNum}`,
              row,
              number: seatNum++,
              status: 'available',
              type: 'normal',
              price: selectedShowtime.price || 6.50
            });
          }
        }
        grid.push({ row, seats: rowItems });
      });
    }
    return grid;
  }, [isVIPRoom, selectedShowtime]);

  // Handle Click
  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'taken') return;
    const isSelected = selectedSeats.some(s => s.id === seat.id);
    if (isSelected) {
      removeSeat(seat.id);
    } else {
      addSeat({ ...seat });
    }
  };

  const isSeatSelected = (id: string) => selectedSeats.some(s => s.id === id);

  const totalPrice = selectedSeats.reduce((sum, seat) => sum + (seat.price || 0), 0);

  const handleContinue = () => {
    if (selectedSeats.length === 0) return;

    // Auto-create ticket based on showtime price or default standard
    const baseTicketType = {
      id: isVIPRoom ? 'vip' : 'general',
      name: `${isVIPRoom ? 'VIP' : 'General'} ${selectedShowtime.format}`,
      price: selectedShowtime.price || (isVIPRoom ? 12.00 : 6.50)
    };

    const tickets = [{
      type: baseTicketType,
      quantity: selectedSeats.length
    }];

    // @ts-ignore
    setSelectedTickets(tickets);

    // Go directly to upsell
    setStep('snacks');
  };

  // --- RENDER ---
  return (
    <div className={`min-h-screen transition-colors ${isDark ? 'bg-background text-foreground' : 'bg-gray-50 text-gray-900'}`}>
      {/* HEADER MOBILE ONLY */}
      <div className="lg:hidden p-4 border-b border-white/10 flex items-center gap-4">
        <Button variant="ghost" className="p-0 hover:bg-transparent text-white" onClick={() => setStep('movie')}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div className="flex-1">
          <h2 className="font-bold truncate">{selectedMovie.title}</h2>
          <p className="text-xs text-gray-400">{selectedShowtime.time} - {selectedShowtime.format}</p>
        </div>
      </div>


      <div className="container mx-auto lg:px-4 lg:py-8 h-full">

        {/* DESKTOP BACK BUTTON */}
        <div className="hidden lg:flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => setStep('movie')}
            className="gap-2 pl-0 text-muted-foreground hover:text-primary hover:bg-transparent transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-lg">Volver</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">

          {/* SEATING AREA */}
          <div className="w-full max-w-4xl mx-auto rounded-3xl p-8 border border-transparent relative overflow-hidden min-h-[500px] flex flex-col items-center transition-colors">


            {/* SCREEN */}
            <div className={`w-3/4 h-4 border-t-4 rounded-[50%] mb-12 shadow-2xl ${isDark
              ? 'border-white/50 shadow-[0_-10px_20px_rgba(255,255,255,0.1)]'
              : 'border-black/50 shadow-[0_-10px_20px_rgba(0,0,0,0.1)]'
              }`}></div>
            <p className={`text-xs mb-8 uppercase tracking-[0.2em] font-bold ${isDark ? 'text-gray-400' : 'text-black'
              }`}>Pantalla</p>

            {/* SEAT GRID */}
            <div className="flex flex-col gap-3">
              {seatGrid.map((rowItem) => (
                <div key={rowItem.row} className="flex items-center gap-4">
                  {/* Row Label Left */}
                  <span className={`w-4 text-xs font-bold text-center ${isDark ? 'text-gray-400' : 'text-black'}`}>{rowItem.row}</span>

                  <div
                    className={cn(
                      "grid gap-2",
                      isVIPRoom ? "grid-cols-8 gap-x-2" : "grid-cols-14 gap-x-1"
                    )}
                  >
                    {rowItem.seats.map((seat, idx) => {
                      if (!seat) {
                        return <div key={`gap-${rowItem.row}-${idx}`} className="w-8 h-8" />
                      }

                      const isSelected = isSeatSelected(seat.id);
                      const isTaken = seat.status === 'taken' || occupiedSeats.includes(seat.id);

                      // --- BUTTON BACKGROUND STYLES (Requested Spec) ---
                      let buttonStyle = {};
                      if (!isTaken && !isSelected) {
                        buttonStyle = {
                          backgroundColor: isDark ? 'rgb(255 255 255 / 40%)' : 'rgb(99 99 99 / 40%)',
                          borderRadius: '4px'
                        };
                      }

                      // --- SVG STYLES ---
                      let svgClass = "";

                      if (isTaken) {
                        // OCUPADO: Fill White (Pedido explícito)
                        svgClass = "text-gray-500 stroke-gray-500 fill-white opacity-50 cursor-not-allowed";
                      } else if (isSelected) {
                        // SELECCIONADO: Amarillo
                        svgClass = "text-[#F5B041] fill-[#F5B041] stroke-[#F5B041] drop-shadow-[0_0_8px_rgba(245,176,65,0.6)]";
                      } else {
                        // DISPONIBLE: Fill None, Stroke depends on theme
                        if (isDark) {
                          svgClass = "text-white stroke-white fill-none hover:text-[#F5B041] hover:stroke-[#F5B041] transition-colors duration-200";
                        } else {
                          svgClass = "text-black stroke-black fill-none hover:text-[#F5B041] hover:stroke-[#F5B041] transition-colors duration-200";
                        }
                      }

                      return (
                        <button
                          key={seat.id}
                          onClick={() => handleSeatClick(seat)}
                          disabled={isTaken}
                          style={buttonStyle} // Inline styles for RGB specificity
                          className={cn(
                            "flex items-center justify-center relative group focus:outline-none transition-all duration-200 hover:scale-105",
                            isVIPRoom ? "w-12 h-12" : "w-8 h-8",
                            isTaken && "cursor-not-allowed"
                          )}
                        >
                          {isVIPRoom ? (
                            <SeatVIP className={cn("w-full h-full", svgClass)} strokeWidth={1.5} />
                          ) : (
                            <SeatRegular className={cn("w-[70%] h-[70%]", svgClass)} strokeWidth={1.5} />
                          )}

                          {/* Tooltip */}
                          {!isTaken && (
                            <div className={`absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1.5 rounded-md text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-xl ${isDark ? 'bg-zinc-900 border border-white/10 text-white' : 'bg-white border border-gray-200 text-gray-900 shadow-gray-200'
                              }`}>
                              <span className="font-bold text-[#F5B041] block">{seat.row}{seat.number}</span>
                              <span className={isDark ? "text-gray-400" : "text-gray-500"}>${seat.price.toFixed(2)}</span>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Row Label Right */}
                  <span className={`w-4 text-xs font-bold text-center ${isDark ? 'text-gray-400' : 'text-black'}`}>{rowItem.row}</span>
                </div>
              ))}
            </div>

            {/* LEGEND */}
            <div className={`flex items-center gap-6 mt-12 pt-6 border-t w-full justify-center ${isDark ? 'border-white/10' : 'border-black/10'}`}>

              {/* Disponible */}
              <div className="flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full border ${isDark ? 'border-white' : 'border-black'}`}
                  style={{ backgroundColor: isDark ? 'rgb(255 255 255 / 40%)' : 'rgb(99 99 99 / 40%)' }}
                ></span>
                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Disponible</span>
              </div>

              {/* Seleccionado */}
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#F5B041] border border-white"></span>
                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Seleccionado</span>
              </div>

              {/* Ocupado */}
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full border bg-transparent ${isDark ? 'border-white opacity-50' : 'border-black opacity-40'}`}></span>
                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Ocupado</span>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: SUMMARY STICKY */}
          <aside className="hidden lg:block sticky top-24 w-full h-fit">
            <div className={`backdrop-blur-md rounded-2xl p-6 shadow-2xl border transition-colors ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/80 border-gray-200'
              }`}>
              <div className={`flex items-start gap-4 mb-6 border-b pb-6 ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                <img src={selectedMovie.poster} alt="poster" className="w-20 h-28 object-cover rounded-lg shadow-lg" />
                <div>
                  <h3 className={`font-bold text-lg leading-tight mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedMovie.title}</h3>
                  <p className={`text-sm mb-2 truncate max-w-[150px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{selectedMovie.synopsis}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded border ${isDark ? 'bg-white/10 text-white border-white/5' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>{selectedShowtime.format}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded border ${isDark ? 'bg-white/10 text-white border-white/5' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>{selectedShowtime.roomType}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className={`flex items-center gap-3 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <MapPin className="w-4 h-4 text-[#F5B041]" />
                  <span>{selectedShowtime.room}</span>
                </div>
                <div className={`flex items-center gap-3 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <Calendar className="w-4 h-4 text-[#F5B041]" />
                  <span>{new Date().toLocaleDateString()}</span> {/* Ideally show selectedDate */}
                </div>
                <div className={`flex items-center gap-3 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <Clock className="w-4 h-4 text-[#F5B041]" />
                  <span>{selectedShowtime.time}</span>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 mb-6">
                <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-3">Asientos Seleccionados</h4>
                {selectedSeats.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">No has seleccionado asientos</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {selectedSeats.map(s => (
                      <span key={s.id} className="bg-[#F5B041] text-black text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                        {s.row}{s.number}
                        <button onClick={() => removeSeat(s.id)} className="hover:text-white/70">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-400">Total a pagar</span>
                <span className="text-2xl font-bold text-[#F5B041]">${totalPrice.toFixed(2)}</span>
              </div>

              <Button
                className="w-full bg-[#F5B041] hover:bg-[#E59830] text-black font-bold h-12 text-lg shadow-lg shadow-[#F5B041]/20"
                disabled={selectedSeats.length === 0}
                onClick={handleContinue}
              >
                CONTINUAR
              </Button>
            </div>
          </aside>

        </div>

        {/* MOBILE BOTTOM BAR (Fixed) */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border/10 p-4 pb-6 z-50 flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">Total ({selectedSeats.length})</span>
            <span className="text-xl font-bold text-[#F5B041]">${totalPrice.toFixed(2)}</span>
          </div>
          <Button
            className="flex-1 bg-[#F5B041] hover:bg-[#E59830] text-black font-bold h-12"
            disabled={selectedSeats.length === 0}
            onClick={handleContinue}
          >
            CONTINUAR
          </Button>
        </div>

      </div>
    </div>
  );
}
