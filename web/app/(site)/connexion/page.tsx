import Link from "next/link";
import { Mail } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 md:px-8 py-12 md:py-16 grid md:grid-cols-2 gap-12 md:gap-16 items-center">
      <div className="photo-fallback-3 h-72 md:h-[520px] rounded-xl hidden md:block relative overflow-hidden">
        <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/30 to-transparent" />
        <blockquote className="absolute inset-x-8 bottom-8 text-white font-serif text-2xl leading-snug">
          « Sans zaffa, on serait encore en train de chercher la salle. »
          <footer className="mt-2 text-sm font-sans not-italic opacity-80">— Hajar & Amine, Bruxelles</footer>
        </blockquote>
      </div>
      <div className="max-w-md w-full mx-auto md:mx-0 space-y-6">
        <h1 className="font-serif text-4xl text-ink">Se connecter</h1>
        <p className="text-ink-muted">
          Entrez votre email pour retrouver vos favoris et vos demandes.
        </p>
        <button
          type="button"
          className="w-full rounded-lg border border-hairline bg-card py-3 font-medium flex items-center justify-center gap-2 hover:border-ink transition-colors"
        >
          <svg className="h-4 w-4" viewBox="0 0 48 48" aria-hidden>
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Continuer avec Google
        </button>
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-hairline" />
          <span className="text-xs text-ink-muted uppercase tracking-wider">ou</span>
          <div className="h-px flex-1 bg-hairline" />
        </div>
        <form className="space-y-4">
          <label className="block">
            <span className="block text-sm font-medium text-ink mb-1.5">Email</span>
            <div className="flex items-center gap-2 rounded-lg border border-hairline bg-card px-3 py-3 focus-within:border-ink">
              <Mail className="h-4 w-4 text-ink-muted" />
              <input
                type="email"
                placeholder="vous@exemple.be"
                className="flex-1 bg-transparent text-sm outline-none"
                required
              />
            </div>
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-ink mb-1.5">Mot de passe</span>
            <input
              type="password"
              className="w-full rounded-lg border border-hairline bg-card px-3 py-3 text-sm outline-none focus:border-ink"
              required
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-lg bg-garnet py-3.5 font-semibold text-white hover:bg-garnet-hover"
          >
            Se connecter
          </button>
        </form>
        <p className="text-sm text-ink-muted">
          Pas de compte ? <Link href="/inscription" className="text-ink font-medium underline underline-offset-4">Créer un compte</Link>
        </p>
      </div>
    </div>
  );
}
