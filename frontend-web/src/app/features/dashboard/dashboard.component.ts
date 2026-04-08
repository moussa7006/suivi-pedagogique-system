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

interface ChartData {
  label: string;
  value: number;
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
        <!-- Chart -->
        <div class="card chart-card">
          <div class="card-header">
            <h3>Taux d'assiduité hebdomadaire</h3>
          </div>
          <div class="simple-chart">
            <div class="chart-bars">
              <div class="bar-col" *ngFor="let d of chartData">
                <div class="bar" [style.height]="d.value + '%'">
                  <span class="bar-value">{{ d.value }}%</span>
                </div>
                <span class="bar-label">{{ d.label }}</span>
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
        gap: 24px;
        padding: 24px;
        max-width: 1400px;
        width: 100%;
        margin: 0 auto;
        opacity: 0;
        animation: fadeIn 0.5s ease forwards;

        @media (max-width: 768px) {
          padding: 16px;
          gap: 18px;
        }

        @media (max-width: 480px) {
          padding: 12px 8px;
          gap: 14px;
        }
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
        padding: 8px 0;

        @media (max-width: 640px) {
          flex-direction: column;
          gap: 12px;
        }

        h1 {
          margin: 0 0 4px;
          font-size: clamp(1.2rem, 4vw, 1.6rem);
          font-weight: 700;
          color: #0f172a;
          letter-spacing: -0.02em;
          word-break: break-word;
        }

        p {
          margin: 0;
          font-size: clamp(0.8rem, 2.5vw, 0.9rem);
          color: #64748b;
          font-weight: 400;
          word-break: break-word;
        }
      }

      .header-date {
        display: none;

        @media (min-width: 641px) {
          display: flex;
        }

        align-items: center;
        gap: 8px;
        padding: 8px 14px;
        background: #fff;
        border: 1px solid var(--border-color);
        border-radius: 10px;
        font-size: 0.8rem;
        font-weight: 500;
        color: #475569;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

        i {
          color: var(--primary-color);
          font-size: 0.9rem;
        }
      }

      /* ========== Stats Grid ========== */
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;

        @media (max-width: 768px) {
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        @media (max-width: 480px) {
          grid-template-columns: 1fr;
          gap: 10px;
        }
      }

      .stat-card {
        background: #fff;
        border: 2px solid rgba(226, 232, 240, 0.7);
        border-radius: 14px;
        padding: 20px;
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
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.15rem;
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
        font-size: 0.8rem;
        font-weight: 500;
        color: #64748b;
      }

      .stat-row {
        display: flex;
        align-items: baseline;
        gap: 8px;
      }

      .stat-value {
        font-size: 1.35rem;
        font-weight: 700;
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
        grid-template-columns: 2fr 1.2fr;
        gap: 20px;
        min-width: 0;

        @media (max-width: 900px) {
          grid-template-columns: 1fr;
          gap: 16px;
        }
      }

      .card {
        background: #fff;
        border: 1px solid rgba(226, 232, 240, 0.7);
        border-radius: 14px;
        padding: 24px;
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
        margin-bottom: 16px;

        h3 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
        }
      }

      /* ========== Simple Chart ========== */
      .simple-chart {
        padding: 8px 0;
      }

      .chart-bars {
        display: flex;
        align-items: flex-end;
        gap: clamp(12px, 3vw, 24px);
        height: clamp(120px, 25vw, 160px);
        padding: 0 4px;
      }

      .bar-col {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-width: 0;
        align-items: center;
        gap: 6px;
      }

      .bar {
        width: 100%;
        max-width: 48px;
        background: linear-gradient(180deg, #3b82f6, #93c5fd);
        border-radius: 8px 8px 4px 4px;
        display: flex;
        justify-content: flex-start;
        padding-top: 4px;
        transition:
          transform 0.2s ease,
          box-shadow 0.2s ease,
          filter 0.2s ease;
        position: relative;
        min-height: 8px;

        &:hover {
          transform: scaleY(1.03) translateY(-3px);
          box-shadow: 0 8px 16px rgba(59, 130, 246, 0.4);
          filter: brightness(1.1);
        }
      }

      .bar-value {
        font-size: clamp(0.55rem, 1.5vw, 0.65rem);
        font-weight: 700;
        color: #fff;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        line-height: 1;
      }

      .bar-label {
        font-size: clamp(0.65rem, 2vw, 0.75rem);
        color: #64748b;
        font-weight: 500;
        text-align: center;
        white-space: nowrap;
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
        gap: 12px;
        padding: 12px 0;
        border-bottom: 1px solid rgba(241, 245, 249, 0.9);

        &:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
      }

      .activity-avatar {
        width: 36px;
        height: 36px;
        border-radius: 10px;
        background: color-mix(in srgb, var(--bg) 12%, white);
        color: var(--bg);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 0.75rem;
        flex-shrink: 0;
      }

      .activity-body {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
      }

      .activity-text {
        font-size: 0.85rem;
        color: #334155;
        line-height: 1.35;

        strong {
          color: #0f172a;
          font-weight: 600;
        }
      }

      .activity-time {
        font-size: 0.72rem;
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

  chartData: ChartData[] = [
    { label: 'Lun', value: 80 },
    { label: 'Mar', value: 60 },
    { label: 'Mer', value: 90 },
    { label: 'Jeu', value: 75 },
    { label: 'Ven', value: 85 },
    { label: 'Sam', value: 70 },
  ];

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
