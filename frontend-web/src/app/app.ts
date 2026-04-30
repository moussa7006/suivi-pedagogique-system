import { Component, HostListener } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  isMobileMenuOpen = false;
  isProfileMenuOpen = false;

  public authService = {
    isLoggedIn: () => !this.isLoginPage && this.authServiceInternal.isLoggedIn(),
  };

  constructor(
    public router: Router,
    private authServiceInternal: AuthService,
  ) {}

  get isLoginPage(): boolean {
    return this.router.url.startsWith('/login');
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
    this.router.navigate(['/login']);
  }

  goToProfile(): void {
    this.isProfileMenuOpen = false;
    this.router.navigate(['/profile']);
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
