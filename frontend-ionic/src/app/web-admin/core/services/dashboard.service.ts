import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface DashboardData {
  totalTeachers: number;
  totalClasses: number;
  sessionsToday: number;
  pendingEmargements: number;
  totalMatieres: number;
  totalSeances: number;
  emargementsValides: number;
  tauxValidationGlobal: number;
  emargementsParJour: { [key: string]: number };
  seancesParStatut: { [key: string]: number };
  topEnseignants: TopEnseignantRow[];
  matieresVolumetrie: MatiereVolumetrieRow[];
  classesEmargement: ClasseEmargementRow[];
  recentSeances: RecentSeanceRow[];
}

export interface TopEnseignantRow {
  id: number;
  nom: string;
  matricule: string;
  specialite: string;
  seancesPlanifiees: number;
  emargementsValides: number;
  tauxValidation: number;
  statut: 'EXCELLENT' | 'MOYEN' | 'FAIBLE';
}

export interface MatiereVolumetrieRow {
  code: string;
  libelle: string;
  departement: string;
  volumeHoraireTotal: number;
  seancesPlanifiees: number;
  emargementsValides: number;
  tauxValidation: number;
}

export interface ClasseEmargementRow {
  libelle: string;
  filiere: string;
  niveau: string;
  seancesPlanifiees: number;
  emargementsValides: number;
  tauxValidation: number;
  statut: 'EXCELLENT' | 'MOYEN' | 'FAIBLE';
}

export interface RecentSeanceRow {
  id: number;
  dateCours: string;
  heureDebut: string;
  matiere: string;
  classe: string;
  enseignant: string;
  statut: string;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  getDashboardData(): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${this.apiUrl}/charts`);
  }
}
