import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  exact: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="sidebar" [class.mobile-active]="isMobileMenuOpen">
      <div class="sidebar-logo">
        <i class="pi pi-bookmark"></i>
        <span>Suivi Pédagogique</span>
      </div>

      <div class="nav-section">Menu Principal</div>
      <ul class="nav-list">
        <li *ngFor="let item of menuItems">
          <a
            [routerLink]="item.route"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: item.exact }"
            (click)="onMenuClick()"
          >
            <i [class]="item.icon"></i>
            <span>{{ item.label }}</span>
          </a>
        </li>
      </ul>

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
        width: 320px;
        height: 100vh;
        background: #0f172a;
        color: #e2e8f0;
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 1000;
        overflow-y: auto;
        position: fixed;
        left: 0;
        top: 0;

        @media (max-width: 1024px) {
          transform: translateX(-100%);

          &.mobile-active {
            transform: translateX(0);
            box-shadow: 10px 0 40px rgba(0, 0, 0, 0.4);
          }
        }
      }

      .sidebar-logo {
        padding: 28px 24px;
        display: flex;
        align-items: center;
        gap: 16px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);

        i {
          font-size: 2rem;
          color: #3b82f6;
        }
        span {
          font-size: 1.2rem;
          font-weight: 800;
          color: #f8fafc;
          letter-spacing: 0.04em;
          line-height: 1.2;
          white-space: nowrap;
        }
      }

      .nav-section {
        padding: 24px 20px 12px;
        font-size: 0.72rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #475569;
      }

      .nav-list {
        list-style: none;
        padding: 0 16px;
        margin: 0;

        li {
          margin-bottom: 6px;
          a {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 16px 22px;
            border-radius: 12px;
            color: #94a3b8;
            text-decoration: none;
            font-size: 1.02rem;
            font-weight: 500;
            transition: all 0.2s cubic-bezier(0.22, 1, 0.36, 1);

            &:hover {
              background: rgba(255, 255, 255, 0.06);
              color: #f1f5f9;
              i {
                color: #60a5fa;
              }
            }
            &.active {
              background: linear-gradient(135deg, #2563eb, #3b82f6);
              color: #ffffff;
              box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
              i {
                color: #ffffff;
              }
            }
            i {
              font-size: 1.3rem;
              color: #64748b;
              transition: color 0.2s ease;
            }
          }
        }
      }

      .sidebar-footer {
        margin-top: auto;
        padding: 24px 20px;
        border-top: 1px solid rgba(255, 255, 255, 0.06);
        margin: 0 16px 20px;

        .logout-btn {
          width: 100%;
          padding: 16px 18px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 16px;
          color: #94a3b8;
          cursor: pointer;
          font-weight: 600;
          font-size: 1rem;
          border: none;
          background: transparent;
          transition: all 0.2s ease;

          &:hover {
            background: rgba(239, 68, 68, 0.1);
            color: #f87171;
            i {
              color: #ef4444;
            }
          }
          i {
            font-size: 1.25rem;
            color: #64748b;
            transition: color 0.2s ease;
          }
        }
      }
    `,
  ],
})
export class SidebarComponent {
  @Input() isMobileMenuOpen = false;
  @Output() mobileMenuClosed = new EventEmitter<void>();

  menuItems: MenuItem[] = [
    { label: 'Tableau de bord', icon: 'pi pi-th-large', route: '/dashboard', exact: true },
    { label: 'Enseignants', icon: 'pi pi-users', route: '/teachers', exact: false },
    { label: 'Séance du jour', icon: 'pi pi-qrcode', route: '/qr-generator', exact: false },
    { label: 'Emargements', icon: 'pi pi-check-square', route: '/attendance', exact: false },
    { label: 'Cahiers de textes', icon: 'pi pi-book', route: '/pedagogy', exact: false },
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  onMenuClick(): void {
    this.mobileMenuClosed.emit();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.mobileMenuClosed.emit();
  }
}
