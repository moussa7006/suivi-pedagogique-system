export interface SeanceDto {
  id: number;
  dateCours: string; // LocalDate is serialized as YYYY-MM-DD
  heureDebutReelle: string; // LocalTime is serialized as HH:MM:SS
  heureFinReelle: string;
  salleId?: number;
  qrCodeId?: number;
  qrCodeToken?: string;
  statut?: string; // Enum StatutSeance
  emploiDuTempsId?: number;
  enseignantId?: number;
  classeId?: number;
  emargementId?: number;
  ficheProgressionId?: number;
}

export interface FicheProgressionDto {
  id: number;
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
  contenuDetaille: string;
  objectifs: string;
  travaux: string;
}

export interface EmploiDuTempsDto {
  id: number;
  titre: string;
  typeRecurrence: string;
  dateDebutValidite?: string;
  dateFinValidite?: string;
  jourSemaine?: string;
  jourDuMois?: number;
  dateSpecifique?: string;
  heureDebut: string;
  heureFin: string;
  salleId?: number;
  enseignantId?: number;
  classeId?: number;
  matiereId?: number;
  anneeUniversitaireId?: number;
}

export interface EmargementRequest {
  tokenQRCode: string;
  latitudeGPS?: string;
  longitudeGPS?: string;
}
