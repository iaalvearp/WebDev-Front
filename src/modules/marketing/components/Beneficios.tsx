import { Gift, Star, Ticket, Users } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useBooking } from '@/modules/booking/context/BookingContext';

export function Beneficios() {
  const { setStep } = useBooking();

  const benefits = [
    {
      icon: Star,
      title: "CineFan Club",
      description: "Acumula puntos por cada compra y canjéalos por entradas gratis, combos y más.",
      color: "bg-yellow-500/20 text-yellow-500",
    },
    {
      icon: Ticket,
      title: "2x1 en Entradas",
      description: "Todos los martes y miércoles, paga una entrada y llévate dos.",
      color: "bg-green-500/20 text-green-500",
    },
    {
      icon: Users,
      title: "Cumpleaños Gratis",
      description: "En tu cumpleaños, recibe una entrada gratis + combo de palomitas.",
      color: "bg-pink-500/20 text-pink-500",
    },
    {
      icon: Gift,
      title: "Descuento Familiar",
      description: "Grupos de 4+ personas reciben 15% de descuento en entradas.",
      color: "bg-blue-500/20 text-blue-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gradient mb-4">Beneficios CinePlus</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Disfruta de ventajas exclusivas siendo parte de nuestra comunidad
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl border border-border p-6 hover:border-primary/50 transition-all animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-14 h-14 rounded-xl ${benefit.color} flex items-center justify-center mb-4`}>
                <benefit.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>

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
