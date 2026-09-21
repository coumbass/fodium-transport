import concert from "@/assets/fodium-concert.jpg";
import theatre from "@/assets/fodium-theatre.jpg";
import stadium from "@/assets/fodium-stadium.jpg";

export type Departure = { name: string; price: number };

export type FodiumEvent = {
  slug: string;
  name: string;
  category: string;
  shortDate: string;
  fullDate: string;
  doors: string;
  place: string;
  city: string;
  price: number;
  image: string;
  tagline: string;
  description: string;
  confirmation: string;
  ticketId: string;
  departures: Departure[];
};

export const events: FodiumEvent[] = [
  {
    slug: "nuit-electrique",
    name: "Nuit Électrique",
    category: "Concert",
    shortDate: "12 oct. · Dakar",
    fullDate: "12 octobre 2026 · 21:00",
    doors: "Ouverture à 19:30",
    place: "Esplanade du Musée",
    city: "Dakar",
    price: 25000,
    image: concert,
    tagline: "Un billet, une navette, une nuit.",
    description: "Une nuit de lives, de basses et de lumière avec la nouvelle scène sénégalaise. Votre retour peut déjà être réservé avec votre place.",
    confirmation: "Votre nuit commence maintenant.",
    ticketId: "FDM-1210-NE",
    departures: [
      { name: "Plateau · Place de l’Indépendance", price: 5000 },
      { name: "Parcelles · Terminus 28", price: 3500 },
      { name: "Rufisque · Gare routière", price: 4500 },
    ],
  },
  {
    slug: "festival-des-arts",
    name: "Festival des Arts",
    category: "Spectacle",
    shortDate: "28 oct. · Thiès",
    fullDate: "28 octobre 2026 · 19:00",
    doors: "Ouverture à 18:00",
    place: "Théâtre National",
    city: "Thiès",
    price: 15000,
    image: theatre,
    tagline: "Le théâtre, sans souci de retour.",
    description: "Trois soirées de théâtre, de danse et de poésie sur la scène de Thiès. La navette interurbaine vous ramène après la dernière scène.",
    confirmation: "Votre place est au premier rang.",
    ticketId: "FDM-2810-FA",
    departures: [
      { name: "Dakar · Gare de Pikine", price: 6500 },
      { name: "Mbour · Rond-point Saly", price: 5500 },
      { name: "Thiès · Centre-ville", price: 2000 },
    ],
  },
  {
    slug: "dakar-derby",
    name: "Dakar Derby",
    category: "Sport",
    shortDate: "05 nov. · Diamniadio",
    fullDate: "5 novembre 2026 · 17:00",
    doors: "Ouverture à 15:00",
    place: "Stade Abdoulaye Wade",
    city: "Diamniadio",
    price: 10000,
    image: stadium,
    tagline: "Au stade, puis à la maison.",
    description: "Le derby de la saison dans un stade plein. La navette part 30 minutes après le coup de sifflet final, place garantie.",
    confirmation: "Rendez-vous dans les tribunes.",
    ticketId: "FDM-0511-DD",
    departures: [
      { name: "Dakar · Place du Souvenir", price: 4000 },
      { name: "Rufisque · Gare routière", price: 3000 },
      { name: "Thiès · Centre-ville", price: 5000 },
    ],
  },
];

export const getEvent = (slug: string) => events.find((event) => event.slug === slug);

const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export const searchEvents = (query: string) => {
  const q = normalize(query.trim());
  if (!q) return events;
  return events.filter((event) =>
    normalize([event.name, event.category, event.city, event.place, event.shortDate, ...event.departures.map((d) => d.name)].join(" ")).includes(q),
  );
};
