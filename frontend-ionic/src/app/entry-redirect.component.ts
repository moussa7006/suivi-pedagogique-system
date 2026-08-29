import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { AuthService } from './core/services/auth.service';
import { AuthService as WebAdminAuthService } from './web-admin/core/services/auth.service';
import { ServerDiscoveryService } from './core/services/server-discovery.service';

@Component({
  selector: 'app-entry-redirect',
  standalone: true,
  template: `
    <main class="entry-loading" role="status" aria-live="polite">
      <div class="entry-loading__logo">EduTrack</div>
      <div class="entry-loading__spinner"></div>
      <p>Ouverture de l’application…</p>
    </main>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; }
    .entry-loading { display: grid; min-height: 100vh; place-content: center; justify-items: center; gap: 16px; color: #0f4272; background: #ffffff; font-family: Arial, sans-serif; }
    .entry-loading__logo { font-size: 2rem; font-weight: 800; letter-spacing: .02em; }
    .entry-loading__spinner { width: 28px; height: 28px; border: 3px solid #dbeafe; border-top-color: #1868ab; border-radius: 50%; animation: entry-spin .8s linear infinite; }
    .entry-loading p { margin: 0; color: #60758a; font-size: .9rem; }
    @keyframes entry-spin { to { transform: rotate(360deg); } }
  `]
})
export class EntryRedirectComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly webAdminAuthService = inject(WebAdminAuthService);
  private readonly serverDiscovery = inject(ServerDiscoveryService);

  async ngOnInit(): Promise<void> {
    try {
      const isAuthenticated = await this.withTimeout(
        this.authService.isAuthenticated(),
        2500,
        false,
      );

      // Sur plateforme native (APK mobile), la page login doit s’afficher
      // sans attendre la détection du serveur local.
      if (Capacitor.isNativePlatform()) {
        if (isAuthenticated) {
          void this.serverDiscovery.autoDetect();
          await this.router.navigateByUrl('/mobile/tabs/tabs/tab1', {
            replaceUrl: true,
          });
        } else {
          await this.router.navigateByUrl('/mobile/login', {
            replaceUrl: true,
          });
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

      await this.router.navigateByUrl('/web/login', { replaceUrl: true });
    } catch {
      // L’entrée ne doit jamais rester blanche, même si le stockage local ou
      // le routeur rencontre une erreur au démarrage.
      await this.router.navigateByUrl('/mobile/login', { replaceUrl: true });
    }
  }

  private async withTimeout<T>(promise: Promise<T>, timeoutMs: number, fallback: T): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((resolve) => setTimeout(() => resolve(fallback), timeoutMs)),
    ]);
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