import { useState } from 'react';
import { ArrowLeft, Minus, Plus, ShoppingBag, Tag } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Switch } from '@/shared/components/ui/switch';
import { Input } from '@/shared/components/ui/input';
import { useBooking, type Snack } from '@/modules/booking/context/BookingContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const SNACKS_DATA: Snack[] = [
    {
        id: 'combo-1',
        name: 'Combo Pareja',
        description: '2 Canguiles Medianos + 2 Bebidas Medianas',
        price: 15.50,
        image: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?q=80&w=300&auto=format&fit=crop'
    },
    {
        id: 'combo-2',
        name: 'Combo Personal',
        description: '1 Canguil Pequeño + 1 Bebida Pequeña + 1 Chocolate',
        price: 8.90,
        image: 'https://images.unsplash.com/photo-1585647347384-2593bc35786b?q=80&w=300&auto=format&fit=crop'
    },
    {
        id: 'snack-1',
        name: 'Hot Dog Deluxe',
        description: 'Con salsa de queso, tocino y papas hilo',
        price: 5.50,
        image: 'https://images.unsplash.com/photo-1612392062631-94dd85fa2dd0?q=80&w=300&auto=format&fit=crop'
    },
    {
        id: 'snack-2',
        name: 'Nachos con Queso',
        description: 'Totopos crujientes con salsa de queso cheddar y jalapeños',
        price: 6.25,
        image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?q=80&w=300&auto=format&fit=crop'
    },
    {
        id: 'drink-1',
        name: 'Gaseosa Grande',
        description: 'Vaso de 32oz (Coca-Cola, Sprite, Fanta)',
        price: 4.00,
        image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=300&auto=format&fit=crop'
    },
    {
        id: 'sweet-1',
        name: 'M&Ms',
        description: 'Paquete grande de chocolate confitado',
        price: 3.50,
        image: 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?q=80&w=300&auto=format&fit=crop'
    }
];

export function SnacksUpsell() {
    const { addSnack, updateSnackQuantity, selectedSnacks, setStep, getTotal } = useBooking();
    const [hasDiscount, setHasDiscount] = useState(false);
    const [discountCode, setDiscountCode] = useState('');

    const handleApplyDiscount = () => {
        if (discountCode.length < 5) return;
        toast.success("Código aplicado correctamente (Simulado)");
    };

    const getQuantity = (id: string) => {
        return selectedSnacks.find(s => s.id === id)?.quantity || 0;
    };

    const handleAdd = (snack: Snack) => {
        const current = getQuantity(snack.id);
        if (current === 0) {
            addSnack(snack);
        } else {
            updateSnackQuantity(snack.id, current + 1);
        }
    };

    const handleRemove = (id: string) => {
        const current = getQuantity(id);
        if (current > 0) {
            updateSnackQuantity(id, current - 1);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-4 pb-32 lg:pb-12">
            <div className="container mx-auto max-w-6xl">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="ghost" onClick={() => setStep('seats')} className="text-white hover:bg-white/10">
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        ¿Se te antoja algo?
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">

                    {/* Snacks Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {SNACKS_DATA.map(snack => {
                            const qty = getQuantity(snack.id);
                            return (
                                <div key={snack.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-[#F5B041]/50 transition-all group flex flex-col">
                                    <div className="aspect-video relative overflow-hidden">
                                        <img src={snack.image} alt={snack.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                        <div className="absolute bottom-3 left-3 right-3">
                                            <h3 className="font-bold text-lg">{snack.name}</h3>
                                            <p className="text-xs text-gray-300 line-clamp-1">{snack.description}</p>
                                        </div>
                                    </div>
                                    <div className="p-4 flex items-center justify-between mt-auto bg-card/10">
                                        <span className="text-[#F5B041] font-bold text-xl">${snack.price.toFixed(2)}</span>

                                        {qty === 0 ? (
                                            <Button
                                                size="sm"
                                                className="bg-white/10 hover:bg-[#F5B041] hover:text-black text-white rounded-full px-6"
                                                onClick={() => handleAdd(snack)}
                                            >
                                                Agregar
                                            </Button>
                                        ) : (
                                            <div className="flex items-center gap-3 bg-white/10 rounded-full px-1 py-1">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-7 w-7 rounded-full hover:bg-white/20"
                                                    onClick={() => handleRemove(snack.id)}
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </Button>
                                                <span className="font-bold w-4 text-center">{qty}</span>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-7 w-7 rounded-full hover:bg-white/20"
                                                    onClick={() => handleAdd(snack)}
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Sidebar Summary */}
                    <div className="space-y-6">
                        {/* Discount Code */}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Tag className="w-5 h-5 text-[#F5B041]" />
                                    <span className="font-medium">¿Tienes un código?</span>
                                </div>
                                <Switch
                                    checked={hasDiscount}
                                    onCheckedChange={setHasDiscount}
                                    className="data-[state=checked]:bg-[#F5B041]"
                                />
                            </div>

                            <div className={cn(
                                "grid transition-all duration-300 ease-in-out",
                                hasDiscount ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"
                            )}>
                                <div className="overflow-hidden space-y-2">
                                    <Input
                                        placeholder="INGRESA TU CÓDIGO"
                                        className="bg-black/50 border-white/20 text-center tracking-widest uppercase h-12 text-lg font-mono placeholder:text-gray-600 focus-visible:ring-[#F5B041]"
                                        maxLength={16}
                                        value={discountCode}
                                        onChange={(e) => setDiscountCode(e.target.value)}
                                    />
                                    <Button variant="outline" className="w-full border-white/10 hover:bg-white/5" onClick={handleApplyDiscount}>
                                        Aplicar Canje
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Total & Actions */}
                        <div className="bg-[#1A1A1A] border border-[#F5B041]/30 rounded-xl p-6 shadow-2xl shadow-black/50 sticky top-8">
                            <div className="flex items-center gap-3 mb-6 text-gray-400">
                                <ShoppingBag className="w-5 h-5" />
                                <span className="uppercase text-xs tracking-wider">Resumen Actual</span>
                            </div>

                            <div className="space-y-2 mb-6 text-sm">
                                {selectedSnacks.map(item => (
                                    <div key={item.id} className="flex justify-between items-center text-gray-300">
                                        <span>{item.quantity} x {item.name}</span>
                                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                                {selectedSnacks.length === 0 && <p className="text-gray-500 italic">No has agregado snacks</p>}
                            </div>

                            <div className="border-t border-white/10 pt-4 mb-6 flex justify-between items-end">
                                <span className="text-gray-400">Total Estimado</span>
                                <span className="text-3xl font-bold text-[#F5B041]">${getTotal().toFixed(2)}</span>
                            </div>

                            <div className="space-y-3">
                                <Button
                                    className="w-full h-14 text-lg font-bold bg-[#F5B041] hover:bg-[#E59830] text-black shadow-lg shadow-[#F5B041]/20"
                                    onClick={() => setStep('payment')}
                                >
                                    Continuar al Pago
                                </Button>

                                <Button
                                    variant="ghost"
                                    className="w-full text-white/50 hover:text-white hover:bg-white/5 transition-colors"
                                    onClick={() => setStep('payment')}
                                >
                                    Omitir snacks y pagar
                                </Button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
