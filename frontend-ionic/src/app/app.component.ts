import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Platform } from '@ionic/angular';
import { App as CapacitorApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  hasScrolled = false;

  constructor(
    private readonly platform: Platform,
    private readonly router: Router,
  ) {}

  @HostListener('window:scroll')
onWindowScroll(): void {
  this.hasScrolled = window.scrollY > 0;
}

  ngOnInit(): void {
    void this.configureStatusBar();
    void this.configureAndroidBackButton();
  }


  private async configureStatusBar(): Promise<void> {
    try {
      await StatusBar.setOverlaysWebView({ overlay: false });
      await StatusBar.setStyle({ style: Style.Light });
      await StatusBar.setBackgroundColor({ color: '#f8f9fa' });
    } catch {
      // Le plugin StatusBar n'est pas disponible dans le navigateur.
    }
  }

  private configureAndroidBackButton(): void {
    // Priorité élevée : consomme le bouton retour avant le WebView/Ionic.
    // Ainsi, un retour ne peut jamais dépiler l'historique jusqu'au login.
    this.platform.backButton.subscribeWithPriority(10000, async () => {
      const currentUrl = this.router.url.split('?')[0];

      if (this.isMenuUrl(currentUrl)) {
        // Depuis l'accueil, le retour ferme l'application sans déconnecter l'utilisateur.
        await CapacitorApp.exitApp();
        return;
      }

      if (currentUrl === '/mobile/login' || currentUrl === '/login') {
        return;
      }

      if (this.isSecondaryTabUrl(currentUrl)) {
        await this.router.navigateByUrl('/mobile/tabs/tabs/tab1', {
          replaceUrl: true,
        });
        return;
      }

      if (this.isPublicAuthUrl(currentUrl)) {
        await this.router.navigateByUrl('/mobile/login', { replaceUrl: true });
        return;
      }

      await this.router.navigateByUrl('/mobile/tabs/tabs/tab1', {
        replaceUrl: true,
      });
    });
  }

  private isSecondaryTabUrl(url: string): boolean {
    return (
      url === '/mobile/tabs/tabs/tab2' ||
      url === '/mobile/tabs/tabs/tab3' ||
      url === '/tabs/tabs/tab2' ||
      url === '/tabs/tabs/tab3'
    );
  }

  private isMenuUrl(url: string): boolean {
    return (
      url === '/mobile/tabs' ||
      url === '/mobile/tabs/tabs' ||
      url === '/mobile/tabs/tabs/tab1' ||
      url === '/tabs' ||
      url === '/tabs/tabs' ||
      url === '/tabs/tabs/tab1'
    );
  }

  private isPublicAuthUrl(url: string): boolean {
    return (
      url === '/mobile/forgot-password' ||
      url === '/mobile/reset-password' ||
      url === '/forgot-password' ||
      url === '/reset-password'
    );
  }

}