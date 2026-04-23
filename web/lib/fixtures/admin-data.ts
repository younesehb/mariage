import type { InquiryStatus } from "@/lib/types";

export interface AdminInquiry {
  id: string;
  venueSlug: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  inquiryType: "single_day" | "two_day";
  datePrimary: string;
  dateSecondary?: string;
  guestsPrimary: number;
  guestsSecondary?: number;
  dayLabeling: "neutral" | "men_women";
  message: string;
  status: InquiryStatus;
  createdAt: string;
  venueResponse?: string;
}

export const adminInquiries: AdminInquiry[] = [
  {
    id: "i-001",
    venueSlug: "salle-al-andalous",
    userName: "Hajar Bennani",
    userEmail: "hajar.b@exemple.be",
    userPhone: "+32 470 12 34 56",
    inquiryType: "two_day",
    datePrimary: "2026-06-13",
    dateSecondary: "2026-06-14",
    guestsPrimary: 250,
    guestsSecondary: 450,
    dayLabeling: "men_women",
    message: "Bonjour, nous cherchons la salle pour notre mariage, hommes samedi et femmes dimanche. Traiteur Beldi prévu.",
    status: "pending",
    createdAt: "2026-04-22T14:10:00Z",
  },
  {
    id: "i-002",
    venueSlug: "laeken-palace",
    userName: "Anissa Mourad",
    userEmail: "anissa.m@exemple.be",
    userPhone: "+32 471 22 33 44",
    inquiryType: "single_day",
    datePrimary: "2026-07-25",
    guestsPrimary: 520,
    dayLabeling: "neutral",
    message: "",
    status: "pending",
    createdAt: "2026-04-22T09:55:00Z",
  },
  {
    id: "i-003",
    venueSlug: "zellige-hall",
    userName: "Rania El Khatib",
    userEmail: "rania.ek@exemple.be",
    userPhone: "+32 472 88 77 66",
    inquiryType: "single_day",
    datePrimary: "2026-05-30",
    guestsPrimary: 700,
    dayLabeling: "neutral",
    message: "Henné, ziana et photographe déjà réservés. Besoin juste de la salle.",
    status: "declined",
    venueResponse: "Malheureusement cette date est déjà réservée, nous vous proposons le 6 juin.",
    createdAt: "2026-04-10T12:00:00Z",
  },
  {
    id: "i-004",
    venueSlug: "domaine-brabant",
    userName: "Mehdi Rachidi",
    userEmail: "mehdi.r@exemple.be",
    userPhone: "+32 473 11 22 33",
    inquiryType: "two_day",
    datePrimary: "2026-08-08",
    dateSecondary: "2026-08-15",
    guestsPrimary: 400,
    guestsSecondary: 600,
    dayLabeling: "men_women",
    message: "Deux jours distincts à une semaine d'intervalle.",
    status: "accepted",
    venueResponse: "Les deux dates sont disponibles, vous recevez le devis ce soir.",
    createdAt: "2026-04-12T10:00:00Z",
  },
  {
    id: "i-005",
    venueSlug: "etterbeek-garden-hall",
    userName: "Leila Karouach",
    userEmail: "leila.k@exemple.be",
    userPhone: "+32 475 44 55 66",
    inquiryType: "single_day",
    datePrimary: "2026-09-19",
    guestsPrimary: 300,
    dayLabeling: "neutral",
    message: "",
    status: "pending",
    createdAt: "2026-04-21T16:30:00Z",
  },
];

export interface FlaggedReview {
  id: string;
  subjectType: "venue" | "vendor";
  subjectId: string;
  subjectName: string;
  userDisplayName: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  visitMonth: string;
  flagCount: number;
  flagReasons: string[];
  status: "published" | "hidden";
  createdAt: string;
}

export const flaggedReviews: FlaggedReview[] = [
  {
    id: "fr-1",
    subjectType: "venue",
    subjectId: "v-jette-pavilion",
    subjectName: "Jette Pavilion",
    userDisplayName: "Anonyme 3842",
    rating: 1,
    text: "Salle horrible, personnel désagréable. Je déconseille à tout le monde d'aller là-bas, c'est une arnaque totale !!!!",
    visitMonth: "2025-11",
    flagCount: 4,
    flagReasons: ["Propos excessifs", "Pas de preuve de visite", "Insulte"],
    status: "hidden",
    createdAt: "2026-04-01T10:00:00Z",
  },
  {
    id: "fr-2",
    subjectType: "vendor",
    subjectId: "t-fes-fusion",
    subjectName: "Fès Fusion",
    userDisplayName: "Omar S.",
    rating: 2,
    text: "Service pas terrible. Plats à l'arrache et personnel qui répondait de travers. Prix trop élevé pour ce que c'est.",
    visitMonth: "2025-10",
    flagCount: 3,
    flagReasons: ["Contesté par le prestataire", "Ton agressif"],
    status: "hidden",
    createdAt: "2026-04-05T14:00:00Z",
  },
  {
    id: "fr-3",
    subjectType: "venue",
    subjectId: "v-anderlecht-garden",
    subjectName: "Anderlecht Garden",
    userDisplayName: "Sami B.",
    rating: 5,
    text: "Check my IG @sami_events pour plus de photos de ma prestation photo pour ce mariage!!! DM moi pour devis. On fait aussi vidéo drone.",
    visitMonth: "2025-08",
    flagCount: 3,
    flagReasons: ["Publicité déguisée", "Spam"],
    status: "hidden",
    createdAt: "2026-04-08T11:00:00Z",
  },
];
