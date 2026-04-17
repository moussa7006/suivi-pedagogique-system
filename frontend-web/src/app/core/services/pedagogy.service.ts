import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LessonLog, PieceJointe } from '../models/lesson-log.model';

@Injectable({
  providedIn: 'root',
})
export class PedagogyService {
  private logs: LessonLog[] = [
    {
      id: 1,
      titleCours: 'Les Arbres Binaires de Recherche',
      contenu:
        "Étude des arbres binaires de recherche et parcours (Infixe, Préfixe, Suffixe). Implémentation en C avec les pointeurs. Exercices sur l'insertion et la suppression de nœuds.",
      dateDeCreation: '2026-03-10',
      pieceJointe: {
        id: 1,
        nom: 'TD_Arbres_Binaires.pdf',
        type: 'application/pdf',
        taille: 245760,
        url: 'assets/attachments/td_arbres.pdf',
      },
      teacherName: 'Dr. Alou Diarra',
      subject: 'Algorithmique',
      status: 'En attente',
    },
    {
      id: 2,
      titleCours: 'Variables Aléatoires Discrètes',
      contenu:
        'Variables aléatoires discrètes et loi de Bernoulli. Espérance mathématique et variance. Applications aux probabilités conditionnelles.',
      dateDeCreation: '2026-03-10',
      pieceJointe: {
        id: 2,
        nom: 'Cours_Probabilités_Ch4.pdf',
        type: 'application/pdf',
        taille: 189440,
        url: 'assets/attachments/cours_proba_ch4.pdf',
      },
      teacherName: 'K. Barry',
      subject: 'Mathématiques',
      status: 'Validé',
    },
    {
      id: 3,
      titleCours: 'Jointures Externes et Sous-Requêtes',
      contenu:
        'Les jointures externes (LEFT JOIN, RIGHT JOIN, FULL JOIN) et les sous-requêtes corrélées. Exercices pratiques sur PostgreSQL avec des cas réels.',
      dateDeCreation: '2026-03-09',
      pieceJointe: null,
      teacherName: 'F. Coulibaly',
      subject: 'Informatique',
      status: 'En attente',
    },
    {
      id: 4,
      titleCours: 'Théorème de Bayes',
      contenu:
        'Théorème de Bayes et applications. Probabilités a priori et a posteriori. Exemples tirés de la médecine et du diagnostic industriel.',
      dateDeCreation: '2026-03-08',
      pieceJointe: {
        id: 4,
        nom: 'Exercices_Bayes.xlsx',
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        taille: 98304,
        url: 'assets/attachments/exercices_bayes.xlsx',
      },
      teacherName: 'K. Barry',
      subject: 'Mathématiques',
      status: 'Validé',
    },
    {
      id: 5,
      titleCours: 'Programmation Orientée Objet — Héritage',
      contenu:
        'Héritage simple et multiple en Java. Redéfinition et surcharge de méthodes. Classes abstraites et interfaces. Projet mini-application bancaire.',
      dateDeCreation: '2026-03-07',
      pieceJointe: {
        id: 5,
        nom: 'Projet_Bancaire_Spec.pdf',
        type: 'application/pdf',
        taille: 327680,
        url: 'assets/attachments/projet_bancaire.pdf',
      },
      teacherName: 'Dr. Alou Diarra',
      subject: 'Algorithmique',
      status: 'Rejeté',
      comments:
        'Le contenu ne correspond pas au programme de la semaine. Veuillez réviser le chapitre.',
    },
    {
      id: 6,
      titleCours: 'Réseaux — Modèle OSI',
      contenu:
        'Les 7 couches du modèle OSI. Comparaison avec le modèle TCP/IP. Analyse de trames avec Wireshark. Travaux pratiques de capture de paquets.',
      dateDeCreation: '2026-03-06',
      pieceJointe: null,
      teacherName: 'M. Traoré',
      subject: 'Réseaux',
      status: 'Validé',
    },
  ];

  getLessonLogs(): Observable<LessonLog[]> {
    return of(this.logs);
  }

  getLessonLogById(id: number): Observable<LessonLog | undefined> {
    const log = this.logs.find((l) => l.id === id);
    return of(log);
  }

  validateLog(id: number, status: 'Validé' | 'Rejeté', comments?: string): void {
    const log = this.logs.find((l) => l.id === id);
    if (log) {
      log.status = status;
      if (comments) {
        log.comments = comments;
      }
    }
  }

  addLessonLog(log: Omit<LessonLog, 'id'>): Observable<LessonLog> {
    const newId = this.logs.length > 0 ? Math.max(...this.logs.map((l) => l.id)) + 1 : 1;
    const newLog: LessonLog = { ...log, id: newId };
    this.logs.push(newLog);
    return of(newLog);
  }

  updateLessonLog(id: number, updates: Partial<LessonLog>): Observable<LessonLog | undefined> {
    const index = this.logs.findIndex((l) => l.id === id);
    if (index !== -1) {
      this.logs[index] = { ...this.logs[index], ...updates };
      return of(this.logs[index]);
    }
    return of(undefined);
  }

  deleteLessonLog(id: number): Observable<boolean> {
    const initialLength = this.logs.length;
    this.logs = this.logs.filter((l) => l.id !== id);
    return of(this.logs.length < initialLength);
  }

  /** Retourne les statistiques pour le tableau de bord */
  getStats(): Observable<{ total: number; enAttente: number; valide: number; rejete: number }> {
    const total = this.logs.length;
    const enAttente = this.logs.filter((l) => l.status === 'En attente').length;
    const valide = this.logs.filter((l) => l.status === 'Validé').length;
    const rejete = this.logs.filter((l) => l.status === 'Rejeté').length;
    return of({ total, enAttente, valide, rejete });
  }
}
