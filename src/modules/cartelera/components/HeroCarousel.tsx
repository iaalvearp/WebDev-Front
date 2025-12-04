import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { heroSlides, movies } from '@/data/mockData';
import { useBooking } from '@/modules/booking/context/BookingContext';
import { cn } from '@/lib/utils';

export function HeroCarousel(props: any) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { setSelectedMovie } = useBooking();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleBuyTickets = () => {
    const movie = movies.find(m => m.id === heroSlides[currentSlide].movieId);
    if (movie) {
      setSelectedMovie(movie);
    }
  };

  return (
    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            'carousel-slide',
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          )}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>

          {/* Content */}
          <div className="relative h-full container mx-auto px-4 flex items-center">
            <div className="max-w-xl space-y-4 animate-slide-in">
              <p className="text-primary font-medium text-sm uppercase tracking-wider">
                En Cartelera
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                {slide.title}
              </h1>
              <p className="text-lg text-muted-foreground">
                {slide.subtitle}
              </p>
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 cinema-glow mt-4"
                onClick={handleBuyTickets}
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
        onClick={() => goToSlide((currentSlide - 1 + heroSlides.length) % heroSlides.length)}
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-background/20 hover:bg-background/40 backdrop-blur-sm text-foreground hidden sm:flex"
        onClick={() => goToSlide((currentSlide + 1) % heroSlides.length)}
      >
        <ChevronRight className="w-6 h-6" />
      </Button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroSlides.map((_, index) => (
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
