"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  onConfirm,
  tone = "default",
  icon,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  tone?: "default" | "destructive";
  icon?: React.ReactNode;
}) {
  const destructive = tone === "destructive";
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop
          className={cn(
            "fixed inset-0 z-50 bg-ink/30 backdrop-blur-md",
            "data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
          )}
        />
        <DialogPrimitive.Popup
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2",
            "rounded-2xl border border-hairline bg-card/95 shadow-e2 backdrop-blur-xl",
            "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
            "data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            "outline-none",
          )}
        >
          <div className="flex items-start gap-3 px-5 pt-5">
            <span
              className={cn(
                "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                destructive ? "bg-garnet/10 text-garnet" : "bg-surface-muted text-ink",
              )}
            >
              {icon ?? <AlertTriangle className="h-4 w-4" strokeWidth={1.75} />}
            </span>
            <div className="min-w-0">
              <DialogPrimitive.Title className="font-serif text-lg text-ink">
                {title}
              </DialogPrimitive.Title>
              {description && (
                <DialogPrimitive.Description className="mt-1 text-sm text-ink-muted">
                  {description}
                </DialogPrimitive.Description>
              )}
            </div>
          </div>

          <footer className="mt-5 flex items-center justify-end gap-2 border-t border-hairline bg-surface-muted/30 px-5 py-3 rounded-b-2xl">
            <DialogPrimitive.Close className="rounded-pill border border-hairline bg-card px-4 py-2 text-sm font-medium text-ink hover:border-ink-muted">
              {cancelLabel}
            </DialogPrimitive.Close>
            <button
              type="button"
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
              className={cn(
                "rounded-pill px-4 py-2 text-sm font-semibold text-white transition-colors",
                destructive
                  ? "bg-garnet hover:bg-garnet-hover"
                  : "bg-ink hover:bg-ink/90",
              )}
            >
              {confirmLabel}
            </button>
          </footer>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
