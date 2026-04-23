import { AdminHeader } from "../../admin/admin-header";
import { CalendarClient } from "./calendar-client";
import { currentVenue, currentInquiries } from "@/lib/fixtures/pro-context";

export default function ProCalendarPage() {
  const venue = currentVenue();
  const bookedDates = currentInquiries()
    .filter((i) => i.status === "accepted")
    .flatMap((i) => [i.datePrimary, i.dateSecondary].filter(Boolean) as string[]);

  return (
    <>
      <AdminHeader
        title="Calendrier"
        subtitle="Marquez les dates déjà réservées pour éviter les demandes inutiles"
      />
      <div className="p-6 md:p-8">
        <CalendarClient venueName={venue.name} initialBooked={bookedDates} />
      </div>
    </>
  );
}
