import { inject } from '@angular/core';
import { CanMatchFn, Router, Routes } from '@angular/router';
import { Capacitor } from '@capacitor/core';

const legacyMobileRoutes = [
  'login',
  'forgot-password',
  'reset-password',
  'change-password',
  'profile',
  'tabs',
  'planning',
  'scan-qr',
  'historique',
  'cahier-textes',
  'honoraires',
];

const webAdminOnlyGuard: CanMatchFn = () => {
  if (Capacitor.isNativePlatform()) {
    return inject(Router).parseUrl('/mobile/login');
  }

  return true;
};

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./entry-redirect.component').then((m) => m.EntryRedirectComponent),
  },
  {
    path: 'mobile',
    loadChildren: () =>
      import('./mobile-teacher/mobile-teacher.routes').then(
        (m) => m.mobileTeacherRoutes,
      ),
  },
  {
    path: 'web',
    canMatch: [webAdminOnlyGuard],
    loadChildren: () =>
      import('./web-admin/web-admin.routes').then((m) => m.webAdminRoutes),
  },
  ...legacyMobileRoutes.map((path) => ({
    path,
    redirectTo: `mobile/${path}`,
    pathMatch: 'prefix' as const,
  })),
];
