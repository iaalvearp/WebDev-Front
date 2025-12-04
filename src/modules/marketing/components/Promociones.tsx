import { Percent, Calendar, Clock } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { useBooking } from '@/modules/booking/context/BookingContext';

export function Promociones() {
  const { setStep } = useBooking();

  const promotions = [
    {
      title: "Martes de Cine",
      description: "Todas las entradas a $5.00. ¡El mejor día para ir al cine!",
      discount: "50% OFF",
      validUntil: "Todos los martes",
      image: "🎬",
    },
    {
      title: "Combo Estudiante",
      description: "Presenta tu carnet y obtén entrada + popcorn mediano + bebida por $10.00",
      discount: "30% OFF",
      validUntil: "Todo el año",
      image: "📚",
    },
    {
      title: "Happy Hour",
      description: "Funciones antes de las 15:00 con 40% de descuento en entradas",
      discount: "40% OFF",
      validUntil: "De lunes a viernes",
      image: "☀️",
    },
    {
      title: "Pack Navideño",
      description: "4 entradas + 2 combos grandes por solo $45.00",
      discount: "ESPECIAL",
      validUntil: "Hasta 31 de Diciembre",
      image: "🎄",
    },
  ];

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gradient mb-4">Promociones</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Aprovecha nuestras ofertas especiales y ahorra en tu próxima visita
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {promotions.map((promo, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition-all animate-fade-in group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-5xl">{promo.image}</div>
                  <Badge className="bg-primary text-primary-foreground text-sm px-3 py-1">
                    {promo.discount}
                  </Badge>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {promo.title}
                </h3>
                <p className="text-muted-foreground mb-4">{promo.description}</p>
                <div className="flex items-center gap-2 text-sm text-primary">
                  <Calendar className="w-4 h-4" />
                  <span>{promo.validUntil}</span>
                </div>
              </div>
              <div className="px-6 py-4 bg-muted/30 border-t border-border">
                <Button 
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => setStep('cartelera')}
                >
                  Usar Promoción
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            onClick={() => setStep('cartelera')}
          >
            Volver a Cartelera
          </Button>
        </div>
      </div>
    </div>
  );
}
