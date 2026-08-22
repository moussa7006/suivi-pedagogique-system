import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { Observable, firstValueFrom, from, map, switchMap } from 'rxjs';
import { ApiConfigService } from './api-config.service';
import { LoginRequest, LoginResponse } from '../models/auth.models';
import { TokenStorageService } from './token-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly tokenStorage = inject(TokenStorageService);
  private readonly apiConfig = inject(ApiConfigService);
  private readonly userKey = 'auth_user';

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(this.apiConfig.buildUrl('auth/login'), credentials)
      .pipe(
        switchMap((response) => {
          // Ne pas persister un eventuel photoUrl volumineux (data URL base64)
          // dans Capacitor Preferences pour eviter QuotaExceededError.
          const { photoUrl: _photoUrl, ...userToStore } = response as any;
          return from(
            Promise.all([
              this.tokenStorage.setToken(response.token),
              this.setUser(userToStore),
            ]),
          ).pipe(map(() => response));
        }),
      );
  }

  changePassword(
    currentPassword: string,
    newPassword: string,
  ): Observable<any> {
    return this.http.post(this.apiConfig.buildUrl('auth/change-password'), {
      currentPassword,
      newPassword,
    });
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(this.apiConfig.buildUrl('auth/forgot-password'), {
      email,
    });
  }

  resetPassword(
    email: string,
    code: string,
    newPassword: string,
  ): Observable<any> {
    return this.http.post(this.apiConfig.buildUrl('auth/reset-password'), {
      email,
      code,
      newPassword,
    });
  }

  getMe(): Observable<any> {
    return this.http.get<any>(this.apiConfig.buildUrl('auth/me'));
  }

  async isAuthenticated(validateAgainstServer = false): Promise<boolean> {
    const token = await this.tokenStorage.getToken();
    if (!token) {
      return false;
    }

    // Verifier l'expiration du token JWT cote client.
    // Si expire, on efface le token pour eviter qu'un utilisateur
    // avec une session stale soit redirige vers l'accueil au lieu
    // de la page de login.
    if (this.isTokenExpired(token)) {
      await this.tokenStorage.clearToken();
      await Preferences.remove({ key: this.userKey });
      return false;
    }

    // Validation serveur facultative : le token doit être réellement accepté
    // par /auth/me. Empêche l'accès avec une session trafiquée, révoquée ou
    // fabriquée côté client.
    if (validateAgainstServer) {
      try {
        await firstValueFrom(this.getMe());
        return true;
      } catch {
        await this.tokenStorage.clearToken();
        await Preferences.remove({ key: this.userKey });
        return false;
      }
    }

    return true;
  }

  /**
   * Decode le payload JWT et verifie la date d'expiration.
   * Retourne true si le token est absent ou expire.
   */
  private isTokenExpired(token: string): boolean {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return true;
      }
      // Le payload est la 2eme partie, encode en base64url
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      if (!payload || typeof payload.exp !== 'number') {
        return true;
      }
      // exp est en secondes ; on ajoute une marge de 10s pour eviter
      // les requetes au moment exact de l'expiration.
      const nowSec = Math.floor(Date.now() / 1000);
      return payload.exp <= nowSec + 10;
    } catch {
      return true;
    }
  }

  async setToken(token: string): Promise<void> {
    await this.tokenStorage.setToken(token);
  }

  getToken(): Promise<string | null> {
    return this.tokenStorage.getToken();
  }

  async setUser(user: any): Promise<void> {
    await Preferences.set({ key: this.userKey, value: JSON.stringify(user) });
  }

  async getUser(): Promise<any | null> {
    const result = await Preferences.get({ key: this.userKey });
    if (!result.value) {
      return null;
    }

    try {
      return JSON.parse(result.value);
    } catch {
      return null;
    }
  }

  isLoggedIn(): Promise<boolean> {
    return this.isAuthenticated();
  }

  async logout(): Promise<void> {
    await Promise.all([
      this.tokenStorage.clearToken(),
      Preferences.remove({ key: this.userKey }),
    ]);
    void this.router.navigateByUrl('/mobile/login', { replaceUrl: true });
  }
}
