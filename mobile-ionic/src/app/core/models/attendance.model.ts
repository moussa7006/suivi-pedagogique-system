import { StatutEmargement } from "./enums";

export interface EmargementRequest {
  tokenQRCode: string;
  latitude: number;
  longitude: number;
  adresseApproximative: string;
}

export interface Emargement {
  id?: number;
  dateHeureScan: string;
  latitude: number;
  longitude: number;
  adresseApproximative: string;
  statut: StatutEmargement;
  enseignantNomPrenom: string;
  lieu: string;
  heureSeance: string;
}

export interface EmargementScanResponse {
  message: string;
  statut: StatutEmargement;
  seanceId: number;
  emargementId: number;
}
