import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LoginComponent } from './features/login/login.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./features/forgot-password/forgot-password.component').then(
        (m) => m.ForgotPasswordComponent,
      ),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./features/reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent,
      ),
  },
  {
    path: 'change-password',
    loadComponent: () =>
      import('./features/change-password/change-password.component').then(
        (m) => m.ChangePasswordComponent,
      ),
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'salle-display/:token',
    loadComponent: () =>
      import('./features/salle-display/salle-display.component').then(
        (m) => m.SalleDisplayComponent,
      ),
  },
  { path: 'dashboard', component: DashboardComponent },
  {
    path: 'profile',
    loadComponent: () =>
      import('./features/profile/profile.component').then((m) => m.ProfileComponent),
  },
  {
    path: 'classes',
    loadComponent: () => import('./features/classes/classes').then((m) => m.Classes),
  },
  {
    path: 'matieres',
    loadComponent: () => import('./features/matieres/matieres').then((m) => m.Matieres),
  },
  {
    path: 'schedule',
    loadComponent: () => import('./features/schedule/schedule').then((m) => m.Schedule),
  },
  {
    path: 'seances',
    loadComponent: () => import('./features/seances/seances').then((m) => m.SeancesComponent),
  },
  {
    path: 'teachers',
    loadComponent: () =>
      import('./features/teachers/teachers.component').then((m) => m.TeachersComponent),
  },
  {
    path: 'qr-generator',
    loadComponent: () =>
      import('./features/qr-generator/qr-generator.component').then((m) => m.QrGeneratorComponent),
  },
  {
    path: 'attendance',
    loadComponent: () =>
      import('./features/attendance/attendance.component').then((m) => m.AttendanceComponent),
  },
  {
    path: 'pedagogy',
    loadComponent: () =>
      import('./features/pedagogy/pedagogy.component').then((m) => m.PedagogyComponent),
  },
  {
    path: 'honoraires',
    loadComponent: () =>
      import('./features/honoraires/honoraires.component').then((m) => m.HonorairesComponent),
  },
  {
    path: 'departements',
    loadComponent: () =>
      import('./features/departements/departements.component').then((m) => m.DepartementsComponent),
  },
  {
    path: 'filieres',
    loadComponent: () =>
      import('./features/filieres/filieres.component').then((m) => m.FilieresComponent),
  },
  {
    path: 'niveaux-enseignement',
    loadComponent: () =>
      import('./features/niveaux-enseignement/niveaux-enseignement.component').then(
        (m) => m.NiveauxEnseignementComponent,
      ),
  },
  {
    path: 'salles',
    loadComponent: () =>
      import('./features/salles/salles.component').then((m) => m.SallesComponent),
  },
  {
    path: 'annees-universitaires',
    loadComponent: () =>
      import('./features/annees-universitaires/annees-universitaires.component').then(
        (m) => m.AnneesUniversitairesComponent,
      ),
  },
];
