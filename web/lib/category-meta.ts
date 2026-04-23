import {
  ChefHat,
  Sparkles,
  Palette,
  Droplet,
  Music2,
  Camera,
  Shirt,
  Video,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { VendorCategory } from "@/lib/types";

export interface CategoryMeta {
  key: VendorCategory;
  labelFr: string;
  labelNl: string;
  /** Short inline description (shown on category hero). */
  taglineFr: string;
  /** Longer explanatory text shown on detail landing / empty states. */
  descriptionFr: string;
  icon: LucideIcon;
  /**
   * Tailwind tint class applied to icon bubble backgrounds. Keep warm and distinct
   * so the 8 categories visually separate at a glance.
   */
  tint: string;
  /** Accent foreground tailwind class for the icon. */
  accentFg: string;
}

export const CATEGORIES: Record<VendorCategory, CategoryMeta> = {
  traiteur: {
    key: "traiteur",
    labelFr: "Traiteur",
    labelNl: "Traiteur",
    taglineFr: "Couscous, tajines, pastilla, pièces sucrées",
    descriptionFr:
      "Les traiteurs marocains et méditerranéens capables de servir 100 à 1000 invités. Halal certifié, dressages raffinés.",
    icon: ChefHat,
    tint: "bg-[oklch(0.94_0.04_45)]",
    accentFg: "text-[oklch(0.42_0.12_35)]",
  },
  ziana: {
    key: "ziana",
    labelFr: "Ziana",
    labelNl: "Ziana",
    taglineFr: "Trône, décor, lettres lumineuses",
    descriptionFr:
      "Mise en scène complète pour la soirée : trône, arches fleuries, passages en lettres lumineuses et décor sur mesure.",
    icon: Sparkles,
    tint: "bg-[oklch(0.95_0.03_90)]",
    accentFg: "text-[oklch(0.45_0.12_75)]",
  },
  tayyaba: {
    key: "tayyaba",
    labelFr: "Tayyaba",
    labelNl: "Tayyaba",
    taglineFr: "Coiffure, maquillage, accessoires",
    descriptionFr:
      "La tayyaba s'occupe de la mariée : coiffure, maquillage et accessoires traditionnels pour chaque tenue.",
    icon: Palette,
    tint: "bg-[oklch(0.94_0.04_345)]",
    accentFg: "text-[oklch(0.45_0.15_5)]",
  },
  hennaya: {
    key: "hennaya",
    labelFr: "Hennaya",
    labelNl: "Hennaya",
    taglineFr: "Motifs traditionnels et contemporains",
    descriptionFr:
      "Application du henné — motifs andalous, amazighs ou contemporains. Séchage rapide, 100% naturel.",
    icon: Droplet,
    tint: "bg-[oklch(0.93_0.05_55)]",
    accentFg: "text-[oklch(0.42_0.15_50)]",
  },
  nasheed: {
    key: "nasheed",
    labelFr: "Groupe nachid",
    labelNl: "Nachid-groep",
    taglineFr: "Chants arabes, amazighs et andalous",
    descriptionFr:
      "Groupes vocaux et percussions pour la zaffa, l'entrée des mariés et la soirée. Répertoire arabe, amazigh et andalou.",
    icon: Music2,
    tint: "bg-[oklch(0.95_0.03_180)]",
    accentFg: "text-[oklch(0.42_0.1_185)]",
  },
  photographer: {
    key: "photographer",
    labelFr: "Photographe",
    labelNl: "Fotograaf",
    taglineFr: "Portraits, couverture, album",
    descriptionFr:
      "Photographes de mariage — style éditorial, documentaire ou traditionnel. Portrait, couverture, album.",
    icon: Camera,
    tint: "bg-[oklch(0.94_0.02_240)]",
    accentFg: "text-[oklch(0.40_0.10_260)]",
  },
  negafa: {
    key: "negafa",
    labelFr: "Négafa",
    labelNl: "Negafa",
    taglineFr: "Takchita, caftan, sept tenues",
    descriptionFr:
      "La négafa prépare les tenues de la mariée, orchestre les changements et sublime chaque takchita ou caftan.",
    icon: Shirt,
    tint: "bg-[oklch(0.93_0.05_340)]",
    accentFg: "text-[oklch(0.40_0.14_345)]",
  },
  videographer: {
    key: "videographer",
    labelFr: "Vidéaste",
    labelNl: "Videograaf",
    taglineFr: "Cinéma, drone, highlights",
    descriptionFr:
      "Vidéastes de mariage — teaser court, film long, drone et highlights pour les réseaux.",
    icon: Video,
    tint: "bg-[oklch(0.95_0.03_145)]",
    accentFg: "text-[oklch(0.40_0.13_150)]",
  },
};

export const CATEGORY_ORDER: VendorCategory[] = [
  "traiteur",
  "ziana",
  "tayyaba",
  "hennaya",
  "nasheed",
  "photographer",
  "negafa",
  "videographer",
];

/** Known cuisine tags used by traiteur listings — for filter UI. */
export const CUISINE_TAGS = [
  "marocain",
  "méditerranéen",
  "libanais",
  "français",
  "fusion",
  "pâtisserie",
];
