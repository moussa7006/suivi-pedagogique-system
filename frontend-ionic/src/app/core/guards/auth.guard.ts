import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { AuthService } from "../services/auth.service";

export const authGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (await authService.isAuthenticated(true)) {
    const user = await authService.getUser();
    if (user?.role === 'ENSEIGNANT') {
      return true;
    }
    // Non-enseignant (ex. administrateur) : on le déconnecte et on le redirige.
    await authService.logout();
    return router.parseUrl('/mobile/login');
  }

  return router.parseUrl("/mobile/login");
};
