import type { Metadata } from "next";
import { BudgetTracker } from "./budget-tracker";

export const metadata: Metadata = {
  title: "Budget · zaffa",
  description: "Répartissez et suivez votre budget mariage, catégorie par catégorie.",
};

export default function BudgetPage() {
  return <BudgetTracker />;
}
