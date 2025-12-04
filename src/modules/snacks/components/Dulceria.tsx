"use client"

import { useState } from "react"
import { ArrowLeft, Minus, Plus, ShoppingBag } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { snacks } from "@/data/mockData"
import { useBooking } from "@/modules/booking/context/BookingContext"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

export function Dulceria() {
  const { setStep } = useBooking()
  const [cart, setCart] = useState<CartItem[]>([])
  const [activeTab, setActiveTab] = useState("combos")

  const categories = [
    { id: "combos", label: "Combos" },
    { id: "popcorn", label: "Popcorn" },
    { id: "snacks", label: "Snacks" },
    { id: "bebidas", label: "Bebidas" },
    { id: "dulces", label: "Dulces" },
  ]

  const handleGoBack = () => {
    window.location.href = "/cartelera"
  }

  const addToCart = (item: (typeof snacks)[0]) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id)
      if (existing) {
        return prev.map((c) => (c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c))
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, quantity: 1, image: item.image }]
    })
  }

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === itemId)
      if (existing && existing.quantity > 1) {
        return prev.map((c) => (c.id === itemId ? { ...c, quantity: c.quantity - 1 } : c))
      }
      return prev.filter((c) => c.id !== itemId)
    })
  }

  const getItemQuantity = (itemId: string) => {
    return cart.find((c) => c.id === itemId)?.quantity || 0
  }

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0)
  }

  const filteredSnacks = snacks.filter((s) => s.category === activeTab)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground gap-2"
              onClick={handleGoBack}
            >
              <ArrowLeft className="w-5 h-5" />
              Regresar
            </Button>
            <h1 className="text-xl font-bold text-gradient">Dulcería</h1>
            <div className="w-24" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[1fr,350px] gap-8">
          {/* Products */}
          <div>
            {/* Hero Banner */}
            <div className="relative rounded-2xl overflow-hidden mb-8 bg-gradient-to-r from-primary/20 to-cinema-gold-light/20 p-8">
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">¡Completa tu experiencia! 🍿</h2>
                <p className="text-muted-foreground text-lg">Los mejores combos y snacks para disfrutar tu película</p>
              </div>
              <div className="absolute right-4 bottom-4 text-8xl opacity-20">🍿🥤🍫</div>
            </div>

            {/* Categories */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full justify-start mb-6 bg-muted/50 p-1 rounded-lg overflow-x-auto flex-nowrap">
                {categories.map((cat) => (
                  <TabsTrigger
                    key={cat.id}
                    value={cat.id}
                    className="flex-shrink-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    {cat.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {categories.map((cat) => (
                <TabsContent key={cat.id} value={cat.id} className="mt-0">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {filteredSnacks.map((item, index) => {
                      const quantity = getItemQuantity(item.id)
                      return (
                        <div
                          key={item.id}
                          className="bg-card rounded-xl border border-border p-4 flex gap-4 animate-fade-in hover:border-primary/50 transition-colors"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center text-4xl flex-shrink-0">
                            {item.image}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground">{item.name}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-primary font-bold text-lg">${item.price.toFixed(2)}</span>
                              {quantity > 0 ? (
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 rounded-full border-primary text-primary bg-transparent"
                                    onClick={() => removeFromCart(item.id)}
                                  >
                                    <Minus className="w-4 h-4" />
                                  </Button>
                                  <span className="w-6 text-center font-medium text-foreground">{quantity}</span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 rounded-full border-primary text-primary bg-transparent"
                                    onClick={() => addToCart(item)}
                                  >
                                    <Plus className="w-4 h-4" />
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  size="sm"
                                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                                  onClick={() => addToCart(item)}
                                >
                                  Agregar
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Cart Sidebar - Desktop */}
          <div className="hidden lg:block">
            <div className="sticky top-24 bg-card rounded-xl border border-border overflow-hidden">
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Tu Pedido</h3>
                  {getTotalItems() > 0 && (
                    <Badge className="bg-primary text-primary-foreground ml-auto">{getTotalItems()}</Badge>
                  )}
                </div>
              </div>

              <div className="p-4 max-h-[400px] overflow-y-auto">
                {cart.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-4xl mb-2">🛒</p>
                    <p>Tu carrito está vacío</p>
                    <p className="text-sm">Agrega productos para continuar</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <span className="text-2xl">{item.image}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground text-sm truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            ${item.price.toFixed(2)} x {item.quantity}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-foreground"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-foreground"
                            onClick={() => addToCart({ ...item, description: "", category: "" } as any)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <span className="text-sm font-semibold text-foreground">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-4 border-t border-border">
                  <div className="flex justify-between mb-4">
                    <span className="text-muted-foreground">Total</span>
                    <span className="text-xl font-bold text-primary">${getTotal().toFixed(2)}</span>
                  </div>
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    Confirmar Pedido
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Cart Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-card border-t border-border p-4 z-30">
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 justify-between py-6">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              <span>Ver carrito ({getTotalItems()})</span>
            </div>
            <span className="font-bold">${getTotal().toFixed(2)}</span>
          </Button>
        </div>
      )}
    </div>
  )
}
