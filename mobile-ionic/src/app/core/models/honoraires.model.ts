export type StatutHonoraire = "BROUILLON" | "VALIDE" | "PAYE" | "ANNULE";

export interface DetailHonoraire {
  id?: number;
  seanceId?: number;
  dateCours?: string;
  heureDebut?: string;
  heureFin?: string;
  enseignantNomPrenom?: string;
  classeLibelle?: string;
  niveauLibelle?: string;
  matiereLibelle?: string;
  nombreHeures?: number;
  tauxHoraire?: number;
  montant?: number;
}

export interface HonorairesCalcul {
  id?: number;
  mois?: string;
  enseignantId?: number;
  enseignantNomPrenom?: string;
  totalHeures?: number;
  montantBrut?: number;
  statut?: StatutHonoraire;
  dateCalcul?: string;
  dateValidation?: string;
  detailsHonoraires?: DetailHonoraire[];
}
