import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser = this.currentUserSubject.asObservable();

  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser?.token) {
          this.currentUserSubject.next(parsedUser);
        } else {
          localStorage.removeItem('user');
          this.currentUserSubject.next(null);
        }
      } catch {
        localStorage.removeItem('user');
        this.currentUserSubject.next(null);
      }
    }
  }

  login(credentials: any): Observable<any> {
    // Remplacement de la simulation par un véritable appel API
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((user) => {
        if (!user?.token) {
          throw new Error('Connexion impossible : aucun token JWT reçu du serveur.');
        }

        // Enregistrement de l'utilisateur ou du token renvoyé par l'API
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUserSubject.next(user);
      }),
    );
  }

  changePassword(newPassword: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/change-password`, { newPassword });
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  updateCurrentUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  isLoggedIn(): boolean {
    const currentUser = this.currentUserSubject.value;

    if (!currentUser?.token) {
      localStorage.removeItem('user');
      return false;
    }

    return true;
  }
}
