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
      <section class="hero-card">
        <div class="hero-content">
          <span class="hero-badge"><i class="pi pi-sparkles"></i> EduTrack</span>
          <h1>Bonjour, {{ adminName }} 👋</h1>
          <p>
            Pilotez les séances, l’émargement et les honoraires depuis un tableau de bord plus
            lisible, plus rapide et pensé pour l’action.
          </p>
          <div class="hero-actions">
            <a class="hero-button primary" [routerLink]="['/schedule']">
              <i class="pi pi-plus"></i>
              Nouvelle séance
            </a>
            <a class="hero-button secondary" [routerLink]="['/attendance']">
              <i class="pi pi-chart-bar"></i>
              Voir les présences
            </a>
          </div>
        </div>

        <div class="hero-illustration" aria-hidden="true">
          <div class="orbital-ring ring-one"></div>
          <div class="orbital-ring ring-two"></div>
          <div class="abstract-panel panel-main">
            <div class="panel-topbar"><span></span><span></span><span></span></div>
            <div class="panel-metrics"><span></span><span></span><span></span></div>
            <div class="panel-chart">
              <i style="height: 42%"></i>
              <i style="height: 72%"></i>
              <i style="height: 50%"></i>
              <i style="height: 88%"></i>
              <i style="height: 64%"></i>
            </div>
          </div>
          <div class="abstract-panel panel-floating">
            <i class="pi pi-qrcode"></i>
            <strong>{{ attendanceRate }}%</strong>
            <span>émargement</span>
          </div>
        </div>
      </section>

      <section class="kpi-grid" aria-label="Indicateurs clés">
        <article class="kpi-card" *ngFor="let stat of stats" [style.--accent]="stat.color">
          <div class="kpi-accent"></div>
          <div class="kpi-header">
            <span>{{ stat.label }}</span>
            <div class="kpi-icon"><i [class]="stat.icon"></i></div>
          </div>
          <strong>{{ stat.value }}{{ stat.suffix }}</strong>
          <div class="kpi-trend" [class]="stat.trendClass">
            <i
              class="pi"
              [class.pi-arrow-up]="stat.trendClass === 'positive'"
              [class.pi-arrow-down]="stat.trendClass === 'negative'"
              [class.pi-minus]="stat.trendClass === 'neutral'"
            ></i>
            {{ stat.trend }}
          </div>
        </article>
      </section>

      <section class="quick-access">
        <div class="section-heading">
          <span>Actions fréquentes</span>
          <h2>Accès rapide</h2>
        </div>
        <div class="hub-grid">
          <a
            *ngFor="let tile of sortedHubTiles"
            [routerLink]="tile.route"
            class="hub-tile"
            [style.--tile-color]="tile.color"
          >
            <div class="tile-glow"></div>
            <div class="tile-icon"><i [class]="tile.icon"></i></div>
            <div class="tile-content">
              <div class="tile-meta">{{ tile.meta }}</div>
              <h3>{{ tile.label }}</h3>
              <p>{{ tile.description }}</p>
              <span>{{ tile.indicator }}</span>
            </div>
            <i class="pi pi-arrow-right tile-arrow"></i>
          </a>
        </div>
      </section>

      <section class="analysis-section">
        <div class="section-heading">
          <span>Analyse temps réel</span>
          <h2>Tableaux d’analyse</h2>
        </div>

        <div class="bento-grid">
          <article class="bento-card col-span-8">
            <div class="card-header">
              <div>
                <h3>Émargements récents</h3>
                <p>Données réelles des 7 derniers jours</p>
              </div>
              <i class="pi pi-chart-line"></i>
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
                <i class="pi pi-verified"></i>
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
                <i class="pi pi-clock"></i>
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
              <i class="pi pi-users"></i>
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
              <i class="pi pi-wallet"></i>
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
        padding: 1.5rem;
        background:
          radial-gradient(circle at 8% 8%, rgba(99, 102, 241, 0.18), transparent 30%),
          radial-gradient(circle at 88% 12%, rgba(236, 72, 153, 0.16), transparent 28%),
          radial-gradient(circle at 52% 98%, rgba(14, 165, 233, 0.14), transparent 34%),
          linear-gradient(135deg, #f8fafc 0%, #eef2ff 45%, #fdf2f8 100%);
      }

      .dashboard-shell {
        position: relative;
        z-index: 0;
        max-width: 1440px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 26px;
        padding-bottom: 36px;
        color: #0f172a;
        font-family: 'Plus Jakarta Sans', sans-serif;
      }

      .dashboard-shell::before {
        content: '';
        position: fixed;
        inset: 0;
        z-index: -1;
        pointer-events: none;
        opacity: 0.35;
        background-image:
          linear-gradient(rgba(15, 23, 42, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(15, 23, 42, 0.05) 1px, transparent 1px);
        background-size: 42px 42px;
        mask-image: linear-gradient(to bottom, black, transparent 78%);
      }

      .hero-card {
        position: relative;
        min-height: 390px;
        display: grid;
        grid-template-columns: minmax(0, 1.1fr) minmax(320px, 0.9fr);
        gap: 32px;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.45);
        border-radius: 36px;
        padding: 58px;
        background:
          linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.92)),
          radial-gradient(circle at top right, rgba(99, 102, 241, 0.65), transparent 40%);
        box-shadow: 0 28px 70px rgba(15, 23, 42, 0.28);
      }

      .hero-card::before,
      .hero-card::after {
        content: '';
        position: absolute;
        border-radius: 999px;
        filter: blur(8px);
        pointer-events: none;
      }

      .hero-card::before {
        width: 440px;
        height: 440px;
        right: -120px;
        top: -140px;
        background: radial-gradient(circle, rgba(99, 102, 241, 0.62), transparent 68%);
      }

      .hero-card::after {
        width: 360px;
        height: 360px;
        right: 22%;
        bottom: -190px;
        background: radial-gradient(circle, rgba(236, 72, 153, 0.42), transparent 70%);
      }

      .hero-content,
      .hero-illustration {
        position: relative;
        z-index: 1;
      }

      .hero-content {
        max-width: 690px;
        color: #fff;
      }

      .hero-badge {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        width: fit-content;
        margin-bottom: 24px;
        padding: 9px 16px;
        border: 1px solid rgba(255, 255, 255, 0.18);
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.1);
        color: #dbeafe;
        font-size: 0.78rem;
        font-weight: 900;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        backdrop-filter: blur(18px);
      }

      .hero-content h1 {
        margin: 0;
        font-size: clamp(2.2rem, 5vw, 4.25rem);
        line-height: 0.98;
        letter-spacing: -0.065em;
        font-weight: 900;
      }

      .hero-content p {
        max-width: 660px;
        margin: 20px 0 0;
        color: #cbd5e1;
        font-size: 1.08rem;
        line-height: 1.75;
      }

      .hero-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 14px;
        margin-top: 34px;
      }

      .hero-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        min-height: 52px;
        padding: 0 22px;
        border-radius: 18px;
        font-weight: 900;
        text-decoration: none;
        transition:
          transform 0.25s ease,
          box-shadow 0.25s ease,
          background 0.25s ease;
      }

      .hero-button:hover {
        transform: translateY(-3px);
      }

      .hero-button.primary {
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: #fff;
        box-shadow: 0 18px 38px rgba(99, 102, 241, 0.36);
      }

      .hero-button.secondary {
        border: 1px solid rgba(255, 255, 255, 0.22);
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
        backdrop-filter: blur(16px);
      }

      .hero-illustration {
        min-height: 275px;
        display: grid;
        place-items: center;
      }

      .orbital-ring {
        position: absolute;
        border-radius: 999px;
        border: 1px solid rgba(255, 255, 255, 0.14);
      }

      .ring-one {
        width: 330px;
        height: 330px;
        transform: rotate(-18deg);
      }

      .ring-two {
        width: 430px;
        height: 210px;
        transform: rotate(28deg);
      }

      .abstract-panel {
        position: absolute;
        border: 1px solid rgba(255, 255, 255, 0.22);
        background: rgba(255, 255, 255, 0.13);
        box-shadow: 0 24px 80px rgba(0, 0, 0, 0.26);
        backdrop-filter: blur(24px);
      }

      .panel-main {
        width: min(360px, 100%);
        min-height: 238px;
        padding: 22px;
        border-radius: 30px;
        transform: rotate(-3deg);
      }

      .panel-topbar,
      .panel-metrics,
      .panel-chart {
        display: flex;
        gap: 10px;
      }

      .panel-topbar span {
        width: 10px;
        height: 10px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.78);
      }

      .panel-metrics {
        margin-top: 24px;
      }

      .panel-metrics span {
        flex: 1;
        height: 54px;
        border-radius: 18px;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.24), rgba(255, 255, 255, 0.08));
      }

      .panel-chart {
        align-items: end;
        height: 92px;
        margin-top: 24px;
        padding: 14px;
        border-radius: 20px;
        background: rgba(15, 23, 42, 0.28);
      }

      .panel-chart i {
        flex: 1;
        border-radius: 999px 999px 8px 8px;
        background: linear-gradient(180deg, #a5b4fc, #22d3ee);
      }

      .panel-floating {
        right: 8px;
        bottom: 12px;
        display: grid;
        gap: 4px;
        min-width: 150px;
        padding: 18px;
        border-radius: 24px;
        color: #fff;
        transform: rotate(5deg);
      }

      .panel-floating i {
        color: #bfdbfe;
        font-size: 1.3rem;
      }

      .panel-floating strong {
        font-size: 2rem;
        line-height: 1;
      }

      .panel-floating span {
        color: #cbd5e1;
        font-size: 0.78rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      .kpi-grid,
      .hub-grid,
      .bento-grid {
        display: grid;
        gap: 22px;
      }

      .kpi-grid {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }

      .kpi-card {
        --accent: #6366f1;
        position: relative;
        overflow: hidden;
        min-height: 170px;
        padding: 25px;
        border: 1px solid rgba(255, 255, 255, 0.72);
        border-radius: 30px;
        background:
          linear-gradient(145deg, rgba(255, 255, 255, 0.94), rgba(255, 255, 255, 0.72)),
          radial-gradient(
            circle at 88% 12%,
            color-mix(in srgb, var(--accent) 20%, transparent),
            transparent 34%
          );
        box-shadow: 0 18px 50px rgba(15, 23, 42, 0.08);
        backdrop-filter: blur(18px);
        transition:
          transform 0.25s ease,
          box-shadow 0.25s ease;
      }

      .kpi-card:hover,
      .hub-tile:hover,
      .bento-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 24px 60px rgba(15, 23, 42, 0.13);
      }

      .kpi-accent {
        position: absolute;
        inset: 0 auto 0 0;
        width: 6px;
        background: linear-gradient(
          180deg,
          var(--accent),
          color-mix(in srgb, var(--accent) 30%, white)
        );
      }

      .kpi-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 18px;
      }

      .kpi-header span {
        color: #64748b;
        font-size: 0.9rem;
        font-weight: 900;
      }

      .kpi-icon {
        display: grid;
        place-items: center;
        width: 52px;
        height: 52px;
        border-radius: 18px;
        background: color-mix(in srgb, var(--accent) 13%, white);
        color: var(--accent);
        font-size: 1.35rem;
        box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--accent) 20%, transparent);
      }

      .kpi-card strong {
        display: block;
        margin-top: 18px;
        color: #0f172a;
        font-size: 2.55rem;
        font-weight: 900;
        line-height: 1;
        letter-spacing: -0.055em;
      }

      .kpi-trend {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        margin-top: 16px;
        padding: 7px 11px;
        border-radius: 999px;
        font-size: 0.78rem;
        font-weight: 900;
      }

      .positive {
        color: #047857;
        background: #d1fae5;
      }
      .negative {
        color: #dc2626;
        background: #fee2e2;
      }
      .neutral {
        color: #475569;
        background: #f1f5f9;
      }

      .quick-access,
      .analysis-section {
        display: flex;
        flex-direction: column;
        gap: 18px;
      }

      .section-heading span {
        display: block;
        color: #6366f1;
        font-size: 0.76rem;
        font-weight: 900;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }

      .section-heading h2 {
        margin: 4px 0 0;
        color: #0f172a;
        font-size: 1.55rem;
        font-weight: 900;
        letter-spacing: -0.04em;
      }

      .hub-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }

      .hub-tile {
        --tile-color: #6366f1;
        position: relative;
        isolation: isolate;
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) auto;
        align-items: center;
        gap: 16px;
        overflow: hidden;
        min-height: 140px;
        padding: 22px;
        border: 1px solid rgba(255, 255, 255, 0.72);
        border-radius: 28px;
        background: rgba(255, 255, 255, 0.82);
        color: inherit;
        text-decoration: none;
        box-shadow: 0 16px 44px rgba(15, 23, 42, 0.07);
        backdrop-filter: blur(18px);
        transition:
          transform 0.25s ease,
          box-shadow 0.25s ease,
          border-color 0.25s ease;
      }

      .hub-tile:hover {
        border-color: color-mix(in srgb, var(--tile-color) 30%, white);
      }

      .tile-glow {
        position: absolute;
        inset: auto -42px -60px auto;
        z-index: -1;
        width: 170px;
        height: 170px;
        border-radius: 999px;
        background: color-mix(in srgb, var(--tile-color) 22%, transparent);
        filter: blur(10px);
        transition: transform 0.25s ease;
      }

      .hub-tile:hover .tile-glow {
        transform: scale(1.22);
      }

      .tile-icon {
        display: grid;
        place-items: center;
        width: 58px;
        height: 58px;
        border-radius: 20px;
        background: color-mix(in srgb, var(--tile-color) 13%, white);
        color: var(--tile-color);
        font-size: 1.45rem;
        box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--tile-color) 20%, transparent);
      }

      .tile-meta,
      .tile-content span {
        color: var(--tile-color);
        font-size: 0.72rem;
        font-weight: 900;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .tile-content h3 {
        margin: 4px 0 6px;
        color: #0f172a;
        font-size: 1.02rem;
        font-weight: 900;
        letter-spacing: -0.02em;
      }

      .tile-content p {
        margin: 0 0 10px;
        color: #64748b;
        font-size: 0.88rem;
        font-weight: 600;
        line-height: 1.45;
      }

      .tile-arrow {
        color: #94a3b8;
        transition:
          transform 0.25s ease,
          color 0.25s ease;
      }

      .hub-tile:hover .tile-arrow {
        color: var(--tile-color);
        transform: translateX(5px);
      }

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
        gap: 22px;
      }

      .bento-card {
        display: flex;
        flex-direction: column;
        min-height: 350px;
        padding: 26px;
        border: 1px solid rgba(255, 255, 255, 0.72);
        border-radius: 32px;
        background: rgba(255, 255, 255, 0.86);
        box-shadow: 0 18px 55px rgba(15, 23, 42, 0.08);
        backdrop-filter: blur(20px);
        transition:
          transform 0.25s ease,
          box-shadow 0.25s ease;
      }

      .compact-chart {
        min-height: 280px;
      }

      .card-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
        margin-bottom: 16px;
      }

      .card-header h3 {
        margin: 0;
        color: #0f172a;
        font-size: 1.13rem;
        font-weight: 900;
        letter-spacing: -0.03em;
      }

      .card-header p {
        margin: 6px 0 0;
        color: #64748b;
        font-size: 0.86rem;
        font-weight: 600;
        line-height: 1.45;
      }

      .card-header > i {
        display: grid;
        place-items: center;
        width: 42px;
        height: 42px;
        flex: 0 0 auto;
        border-radius: 15px;
        background: #eef2ff;
        color: #6366f1;
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

      @media (max-width: 1180px) {
        .hero-card {
          grid-template-columns: 1fr;
        }

        .hero-illustration {
          min-height: 250px;
        }

        .kpi-grid,
        .hub-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
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
          padding: 1rem;
        }

        .hero-card {
          min-height: auto;
          padding: 34px 24px;
          border-radius: 28px;
        }

        .hero-actions,
        .hero-button {
          width: 100%;
        }

        .hero-illustration {
          display: none;
        }

        .kpi-grid,
        .hub-grid,
        .bento-grid {
          grid-template-columns: 1fr;
        }

        .col-span-8,
        .col-span-6,
        .col-span-4 {
          grid-column: span 1;
        }

        .hub-tile {
          grid-template-columns: auto minmax(0, 1fr);
        }

        .tile-arrow {
          display: none;
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
