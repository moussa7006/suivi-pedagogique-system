import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap } from 'rxjs';
import { TokenStorageService } from '../services/token-storage.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenStorage = inject(TokenStorageService);

  // Remplacement dynamique de l'IP du serveur
  const customApiUrl = localStorage.getItem('custom_api_url');
  let finalReq = req;

  // On importe l'environnement dynamiquement pour éviter un conflit circulaire, ou on peut utiliser une regex simple
  // Si req.url commence par http, on essaie de le remplacer
  if (customApiUrl && req.url.includes('/api/')) {
    const urlParts = req.url.split('/api/');
    finalReq = req.clone({
      url: `${customApiUrl}/${urlParts[1]}`,
    });
  }

  return from(tokenStorage.getToken()).pipe(
    switchMap((token) => {
      if (!token) {
        return next(finalReq);
      }

      const authReq = finalReq.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });

      return next(authReq);
    }),
  );
};
