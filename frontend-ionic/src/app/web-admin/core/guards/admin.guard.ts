import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  // Validation serveur : le token doit être accepté par /auth/me.
  // Empêche l'accès au dashboard avec une session trafiquée, expirée ou révoquée.
  // Le rôle confirmé vient du serveur (/auth/me), jamais du localStorage.
  const user = await authService.validateSession();
  if (!user) {
    router.navigate(['/web/login']);
    return false;
  }

  if (user?.role === 'ADMINISTRATEUR') {
    return true;
  }

  router.navigate(['/web/login']);
  return false;
};
