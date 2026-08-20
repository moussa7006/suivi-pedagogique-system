import { ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
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
import { DashboardData, DashboardService } from '../../core/services/dashboard.service';

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
        <div class="hub-grid">
          <a
            *ngFor="let tile of sortedHubTiles"
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
            <div class="legend-item" *ngFor="let seg of cycleLegend; let i = index">
              <span class="legend-dot" [style.background]="seg.color"></span>
              <div class="legend-text">
                <strong>{{ seg.label }}</strong>
                <span>{{ seg.count }} séance{{ seg.count > 1 ? 's' : '' }} · {{ seg.pct }}%</span>
                <p>{{ seg.desc }}</p>
              </div>
            </div>
          </div>
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
                  <h3>Performance par classe</h3>
                  <p>Répartition de l'émargement</p>
                </div>
                <div class="header-icon"><i class="pi pi-chart-pie"></i></div>
              </div>
              <div class="chart-wrapper donut-wrapper">
                <apx-chart
                  [series]="classPerformanceOptions.series"
                  [chart]="classPerformanceOptions.chart"
                  [labels]="classPerformanceOptions.labels"
                  [colors]="classPerformanceOptions.colors"
                  [legend]="classPerformanceOptions.legend"
                  [dataLabels]="classPerformanceOptions.dataLabels"
                  [plotOptions]="classPerformanceOptions.plotOptions"
                  [tooltip]="classPerformanceOptions.tooltip"
                ></apx-chart>
              </div>
            </article>
          </div>

          <article class="bento-card col-span-12">
            <div class="card-header">
              <div>
                <h3>Performance Pédagogique</h3>
                <p>Taux de validation des émargements par enseignant</p>
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
                [legend]="teacherHoursOptions.legend"
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
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05);

        &:hover {
          transform: translateY(-4px);
          border-color: var(--accent);
          box-shadow: 0 12px 24px rgba(15, 23, 42, 0.1);
        }

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
      }

      .hub-tile {
        --tile-color: #6366f1;
        --bg-tint: #ffffff;
        background: linear-gradient(180deg, var(--bg-tint) 0%, #ffffff 80%);
        border: 1px solid color-mix(in srgb, var(--tile-color) 8%, #ffffff);
        border-radius: 16px;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        text-decoration: none;
        color: inherit;
        box-shadow: 0 2px 4px rgba(15, 23, 42, 0.02), 0 1px 2px rgba(15, 23, 42, 0.01);
        transition: all 0.2s ease;
        position: relative;
        overflow: hidden;
      }

      .hub-tile:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.03), 0 4px 6px -2px rgba(15, 23, 42, 0.02);
        border-color: color-mix(in srgb, var(--tile-color) 20%, #ffffff);
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
        width: 44px;
        height: 44px;
        border-radius: 10px;
        background: #ffffff;
        color: var(--tile-color);
        font-size: 1.3rem;
        box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);
      }

      .tile-indicator {
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--tile-color);
        background: #ffffff;
        padding: 4px 10px;
        border-radius: 9999px;
        display: inline-flex;
        align-items: center;
        border: 1px solid color-mix(in srgb, var(--tile-color) 10%, #ffffff);
        box-shadow: 0 1px 2px rgba(15, 23, 42, 0.02);
      }

      .tile-body {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .tile-body h3 {
        margin: 0;
        color: #1f2937;
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
        height: 4px;
        background: color-mix(in srgb, var(--tile-color) 10%, #ffffff);
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
        padding: 28px;
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 24px;
        box-shadow: 0 12px 30px rgba(15, 23, 42, 0.04);
        transition: all 0.3s ease;
      }

      .bento-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 20px 45px rgba(15, 23, 42, 0.08);
        border-color: #cbd5e1;
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
        border-bottom: 1px solid #f1f5f9;
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

  private refreshSubscription: Subscription | null = null;
  private isDashboardLoading = false;

  hubTiles: HubTile[] = [
    {
      label: 'Gestion des Classes',
      description: 'Classes, filières et niveaux d\'enseignement.',
      meta: 'Académique',
      route: '/web/classes',
      icon: 'pi pi-building',
      color: '#3B82F6',
      bgTint: '#F2F6FD',
      indicator: 'Chargement...',
      gaugeValue: 0,
      gaugeLabel: 'Émargement',
    },
    {
      label: 'Catalogue Matières',
      description: 'Matières, programmes et coefficients par niveau.',
      meta: 'Programme',
      route: '/web/matieres',
      icon: 'pi pi-book',
      color: '#10B981',
      bgTint: '#F5FDF9',
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
      color: '#F97316',
      bgTint: '#FFF9F5',
      indicator: 'Chargement...',
      gaugeValue: 0,
      gaugeLabel: 'Performance',
    },
    {
      label: 'Plannings & Horaires',
      description: 'Emplois du temps, séances et réservation de salles.',
      meta: 'Logistique',
      route: '/web/schedule',
      icon: 'pi pi-calendar',
      color: '#06B6D4',
      bgTint: '#F1FAFC',
      indicator: 'Chargement...',
      gaugeValue: 0,
      gaugeLabel: 'Aujourd\'hui',
    },
    {
      label: 'Générateur QR Code',
      description: 'Génération de codes QR pour l\'émargement des enseignants.',
      meta: 'Émargement',
      route: '/web/qr-generator',
      icon: 'pi pi-qrcode',
      color: '#7C3AED',
      bgTint: '#F9F4FD',
      indicator: 'Accès rapide',
      gaugeValue: 0,
      gaugeLabel: 'En attente',
    },
    {
      label: 'Rapports d’Assiduité',
      description: 'Suivi des émargements, présences et assiduité.',
      meta: 'Analyse',
      route: '/web/attendance',
      icon: 'pi pi-chart-bar',
      color: '#EC4899',
      bgTint: '#FEF1F7',
      indicator: 'Chargement...',
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

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef,
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
    const avgTeacherTaux = teachersRows.length
      ? Math.round(teachersRows.reduce((s, r) => s + (r.tauxValidation || 0), 0) / teachersRows.length)
      : 0;
    this.hubTiles[2].indicator = `${totalTeachers} enseignant${totalTeachers > 1 ? 's' : ''} · ${avgTeacherTaux}% performance`;
    this.hubTiles[2].gaugeValue = avgTeacherTaux;

    const planningPct = totalSeances > 0 ? Math.round((sessionsToday / totalSeances) * 100) : 0;
    this.hubTiles[3].indicator = `${totalSeances} séance${totalSeances > 1 ? 's' : ''} · ${sessionsToday} aujourd'hui`;
    this.hubTiles[3].gaugeValue = planningPct;

    this.hubTiles[4].indicator = `${pendingEmargements} en attente`;
    this.hubTiles[4].gaugeValue = pendingEmargements > 0 ? 35 : 100;

    this.hubTiles[5].indicator = `${emargementsValides} émargement${emargementsValides > 1 ? 's' : ''} · ${Math.round(tauxGlobal)}% assiduité`;
    this.hubTiles[5].gaugeValue = Math.round(tauxGlobal);
  }

  private updateAnalytics(
    dashboardStats: DashboardData | null,
  ): void {
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
