import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'scan',
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/attendance-scan/attendance-scan.page').then(m => m.AttendanceScanComponent)
  },
  {
    path: 'lesson-entry',
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/lesson-entry/lesson-entry.page').then(m => m.LessonEntryComponent)
  },
  {
    path: 'home',
    canActivate: [AuthGuard],
    loadComponent: () => import('./folder/folder.page').then((m) => m.FolderPage),
  },
  {
    path: 'folder/:id',
    canActivate: [AuthGuard],
    loadComponent: () => import('./folder/folder.page').then((m) => m.FolderPage),
  },
];
