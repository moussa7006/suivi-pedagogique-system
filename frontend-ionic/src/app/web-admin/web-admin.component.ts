import { Component, HostListener, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './shared/notification/notification.component';
import { ConfirmationDialogComponent } from './shared/confirmation/confirmation-dialog.component';

@Component({
  selector: 'app-web-admin',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarComponent,
    CommonModule,
    NotificationComponent,
    ConfirmationDialogComponent,
  ],
  templateUrl: './web-admin.component.html',
  styleUrl: './web-admin.component.scss',
})
export class WebAdminComponent {
  private readonly authServiceInternal = inject(AuthService);
  public readonly router = inject(Router);

  isMobileMenuOpen = false;
  isProfileMenuOpen = false;

  public authService = {
    isLoggedIn: () => !this.isLoginPage && this.authServiceInternal.isLoggedIn(),
  };

  get isLoginPage(): boolean {
    return [
      '/web/login',
      '/web/forgot-password',
      '/web/reset-password',
      '/web/change-password',
      '/web/salle-display',
    ].some((path) => this.router.url.startsWith(path));
  }

  get currentPageTitle(): string {
    const path = this.router.url.split('?')[0].split('#')[0];
    const pageTitles: Array<{ path: string; title: string }> = [
      { path: '/web/annees-universitaires', title: 'Années universitaires' },
      { path: '/web/attendance', title: 'Émargements' },
      { path: '/web/classes', title: 'Classes' },
      { path: '/web/departements', title: 'Départements' },
      { path: '/web/filieres', title: 'Filières' },
      { path: '/web/honoraires', title: 'Honoraires' },
      { path: '/web/matieres', title: 'Matières' },
      { path: '/web/niveaux-enseignement', title: 'Niveaux d’enseignement' },
      { path: '/web/pedagogy', title: 'Suivi & Rapports' },
      { path: '/web/profile', title: 'Profil' },
      { path: '/web/qr-generator', title: 'QR Code' },
      { path: '/web/salles', title: 'Salles' },
      { path: '/web/schedule', title: 'Emplois du temps' },
      { path: '/web/seances', title: 'Séances' },
      { path: '/web/teachers', title: 'Utilisateurs' },
      { path: '/web/dashboard', title: 'Tableau de bord' },
    ];

    return pageTitles.find((item) => path.startsWith(item.path))?.title ?? 'Tableau de bord';
  }

  @HostListener('document:click')
  closeProfileMenu(): void {
    this.isProfileMenuOpen = false;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleProfileMenu(event: Event): void {
    event.stopPropagation();
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  logout(): void {
    this.authServiceInternal.logout();
    this.isProfileMenuOpen = false;
    this.isMobileMenuOpen = false;
    this.router.navigate(['/web/login']);
  }

  goToProfile(): void {
    this.isProfileMenuOpen = false;
    this.router.navigate(['/web/profile']);
  }

  goToChangePassword(): void {
    this.isProfileMenuOpen = false;
    this.router.navigate(['/web/change-password']);
  }

  get adminName(): string {
    const user = this.getStoredUser();

    if (user?.prenom && user?.nom) {
      return `${user.prenom} ${user.nom}`;
    }

    if (user?.email) {
      return this.formatNameFromEmail(user.email);
    }

    return 'Admin User';
  }

  get adminRole(): string {
    const role = this.getStoredUser()?.role;

    if (!role) {
      return 'Administrateur';
    }

    return role.toUpperCase() === 'ADMIN' ? 'Administrateur' : role;
  }

  get adminInitials(): string {
    const initials = this.adminName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');

    return initials || 'AU';
  }

  get adminPhotoUrl(): string {
    return this.getStoredUser()?.photoUrl || '';
  }

  private getStoredUser(): any | null {
    const savedUser = localStorage.getItem('user');

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch {
      return null;
    }
  }

  private formatNameFromEmail(email: string): string {
    const localPart = email.split('@')[0];

    return localPart
      .replace(/[._-]+/g, ' ')
      .split(' ')
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');
  }
}
