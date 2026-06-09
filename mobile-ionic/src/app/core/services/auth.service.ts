import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Preferences } from "@capacitor/preferences";
import { Observable, from, map, switchMap } from "rxjs";
import { environment } from "../../../environments/environment";
import { LoginRequest, LoginResponse } from "../models/auth.models";
import { TokenStorageService } from "./token-storage.service";

@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly tokenStorage = inject(TokenStorageService);
  private readonly authApiUrl = `${environment.apiBaseUrl}/auth`;
  private readonly userKey = "auth_user";

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.authApiUrl}/login`, credentials)
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

  changePassword(newPassword: string): Observable<any> {
    return this.http.post(`${this.authApiUrl}/change-password`, {
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
    void this.router.navigate(["/login"]);
  }
}
