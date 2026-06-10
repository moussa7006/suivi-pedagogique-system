export type Role = 'ADMINISTRATEUR' | 'ENSEIGNANT';
export type StatutSeance = 'PREVUE' | 'EN_COURS' | 'TERMINEE';
export type StatutEmargement = 'EN_ATTENTE_FICHE' | 'VALIDE' | 'HORS_PERIMETRE' | 'JUSTIFIE';
export type TypeRecurrence = 'UNIQUE' | 'HEBDOMADAIRE' | 'MENSUEL';
export type JourSemaine =
  | 'LUNDI'
  | 'MARDI'
  | 'MERCREDI'
  | 'JEUDI'
  | 'VENDREDI'
  | 'SAMEDI'
  | 'DIMANCHE';
export type TypeAbsence = 'RETARD' | 'ABSENCE';
export type TypePieceJointe = 'COURS' | 'EXERCICE' | 'EVALUATION';
