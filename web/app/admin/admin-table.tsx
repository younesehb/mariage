import { cn } from "@/lib/utils";

export function AdminTable({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-xl border border-hairline bg-card overflow-hidden", className)}>
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

export function TH({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <th
      className={cn(
        "sticky top-0 bg-surface-muted/80 backdrop-blur-md text-left text-[11px] font-semibold uppercase tracking-wider text-ink-muted px-4 py-3 border-b border-hairline",
        className,
      )}
      scope="col"
    >
      {children}
    </th>
  );
}

export function TR({ children, className }: { children: React.ReactNode; className?: string }) {
  return <tr className={cn("border-b border-hairline last:border-0 hover:bg-surface-muted/40 transition-colors", className)}>{children}</tr>;
}

export function TD({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <td className={cn("px-4 py-3.5 align-middle", className)}>{children}</td>;
}

export function StatusPill({
  tone,
  children,
}: {
  tone: "success" | "error" | "warning" | "muted" | "info";
  children: React.ReactNode;
}) {
  const cls: Record<typeof tone, string> = {
    success: "border-success/30 bg-success/10 text-success",
    error: "border-error/30 bg-error/10 text-error",
    warning: "border-warning/30 bg-warning/10 text-warning",
    muted: "border-hairline bg-surface-muted text-ink-muted",
    info: "border-garnet/30 bg-garnet-soft text-garnet",
  };
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-pill border px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap", cls[tone])}>
      {children}
    </span>
  );
}
