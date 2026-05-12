import { StatutSeance } from "./enums";

export interface Seance {
  id?: number;
  dateCours: string;
  heureDebutReelle: string;
  heureFinReelle: string;
  salleId: number;
  qrCodeId?: number;
  qrCodeToken?: string;
  statut: StatutSeance;
  emploiDuTempsId: number;
  enseignantId: number;
  classeId: number;
  emargementId?: number;
  ficheProgressionId?: number;
}
