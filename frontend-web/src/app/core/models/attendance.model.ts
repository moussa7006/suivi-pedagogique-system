import { StatutEmargement } from './enums';

export interface Emargement {
  id?: number;
  dateHeureScan: string;
  latitude: number;
  longitude: number;
  adresseApproximative: string;
  statut: StatutEmargement;
  enseignantNomPrenom?: string;
  lieu?: string;
  heureSeance?: string;
}

export interface EmargementRequest {
  tokenQRCode: string;
  latitude: number;
  longitude: number;
  adresseApproximative: string;
}
