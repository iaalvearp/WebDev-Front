import { useState } from 'react';
import { useBooking } from '@/modules/booking/context/BookingContext';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { toast } from 'sonner';
import { userService } from '../services/userService';
import type { User } from '../types/User';

export const RegisterForm = () => {
    const { setStep } = useBooking();
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
        telefono: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const newUser: User = {
                nombre: formData.nombre,
                email: formData.email,
                password: formData.password,
                rol: 'USER',
                telefono: formData.telefono
            };

            await userService.create(newUser);
            toast.success('Cuenta creada exitosamente. Por favor inicia sesión.');
            setStep('login');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Error al crear la cuenta');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[60vh] p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Crear Cuenta</CardTitle>
                    <CardDescription>Ingresa tus datos para registrarte en CinePlus</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="nombre">Nombre Completo</Label>
                            <Input
                                id="nombre"
                                type="text"
                                placeholder="Juan Perez"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Correo Electrónico</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="tu@email.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="telefono">Teléfono / Celular</Label>
                            <Input
                                id="telefono"
                                type="tel"
                                placeholder="+593 99 999 9999"
                                value={formData.telefono}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <Input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button
                            type="submit"
                            className="w-full text-black font-bold hover:opacity-90 border-none"
                            style={{ background: 'linear-gradient(to right, hsl(var(--cinema-gold)), hsl(var(--cinema-gold-light)))' }}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creando cuenta...' : 'Registrarse'}
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            className="w-full"
                            onClick={() => setStep('login')}
                        >
                            Volver al inicio de sesión
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};
