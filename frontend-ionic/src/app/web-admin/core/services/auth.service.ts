import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser = this.currentUserSubject.asObservable();

  private apiUrl = `${environment.apiUrl}/auth`;

  // Clé utilisée pour stocker la session web-admin.
  // sessionStorage (et non localStorage) : la session survit au refresh de la
  // page mais est purgée à la fermeture du navigateur, ce qui exige une
  // reconnexion à chaque nouvelle ouverture.
  private static readonly STORAGE_KEY = 'user';

  constructor(private http: HttpClient) {
    const savedUser = this.readStoredUser();
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser?.token) {
          this.currentUserSubject.next(parsedUser);
        } else {
          this.clearStoredUser();
          this.currentUserSubject.next(null);
        }
      } catch {
        this.clearStoredUser();
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
        this.storeUser(user);
        this.currentUserSubject.next(user);
      }),
    );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/change-password`, { currentPassword, newPassword });
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(email: string, code: string, newPassword: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reset-password`, { email, code, newPassword });
  }

  logout() {
    this.clearStoredUser();
    this.currentUserSubject.next(null);
  }

  updateCurrentUser(user: any) {
    this.storeUser(user);
    this.currentUserSubject.next(user);
  }

  isLoggedIn(): boolean {
    const currentUser = this.currentUserSubject.value;

    if (!currentUser?.token) {
      this.clearStoredUser();
      return false;
    }

    // Vérifier l'expiration du token JWT côté client.
    // Un token expiré (session stale) ne doit pas donner accès au dashboard.
    if (this.isTokenExpired(currentUser.token)) {
      this.clearStoredUser();
      this.currentUserSubject.next(null);
      return false;
    }

    return true;
  }

  // --- Persistance session (sessionStorage) ---
  private readStoredUser(): string | null {
    return sessionStorage.getItem(AuthService.STORAGE_KEY);
  }

  private storeUser(user: any): void {
    sessionStorage.setItem(AuthService.STORAGE_KEY, JSON.stringify(user));
  }

  private clearStoredUser(): void {
    sessionStorage.removeItem(AuthService.STORAGE_KEY);
  }

  /**
   * Valide la session auprès du backend (endpoint /auth/me) et renvoie
   * l'utilisateur confirmé par le serveur (ou null si invalide). Contrairement à
   * isLoggedIn() qui ne vérifie que le localStorage côté client, cette méthode
   * vérifie que le token est réellement accepté par le serveur. Tout token
   * invalide, révoqué, expiré ou fabriqué est rejeté et la session est purgée.
   */
  async validateSession(): Promise<any | null> {
    const currentUser = this.currentUserSubject.value;

    if (!currentUser?.token) {
      this.logout();
      return null;
    }

    if (this.isTokenExpired(currentUser.token)) {
      this.logout();
      return null;
    }

    try {
      const user = await firstValueFrom(this.http.get<any>(`${this.apiUrl}/me`));
      return user;
    } catch {
      // Token rejeté par le serveur (401/expiré/révoqué/fabriqué).
      this.logout();
      return null;
    }
  }

  private isTokenExpired(token: string): boolean {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return true;
      }
      const payload = JSON.parse(
        atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')),
      );
      if (!payload || typeof payload.exp !== 'number') {
        return true;
      }
      const nowSec = Math.floor(Date.now() / 1000);
      return payload.exp <= nowSec + 10;
    } catch {
      return true;
    }
  }
}
