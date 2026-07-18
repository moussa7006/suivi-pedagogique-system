/** Fiche de progression (cahier de textes) pour une séance */
export interface FicheProgression {
  id?: number;
  dateSaisie: string;
  contenuDetaille: string;
  objectifs: string;
  travaux: string;
  estValideAdmin: boolean;
  dateValidation?: string;
  enseignantNomPrenom: string;
  matiereLibelle: string;
  dateSeance: string;
  heureSeance: string;
  seanceId: number;
}

/** Corps de la requête de création/édition d'une fiche de progression */
export interface FicheProgressionRequest {
  dateSaisie: string;
  contenuDetaille: string;
  objectifs: string;
  travaux: string;
}
