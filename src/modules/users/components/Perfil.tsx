import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, LogOut, Settings } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useBooking } from '@/modules/booking/context/BookingContext';
import { LoginForm } from './LoginForm';
import { AdminPanel } from './AdminPanel';

interface PerfilProps {
  [key: string]: any;
}

export function Perfil(_props: PerfilProps) {
  const { setStep, user, logout } = useBooking();
  // Initialize with null to avoid hydration mismatch
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!user) {
    return <LoginForm />;
  }

  const formattedDate = currentTime
    ? currentTime.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  const formattedTime = currentTime
    ? currentTime.toLocaleTimeString('es-ES')
    : '';

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">

          {/* User Stats - Only for non-admins */}
          {user.rol !== 'ADMIN' && (
            <div className="bg-card rounded-2xl border border-border p-6 mb-6 animate-fade-in">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{user.nombre}</h1>
                  <p className="text-muted-foreground">Miembro To Talk desde 2025</p>
                  {currentTime && (
                    <p className="text-sm font-medium text-primary mt-1">
                      {formattedDate}
                      <span className="mx-2">•</span>
                      {formattedTime}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Admin Header - Only for admins */}
          {user.rol === 'ADMIN' && (
            <div className="bg-card rounded-2xl border border-border p-6 mb-6 animate-fade-in">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-[#F5B041]/20 flex items-center justify-center">
                  <Settings className="w-10 h-10 text-[#F5B041]" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Panel de Administración</h1>
                  <p className="text-muted-foreground">Bienvenido, {user.nombre}</p>
                </div>
              </div>
            </div>
          )}

          {/* Contact Info */}
          <div className="bg-card rounded-2xl border border-border p-6 mb-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <h2 className="text-lg font-semibold text-foreground mb-4">Información de Contacto</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-5 h-5" />
                <span>{user.email}</span>
              </div>
              {user.telefono && (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Phone className="w-5 h-5" />
                  <span>{user.telefono}</span>
                </div>
              )}
              {/* Fallback phone if user.telefono isn't set yet (for older users) */}
              {!user.telefono && (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Phone className="w-5 h-5" />
                  <span>+593 99 123 4567</span>
                </div>
              )}
            </div>
          </div>

          {/* Admin Generic Panel */}
          {user.rol === 'ADMIN' && (
            <div className="mb-8 animate-fade-in" style={{ animationDelay: '300ms' }}>
              <div className="flex items-center gap-2 mb-6">
                <Settings className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-bold text-foreground">Panel de Administración</h2>
              </div>
              <AdminPanel />
            </div>
          )}

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
              onClick={logout}
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
