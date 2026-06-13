import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const user = localStorage.getItem('user');

  const handleUnauthorizedResponse = (error: unknown) => {
    if (error instanceof HttpErrorResponse) {
      const isAuthError = error.status === 401 || error.status === 403;
      const isNotLoginPage = !req.url.includes('/auth/login');

      // Vérifier si le token existe encore en localStorage
      const currentUser = localStorage.getItem('user');
      let hasValidToken = false;
      try {
        if (currentUser) {
          const parsed = JSON.parse(currentUser);
          hasValidToken = !!(parsed && parsed.token);
        }
      } catch {
        hasValidToken = false;
      }

      // Ne déconnecter QUE si le token n'existe plus ou est invalide
      if (isAuthError && isNotLoginPage && !hasValidToken) {
        console.warn('[Auth] Token invalide ou expiré, déconnexion.');
        localStorage.removeItem('user');
        router.navigate(['/login']);
      } else if (isAuthError && isNotLoginPage && hasValidToken) {
        // Token présent mais erreur 401 - problème temporaire, on ne déconnecte PAS
        console.warn('[Auth] Erreur 401 avec token présent - tentative de récupération...');
        // Petite tentative : on renvoie l'erreur sans déconnecter
        // L'utilisateur pourra réessayer
      }
    }

    return throwError(() => error);
  };

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
        // Token manquant dans le localStorage : on le nettoie
        console.warn('[Auth] Token manquant dans le stockage, nettoyage...');
        localStorage.removeItem('user');
        router.navigate(['/login']);
      }
    } catch (e) {
      console.error('[Auth] Erreur lors du parsing du token:', e);
      localStorage.removeItem('user');
    }
  }

  return next(req).pipe(catchError(handleUnauthorizedResponse));
};
