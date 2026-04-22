import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({
  value,
  size = "sm",
  className,
}: {
  value: number;
  size?: "xs" | "sm" | "md";
  className?: string;
}) {
  const dim = size === "xs" ? "h-3 w-3" : size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  return (
    <span
      role="img"
      aria-label={`Note : ${value} sur 5`}
      className={cn("inline-flex items-center gap-0.5 text-garnet", className)}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(dim, i <= Math.round(value) ? "fill-current" : "fill-transparent opacity-30")}
          strokeWidth={1.5}
        />
      ))}
    </span>
  );
}
