import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { StatusBar, Style } from '@capacitor/status-bar';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit, OnDestroy {
  hasScrolled = false;

  private observer?: MutationObserver;
  private readonly listeners: Array<() => void> = [];

  constructor(private readonly ngZone: NgZone) {}

  ngOnInit(): void {
    void this.configureStatusBar();

    this.ngZone.runOutsideAngular(() => {
      this.attachScrollListeners();
      this.observer = new MutationObserver(() => this.attachScrollListeners());
      this.observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.listeners.forEach((remove) => remove());
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

  private attachScrollListeners(): void {
    const contents = Array.from(document.querySelectorAll('ion-content'));

    contents.forEach((content) => {
      if ((content as HTMLElement).dataset['scrollBlurAttached'] === 'true') {
        return;
      }

      (content as HTMLElement).dataset['scrollBlurAttached'] = 'true';
      content.setAttribute('scroll-events', 'true');
      (content as HTMLIonContentElement).scrollEvents = true;

      const onScroll = (event: Event) => {
        const detail = (event as CustomEvent<{ scrollTop?: number }>).detail;
        this.setHasScrolled((detail?.scrollTop || 0) > 4);
      };

      content.addEventListener('ionScroll', onScroll as EventListener);
      this.listeners.push(() =>
        content.removeEventListener('ionScroll', onScroll as EventListener),
      );
    });
  }

  private setHasScrolled(value: boolean): void {
    if (this.hasScrolled === value) {
      return;
    }

    this.ngZone.run(() => {
      this.hasScrolled = value;
    });
  }
}
