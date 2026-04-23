import type { Metadata } from "next";
import { CookieSettingsButton } from "@/components/consent/cookie-settings-button";

export const metadata: Metadata = {
  title: "Cookies · zaffa",
  description: "Les cookies utilisés sur zaffa et comment les gérer.",
};

export default function CookiesPage() {
  return (
    <>
      <h1>Politique cookies</h1>
      <p className="lede">
        Les cookies sont de petits fichiers déposés sur votre appareil. Certains sont
        indispensables au fonctionnement du site, d'autres nécessitent votre consentement.
      </p>
      <p className="text-xs uppercase tracking-widest text-ink-muted">
        Dernière mise à jour : 23 avril 2026
      </p>

      <CookieSettingsButton />

      <h2>Cookies essentiels</h2>
      <p>
        Nécessaires au fonctionnement : session d'authentification, préférence de langue,
        préférence d'affichage (grille/liste), consentement cookies. Ils ne peuvent pas
        être désactivés.
      </p>
      <ul>
        <li><strong>zaffa.view.pref</strong> — affichage grille ou liste (6 mois)</li>
        <li><strong>zaffa.consent</strong> — votre choix de consentement (12 mois)</li>
        <li><strong>zaffa.plan</strong> — brouillon de plan de mariage local (jusqu'à suppression)</li>
      </ul>

      <h2>Cookies de mesure d'audience</h2>
      <p>
        Nous aident à comprendre comment les utilisateurs naviguent sur zaffa, de façon
        agrégée. Activés uniquement après votre consentement. Les données sont anonymisées
        avant analyse et conservées 13 mois.
      </p>

      <h2>Cookies marketing</h2>
      <p>
        Utilisés pour vous montrer des contenus pertinents sur d'autres sites. Activés
        uniquement après consentement. Vous pouvez les désactiver à tout moment.
      </p>

      <h2>Gérer votre choix</h2>
      <p>
        Vous pouvez modifier vos préférences à tout moment via le bouton ci-dessus, ou
        depuis les paramètres de votre navigateur. Le refus n'empêche pas l'accès aux
        fonctionnalités essentielles.
      </p>
    </>
  );
}
