import type { Metadata } from "next";
import { AdminSidebar } from "./admin-sidebar";

export const metadata: Metadata = {
  title: "Admin · Zaffa",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-surface-muted/40">
      <AdminSidebar />
      <div className="flex-1 min-w-0 min-h-screen flex flex-col">{children}</div>
    </div>
  );
}
