import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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

interface DayStat {
  label: string;
  short: string;
  value: number;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <!-- Header -->
      <header class="dash-header">
        <div>
          <h1>Tableau de Bord</h1>
          <p>Aperçu en temps réel de l'activité académique</p>
        </div>
        <div class="header-date">
          <i class="pi pi-calendar"></i>
          <span>{{ currentDate }}</span>
        </div>
      </header>

      <!-- Stats Cards -->
      <section class="stats-grid">
        <div class="stat-card" *ngFor="let stat of stats; let i = index" [style.--delay]="i * 60">
          <div class="stat-icon" [style]="'--c: ' + stat.color">
            <i [class]="stat.icon"></i>
          </div>
          <div class="stat-info">
            <span class="stat-label">{{ stat.label }}</span>
            <div class="stat-row">
              <span class="stat-value">{{ stat.value }}{{ stat.suffix }}</span>
              <span class="stat-trend" [class]="stat.trendClass">
                {{ stat.trend }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- Main Content -->
      <section class="content-grid">
        <!-- Circular Chart -->
        <div class="card chart-card">
          <div class="card-header">
            <h3><i class="pi pi-chart-pie"></i> Taux d'assiduité hebdomadaire</h3>
            <span class="card-badge">{{ averageRate }}% en moyenne</span>
          </div>

          <div class="circular-chart-wrapper">
            <!-- SVG Donut -->
            <div class="donut-container">
              <svg viewBox="0 0 200 200" class="donut-svg">
                <!-- Background circle -->
                <circle cx="100" cy="100" r="80" fill="none" stroke="#f1f5f9" stroke-width="18" />

                <!-- Segments -->
                <circle
                  *ngFor="let seg of donutSegments; let i = index"
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  [attr.stroke]="seg.color"
                  stroke-width="18"
                  [attr.stroke-dasharray]="seg.dashArray"
                  [attr.stroke-dashoffset]="seg.dashOffset"
                  stroke-linecap="round"
                  class="donut-segment"
                  [style.--delay]="i * 150 + 'ms'"
                />
              </svg>

              <!-- Center text -->
              <div class="donut-center">
                <span class="donut-percent"
                  >{{ averageRate }}<span class="donut-percent-sign">%</span></span
                >
                <span class="donut-label">Assiduité</span>
              </div>
            </div>

            <!-- Legend + daily breakdown -->
            <div class="daily-breakdown">
              <h4 class="breakdown-title">Détail par jour</h4>
              <div class="breakdown-list">
                <div class="breakdown-item" *ngFor="let day of dayStats; let i = index">
                  <div class="breakdown-left">
                    <span class="breakdown-dot" [style]="'background: ' + day.color"></span>
                    <span class="breakdown-name">{{ day.label }}</span>
                  </div>
                  <div class="breakdown-right">
                    <div class="breakdown-bar-track">
                      <div
                        class="breakdown-bar-fill"
                        [style.width.%]="day.value"
                        [style.background]="day.color"
                        [style.animation-delay]="i * 100 + 'ms'"
                      ></div>
                    </div>
                    <span class="breakdown-value">{{ day.value }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="card activity-card">
          <div class="card-header">
            <h3>Activités Récentes</h3>
          </div>
          <div class="activity-list">
            <div class="activity-item" *ngFor="let act of activities">
              <div class="activity-avatar" [style]="'--bg: ' + act.color">
                {{ act.initials }}
              </div>
              <div class="activity-body">
                <div class="activity-text">
                  <strong>{{ act.user }}</strong> {{ act.action }}
                </div>
                <span class="activity-time">{{ act.meta }} · {{ act.time }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .dashboard {
        display: flex;
        flex-direction: column;
        gap: 32px;
        max-width: 1440px;
        width: 100%;
        margin: 0 auto;
        opacity: 0;
        animation: fadeIn 0.5s ease forwards;
      }

      @keyframes fadeIn {
        to {
          opacity: 1;
        }
      }

      /* ========== Header ========== */
      .dash-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding: 4px 0;

        @media (max-width: 640px) {
          flex-direction: column;
          gap: 12px;
        }

        h1 {
          margin: 0 0 6px;
          font-size: 1.85rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
        }

        p {
          margin: 0;
          font-size: 1rem;
          color: #64748b;
          font-weight: 500;
        }
      }

      .header-date {
        display: none;

        @media (min-width: 641px) {
          display: flex;
        }

        align-items: center;
        gap: 8px;
        padding: 10px 16px;
        background: #fff;
        border: 1px solid var(--border-color);
        border-radius: 12px;
        font-size: 0.85rem;
        font-weight: 500;
        color: #475569;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

        i {
          color: var(--primary-color);
          font-size: 0.95rem;
        }
      }

      /* ========== Stats Grid ========== */
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;

        @media (max-width: 1024px) {
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        @media (max-width: 480px) {
          grid-template-columns: 1fr;
          gap: 14px;
        }
      }

      .stat-card {
        background: #fff;
        border: 2px solid rgba(226, 232, 240, 0.7);
        border-radius: 18px;
        padding: 26px;
        display: flex;
        align-items: center;
        gap: 16px;
        transition:
          transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
          box-shadow 0.3s ease,
          border-color 0.3s ease;
        position: relative;
        overflow: hidden;
        cursor: pointer;
        opacity: 0;
        transform: translateY(8px);
        animation: slideUp 0.4s ease forwards;
        animation-delay: var(--delay, 0ms);

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: var(--c, #3b82f6);
          border-radius: 4px 0 0 4px;
          transform: scaleY(0);
          transform-origin: bottom;
          transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }

        &:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow:
            0 16px 32px rgba(2, 6, 23, 0.1),
            0 6px 12px rgba(2, 6, 23, 0.06);
          border-color: color-mix(in srgb, var(--c, var(--primary-color)) 30%, white);

          &::before {
            transform: scaleY(1);
          }

          .stat-icon {
            transform: scale(1.1) rotate(-5deg);
            box-shadow: 0 6px 16px color-mix(in srgb, var(--c) 25%, transparent);
          }

          .stat-value {
            color: var(--c, #0f172a);
          }
        }
      }

      @keyframes slideUp {
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .stat-icon {
        width: 56px;
        height: 56px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.3rem;
        color: var(--c);
        background: color-mix(in srgb, var(--c) 12%, white);
        flex-shrink: 0;
        transition:
          transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
          box-shadow 0.3s ease;
      }

      .stat-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .stat-label {
        font-size: 0.88rem;
        font-weight: 500;
        color: #64748b;
      }

      .stat-row {
        display: flex;
        align-items: baseline;
        gap: 8px;
      }

      .stat-value {
        font-size: 1.65rem;
        font-weight: 800;
        color: #0f172a;
        line-height: 1;
        transition: color 0.3s ease;
      }

      .stat-trend {
        font-size: 0.72rem;
        font-weight: 600;

        &.positive {
          color: #16a34a;
        }
        &.negative {
          color: #dc2626;
        }
        &.neutral {
          color: #94a3b8;
        }
      }

      /* ========== Content Grid ========== */
      .content-grid {
        display: grid;
        grid-template-columns: 1.3fr 1fr;
        gap: 24px;
        min-width: 0;

        @media (max-width: 900px) {
          grid-template-columns: 1fr;
          gap: 16px;
        }
      }

      .card {
        background: #fff;
        border: 1px solid rgba(226, 232, 240, 0.7);
        border-radius: 18px;
        padding: 32px;
        min-width: 0;
        overflow: hidden;
        transition:
          box-shadow 0.25s ease,
          transform 0.25s cubic-bezier(0.22, 1, 0.36, 1),
          border-color 0.25s ease;

        &:hover {
          box-shadow:
            0 16px 32px rgba(2, 6, 23, 0.08),
            0 6px 12px rgba(2, 6, 23, 0.04);
          transform: translateY(-3px);
          border-color: rgba(59, 130, 246, 0.2);
        }
      }

      .card-header {
        margin-bottom: 28px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 10px;

        h3 {
          margin: 0;
          font-size: 1.15rem;
          font-weight: 700;
          color: #1e293b;
          display: flex;
          align-items: center;
          gap: 8px;

          i {
            color: var(--primary-color);
            font-size: 1.1rem;
          }
        }
      }

      .card-badge {
        display: inline-flex;
        align-items: center;
        padding: 7px 16px;
        border-radius: 999px;
        background: rgba(34, 197, 94, 0.1);
        color: #166534;
        font-size: 0.82rem;
        font-weight: 700;
      }

      /* ========== Circular Chart ========== */
      .circular-chart-wrapper {
        display: flex;
        align-items: center;
        gap: 36px;

        @media (max-width: 680px) {
          flex-direction: column;
          gap: 28px;
        }
      }

      .donut-container {
        position: relative;
        width: 250px;
        height: 250px;
        flex-shrink: 0;

        @media (max-width: 480px) {
          width: 180px;
          height: 180px;
        }
      }

      .donut-svg {
        width: 100%;
        height: 100%;
        transform: rotate(-90deg);
      }

      .donut-segment {
        opacity: 0;
        animation: donutAppear 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        animation-delay: var(--delay, 0ms);
        transition:
          filter 0.2s ease,
          opacity 0.2s ease;
      }

      .donut-segment:hover {
        filter: brightness(1.15) drop-shadow(0 2px 6px rgba(0, 0, 0, 0.15));
        opacity: 0.9;
      }

      @keyframes donutAppear {
        from {
          opacity: 0;
          stroke-dashoffset: 503;
        }
        to {
          opacity: 1;
        }
      }

      .donut-center {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
      }

      .donut-percent {
        font-size: 3.2rem;
        font-weight: 900;
        color: #0f172a;
        line-height: 1;
        letter-spacing: -0.03em;

        @media (max-width: 480px) {
          font-size: 2rem;
        }
      }

      .donut-percent-sign {
        font-size: 1.4rem;
        font-weight: 700;
        color: #64748b;
        margin-left: 2px;

        @media (max-width: 480px) {
          font-size: 1rem;
        }
      }

      .donut-label {
        font-size: 0.82rem;
        font-weight: 600;
        color: #94a3b8;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      /* ========== Daily Breakdown ========== */
      .daily-breakdown {
        flex: 1;
        min-width: 0;
      }

      .breakdown-title {
        font-size: 0.88rem;
        font-weight: 700;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        margin: 0 0 16px 0;
      }

      .breakdown-list {
        display: flex;
        flex-direction: column;
        gap: 14px;
      }

      .breakdown-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 10px 0;

        &:not(:last-child) {
          border-bottom: 1px solid rgba(241, 245, 249, 0.9);
        }
      }

      .breakdown-left {
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 80px;
      }

      .breakdown-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        flex-shrink: 0;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      }

      .breakdown-name {
        font-size: 0.92rem;
        font-weight: 600;
        color: #334155;
      }

      .breakdown-right {
        display: flex;
        align-items: center;
        gap: 10px;
        flex: 1;
        min-width: 0;
      }

      .breakdown-bar-track {
        flex: 1;
        height: 10px;
        background: #f1f5f9;
        border-radius: 999px;
        overflow: hidden;
        min-width: 60px;
      }

      .breakdown-bar-fill {
        height: 100%;
        border-radius: 999px;
        animation: barGrow 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        animation-fill-mode: both;
        transform-origin: left;
      }

      @keyframes barGrow {
        from {
          width: 0% !important;
        }
      }

      .breakdown-value {
        font-size: 0.92rem;
        font-weight: 800;
        color: #0f172a;
        min-width: 38px;
        text-align: right;
      }

      /* ========== Activity List ========== */
      .activity-list {
        display: flex;
        flex-direction: column;
        gap: 0;
      }

      .activity-item {
        display: flex;
        align-items: flex-start;
        gap: 14px;
        padding: 14px 0;
        border-bottom: 1px solid rgba(241, 245, 249, 0.9);

        &:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
      }

      .activity-avatar {
        width: 44px;
        height: 44px;
        border-radius: 14px;
        background: color-mix(in srgb, var(--bg) 12%, white);
        color: var(--bg);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 0.85rem;
        flex-shrink: 0;
      }

      .activity-body {
        display: flex;
        flex-direction: column;
        gap: 3px;
        min-width: 0;
      }

      .activity-text {
        font-size: 0.92rem;
        color: #334155;
        line-height: 1.4;

        strong {
          color: #0f172a;
          font-weight: 600;
        }
      }

      .activity-time {
        font-size: 0.78rem;
        color: #94a3b8;
        font-weight: 500;
      }
    `,
  ],
})
export class DashboardComponent {
  currentDate = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  stats: StatCard[] = [
    {
      label: 'Enseignants Actifs',
      value: 124,
      suffix: '',
      icon: 'pi pi-users',
      color: '#3b82f6',
      trend: '+12%',
      trendClass: 'positive',
    },
    {
      label: "Séances Aujourd'hui",
      value: 42,
      suffix: '',
      icon: 'pi pi-check-circle',
      color: '#22c55e',
      trend: 'Stable',
      trendClass: 'neutral',
    },
    {
      label: 'Retards Signalés',
      value: 3,
      suffix: '',
      icon: 'pi pi-clock',
      color: '#f97316',
      trend: '-2',
      trendClass: 'positive',
    },
    {
      label: 'Progression Moyenne',
      value: 68,
      suffix: '%',
      icon: 'pi pi-book',
      color: '#a855f7',
      trend: '+5%',
      trendClass: 'positive',
    },
  ];

  dayStats: DayStat[] = [
    { label: 'Lundi', short: 'Lun', value: 80, color: '#3b82f6' },
    { label: 'Mardi', short: 'Mar', value: 60, color: '#8b5cf6' },
    { label: 'Mercredi', short: 'Mer', value: 90, color: '#22c55e' },
    { label: 'Jeudi', short: 'Jeu', value: 75, color: '#f59e0b' },
    { label: 'Vendredi', short: 'Ven', value: 85, color: '#06b6d4' },
    { label: 'Samedi', short: 'Sam', value: 70, color: '#f97316' },
  ];

  averageRate: number = 0;
  donutSegments: { color: string; dashArray: string; dashOffset: number }[] = [];

  constructor() {
    this.computeDonut();
  }

  private computeDonut(): void {
    const total = this.dayStats.reduce((s, d) => s + d.value, 0);
    this.averageRate = Math.round(total / this.dayStats.length);

    const circumference = 2 * Math.PI * 80; // r=80
    let cumOffset = 0;

    this.donutSegments = this.dayStats.map((day) => {
      const ratio = day.value / total;
      const segmentLength = circumference * ratio;
      const gap = 6;
      const dashLength = Math.max(0, segmentLength - gap);
      const dashArray = `${dashLength} ${circumference - dashLength}`;
      const dashOffset = -(cumOffset + gap / 2);
      cumOffset += segmentLength;

      return {
        color: day.color,
        dashArray,
        dashOffset,
      };
    });
  }

  activities: Activity[] = [
    {
      user: 'Dr. Alou',
      initials: 'DA',
      action: 'a validé son émargement',
      meta: 'Amphi 500',
      time: 'Il y a 5 min',
      color: '#3b82f6',
    },
    {
      user: 'K. Barry',
      initials: 'KB',
      action: 'a signalé une absence',
      meta: 'Salle 12',
      time: 'Il y a 15 min',
      color: '#f97316',
    },
    {
      user: 'M. Lougue',
      initials: 'ML',
      action: 'a rempli le cahier de textes',
      meta: 'Mathématiques',
      time: 'Il y a 1h',
      color: '#22c55e',
    },
  ];
}
