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
        }),
      );
  }

  isAuthenticated(): boolean {
    return !!this.tokenStorage.getToken();
  }

  logout(): void {
    this.tokenStorage.clearToken();
    void this.router.navigate(["/login"]);
  }
}
