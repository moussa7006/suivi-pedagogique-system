import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin, interval, of, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexResponsive,
  ApexStroke,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { sortByAlpha } from '../../core/utils/sort-utils';
import { DashboardData, DashboardService } from '../../core/services/dashboard.service';
import { HonorairesService } from '../../core/services/honoraires.service';
import { HonorairesCalcul } from '../../core/models/honoraires.model';

interface StatCard {
  label: string;
  value: number;
  suffix: string;
  icon: string;
  color: string;
  trend: string;
  trendClass: 'positive' | 'negative' | 'neutral';
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

type RadialChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  labels: string[];
  fill: ApexFill;
  stroke: ApexStroke;
};

type DonutChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  colors: string[];
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
};

type AxisChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  colors: string[];
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  fill: ApexFill;
  tooltip: ApexTooltip;
  plotOptions: ApexPlotOptions;
  grid: ApexGrid;
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, NgApexchartsModule],
  template: `
    <div class="dashboard-shell">
      <header class="page-header">
        <h1>Aperçu <span>Global</span></h1>
        <div class="header-date">Bienvenue sur votre espace de pilotage</div>
      </header>

      <section class="stats-overview" aria-label="Indicateurs clés">
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
                  [class.pi-minus]="stat.trendClass === 'neutral'"
                ></i>
                {{ stat.trend }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section class="quick-access">
        <div class="section-heading">
          <h2>Accès rapide</h2>
          <span>Raccourcis opérationnels</span>
        </div>
        <div class="hub-grid">
          <a
            *ngFor="let tile of sortedHubTiles"
            [routerLink]="tile.route"
            class="hub-tile"
            [style.--tile-color]="tile.color"
          >
            <div class="tile-icon"><i [class]="tile.icon"></i></div>
            <div class="tile-content">
              <div class="tile-meta">{{ tile.meta }}</div>
              <h3>{{ tile.label }}</h3>
              <p>{{ tile.description }}</p>
              <div class="tile-indicator">{{ tile.indicator }}</div>
            </div>
            <div class="tile-arrow-wrapper">
              <i class="pi pi-arrow-right tile-arrow"></i>
            </div>
          </a>
        </div>
      </section>

      <section class="analysis-section">
        <div class="section-heading">
          <h2>Tableaux d’analyse</h2>
          <span>Mesures en temps réel</span>
        </div>

        <div class="bento-grid">
          <article class="bento-card col-span-8">
            <div class="card-header">
              <div>
                <h3>Émargements récents</h3>
                <p>Données réelles des 7 derniers jours</p>
              </div>
              <div class="header-icon"><i class="pi pi-chart-line"></i></div>
            </div>
            <div class="chart-wrapper">
              <apx-chart
                [series]="sessionsTrendOptions.series"
                [chart]="sessionsTrendOptions.chart"
                [xaxis]="sessionsTrendOptions.xaxis"
                [yaxis]="sessionsTrendOptions.yaxis"
                [colors]="sessionsTrendOptions.colors"
                [dataLabels]="sessionsTrendOptions.dataLabels"
                [stroke]="sessionsTrendOptions.stroke"
                [fill]="sessionsTrendOptions.fill"
                [tooltip]="sessionsTrendOptions.tooltip"
                [grid]="sessionsTrendOptions.grid"
              ></apx-chart>
            </div>
          </article>

          <div class="bento-column col-span-4">
            <article class="bento-card compact-chart">
              <div class="card-header">
                <div>
                  <h3>Taux d'émargement</h3>
                  <p>{{ attendanceInsight }}</p>
                </div>
                <div class="header-icon"><i class="pi pi-verified"></i></div>
              </div>
              <div class="chart-wrapper gauge-wrapper">
                <apx-chart
                  [series]="attendanceGaugeOptions.series"
                  [chart]="attendanceGaugeOptions.chart"
                  [plotOptions]="attendanceGaugeOptions.plotOptions"
                  [labels]="attendanceGaugeOptions.labels"
                  [fill]="attendanceGaugeOptions.fill"
                  [stroke]="attendanceGaugeOptions.stroke"
                ></apx-chart>
              </div>
            </article>

            <article class="bento-card compact-chart">
              <div class="card-header">
                <div>
                  <h3>Statut des séances</h3>
                  <p>Répartition opérationnelle</p>
                </div>
                <div class="header-icon"><i class="pi pi-clock"></i></div>
              </div>
              <div class="chart-wrapper donut-wrapper">
                <apx-chart
                  [series]="sessionStatusOptions.series"
                  [chart]="sessionStatusOptions.chart"
                  [labels]="sessionStatusOptions.labels"
                  [colors]="sessionStatusOptions.colors"
                  [legend]="sessionStatusOptions.legend"
                  [dataLabels]="sessionStatusOptions.dataLabels"
                  [plotOptions]="sessionStatusOptions.plotOptions"
                ></apx-chart>
              </div>
            </article>
          </div>

          <article class="bento-card col-span-6">
            <div class="card-header">
              <div>
                <h3>Top Enseignants</h3>
                <p>Émargements validés par enseignant</p>
              </div>
              <div class="header-icon"><i class="pi pi-users"></i></div>
            </div>
            <div class="chart-wrapper">
              <apx-chart
                [series]="teacherHoursOptions.series"
                [chart]="teacherHoursOptions.chart"
                [xaxis]="teacherHoursOptions.xaxis"
                [yaxis]="teacherHoursOptions.yaxis"
                [colors]="teacherHoursOptions.colors"
                [dataLabels]="teacherHoursOptions.dataLabels"
                [plotOptions]="teacherHoursOptions.plotOptions"
                [grid]="teacherHoursOptions.grid"
                [tooltip]="teacherHoursOptions.tooltip"
                [stroke]="teacherHoursOptions.stroke"
                [fill]="teacherHoursOptions.fill"
              ></apx-chart>
            </div>
          </article>

          <article class="bento-card col-span-6">
            <div class="card-header">
              <div>
                <h3>Honoraires</h3>
                <p>Prévisions mensuelles</p>
              </div>
              <div class="header-icon"><i class="pi pi-wallet"></i></div>
            </div>
            <div class="chart-wrapper">
              <apx-chart
                [series]="honorairesOptions.series"
                [chart]="honorairesOptions.chart"
                [xaxis]="honorairesOptions.xaxis"
                [yaxis]="honorairesOptions.yaxis"
                [colors]="honorairesOptions.colors"
                [dataLabels]="honorairesOptions.dataLabels"
                [plotOptions]="honorairesOptions.plotOptions"
                [grid]="honorairesOptions.grid"
                [tooltip]="honorairesOptions.tooltip"
                [stroke]="honorairesOptions.stroke"
                [fill]="honorairesOptions.fill"
              ></apx-chart>
            </div>
          </article>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100%;
        margin: -1.5rem;
        padding: 2.5rem;
        background-color: #fafafa;
        background-image: radial-gradient(#d1d5db 1px, transparent 1px);
        background-size: 24px 24px;
      }

      .dashboard-shell {
        position: relative;
        max-width: 1440px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 56px;
        padding-bottom: 36px;
        color: #0f172a;
        font-family: 'Plus Jakarta Sans', sans-serif;
      }

      /* Clean Header */
      .page-header {
        display: flex;
        flex-direction: column;
        gap: 6px;
        margin-bottom: -16px;
      }

      .page-header h1 {
        margin: 0;
        font-size: 2.4rem;
        font-weight: 900;
        letter-spacing: -0.05em;
        line-height: 1.1;
      }

      .page-header h1 span {
        color: #6366f1;
      }

      .header-date {
        color: #64748b;
        font-size: 1rem;
        font-weight: 600;
      }

      /* Section Headings */
      .section-heading {
        display: flex;
        align-items: baseline;
        gap: 16px;
        margin-bottom: 24px;
        padding-bottom: 12px;
        border-bottom: 2px solid #0f172a;
      }

      .section-heading h2 {
        margin: 0;
        color: #0f172a;
        font-size: 1.6rem;
        font-weight: 900;
        letter-spacing: -0.04em;
        text-transform: lowercase;
        font-variant: small-caps;
      }

      .section-heading span {
        background: #0f172a;
        color: #fff;
        padding: 4px 10px;
        border-radius: 6px;
        font-weight: 800;
        font-size: 0.75rem;
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }

      /* Neo-brutalist / Geometric Grids */
      .hub-grid,
      .bento-grid {
        display: grid;
        gap: 28px;
      }

      .stats-overview {
        position: sticky;
        top: 80px;
        z-index: 30;
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 12px;
        padding: 0;
        background: linear-gradient(
          180deg,
          #f8fafc 0%,
          rgba(248, 250, 252, 0.94) 78%,
          rgba(248, 250, 252, 0)
        );
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
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
        transition:
          transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
          box-shadow 0.35s ease,
          border-color 0.35s ease;
        box-shadow: 0 10px 25px rgba(15, 23, 42, 0.05);
        will-change: transform;

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
          transform: translateY(-6px) scale(1.07);
          border-color: var(--accent);
          box-shadow: 0 26px 50px color-mix(in srgb, var(--accent) 28%, rgba(15, 23, 42, 0.18));
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

      .kpi-body small {
        font-size: 1.2rem;
        font-weight: 700;
        margin-left: 4px;
        color: #94a3b8;
      }

      /* Hub Tiles (Quick Access) */
      .hub-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }

      .hub-tile {
        --tile-color: #6366f1;
        background: #ffffff;
        border: 2px solid #0f172a;
        border-radius: 16px;
        padding: 24px;
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) auto;
        align-items: center;
        gap: 20px;
        text-decoration: none;
        color: inherit;
        box-shadow: 5px 5px 0px #cbd5e1;
        transition:
          transform 0.2s ease,
          box-shadow 0.2s ease,
          border-color 0.2s ease;
      }

      .hub-tile:hover {
        transform: translate(-3px, -3px);
        box-shadow: 8px 8px 0px var(--tile-color);
        border-color: var(--tile-color);
      }

      .tile-icon {
        display: grid;
        place-items: center;
        width: 64px;
        height: 64px;
        border-radius: 14px;
        background: color-mix(in srgb, var(--tile-color) 12%, white);
        color: #0f172a;
        font-size: 1.8rem;
        border: 2px solid #0f172a;
      }

      .tile-meta {
        display: inline-block;
        color: #0f172a;
        font-size: 0.75rem;
        font-weight: 900;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        margin-bottom: 6px;
        background: #f1f5f9;
        padding: 2px 8px;
        border-radius: 4px;
        border: 1px solid #cbd5e1;
      }

      .tile-content h3 {
        margin: 0 0 4px;
        color: #0f172a;
        font-size: 1.15rem;
        font-weight: 900;
        letter-spacing: -0.02em;
      }

      .tile-content p {
        margin: 0 0 10px;
        color: #64748b;
        font-size: 0.9rem;
        font-weight: 600;
        line-height: 1.4;
      }

      .tile-indicator {
        font-size: 0.85rem;
        font-weight: 800;
        color: var(--tile-color);
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .tile-arrow-wrapper {
        display: grid;
        place-items: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 2px solid #e2e8f0;
        background: #f8fafc;
        transition: all 0.2s ease;
      }

      .tile-arrow {
        color: #94a3b8;
        font-size: 1.2rem;
        font-weight: bold;
        transition:
          transform 0.2s ease,
          color 0.2s ease;
      }

      .hub-tile:hover .tile-arrow-wrapper {
        border-color: #0f172a;
        background: #0f172a;
      }

      .hub-tile:hover .tile-arrow {
        color: #fff;
        transform: translateX(2px);
      }

      /* Bento Grid / Analysis */
      .bento-grid {
        grid-template-columns: repeat(12, minmax(0, 1fr));
      }

      .col-span-8 {
        grid-column: span 8;
      }
      .col-span-6 {
        grid-column: span 6;
      }
      .col-span-4 {
        grid-column: span 4;
      }

      .bento-column {
        display: flex;
        flex-direction: column;
        gap: 28px;
      }

      .bento-card {
        display: flex;
        flex-direction: column;
        min-height: 380px;
        padding: 28px;
        background: #ffffff;
        border: 2px solid #0f172a;
        border-radius: 20px;
        box-shadow: 6px 6px 0px rgba(15, 23, 42, 0.08);
        transition:
          transform 0.2s ease,
          box-shadow 0.2s ease;
      }

      .bento-card:hover {
        transform: translate(-2px, -2px);
        box-shadow: 8px 8px 0px rgba(15, 23, 42, 0.15);
      }

      .compact-chart {
        min-height: 300px;
      }

      .card-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
        margin-bottom: 20px;
        padding-bottom: 20px;
        border-bottom: 2px dashed #e2e8f0;
      }

      .card-header h3 {
        margin: 0;
        color: #0f172a;
        font-size: 1.25rem;
        font-weight: 900;
        letter-spacing: -0.03em;
      }

      .card-header p {
        margin: 6px 0 0;
        color: #64748b;
        font-size: 0.9rem;
        font-weight: 600;
        line-height: 1.4;
      }

      .header-icon {
        display: grid;
        place-items: center;
        width: 44px;
        height: 44px;
        flex: 0 0 auto;
        border-radius: 12px;
        background: #f1f5f9;
        border: 2px solid #0f172a;
        color: #0f172a;
        font-size: 1.2rem;
      }

      .chart-wrapper {
        flex: 1;
        min-height: 240px;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .gauge-wrapper,
      .donut-wrapper {
        align-items: center;
        margin-top: -8px;
      }

      /* Responsive Adjustments */
      @media (max-width: 1180px) {
        .stats-overview,
        .hub-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .stats-overview {
          position: static;
          padding: 0;
          background: transparent;
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
        }

        .col-span-8,
        .col-span-6,
        .col-span-4 {
          grid-column: span 12;
        }
      }

      @media (max-width: 760px) {
        :host {
          margin: -1rem;
          padding: 1.5rem;
        }

        .stats-overview,
        .hub-grid,
        .bento-grid {
          grid-template-columns: 1fr;
        }

        .hub-tile {
          grid-template-columns: auto minmax(0, 1fr);
        }

        .tile-arrow-wrapper {
          display: none;
        }

        .section-heading {
          flex-direction: column;
          gap: 8px;
          border-bottom: none;
          padding-bottom: 0;
        }
      }
    `,
  ],
})
export class DashboardComponent implements OnInit, OnDestroy {
  adminName = 'Admin User';
  adminRole = 'Administrateur';
  adminInitials = 'AU';
  attendanceRate = 0;
  attendanceInsight = 'Aucune séance disponible pour le calcul.';

  private refreshSubscription: Subscription | null = null;
  private readonly monthsWindow = this.getLastMonths(6);

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
      color: '#6366f1',
      trend: 'Actifs',
      trendClass: 'positive',
    },
    {
      label: 'Classes',
      value: 0,
      suffix: '',
      icon: 'pi pi-building',
      color: '#10b981',
      trend: 'Ouvertes',
      trendClass: 'neutral',
    },
    {
      label: 'Matières',
      value: 0,
      suffix: '',
      icon: 'pi pi-book',
      color: '#f43f5e',
      trend: 'Actives',
      trendClass: 'neutral',
    },
    {
      label: "Séances aujourd'hui",
      value: 0,
      suffix: '',
      icon: 'pi pi-calendar-plus',
      color: '#8b5cf6',
      trend: 'Planifiées',
      trendClass: 'neutral',
    },
  ];

  attendanceGaugeOptions: RadialChartOptions = {
    series: [0],
    chart: { type: 'radialBar', height: 280, sparkline: { enabled: true } },
    plotOptions: {
      radialBar: {
        startAngle: -120,
        endAngle: 120,
        hollow: { size: '65%' },
        track: { background: '#e2e8f0', strokeWidth: '100%' },
        dataLabels: {
          name: { show: true, offsetY: 26, color: '#64748b', fontSize: '13px', fontWeight: 800 },
          value: {
            offsetY: -12,
            color: '#0f172a',
            fontSize: '38px',
            fontWeight: 900,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            formatter: (value) => `${Math.round(value)}%`,
          },
        },
      },
    },
    labels: ['Émargement'],
    fill: { colors: ['#6366f1'] },
    stroke: { lineCap: 'round' },
  };

  sessionStatusOptions: DonutChartOptions = {
    series: [0, 0, 0, 0],
    chart: { type: 'donut', height: 260, fontFamily: "'Plus Jakarta Sans', sans-serif" },
    labels: ['Validée', 'En cours', 'Prévue', 'Terminée'],
    colors: ['#22c55e', '#38bdf8', '#fbbf24', '#a78bfa'],
    legend: { position: 'bottom', fontWeight: 800 },
    dataLabels: { enabled: true, style: { fontWeight: '900' } },
    plotOptions: {
      pie: {
        donut: {
          size: '68%',
          labels: { show: true, total: { show: true, label: 'Séances', fontWeight: 900 } },
        },
      },
    },
    responsive: [
      { breakpoint: 760, options: { chart: { height: 260 }, legend: { position: 'bottom' } } },
    ],
  };

  sessionsTrendOptions: AxisChartOptions = this.createLineChartOptions(
    'Émargements validés',
    '#6366f1',
  );
  teacherHoursOptions: AxisChartOptions = this.createBarChartOptions(
    'Émargements',
    '#8b5cf6',
    true,
    'validés',
  );
  honorairesOptions: AxisChartOptions = this.createBarChartOptions(
    'Montant',
    '#f43f5e',
    false,
    'FCFA',
  );

  constructor(
    private dashboardService: DashboardService,
    private honorairesService: HonorairesService,
  ) {}

  get sortedHubTiles(): HubTile[] {
    return sortByAlpha(this.hubTiles, (tile) => tile.label);
  }

  ngOnInit(): void {
    this.loadAdminProfile();
    this.loadDashboardStats();

    this.refreshSubscription = interval(30000).subscribe(() => {
      this.loadDashboardStats();
    });
  }

  ngOnDestroy(): void {
    this.refreshSubscription?.unsubscribe();
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
    const honorairesRequests = this.monthsWindow.map((month) =>
      this.honorairesService.getParMois(month.year, month.month).pipe(
        catchError((error) => {
          console.error('[Dashboard] Erreur chargement honoraires:', error);
          return of([] as HonorairesCalcul[]);
        }),
      ),
    );

    forkJoin({
      dashboardStats: this.dashboardService.getDashboardData().pipe(
        catchError((error) => {
          console.error('[Dashboard] Erreur API Dashboard:', error);
          return of(null as DashboardData | null);
        }),
      ),
      honorairesByMonth: forkJoin(honorairesRequests),
    }).subscribe(({ dashboardStats, honorairesByMonth }) => {
      this.applyBackendStats(dashboardStats);
      this.updateAnalytics(dashboardStats, honorairesByMonth);
    });
  }

  private applyBackendStats(dashboardStats: DashboardData | null): void {
    const totalTeachers = dashboardStats?.totalTeachers ?? 0;
    const totalClasses = dashboardStats?.totalClasses ?? 0;
    const totalMatieres = dashboardStats?.totalMatieres ?? 0;
    const sessionsToday = dashboardStats?.sessionsToday ?? 0;
    const totalSeances = dashboardStats?.totalSeances ?? 0;
    const emargementsValides = dashboardStats?.emargementsValides ?? 0;

    this.stats[0].value = totalTeachers;
    this.stats[1].value = totalClasses;
    this.stats[2].value = totalMatieres;
    this.stats[3].value = sessionsToday;

    this.hubTiles[2].indicator = `${totalTeachers} enseignant${totalTeachers > 1 ? 's' : ''}`;
    this.hubTiles[0].indicator = `${totalClasses} classe${totalClasses > 1 ? 's' : ''}`;
    this.hubTiles[1].indicator = `${totalMatieres} matière${totalMatieres > 1 ? 's' : ''}`;
    this.hubTiles[3].indicator = `${totalSeances} séance${totalSeances > 1 ? 's' : ''}`;
    this.hubTiles[5].indicator = `${emargementsValides} émargement${emargementsValides > 1 ? 's' : ''}`;
  }

  private updateAnalytics(
    dashboardStats: DashboardData | null,
    honorairesByMonth: HonorairesCalcul[][],
  ): void {
    this.attendanceRate = Math.round(dashboardStats?.tauxValidationGlobal ?? 0);
    this.attendanceInsight =
      (dashboardStats?.totalSeances ?? 0) > 0
        ? this.attendanceRate >= 80
          ? 'Suivi satisfaisant : le taux d’émargement est élevé.'
          : 'Attention : plusieurs séances restent sans émargement validé.'
        : 'Aucune séance disponible pour le calcul.';
    this.attendanceGaugeOptions = {
      ...this.attendanceGaugeOptions,
      series: [this.attendanceRate],
      fill: {
        colors: [
          this.attendanceRate >= 80 ? '#16a34a' : this.attendanceRate >= 60 ? '#f59e0b' : '#dc2626',
        ],
      },
    };

    const statusEntries = Object.entries(dashboardStats?.seancesParStatut ?? {});
    this.sessionStatusOptions = {
      ...this.sessionStatusOptions,
      labels: statusEntries.length
        ? statusEntries.map(([label]) => label)
        : this.sessionStatusOptions.labels,
      series: statusEntries.length ? statusEntries.map(([, value]) => Number(value)) : [0, 0, 0, 0],
    };

    const emargementsEntries = Object.entries(dashboardStats?.emargementsParJour ?? {});
    this.sessionsTrendOptions = {
      ...this.sessionsTrendOptions,
      series: [
        {
          name: 'Émargements validés',
          data: emargementsEntries.map(([, value]) => Number(value)),
        },
      ],
      xaxis: {
        ...this.sessionsTrendOptions.xaxis,
        categories: emargementsEntries.map(([label]) => label),
      },
    };

    const topTeachers = [...(dashboardStats?.topEnseignants ?? [])]
      .sort(
        (a, b) =>
          Number(b.emargementsValides || 0) - Number(a.emargementsValides || 0) ||
          String(a.nom || '').localeCompare(String(b.nom || '')),
      )
      .slice(0, 5);
    this.teacherHoursOptions = {
      ...this.teacherHoursOptions,
      series: [
        {
          name: 'Émargements validés',
          data: topTeachers.map((teacher) => Number(teacher.emargementsValides || 0)),
        },
      ],
      xaxis: {
        ...this.teacherHoursOptions.xaxis,
        categories: topTeachers.map((teacher) => teacher.nom || `Enseignant #${teacher.id}`),
      },
    };

    const monthLabels = this.monthsWindow.map((month) => month.label);
    const honorairesTotals = honorairesByMonth.map((rows) =>
      rows.reduce((total, row) => total + Number(row.montantBrut || 0), 0),
    );
    this.honorairesOptions = {
      ...this.honorairesOptions,
      series: [{ name: 'Honoraires', data: honorairesTotals }],
      xaxis: { ...this.honorairesOptions.xaxis, categories: monthLabels },
    };
  }

  private createLineChartOptions(name: string, color: string): AxisChartOptions {
    return {
      series: [{ name, data: [] }],
      chart: {
        type: 'area',
        height: 300,
        toolbar: { show: false },
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      },
      xaxis: {
        categories: [],
        labels: { style: { colors: '#64748b', fontWeight: 600 } },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: { labels: { style: { colors: '#64748b', fontWeight: 600 } } },
      colors: [color],
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 3 },
      fill: {
        type: 'gradient',
        gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.0, stops: [0, 90, 100] },
      },
      tooltip: {
        theme: 'light',
        style: { fontSize: '13px', fontFamily: "'Plus Jakarta Sans', sans-serif" },
      },
      plotOptions: {},
      grid: {
        show: true,
        borderColor: '#f1f5f9',
        strokeDashArray: 4,
        position: 'back',
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } },
        padding: { top: 0, right: 0, bottom: 0, left: 10 },
      },
    };
  }

  private createBarChartOptions(
    name: string,
    color: string,
    horizontal: boolean,
    suffix = 'h',
  ): AxisChartOptions {
    return {
      series: [{ name, data: [] }],
      chart: {
        type: 'bar',
        height: 280,
        toolbar: { show: false },
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      },
      xaxis: {
        categories: [],
        labels: { style: { colors: '#64748b', fontWeight: 600 } },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: { labels: { style: { colors: '#64748b', fontWeight: 600 } } },
      colors: [color],
      dataLabels: { enabled: false },
      stroke: { show: true, width: 4, colors: ['transparent'] },
      fill: { opacity: 1 },
      tooltip: {
        theme: 'light',
        style: { fontSize: '13px', fontFamily: "'Plus Jakarta Sans', sans-serif" },
        y: {
          formatter: (value) =>
            suffix === 'FCFA'
              ? `${Number(value).toLocaleString('fr-FR')} FCFA`
              : `${value} ${suffix}`,
        },
      },
      plotOptions: { bar: { horizontal, borderRadius: 6, columnWidth: '40%', barHeight: '40%' } },
      grid: { show: false, padding: { top: 0, right: 0, bottom: 0, left: 10 } },
    };
  }

  private getLastMonths(count: number): Array<{ year: number; month: number; label: string }> {
    const formatter = new Intl.DateTimeFormat('fr-FR', { month: 'short' });
    const today = new Date();
    const months: Array<{ year: number; month: number; label: string }> = [];

    for (let index = count - 1; index >= 0; index -= 1) {
      const date = new Date(today.getFullYear(), today.getMonth() - index, 1);
      months.push({
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        label: `${formatter.format(date)} ${String(date.getFullYear()).slice(2)}`,
      });
    }

    return months;
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
