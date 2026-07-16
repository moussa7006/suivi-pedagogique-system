import { Component, EnvironmentInjector, inject, ViewChild, AfterViewInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  grid,
  calendarOutline,
  bookOutline,
  person,
  cashOutline,
  timeOutline,
  checkmarkDone,
} from 'ionicons/icons';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [CommonModule, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsPage implements AfterViewInit {
  public environmentInjector = inject(EnvironmentInjector);
  private readonly router = inject(Router);
  private readonly ngZone = inject(NgZone);

  @ViewChild(IonTabs) tabs!: IonTabs;

  activeTab = 0;

  private readonly tabList = ['tab1', 'tab2', 'tab3'];

  constructor() {
    addIcons({
      grid,
      calendarOutline,
      bookOutline,
      cashOutline,
      person,
      timeOutline,
      checkmarkDone,
    });
  }

  ngAfterViewInit(): void {
    // Methode 1 : ionTabsDidChange (event natif Ionic)
    this.tabs.ionTabsDidChange.subscribe((event) => {
      const idx = this.tabList.indexOf(event.tab);
      if (idx >= 0) {
        this.activeTab = idx;
      }
    });

    // Methode 2 : Router events (fallback robuste)
    this.ngZone.runOutsideAngular(() => {
      this.router.events
        .pipe(
          filter((e): e is NavigationEnd => e instanceof NavigationEnd),
          map(() => this.router.url),
        )
        .subscribe((url) => {
          const tab = this.tabList.find((t) => url.includes(`/tabs/${t}`));
          if (tab) {
            const idx = this.tabList.indexOf(tab);
            this.ngZone.run(() => {
              this.activeTab = idx;
            });
          }
        });
    });

    // Initialiser le tab actif au chargement
    setTimeout(() => {
      const currentUrl = this.router.url;
      const tab = this.tabList.find((t) => currentUrl.includes(`/tabs/${t}`));
      if (tab) {
        this.activeTab = this.tabList.indexOf(tab);
      }
    }, 100);
  }
}
