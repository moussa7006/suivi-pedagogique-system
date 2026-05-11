export interface FicheProgression {
  id?: number;
  dateSaisie: string;
  contenuDetaille: string;
  objectifs: string;
  travaux: string;
  estValideAdmin: boolean;
  dateValidation?: string;
  enseignantNomPrenom?: string;
  matiereLibelle?: string;
  dateSeance?: string;
  heureSeance?: string;
  seanceId?: number;
}

export interface FicheProgressionRequest {
  dateSaisie: string;
  contenuDetaille: string;
  objectifs: string;
  travaux: string;
}

export type { FicheProgression as LessonLog };
