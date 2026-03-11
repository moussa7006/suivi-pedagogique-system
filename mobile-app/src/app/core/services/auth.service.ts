import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

export interface User {
  id: number;
  username: string;
  fullName: string;
  role: 'TEACHER';
  matricule: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser = this.currentUserSubject.asObservable();

  constructor() {
    const savedUser = localStorage.getItem('teacher_user');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(credentials: any): Observable<User> {
    // On simule une connexion enseignant avec un délai "Pro"
    return of({
      id: 101,
      username: 'dr_alou',
      fullName: 'Dr. Alou Diarra',
      role: 'TEACHER' as const,
      matricule: 'M001',
      token: 'fake-mobile-jwt-' + Math.random().toString(36).substring(7)
    }).pipe(
      delay(1200), // Effet de chargement réaliste
      tap(user => {
        localStorage.setItem('teacher_user', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  logout() {
    localStorage.removeItem('teacher_user');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }
}
