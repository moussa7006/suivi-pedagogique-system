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

interface WatchClassRow {
  classe: string;
  prevues: number;
  realisees: number;
  taux: number;
  niveau: 'Critique' | 'À suivre' | 'Normal';
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
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, NgApexchartsModule],
  template: `
    <div class="dashboard-container">
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
                  [class.pi-minus]="stat.trendClass === 'neutral'"
                ></i>
                {{ stat.trend }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <header class="page-header">
        <div class="header-content">
          <span class="welcome-text"
            ><i class="pi pi-sparkles"></i> Tableau de bord décisionnel</span
          >
          <h1>Vue globale du suivi pédagogique et financier</h1>
          <p>
            Analysez les séances, les émargements, les heures effectuées et les honoraires afin de
            prendre rapidement les bonnes décisions administratives.
          </p>
        </div>
        <div class="header-actions">
          <button class="btn-secondary" [routerLink]="['/attendance']">
            <i class="pi pi-chart-bar"></i>
            Voir les présences
          </button>
        </div>
      </header>

      <section class="analytics-section">
        <div class="section-title compact">
          <div>
            <h2>Indicateurs d'aide à la décision</h2>
            <p>Graphiques dynamiques basés sur les données réelles de la plateforme.</p>
          </div>
          <span class="period-chip">6 derniers mois</span>
        </div>

        <div class="analytics-grid top-grid">
          <article class="analytics-card gauge-card">
            <div class="card-title-row">
              <div>
                <h3>Taux d'émargement global</h3>
                <p>Séances ayant un émargement enregistré</p>
              </div>
              <i class="pi pi-verified card-icon blue"></i>
            </div>
            <apx-chart
              [series]="attendanceGaugeOptions.series"
              [chart]="attendanceGaugeOptions.chart"
              [plotOptions]="attendanceGaugeOptions.plotOptions"
              [labels]="attendanceGaugeOptions.labels"
              [fill]="attendanceGaugeOptions.fill"
              [stroke]="attendanceGaugeOptions.stroke"
            ></apx-chart>
            <div class="decision-note" [class.warning]="attendanceRate < 70">
              <i
                class="pi"
                [class.pi-check-circle]="attendanceRate >= 70"
                [class.pi-exclamation-triangle]="attendanceRate < 70"
              ></i>
              {{ attendanceInsight }}
            </div>
          </article>

          <article class="analytics-card donut-card">
            <div class="card-title-row">
              <div>
                <h3>Répartition des séances</h3>
                <p>Prévue, en cours et terminée</p>
              </div>
              <i class="pi pi-chart-pie card-icon purple"></i>
            </div>
            <apx-chart
              [series]="sessionStatusOptions.series"
              [chart]="sessionStatusOptions.chart"
              [labels]="sessionStatusOptions.labels"
              [colors]="sessionStatusOptions.colors"
              [legend]="sessionStatusOptions.legend"
              [dataLabels]="sessionStatusOptions.dataLabels"
              [plotOptions]="sessionStatusOptions.plotOptions"
              [responsive]="sessionStatusOptions.responsive"
            ></apx-chart>
          </article>
        </div>

        <article class="analytics-card wide-card">
          <div class="card-title-row">
            <div>
              <h3>Évolution des séances réalisées</h3>
              <p>Volume mensuel des séances terminées ou émargées</p>
            </div>
            <i class="pi pi-chart-line card-icon green"></i>
          </div>
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
          ></apx-chart>
        </article>

        <div class="analytics-grid bottom-grid">
          <article class="analytics-card">
            <div class="card-title-row">
              <div>
                <h3>Enseignants les plus performants</h3>
                <p>Top 5 selon les heures réalisées</p>
              </div>
              <i class="pi pi-users card-icon orange"></i>
            </div>
            <apx-chart
              [series]="teacherHoursOptions.series"
              [chart]="teacherHoursOptions.chart"
              [xaxis]="teacherHoursOptions.xaxis"
              [yaxis]="teacherHoursOptions.yaxis"
              [colors]="teacherHoursOptions.colors"
              [dataLabels]="teacherHoursOptions.dataLabels"
              [stroke]="teacherHoursOptions.stroke"
              [fill]="teacherHoursOptions.fill"
              [tooltip]="teacherHoursOptions.tooltip"
              [plotOptions]="teacherHoursOptions.plotOptions"
            ></apx-chart>
          </article>

          <article class="analytics-card">
            <div class="card-title-row">
              <div>
                <h3>Honoraires calculés</h3>
                <p>Prévision financière mensuelle</p>
              </div>
              <i class="pi pi-wallet card-icon rose"></i>
            </div>
            <apx-chart
              [series]="honorairesOptions.series"
              [chart]="honorairesOptions.chart"
              [xaxis]="honorairesOptions.xaxis"
              [yaxis]="honorairesOptions.yaxis"
              [colors]="honorairesOptions.colors"
              [dataLabels]="honorairesOptions.dataLabels"
              [stroke]="honorairesOptions.stroke"
              [fill]="honorairesOptions.fill"
              [tooltip]="honorairesOptions.tooltip"
              [plotOptions]="honorairesOptions.plotOptions"
            ></apx-chart>
          </article>
        </div>

        <article class="analytics-card watch-card">
          <div class="card-title-row">
            <div>
              <h3>Classes à surveiller</h3>
              <p>Classes ayant le plus faible taux de réalisation des séances</p>
            </div>
            <i class="pi pi-shield card-icon red"></i>
          </div>

          <div class="watch-table" *ngIf="classesToWatch.length; else noWatchData">
            <div class="watch-header">
              <span>Classe</span>
              <span>Prévues</span>
              <span>Réalisées</span>
              <span>Taux</span>
              <span>Niveau</span>
            </div>
            <div class="watch-row" *ngFor="let row of classesToWatch">
              <strong>{{ row.classe }}</strong>
              <span>{{ row.prevues }}</span>
              <span>{{ row.realisees }}</span>
              <span>
                <span class="progress-line"><i [style.width.%]="row.taux"></i></span>
                {{ row.taux }}%
              </span>
              <span
                class="risk-badge"
                [class.critical]="row.niveau === 'Critique'"
                [class.warning]="row.niveau === 'À suivre'"
              >
                {{ row.niveau }}
              </span>
            </div>
          </div>
          <ng-template #noWatchData>
            <div class="empty-state">
              <i class="pi pi-info-circle"></i>
              Aucune donnée suffisante pour identifier des classes à surveiller.
            </div>
          </ng-template>
        </article>
      </section>

      <section class="workspace-hub">
        <div class="section-title">
          <h2>Modules de gestion</h2>
          <p>Accédez rapidement à vos outils quotidiens</p>
        </div>

        <div class="hub-grid">
          <a
            *ngFor="let tile of sortedHubTiles"
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

      h1 {
        font-size: clamp(1.5rem, 2.4vw, 2.25rem);
        font-weight: 900;
        color: #0f172a;
        margin: 8px 0;
        letter-spacing: -0.04em;
      }
      h2 {
        font-size: 1.35rem;
        font-weight: 850;
        color: #0f172a;
        margin: 0;
      }
      h3 {
        margin: 0;
        color: #0f172a;
        font-size: 1rem;
        font-weight: 850;
      }
      p {
        color: #64748b;
        font-size: 0.9rem;
        line-height: 1.45;
        margin: 4px 0 0;
      }

      .stats-overview {
        position: sticky;
        top: 80px;
        z-index: 30;
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 12px;
        padding-bottom: 8px;
        background: linear-gradient(
          180deg,
          #f8fafc 0%,
          rgba(248, 250, 252, 0.96) 76%,
          rgba(248, 250, 252, 0)
        );
        backdrop-filter: blur(10px);
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
        box-shadow: 0 10px 25px rgba(15, 23, 42, 0.05);
        transition:
          transform 0.25s ease,
          box-shadow 0.25s ease,
          border-color 0.25s ease;

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
          transform: translateY(-4px);
          border-color: var(--accent);
          box-shadow: 0 22px 44px color-mix(in srgb, var(--accent) 22%, rgba(15, 23, 42, 0.12));
        }

        .stat-icon {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          background: linear-gradient(
            135deg,
            var(--accent),
            color-mix(in srgb, var(--accent), black 18%)
          );
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
          box-shadow: 0 8px 16px color-mix(in srgb, var(--accent) 30%, transparent);
          position: relative;
          z-index: 1;
        }
        .stat-details {
          position: relative;
          z-index: 1;
          min-width: 0;
        }
        .stat-label {
          font-size: 0.82rem;
          font-weight: 700;
          color: #64748b;
        }
        .stat-number {
          font-size: 1.35rem;
          font-weight: 900;
          color: #0f172a;
        }
        .stat-value-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 2px;
          flex-wrap: wrap;
        }
        .stat-badge {
          padding: 4px 8px;
          border-radius: 8px;
          font-size: 0.72rem;
          font-weight: 800;
          display: inline-flex;
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

      .page-header {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 18px;
        padding: 26px;
        border-radius: 28px;
        background:
          radial-gradient(circle at 92% 12%, rgba(59, 130, 246, 0.18), transparent 28%),
          linear-gradient(135deg, #ffffff 0%, #eff6ff 52%, #eef2ff 100%);
        border: 1px solid #dbeafe;
        box-shadow: 0 18px 42px rgba(37, 99, 235, 0.1);
      }
      .welcome-text {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: #1d4ed8;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        font-size: 0.78rem;
      }
      .header-actions {
        display: flex;
        justify-content: flex-end;
      }
      .btn-secondary {
        padding: 11px 16px;
        border-radius: 14px;
        font-weight: 800;
        font-size: 0.84rem;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        transition: all 0.2s ease;
        background: #ffffff;
        color: #1d4ed8;
        border: 1px solid #bfdbfe;
        box-shadow: 0 10px 22px rgba(37, 99, 235, 0.08);

        &:hover {
          background: #dbeafe;
          border-color: #93c5fd;
          transform: translateY(-2px);
        }
      }

      .section-title {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 16px;
        margin-bottom: 14px;

        &.compact {
          margin-bottom: 16px;
        }
      }
      .period-chip {
        display: inline-flex;
        align-items: center;
        padding: 7px 12px;
        border-radius: 999px;
        background: #eef2ff;
        color: #4338ca;
        font-size: 0.76rem;
        font-weight: 900;
        border: 1px solid #c7d2fe;
        white-space: nowrap;
      }

      .analytics-section {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .analytics-grid {
        display: grid;
        gap: 16px;
      }
      .top-grid {
        grid-template-columns: minmax(320px, 0.9fr) minmax(360px, 1.1fr);
      }
      .bottom-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      .analytics-card {
        min-width: 0;
        background: rgba(255, 255, 255, 0.98);
        border-radius: 26px;
        padding: 22px;
        border: 1px solid rgba(226, 232, 240, 0.95);
        box-shadow: 0 18px 42px rgba(15, 23, 42, 0.06);
        overflow: hidden;
      }
      .wide-card {
        padding-bottom: 10px;
      }
      .card-title-row {
        display: flex;
        justify-content: space-between;
        gap: 14px;
        align-items: flex-start;
        margin-bottom: 12px;
      }
      .card-icon {
        width: 44px;
        height: 44px;
        min-width: 44px;
        border-radius: 16px;
        display: grid;
        place-items: center;
        color: #fff;
        font-size: 1.1rem;
        box-shadow: 0 12px 24px rgba(15, 23, 42, 0.12);

        &.blue {
          background: linear-gradient(135deg, #2563eb, #06b6d4);
        }
        &.purple {
          background: linear-gradient(135deg, #7c3aed, #ec4899);
        }
        &.green {
          background: linear-gradient(135deg, #16a34a, #22c55e);
        }
        &.orange {
          background: linear-gradient(135deg, #f97316, #f59e0b);
        }
        &.rose {
          background: linear-gradient(135deg, #db2777, #f43f5e);
        }
        &.red {
          background: linear-gradient(135deg, #dc2626, #f97316);
        }
      }
      .decision-note {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 10px 12px;
        border-radius: 16px;
        background: #dcfce7;
        color: #166534;
        font-weight: 800;
        font-size: 0.82rem;
        text-align: center;

        &.warning {
          background: #fff7ed;
          color: #9a3412;
        }
      }

      .watch-card {
        padding-bottom: 18px;
      }
      .watch-table {
        display: flex;
        flex-direction: column;
        border: 1px solid #e2e8f0;
        border-radius: 18px;
        overflow: hidden;
      }
      .watch-header,
      .watch-row {
        display: grid;
        grid-template-columns: 1.5fr 0.7fr 0.8fr 1.2fr 0.9fr;
        gap: 12px;
        align-items: center;
        padding: 12px 14px;
      }
      .watch-header {
        background: #f8fafc;
        color: #64748b;
        font-size: 0.72rem;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      .watch-row {
        background: #ffffff;
        border-top: 1px solid #eef2f7;
        color: #334155;
        font-size: 0.86rem;
      }
      .progress-line {
        display: inline-flex;
        width: 62px;
        height: 7px;
        border-radius: 999px;
        background: #e2e8f0;
        overflow: hidden;
        margin-right: 8px;
        vertical-align: middle;

        i {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #ef4444, #f59e0b, #22c55e);
        }
      }
      .risk-badge {
        display: inline-flex;
        justify-content: center;
        padding: 6px 10px;
        border-radius: 999px;
        background: #dcfce7;
        color: #166534;
        font-weight: 900;
        font-size: 0.75rem;

        &.warning {
          background: #fef3c7;
          color: #92400e;
        }
        &.critical {
          background: #fee2e2;
          color: #991b1b;
        }
      }
      .empty-state {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 18px;
        border-radius: 18px;
        background: #f8fafc;
        color: #64748b;
        font-weight: 700;
      }

      .workspace-hub {
        margin-top: 4px;
      }
      .hub-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 18px;
      }
      .hub-card {
        position: relative;
        display: flex;
        flex-direction: column;
        background: #ffffff;
        border-radius: 20px;
        border: 1px solid #e2e8f0;
        padding: 22px;
        text-decoration: none;
        color: inherit;
        overflow: hidden;
        transition: all 0.3s ease;
        box-shadow: 0 10px 25px rgba(15, 23, 42, 0.05);
        cursor: pointer;

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
          transform: translateY(-6px);
          border-color: var(--tile-color);
          box-shadow: 0 20px 40px color-mix(in srgb, var(--tile-color) 20%, rgba(15, 23, 42, 0.1));

          .card-glow {
            opacity: 1;
          }
          .icon-wrapper {
            transform: scale(1.08);
          }
          .action-link {
            color: var(--tile-color);
          }
        }
        .card-glow {
          position: absolute;
          top: -50%;
          right: -30%;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, var(--tile-color) 0%, transparent 70%);
          opacity: 0.08;
          transition: opacity 0.3s;
          pointer-events: none;
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 14px;
        }
        .icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: linear-gradient(
            135deg,
            var(--tile-color),
            color-mix(in srgb, var(--tile-color), black 20%)
          );
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          box-shadow: 0 8px 16px color-mix(in srgb, var(--tile-color) 30%, transparent);
          transition: transform 0.3s;
        }
        .tag {
          font-size: 0.7rem;
          font-weight: 800;
          color: #64748b;
          background: #f1f5f9;
          padding: 4px 10px;
          border-radius: 999px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .card-body h3 {
          font-size: 1.1rem;
          margin-bottom: 6px;
        }
        .module-indicator {
          display: inline-block;
          font-size: 0.78rem;
          font-weight: 800;
          color: var(--tile-color);
          background: color-mix(in srgb, var(--tile-color) 10%, transparent);
          padding: 4px 10px;
          border-radius: 8px;
        }
        .card-footer {
          margin-top: 16px;
          padding-top: 14px;
          border-top: 1px solid #f1f5f9;
        }
        .action-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          font-weight: 800;
          color: #94a3b8;
          transition: color 0.2s;
        }
      }

      @media (max-width: 1180px) {
        .stats-overview,
        .hub-grid,
        .bottom-grid,
        .top-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (max-width: 760px) {
        .stats-overview,
        .hub-grid,
        .bottom-grid,
        .top-grid {
          grid-template-columns: 1fr;
        }
        .stats-overview {
          position: static;
          background: transparent;
          backdrop-filter: none;
        }
        .page-header,
        .section-title {
          flex-direction: column;
          align-items: flex-start;
        }
        .watch-header {
          display: none;
        }
        .watch-row {
          grid-template-columns: 1fr;
          gap: 8px;
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
  classesToWatch: WatchClassRow[] = [];

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
    chart: { type: 'donut', height: 300 },
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
    '#16a34a',
  );
  teacherHoursOptions: AxisChartOptions = this.createBarChartOptions('Heures', '#f97316', true);
  honorairesOptions: AxisChartOptions = this.createBarChartOptions(
    'Montant',
    '#db2777',
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
    };

    this.classesToWatch = this.buildClassesToWatch(seances, classes);
  }

  private buildClassesToWatch(seances: Seance[], classes: Classe[]): WatchClassRow[] {
    const classNames = new Map(classes.map((classe) => [classe.id, classe.libelle]));
    const grouped = new Map<number, { prevues: number; realisees: number }>();

    seances.forEach((seance) => {
      const current = grouped.get(seance.classeId) || { prevues: 0, realisees: 0 };
      current.prevues += 1;
      if (this.isRealizedSeance(seance)) {
        current.realisees += 1;
      }
      grouped.set(seance.classeId, current);
    });

    return Array.from(grouped.entries())
      .map(([classeId, value]) => {
        const taux = value.prevues ? Math.round((value.realisees / value.prevues) * 100) : 0;
        return {
          classe: classNames.get(classeId) || `Classe #${classeId}`,
          prevues: value.prevues,
          realisees: value.realisees,
          taux,
          niveau: taux < 50 ? 'Critique' : taux < 75 ? 'À suivre' : 'Normal',
        } as WatchClassRow;
      })
      .sort((a, b) => a.taux - b.taux || b.prevues - a.prevues)
      .slice(0, 5);
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
        height: 320,
        toolbar: { show: false },
        fontFamily: 'Inter, sans-serif',
      },
      xaxis: { categories: [], labels: { style: { colors: '#64748b', fontWeight: 800 } } },
      yaxis: { labels: { style: { colors: '#64748b' } } },
      colors: [color],
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 4 },
      fill: {
        type: 'gradient',
        gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.02, stops: [0, 90, 100] },
      },
      tooltip: { theme: 'light' },
      plotOptions: {},
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
        height: 320,
        toolbar: { show: false },
        fontFamily: 'Inter, sans-serif',
      },
      xaxis: { categories: [], labels: { style: { colors: '#64748b', fontWeight: 800 } } },
      yaxis: { labels: { style: { colors: '#64748b' } } },
      colors: [color],
      dataLabels: { enabled: false },
      stroke: { show: true, width: 2, colors: ['transparent'] },
      fill: { opacity: 0.95 },
      tooltip: {
        theme: 'light',
        y: {
          formatter: (value) =>
            suffix === 'FCFA'
              ? `${Number(value).toLocaleString('fr-FR')} FCFA`
              : `${value} ${suffix}`,
        },
      },
      plotOptions: { bar: { horizontal, borderRadius: 8, columnWidth: '52%', barHeight: '58%' } },
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
