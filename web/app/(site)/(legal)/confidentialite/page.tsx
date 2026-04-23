import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Confidentialité · zaffa",
  description: "Comment zaffa collecte, utilise et protège vos données personnelles.",
};

export default function ConfidentialitePage() {
  return (
    <>
      <h1>Politique de confidentialité</h1>
      <p className="lede">
        Nous prenons la protection de vos données au sérieux. Cette politique explique,
        simplement, ce que nous collectons, pourquoi, et comment exercer vos droits.
      </p>
      <p className="text-xs uppercase tracking-widest text-ink-muted">
        Dernière mise à jour : 23 avril 2026 · Conforme au RGPD (UE 2016/679)
      </p>

      <h2>Responsable du traitement</h2>
      <p>
        zaffa SRL, Bruxelles (BE 0000.000.000). Contact DPO :{" "}
        <a href="mailto:dpo@zaffa.be">dpo@zaffa.be</a>.
      </p>

      <h2>Données collectées</h2>
      <ul>
        <li>
          <strong>Compte</strong> : nom, email, mot de passe (haché), téléphone (optionnel).
        </li>
        <li>
          <strong>Planification</strong> : dates du mariage, nombre d'invités, ville,
          budget, favoris, brouillons de plan (stockés localement dans votre navigateur
          tant que vous n'avez pas de compte).
        </li>
        <li>
          <strong>Demandes et avis</strong> : messages échangés avec les prestataires,
          avis publiés.
        </li>
        <li>
          <strong>Techniques</strong> : adresse IP, type d'appareil, pages consultées —
          via cookies uniquement si vous y consentez (voir{" "}
          <a href="/cookies">Cookies</a>).
        </li>
      </ul>

      <h2>Finalités</h2>
      <ul>
        <li>Faire fonctionner votre compte et la plateforme (base légale : contrat) ;</li>
        <li>Envoyer vos demandes aux prestataires (base légale : contrat) ;</li>
        <li>Améliorer le service et détecter les fraudes (intérêt légitime) ;</li>
        <li>
          Vous envoyer des emails d'inspiration — uniquement si vous y consentez
          (base légale : consentement, révocable à tout moment).
        </li>
      </ul>

      <h2>Destinataires</h2>
      <p>
        Vos données sont partagées avec : (i) le prestataire auquel vous envoyez une
        demande ; (ii) nos sous-traitants techniques (hébergement, envoi d'emails) liés par
        contrat RGPD ; (iii) les autorités sur requête légale.
      </p>

      <h2>Conservation</h2>
      <ul>
        <li>Données de compte : tant que votre compte existe, puis 12 mois.</li>
        <li>Demandes et devis : 5 ans après la dernière interaction (preuve contractuelle).</li>
        <li>Cookies : voir la page <a href="/cookies">Cookies</a>.</li>
      </ul>

      <h2>Vos droits</h2>
      <p>
        Conformément au RGPD, vous disposez des droits d'accès, rectification, effacement,
        limitation, portabilité et opposition. Depuis votre <a href="/profil">profil</a>,
        vous pouvez exporter ou supprimer vos données à tout moment. Vous pouvez aussi nous
        écrire à <a href="mailto:dpo@zaffa.be">dpo@zaffa.be</a>.
      </p>
      <p>
        En cas de désaccord, vous pouvez introduire une plainte auprès de l'Autorité de
        protection des données belge (<a href="https://www.autoriteprotectiondonnees.be">
        autoriteprotectiondonnees.be</a>).
      </p>

      <h2>Transferts hors UE</h2>
      <p>
        Vos données sont hébergées dans l'Union européenne. Si un sous-traitant est établi
        hors UE, nous utilisons les clauses contractuelles types de la Commission
        européenne.
      </p>

      <h2>Sécurité</h2>
      <p>
        Chiffrement en transit (TLS 1.3), mots de passe hachés (Argon2), accès limité,
        journalisation des accès administratifs, sauvegardes chiffrées.
      </p>
    </>
  );
}
