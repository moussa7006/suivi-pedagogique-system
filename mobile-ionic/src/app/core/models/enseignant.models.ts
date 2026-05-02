export interface SeanceDto {
  id: number;
  cours?: string;
  nomCours?: string;
  matiere?: string;
  salle?: string;
  dateDebut?: string;
  dateFin?: string;
  heureDebut?: string;
  heureFin?: string;
  typeSeance?: string;
}

export interface CahierDeTexteDto {
  id: number;
  titreCours?: string;
  contenu?: string;
  pieceJointe?: string;
  statutValidite?: string;
  dateSoumission?: string;
}

export interface CahierDeTexteRequest {
  titreCours: string;
  contenu: string;
  pieceJointe?: string;
}

export interface EmargementRequest {
  tokenQRCode: string;
  latitudeGPS: string;
  longitudeGPS: string;
}
