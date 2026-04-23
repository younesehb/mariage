import type { Vendor } from "@/lib/types";

const fb = (n: number) => `photo-fallback${n === 1 ? "" : "-" + n}`;

export const vendors: Vendor[] = [
  // --- TRAITEURS (full parity) ---
  {
    id: "t-beldi-traiteur",
    slug: "beldi-traiteur",
    name: "Beldi Traiteur",
    category: "traiteur",
    description: {
      fr: "Cuisine marocaine authentique, couscous, tajines, pastilla et pièces sucrées. Dressages raffinés, équipe rodée aux grands mariages.",
      nl: "Authentieke Marokkaanse keuken, couscous, tajines, pastilla en zoete hapjes. Verfijnde presentatie, team met ervaring in grote bruiloften.",
    },
    serviceCities: ["Bruxelles", "Antwerpen", "Liège"],
    photos: [
      { fallback: fb(1), alt_fr: "Dressage de tables", alt_nl: "Tafeldekking" },
      { fallback: fb(2), alt_fr: "Plateaux de pastilla", alt_nl: "Pastilla-schotels" },
      { fallback: fb(3), alt_fr: "Pâtisseries marocaines", alt_nl: "Marokkaans gebak" },
    ],
    contactWhatsapp: "+32470123456",
    contactEmail: "contact@beldi-traiteur.be",
    femaleStaffAvailable: true,
    claimStatus: "claimed",
    status: "published",
    cuisineTags: ["marocain", "méditerranéen", "pâtisserie"],
    pricePerGuestMin: 65,
    pricePerGuestMax: 120,
    deliveryRadiusKm: 100,
  },
  {
    id: "t-chorba-royal",
    slug: "chorba-royal",
    name: "Chorba Royal",
    category: "traiteur",
    description: {
      fr: "Spécialiste des grands mariages. Équipe de 20 personnes, capable de servir 800 invités. Cuisine marocaine et libanaise.",
      nl: "Specialist van grote bruiloften. Team van 20, kan tot 800 gasten bedienen. Marokkaanse en Libanese keuken.",
    },
    serviceCities: ["Bruxelles", "Gent"],
    photos: [
      { fallback: fb(5), alt_fr: "Buffet oriental", alt_nl: "Oosters buffet" },
      { fallback: fb(2), alt_fr: "Équipe en cuisine", alt_nl: "Team in de keuken" },
    ],
    contactWhatsapp: "+32471234567",
    contactEmail: "contact@chorba-royal.be",
    femaleStaffAvailable: true,
    claimStatus: "claimed",
    status: "published",
    cuisineTags: ["marocain", "libanais"],
    pricePerGuestMin: 80,
    pricePerGuestMax: 150,
    deliveryRadiusKm: 150,
  },
  {
    id: "t-fes-fusion",
    slug: "fes-fusion",
    name: "Fès Fusion",
    category: "traiteur",
    description: {
      fr: "Pour une touche contemporaine : cuisine marocaine fusionnée avec des influences françaises et italiennes.",
      nl: "Voor een eigentijdse toets: Marokkaanse keuken gemengd met Franse en Italiaanse invloeden.",
    },
    serviceCities: ["Bruxelles"],
    photos: [
      { fallback: fb(3), alt_fr: "Assiette signature", alt_nl: "Signatuur gerecht" },
      { fallback: fb(4), alt_fr: "Dressage chic", alt_nl: "Stijlvolle tafeldekking" },
    ],
    contactWhatsapp: "+32472345678",
    contactEmail: "hello@fesfusion.be",
    femaleStaffAvailable: true,
    claimStatus: "unclaimed",
    status: "published",
    cuisineTags: ["marocain", "français", "fusion"],
    pricePerGuestMin: 95,
    pricePerGuestMax: 160,
    deliveryRadiusKm: 60,
  },
  // --- ZIANA (décor / throne) ---
  {
    id: "z-mille-et-une",
    slug: "mille-et-une-ziana",
    name: "Mille et Une Ziana",
    category: "ziana",
    description: {
      fr: "Mise en scène complète : trône, fleurs, passages en lettres lumineuses. 7 jours de semaine, livraison le jour J.",
      nl: "Volledige mise-en-scène: troon, bloemen, lichtletters. 7 dagen per week, levering op de dag zelf.",
    },
    serviceCities: ["Bruxelles", "Antwerpen", "Charleroi"],
    photos: [
      { fallback: fb(4), alt_fr: "Trône fleuri", alt_nl: "Bloemen-troon" },
      { fallback: fb(5), alt_fr: "Lettres lumineuses", alt_nl: "Lichtletters" },
      { fallback: fb(1), alt_fr: "Scène de mariage", alt_nl: "Bruiloftsscène" },
    ],
    contactWhatsapp: "+32473456789",
    contactEmail: "contact@1001ziana.be",
    femaleStaffAvailable: true,
    claimStatus: "claimed",
    status: "published",
  },
  {
    id: "z-nour-decor",
    slug: "nour-decor",
    name: "Nour Décor",
    category: "ziana",
    description: {
      fr: "Décoration moderne et florale. Styles minimaliste, bohème ou classique.",
      nl: "Moderne en bloemige decoratie. Stijlen minimalistisch, bohemisch of klassiek.",
    },
    serviceCities: ["Bruxelles"],
    photos: [
      { fallback: fb(2), alt_fr: "Décor bohème", alt_nl: "Bohemian decor" },
      { fallback: fb(3), alt_fr: "Arche fleurie", alt_nl: "Bloemenboog" },
    ],
    contactWhatsapp: "+32474567890",
    contactEmail: "hello@nourdecor.be",
    femaleStaffAvailable: true,
    claimStatus: "unclaimed",
    status: "published",
  },
  // --- TAYYABA (bride's dresser) ---
  {
    id: "ty-lalla-salma",
    slug: "lalla-salma-tayyaba",
    name: "Lalla Salma — Tayyaba",
    category: "tayyaba",
    description: {
      fr: "Tayyaba professionnelle, 15 ans d'expérience. Expertise dans les mariages marocains traditionnels, coiffure et maquillage.",
      nl: "Professionele tayyaba, 15 jaar ervaring. Expertise in traditionele Marokkaanse bruiloften, haar en make-up.",
    },
    serviceCities: ["Bruxelles", "Antwerpen"],
    photos: [
      { fallback: fb(5), alt_fr: "Coiffure d'une mariée", alt_nl: "Kapsel van een bruid" },
      { fallback: fb(4), alt_fr: "Maquillage de mariée", alt_nl: "Bruidsmake-up" },
    ],
    contactWhatsapp: "+32475678901",
    contactEmail: "salma@tayyaba.be",
    femaleStaffAvailable: true,
    claimStatus: "claimed",
    status: "published",
  },
  {
    id: "ty-amira-beauty",
    slug: "amira-beauty",
    name: "Amira Beauty",
    category: "tayyaba",
    description: {
      fr: "Équipe 100% féminine. Forfaits incluant coiffure, maquillage et accessoires traditionnels.",
      nl: "100% vrouwelijk team. Forfaits met kapsel, make-up en traditionele accessoires.",
    },
    serviceCities: ["Bruxelles", "Liège"],
    photos: [
      { fallback: fb(3), alt_fr: "Équipe de maquilleuses", alt_nl: "Team van make-upartiesten" },
    ],
    contactWhatsapp: "+32476789012",
    contactEmail: "bonjour@amirabeauty.be",
    femaleStaffAvailable: true,
    claimStatus: "unclaimed",
    status: "published",
  },
  // --- HENNAYA ---
  {
    id: "h-hennaya-royale",
    slug: "hennaya-royale",
    name: "Hennaya Royale",
    category: "hennaya",
    description: {
      fr: "Motifs traditionnels marocains et contemporains. Henné naturel 100%, séchage rapide.",
      nl: "Traditionele Marokkaanse en eigentijdse motieven. 100% natuurlijke henna, snel drogend.",
    },
    serviceCities: ["Bruxelles"],
    photos: [
      { fallback: fb(1), alt_fr: "Motif henné sur main", alt_nl: "Hennamotief op hand" },
      { fallback: fb(2), alt_fr: "Session henné", alt_nl: "Hennasessie" },
    ],
    contactWhatsapp: "+32477890123",
    contactEmail: "contact@hennayaroyale.be",
    femaleStaffAvailable: true,
    claimStatus: "claimed",
    status: "published",
  },
  {
    id: "h-sara-henna",
    slug: "sara-henna",
    name: "Sara Henna",
    category: "hennaya",
    description: {
      fr: "Henné artistique inspiré du nord du Maroc. Sessions à domicile ou en salle.",
      nl: "Artistieke henna geïnspireerd op Noord-Marokko. Sessies aan huis of in een zaal.",
    },
    serviceCities: ["Bruxelles", "Antwerpen"],
    photos: [
      { fallback: fb(3), alt_fr: "Henné artistique", alt_nl: "Artistieke henna" },
    ],
    contactWhatsapp: "+32478901234",
    contactEmail: "sara@hennaart.be",
    femaleStaffAvailable: true,
    claimStatus: "unclaimed",
    status: "published",
  },
  // --- NASHEED GROUPS ---
  {
    id: "n-firqa-al-noor",
    slug: "firqa-al-noor",
    name: "Firqa Al-Noor",
    category: "nasheed",
    description: {
      fr: "Groupe de nachid bruxellois, répertoire arabe et amazigh. 6 chanteurs + percussions.",
      nl: "Brusselse nachid-groep, Arabisch en Amazigh repertoire. 6 zangers + percussies.",
    },
    serviceCities: ["Bruxelles", "Gent", "Antwerpen"],
    photos: [
      { fallback: fb(4), alt_fr: "Groupe en performance", alt_nl: "Groep in performance" },
    ],
    contactWhatsapp: "+32479012345",
    contactEmail: "booking@alnoor.be",
    femaleStaffAvailable: false,
    claimStatus: "claimed",
    status: "published",
  },
  {
    id: "n-andalous-nasheed",
    slug: "andalous-nasheed",
    name: "Andalous Nasheed",
    category: "nasheed",
    description: {
      fr: "Spécialiste du samaa andalou. Trio acoustique avec oud et percussions.",
      nl: "Specialist in Andalusische samaa. Akoestisch trio met oud en percussies.",
    },
    serviceCities: ["Bruxelles"],
    photos: [
      { fallback: fb(5), alt_fr: "Trio en concert", alt_nl: "Trio in concert" },
    ],
    contactWhatsapp: "+32470123457",
    contactEmail: "contact@andalousnasheed.be",
    femaleStaffAvailable: false,
    claimStatus: "unclaimed",
    status: "published",
  },
  // --- PHOTOGRAPHERS ---
  {
    id: "p-studio-medina",
    slug: "studio-medina",
    name: "Studio Medina",
    category: "photographer",
    description: {
      fr: "Photographie de mariage éditoriale. Style cinématique, post-production soignée.",
      nl: "Editoriale bruiloftsfotografie. Cinematische stijl, verzorgde postproductie.",
    },
    serviceCities: ["Bruxelles", "Antwerpen", "Gent"],
    photos: [
      { fallback: fb(2), alt_fr: "Portrait de mariée", alt_nl: "Bruidsportret" },
      { fallback: fb(3), alt_fr: "Scène de cérémonie", alt_nl: "Ceremoniescène" },
      { fallback: fb(4), alt_fr: "Détails des mains", alt_nl: "Handdetails" },
    ],
    contactWhatsapp: "+32471234568",
    contactEmail: "hello@studiomedina.be",
    femaleStaffAvailable: true,
    claimStatus: "claimed",
    status: "published",
  },
  {
    id: "p-anouar-lens",
    slug: "anouar-lens",
    name: "Anouar Lens",
    category: "photographer",
    description: {
      fr: "Photographe documentaire, captures authentiques et spontanées.",
      nl: "Documentaire fotograaf, authentieke en spontane momenten.",
    },
    serviceCities: ["Bruxelles", "Charleroi"],
    photos: [
      { fallback: fb(5), alt_fr: "Moment spontané", alt_nl: "Spontaan moment" },
      { fallback: fb(1), alt_fr: "Portrait en noir et blanc", alt_nl: "Zwart-wit portret" },
    ],
    contactWhatsapp: "+32472345679",
    contactEmail: "anouar@anouarlens.be",
    femaleStaffAvailable: false,
    claimStatus: "unclaimed",
    status: "published",
  },
  // --- NEGAFA ---
  {
    id: "g-negafa-royale",
    slug: "negafa-royale",
    name: "Négafa Royale",
    category: "negafa",
    description: {
      fr: "Forfait takchita + caftan : 7 tenues de la traditionnelle au contemporain, changements assurés.",
      nl: "Takchita + kaftan forfait: 7 outfits van traditioneel tot hedendaags, kledingwisselingen verzekerd.",
    },
    serviceCities: ["Bruxelles", "Antwerpen"],
    photos: [
      { fallback: fb(4), alt_fr: "Défilé de tenues", alt_nl: "Modeparade" },
      { fallback: fb(2), alt_fr: "Prise d'une mariée en takchita", alt_nl: "Bruid in takchita" },
    ],
    contactWhatsapp: "+32473456790",
    contactEmail: "contact@negafaroyale.be",
    femaleStaffAvailable: true,
    claimStatus: "claimed",
    status: "published",
  },
  // --- VIDEOGRAPHERS ---
  {
    id: "vi-minbar-films",
    slug: "minbar-films",
    name: "Minbar Films",
    category: "videographer",
    description: {
      fr: "Vidéo de mariage cinématique. Équipe de 3 vidéastes, drone inclus.",
      nl: "Cinematische bruiloftsvideo. Team van 3 videografen, drone inbegrepen.",
    },
    serviceCities: ["Bruxelles", "Antwerpen", "Gent", "Liège"],
    photos: [
      { fallback: fb(3), alt_fr: "Drone en action", alt_nl: "Drone in actie" },
      { fallback: fb(5), alt_fr: "Vidéaste au travail", alt_nl: "Videograaf aan het werk" },
    ],
    contactWhatsapp: "+32474567891",
    contactEmail: "contact@minbar.films",
    femaleStaffAvailable: true,
    claimStatus: "claimed",
    status: "published",
  },
];

export function findVendorBySlug(slug: string): Vendor | undefined {
  return vendors.find((v) => v.slug === slug);
}

export function vendorsByCategory(cat: Vendor["category"]): Vendor[] {
  return vendors.filter((v) => v.category === cat && v.status === "published");
}
