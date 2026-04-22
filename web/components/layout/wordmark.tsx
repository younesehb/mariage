export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={
        "inline-flex items-center gap-2 font-serif text-xl tracking-tight text-ink " +
        (className ?? "")
      }
    >
      <span
        aria-hidden
        className="relative inline-block h-5 w-5"
      >
        {/* Subtle mark: concentric "zaffa" dots */}
        <span className="absolute inset-0 rounded-full bg-garnet/10" />
        <span className="absolute inset-1 rounded-full bg-garnet/30" />
        <span className="absolute inset-[7px] rounded-full bg-garnet" />
      </span>
      <span className="leading-none">
        zaffa<span className="text-garnet">.</span>
      </span>
    </span>
  );
}
