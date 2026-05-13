import { Component, EventEmitter, HostListener, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="sidebar" [class.mobile-active]="isMobileMenuOpen">
      <!-- Logo Section -->
      <div class="sidebar-logo">
        <img src="assets/images/intec1.png" alt="Logo INTEC" class="logo-img" />
        <span>EduTrack</span>
      </div>

      <!-- Navigation Links -->
      <div class="nav-container">
        <div class="nav-section">Principal</div>
        <ul class="nav-list">
          <li>
            <a routerLink="/dashboard" routerLinkActive="active">
              <i class="pi pi-home"></i>
              <span>Tableau de bord</span>
            </a>
          </li>
          <li>
            <a routerLink="/attendance" routerLinkActive="active">
              <i class="pi pi-check-square"></i>
              <span>Émargements</span>
            </a>
          </li>
          <li>
            <a routerLink="/qr-generator" routerLinkActive="active">
              <i class="pi pi-qrcode"></i>
              <span>QR Code</span>
            </a>
          </li>
        </ul>

        <div class="nav-section">Gestion</div>
        <ul class="nav-list">
          <li>
            <a routerLink="/classes" routerLinkActive="active">
              <i class="pi pi-users"></i>
              <span>Classes</span>
            </a>
          </li>
          <li>
            <a routerLink="/teachers" routerLinkActive="active">
              <i class="pi pi-id-card"></i>
              <span>Professeurs</span>
            </a>
          </li>
          <li>
            <a routerLink="/matieres" routerLinkActive="active">
              <i class="pi pi-book"></i>
              <span>Matières</span>
            </a>
          </li>
          <li>
            <a routerLink="/schedule" routerLinkActive="active">
              <i class="pi pi-calendar"></i>
              <span>Emplois du temps</span>
            </a>
          </li>
          <li>
            <a routerLink="/seances" routerLinkActive="active">
              <i class="pi pi-calendar-times"></i>
              <span>Séances (Sessions)</span>
            </a>
          </li>
        </ul>

        <div class="nav-section">Référentiels</div>
        <ul class="nav-list">
          <li>
            <a routerLink="/departements" routerLinkActive="active">
              <i class="pi pi-folder"></i>
              <span>Départements</span>
            </a>
          </li>
          <li>
            <a routerLink="/filieres" routerLinkActive="active">
              <i class="pi pi-sitemap"></i>
              <span>Filières</span>
            </a>
          </li>
          <li>
            <a routerLink="/niveaux-enseignement" routerLinkActive="active">
              <i class="pi pi-graduation-cap"></i>
              <span>Niveaux</span>
            </a>
          </li>
          <li>
            <a routerLink="/salles" routerLinkActive="active">
              <i class="pi pi-building"></i>
              <span>Salles</span>
            </a>
          </li>
          <li>
            <a routerLink="/annees-universitaires" routerLinkActive="active">
              <i class="pi pi-calendar-plus"></i>
              <span>Années universitaires</span>
            </a>
          </li>
        </ul>

        <div class="nav-section">Pédagogie</div>
        <ul class="nav-list">
          <li>
            <a routerLink="/pedagogy" routerLinkActive="active">
              <i class="pi pi-chart-line"></i>
              <span>Suivi & Rapports</span>
            </a>
          </li>
        </ul>
      </div>

      <!-- Footer / Logout -->
      <div class="sidebar-footer">
        <button class="logout-btn" (click)="logout()">
          <i class="pi pi-sign-out"></i>
          <span>Déconnexion</span>
        </button>
      </div>
    </nav>
  `,
  styles: [
    `
      .sidebar {
        width: 280px;
        height: 100vh;
        background: #0f172a; /* Slate 900 */
        color: #f8fafc;
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 1000;
        overflow-y: auto;
        position: fixed;
        left: 0;
        top: 0;
        border-right: 1px solid rgba(255, 255, 255, 0.05);

        @media (max-width: 1024px) {
          transform: translateX(-100%);
          &.mobile-active {
            transform: translateX(0);
            box-shadow: 20px 0 50px rgba(0, 0, 0, 0.5);
          }
        }
      }

      .sidebar-logo {
        padding: 32px 24px;
        display: flex;
        align-items: center;
        gap: 16px;

        .logo-img {
          width: 40px;
          height: 40px;
          object-fit: contain;
          border-radius: 10px;
        }

        span {
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          background: linear-gradient(to right, #ffffff, #94a3b8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }

      .user-profile {
        margin: 0 20px 24px;
        padding: 16px;
        width: calc(100% - 40px);
        background: rgba(255, 255, 255, 0.03);
        border-radius: 16px;
        display: flex;
        align-items: center;
        gap: 14px;
        border: 1px solid rgba(255, 255, 255, 0.05);
        color: inherit;
        cursor: pointer;
        font-family: inherit;
        text-align: left;
        transition: all 0.2s ease;

        &:hover {
          background: rgba(59, 130, 246, 0.12);
          border-color: rgba(59, 130, 246, 0.35);
          transform: translateY(-1px);

          .profile-arrow {
            opacity: 1;
            transform: translateX(2px);
          }
        }

        .avatar-container {
          position: relative;

          .avatar-photo,
          .avatar-initials {
            width: 48px;
            height: 48px;
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid rgba(59, 130, 246, 0.5);
            box-shadow: 0 10px 20px rgba(37, 99, 235, 0.22);
          }

          .avatar-photo {
            object-fit: cover;
            background: #ffffff;
          }

          .avatar-initials {
            background: linear-gradient(135deg, #3b82f6, #7c3aed);
            color: #ffffff;
            font-size: 0.86rem;
            font-weight: 900;
            letter-spacing: 0.03em;
          }

          .online-status {
            position: absolute;
            bottom: -2px;
            right: -2px;
            width: 12px;
            height: 12px;
            background: #10b981;
            border: 2px solid #0f172a;
            border-radius: 50%;
          }
        }

        .user-details {
          display: flex;
          flex-direction: column;
          min-width: 0;
          flex: 1;

          .user-name {
            font-weight: 700;
            font-size: 0.95rem;
            color: #f1f5f9;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .user-role {
            font-size: 0.75rem;
            color: #94a3b8;
            font-weight: 600;
          }
        }

        .profile-arrow {
          color: #64748b;
          font-size: 0.85rem;
          opacity: 0.55;
          transition: all 0.2s ease;
        }
      }

      .nav-container {
        flex: 1;
        padding: 0 12px;
      }

      .nav-section {
        padding: 24px 16px 8px;
        font-size: 0.7rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: #475569;
      }

      .nav-list {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          margin-bottom: 4px;
          a {
            display: flex;
            align-items: center;
            gap: 14px;
            padding: 12px 16px;
            border-radius: 12px;
            color: #94a3b8;
            text-decoration: none;
            font-size: 0.95rem;
            font-weight: 500;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

            i {
              font-size: 1.2rem;
              transition: all 0.2s;
            }

            &:hover {
              background: rgba(255, 255, 255, 0.05);
              color: #ffffff;
              i {
                color: #3b82f6;
              }
            }

            &.active {
              background: linear-gradient(135deg, #3b82f6, #2563eb);
              color: #ffffff;
              box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);
              i {
                color: #ffffff;
              }
              font-weight: 600;
            }
          }
        }
      }

      .sidebar-footer {
        padding: 20px 16px;
        margin-bottom: 12px;

        .logout-btn {
          width: 100%;
          padding: 14px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          color: #94a3b8;
          cursor: pointer;
          font-weight: 700;
          border: 1px solid rgba(255, 255, 255, 0.05);
          background: rgba(255, 255, 255, 0.02);
          transition: all 0.2s;

          &:hover {
            background: rgba(239, 68, 68, 0.1);
            color: #ef4444;
            border-color: rgba(239, 68, 68, 0.2);
            i {
              color: #ef4444;
            }
          }
        }
      }
    `,
  ],
})
export class SidebarComponent implements OnInit {
  @Input() isMobileMenuOpen = false;
  @Output() mobileMenuClosed = new EventEmitter<void>();

  adminName = 'Admin User';
  adminRole = 'Administrateur';
  adminInitials = 'AU';
  adminPhotoUrl = '';

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.loadAdminProfile();
  }

  @HostListener('window:profile-updated')
  @HostListener('window:storage')
  refreshAdminProfile(): void {
    this.loadAdminProfile();
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
    this.mobileMenuClosed.emit();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.mobileMenuClosed.emit();
  }

  private loadAdminProfile(): void {
    const savedUser = localStorage.getItem('user');

    if (!savedUser) {
      return;
    }

    try {
      const user = JSON.parse(savedUser);
      const email = user.email || user.username || user.sub || 'admin@edutrack.local';
      const name =
        user.nom && user.prenom ? `${user.prenom} ${user.nom}` : this.getNameFromEmail(email);

      this.adminName = name;
      this.adminRole = this.formatRole(user.role || 'ADMIN');
      this.adminInitials = this.getInitials(name);
      this.adminPhotoUrl = user.photoUrl || '';
    } catch {
      this.adminName = 'Admin User';
      this.adminRole = 'Administrateur';
      this.adminInitials = 'AU';
      this.adminPhotoUrl = '';
    }
  }

  private getNameFromEmail(email: string): string {
    const localPart = email.split('@')[0];

    if (!localPart) {
      return 'Admin User';
    }

    return localPart
      .replace(/[._-]+/g, ' ')
      .split(' ')
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');
  }

  private getInitials(name: string): string {
    const initials = name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');

    return initials || 'AU';
  }

  private formatRole(role: string): string {
    const normalizedRole = role.toUpperCase();

    if (normalizedRole === 'ADMIN') {
      return 'Administrateur';
    }

    if (normalizedRole === 'ENSEIGNANT') {
      return 'Enseignant';
    }

    return role;
  }
}
