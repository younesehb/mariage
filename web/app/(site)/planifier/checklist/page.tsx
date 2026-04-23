import type { Metadata } from "next";
import { Checklist } from "./checklist";

export const metadata: Metadata = {
  title: "Checklist · zaffa",
  description: "Les étapes d'un mariage marocain, de la khotba au post-mariage.",
};

export default function ChecklistPage() {
  return <Checklist />;
}
