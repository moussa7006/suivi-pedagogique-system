import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  const userString = localStorage.getItem('user');
  if (userString) {
    try {
      const user = JSON.parse(userString);
      const role = user?.user?.role || user?.role;
      if (role === 'ADMINISTRATEUR') {
        return true;
      }
    } catch (e) {
      // Ignorer l'erreur de parsing
    }
  }

  router.navigate(['/login']);
  return false;
};
