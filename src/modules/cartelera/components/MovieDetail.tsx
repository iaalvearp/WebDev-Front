import { useState, useRef, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { ArrowLeft, Clock, Play, ChevronLeft, ChevronRight, Clapperboard } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { useBooking } from '@/modules/booking/context/BookingContext';
import { cn } from '@/lib/utils';
import { format, addDays, isSameDay, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';

interface BackendShowtime {
  id: number;
  movie: any;
  sala: {
    id: number;
    name: string;
    type: string;
    capacity: number;
  };
  date: string;
  time: string;
  format: string;
  language: string;
  price: number;
  available: boolean;
}

export function MovieDetail() {
  const { selectedMovie, selectedDate, setSelectedDate, setSelectedShowtime, setStep, setSelectedMovie } = useBooking();
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [selectedRoom, setSelectedRoom] = useState('all');
  const scrollRef = useRef<HTMLDivElement>(null);

  const [funciones, setFunciones] = useState<BackendShowtime[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  if (!selectedMovie) return null;

  // Fetch real showtimes using API
  useEffect(() => {
    const fetchShowtimes = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`http://localhost:8080/api/funciones?peliculaId=${selectedMovie.id}`);
        if (res.ok) {
          const data = await res.json();
          setFunciones(Array.isArray(data) ? data : []);
        } else {
          setFunciones([]);
        }
      } catch (error) {
        console.error("Error loading showtimes", error);
        setFunciones([]);
      } finally {
        setIsLoading(false);
      }
    };
    if (selectedMovie) {
      fetchShowtimes();
    }
  }, [selectedMovie]);


  // Generate next 14 days STARTING FROM TODAY
  const today = startOfDay(new Date());
  const dates = Array.from({ length: 14 }, (_, i) => addDays(today, i));

  // Filter showtimes by Selected Date
  const showtimesForDate = funciones.filter(f => f.date === format(selectedDate, 'yyyy-MM-dd'));

  // Get unique languages, formats, and rooms from fetched data
  const languages = [...new Set(showtimesForDate.map(st => st.language || 'ESP'))];
  const formats = [...new Set(showtimesForDate.map(st => st.format))];
  const rooms = [...new Set(showtimesForDate.map(st => st.sala?.name || 'Sala'))];

  // Filter showtimes by dropdowns
  const filteredShowtimes = showtimesForDate.filter(st => {
    if (selectedLanguage !== 'all' && (st.language || 'ESP') !== selectedLanguage) return false;
    if (selectedFormat !== 'all' && st.format !== selectedFormat) return false;
    if (selectedRoom !== 'all' && (st.sala?.name || 'Sala') !== selectedRoom) return false;
    return true;
  });

  const handleShowtimeSelect = (showtime: BackendShowtime) => {
    if (!showtime.available) return;

    // Adapt BackendShowtime to the structure expected by Context/App (flat or compatible)
    // We pass the full backend object but context might need 'roomType' at top level if typed strictly.
    // Assuming context is flexible or we add necessary flat fields.
    const adaptedShowtime = {
      ...showtime,
      roomType: showtime.sala?.type || 'Normal', // Mapping for seat selection logic
      room: showtime.sala?.name || 'Sala'
    };

    // @ts-ignore
    setSelectedShowtime(adaptedShowtime);
    setStep('seats');
  };

  // Group showtimes by FORMAT (e.g. "2D-Esp") to match visual design
  const groupedShowtimes = filteredShowtimes.reduce((acc, st) => {
    const format = st.format || '2D';
    const language = st.language || 'ESP';
    const languageShort = language.substring(0, 3);

    // Create a key like "2D-ESP"
    const key = `${format}-${languageShort}`;

    if (!acc[key]) {
      acc[key] = {
        title: key,
        format: format,
        languageShort: languageShort,
        roomType: st.sala?.type || 'General',
        items: []
      };
    }
    acc[key].items.push(st);
    return acc;
  }, {} as Record<string, { title: string, format: string, languageShort: string, roomType: string, items: BackendShowtime[] }>);

  const hasShowtimes = filteredShowtimes.length > 0;

  // Scroll calendar
  const scrollCalendar = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Simulate date availability based on day of week (Visual only)
  const getDateAvailability = (date: Date) => {
    const dayOfWeek = date.getDay();
    const random = Math.random();
    if (dayOfWeek >= 1 && dayOfWeek <= 4) {
      if (random < 0.7) return 'available';
      if (random < 0.95) return 'limited';
      return 'sold-out';
    } else {
      if (random < 0.3) return 'available';
      if (random < 0.7) return 'limited';
      return 'sold-out';
    }
  };

  return (
    <div className="min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <img
          src={selectedMovie.backdrop}
          alt=""
          className="w-full h-full object-cover opacity-30 blur-sm"
        />
        <div className="absolute inset-0 bg-linear-to-b from-background/80 via-background/95 to-background" />
      </div>

      <div className="relative z-10">
        {/* Back Button */}
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-foreground gap-2"
            onClick={() => {
              if (document.startViewTransition) {
                document.startViewTransition(() => {
                  flushSync(() => {
                    setSelectedMovie(null);
                  });
                });
              } else {
                setSelectedMovie(null);
              }
            }}
          >
            <ArrowLeft className="w-5 h-5" />
            Regresar
          </Button>
        </div>

        {/* Content - 50/50 TWO COLUMNS */}
        <div className="container mx-auto px-4 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">

            {/* LEFT COLUMN - 50% - Movie Info */}
            <div className="space-y-4">
              {/* Poster */}
              <div className="relative rounded-lg overflow-hidden border-2 border-primary/30 shadow-xl max-w-sm">
                <img
                  src={selectedMovie.poster}
                  alt={selectedMovie.title}
                  className="w-full aspect-2/3 object-cover"
                  style={{ viewTransitionName: `movie-poster-${selectedMovie.id}` } as React.CSSProperties}
                />
                {selectedMovie.rating && (
                  <div className="absolute top-2 left-2 bg-card/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold">
                    {selectedMovie.rating}
                  </div>
                )}
              </div>

              {/* Movie title */}
              <div className="space-y-2">
                {selectedMovie.isPreSale && (
                  <Badge className="bg-destructive text-destructive-foreground">
                    Pre-venta
                  </Badge>
                )}
                <h1 className="text-2xl font-bold text-foreground">
                  {selectedMovie.title}
                </h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{selectedMovie.duration}</span>
                </div>
              </div>

              {/* Ver Trailer Button - YELLOW BACKGROUND, BLACK TEXT */}
              <Button
                className="w-max text-black font-bold gap-2 border-none hover:opacity-90 transition-opacity"
                style={{ background: 'linear-gradient(to right, hsl(var(--cinema-gold)), hsl(var(--cinema-gold-light)))' }}
              >
                <Play className="w-5 h-5" />
                Ver trailer
              </Button>

              {/* Sinopsis */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Sinopsis</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {selectedMovie.synopsis}
                </p>
              </div>

              {/* Información */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Información</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedMovie.genre.map((g: string) => (
                    <Badge key={g} variant="secondary" className="bg-secondary text-secondary-foreground">
                      {g}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN - 50% - Showtimes */}
            <div className="space-y-6">
              {/* Funciones Header */}
              <h2 className="text-xl font-semibold text-foreground">Funciones</h2>

              {/* 3 Dropdowns */}
              <div className="grid grid-cols-3 gap-3">
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="bg-muted/60 backdrop-blur-md border-border/50 hover:bg-muted/70 transition-colors">
                    <SelectValue placeholder="Idiomas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos Los Idiomas</SelectItem>
                    {languages.map(lang => (
                      <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                  <SelectTrigger className="bg-muted/60 backdrop-blur-md border-border/50 hover:bg-muted/70 transition-colors">
                    <SelectValue placeholder="Formatos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos Los Formatos</SelectItem>
                    {formats.map(fmt => (
                      <SelectItem key={fmt} value={fmt}>{fmt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                  <SelectTrigger className="bg-muted/60 backdrop-blur-md border-border/50 hover:bg-muted/70 transition-colors">
                    <SelectValue placeholder="Salas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas Las Salas</SelectItem>
                    {rooms.map(room => (
                      <SelectItem key={room} value={room}>{room}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Month Title */}
              <h3 className="text-lg text-muted-foreground font-medium capitalize">
                {format(today, 'MMMM', { locale: es })}
              </h3>

              {/* Scrolling Calendar Bar - HORIZONTAL */}
              <div className="relative bg-card/40 backdrop-blur-md rounded-xl p-4 border border-border/30">
                {/* Left Arrow */}
                <button
                  onClick={() => scrollCalendar('left')}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-background/90 backdrop-blur-sm p-2 rounded-full hover:bg-background transition-colors shadow-md"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Scrollable dates */}
                <div
                  ref={scrollRef}
                  className="flex gap-3 overflow-x-auto scrollbar-hide px-12 py-2"
                >
                  {dates.map(date => {
                    const isSelected = isSameDay(date, selectedDate);
                    const availability = getDateAvailability(date);

                    return (
                      <button
                        key={date.toISOString()}
                        className={cn(
                          'flex flex-col items-center justify-center min-w-[70px] p-3 rounded-lg transition-all shrink-0',
                          isSelected
                            ? 'text-black font-bold shadow-lg'
                            : 'bg-background/50 text-muted-foreground hover:bg-background/70'
                        )}
                        style={isSelected ? { background: 'linear-gradient(to right, hsl(var(--cinema-gold)), hsl(var(--cinema-gold-light)))' } : undefined}
                        onClick={() => setSelectedDate(date)}
                      >
                        <span className={cn(
                          "text-xs uppercase font-medium",
                          isSelected && "text-black"
                        )}>
                          {format(date, 'EEE', { locale: es }).substring(0, 3)}
                        </span>
                        <span className={cn(
                          "text-2xl font-bold mt-1",
                          isSelected && "text-black"
                        )}>
                          {format(date, 'dd')}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Right Arrow */}
                <button
                  onClick={() => scrollCalendar('right')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-background/90 backdrop-blur-sm p-2 rounded-full hover:bg-background transition-colors shadow-md"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Legend */}
              <div className="flex gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-muted-foreground">Disponibles</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="text-muted-foreground">No Disponible</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-muted-foreground">Agotado</span>
                </div>
              </div>

              {/* Scala Section */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-semibold text-foreground">Scala - Cumbayá</h4>
                </div>

                {isLoading ? (
                  <div className="text-center py-12 text-muted-foreground">Cargando funciones...</div>
                ) : hasShowtimes ? (
                  <div className="space-y-6">
                    {Object.values(groupedShowtimes).map((group) => (
                      <div key={group.title} className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border-2 border-border/50">
                        {/* Header: e.g. "2D-ESP" */}
                        <div className="flex items-center gap-2 mb-2">
                          <h5 className="text-xl font-bold text-foreground">{group.format}-{group.languageShort}</h5>
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded uppercase tracking-wider">{group.roomType}</span>
                        </div>
                        <div className="w-full h-px bg-dashed border-t border-border/30 border-dashed mb-4" />

                        <div className="flex flex-wrap gap-3">
                          {group.items
                            .sort((a, b) => (a.time || '').localeCompare(b.time || ''))
                            .map(st => (
                              <Button
                                key={st.id}
                                variant={'outline'}
                                className={cn(
                                  'min-w-[80px] font-semibold border-cinema-gold text-cinema-gold hover:bg-cinema-gold hover:text-black transition-all',
                                  !st.available && 'opacity-40 cursor-not-allowed border-muted text-muted-foreground'
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
                ) : (
                  <div className="bg-card/30 backdrop-blur-sm rounded-xl p-12 border-2 border-dashed border-border/50 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 bg-muted/20 rounded-full">
                        <Clapperboard className="w-16 h-16 text-muted-foreground/50" />
                      </div>
                      <p className="text-muted-foreground text-lg font-medium">
                        No hay funciones disponibles para esta fecha
                      </p>
                      <Button
                        className="text-black font-bold mt-4 border-none hover:opacity-90 transition-opacity px-8 py-6 text-lg shadow-lg shadow-yellow-500/20"
                        style={{ background: 'linear-gradient(to right, hsl(var(--cinema-gold)), hsl(var(--cinema-gold-light)))' }}
                        onClick={() => {
                          const nextDay = addDays(selectedDate, 1);
                          setSelectedDate(nextDay);
                        }}
                      >
                        Buscar siguiente fecha disponible
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>


    </div>
  );
}
