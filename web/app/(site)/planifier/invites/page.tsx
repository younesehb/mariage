import type { Metadata } from "next";
import { GuestList } from "./guest-list";

export const metadata: Metadata = {
  title: "Invités · zaffa",
  description: "Gérez votre liste d'invités, RSVP, séparation jour 1 / jour 2, préférences repas.",
};

export default function InvitesPage() {
  return <GuestList />;
}
