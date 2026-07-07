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
import { DashboardService } from '../../core/services/dashboard.service';
import { TeacherService } from '../../core/services/teacher.service';
import { ClasseService } from '../../core/services/classe.service';
import { MatiereService } from '../../core/services/matiere.service';
import { ScheduleService } from '../../core/services/schedule.service';
import { HonorairesService } from '../../core/services/honoraires.service';
import { Seance } from '../../core/models/seance.model';
import { Teacher } from '../../core/models/user.model';
import { Classe } from '../../core/models/classe.model';
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
    <div class="bento-dashboard">
      <!-- Hero Section -->
      <div class="hero-bento">
        <div class="hero-content">
          <span class="hero-badge"><i class="pi pi-sparkles"></i> EduTrack OS</span>
          <h1 class="hero-title">Bonjour, {{ adminName }} 👋</h1>
          <p class="hero-subtitle">
            Voici un résumé premium de l'activité pédagogique et financière de votre établissement.
            Prenez des décisions éclairées, plus rapidement.
          </p>
          <div class="hero-actions">
            <button class="btn-dark" [routerLink]="['/schedule']">
              <i class="pi pi-plus"></i> Nouvelle séance
            </button>
            <button class="btn-glass" [routerLink]="['/attendance']">
              <i class="pi pi-chart-bar"></i> Présences
            </button>
          </div>
        </div>
        <!-- Abstract Glassmorphism Shapes -->
        <div class="blob blob-1"></div>
        <div class="blob blob-2"></div>
      </div>

      <!-- KPI Grid -->
      <div class="kpi-grid">
        <div class="kpi-card" *ngFor="let stat of stats">
          <div class="kpi-header">
            <span class="kpi-title">{{ stat.label }}</span>
            <div class="kpi-icon" [style.background]="stat.color + '1A'" [style.color]="stat.color">
              <i [class]="stat.icon"></i>
            </div>
          </div>
          <div class="kpi-value">{{ stat.value }}{{ stat.suffix }}</div>
          <div class="kpi-trend" [class]="stat.trendClass">
            <i
              class="pi"
              [class.pi-arrow-up]="stat.trendClass === 'positive'"
              [class.pi-arrow-down]="stat.trendClass === 'negative'"
              [class.pi-minus]="stat.trendClass === 'neutral'"
            ></i>
            {{ stat.trend }}
          </div>
        </div>
      </div>

      <!-- Bento Grid Layout -->
      <div class="bento-grid">
        <!-- Chart 1: Area -->
        <div class="bento-card col-span-8">
          <div class="card-header">
            <h3>Évolution des séances</h3>
            <p>Volume mensuel des réalisations</p>
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
        </div>

        <!-- Gauges & Donut (Side column) -->
        <div class="bento-column col-span-4">
          <div class="bento-card flex-center-chart">
            <div class="card-header">
              <h3>Taux d'émargement</h3>
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
          </div>
          <div class="bento-card flex-center-chart">
            <div class="card-header">
              <h3>Statut des séances</h3>
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
          </div>
        </div>

        <!-- Top Teachers -->
        <div class="bento-card col-span-6">
          <div class="card-header">
            <h3>Top Enseignants</h3>
            <p>Heures réalisées</p>
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
        </div>

        <!-- Honoraires -->
        <div class="bento-card col-span-6">
          <div class="card-header">
            <h3>Honoraires</h3>
            <p>Prévisions mensuelles</p>
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
        </div>
      </div>

      <!-- Quick Access Hub -->
      <div class="hub-container">
        <h3 class="hub-title">Accès rapide</h3>
        <div class="hub-grid">
          <a *ngFor="let tile of sortedHubTiles" [routerLink]="tile.route" class="hub-tile">
            <div
              class="tile-icon"
              [style.background]="tile.color + '1A'"
              [style.color]="tile.color"
            >
              <i [class]="tile.icon"></i>
            </div>
            <div class="tile-content">
              <h4>{{ tile.label }}</h4>
              <p>{{ tile.description }}</p>
            </div>
            <i class="pi pi-arrow-right tile-arrow"></i>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

      .bento-dashboard {
        font-family: 'Plus Jakarta Sans', sans-serif;
        max-width: 1440px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 24px;
        padding-bottom: 32px;
      }

      .hero-bento {
        position: relative;
        background: #0f172a;
        border-radius: 32px;
        padding: 56px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        overflow: hidden;
        box-shadow: 0 30px 60px -15px rgba(15, 23, 42, 0.4);
      }
      .hero-content {
        position: relative;
        z-index: 2;
        color: white;
        max-width: 60%;
      }
      .hero-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.15);
        padding: 8px 16px;
        border-radius: 99px;
        font-size: 0.85rem;
        font-weight: 700;
        margin-bottom: 24px;
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }
      .hero-title {
        font-size: 3rem;
        font-weight: 800;
        margin: 0 0 12px 0;
        letter-spacing: -0.04em;
        line-height: 1.1;
      }
      .hero-subtitle {
        color: #94a3b8;
        font-size: 1.15rem;
        margin: 0;
        line-height: 1.6;
      }
      .hero-actions {
        position: relative;
        z-index: 2;
        display: flex;
        gap: 16px;
        margin-top: 32px;
      }

      .btn-dark {
        background: #3b82f6;
        color: white;
        border: none;
        padding: 16px 28px;
        border-radius: 18px;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 10px 20px -5px rgba(59, 130, 246, 0.5);
        text-decoration: none;
        font-size: 0.95rem;
      }
      .btn-dark:hover {
        background: #2563eb;
        transform: translateY(-3px);
        box-shadow: 0 15px 25px -5px rgba(59, 130, 246, 0.6);
      }

      .btn-glass {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        backdrop-filter: blur(16px);
        padding: 16px 28px;
        border-radius: 18px;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        text-decoration: none;
        font-size: 0.95rem;
      }
      .btn-glass:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: translateY(-3px);
        border-color: rgba(255, 255, 255, 0.3);
      }

      .blob {
        position: absolute;
        border-radius: 50%;
        filter: blur(90px);
        z-index: 1;
        pointer-events: none;
      }
      .blob-1 {
        top: -40%;
        right: 5%;
        width: 500px;
        height: 500px;
        background: rgba(59, 130, 246, 0.5);
      }
      .blob-2 {
        bottom: -30%;
        right: -10%;
        width: 400px;
        height: 400px;
        background: rgba(168, 85, 247, 0.4);
      }

      .kpi-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 24px;
      }
      .kpi-card {
        background: white;
        border-radius: 28px;
        padding: 28px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
        border: 1px solid #f1f5f9;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .kpi-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.06);
        border-color: #e2e8f0;
      }
      .kpi-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 20px;
      }
      .kpi-title {
        color: #64748b;
        font-weight: 700;
        font-size: 0.95rem;
      }
      .kpi-icon {
        width: 52px;
        height: 52px;
        border-radius: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.4rem;
      }
      .kpi-value {
        font-size: 2.4rem;
        font-weight: 800;
        color: #0f172a;
        margin-bottom: 12px;
        letter-spacing: -0.03em;
        line-height: 1;
      }
      .kpi-trend {
        font-size: 0.85rem;
        font-weight: 700;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 10px;
        border-radius: 10px;
      }
      .positive {
        color: #10b981;
        background: #d1fae5;
      }
      .negative {
        color: #ef4444;
        background: #fee2e2;
      }
      .neutral {
        color: #64748b;
        background: #f1f5f9;
      }

      .bento-grid {
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        gap: 24px;
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
        gap: 24px;
      }
      .bento-card {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border-radius: 32px;
        padding: 28px;
        box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.03),
                    inset 0 0 0 1px rgba(255, 255, 255, 0.5);
        border: 1px solid rgba(226, 232, 240, 0.6);
        display: flex;
        flex-direction: column;
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                    box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .bento-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.08),
                    inset 0 0 0 1px rgba(255, 255, 255, 0.8);
      }
      .card-header {
        margin-bottom: 20px;
      }
      .card-header h3 {
        margin: 0;
        font-size: 1.2rem;
        font-weight: 800;
        color: #0f172a;
        letter-spacing: -0.02em;
      }
      .card-header p {
        margin: 6px 0 0 0;
        font-size: 0.9rem;
        color: #64748b;
        font-weight: 500;
      }

      .chart-wrapper {
        flex: 1;
        min-height: 250px;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      .flex-center-chart {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      .gauge-wrapper,
      .donut-wrapper {
        align-items: center;
        justify-content: center;
        margin-top: -10px;
      }

      .watch-list {
        display: none;
      }
      .watch-item {
        display: none;
      }
      .watch-item:hover {
        display: none;
      }
      .watch-info {
        display: none;
      }
      .watch-name {
        display: none;
      }
      .watch-meta {
        display: none;
      }
      .watch-score {
        display: none;
      }
      .text-red {
        display: none;
      }
      .text-orange {
        display: none;
      }
      .text-green {
        display: none;
      }

      .hub-container {
        margin-top: 16px;
      }
      .hub-title {
        font-size: 1.4rem;
        font-weight: 800;
        color: #0f172a;
        margin: 0 0 24px 0;
        letter-spacing: -0.03em;
      }
      .hub-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 24px;
      }
      .hub-tile {
        display: flex;
        align-items: center;
        gap: 18px;
        background: white;
        padding: 24px;
        border-radius: 28px;
        text-decoration: none;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
        border: 1px solid #f1f5f9;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .hub-tile:hover {
        transform: translateY(-5px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.06);
        border-color: #e2e8f0;
      }
      .tile-icon {
        width: 56px;
        height: 56px;
        border-radius: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.5rem;
        flex-shrink: 0;
      }
      .tile-content h4 {
        margin: 0;
        font-size: 1.05rem;
        font-weight: 800;
        color: #0f172a;
        letter-spacing: -0.01em;
      }
      .tile-content p {
        margin: 6px 0 0 0;
        font-size: 0.9rem;
        color: #64748b;
        line-height: 1.4;
        font-weight: 500;
      }
      .tile-arrow {
        margin-left: auto;
        color: #cbd5e1;
        font-size: 1.2rem;
        transition: all 0.3s;
      }
      .hub-tile:hover .tile-arrow {
        transform: translateX(6px);
        color: #0f172a;
      }

      @media (max-width: 1024px) {
        .bento-grid,
        .kpi-grid {
          grid-template-columns: repeat(12, 1fr);
        }
        .col-span-8,
        .col-span-6,
        .col-span-4 {
          grid-column: span 12;
        }
        .hub-grid {
          grid-template-columns: repeat(2, 1fr);
        }
        .hero-bento {
          flex-direction: column;
          align-items: flex-start;
          gap: 40px;
          padding: 40px;
        }
        .hero-content {
          max-width: 100%;
        }
      }
      @media (max-width: 768px) {
        .bento-grid,
        .kpi-grid,
        .hub-grid {
          grid-template-columns: 1fr;
        }
        .col-span-8,
        .col-span-6,
        .col-span-4 {
          grid-column: span 1;
        }
        .hero-actions {
          flex-direction: column;
          width: 100%;
        }
        .btn-dark,
        .btn-glass {
          width: 100%;
          justify-content: center;
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
      label: "Séances aujourd'hui",
      value: 0,
      suffix: '',
      icon: 'pi pi-calendar-plus',
      color: '#7c3aed',
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
    fill: { colors: ['#2563eb'] },
    stroke: { lineCap: 'round' },
  };

  sessionStatusOptions: DonutChartOptions = {
    series: [0, 0, 0],
    chart: { type: 'donut', height: 260, fontFamily: "'Plus Jakarta Sans', sans-serif" },
    labels: ['Prévues', 'En cours', 'Terminées'],
    colors: ['#f59e0b', '#2563eb', '#16a34a'],
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
    'Séances réalisées',
    '#8b5cf6',
  );
  teacherHoursOptions: AxisChartOptions = this.createBarChartOptions('Heures', '#3b82f6', true);
  honorairesOptions: AxisChartOptions = this.createBarChartOptions(
    'Montant',
    '#ec4899',
    false,
    'FCFA',
  );

  constructor(
    private dashboardService: DashboardService,
    private teacherService: TeacherService,
    private classeService: ClasseService,
    private matiereService: MatiereService,
    private scheduleService: ScheduleService,
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
          return of(null);
        }),
      ),
      teachers: this.teacherService.getTeachers().pipe(
        catchError((error) => {
          console.error('[Dashboard] Erreur chargement enseignants:', error);
          return of([] as Teacher[]);
        }),
      ),
      classes: this.classeService.getAll().pipe(
        catchError((error) => {
          console.error('[Dashboard] Erreur chargement classes:', error);
          return of([] as Classe[]);
        }),
      ),
      matieres: this.matiereService.getAll().pipe(
        catchError((error) => {
          console.error('[Dashboard] Erreur chargement matières:', error);
          return of([]);
        }),
      ),
      seances: this.scheduleService.getAllSeances().pipe(
        catchError((error) => {
          console.error('[Dashboard] Erreur chargement séances:', error);
          return of([] as Seance[]);
        }),
      ),
      honorairesByMonth: forkJoin(honorairesRequests),
    }).subscribe(({ dashboardStats, teachers, classes, matieres, seances, honorairesByMonth }) => {
      const today = new Date().toISOString().slice(0, 10);
      const seancesTodayCount = seances.filter(
        (seance) => this.toDateKey(seance.dateCours) === today,
      ).length;

      this.stats[0].value = teachers.length || dashboardStats?.totalTeachers || 0;
      this.stats[1].value = classes.length || dashboardStats?.totalClasses || 0;
      this.stats[2].value = matieres.length || dashboardStats?.totalMatieres || 0;
      this.stats[3].value = seancesTodayCount || dashboardStats?.sessionsToday || 0;

      this.hubTiles[2].indicator = `${teachers.length} enseignant${teachers.length > 1 ? 's' : ''}`;
      this.hubTiles[0].indicator = `${classes.length} classe${classes.length > 1 ? 's' : ''}`;
      this.hubTiles[1].indicator = `${matieres.length} matière${matieres.length > 1 ? 's' : ''}`;
      this.hubTiles[3].indicator = `${seances.length} séance${seances.length > 1 ? 's' : ''}`;
      this.hubTiles[5].indicator = `${this.countEmargedSeances(seances)} émargement${this.countEmargedSeances(seances) > 1 ? 's' : ''}`;

      this.updateAnalytics(seances, teachers, classes, honorairesByMonth);
    });
  }

  private updateAnalytics(
    seances: Seance[],
    teachers: Teacher[],
    classes: Classe[],
    honorairesByMonth: HonorairesCalcul[][],
  ): void {
    const emargedCount = this.countEmargedSeances(seances);
    this.attendanceRate = seances.length ? Math.round((emargedCount / seances.length) * 100) : 0;
    this.attendanceInsight = seances.length
      ? this.attendanceRate >= 80
        ? 'Suivi satisfaisant : le taux d’émargement est élevé.'
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

    const computedStatuses = seances.map((seance) => this.getComputedSeanceStatus(seance));
    const statusCounts = [
      computedStatuses.filter((status) => status === 'PREVUE').length,
      computedStatuses.filter((status) => status === 'EN_COURS').length,
      computedStatuses.filter((status) => status === 'TERMINEE').length,
    ];
    this.sessionStatusOptions = { ...this.sessionStatusOptions, series: statusCounts };

    const monthLabels = this.monthsWindow.map((month) => month.label);
    const realizedByMonth = this.monthsWindow.map(
      (month) =>
        seances.filter(
          (seance) =>
            this.isSameMonth(seance.dateCours, month.year, month.month) &&
            this.isRealizedSeance(seance),
        ).length,
    );
    this.sessionsTrendOptions = {
      ...this.sessionsTrendOptions,
      series: [{ name: 'Séances réalisées', data: realizedByMonth }],
      xaxis: { ...this.sessionsTrendOptions.xaxis, categories: monthLabels },
    };

    const hoursByTeacherMap = this.groupHoursByTeacher(seances);
    const hoursByTeacher = teachers
      .filter((teacher) => typeof teacher.id === 'number')
      .map((teacher) => ({
        label: `${teacher.prenom} ${teacher.nom}`.trim() || `Enseignant #${teacher.id}`,
        totalHours: hoursByTeacherMap.get(teacher.id as number) || 0,
      }))
      .sort((a, b) => b.totalHours - a.totalHours || a.label.localeCompare(b.label))
      .slice(0, 5);
    this.teacherHoursOptions = {
      ...this.teacherHoursOptions,
      series: [{ name: 'Heures effectuées', data: hoursByTeacher.map((item) => item.totalHours) }],
      xaxis: {
        ...this.teacherHoursOptions.xaxis,
        categories: hoursByTeacher.map((item) => item.label),
      },
    };

    const honorairesTotals = honorairesByMonth.map((rows) =>
      rows.reduce((total, row) => total + Number(row.montantBrut || 0), 0),
    );
    this.honorairesOptions = {
      ...this.honorairesOptions,
      series: [{ name: 'Honoraires', data: honorairesTotals }],
      xaxis: { ...this.honorairesOptions.xaxis, categories: monthLabels },
    this.honorairesOptions.series = [
      {
        name: 'Honoraires (FCFA)',
        data: Array.from(honorairesTotals.values()),
      },
    ];
    this.honorairesOptions.xaxis = {
      categories: monthLabels,
    };
  }

  private groupHoursByTeacher(seances: Seance[]): Map<number, number> {
    const result = new Map<number, number>();

    seances
      .filter((seance) => this.isRealizedSeance(seance))
      .forEach((seance) => {
        const hours = this.extractHours(seance.heureDebutReelle, seance.heureFinReelle);
        result.set(
          seance.enseignantId,
          Math.round(((result.get(seance.enseignantId) || 0) + hours) * 10) / 10,
        );
      });

    return result;
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

  private countEmargedSeances(seances: Seance[]): number {
    return seances.filter((seance) => !!seance.emargementId).length;
  }

  private isRealizedSeance(seance: Seance): boolean {
    return this.getComputedSeanceStatus(seance) === 'TERMINEE';
  }

  private getComputedSeanceStatus(seance: Seance): 'PREVUE' | 'EN_COURS' | 'TERMINEE' {
    if (seance.statut === 'TERMINEE' || !!seance.emargementId || !!seance.ficheProgressionId) {
      return 'TERMINEE';
    }

    const start = this.combineDateAndTime(seance.dateCours, seance.heureDebutReelle);
    const end = this.combineDateAndTime(seance.dateCours, seance.heureFinReelle);
    const now = new Date();

    if (start && end) {
      if (now >= start && now <= end) {
        return 'EN_COURS';
      }

      if (now > end) {
        return 'TERMINEE';
      }
    }

    if (seance.statut === 'EN_COURS') {
      return 'EN_COURS';
    }

    return 'PREVUE';
  }

  private combineDateAndTime(dateValue?: string, timeValue?: string): Date | null {
    if (!dateValue || !timeValue) {
      return null;
    }

    const dateKey = this.toDateKey(dateValue);
    if (!dateKey) {
      return null;
    }

    const timeKey = timeValue.substring(0, 5);
    const date = new Date(`${dateKey}T${timeKey}:00`);

    return Number.isNaN(date.getTime()) ? null : date;
  }

  private extractHours(startTime?: string, endTime?: string): number {
    const start = this.toMinutes(startTime);
    const end = this.toMinutes(endTime);

    if (start === null || end === null || end <= start) {
      return 0;
    }

    return Math.round(((end - start) / 60) * 10) / 10;
  }

  private toMinutes(value?: string): number | null {
    if (!value) {
      return null;
    }

    const [hours, minutes] = value.substring(0, 5).split(':').map(Number);
    return Number.isFinite(hours) && Number.isFinite(minutes) ? hours * 60 + minutes : null;
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

  private isSameMonth(dateValue: string | undefined, year: number, month: number): boolean {
    if (!dateValue) {
      return false;
    }

    const date = new Date(dateValue);
    return date.getFullYear() === year && date.getMonth() + 1 === month;
  }

  private toDateKey(dateValue: string | undefined): string | null {
    if (!dateValue) {
      return null;
    }

    return new Date(dateValue).toISOString().slice(0, 10);
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
