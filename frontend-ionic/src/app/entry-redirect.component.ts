import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { AuthService } from './core/services/auth.service';
import { AuthService as WebAdminAuthService } from './web-admin/core/services/auth.service';
import { ServerDiscoveryService } from './core/services/server-discovery.service';

@Component({
  selector: 'app-entry-redirect',
  standalone: true,
  template: '',
})
export class EntryRedirectComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly webAdminAuthService = inject(WebAdminAuthService);
  private readonly serverDiscovery = inject(ServerDiscoveryService);

  async ngOnInit(): Promise<void> {
    const isAuthenticated = await this.authService.isAuthenticated();

    // Sur plateforme native (APK mobile), on va toujours sur le mobile.
    if (Capacitor.isNativePlatform()) {
      if (isAuthenticated) {
        await this.serverDiscovery.autoDetect();
        void this.router.navigateByUrl('/mobile/tabs/tabs/tab1', { replaceUrl: true });
      } else {
        void this.router.navigateByUrl('/mobile/login', { replaceUrl: true });
      }
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
    if (typeof sessionStorage === 'undefined') {
      return null;
    }

    const storedUser = sessionStorage.getItem('user');
    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch {
      sessionStorage.removeItem('user');
      return null;
    }
  }
}