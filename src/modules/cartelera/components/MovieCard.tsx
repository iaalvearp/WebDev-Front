import { Clock } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import type { Movie } from '@/modules/cartelera/types/Movie';
import { useBooking } from '@/modules/booking/context/BookingContext';
import { cn } from '@/lib/utils';

interface MovieCardProps {
  movie: Movie;
  index: number;
}

export function MovieCard({ movie, index }: MovieCardProps) {
  const { setSelectedMovie } = useBooking();

  return (
    <div
      className="group relative animate-fade-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="relative overflow-hidden rounded-xl bg-card border border-border/50 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
        {/* Poster */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Pre-sale Badge */}
          {movie.isPreSale && (
            <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground">
              Pre-venta
            </Badge>
          )}

          {/* Rating Badge */}
          <Badge
            variant="secondary"
            className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm text-foreground"
          >
            {movie.rating}
          </Badge>

          {/* Hover Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
              onClick={() => setSelectedMovie(movie)}
            >
              Ver Funciones
            </Button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {movie.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{movie.duration}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {movie.genre.slice(0, 2).map(g => (
              <Badge key={g} variant="outline" className="text-xs border-border text-muted-foreground">
                {g}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Buy Button - Mobile */}
      <Button
        className="w-full mt-3 bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all lg:hidden"
        onClick={() => setSelectedMovie(movie)}
      >
        Comprar
      </Button>
    </div>
  );
}
