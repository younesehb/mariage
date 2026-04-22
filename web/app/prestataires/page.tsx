import { vendors } from "@/lib/fixtures";
import type { Vendor } from "@/lib/types";
import { VendorResults } from "./vendor-results";

export default async function PrestatairesPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; ville?: string }>;
}) {
  const { cat, ville } = await searchParams;
  const validCategory = [
    "traiteur", "ziana", "tayyaba", "hennaya", "nasheed", "photographer", "negafa", "videographer",
  ].includes(cat ?? "")
    ? (cat as Vendor["category"])
    : undefined;

  return (
    <VendorResults vendors={vendors} initialCategory={validCategory} initialCity={ville} />
  );
}
