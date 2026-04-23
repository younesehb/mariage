export function AdminHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-hairline bg-card/90 backdrop-blur-md">
      <div className="flex items-center justify-between px-6 md:px-8 py-5">
        <div>
          <h1 className="font-serif text-2xl text-ink leading-tight">{title}</h1>
          {subtitle && <p className="text-sm text-ink-muted mt-0.5">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}
