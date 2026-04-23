"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Mail, Lock, User as UserIcon, Phone, Eye, EyeOff, Check, Heart, Building2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Role = "couple" | "pro";

type Errors = Partial<Record<"fullName" | "email" | "password" | "confirm" | "terms", string>>;

function scorePassword(pwd: string): { score: 0 | 1 | 2 | 3 | 4; label: string } {
  if (!pwd) return { score: 0, label: "" };
  let s = 0;
  if (pwd.length >= 8) s++;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) s++;
  if (/\d/.test(pwd)) s++;
  if (/[^A-Za-z0-9]/.test(pwd) || pwd.length >= 12) s++;
  const labels = ["", "Faible", "Moyen", "Bon", "Excellent"];
  return { score: Math.max(0, Math.min(4, s)) as 0 | 1 | 2 | 3 | 4, label: labels[s] };
}

export function InscriptionForm() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("couple");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [terms, setTerms] = useState(false);
  const [newsletter, setNewsletter] = useState(true);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const strength = useMemo(() => scorePassword(password), [password]);

  function validate(): Errors {
    const e: Errors = {};
    if (fullName.trim().length < 2) e.fullName = "Nom requis";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Email invalide";
    if (password.length < 8) e.password = "Au moins 8 caractères";
    if (confirm !== password) e.confirm = "Les mots de passe ne correspondent pas";
    if (!terms) e.terms = "Vous devez accepter les conditions";
    return e;
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    router.push(role === "pro" ? "/reclamer" : "/profil");
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6 md:mx-0">
      <header className="space-y-2">
        <h1 className="font-serif text-4xl text-ink">Créer un compte</h1>
        <p className="text-ink-muted">
          Gérez vos favoris, demandes et devis en un seul endroit.
        </p>
      </header>

      <RolePicker value={role} onChange={setRole} />

      <button
        type="button"
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-hairline bg-card py-3 font-medium transition-colors hover:border-ink"
      >
        <svg className="h-4 w-4" viewBox="0 0 48 48" aria-hidden>
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        </svg>
        S'inscrire avec Google
      </button>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-hairline" />
        <span className="text-xs uppercase tracking-wider text-ink-muted">ou par email</span>
        <div className="h-px flex-1 bg-hairline" />
      </div>

      <form className="space-y-4" onSubmit={onSubmit} noValidate>
        <TextField
          label="Nom complet"
          icon={<UserIcon className="h-4 w-4 text-ink-muted" strokeWidth={1.75} />}
          type="text"
          placeholder={role === "pro" ? "Nom du gérant" : "Prénom Nom"}
          autoComplete="name"
          value={fullName}
          onChange={setFullName}
          error={errors.fullName}
        />

        <TextField
          label="Email"
          icon={<Mail className="h-4 w-4 text-ink-muted" strokeWidth={1.75} />}
          type="email"
          placeholder="vous@exemple.be"
          autoComplete="email"
          value={email}
          onChange={setEmail}
          error={errors.email}
        />

        <TextField
          label="Téléphone (optionnel)"
          icon={<Phone className="h-4 w-4 text-ink-muted" strokeWidth={1.75} />}
          type="tel"
          placeholder="+32 470 12 34 56"
          autoComplete="tel"
          value={phone}
          onChange={setPhone}
          hint="Pour être rappelé par les salles si besoin."
        />

        <div className="space-y-1.5">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink">Mot de passe</span>
            <div
              className={cn(
                "flex items-center gap-2 rounded-lg border bg-card px-3 py-3 transition-colors focus-within:border-ink",
                errors.password ? "border-garnet" : "border-hairline",
              )}
            >
              <Lock className="h-4 w-4 text-ink-muted" strokeWidth={1.75} />
              <input
                type={showPwd ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Au moins 8 caractères"
                className="flex-1 bg-transparent text-sm outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                aria-label={showPwd ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                className="p-1 text-ink-muted hover:text-ink"
              >
                {showPwd ? <EyeOff className="h-4 w-4" strokeWidth={1.75} /> : <Eye className="h-4 w-4" strokeWidth={1.75} />}
              </button>
            </div>
          </label>
          {password && <StrengthMeter score={strength.score} label={strength.label} />}
          {errors.password && <p className="text-xs text-garnet">{errors.password}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink">Confirmer le mot de passe</span>
            <div
              className={cn(
                "flex items-center gap-2 rounded-lg border bg-card px-3 py-3 transition-colors focus-within:border-ink",
                errors.confirm ? "border-garnet" : "border-hairline",
              )}
            >
              <Lock className="h-4 w-4 text-ink-muted" strokeWidth={1.75} />
              <input
                type={showPwd ? "text" : "password"}
                autoComplete="new-password"
                className="flex-1 bg-transparent text-sm outline-none"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
              {confirm && confirm === password && (
                <Check className="h-4 w-4 text-emerald-600" strokeWidth={2} aria-label="Les mots de passe correspondent" />
              )}
            </div>
          </label>
          {errors.confirm && <p className="text-xs text-garnet">{errors.confirm}</p>}
        </div>

        <div className="space-y-2 pt-1">
          <Check2
            checked={terms}
            onChange={setTerms}
            error={errors.terms}
          >
            J'accepte les{" "}
            <Link href="/cgu" className="font-medium text-ink underline underline-offset-4">
              conditions d'utilisation
            </Link>{" "}
            et la{" "}
            <Link href="/confidentialite" className="font-medium text-ink underline underline-offset-4">
              politique de confidentialité
            </Link>
            .
          </Check2>
          <Check2 checked={newsletter} onChange={setNewsletter}>
            Recevoir des inspirations et nouveautés (max 1 email / mois).
          </Check2>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className={cn(
            "inline-flex w-full items-center justify-center gap-2 rounded-lg bg-garnet py-3.5 font-semibold text-white transition-colors hover:bg-garnet-hover",
            submitting && "opacity-70",
          )}
        >
          {submitting ? "Création du compte…" : (
            <>
              Créer mon compte
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </>
          )}
        </button>
      </form>

      <p className="text-sm text-ink-muted">
        Déjà un compte ?{" "}
        <Link href="/connexion" className="font-medium text-ink underline underline-offset-4">
          Se connecter
        </Link>
      </p>
    </div>
  );
}

function RolePicker({ value, onChange }: { value: Role; onChange: (r: Role) => void }) {
  return (
    <div
      role="radiogroup"
      aria-label="Type de compte"
      className="grid grid-cols-2 gap-2 rounded-xl border border-hairline bg-surface-muted/40 p-1"
    >
      <RoleOption
        active={value === "couple"}
        onClick={() => onChange("couple")}
        icon={<Heart className="h-4 w-4" strokeWidth={1.75} />}
        title="Je me marie"
        desc="Trouver salle & prestataires"
      />
      <RoleOption
        active={value === "pro"}
        onClick={() => onChange("pro")}
        icon={<Building2 className="h-4 w-4" strokeWidth={1.75} />}
        title="Professionnel"
        desc="Revendiquer une fiche"
      />
    </div>
  );
}

function RoleOption({
  active,
  onClick,
  icon,
  title,
  desc,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className={cn(
        "flex flex-col items-start gap-1 rounded-lg border px-3 py-3 text-left transition-all",
        active
          ? "border-ink bg-card shadow-e1"
          : "border-transparent bg-transparent hover:bg-card/60",
      )}
    >
      <span
        className={cn(
          "inline-flex h-7 w-7 items-center justify-center rounded-full",
          active ? "bg-garnet/10 text-garnet" : "bg-surface text-ink-muted",
        )}
      >
        {icon}
      </span>
      <span className={cn("text-sm font-semibold", active ? "text-ink" : "text-ink-muted")}>{title}</span>
      <span className="text-[11px] leading-tight text-ink-muted">{desc}</span>
    </button>
  );
}

function TextField({
  label,
  icon,
  type,
  placeholder,
  autoComplete,
  value,
  onChange,
  error,
  hint,
}: {
  label: string;
  icon: React.ReactNode;
  type: string;
  placeholder?: string;
  autoComplete?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
        <div
          className={cn(
            "flex items-center gap-2 rounded-lg border bg-card px-3 py-3 transition-colors focus-within:border-ink",
            error ? "border-garnet" : "border-hairline",
          )}
        >
          {icon}
          <input
            type={type}
            placeholder={placeholder}
            autoComplete={autoComplete}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none"
          />
        </div>
      </label>
      {error ? (
        <p className="text-xs text-garnet">{error}</p>
      ) : hint ? (
        <p className="text-xs text-ink-muted">{hint}</p>
      ) : null}
    </div>
  );
}

function StrengthMeter({ score, label }: { score: number; label: string }) {
  const colors = ["bg-hairline", "bg-garnet", "bg-amber-500", "bg-emerald-500", "bg-emerald-600"];
  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-1 gap-1">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              i < score ? colors[score] : "bg-hairline",
            )}
          />
        ))}
      </div>
      <span className="text-[11px] font-medium text-ink-muted tabular-nums">{label}</span>
    </div>
  );
}

function Check2({
  checked,
  onChange,
  children,
  error,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="flex cursor-pointer items-start gap-2.5">
        <span
          className={cn(
            "mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded border transition-all",
            checked ? "border-ink bg-ink" : error ? "border-garnet" : "border-hairline bg-card",
          )}
        >
          {checked && <Check className="h-3 w-3 text-surface" strokeWidth={2.5} />}
        </span>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <span className="text-[13px] leading-snug text-ink-muted">{children}</span>
      </label>
      {error && <p className="pl-6 text-xs text-garnet">{error}</p>}
    </div>
  );
}
