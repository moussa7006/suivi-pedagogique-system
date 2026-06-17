import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const user = localStorage.getItem('user');
  const isAuthEndpoint =
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/forgot-password') ||
    req.url.includes('/auth/reset-password');

  const logoutBecauseTokenIsInvalid = () => {
    console.warn('[Auth] Token invalide ou expiré. Réponse laissée à la page courante.');
  };

  const handleUnauthorizedResponse = (error: unknown) => {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 401 && !isAuthEndpoint) {
        logoutBecauseTokenIsInvalid();
      }
    }

    return throwError(() => error);
  };

  if (isAuthEndpoint) {
    return next(req).pipe(catchError(handleUnauthorizedResponse));
  }

  if (user) {
    try {
      const parsedUser = JSON.parse(user);
      if (parsedUser && parsedUser.token) {
        const clonedRequest = req.clone({
          setHeaders: {
            Authorization: `Bearer ${parsedUser.token}`,
          },
        });
        return next(clonedRequest).pipe(catchError(handleUnauthorizedResponse));
      } else {
        console.warn('[Auth] Token manquant dans le stockage.');
      }
    } catch (e) {
      console.error('[Auth] Erreur lors du parsing du token:', e);
    }
  }

  return next(req).pipe(catchError(handleUnauthorizedResponse));
};
