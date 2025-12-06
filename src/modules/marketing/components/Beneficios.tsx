import { useEffect, useState } from 'react';
import { Gift, Star, Ticket, Users, Loader2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useBooking } from '@/modules/booking/context/BookingContext';
import { type Beneficio } from '@/modules/marketing/services/beneficiosService';

export function Beneficios() {
  const { setStep } = useBooking();
  const [benefits, setBenefits] = useState<Beneficio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBeneficios = async () => {
      console.log("Fetching beneficios...");
      try {
        const response = await fetch('http://localhost:8080/api/beneficios');
        if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
        const data = await response.json();
        console.log("Beneficios data:", data);
        if (data && data.length > 0) {
          console.log("First benefit structure:", data[0]);
        }
        setBenefits(data);
      } catch (error) {
        console.error('Failed to load beneficios', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBeneficios();
  }, []);

  // Fallback icons if not provided by backend logic (just for visual consistency if needed)
  const getIcon = (index: number) => {
    const icons = [Star, Ticket, Users, Gift];
    return icons[index % icons.length];
  };

  const getColor = (index: number) => {
    const colors = [
      "bg-yellow-500/20 text-yellow-500",
      "bg-green-500/20 text-green-500",
      "bg-pink-500/20 text-pink-500",
      "bg-blue-500/20 text-blue-500"
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gradient mb-4">Beneficios To Talk</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Disfruta de ventajas exclusivas siendo parte de nuestra comunidad
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => {
              const Icon = getIcon(index);
              // Flexible field mapping
              const title = benefit.titulo || (benefit as any).title || (benefit as any).nombre || 'Beneficio';
              const description = benefit.descripcion || (benefit as any).description || (benefit as any).desc || '';
              const imageSrc = benefit.imagen || (benefit as any).image || (benefit as any).icon;

              return (
                <div
                  key={benefit.id || index}
                  className="bg-card rounded-2xl border border-border p-6 hover:border-primary/50 transition-all animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`w-14 h-14 rounded-xl ${getColor(index)} flex items-center justify-center mb-4`}>
                    {imageSrc && (imageSrc.startsWith('http') || imageSrc.startsWith('/')) ? (
                      <img
                        src={imageSrc}
                        alt={title}
                        className="w-8 h-8 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          // Could show Icon here but parent div has color so it's fine just hiding
                        }}
                      />
                    ) : (
                      <Icon className="w-7 h-7" />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
                  <p className="text-muted-foreground">{description}</p>
                </div>
              );
            })}
          </div>
        )}

        <div className="text-center mt-12">
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => setStep('cartelera')}
          >
            Volver a Cartelera
          </Button>
        </div>
      </div>
    </div>
  );
}
