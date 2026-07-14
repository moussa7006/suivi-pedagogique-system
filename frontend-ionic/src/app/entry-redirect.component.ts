import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-entry-redirect',
  standalone: true,
  template: '',
})
export class EntryRedirectComponent implements OnInit {
  private readonly router = inject(Router);

  ngOnInit(): void {
    const targetUrl = Capacitor.isNativePlatform() ? '/mobile/login' : '/web/login';

    void this.router.navigateByUrl(targetUrl, { replaceUrl: true });
  }
}
