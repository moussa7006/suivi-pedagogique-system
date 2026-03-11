import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Teacher } from '../models/teacher.model';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private teachers: Teacher[] = [
    { id: 1, firstName: 'Alou', lastName: 'Diarra', matricule: 'M001', email: 'alou.diarra@univ-mali.ml', department: 'Informatique', subjects: ['Algorithmique', 'Java'], status: 'Actif', avatar: 'https://i.pravatar.cc/150?u=alou' },
    { id: 2, firstName: 'Kadidia', lastName: 'Barry', matricule: 'M002', email: 'k.barry@univ-mali.ml', department: 'Mathématiques', subjects: ['Analyse 1', 'Probabilités'], status: 'Actif', avatar: 'https://i.pravatar.cc/150?u=kadidia' },
    { id: 3, firstName: 'Moussa', lastName: 'Traoré', matricule: 'M003', email: 'm.traore@univ-mali.ml', department: 'Physique', subjects: ['Thermodynamique'], status: 'En congé', avatar: 'https://i.pravatar.cc/150?u=moussa' },
    { id: 4, firstName: 'Fatim', lastName: 'Coulibaly', matricule: 'M004', email: 'f.coulibaly@univ-mali.ml', department: 'Informatique', subjects: ['Bases de données', 'SQL'], status: 'Actif', avatar: 'https://i.pravatar.cc/150?u=fatim' },
    { id: 5, firstName: 'Sekou', lastName: 'Keita', matricule: 'M005', email: 's.keita@univ-mali.ml', department: 'Droit', subjects: ['Droit Civil'], status: 'Inactif', avatar: 'https://i.pravatar.cc/150?u=sekou' },
  ];

  getTeachers(): Observable<Teacher[]> {
    return of(this.teachers);
  }

  getTeacherById(id: number): Observable<Teacher | undefined> {
    return of(this.teachers.find(t => t.id === id));
  }
}
