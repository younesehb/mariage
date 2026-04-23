import { AppBar } from "@/components/layout/app-bar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Footer } from "@/components/layout/footer";
import { CookieBanner } from "@/components/consent/cookie-banner";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full flex flex-col">
      <AppBar />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <Footer />
      <BottomNav />
      <CookieBanner />
    </div>
  );
}
