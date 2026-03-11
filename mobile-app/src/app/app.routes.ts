import { Routes } from '@angular/router';

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
    loadComponent: () => import('./pages/attendance-scan/attendance-scan.page').then(m => m.AttendanceScanComponent)
  },
  {
    path: 'lesson-entry',
    loadComponent: () => import('./pages/lesson-entry/lesson-entry.page').then(m => m.LessonEntryComponent)
  },
  {
    path: 'home',
    loadComponent: () => import('./folder/folder.page').then((m) => m.FolderPage),
  },
  {
    path: 'folder/:id',
    loadComponent: () => import('./folder/folder.page').then((m) => m.FolderPage),
  },
];
