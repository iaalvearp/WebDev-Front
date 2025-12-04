import { useState } from 'react';
import { ArrowLeft, Clock, Play, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { useBooking } from '@/modules/booking/context/BookingContext';
import { showtimes } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { format, addDays, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';

export function MovieDetail() {
  const { selectedMovie, selectedDate, setSelectedDate, setSelectedShowtime, setStep, setSelectedMovie } = useBooking();
  const [dateOffset, setDateOffset] = useState(0);
  
  if (!selectedMovie) return null;

  const movieShowtimes = showtimes[selectedMovie.id] || [];
  
  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i + dateOffset));

  const handleShowtimeSelect = (showtime: typeof movieShowtimes[0]) => {
    if (!showtime.available) return;
    setSelectedShowtime(showtime);
    setStep('seats');
  };

  // Group showtimes by room type
  const groupedShowtimes = movieShowtimes.reduce((acc, st) => {
    if (!acc[st.roomType]) acc[st.roomType] = [];
    acc[st.roomType].push(st);
    return acc;
  }, {} as Record<string, typeof movieShowtimes>);

  return (
    <div className="min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <img
          src={selectedMovie.backdrop}
          alt=""
          className="w-full h-full object-cover opacity-30 blur-sm"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/95 to-background" />
      </div>

      <div className="relative z-10">
        {/* Back Button */}
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-foreground gap-2"
            onClick={() => setSelectedMovie(null)}
          >
            <ArrowLeft className="w-5 h-5" />
            Regresar
          </Button>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 pb-12">
          <div className="grid lg:grid-cols-[350px,1fr] gap-8">
            {/* Left - Movie Info */}
            <div className="space-y-6">
              {/* Poster */}
              <div className="relative rounded-xl overflow-hidden border-2 border-primary/30 shadow-2xl max-w-xs mx-auto lg:mx-0">
                <img
                  src={selectedMovie.poster}
                  alt={selectedMovie.title}
                  className="w-full aspect-[2/3] object-cover"
                />
              </div>

              {/* Info */}
              <div className="space-y-4">
                {selectedMovie.isPreSale && (
                  <Badge className="bg-destructive text-destructive-foreground">
                    Pre-venta
                  </Badge>
                )}
                <p className="text-sm text-muted-foreground">{selectedMovie.rating}</p>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  {selectedMovie.title}
                </h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-5 h-5" />
                  <span>{selectedMovie.duration}</span>
                </div>

                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground gap-2"
                >
                  <Play className="w-4 h-4" />
                  Ver trailer
                </Button>

                <div className="space-y-3 pt-4">
                  <h3 className="text-lg font-semibold text-foreground">Sinopsis</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {selectedMovie.synopsis}
                  </p>
                </div>

                <div className="space-y-3 pt-4">
                  <h3 className="text-lg font-semibold text-foreground">Información</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMovie.genre.map(g => (
                      <Badge key={g} variant="secondary" className="bg-secondary text-secondary-foreground">
                        {g}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Showtimes */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground">Funciones</h2>

              {/* Date Selector */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-muted-foreground font-medium">
                    {format(new Date(), 'MMMM yyyy', { locale: es })}
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDateOffset(Math.max(0, dateOffset - 7))}
                      disabled={dateOffset === 0}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDateOffset(dateOffset + 7)}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2">
                  {dates.map(date => (
                    <button
                      key={date.toISOString()}
                      className={cn(
                        'flex flex-col items-center min-w-[60px] px-3 py-2 rounded-lg transition-all',
                        isSameDay(date, selectedDate)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                      )}
                      onClick={() => setSelectedDate(date)}
                    >
                      <span className="text-xs uppercase">
                        {format(date, 'EEE', { locale: es })}
                      </span>
                      <span className="text-xl font-bold">
                        {format(date, 'd')}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Legend */}
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-primary" />
                    <span>Disponibles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-muted" />
                    <span>No Disponible</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-destructive" />
                    <span>Agotado</span>
                  </div>
                </div>
              </div>

              {/* Showtime Cards */}
              <div className="space-y-4">
                {Object.entries(groupedShowtimes).map(([roomType, times]) => (
                  <div key={roomType} className="bg-card rounded-xl p-4 border border-border">
                    <div className="flex items-center gap-2 mb-4">
                      <h4 className="text-lg font-semibold text-foreground">{times[0].format}</h4>
                      <span className="text-muted-foreground">•</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{times[0].room}</p>
                    <div className="border-t border-dashed border-border my-4" />
                    <div className="flex flex-wrap gap-3">
                      {times.map(st => (
                        <Button
                          key={st.id}
                          variant={st.available ? 'outline' : 'ghost'}
                          className={cn(
                            'min-w-[70px]',
                            st.available
                              ? 'border-primary text-primary hover:bg-primary hover:text-primary-foreground'
                              : 'opacity-50 cursor-not-allowed'
                          )}
                          onClick={() => handleShowtimeSelect(st)}
                          disabled={!st.available}
                        >
                          {st.time}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
