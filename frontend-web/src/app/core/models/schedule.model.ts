import { Classe } from './classe.model';
import { Matiere } from './matiere.model';
import { Teacher } from './teacher.model';

export type TypeRecurrence = 'HEBDOMADAIRE' | 'MENSUEL' | 'UNIQUE';

export interface EmploiDuTemps {
  id?: number;
  titre?: string;
  typeRecurrence?: TypeRecurrence;
  dateDebutValidite?: string;
  dateFinValidite?: string;
  jourDeSemaine?: string;
  jourDuMois?: number;
  dateSpecifique?: string;
  heureDebut?: string;
  heureFin?: string;
  salle?: string;
  classe?: Classe;
  matiere?: Matiere;
  enseignant?: Teacher;
  statut?: boolean; // Optionnel sur le front
}

export interface Seance {
  id?: number;
  date?: string;
  heureDebut?: string;
  heureFin?: string;
  salle?: string;
  tokenQRCode?: string;
  enseignant?: Teacher;
  classe?: Classe;
  matiere?: Matiere;
  emploiDuTemps?: EmploiDuTemps;
}
