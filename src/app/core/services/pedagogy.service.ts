import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LessonLog } from '../models/lesson-log.model';

@Injectable({
  providedIn: 'root'
})
export class PedagogyService {
  private logs: LessonLog[] = [
    { 
      id: 1, teacherName: 'Dr. Alou Diarra', subject: 'Algorithmique', date: '2026-03-10', 
      startTime: '08:00', endTime: '10:00', chapter: 'Chapitre 3 : Les Arbres', 
      content: 'Étude des arbres binaires de recherche et parcours (Infixe, Préfixe).', 
      status: 'En attente' 
    },
    { 
      id: 2, teacherName: 'K. Barry', subject: 'Mathématiques', date: '2026-03-10', 
      startTime: '10:30', endTime: '12:30', chapter: 'Probabilités', 
      content: 'Variables aléatoires discrètes et loi de Bernoulli.', 
      status: 'Validé' 
    },
    { 
      id: 3, teacherName: 'F. Coulibaly', subject: 'Informatique', date: '2026-03-09', 
      startTime: '14:00', endTime: '16:00', chapter: 'SQL Avancé', 
      content: 'Les jointures externes et les sous-requêtes corrélées.', 
      status: 'En attente' 
    }
  ];

  getLessonLogs(): Observable<LessonLog[]> {
    return of(this.logs);
  }

  validateLog(id: number, status: 'Validé' | 'Rejeté') {
    const log = this.logs.find(l => l.id === id);
    if (log) log.status = status;
  }
}
