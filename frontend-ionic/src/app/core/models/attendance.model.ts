import { StatutEmargement } from './enums';

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

/** Corps de la requête de scan QR pour émargement */
export interface EmargementRequest {
  seanceId?: number;
  tokenQRCode: string;
  latitude: number;
  longitude: number;
  adresseApproximative: string;
}

/** Réponse retournée par le backend après un scan QR réussi */
export interface EmargementScanResponse {
  message: string;
  statut: StatutEmargement;
  seanceId: number;
  emargementId: number;
}
