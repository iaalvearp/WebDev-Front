import { User, Mail, Phone, Ticket, LogOut, Settings } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useBooking } from '@/modules/booking/context/BookingContext';

export function Perfil() {
  const { setStep } = useBooking();

  const userStats = [
    { label: 'Películas vistas', value: '24' },
    { label: 'Puntos acumulados', value: '1,250' },
    { label: 'Ahorrado total', value: '$85.00' },
  ];

  const recentPurchases = [
    { movie: 'Avatar: Fuego y Ceniza', date: '15 Dic 2024', tickets: 2, total: '$30.40' },
    { movie: 'Gladiador II', date: '10 Dic 2024', tickets: 3, total: '$25.50' },
    { movie: 'Wicked', date: '05 Dic 2024', tickets: 2, total: '$17.00' },
  ];

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Profile Header */}
          <div className="bg-card rounded-2xl border border-border p-6 mb-6 animate-fade-in">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Juan Pérez</h1>
                <p className="text-muted-foreground">Miembro CineFan desde 2023</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {userStats.map((stat, index) => (
                <div key={index} className="text-center p-4 bg-muted/30 rounded-xl">
                  <p className="text-2xl font-bold text-primary">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-card rounded-2xl border border-border p-6 mb-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <h2 className="text-lg font-semibold text-foreground mb-4">Información de Contacto</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-5 h-5" />
                <span>juan.perez@email.com</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="w-5 h-5" />
                <span>+593 99 123 4567</span>
              </div>
            </div>
          </div>

          {/* Recent Purchases */}
          <div className="bg-card rounded-2xl border border-border p-6 mb-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Ticket className="w-5 h-5 text-primary" />
              Compras Recientes
            </h2>
            <div className="space-y-4">
              {recentPurchases.map((purchase, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium text-foreground">{purchase.movie}</p>
                    <p className="text-sm text-muted-foreground">{purchase.date} • {purchase.tickets} entradas</p>
                  </div>
                  <span className="font-semibold text-primary">{purchase.total}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              className="flex-1 border-border text-foreground hover:bg-muted gap-2"
            >
              <Settings className="w-4 h-4" />
              Configuración
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground gap-2"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </Button>
          </div>

          <div className="text-center mt-8">
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => setStep('cartelera')}
            >
              Volver a Cartelera
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
