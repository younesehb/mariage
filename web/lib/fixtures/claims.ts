export interface ClaimRequest {
  id: string;
  subjectType: "venue" | "vendor";
  subjectId: string;
  claimantName: string;
  claimantEmail: string;
  claimantRole: string;
  proofText: string;
  proofFileName: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
}

export const claimRequests: ClaimRequest[] = [
  {
    id: "cl-1",
    subjectType: "venue",
    subjectId: "v-salle-atlas",
    claimantName: "Mohamed Ouazzani",
    claimantEmail: "m.ouazzani@atlas-salle.be",
    claimantRole: "Propriétaire",
    proofText:
      "Je suis propriétaire depuis 2019. Bail commercial et BCE enregistrés à mon nom. Joint pièce d'identité + contrat.",
    proofFileName: "bail_commercial_atlas.pdf",
    status: "pending",
    submittedAt: "2026-04-20T09:00:00Z",
  },
  {
    id: "cl-2",
    subjectType: "vendor",
    subjectId: "h-sara-henna",
    claimantName: "Sara El-Amrani",
    claimantEmail: "sara@hennaart.be",
    claimantRole: "Prestataire indépendante",
    proofText:
      "Je suis Sara, hennaya indépendante. Numéro BCE et carte d'entreprise disponibles sur demande.",
    proofFileName: "bce_sara.pdf",
    status: "pending",
    submittedAt: "2026-04-21T15:20:00Z",
  },
  {
    id: "cl-3",
    subjectType: "venue",
    subjectId: "v-forest-manoir",
    claimantName: "Karim Tazi",
    claimantEmail: "karim@forest-manoir.be",
    claimantRole: "Responsable événements",
    proofText: "Chargé des réservations, autorisé par la propriétaire.",
    proofFileName: "autorisation.pdf",
    status: "pending",
    submittedAt: "2026-04-19T11:45:00Z",
  },
];
