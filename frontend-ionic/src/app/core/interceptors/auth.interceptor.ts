import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { from, switchMap } from 'rxjs';
import { TokenStorageService } from '../services/token-storage.service';
import { ApiConfigService } from '../services/api-config.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenStorage = inject(TokenStorageService);
  const apiConfig = inject(ApiConfigService);
  const router = inject(Router);

  // Fallback pour les URLs encore construites depuis environment.apiBaseUrl.
  const customApiUrl = apiConfig.getCustomApiBaseUrl();
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
      const webAdminToken = getWebAdminToken();
      const isWebAdminRoute = router.url.startsWith('/web');
      const authToken = isWebAdminRoute ? webAdminToken || token : token || webAdminToken;

      if (!authToken) {
        return next(finalReq);
      }

      const authReq = finalReq.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      return next(authReq);
    }),
  );
};

function getWebAdminToken(): string | null {
  if (typeof localStorage === 'undefined') {
    return null;
  }

  const storedUser = localStorage.getItem('user');
  if (!storedUser) {
    return null;
  }

  try {
    const parsedUser = JSON.parse(storedUser) as { token?: string };
    return parsedUser.token || null;
  } catch {
    return null;
  }
}
