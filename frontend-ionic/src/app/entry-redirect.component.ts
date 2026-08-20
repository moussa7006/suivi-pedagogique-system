import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { AuthService } from './core/services/auth.service';
import { AuthService as WebAdminAuthService } from './web-admin/core/services/auth.service';

@Component({
  selector: 'app-entry-redirect',
  standalone: true,
  template: '',
})
export class EntryRedirectComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly webAdminAuthService = inject(WebAdminAuthService);

  async ngOnInit(): Promise<void> {
    const isAuthenticated = await this.authService.isAuthenticated();

    // Sur plateforme native (APK mobile), on va toujours sur le mobile.
    if (Capacitor.isNativePlatform()) {
      const target = isAuthenticated ? '/mobile/tabs/tabs/tab1' : '/mobile/login';
      void this.router.navigateByUrl(target, { replaceUrl: true });
      return;
    }

    // Sur navigateur, l'interface web admin est l'entrée par défaut.
    // On vérifie le token (présence + expiration) et le rôle admin.
    const webUser = this.getWebAdminUser();
    const webRole = (webUser?.role || webUser?.user?.role || '').toUpperCase();
    const isWebAdmin =
      webRole === 'ADMIN' || webRole === 'ADMINISTRATEUR';

    if (isWebAdmin && this.webAdminAuthService.isLoggedIn()) {
      void this.router.navigateByUrl('/web/dashboard', { replaceUrl: true });
      return;
    }

    void this.router.navigateByUrl('/web/login', { replaceUrl: true });
  }

  private getWebAdminUser(): any | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch {
      localStorage.removeItem('user');
      return null;
    }
  }
}