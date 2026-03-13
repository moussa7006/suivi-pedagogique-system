import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LoginComponent } from './features/login/login.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { 
    path: 'teachers', 
    loadComponent: () => import('./features/teachers/teachers.component').then(m => m.TeachersComponent) 
  },
  { 
    path: 'qr-generator', 
    loadComponent: () => import('./features/qr-generator/qr-generator.component').then(m => m.QrGeneratorComponent) 
  },
  { 
    path: 'attendance', 
    loadComponent: () => import('./features/attendance/attendance.component').then(m => m.AttendanceComponent) 
  },
  { 
    path: 'pedagogy', 
    loadComponent: () => import('./features/pedagogy/pedagogy.component').then(m => m.PedagogyComponent) 
  }
];
