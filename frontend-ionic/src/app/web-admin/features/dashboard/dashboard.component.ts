import { ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { interval, of, Subscription } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
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
import { DashboardData, DashboardService, RecentSeanceRow } from '../../core/services/dashboard.service';

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
  bgTint: string;
  indicator: string;
  gaugeValue: number;
  gaugeLabel: string;
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
  tooltip: ApexTooltip;
  fill: ApexFill;
  stroke: ApexStroke;
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
  legend: ApexLegend;
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, NgApexchartsModule],
  template: `
    <div class="dashboard-shell">
      <section class="stats-overview" aria-label="Indicateurs clés">
        @for (stat of stats; track $index) {
          <div class="stat-card" [style.--accent]="stat.color">
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
        }
      </section>

      <section class="quick-access">
        <div class="hub-grid">
          @for (tile of sortedHubTiles; track $index) {
            <a
              [routerLink]="tile.route"
              class="hub-tile"
              [style.--tile-color]="tile.color"
              [style.--bg-tint]="tile.bgTint"
            >
              <div class="tile-top">
                <div class="tile-icon"><i [class]="tile.icon"></i></div>
                <div class="tile-indicator">{{ tile.indicator }}</div>
              </div>
              <div class="tile-body">
                <h3>{{ tile.label }}</h3>
                <div class="tile-footer">
                  <div class="tile-progress">
                    <div class="tile-progress-bar" [style.width.%]="tile.gaugeValue"></div>
                  </div>
                  <i class="pi pi-arrow-right tile-arrow"></i>
                </div>
              </div>
            </a>
          }
        </div>
      </section>

      <section class="emargement-cycle">
        <div class="section-heading">
          <h2>Statut des séances</h2>
          <span>Répartition opérationnelle</span>
        </div>
        <div class="cycle-wrapper">
          <div class="cycle-chart">
            <apx-chart
              [series]="sessionStatusOptions.series"
              [chart]="sessionStatusOptions.chart"
              [labels]="sessionStatusOptions.labels"
              [colors]="sessionStatusOptions.colors"
              [legend]="sessionStatusOptions.legend"
              [dataLabels]="sessionStatusOptions.dataLabels"
              [plotOptions]="sessionStatusOptions.plotOptions"
              [tooltip]="sessionStatusOptions.tooltip"
              [responsive]="sessionStatusOptions.responsive"
              [fill]="sessionStatusOptions.fill"
              [stroke]="sessionStatusOptions.stroke"
            ></apx-chart>
          </div>
          <div class="cycle-legend">
            @for (seg of cycleLegend; track $index) {
              <div class="legend-item">
                <span class="legend-dot" [style.background]="seg.color"></span>
                <div class="legend-text">
                  <strong>{{ seg.label }}</strong>
                  <span>{{ seg.count }} séance{{ seg.count > 1 ? 's' : '' }} · {{ seg.pct }}%</span>
                  <p>{{ seg.desc }}</p>
                </div>
              </div>
            }
          </div>
        </div>
      </section>

      <section class="analysis-section">
        <div class="section-heading">
          <h2>Émargements récents</h2>
          <span>Activité du moment</span>
        </div>

        <div class="bento-grid recent-grid">
          <article class="bento-card taux-card col-span-4">
            <div class="card-header">
              <div>
                <h3>Taux d'émargement</h3>
                <p>Validation globale</p>
              </div>
              <div class="header-icon"><i class="pi pi-percentage"></i></div>
            </div>
            <div class="taux-body">
              <div class="taux-gauge">
                <apx-chart
                  [series]="attendanceGaugeOptions.series"
                  [chart]="attendanceGaugeOptions.chart"
                  [plotOptions]="attendanceGaugeOptions.plotOptions"
                  [labels]="attendanceGaugeOptions.labels"
                  [fill]="attendanceGaugeOptions.fill"
                  [stroke]="attendanceGaugeOptions.stroke"
                ></apx-chart>
              </div>
              <p class="taux-summary">
                <strong>{{ emargementsValides }}</strong> émargés sur {{ totalSeances }} séances
              </p>
              <p class="taux-insight">{{ attendanceInsight }}</p>
            </div>
          </article>

          <article class="bento-card col-span-8">
            <div class="card-header">
              <div>
                <h3>Dernières séances</h3>
                <p>Les plus récentes de l'établissement</p>
              </div>
              <div class="header-icon"><i class="pi pi-clock"></i></div>
            </div>
            <div class="recent-list">
              @for (s of recentSeances; track $index) {
                <div class="recent-item">
                  <div class="recent-date">
                    <span class="recent-day">{{ formatDate(s.dateCours) }}</span>
                    <span class="recent-hour">{{ s.heureDebut }}</span>
                  </div>
                  <div class="recent-mid">
                    <div class="recent-main">{{ s.matiere }}</div>
                    <div class="recent-sub">{{ s.classe }}{{ s.enseignant ? ' · ' + s.enseignant : '' }}</div>
                  </div>
                  <span class="status-badge" [style.--status]="statusColor(s.statut)">{{ s.statut }}</span>
                </div>
              }
              @if (!recentSeances.length) {
                <div class="table-empty">Aucune séance pour le moment.</div>
              }
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
        box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);

        .stat-icon {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          background: var(--accent);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
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
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 20px;
      }

      .hub-tile {
        --tile-color: #6366f1;
        --bg-tint: #ffffff;
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-left: 4px solid var(--tile-color);
        border-radius: 12px;
        padding: 24px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        text-decoration: none;
        color: inherit;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        transition: box-shadow 0.2s ease;
        position: relative;
        overflow: hidden;
      }

      .hub-tile:hover {
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      }

      .tile-top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }

      .tile-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        border-radius: 10px;
        background: var(--bg-tint);
        color: var(--tile-color);
        font-size: 1.5rem;
      }

      .tile-indicator {
        font-size: 0.75rem;
        font-weight: 600;
        padding: 4px 10px;
        border-radius: 6px;
        background: #f3f4f6;
        color: #4b5563;
        display: flex;
        align-items: center;
      }

      .tile-body {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .tile-body h3 {
        margin: 0;
        color: #172033;
        font-size: 1.05rem;
        font-weight: 700;
        letter-spacing: -0.01em;
        text-align: left;
      }

      .tile-footer {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .tile-progress {
        flex: 1;
        height: 6px;
        background: #e5e7eb;
        border-radius: 9999px;
        overflow: hidden;
      }

      .tile-progress-bar {
        height: 100%;
        background: var(--tile-color);
        border-radius: 9999px;
        transition: width 1s ease-out;
      }

      .tile-arrow {
        color: var(--tile-color);
        font-size: 1.1rem;
        font-weight: bold;
        transition: transform 0.2s ease;
      }

      .hub-tile:hover .tile-arrow {
        transform: translateX(4px);
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
      .col-span-12 {
        grid-column: span 12;
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
        padding: 24px;
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 16px;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
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
        border-bottom: 1px solid #e5e7eb;
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
        display: flex;
        align-items: center;
        justify-content: center;
        width: 44px;
        height: 44px;
        flex: 0 0 auto;
        border-radius: 12px;
        background: #1E3A8A; /* Solid navy instead of gradient */
        color: #ffffff;
        font-size: 1.2rem;
      }

      /* Data tables */
      .data-tables .bento-card {
        min-height: 0;
      }

      .table-wrap {
        flex: 1;
        overflow-x: auto;
        margin: 0 -6px;
        padding: 0 6px;
      }

      .data-table {
        width: 100%;
        border-collapse: collapse;
        font-family: 'Plus Jakarta Sans', sans-serif;
      }

      .data-table th {
        text-align: left;
        padding: 10px 8px;
        font-size: 0.72rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: #64748b;
        border-bottom: 1px solid #e2e8f0;
      }

      .data-table td {
        padding: 10px 8px;
        font-size: 0.88rem;
        color: #334155;
        border-bottom: 1px solid #f1f5f9;
        vertical-align: middle;
      }

      .data-table .nowrap {
        white-space: nowrap;
      }

      .data-table tr:last-child td {
        border-bottom: none;
      }

      .data-table th.num,
      .data-table td.num {
        text-align: right;
        white-space: nowrap;
      }

      .recent-table th,
      .recent-table td {
        padding: 12px 10px;
      }

      .status-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 74px;
        padding: 4px 10px;
        border-radius: 9999px;
        font-size: 0.76rem;
        font-weight: 800;
        color: var(--status);
        background: color-mix(in srgb, var(--status) 12%, transparent);
      }

      .cell-main {
        font-weight: 700;
        color: #1e293b;
        line-height: 1.3;
      }

      .cell-sub {
        font-size: 0.76rem;
        font-weight: 600;
        color: #94a3b8;
        margin-top: 2px;
      }

      .table-empty {
        padding: 28px 8px;
        text-align: center;
        color: #94a3b8;
        font-size: 0.88rem;
        font-weight: 600;
      }

      /* Taux card */
      .recent-grid {
        grid-template-columns: repeat(12, minmax(0, 1fr));
      }

      .taux-card {
        min-height: 0;
        justify-content: flex-start;
        align-self: start;
      }

      .taux-body {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        text-align: center;
      }

      .taux-gauge {
        width: 100%;
        max-width: 210px;
        margin: 0 auto;
      }

      .taux-summary {
        margin: 0;
        font-size: 0.82rem;
        color: #475569;
        font-weight: 600;
        line-height: 1.4;
      }

      .taux-summary strong {
        color: #0f172a;
        font-weight: 800;
      }

      .taux-insight {
        margin: 0;
        font-size: 0.76rem;
        color: #64748b;
        font-weight: 600;
        line-height: 1.4;
      }

      /* Recent emargements list */
      .recent-list {
        display: flex;
        flex-direction: column;
      }

      .recent-item {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 12px 6px;
        border-bottom: 1px solid #f1f5f9;
      }

      .recent-item:last-child {
        border-bottom: none;
      }

      .recent-date {
        flex: 0 0 56px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
      }

      .recent-day {
        font-size: 0.85rem;
        font-weight: 800;
        color: #0f172a;
      }

      .recent-hour {
        font-size: 0.72rem;
        font-weight: 600;
        color: #94a3b8;
      }

      .recent-mid {
        flex: 1;
        min-width: 0;
      }

      .recent-main {
        font-weight: 700;
        color: #1e293b;
        font-size: 0.95rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .recent-sub {
        font-size: 0.8rem;
        font-weight: 600;
        color: #94a3b8;
        margin-top: 2px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
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

        /* Emargement Cycle — Donut hero */
        .emargement-cycle {
          display: flex;
          flex-direction: column;
        }

        .cycle-wrapper {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 28px;
          align-items: center;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          padding: 32px;
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.04);
        }

        .cycle-chart {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .cycle-legend {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .legend-item {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .legend-dot {
          flex: 0 0 auto;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          margin-top: 3px;
        }

        .legend-text strong {
          display: block;
          font-size: 0.95rem;
          font-weight: 900;
          color: #0f172a;
        }

        .legend-text span {
          display: block;
          font-size: 0.85rem;
          font-weight: 700;
          color: #64748b;
          margin-bottom: 2px;
        }

        .legend-text p {
          margin: 0;
          font-size: 0.82rem;
          color: #94a3b8;
          font-weight: 500;
          line-height: 1.4;
        }

      /* Responsive Adjustments */
      @media (max-width: 1180px) {
        .stats-overview {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

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
        .col-span-4,
        .col-span-12 {
          grid-column: span 12;
        }

        .cycle-wrapper {
          grid-template-columns: 1fr;
          gap: 20px;
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
  emargementsValides = 0;
  totalSeances = 0;

  private refreshSubscription: Subscription | null = null;
  private isDashboardLoading = false;

  // Données concrètes pour les tableaux de suivi
  recentSeances: RecentSeanceRow[] = [];

  hubTiles: HubTile[] = [
    {
      label: 'Gestion des Classes',
      description: 'Classes, filières et niveaux d\'enseignement.',
      meta: 'Académique',
      route: '/web/classes',
      icon: 'pi pi-building',
      color: '#6366f1',
      bgTint: '#eef2ff',
      indicator: 'Gestion active',
      gaugeValue: 0,
      gaugeLabel: 'Émargement',
    },
    {
      label: 'Catalogue Matières',
      description: 'Matières, programmes et coefficients par niveau.',
      meta: 'Programme',
      route: '/web/matieres',
      icon: 'pi pi-book',
      color: '#059669',
      bgTint: '#ecfdf5',
      indicator: 'Gestion active',
      gaugeValue: 0,
      gaugeLabel: 'Émargement',
    },
    {
      label: 'Corps Enseignant',
      description: 'Professeurs, spécialités et affectations de classes.',
      meta: 'Ressources',
      route: '/web/teachers',
      icon: 'pi pi-id-card',
      color: '#d97706',
      bgTint: '#fffbeb',
      indicator: 'Ressources',
      gaugeValue: 0,
      gaugeLabel: 'Performance',
    },
    {
      label: 'Plannings & Horaires',
      description: 'Emplois du temps, séances et réservation de salles.',
      meta: 'Logistique',
      route: '/web/schedule',
      icon: 'pi pi-calendar',
      color: '#0d9488',
      bgTint: '#f0fdfa',
      indicator: 'Logistique',
      gaugeValue: 0,
      gaugeLabel: 'Aujourd\'hui',
    },
    {
      label: 'Générateur QR Code',
      description: 'Génération de codes QR pour l\'émargement des enseignants.',
      meta: 'Émargement',
      route: '/web/qr-generator',
      icon: 'pi pi-qrcode',
      color: '#7c3aed',
      bgTint: '#f5f3ff',
      indicator: 'Accès rapide',
      gaugeValue: 0,
      gaugeLabel: 'QR code',
    },
    {
      label: 'Rapports d’Assiduité',
      description: 'Suivi des émargements, présences et assiduité.',
      meta: 'Analyse',
      route: '/web/attendance',
      icon: 'pi pi-chart-bar',
      color: '#be123c',
      bgTint: '#fff1f2',
      indicator: 'Analyse',
      gaugeValue: 0,
      gaugeLabel: 'Assiduité',
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
    chart: { type: 'radialBar', height: 190, sparkline: { enabled: true } },
    plotOptions: {
      radialBar: {
        startAngle: -120,
        endAngle: 120,
        hollow: { size: '65%' },
        track: { background: '#e2e8f0', strokeWidth: '100%' },
        dataLabels: {
          name: { show: true, offsetY: 18, color: '#64748b', fontSize: '12px', fontWeight: 800 },
          value: {
            offsetY: -10,
            color: '#0f172a',
            fontSize: '30px',
            fontWeight: 900,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            formatter: (value: number) => `${Math.round(value)}%`,
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
    chart: { type: 'donut', height: 420, fontFamily: "'Plus Jakarta Sans', sans-serif" },
    labels: ['Émargée', 'En cours', 'Prévue', 'Non émargée'],
    colors: ['#22c55e', '#38bdf8', '#fbbf24', '#a78bfa'],
    legend: { show: false },
    dataLabels: {
      enabled: true,
      formatter: (value: number) => `${Math.round(value)}%`,
      style: { fontWeight: '900', fontSize: '14px' },
      dropShadow: { enabled: false },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '72%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Séances',
              fontSize: '16px',
              fontWeight: 900,
              color: '#64748b',
              formatter: (w: { globals: { seriesTotals: number[] } }) =>
                `${w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0)}`,
            },
            value: {
              fontSize: '32px',
              fontWeight: 900,
              color: '#0f172a',
              formatter: (val: number) => `${Math.round(val)}`,
            },
          },
        },
      },
    },
    tooltip: {
      theme: 'light',
      style: { fontSize: '13px', fontFamily: "'Plus Jakarta Sans', sans-serif" },
      y: {
        formatter: (val: number) => `${val} séance${val > 1 ? 's' : ''}`,
      },
    },
    fill: { type: 'solid' },
    stroke: { width: 2, colors: ['#ffffff'] },
    responsive: [
      { breakpoint: 760, options: { chart: { height: 320 } } },
    ],
  };

  classPerformanceOptions: DonutChartOptions = {
    series: [0, 0, 0],
    chart: { type: 'donut', height: 260, fontFamily: "'Plus Jakarta Sans', sans-serif" },
    labels: ['Excellent', 'Moyen', 'Faible'],
    colors: ['#22c55e', '#f59e0b', '#dc2626'],
    legend: { position: 'bottom', fontWeight: 800 },
    dataLabels: { enabled: true, style: { fontWeight: '900' } },
    plotOptions: {
      pie: {
        donut: {
          size: '68%',
          labels: { show: true, total: { show: true, label: 'Classes', fontWeight: 900 } },
        },
      },
    },
    tooltip: { theme: 'light' },
    fill: { type: 'solid' },
    stroke: { width: 2, colors: ['#ffffff'] },
    responsive: [
      { breakpoint: 760, options: { chart: { height: 260 }, legend: { position: 'bottom' } } },
    ],
  };

  classLegend: { label: string; color: string; count: number; pct: number; desc: string }[] = [
    { label: 'Excellent', color: '#22c55e', count: 0, pct: 0, desc: 'Taux d\'émargement ≥ 80% — suivi rigoureux.' },
    { label: 'Moyen', color: '#f59e0b', count: 0, pct: 0, desc: 'Taux d\'émargement 60–79% — suivi à améliorer.' },
    { label: 'Faible', color: '#dc2626', count: 0, pct: 0, desc: 'Taux d\'émargement < 60% — suivi insuffisant.' },
  ];

  cycleLegend: { label: string; color: string; count: number; pct: number; desc: string }[] = [
    { label: 'Émargée', color: '#22c55e', count: 0, pct: 0, desc: 'L\'enseignant a pointé via QR code — émargement effectué.' },
    { label: 'En cours', color: '#38bdf8', count: 0, pct: 0, desc: 'La séance se déroule actuellement.' },
    { label: 'Prévue', color: '#fbbf24', count: 0, pct: 0, desc: 'Séance planifiée, en attente du pointage.' },
    { label: 'Non émargée', color: '#a78bfa', count: 0, pct: 0, desc: 'Séance écoulée sans émargement.' },
  ];

  sessionsTrendOptions: AxisChartOptions = this.createLineChartOptions(
    'Émargements',
    '#6366f1',
  );
  teacherHoursOptions: AxisChartOptions = {
    series: [
      { name: 'Émargements', data: [] },
      { name: 'Séances planifiées', data: [] },
    ],
    chart: {
      type: 'bar',
      height: 400,
      toolbar: { show: false },
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      stacked: false,
    },
    xaxis: {
      categories: [],
      labels: { style: { colors: '#64748b', fontWeight: 600 } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { labels: { style: { colors: '#1e293b', fontWeight: 700 } } },
    colors: ['#3b82f6', '#cbd5e1'],
    dataLabels: { enabled: false },
    stroke: { show: true, width: 4, colors: ['transparent'] },
    fill: { opacity: 1 },
    tooltip: {
      theme: 'light',
      style: { fontSize: '13px', fontFamily: "'Plus Jakarta Sans', sans-serif" },
      y: { formatter: (value: number) => `${value} séance${value > 1 ? 's' : ''}` },
    },
    plotOptions: { bar: { horizontal: true, borderRadius: 6, barHeight: '50%' } },
    grid: { show: true, borderColor: '#f1f5f9', strokeDashArray: 4, position: 'back' },
    legend: { show: true, position: 'top', fontWeight: 800, fontSize: '13px' },
  };

  private readonly dashboardService = inject(DashboardService);
  private readonly cdr = inject(ChangeDetectorRef);

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
    if (this.isDashboardLoading) {
      return;
    }

    this.isDashboardLoading = true;

    this.dashboardService.getDashboardData().pipe(
      catchError((error) => {
        console.error('[Dashboard] Erreur API Dashboard:', error);
        return of(null as DashboardData | null);
      }),
      finalize(() => {
        this.isDashboardLoading = false;
      }),
    ).subscribe((dashboardStats) => {
      this.applyBackendStats(dashboardStats);
      this.updateAnalytics(dashboardStats);
      this.cdr.detectChanges();
    });
  }

  private applyBackendStats(dashboardStats: DashboardData | null): void {
    const totalTeachers = dashboardStats?.totalTeachers ?? 0;
    const totalClasses = dashboardStats?.totalClasses ?? 0;
    const totalMatieres = dashboardStats?.totalMatieres ?? 0;
    const sessionsToday = dashboardStats?.sessionsToday ?? 0;
    const totalSeances = dashboardStats?.totalSeances ?? 0;
    const emargementsValides = dashboardStats?.emargementsValides ?? 0;
    const pendingEmargements = dashboardStats?.pendingEmargements ?? 0;
    const tauxGlobal = dashboardStats?.tauxValidationGlobal ?? 0;

    // Conservés pour la carte Taux d'émargement
    this.emargementsValides = emargementsValides;
    this.totalSeances = totalSeances;

    this.stats[0].value = totalTeachers;
    this.stats[1].value = totalClasses;
    this.stats[2].value = totalMatieres;
    this.stats[3].value = sessionsToday;

    // --- Gauges & enriched indicators for hub tiles ---
    // Index mapping: 0=Classes, 1=Matières, 2=Enseignant, 3=Planning, 4=QR, 5=Assiduité

    const classesRows = dashboardStats?.classesEmargement ?? [];
    const avgClassTaux = classesRows.length
      ? Math.round(classesRows.reduce((s, r) => s + (r.tauxValidation || 0), 0) / classesRows.length)
      : 0;
    this.hubTiles[0].indicator = `${totalClasses} classe${totalClasses > 1 ? 's' : ''} · ${avgClassTaux}% émargé`;
    this.hubTiles[0].gaugeValue = avgClassTaux;

    const matieresRows = dashboardStats?.matieresVolumetrie ?? [];
    const avgMatiereTaux = matieresRows.length
      ? Math.round(matieresRows.reduce((s, r) => s + (r.tauxValidation || 0), 0) / matieresRows.length)
      : 0;
    this.hubTiles[1].indicator = `${totalMatieres} matière${totalMatieres > 1 ? 's' : ''} · ${avgMatiereTaux}% émargé`;
    this.hubTiles[1].gaugeValue = avgMatiereTaux;

    const teachersRows = dashboardStats?.topEnseignants ?? [];
    // topEnseignants contient tous les enseignants ayant au moins une seance
    // planifiee (actifs). On moyenne sur eux et on affiche ce nombre plutot
    // que totalTeachers (qui inclut les enseignants sans aucune seance).
    const activeTeachers = teachersRows.length;
    const avgTeacherTaux = activeTeachers
      ? Math.round(teachersRows.reduce((s, r) => s + (r.tauxValidation || 0), 0) / activeTeachers)
      : 0;
    this.hubTiles[2].indicator = `${activeTeachers} enseignant${activeTeachers > 1 ? 's' : ''} actif${activeTeachers > 1 ? 's' : ''} · ${avgTeacherTaux}% performance`;
    this.hubTiles[2].gaugeValue = avgTeacherTaux;

    const planningPct = totalSeances > 0 ? Math.round((sessionsToday / totalSeances) * 100) : 0;
    this.hubTiles[3].indicator = `${totalSeances} séance${totalSeances > 1 ? 's' : ''} · ${sessionsToday} aujourd'hui`;
    this.hubTiles[3].gaugeValue = planningPct;

    // QR : jauge = proportion de séances ayant donné lieu à un émargement.
    const qrScanRate = totalSeances > 0
      ? Math.round(((emargementsValides + pendingEmargements) / totalSeances) * 100)
      : 0;
    this.hubTiles[4].indicator = `${emargementsValides + pendingEmargements} émargement${emargementsValides + pendingEmargements > 1 ? 's' : ''} · ${qrScanRate}% scannés`;
    this.hubTiles[4].gaugeValue = qrScanRate;

    this.hubTiles[5].indicator = `${emargementsValides} émargement${emargementsValides > 1 ? 's' : ''} · ${Math.round(tauxGlobal)}% assiduité`;
    this.hubTiles[5].gaugeValue = Math.round(tauxGlobal);
  }

  private updateAnalytics(
    dashboardStats: DashboardData | null,
  ): void {
    // Tableaux concrets du suivi
    this.recentSeances = dashboardStats?.recentSeances ?? [];

    this.attendanceRate = Math.round(dashboardStats?.tauxValidationGlobal ?? 0);
    this.attendanceInsight =
      (dashboardStats?.totalSeances ?? 0) > 0
        ? this.attendanceRate >= 80
          ? 'Suivi satisfaisant : le taux d\'émargement est élevé.'
          : 'Attention : plusieurs séances restent sans émargement.'
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
    const statusSeries = statusEntries.length
      ? statusEntries.map(([, value]) => Number(value))
      : [0, 0, 0, 0];
    this.sessionStatusOptions = {
      ...this.sessionStatusOptions,
      labels: statusEntries.length
        ? statusEntries.map(([label]) => label)
        : this.sessionStatusOptions.labels,
      series: statusSeries,
    };

    // --- Narrative legend for the big donut ---
    const statusTotal = statusSeries.reduce((a: number, b: number) => a + b, 0);
    this.cycleLegend = this.cycleLegend.map((seg, i) => ({
      ...seg,
      count: statusSeries[i] ?? 0,
      pct: statusTotal > 0 ? Math.round(((statusSeries[i] ?? 0) / statusTotal) * 100) : 0,
    }));

    // --- Performance par classe donut + narrative legend ---
    const classesRows = dashboardStats?.classesEmargement ?? [];
    const perfCounts = {
      EXCELLENT: 0,
      MOYEN: 0,
      FAIBLE: 0,
    } as { [key: string]: number };
    for (const row of classesRows) {
      const s = String(row.statut || '').toUpperCase();
      if (s in perfCounts) {
        perfCounts[s] += 1;
      }
    }
    const perfSeries = [perfCounts['EXCELLENT'], perfCounts['MOYEN'], perfCounts['FAIBLE']];
    const perfTotal = perfSeries.reduce((a: number, b: number) => a + b, 0);
    this.classPerformanceOptions = {
      ...this.classPerformanceOptions,
      series: perfSeries,
    };
    this.classLegend = this.classLegend.map((seg, i) => ({
      ...seg,
      count: perfSeries[i] ?? 0,
      pct: perfTotal > 0 ? Math.round(((perfSeries[i] ?? 0) / perfTotal) * 100) : 0,
    }));

    const emargementsEntries = Object.entries(dashboardStats?.emargementsParJour ?? {});
    this.sessionsTrendOptions = {
      ...this.sessionsTrendOptions,
      series: [
        {
          name: 'Émargements',
          data: emargementsEntries.map(([, value]) => Number(value)),
        },
      ],
      xaxis: {
        ...this.sessionsTrendOptions.xaxis,
        categories: emargementsEntries.map(([label]) => label),
      },
    };

    const topTeachers = [...(dashboardStats?.topEnseignants ?? [])]
      .filter((teacher) => Number(teacher.seancesPlanifiees || 0) > 0)
      .sort(
        (a, b) =>
          Number(b.tauxValidation || 0) - Number(a.tauxValidation || 0) ||
          Number(b.emargementsValides || 0) - Number(a.emargementsValides || 0) ||
          String(a.nom || '').localeCompare(String(b.nom || '')),
      )
      .slice(0, 5);

    // Identifier le prof avec le plus d'emargements valides (mise en valeur)
    const topEmargementsIdx = topTeachers.reduce(
      (bestIdx, teacher, idx) =>
        Number(teacher.emargementsValides || 0) >
        Number(topTeachers[bestIdx]?.emargementsValides || 0)
          ? idx
          : bestIdx,
      0,
    );

    this.teacherHoursOptions = {
      ...this.teacherHoursOptions,
      series: [
        {
          name: 'Émargements',
          data: topTeachers.map((teacher) => Number(teacher.emargementsValides || 0)),
        },
        {
          name: 'Séances planifiées',
          data: topTeachers.map((teacher) => Number(teacher.seancesPlanifiees || 0)),
        },
      ],
      xaxis: {
        ...this.teacherHoursOptions.xaxis,
        categories: topTeachers.map(
          (teacher) =>
            `${teacher.nom || `Enseignant #${teacher.id}`}${teacher.specialite ? ` (${teacher.specialite})` : ''}`,
        ),
      },
    };
  }

  private createLineChartOptions(name: string, color: string): AxisChartOptions {
    return {
      series: [{ name, data: [] }],
      chart: {
        type: 'bar', // Changed from area to bar for clearer daily data
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
      stroke: { show: true, width: 2, colors: ['transparent'] },
      fill: { opacity: 1 },
      tooltip: {
        theme: 'light',
        style: { fontSize: '13px', fontFamily: "'Plus Jakarta Sans', sans-serif" },
      },
      plotOptions: {
        bar: { borderRadius: 4, columnWidth: '60%' }
      },
      grid: {
        show: true,
        borderColor: '#f1f5f9',
        strokeDashArray: 4,
        position: 'back',
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } },
        padding: { top: 0, right: 0, bottom: 0, left: 10 },
      },
      legend: { show: false },
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
          formatter: (value: number) =>
            suffix === 'FCFA'
              ? `${Number(value).toLocaleString('fr-FR')} FCFA`
              : `${value} ${suffix}`,
        },
      },
      plotOptions: { bar: { horizontal, borderRadius: 6, columnWidth: '40%', barHeight: '40%' } },
      grid: { show: false, padding: { top: 0, right: 0, bottom: 0, left: 10 } },
      legend: { show: false },
    };
  }

  private loadAdminProfile(): void {
    const savedUser = sessionStorage.getItem('user');

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

  statusColor(statut: string): string {
    switch ((statut || '').toLowerCase()) {
      case 'validée':
      case 'validee':
        return '#16a34a';
      case 'en cours':
        return '#0284c7';
      case 'prévue':
      case 'prevue':
        return '#d97706';
      case 'terminée':
      case 'terminee':
        return '#64748b';
      default:
        return '#64748b';
    }
  }

  formatDate(iso: string): string {
    if (!iso) {
      return '';
    }
    const parts = iso.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}`;
    }
    return iso;
  }
}
