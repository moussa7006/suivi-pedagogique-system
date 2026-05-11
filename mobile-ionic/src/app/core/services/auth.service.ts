import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, tap } from "rxjs";
import { environment } from "../../../environments/environment";
import { LoginRequest, LoginResponse } from "../models/auth.models";
import { TokenStorageService } from "./token-storage.service";

@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly tokenStorage = inject(TokenStorageService);
  private readonly authApiUrl = `${environment.apiBaseUrl}/auth`;

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.authApiUrl}/login`, credentials)
      .pipe(
        tap((response) => {
          this.tokenStorage.setToken(response.token);
          this.setUser(response);
        }),
      );
  }

  changePassword(newPassword: string): Observable<any> {
    return this.http.post(`${this.authApiUrl}/change-password`, { newPassword });
  }

  isAuthenticated(): boolean {
    return !!this.tokenStorage.getToken();
  }

  // Gestion du token
  setToken(token: string): void {
    this.tokenStorage.setToken(token);
  }

  getToken(): string | null {
    return this.tokenStorage.getToken();
  }

  // Gestion de l'utilisateur
  setUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        return JSON.parse(user);
      } catch {
        return null;
      }
    }
    return null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    this.tokenStorage.clearToken();
    localStorage.removeItem('user');
    void this.router.navigate(['/login']);
  }
}
