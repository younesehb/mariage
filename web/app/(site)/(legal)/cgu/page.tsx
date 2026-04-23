import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions d'utilisation · zaffa",
  description: "Les règles d'utilisation de la plateforme zaffa.",
};

export default function CguPage() {
  return (
    <>
      <h1>Conditions d'utilisation</h1>
      <p className="lede">
        En créant un compte ou en utilisant zaffa, vous acceptez les conditions ci-dessous.
        Elles encadrent les relations entre vous, les professionnels listés sur la plateforme
        et zaffa SRL.
      </p>
      <p className="text-xs uppercase tracking-widest text-ink-muted">
        Dernière mise à jour : 23 avril 2026
      </p>

      <h2>1. Qui sommes-nous</h2>
      <p>
        zaffa est édité par <strong>zaffa SRL</strong>, société de droit belge, inscrite à la
        BCE sous le numéro <strong>BE 0000.000.000</strong>, dont le siège social est situé à
        Bruxelles. La plateforme est accessible sur <a href="https://zaffa.be">zaffa.be</a>.
      </p>

      <h2>2. Objet de la plateforme</h2>
      <p>
        zaffa met en relation des couples souhaitant organiser leur mariage avec des
        prestataires (salles de réception, traiteurs, photographes, ziana, hennaya, groupes
        de nachid, etc.). zaffa n'est pas partie aux contrats signés entre un couple et un
        prestataire : nous facilitons la découverte et la prise de contact.
      </p>

      <h2>3. Compte utilisateur</h2>
      <p>
        Vous devez être âgé·e de 18 ans ou plus pour créer un compte. Les informations que
        vous fournissez doivent être exactes et tenues à jour. Vous êtes responsable de la
        confidentialité de votre mot de passe.
      </p>

      <h2>4. Contenu publié</h2>
      <p>
        Les avis, photos et messages que vous publiez restent votre propriété, mais vous nous
        accordez une licence mondiale et non exclusive pour les afficher sur zaffa. Vous vous
        engagez à ne publier aucun contenu illicite, diffamatoire, discriminatoire ou
        contrefaisant.
      </p>
      <ul>
        <li>Les avis doivent refléter une expérience réelle ;</li>
        <li>Les photos ne peuvent pas identifier une personne sans son accord ;</li>
        <li>La publicité déguisée et les faux avis entraînent la suppression du compte.</li>
      </ul>

      <h2>5. Rôle des professionnels</h2>
      <p>
        Les professionnels listés sont responsables de l'exactitude de leurs fiches (prix,
        capacité, politique, photos). Ils s'engagent à répondre aux demandes dans un délai
        raisonnable et à honorer les devis acceptés.
      </p>

      <h2>6. Responsabilité</h2>
      <p>
        zaffa ne garantit ni la disponibilité d'une salle, ni l'exécution d'une prestation.
        Tout litige relatif à une prestation doit être résolu entre le couple et le
        prestataire concerné. zaffa peut cependant intervenir en médiation sur demande.
      </p>

      <h2>7. Suspension et résiliation</h2>
      <p>
        Nous pouvons suspendre ou supprimer un compte en cas de violation des présentes
        conditions, de fraude, ou de comportement abusif. Vous pouvez supprimer votre compte
        à tout moment depuis votre profil.
      </p>

      <h2>8. Droit applicable</h2>
      <p>
        Les présentes conditions sont régies par le droit belge. Tout litige sera porté
        devant les tribunaux de l'arrondissement judiciaire de Bruxelles, francophone.
      </p>

      <h2>9. Nous contacter</h2>
      <p>
        Pour toute question : <a href="mailto:legal@zaffa.be">legal@zaffa.be</a>.
      </p>
    </>
  );
}
