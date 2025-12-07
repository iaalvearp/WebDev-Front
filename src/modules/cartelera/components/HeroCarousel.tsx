import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Edit2, Save } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { movieService } from '@/modules/cartelera/services/movieService';
import type { Movie } from '@/modules/cartelera/types/Movie';
import { useBooking } from '@/modules/booking/context/BookingContext';
import { cn } from '@/lib/utils';

export function HeroCarousel(props: any) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const { setSelectedMovie, user } = useBooking();
  const [editMode, setEditMode] = useState<string | null>(null); // ID of movie being edited
  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await movieService.getMovies();
        // Sort by ID to match backend order if needed, though backend usually sends list in order
        // The user specifically asked to "ordena según la indicación que te paso aquí" which implies a specific order or just ensuring it matches the list provided.
        // Since the list provided is just a list of new Pelicula(), we assume the backend returns them in that order or we should respect the backend order.
        // However, let's just take the data as is, but if we need to be safe, we can sort by ID.
        const sortedData = data.sort((a, b) => Number(a.id) - Number(b.id));
        setMovies(sortedData.slice(0, 5));
      } catch (error) {
        console.error('Failed to load movies for carousel', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  useEffect(() => {
    if (movies.length === 0) return;
    const timer = setInterval(() => {
      if (!editMode) {
        setCurrentSlide(prev => (prev + 1) % movies.length);
      }
    }, 6000);
    return () => clearInterval(timer);
  }, [movies.length, editMode]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleBuyTickets = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleEditImage = (movie: Movie) => {
    setEditMode(movie.id);
    setNewImageUrl(movie.backdrop);
  };

  const handleSaveImage = (movieId: string) => {
    setMovies(prev => prev.map(m =>
      m.id === movieId ? { ...m, backdrop: newImageUrl } : m
    ));
    setEditMode(null);
    // Here you would typically call an API to save the change
    console.log(`Saved new image for movie ${movieId}: ${newImageUrl}`);
  };

  if (loading || movies.length === 0) {
    return <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-muted animate-pulse" />;
  }

  return (
    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden group">
      {movies.map((movie, index) => (
        <div
          key={movie.id}
          className={cn(
            'carousel-slide',
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          )}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-500"
            style={{ backgroundImage: `url(${movie.backdrop})` }}
          >
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>



          {/* Content */}
          <div className="relative h-full container mx-auto px-4 flex items-center">
            <div className="max-w-xl space-y-4 animate-slide-in">
              <p className="text-primary font-medium text-sm uppercase tracking-wider">
                En Cartelera
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                {movie.title}
              </h1>
              <p className="text-lg text-white/90 line-clamp-3">
                {movie.synopsis}
              </p>
              <div className="flex items-center gap-4 text-sm text-white/80">
                <span>{movie.duration}</span>
                <span>•</span>
                <span>{movie.genre.join(', ')}</span>
              </div>
              <Button
                size="lg"
                className="text-black hover:opacity-90 mt-4 border-none font-bold"
                style={{ background: 'linear-gradient(to right, hsl(var(--primary)), hsl(var(--cinema-gold-light)))' }}
                onClick={() => handleBuyTickets(movie)}
              >
                Comprar Entradas
              </Button>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-background/20 hover:bg-background/40 backdrop-blur-sm text-foreground hidden sm:flex"
        onClick={() => goToSlide((currentSlide - 1 + movies.length) % movies.length)}
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-background/20 hover:bg-background/40 backdrop-blur-sm text-foreground hidden sm:flex"
        onClick={() => goToSlide((currentSlide + 1) % movies.length)}
      >
        <ChevronRight className="w-6 h-6" />
      </Button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {movies.map((_, index) => (
          <button
            key={index}
            className={cn(
              'w-3 h-3 rounded-full transition-all duration-300',
              index === currentSlide
                ? 'bg-primary w-8'
                : 'bg-foreground/30 hover:bg-foreground/50'
            )}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}
