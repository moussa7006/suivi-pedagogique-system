import { StatutSeance } from './enums';

export interface Seance {
  id?: number;
  dateCours: string;
  heureDebutReelle: string;
  heureFinReelle: string;
  salleId: number;
  qrCodeId?: number;
  statut: StatutSeance;
  emploiDuTempsId: number;
  enseignantId: number;
  classeId: number;
  emargementId?: number;
  ficheProgressionId?: number;
}
