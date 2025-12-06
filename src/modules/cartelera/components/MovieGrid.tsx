"use client"

import { useState, useEffect } from "react"
import { MovieCard } from "./MovieCard"
// import { movies as mockMovies } from "@/data/mockData" // Comentado para usar datos reales
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { Clock, MapPin, Loader2, AlertCircle } from "lucide-react"
import { movieService } from "../services/movieService"
import type { Movie } from "../types/Movie"

export function MovieGrid(props: any) {
  const [activeTab, setActiveTab] = useState("cartelera")
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedMovie, setSelectedMovie] = useState("")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true)
        const data = await movieService.getMovies()
        setMovies(data)
        if (data.length > 0) {
          setSelectedMovie(data[0].id)
        }
      } catch (err) {
        console.error("Failed to fetch movies:", err)
        setError("No se pudieron cargar las películas. Por favor intenta más tarde.")
        // Fallback to mock data if needed, or just show error
        // setMovies(mockMovies) 
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [])

  const showtimes = [
    { time: "2:30 PM", available: 45, format: "2D" },
    { time: "5:15 PM", available: 12, format: "3D" },
    { time: "8:00 PM", available: 78, format: "2D" },
    { time: "10:45 PM", available: 23, format: "3D" },
  ]

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Cargando cartelera...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-destructive">
        <AlertCircle className="w-12 h-12" />
        <p className="font-medium">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full max-w-2xl mx-auto mb-8 bg-muted/50 p-1 rounded-lg">
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
            {movies.filter(m => !m.isPreSale).length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No hay películas en cartelera por el momento.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {movies
                  .filter(m => !m.isPreSale)
                  .map((movie, index) => (
                    <MovieCard key={movie.id} movie={movie} index={index} />
                  ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="estrenos" className="mt-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {movies
                .filter((m) => m.isPreSale)
                .map((movie, index) => (
                  <MovieCard key={movie.id} movie={movie} index={index} />
                ))}
            </div>
            {movies.filter(m => m.isPreSale).length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No hay estrenos próximos por el momento.
              </div>
            )}
          </TabsContent>

          <TabsContent value="horarios" className="mt-0">
            <div className="space-y-6">
              {/* Search Filters */}
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-border p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Buscar por Horarios
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
                      Selecciona una Película
                    </label>
                    <select
                      value={selectedMovie}
                      onChange={(e) => setSelectedMovie(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {movies.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Selecciona una Fecha</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Showtimes Grid */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Horarios Disponibles
                </h3>

                {/* Selected Movie Info */}
                {selectedMovie && movies.find((m) => m.id === selectedMovie) && (
                  <div className="bg-card rounded-lg border border-border p-4 mb-4">
                    <div className="flex gap-4">
                      <div className="w-24 h-32 rounded-lg bg-muted flex items-center justify-center text-3xl flex-shrink-0 overflow-hidden">
                        <img
                          src={movies.find((m) => m.id === selectedMovie)?.poster}
                          alt={movies.find((m) => m.id === selectedMovie)?.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback si la imagen falla
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).parentElement!.innerText = '🎬';
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground text-lg mb-1">
                          {movies.find((m) => m.id === selectedMovie)?.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          {movies.find((m) => m.id === selectedMovie)?.rating} •{" "}
                          {movies.find((m) => m.id === selectedMovie)?.duration} min
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {movies.find((m) => m.id === selectedMovie)?.synopsis}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Showtimes */}
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {showtimes.map((showtime, idx) => (
                    <button
                      key={idx}
                      className="relative p-4 rounded-lg border border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all group"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-xl font-bold text-primary group-hover:scale-110 transition-transform">
                          {showtime.time}
                        </span>
                        <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                          {showtime.format}
                        </span>
                        <span className="text-xs text-muted-foreground">{showtime.available} asientos</span>
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                        ✓
                      </div>
                    </button>
                  ))}
                </div>

                {/* Featured Showtimes */}
                <div className="space-y-3 mt-6">
                  <h4 className="font-semibold text-foreground text-sm">Otras Películas en el mismo horario</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {movies.slice(0, 4).map((movie, index) => (
                      <div
                        key={movie.id}
                        className="bg-card rounded-lg border border-border p-4 hover:border-primary/50 transition-colors cursor-pointer group"
                      >
                        <div className="flex gap-4">
                          <div className="w-16 h-24 rounded-lg bg-muted flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-105 transition-transform overflow-hidden">
                            <img
                              src={movie.poster}
                              alt={movie.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                                (e.target as HTMLImageElement).parentElement!.innerText = '🎬';
                              }}
                            />
                          </div>
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <h5 className="font-medium text-foreground text-sm line-clamp-2 mb-1">{movie.title}</h5>
                              <p className="text-xs text-muted-foreground">
                                {movie.rating} • {movie.duration}min
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              <span className="px-2 py-1 rounded bg-primary/20 text-primary text-xs font-medium">
                                2:30 PM
                              </span>
                              <span className="px-2 py-1 rounded bg-primary/20 text-primary text-xs font-medium">
                                5:15 PM
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
