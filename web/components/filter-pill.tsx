import { cn } from "@/lib/utils";

export function FilterPill({
  children,
  active,
  count,
  onClick,
  className,
}: {
  children: React.ReactNode;
  active?: boolean;
  count?: number;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-pill border px-4 py-2 text-sm font-medium transition-colors",
        "min-h-[44px]", // a11y touch target
        active
          ? "border-ink bg-ink text-surface"
          : "border-hairline bg-card text-ink hover:border-ink-muted",
        className,
      )}
    >
      {children}
      {count != null && count > 0 && (
        <span
          className={cn(
            "ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[11px] font-semibold",
            active ? "bg-surface text-ink" : "bg-garnet text-white",
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}
