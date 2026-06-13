import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin, of, Subscription, interval } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TeacherService } from '../../core/services/teacher.service';
import { ClasseService } from '../../core/services/classe.service';
import { ScheduleService } from '../../core/services/schedule.service';
import { AttendanceService } from '../../core/services/attendance.service';
import { MatiereService } from '../../core/services/matiere.service';

interface StatCard {
  label: string;
  value: number;
  suffix: string;
  icon: string;
  color: string;
  trend: string;
  trendClass: 'positive' | 'negative' | 'neutral';
}

interface Activity {
  user: string;
  initials: string;
  action: string;
  meta: string;
  time: string;
  color: string;
}

interface HubTile {
  label: string;
  description: string;
  meta: string;
  route: string;
  icon: string;
  color: string;
  indicator: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-container">
      <!-- HEADER AVEC ACTIONS RAPIDES -->
      <header class="page-header">
        <div class="hero-glow hero-glow-one"></div>
        <div class="hero-glow hero-glow-two"></div>

        <div class="header-actions">
          <button class="btn-secondary" [routerLink]="['/attendance']">
            <i class="pi pi-chart-bar"></i>
            Voir les présences
          </button>
          <button class="btn-primary" [routerLink]="['/qr-generator']">
            <i class="pi pi-qrcode"></i>
            Générer un QR Code
          </button>
        </div>
      </header>

      <!-- STATISTIQUES RAPIDES -->
      <section class="stats-overview">
        <div class="stat-card" *ngFor="let stat of stats" [style.--accent]="stat.color">
          <div class="stat-icon">
            <i [class]="stat.icon"></i>
          </div>
          <div class="stat-details">
            <span class="stat-label">{{ stat.label }}</span>
            <div class="stat-value-row">
              <span class="stat-number">{{ stat.value }}{{ stat.suffix }}</span>
              <span class="stat-badge" [class]="stat.trendClass">
                <i
                  class="pi"
                  [class.pi-arrow-up]="stat.trendClass === 'positive'"
                  [class.pi-arrow-down]="stat.trendClass === 'negative'"
                ></i>
                {{ stat.trend }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- HUB DE NAVIGATION (LE CENTRE DE TRAVAIL) -->
      <section class="workspace-hub">
        <div class="section-title">
          <h2>Modules de Gestion</h2>
          <p>Accédez rapidement à vos outils quotidiens</p>
        </div>

        <div class="hub-grid">
          <a
            *ngFor="let tile of hubTiles"
            [routerLink]="tile.route"
            class="hub-card"
            [style.--tile-color]="tile.color"
          >
            <div class="card-glow"></div>
            <div class="card-header">
              <div class="icon-wrapper">
                <i [class]="tile.icon"></i>
              </div>
              <span class="tag">{{ tile.meta }}</span>
            </div>
            <div class="card-body">
              <h3>{{ tile.label }}</h3>
              <p>{{ tile.description }}</p>
              <span class="module-indicator">{{ tile.indicator }}</span>
            </div>
            <div class="card-footer">
              <span class="action-link">Ouvrir <i class="pi pi-chevron-right"></i></span>
            </div>
          </a>
        </div>
      </section>

      <!-- GRILLE DE CONTENU (GRAPHIQUES & ACTIVITÉS) -->
      <div class="content-row">
        <!-- Activités Récentes -->
        <div class="data-card activity-panel">
          <div class="panel-header">
            <h3>Flux d'activités récentes</h3>
            <button class="btn-text">Voir tout</button>
          </div>
          <div class="activity-timeline">
            <div class="timeline-item" *ngFor="let act of activities">
              <div
                class="user-avatar"
                [style.background]="act.color + '20'"
                [style.color]="act.color"
              >
                {{ act.initials }}
              </div>
              <div class="item-content">
                <p>
                  <strong>{{ act.user }}</strong> {{ act.action }}
                </p>
                <span class="item-meta">{{ act.meta }} • {{ act.time }}</span>
              </div>
              <div class="status-dot" [style.background]="act.color"></div>
            </div>
            <div class="empty-state" *ngIf="activities.length === 0">
              <i class="pi pi-inbox"></i>
              <p>Aucune activité récente</p>
            </div>
          </div>
        </div>

        <!-- Guide / Aide -->
        <div class="data-card help-panel">
          <div class="help-content">
            <div class="help-illustration">
              <i class="pi pi-question-circle"></i>
            </div>
            <h3>Besoin d'aide ?</h3>
            <p>
              Consultez notre centre d'aide ou contactez le support technique pour toute question
              sur l'utilisation d'EduTrack.
            </p>
            <button class="btn-outline">Consulter la documentation</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard-container {
        max-width: 1400px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 18px;
      }

      /* TYPOGRAPHIE & TITRES */
      h1 {
        font-size: clamp(1.55rem, 2.4vw, 2rem);
        font-weight: 800;
        color: #0f172a;
        margin: 6px 0;
        letter-spacing: -0.03em;
      }
      h2 {
        font-size: 1.5rem;
        font-weight: 700;
        color: #1e293b;
        margin: 0;
      }
      p {
        color: #64748b;
        font-size: 0.92rem;
        line-height: 1.45;
      }
      .section-title {
        margin-bottom: 14px;
      }

      /* HEADER */
      .page-header {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 18px;
        padding: 0 0 4px;
        border-radius: 0;
        overflow: visible;
        background: transparent;
        border: none;
        box-shadow: none;

        .header-content,
        .header-actions {
          position: relative;
          z-index: 1;
        }

        h1 {
          color: #0f172a;
          max-width: 780px;
        }

        p {
          max-width: 620px;
          color: #64748b;
          font-weight: 500;
          margin: 0;
        }

        .welcome-text {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 0;
          border-radius: 0;
          background: transparent;
          border: none;
          font-weight: 800;
          color: #1d4ed8;
          text-transform: uppercase;
          font-size: 0.68rem;
          letter-spacing: 0.1em;
        }

        .hero-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 12px;

          span {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 6px 10px;
            border-radius: 999px;
            color: #475569;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            font-size: 0.72rem;
            font-weight: 700;
          }
        }

        .hero-glow {
          display: none;
        }

        .hero-glow-one {
          width: 260px;
          height: 260px;
          right: -80px;
          top: -100px;
          background: rgba(255, 255, 255, 0.16);
        }

        .hero-glow-two {
          width: 220px;
          height: 220px;
          left: 42%;
          bottom: -140px;
          background: rgba(34, 211, 238, 0.18);
        }

        .profile-action {
          height: 42px;
          padding: 6px 12px 6px 6px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          gap: 9px;
          color: #1d4ed8;
          text-decoration: none;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          font-size: 0.82rem;
          font-weight: 850;
          transition: all 0.2s ease;

          &:hover {
            transform: translateY(-1px);
            background: #dbeafe;
            border-color: #93c5fd;
          }

          .profile-action-avatar {
            width: 30px;
            height: 30px;
            min-width: 30px;
            border-radius: 999px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #2563eb, #7c3aed);
            color: #ffffff;
            font-size: 0.68rem;
            font-weight: 900;
            letter-spacing: 0.03em;
          }

          .profile-action-label {
            line-height: 1;
          }
        }

        .header-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: flex-end;
          align-items: center;
        }
      }

      /* BOUTONS MODERNES */
      .btn-primary,
      .btn-secondary,
      .btn-outline,
      .btn-text {
        padding: 10px 16px;
        border-radius: 12px;
        font-weight: 700;
        font-size: 0.82rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        border: none;
      }

      .btn-primary {
        background: linear-gradient(135deg, #f97316, #ec4899);
        color: white;
        box-shadow: 0 14px 28px rgba(236, 72, 153, 0.28);
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 18px 36px rgba(236, 72, 153, 0.36);
        }
      }

      .btn-secondary {
        background: #eff6ff;
        color: #1d4ed8;
        border: 1px solid #bfdbfe;
        &:hover {
          background: #dbeafe;
          border-color: #93c5fd;
          transform: translateY(-2px);
        }
      }

      .btn-outline {
        background: transparent;
        color: #3b82f6;
        border: 2px solid #3b82f6;
        width: 100%;
        justify-content: center;
        &:hover {
          background: #3b82f6;
          color: white;
        }
      }

      .btn-text {
        background: transparent;
        color: #3b82f6;
        padding: 4px 8px;
        &:hover {
          background: rgba(59, 130, 246, 0.05);
        }
      }

      /* STATS OVERVIEW */
      .stats-overview {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 12px;
      }

      .stat-card {
        position: relative;
        overflow: hidden;
        background: white;
        padding: 18px;
        border-radius: 20px;
        border: 1px solid #e2e8f0;
        display: flex;
        align-items: center;
        gap: 14px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 10px 25px rgba(15, 23, 42, 0.05);

        &::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            color-mix(in srgb, var(--accent) 15%, transparent),
            transparent
          );
          opacity: 0.5;
        }

        &:hover {
          transform: translateY(-8px) scale(1.02);
          border-color: var(--accent);
          box-shadow: 0 20px 40px color-mix(in srgb, var(--accent) 15%, rgba(15, 23, 42, 0.1));
        }

        .stat-icon {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          background: linear-gradient(
            135deg,
            var(--accent),
            color-mix(in srgb, var(--accent), black 20%)
          );
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
          box-shadow: 0 8px 16px color-mix(in srgb, var(--accent) 30%, transparent);
          position: relative;
          z-index: 1;
        }

        .stat-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #64748b;
        }
        .stat-number {
          font-size: 1.35rem;
          font-weight: 800;
          color: #0f172a;
        }

        .stat-value-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 2px;
        }

        .stat-badge {
          padding: 4px 8px;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 4px;

          &.positive {
            background: #dcfce7;
            color: #166534;
          }
          &.negative {
            background: #fee2e2;
            color: #991b1b;
          }
          &.neutral {
            background: #f1f5f9;
            color: #475569;
          }
        }
      }

      /* HUB NAVIGATION (CARDS) */
      .hub-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 12px;
      }

      .hub-card {
        position: relative;
        background: white;
        border-radius: 22px;
        padding: 20px;
        min-height: 160px;
        text-decoration: none;
        border: 1px solid #e2e8f0;
        display: flex;
        flex-direction: column;
        gap: 14px;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04);
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: var(--tile-color);
        }

        &:hover {
          transform: translateY(-10px);
          border-color: var(--tile-color);
          box-shadow: 0 25px 50px color-mix(in srgb, var(--tile-color) 20%, rgba(15, 23, 42, 0.1));

          .card-glow {
            opacity: 1;
            transform: scale(1.2);
          }
          .icon-wrapper {
            background: var(--tile-color);
            color: white;
            transform: scale(1.1) rotate(5deg);
          }
          .action-link {
            color: var(--tile-color);
            font-weight: 800;
          }
        }

        .card-glow {
          position: absolute;
          bottom: -20px;
          right: -20px;
          width: 120px;
          height: 120px;
          background: radial-gradient(
            circle,
            color-mix(in srgb, var(--tile-color) 20%, transparent),
            transparent 70%
          );
          opacity: 0.4;
          transition: all 0.5s ease;
          pointer-events: none;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;

          .icon-wrapper {
            width: 58px;
            height: 58px;
            background: color-mix(in srgb, var(--tile-color) 10%, #f8fafc);
            color: var(--tile-color);
            border-radius: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.6rem;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border: 1px solid color-mix(in srgb, var(--tile-color) 20%, transparent);
          }

          .tag {
            font-size: 0.6rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #94a3b8;
          }
        }

        .card-body {
          h3 {
            font-size: 0.98rem;
            font-weight: 800;
            color: #1e293b;
            margin: 0 0 6px;
          }
          p {
            font-size: 0.76rem;
            color: #64748b;
            margin: 0;
            line-height: 1.3;
          }

          .module-indicator {
            display: inline-flex;
            width: fit-content;
            margin-top: 10px;
            padding: 5px 9px;
            border-radius: 999px;
            background: color-mix(in srgb, var(--tile-color) 10%, white);
            border: 1px solid color-mix(in srgb, var(--tile-color) 18%, #e2e8f0);
            color: var(--tile-color);
            font-size: 0.7rem;
            font-weight: 800;
          }
        }

        .card-footer {
          margin-top: auto;
          padding-top: 8px;
          border-top: 1px solid #f1f5f9;

          .action-link {
            font-size: 0.72rem;
            font-weight: 700;
            color: #94a3b8;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: all 0.3s;
          }
        }
      }

      /* CONTENT ROW - hidden to keep the first viewport focused on stats and the 6 main modules */
      .content-row {
        display: none;
      }

      .data-card {
        background: rgba(255, 255, 255, 0.96);
        border-radius: 24px;
        padding: 28px;
        border: 1px solid rgba(226, 232, 240, 0.95);
        box-shadow: 0 18px 42px rgba(15, 23, 42, 0.06);
      }

      .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        h3 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }
      }

      .activity-timeline {
        display: flex;
        flex-direction: column;
        gap: 16px;

        .timeline-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px;
          border-radius: 16px;
          transition: background 0.2s;
          position: relative;

          &:hover {
            background: #f8fafc;
          }

          .user-avatar {
            width: 44px;
            height: 44px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 0.9rem;
          }

          .item-content {
            flex: 1;
            p {
              font-size: 0.9rem;
              color: #334155;
              margin: 0;
            }
            strong {
              color: #0f172a;
            }
            .item-meta {
              font-size: 0.75rem;
              color: #94a3b8;
              font-weight: 600;
            }
          }

          .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
          }
        }
      }

      .help-panel {
        background:
          radial-gradient(circle at top right, rgba(34, 211, 238, 0.22), transparent 34%),
          linear-gradient(135deg, #0f172a, #312e81 54%, #581c87);
        color: white;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 22px 45px rgba(49, 46, 129, 0.2);

        .help-illustration {
          width: 64px;
          height: 64px;
          background: rgba(59, 130, 246, 0.2);
          color: #3b82f6;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          font-size: 2rem;
        }

        h3 {
          color: white;
          margin-bottom: 12px;
        }
        p {
          color: #94a3b8;
          margin-bottom: 24px;
          font-size: 0.9rem;
        }
      }

      @media (max-width: 1180px) {
        .hub-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .content-row {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 720px) {
        .page-header {
          padding: 18px;
        }

        .stats-overview {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .hub-grid {
          grid-template-columns: 1fr;
        }

        .hub-card {
          padding: 18px;
        }
      }
    `,
  ],
})
export class DashboardComponent implements OnInit, OnDestroy {
  adminName = 'Admin User';
  adminRole = 'Administrateur';
  adminInitials = 'AU';

  private refreshSubscription: Subscription | null = null;

  hubTiles: HubTile[] = [
    {
      label: 'Gestion des Classes',
      description: 'Filières, niveaux et effectifs.',
      meta: 'Académique',
      route: '/classes',
      icon: 'pi pi-users',
      color: '#2563eb',
      indicator: 'Chargement...',
    },
    {
      label: 'Catalogue Matières',
      description: 'Programmes et coefficients.',
      meta: 'Programme',
      route: '/matieres',
      icon: 'pi pi-book',
      color: '#16a34a',
      indicator: 'Gestion active',
    },
    {
      label: 'Corps Enseignant',
      description: 'Professeurs et affectations.',
      meta: 'Ressources',
      route: '/teachers',
      icon: 'pi pi-id-card',
      color: '#f97316',
      indicator: 'Chargement...',
    },
    {
      label: 'Plannings & Horaires',
      description: 'Séances, horaires et salles.',
      meta: 'Logistique',
      route: '/schedule',
      icon: 'pi pi-calendar',
      color: '#0ea5e9',
      indicator: 'Chargement...',
    },
    {
      label: 'Générateur QR Code',
      description: 'Codes dynamiques d’émargement.',
      meta: 'Contrôle',
      route: '/qr-generator',
      icon: 'pi pi-qrcode',
      color: '#7c3aed',
      indicator: 'Accès rapide',
    },
    {
      label: 'Rapports d’Assiduité',
      description: 'Présences, retards et rapports.',
      meta: 'Analyse',
      route: '/attendance',
      icon: 'pi pi-chart-bar',
      color: '#ec4899',
      indicator: 'Chargement...',
    },
  ];

  stats: StatCard[] = [
    {
      label: 'Professeurs',
      value: 0,
      suffix: '',
      icon: 'pi pi-id-card',
      color: '#2563eb',
      trend: 'Actifs',
      trendClass: 'positive',
    },
    {
      label: 'Classes',
      value: 0,
      suffix: '',
      icon: 'pi pi-building',
      color: '#16a34a',
      trend: 'Ouvertes',
      trendClass: 'neutral',
    },
    {
      label: 'Matières',
      value: 0,
      suffix: '',
      icon: 'pi pi-book',
      color: '#f97316',
      trend: 'Actives',
      trendClass: 'neutral',
    },
    {
      label: 'Séances',
      value: 0,
      suffix: '',
      icon: 'pi pi-calendar-plus',
      color: '#7c3aed',
      trend: 'Planifiées',
      trendClass: 'neutral',
    },
  ];

  activities: Activity[] = [];

  constructor(
    private teacherService: TeacherService,
    private classeService: ClasseService,
    private matiereService: MatiereService,
    private scheduleService: ScheduleService,
    private attendanceService: AttendanceService,
  ) {}

  ngOnInit() {
    this.loadAdminProfile();
    this.loadDashboardStats();

    // Auto-rafraîchissement toutes les 30 secondes
    this.refreshSubscription = interval(30000).subscribe(() => {
      this.loadDashboardStats();
    });
  }

  ngOnDestroy() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  @HostListener('window:focus')
  onWindowFocus(): void {
    this.loadDashboardStats();
  }

  @HostListener('document:visibilitychange')
  onVisibilityChange(): void {
    if (!document.hidden) {
      this.loadDashboardStats();
    }
  }

  private loadDashboardStats(): void {
    forkJoin({
      teachers: this.teacherService.getTeachers().pipe(
        catchError((error) => {
          console.error('[Dashboard] Erreur chargement enseignants:', error);
          this.hubTiles[2].indicator = 'Erreur API';
          return of([]);
        }),
      ),
      classes: this.classeService.getAll().pipe(
        catchError((error) => {
          console.error('[Dashboard] Erreur chargement classes:', error);
          this.hubTiles[0].indicator = 'Erreur API';
          return of([]);
        }),
      ),
      matieres: this.matiereService.getAll().pipe(
        catchError((error) => {
          console.error('[Dashboard] Erreur chargement matières:', error);
          this.hubTiles[1].indicator = 'Erreur API';
          return of([]);
        }),
      ),
      schedules: this.scheduleService.getAllSchedules().pipe(
        catchError((error) => {
          console.error('[Dashboard] Erreur chargement plannings:', error);
          return of([]);
        }),
      ),
      seances: this.scheduleService.getAllSeances().pipe(
        catchError((error) => {
          console.error('[Dashboard] Erreur chargement séances:', error);
          this.hubTiles[3].indicator = 'Erreur API';
          return of([]);
        }),
      ),
      attendances: this.attendanceService.getAllAttendances().pipe(
        catchError((error) => {
          console.error('[Dashboard] Erreur chargement émargements:', error);
          this.hubTiles[5].indicator = 'Erreur API';
          return of([]);
        }),
      ),
    }).subscribe(({ teachers, classes, matieres, schedules, seances, attendances }) => {
      const teacherCount = teachers.length;
      const classCount = classes.length;
      const matiereCount = matieres.length;
      const seanceCount = seances.length;
      const scheduleCount = schedules.length;
      const attendanceCount = attendances.length;

      this.stats[0].value = teacherCount;
      this.hubTiles[2].indicator = `${teacherCount} enseignant${teacherCount > 1 ? 's' : ''}`;

      this.stats[1].value = classCount;
      this.hubTiles[0].indicator = `${classCount} classe${classCount > 1 ? 's' : ''}`;

      this.stats[2].value = matiereCount;
      this.hubTiles[1].indicator = `${matiereCount} matière${matiereCount > 1 ? 's' : ''}`;

      this.stats[3].value = seanceCount;
      this.hubTiles[3].indicator = `${scheduleCount} planning${scheduleCount > 1 ? 's' : ''} / ${seanceCount} séance${seanceCount > 1 ? 's' : ''}`;

      this.hubTiles[5].indicator = `${attendanceCount} émargement${attendanceCount > 1 ? 's' : ''}`;

      const sorted = [...attendances].sort(
        (a, b) => new Date(b.dateHeureScan!).getTime() - new Date(a.dateHeureScan!).getTime(),
      );
      this.activities = sorted.slice(0, 4).map((e) => ({
        user: e.enseignantNomPrenom || 'Inconnu',
        initials: e.enseignantNomPrenom
          ? e.enseignantNomPrenom.substring(0, 2).toUpperCase()
          : '??',
        action: e.statut === 'VALIDE' ? 'a émargé avec succès.' : 'a tenté un émargement.',
        meta: e.lieu || 'Séance',
        time: e.dateHeureScan
          ? new Date(e.dateHeureScan).toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
            })
          : '--:--',
        color: e.statut === 'VALIDE' ? '#10b981' : '#f59e0b',
      }));
    });
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
    } catch {
      this.adminName = 'Admin User';
      this.adminRole = 'Administrateur';
      this.adminInitials = 'AU';
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
