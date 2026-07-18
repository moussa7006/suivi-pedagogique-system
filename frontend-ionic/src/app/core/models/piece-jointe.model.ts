import { TypePieceJointe } from './enums';

export interface PieceJointe {
  id?: number;
  urlChemin: string;
  type: TypePieceJointe;
  ficheProgressionId: number;
}
