import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { Observable, from, map, switchMap } from 'rxjs';
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
        switchMap((response) =>
          from(
            Promise.all([
              this.tokenStorage.setToken(response.token),
              this.setUser(response),
            ]),
          ).pipe(map(() => response)),
        ),
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

  async isAuthenticated(): Promise<boolean> {
    return !!(await this.tokenStorage.getToken());
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
    // Recharger complètement l'application pour détruire toutes les instances
    // de composants en cache (pages tabs notamment). Sans cela, les données de
    // l'utilisateur précédent restent affichées après un nouveau login.
    if (typeof window !== 'undefined' && window.location) {
      window.location.href = '/login';
      return;
    }
    void this.router.navigate(['/login']);
  }
}
