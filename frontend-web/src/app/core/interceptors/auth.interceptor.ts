import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const user = localStorage.getItem('user');

  const handleUnauthorizedResponse = (error: unknown) => {
    if (
      error instanceof HttpErrorResponse &&
      (error.status === 401 || error.status === 403) &&
      !req.url.includes('/auth/login')
    ) {
      localStorage.removeItem('user');
      router.navigate(['/login']);
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
      }
    } catch (e) {
      console.error('Erreur lors du parsing du token:', e);
      localStorage.removeItem('user');
    }
  }

  return next(req).pipe(catchError(handleUnauthorizedResponse));
};
