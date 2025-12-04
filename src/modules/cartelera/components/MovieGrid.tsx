import { useState } from 'react';
import { MovieCard } from './MovieCard';
import { movies } from '@/data/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';

export function MovieGrid() {
  const [activeTab, setActiveTab] = useState('cartelera');

  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full max-w-xl mx-auto mb-8 bg-muted/50 p-1 rounded-lg">
            <TabsTrigger 
              value="cartelera" 
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Cartelera
            </TabsTrigger>
            <TabsTrigger 
              value="estrenos" 
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Próximos Estrenos
            </TabsTrigger>
            <TabsTrigger 
              value="horarios" 
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hidden sm:block"
            >
              Por Horarios
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cartelera" className="mt-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {movies.map((movie, index) => (
                <MovieCard key={movie.id} movie={movie} index={index} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="estrenos" className="mt-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {movies.filter(m => m.isPreSale).map((movie, index) => (
                <MovieCard key={movie.id} movie={movie} index={index} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="horarios" className="mt-0">
            <div className="text-center py-12 text-muted-foreground">
              <p>Búsqueda por horarios próximamente</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
