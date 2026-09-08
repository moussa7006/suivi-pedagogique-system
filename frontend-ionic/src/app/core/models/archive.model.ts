import { AnneeUniversitaire } from './annee-universitaire.model';
import { Classe } from './classe.model';
import { Emargement } from './attendance.model';
import { EmploiDuTemps } from './schedule.model';
import { FicheProgression } from './fiche-progression.model';
import { Seance } from './seance.model';
import { DetailHonoraire } from './honoraires.model';

export interface ArchiveAnnee {
  annee: AnneeUniversitaire;
  classes: Classe[];
  emploisDuTemps: EmploiDuTemps[];
  seances: Seance[];
  emargements: Emargement[];
  fichesProgression: FicheProgression[];
  honoraires: DetailHonoraire[];
}
