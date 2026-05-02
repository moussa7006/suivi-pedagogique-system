import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { TokenStorageService } from "../services/token-storage.service";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenStorage = inject(TokenStorageService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const isUnauthorized = error.status === 401;
      const isLoginEndpoint = req.url.includes("/auth/login");

      if (isUnauthorized && !isLoginEndpoint) {
        tokenStorage.clearToken();
        void router.navigate(["/login"]);
      }

      return throwError(() => error);
    }),
  );
};
