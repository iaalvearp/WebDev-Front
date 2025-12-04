import type { Movie } from '@/modules/cartelera/types/Movie';
export type { Movie };


export interface Showtime {
  id: string;
  time: string;
  format: string;
  room: string;
  roomType: string;
  available: boolean;
}

export interface TicketType {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export interface Cinema {
  id: string;
  name: string;
  city: string;
  address: string;
}

export interface HeroSlide {
  id: string;
  image: string;
  movieId: string;
  title: string;
  subtitle: string;
}

export const cities = [
  { id: "quito", name: "Quito" },
  { id: "guayaquil", name: "Guayaquil" },
  { id: "cuenca", name: "Cuenca" },
  { id: "ambato", name: "Ambato" },
];

export const cinemas: Cinema[] = [
  { id: "scala", name: "Scala Shopping", city: "quito", address: "Av. Interoceánica S/N" },
  { id: "mall-el-jardin", name: "Mall El Jardín", city: "quito", address: "Av. Amazonas N17-35" },
  { id: "san-marino", name: "San Marino", city: "guayaquil", address: "Av. Domingo Comín" },
  { id: "mall-del-sol", name: "Mall del Sol", city: "guayaquil", address: "Av. Joaquín Orrantia" },
];

export const heroSlides: HeroSlide[] = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&q=80",
    movieId: "avatar-3",
    title: "AVATAR: FUEGO Y CENIZA",
    subtitle: "Una nueva aventura épica te espera",
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1920&q=80",
    movieId: "gladiador-2",
    title: "GLADIADOR II",
    subtitle: "La leyenda continúa",
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=1920&q=80",
    movieId: "wicked",
    title: "WICKED",
    subtitle: "Descubre la historia no contada",
  },
];

export const movies: Movie[] = [
  {
    id: "avatar-3",
    title: "Avatar: Fuego y Ceniza",
    originalTitle: "Avatar: Fire and Ash",
    poster: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&q=80",
    backdrop: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&q=80",
    duration: "3h 35min",
    rating: "-12 bajo supervisión",
    genre: ["Aventura", "Ciencia Ficción", "Acción"],
    synopsis: "Tras una pérdida devastadora, la familia de Jake y Neytiri se enfrenta a una tribu Na'vi hostil, los Ash, liderados por el implacable Varang, mientras los conflictos en Pandora se intensifican y surgen nuevos dilemas morales.",
    director: "James Cameron",
    cast: ["Sam Worthington", "Zoe Saldaña", "Sigourney Weaver", "Kate Winslet"],
    releaseDate: "2024-12-17",
    language: "Español / Subtitulado",
    format: ["4D", "3D", "2D", "IMAX"],
    isPreSale: true,
  },
  {
    id: "gladiador-2",
    title: "Gladiador II",
    originalTitle: "Gladiator II",
    poster: "https://images.unsplash.com/photo-1608346128025-1896b97a6fa7?w=400&q=80",
    backdrop: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1920&q=80",
    duration: "2h 28min",
    rating: "+16",
    genre: ["Acción", "Drama", "Histórico"],
    synopsis: "Años después de presenciar la muerte del héroe Maximus a manos de su tío, Lucius se ve forzado a entrar en el Coliseo después de que su hogar es conquistado por los tiranos emperadores.",
    director: "Ridley Scott",
    cast: ["Paul Mescal", "Pedro Pascal", "Denzel Washington", "Connie Nielsen"],
    releaseDate: "2024-11-22",
    language: "Español",
    format: ["2D", "IMAX"],
  },
  {
    id: "wicked",
    title: "Wicked",
    poster: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&q=80",
    backdrop: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=1920&q=80",
    duration: "2h 40min",
    rating: "Todo público",
    genre: ["Musical", "Fantasía", "Drama"],
    synopsis: "La historia no contada de las brujas de Oz, centrada en la improbable amistad entre Elphaba, la Bruja Mala del Oeste, y Glinda, la Bruja Buena.",
    director: "Jon M. Chu",
    cast: ["Cynthia Erivo", "Ariana Grande", "Jonathan Bailey", "Michelle Yeoh"],
    releaseDate: "2024-11-27",
    language: "Subtitulado",
    format: ["2D", "IMAX"],
  },
  {
    id: "moana-2",
    title: "Moana 2",
    poster: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400&q=80",
    backdrop: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=1920&q=80",
    duration: "1h 40min",
    rating: "Todo público",
    genre: ["Animación", "Aventura", "Familiar"],
    synopsis: "Moana zarpa en una nueva aventura épica para encontrar las aguas perdidas de Motunui.",
    director: "David Derrick Jr.",
    cast: ["Auli'i Cravalho", "Dwayne Johnson"],
    releaseDate: "2024-11-29",
    language: "Español",
    format: ["2D", "3D"],
  },
  {
    id: "kraven",
    title: "Kraven el Cazador",
    originalTitle: "Kraven the Hunter",
    poster: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&q=80",
    backdrop: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=1920&q=80",
    duration: "2h 10min",
    rating: "+16",
    genre: ["Acción", "Thriller"],
    synopsis: "La brutal historia de origen de uno de los villanos más icónicos de Marvel: Kraven el Cazador.",
    director: "J.C. Chandor",
    cast: ["Aaron Taylor-Johnson", "Russell Crowe", "Ariana DeBose"],
    releaseDate: "2024-12-13",
    language: "Subtitulado",
    format: ["2D", "IMAX"],
  },
  {
    id: "sonic-3",
    title: "Sonic 3: La Película",
    originalTitle: "Sonic the Hedgehog 3",
    poster: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&q=80",
    backdrop: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=1920&q=80",
    duration: "1h 50min",
    rating: "Todo público",
    genre: ["Animación", "Acción", "Comedia"],
    synopsis: "Sonic, Knuckles y Tails se enfrentan a un nuevo y poderoso adversario, Shadow, un misterioso villano con poderes como nunca antes han visto.",
    director: "Jeff Fowler",
    cast: ["Ben Schwartz", "Jim Carrey", "Idris Elba", "Keanu Reeves"],
    releaseDate: "2024-12-20",
    language: "Español",
    format: ["2D", "3D"],
  },
];

export const showtimes: Record<string, Showtime[]> = {
  "avatar-3": [
    { id: "1", time: "14:30", format: "4D-Sub", room: "Sala 4D", roomType: "4D", available: true },
    { id: "2", time: "18:00", format: "4D-Sub", room: "Sala 4D", roomType: "4D", available: true },
    { id: "3", time: "19:00", format: "2D-Esp", room: "Sala Normal", roomType: "Normal", available: true },
    { id: "4", time: "21:00", format: "2D-Sub", room: "Sala VIP", roomType: "VIP", available: true },
    { id: "5", time: "22:30", format: "IMAX", room: "Sala IMAX", roomType: "IMAX", available: false },
  ],
  "gladiador-2": [
    { id: "1", time: "15:00", format: "2D-Esp", room: "Sala 1", roomType: "Normal", available: true },
    { id: "2", time: "18:30", format: "2D-Sub", room: "Sala 2", roomType: "Normal", available: true },
    { id: "3", time: "21:00", format: "IMAX", room: "Sala IMAX", roomType: "IMAX", available: true },
  ],
  "wicked": [
    { id: "1", time: "16:00", format: "2D-Sub", room: "Sala 3", roomType: "Normal", available: true },
    { id: "2", time: "19:30", format: "2D-Esp", room: "Sala 4", roomType: "Normal", available: true },
    { id: "3", time: "22:00", format: "IMAX", room: "Sala IMAX", roomType: "IMAX", available: true },
  ],
  "moana-2": [
    { id: "1", time: "11:00", format: "2D-Esp", room: "Sala 1", roomType: "Normal", available: true },
    { id: "2", time: "14:00", format: "3D-Esp", room: "Sala 3D", roomType: "3D", available: true },
    { id: "3", time: "16:30", format: "2D-Esp", room: "Sala 2", roomType: "Normal", available: true },
    { id: "4", time: "19:00", format: "3D-Esp", room: "Sala 3D", roomType: "3D", available: false },
  ],
  "kraven": [
    { id: "1", time: "15:30", format: "2D-Sub", room: "Sala 1", roomType: "Normal", available: true },
    { id: "2", time: "18:00", format: "2D-Esp", room: "Sala 2", roomType: "Normal", available: true },
    { id: "3", time: "20:30", format: "IMAX", room: "Sala IMAX", roomType: "IMAX", available: true },
    { id: "4", time: "23:00", format: "2D-Sub", room: "Sala VIP", roomType: "VIP", available: true },
  ],
  "sonic-3": [
    { id: "1", time: "12:00", format: "2D-Esp", room: "Sala 1", roomType: "Normal", available: true },
    { id: "2", time: "14:30", format: "3D-Esp", room: "Sala 3D", roomType: "3D", available: true },
    { id: "3", time: "17:00", format: "2D-Esp", room: "Sala 2", roomType: "Normal", available: true },
    { id: "4", time: "19:30", format: "3D-Esp", room: "Sala 3D", roomType: "3D", available: true },
    { id: "5", time: "22:00", format: "2D-Sub", room: "Sala VIP", roomType: "VIP", available: false },
  ],
};

export const snacks = [
  { id: "combo1", name: "Combo Clásico", description: "Popcorn grande + 2 bebidas medianas", price: 12.50, image: "🍿", category: "combos" },
  { id: "combo2", name: "Combo Familiar", description: "2 Popcorn grandes + 4 bebidas grandes", price: 22.00, image: "🍿", category: "combos" },
  { id: "combo3", name: "Combo Premium", description: "Popcorn jumbo + 2 bebidas grandes + nachos", price: 18.50, image: "🍿", category: "combos" },
  { id: "combo4", name: "Combo Duo", description: "2 Popcorn medianos + 2 bebidas medianas", price: 15.00, image: "🍿", category: "combos" },
  { id: "popcorn-s", name: "Popcorn Pequeño", description: "Palomitas de maíz recién hechas", price: 4.50, image: "🍿", category: "popcorn" },
  { id: "popcorn-m", name: "Popcorn Mediano", description: "Palomitas de maíz recién hechas", price: 6.00, image: "🍿", category: "popcorn" },
  { id: "popcorn-l", name: "Popcorn Grande", description: "Palomitas de maíz recién hechas", price: 7.50, image: "🍿", category: "popcorn" },
  { id: "popcorn-xl", name: "Popcorn Jumbo", description: "Palomitas de maíz recién hechas - Tamaño familiar", price: 9.00, image: "🍿", category: "popcorn" },
  { id: "nachos", name: "Nachos con Queso", description: "Nachos crujientes con queso cheddar caliente", price: 6.50, image: "🧀", category: "snacks" },
  { id: "hotdog", name: "Hot Dog", description: "Hot dog clásico con salchicha premium", price: 4.50, image: "🌭", category: "snacks" },
  { id: "pizza", name: "Pizza Personal", description: "Pizza de pepperoni recién horneada", price: 5.50, image: "🍕", category: "snacks" },
  { id: "nuggets", name: "Nuggets de Pollo", description: "6 nuggets crujientes con salsa", price: 5.00, image: "🍗", category: "snacks" },
  { id: "soda-m", name: "Bebida Mediana", description: "Gaseosa de tu elección", price: 3.50, image: "🥤", category: "bebidas" },
  { id: "soda-l", name: "Bebida Grande", description: "Gaseosa de tu elección", price: 4.50, image: "🥤", category: "bebidas" },
  { id: "water", name: "Agua Mineral", description: "Agua natural embotellada 500ml", price: 2.50, image: "💧", category: "bebidas" },
  { id: "icee", name: "ICEE", description: "Bebida congelada sabor cereza o uva", price: 5.00, image: "🧊", category: "bebidas" },
  { id: "candy1", name: "M&M's", description: "Chocolates M&M's clásicos", price: 3.50, image: "🍬", category: "dulces" },
  { id: "candy2", name: "Skittles", description: "Caramelos frutales", price: 3.00, image: "🍬", category: "dulces" },
  { id: "candy3", name: "Gomitas", description: "Gomitas surtidas", price: 3.00, image: "🍬", category: "dulces" },
  { id: "chocolate", name: "Barra de Chocolate", description: "Chocolate con leche premium", price: 3.50, image: "🍫", category: "dulces" },
];

export const ticketTypes: TicketType[] = [
  { id: "general", name: "General", price: 8.50 },
  { id: "4d-general", name: "4D General", price: 15.20 },
  { id: "4d-senior", name: "4D Tercera Edad", price: 7.60, description: "Se solicitará cédula de identidad" },
  { id: "vip", name: "VIP", price: 12.00 },
  { id: "imax", name: "IMAX", price: 14.00 },
  { id: "child", name: "Niño (hasta 11 años)", price: 6.50 },
  { id: "senior", name: "Tercera Edad", price: 5.00, description: "Se solicitará cédula de identidad" },
];

export const menuItems = [
  { id: "cartelera", label: "Cartelera", icon: "Film" },
  { id: "dulceria", label: "Dulcería", icon: "Candy" },
  { id: "beneficios", label: "Beneficios", icon: "Gift" },
  { id: "promociones", label: "Promociones", icon: "Percent" },
  { id: "perfil", label: "Perfil", icon: "User" },
];

export const generateSeats = () => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const seatsPerRow = 10;
  const seats: { id: string; row: string; number: number; status: 'available' | 'taken' | 'selected' }[] = [];

  rows.forEach(row => {
    for (let i = 1; i <= seatsPerRow; i++) {
      const isTaken = Math.random() < 0.3;
      seats.push({
        id: `${row}${i}`,
        row,
        number: i,
        status: isTaken ? 'taken' : 'available',
      });
    }
  });

  return seats;
};

