import { TypeRecurrence, JourSemaine } from './enums';

export interface EmploiDuTemps {
  id?: number;
  titre?: string;
  typeRecurrence: TypeRecurrence;
  dateDebutValidite: string;
  dateFinValidite: string;
  jourSemaine?: JourSemaine;
  jourDuMois?: number;
  dateSpecifique?: string;
  heureDebut: string;
  heureFin: string;
  salleId: number;
  enseignantId: number;
  classeId: number;
  matiereId: number;
  anneeUniversitaireId: number;
}
