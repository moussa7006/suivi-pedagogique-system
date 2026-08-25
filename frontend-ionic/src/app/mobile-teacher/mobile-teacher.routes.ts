import { Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth.guard';


export const mobileTeacherRoutes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    // La page doit rester accessible même avec une session mémorisée :
    // cela permet de se déconnecter ou de changer de compte sans écran blanc.
    path: 'login',
    loadComponent: () =>
      import('./login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./forgot-password/forgot-password.page').then(
        (m) => m.ForgotPasswordPage,
      ),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./reset-password/reset-password.page').then(
        (m) => m.ResetPasswordPage,
      ),
  },
  {
    path: 'change-password',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./change-password/change-password.page').then(
        (m) => m.ChangePasswordPage,
      ),
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./profile/profile.page').then((m) => m.ProfilePage),
  },
  {
    path: 'tabs',
    canActivate: [authGuard],
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'planning',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./planning/planning.page').then((m) => m.PlanningPage),
  },
  {
    path: 'scan-qr',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./scan-qr/scan-qr.page').then((m) => m.ScanQRPage),
  },
  {
    path: 'historique',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./historique/historique.page').then((m) => m.HistoriquePage),
  },
  {
    path: 'cahier-textes',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./cahier-textes/cahier-textes.page').then(
        (m) => m.CahierTextesPage,
      ),
  },
  {
    path: 'honoraires',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./honoraires/honoraires.page').then((m) => m.HonorairesPage),
  },
];
