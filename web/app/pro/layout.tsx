import type { Metadata } from "next";
import { ProSidebar } from "./pro-sidebar";

export const metadata: Metadata = {
  title: "Espace pro · Zaffa",
};

export default function ProLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-surface-muted/40">
      <ProSidebar />
      <div className="flex-1 min-w-0 min-h-screen flex flex-col">{children}</div>
    </div>
  );
}
