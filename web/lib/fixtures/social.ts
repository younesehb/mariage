import type { SocialLinks, SocialPost } from "@/lib/types";

/**
 * Social handles per subject id. In production these come from the DB, populated
 * by listing owners during claim flow or via settings.
 */
export const SOCIALS: Record<string, SocialLinks> = {
  // Venues
  "v-salle-andalous": {
    instagram: "al.andalous.brussels",
    facebook: "AlAndalousBrussels",
    website: "https://al-andalous.be",
  },
  "v-laeken-palace": {
    instagram: "laeken.palace",
    tiktok: "laeken.palace",
    website: "https://laekenpalace.be",
  },
  "v-zellige-hall": {
    instagram: "zellige.hall",
    facebook: "ZelligeHall",
  },
  "v-domaine-brabant": {
    instagram: "domaine.du.brabant",
    website: "https://domaine-brabant.be",
  },
  "v-koekelberg-event": {
    instagram: "koekelberg.events",
  },
  "v-etterbeek-garden-hall": {
    instagram: "etterbeek.garden",
    facebook: "EtterbeekGardenHall",
  },
  "v-zaventem-lounge": {
    instagram: "zaventem.lounge",
    tiktok: "zaventem.lounge",
  },

  // Vendors
  "t-beldi-traiteur": {
    instagram: "beldi.traiteur",
    tiktok: "beldi.traiteur",
    website: "https://beldi-traiteur.be",
  },
  "t-chorba-royal": {
    instagram: "chorba.royal.be",
    facebook: "ChorbaRoyal",
  },
  "z-mille-et-une": {
    instagram: "milleetune.ziana",
    tiktok: "milleetune.ziana",
  },
  "ty-lalla-salma": {
    instagram: "lallasalma.tayyaba",
  },
  "h-hennaya-royale": {
    instagram: "hennaya.royale",
    tiktok: "hennaya.royale",
  },
  "n-firqa-al-noor": {
    instagram: "firqa.alnoor",
    facebook: "FirqaAlNoor",
  },
  "p-studio-medina": {
    instagram: "studio.medina.be",
    tiktok: "studiomedina",
    website: "https://studiomedina.be",
  },
  "g-negafa-royale": {
    instagram: "negafa.royale",
    tiktok: "negafa.royale",
  },
  "vi-minbar-films": {
    instagram: "minbar.films",
    tiktok: "minbarfilms",
    website: "https://minbar.films",
  },
};

/**
 * Recent Instagram posts per subject id. Placeholder for the real oEmbed /
 * Graph API integration — each post keeps a `permalink` that works when handles
 * are real.
 */
const fb = (n: number) => `photo-fallback${n === 1 ? "" : "-" + n}`;

export const RECENT_POSTS: Record<string, SocialPost[]> = {
  "v-salle-andalous": [
    { id: "p1", platform: "instagram", fallback: fb(1), caption: "Vendredi soir · henné magique 💫", postedAt: "2026-04-19T20:30:00Z", likes: 412, permalink: "https://instagram.com/al.andalous.brussels" },
    { id: "p2", platform: "instagram", fallback: fb(2), caption: "Jumelage inédit : deux salles, un seul mariage", postedAt: "2026-04-14T18:00:00Z", likes: 287, permalink: "https://instagram.com/al.andalous.brussels" },
    { id: "p3", platform: "instagram", fallback: fb(5), caption: "Dressage façon royale 👑", postedAt: "2026-04-08T14:15:00Z", likes: 521, permalink: "https://instagram.com/al.andalous.brussels" },
    { id: "p4", platform: "instagram", fallback: fb(3), caption: "Notre plafond voûté, éclairé pour l'entrée des mariés", postedAt: "2026-04-02T21:00:00Z", likes: 193, permalink: "https://instagram.com/al.andalous.brussels" },
    { id: "p5", platform: "instagram", fallback: fb(4), caption: "Espace prière rénové — photos bientôt", postedAt: "2026-03-28T10:00:00Z", likes: 154, permalink: "https://instagram.com/al.andalous.brussels" },
    { id: "p6", platform: "instagram", fallback: fb(2), caption: "Merci à la famille B. pour cette soirée 💛", postedAt: "2026-03-22T23:00:00Z", likes: 342, permalink: "https://instagram.com/al.andalous.brussels" },
  ],
  "v-laeken-palace": [
    { id: "p1", platform: "instagram", fallback: fb(2), caption: "Vue sur le parc royal au coucher du soleil", postedAt: "2026-04-21T19:00:00Z", likes: 689, permalink: "https://instagram.com/laeken.palace" },
    { id: "p2", platform: "instagram", fallback: fb(3), caption: "Soirée zaffa en mode cinéma", postedAt: "2026-04-15T22:00:00Z", likes: 1204, permalink: "https://instagram.com/laeken.palace" },
    { id: "p3", platform: "instagram", fallback: fb(5), caption: "Quand la musique s'arrête à 5h du matin", postedAt: "2026-04-09T02:30:00Z", likes: 534, permalink: "https://instagram.com/laeken.palace" },
    { id: "p4", platform: "instagram", fallback: fb(4), caption: "Nouvelle salle VIP disponible dès juin", postedAt: "2026-04-03T12:00:00Z", likes: 412, permalink: "https://instagram.com/laeken.palace" },
  ],
  "v-zellige-hall": [
    { id: "p1", platform: "instagram", fallback: fb(2), caption: "Lustres italiens, âme marocaine", postedAt: "2026-04-22T16:00:00Z", likes: 876, permalink: "https://instagram.com/zellige.hall" },
    { id: "p2", platform: "instagram", fallback: fb(3), caption: "Notre nouveau salon d'accueil privatif", postedAt: "2026-04-18T11:00:00Z", likes: 543, permalink: "https://instagram.com/zellige.hall" },
    { id: "p3", platform: "instagram", fallback: fb(1), caption: "Couple du mois 💒", postedAt: "2026-04-12T20:00:00Z", likes: 1120, permalink: "https://instagram.com/zellige.hall" },
  ],
  "t-beldi-traiteur": [
    { id: "p1", platform: "instagram", fallback: fb(1), caption: "Pastilla aux amandes en préparation", postedAt: "2026-04-20T09:00:00Z", likes: 456, permalink: "https://instagram.com/beldi.traiteur" },
    { id: "p2", platform: "instagram", fallback: fb(3), caption: "Mariage de 400 — tout était impeccable", postedAt: "2026-04-13T23:00:00Z", likes: 789, permalink: "https://instagram.com/beldi.traiteur" },
    { id: "p3", platform: "instagram", fallback: fb(2), caption: "Tajine d'agneau aux pruneaux 🥩", postedAt: "2026-04-07T14:00:00Z", likes: 623, permalink: "https://instagram.com/beldi.traiteur" },
  ],
  "p-studio-medina": [
    { id: "p1", platform: "instagram", fallback: fb(2), caption: "Portrait de mariée — couleur naturelle", postedAt: "2026-04-22T10:00:00Z", likes: 1542, permalink: "https://instagram.com/studio.medina.be" },
    { id: "p2", platform: "instagram", fallback: fb(3), caption: "Les mains — toujours un moment qui touche", postedAt: "2026-04-17T15:00:00Z", likes: 892, permalink: "https://instagram.com/studio.medina.be" },
    { id: "p3", platform: "instagram", fallback: fb(4), caption: "Cérémonie · Al-Andalous · avril 2026", postedAt: "2026-04-10T21:00:00Z", likes: 1203, permalink: "https://instagram.com/studio.medina.be" },
    { id: "p4", platform: "instagram", fallback: fb(5), caption: "Behind the scenes", postedAt: "2026-04-04T12:00:00Z", likes: 456, permalink: "https://instagram.com/studio.medina.be" },
  ],
};
