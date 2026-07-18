import { TypeAbsence } from './enums';

export interface Justificatif {
  id?: number;
  fichier: string;
  commentaire: string;
  typeAbsence: TypeAbsence;
  estValideAdmin: boolean;
  enseignantId: number;
  emargementId: number;
}
