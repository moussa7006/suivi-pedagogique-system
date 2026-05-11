export enum Role {
  ADMINISTRATEUR = 'ADMINISTRATEUR',
  ENSEIGNANT = 'ENSEIGNANT'
}

export enum StatutSeance {
  PREVUE = 'PREVUE',
  EN_COURS = 'EN_COURS',
  TERMINEE = 'TERMINEE'
}

export enum StatutEmargement {
  VALIDE = 'VALIDE',
  HORS_PERIMETRE = 'HORS_PERIMETRE',
  JUSTIFIE = 'JUSTIFIE'
}

export enum TypeRecurrence {
  UNIQUE = 'UNIQUE',
  HEBDOMADAIRE = 'HEBDOMADAIRE',
  MENSUEL = 'MENSUEL'
}

export enum JourSemaine {
  LUNDI = 'LUNDI',
  MARDI = 'MARDI',
  MERCREDI = 'MERCREDI',
  JEUDI = 'JEUDI',
  VENDREDI = 'VENDREDI',
  SAMEDI = 'SAMEDI',
  DIMANCHE = 'DIMANCHE'
}

export enum TypeAbsence {
  RETARD = 'RETARD',
  ABSENCE = 'ABSENCE'
}

export enum TypePieceJointe {
  COURS = 'COURS',
  EXERCICE = 'EXERCICE',
  EVALUATION = 'EVALUATION'
}
