import { venues } from "@/lib/fixtures";
import { VenueResults } from "./venue-results";

export default async function SallesPage({
  searchParams,
}: {
  searchParams: Promise<{ ville?: string; invites?: string; jours?: string }>;
}) {
  const { ville, invites, jours } = await searchParams;
  return (
    <VenueResults
      venues={venues}
      initialCity={ville}
      initialGuests={invites ? Number(invites) : undefined}
      initialDays={jours === "2" ? 2 : 1}
    />
  );
}
