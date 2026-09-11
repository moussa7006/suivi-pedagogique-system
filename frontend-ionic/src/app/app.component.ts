import { Component, HostListener, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonApp,
  IonRouterOutlet,
  ToastController,
} from '@ionic/angular/standalone';
import { App as CapacitorApp } from '@capacitor/app';
import type { PluginListenerHandle } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit, OnDestroy {
  hasScrolled = false;
  private backButtonListener?: PluginListenerHandle;
  private lastLoginBackPress = 0;
  

  constructor(
    private readonly ngZone: NgZone,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly toastController: ToastController,
  ) {}

  @HostListener('window:scroll')
onWindowScroll(): void {
  this.hasScrolled = window.scrollY > 0;
}

  ngOnInit(): void {
    void this.configureStatusBar();
    void this.configureAndroidBackButton();
  }

  ngOnDestroy(): void {
    void this.backButtonListener?.remove();
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

  private async configureAndroidBackButton(): Promise<void> {
    this.backButtonListener = await CapacitorApp.addListener(
      'backButton',
      async () => {
        await this.ngZone.run(async () => {
          const currentUrl = this.router.url.split('?')[0];

          if (currentUrl === '/mobile/login' || currentUrl === '/login') {
            await this.exitAppAfterDoublePress();
            return;
          }

          if (this.isSecondaryTabUrl(currentUrl)) {
            await this.router.navigateByUrl('/mobile/tabs/tabs/tab1', {
              replaceUrl: true,
            });
            return;
          }

          if (this.isMenuUrl(currentUrl)) {
            await this.showAlreadyHomeToast();
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
      },
    );
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

  private async showAlreadyHomeToast(): Promise<void> {
    const toast = await this.toastController.create({
      message: 'Vous êtes déjà sur l’accueil.',
      duration: 1400,
      position: 'bottom',
      color: 'medium',
    });
    await toast.present();
  }

  private async exitAppAfterDoublePress(): Promise<void> {
    const now = Date.now();

    if (now - this.lastLoginBackPress < 1800) {
      await CapacitorApp.exitApp();
      return;
    }

    this.lastLoginBackPress = now;
    const toast = await this.toastController.create({
      message: 'Appuyez encore une fois pour quitter EduTrack.',
      duration: 1600,
      position: 'bottom',
      color: 'medium',
    });
    await toast.present();
  }
}
