import { FavorisClient } from "./favoris-client";
import { venues } from "@/lib/fixtures";

const DEMO_IDS = ["v-salle-andalous", "v-laeken-palace", "v-zellige-hall"];

export const metadata = { title: "Favoris · zaffa" };

export default function FavorisPage() {
  const saved = venues.filter((v) => DEMO_IDS.includes(v.id));
  return <FavorisClient venues={saved} />;
}
