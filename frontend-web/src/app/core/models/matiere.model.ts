import { Classe } from './classe.model';

export interface Matiere {
  id?: number;
  codeMatiere?: string;
  libelle?: string;
  coefficient?: number;
  classes?: Classe[];
}
