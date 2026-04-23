import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales · zaffa",
  description: "Informations légales sur l'éditeur du site zaffa.",
};

export default function MentionsLegalesPage() {
  return (
    <>
      <h1>Mentions légales</h1>
      <p className="lede">
        Informations relatives à l'éditeur du site et à l'hébergement, conformément au
        Code de droit économique belge.
      </p>

      <h2>Éditeur</h2>
      <p>
        <strong>zaffa SRL</strong><br />
        Siège social : Bruxelles, Belgique<br />
        BCE : BE 0000.000.000<br />
        TVA : BE 0000.000.000<br />
        Email : <a href="mailto:contact@zaffa.be">contact@zaffa.be</a>
      </p>

      <h2>Directeur de la publication</h2>
      <p>Le représentant légal de zaffa SRL.</p>

      <h2>Hébergement</h2>
      <p>
        Le site est hébergé sur l'infrastructure de Vercel Inc., avec des serveurs
        localisés dans l'Union européenne.
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        La marque zaffa, le nom de domaine, la charte graphique, la base de données et le
        code source sont la propriété exclusive de zaffa SRL. Toute reproduction sans
        autorisation écrite est interdite.
      </p>
      <p>
        Les photos et avis publiés par les utilisateurs restent leur propriété ; ils nous
        en concèdent une licence d'affichage (voir <a href="/cgu">CGU</a>).
      </p>

      <h2>Signalement de contenu</h2>
      <p>
        Pour signaler un contenu illicite (article XII.19 CDE), écrivez à{" "}
        <a href="mailto:abuse@zaffa.be">abuse@zaffa.be</a> en précisant l'URL concernée,
        la nature du signalement et vos coordonnées.
      </p>

      <h2>Médiation</h2>
      <p>
        En cas de litige avec un prestataire, vous pouvez saisir gratuitement le Service
        de médiation pour le consommateur (<a href="https://mediationconsommateur.be">
        mediationconsommateur.be</a>).
      </p>
    </>
  );
}
