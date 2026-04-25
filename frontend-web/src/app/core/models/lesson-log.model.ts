export interface LessonLog {
  id?: number;
  titreCours?: string;
  contenu?: string;
  dateCreation?: string;
  pieceJointe?: string;
  statutValidite?: string; // "En attente", "Validé", "Rejeté"

  // Champs ajoutés par le DTO pour l'affichage
  enseignantNomPrenom?: string;
  matiereLibelle?: string;
  dateSeance?: string;
  heureSeance?: string;
  seanceId?: number;
}
