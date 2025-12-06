import { useEffect, useState } from 'react';
import { Percent, Calendar, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { toast } from 'sonner';
import { Badge } from '@/shared/components/ui/badge';
import { useBooking } from '@/modules/booking/context/BookingContext';
import { type Promocion } from '@/modules/marketing/services/promocionesService';

export function Promociones() {
  const { setStep, setSelectedPromotion } = useBooking();
  const [promotions, setPromotions] = useState<Promocion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromociones = async () => {
      console.log("Fetching promociones...");
      try {
        const response = await fetch('http://localhost:8080/api/promociones');
        if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
        const data = await response.json();
        console.log("Promociones data:", data);
        if (data && data.length > 0) {
          console.log("First promo structure:", data[0]);
        }
        setPromotions(data);
      } catch (error) {
        console.error('Failed to load promociones', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPromociones();
  }, []);

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gradient mb-4">Promociones</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Aprovecha nuestras ofertas especiales y ahorra en tu próxima visita
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {promotions.map((promo, index) => {
              // Flexible field mapping
              const title = promo.titulo || (promo as any).title || (promo as any).nombre || 'Promoción';
              const description = promo.descripcion || (promo as any).description || (promo as any).desc || '';
              const imageSrc = promo.imagen || (promo as any).image || (promo as any).icon;
              const discount = promo.descuento || (promo as any).discount || '';
              const code = promo.codigo || (promo as any).code || 'Válido por tiempo limitado';

              return (
                <div
                  key={promo.id || index}
                  className="bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition-all animate-fade-in group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-5xl flex items-center justify-center w-16 h-16 bg-muted rounded-lg overflow-hidden">
                        {imageSrc && (imageSrc.startsWith('http') || imageSrc.startsWith('/')) ? (
                          <img
                            src={imageSrc}
                            alt={title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                              ((e.target as HTMLImageElement).parentElement!).innerText = '🎬';
                            }}
                          />
                        ) : (
                          <span>{imageSrc || '🎬'}</span>
                        )}
                      </div>
                      {discount && (
                        <Badge className="bg-primary text-primary-foreground text-sm px-3 py-1">
                          {discount}
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {title}
                    </h3>
                    <p className="text-muted-foreground mb-4">{description}</p>
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <Calendar className="w-4 h-4" />
                      <span>{code}</span>
                    </div>
                  </div>
                  <div className="px-6 py-4 bg-muted/30 border-t border-border">
                    <Button
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() => {
                        setSelectedPromotion(promo);
                        setStep('cartelera');
                        toast.success(`Promoción aplicada: ${promo.titulo}`);
                      }}
                    >
                      Usar Promoción
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

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
