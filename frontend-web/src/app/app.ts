import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  showSidebar: boolean = false;
  mobileMenuOpen: boolean = false;

  constructor(private router: Router, private authService: AuthService) {
    // Vérification immédiate de l'URL actuelle
    this.updateSidebarVisibility(this.router.url);

    // Suivi des changements de navigation futurs
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.updateSidebarVisibility(event.urlAfterRedirects || event.url);
      this.mobileMenuOpen = false;
    });
  }

  private updateSidebarVisibility(url: string) {
    this.showSidebar = !url.includes('/login');
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
