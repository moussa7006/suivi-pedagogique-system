import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-entry-redirect',
  standalone: true,
  template: '',
})
export class EntryRedirectComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  async ngOnInit(): Promise<void> {
    const isAuthenticated = await this.authService.isAuthenticated();

    // Sur plateforme native (APK mobile), on va toujours sur le mobile.
    if (Capacitor.isNativePlatform()) {
      const target = isAuthenticated ? '/mobile/tabs/tabs/tab1' : '/mobile/login';
      void this.router.navigateByUrl(target, { replaceUrl: true });
      return;
    }

    // Sur navigateur (dev/test) :
    // - Si l'utilisateur est deja connecte en tant qu'admin -> web admin
    // - Sinon -> page de login mobile (valeur par defaut)
    // Le web admin reste accessible via /web/login directement.
    if (isAuthenticated) {
      const user = await this.authService.getUser();
      const role = (user?.role || '').toUpperCase();
      if (role === 'ADMIN' || role === 'ADMINISTRATEUR') {
        void this.router.navigateByUrl('/web/dashboard', { replaceUrl: true });
        return;
      }
      void this.router.navigateByUrl('/mobile/tabs/tabs/tab1', { replaceUrl: true });
      return;
    }

    void this.router.navigateByUrl('/mobile/login', { replaceUrl: true });
  }
}