import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin, of, Subscription, interval } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { sortByAlpha, sortByNumber } from '../../core/utils/sort-utils';
import {
  DashboardService,
  DashboardData,
  TopEnseignantRow,
  MatiereVolumetrieRow,
  ClasseEmargementRow,
} from '../../core/services/dashboard.service';
import { TeacherService } from '../../core/services/teacher.service';
import { ClasseService } from '../../core/services/classe.service';
import { MatiereService } from '../../core/services/matiere.service';
import { ScheduleService } from '../../core/services/schedule.service';

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

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-container">
      <!-- STATISTIQUES RAPIDES (collées au header/topbar) -->
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

      <!-- TABLEAUX ANALYTICS D'AIDE À LA DÉCISION -->
      <section class="analytics-section">
        <div class="section-title">
          <h2>Analytics décisionnels</h2>
          <p>
            Indicateurs clés pour identifier rapidement les forces, les charges importantes et les
            points à surveiller
          </p>
        </div>

        <div class="analytics-grid">
          <article class="analytics-card">
            <div class="analytics-card-header">
              <div>
                <h3>Enseignants performants</h3>
                <span>Triés par taux de validation</span>
              </div>
              <i class="pi pi-star"></i>
            </div>
            <div class="mini-chart" *ngIf="topEnseignants.length > 0">
              <div class="chart-row" *ngFor="let row of topEnseignants | slice: 0 : 4">
                <span>{{ row.nom }}</span>
                <div class="chart-track">
                  <div
                    class="chart-bar success"
                    [style.width.%]="toPercent(row.tauxValidation)"
                  ></div>
                </div>
                <strong>{{ row.tauxValidation }}%</strong>
              </div>
            </div>
            <div class="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Enseignant</th>
                    <th>Séances</th>
                    <th>Taux</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngIf="topEnseignants.length === 0">
                    <td colspan="3" class="empty-row">Aucune donnée disponible</td>
                  </tr>
                  <tr *ngFor="let row of topEnseignants | slice: 0 : 5">
                    <td>
                      <strong>{{ row.nom }}</strong>
                      <small>{{ row.specialite || row.matricule }}</small>
                    </td>
                    <td>{{ row.emargementsValides }}/{{ row.seancesPlanifiees }}</td>
                    <td>
                      <span class="rate-badge" [class.warn]="row.tauxValidation < 70"
                        >{{ row.tauxValidation }}%</span
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </article>

          <article class="analytics-card">
            <div class="analytics-card-header">
              <div>
                <h3>Matières à forte charge</h3>
                <span>Volume horaire décroissant</span>
              </div>
              <i class="pi pi-chart-bar"></i>
            </div>
            <div class="mini-chart" *ngIf="matieresVolumetrie.length > 0">
              <div class="chart-row" *ngFor="let row of matieresVolumetrie | slice: 0 : 4">
                <span>{{ row.libelle }}</span>
                <div class="chart-track">
                  <div
                    class="chart-bar info"
                    [style.width.%]="getVolumePercent(row.volumeHoraireTotal)"
                  ></div>
                </div>
                <strong>{{ row.volumeHoraireTotal }}h</strong>
              </div>
            </div>
            <div class="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Matière</th>
                    <th>Volume</th>
                    <th>Taux</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngIf="matieresVolumetrie.length === 0">
                    <td colspan="3" class="empty-row">Aucune donnée disponible</td>
                  </tr>
                  <tr *ngFor="let row of matieresVolumetrie | slice: 0 : 5">
                    <td>
                      <strong>{{ row.libelle }}</strong>
                      <small>{{ row.code }} · {{ row.departement }}</small>
                    </td>
                    <td>{{ row.volumeHoraireTotal }}h</td>
                    <td>
                      <span class="rate-badge" [class.warn]="row.tauxValidation < 70"
                        >{{ row.tauxValidation }}%</span
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </article>

          <article class="analytics-card priority">
            <div class="analytics-card-header">
              <div>
                <h3>Classes à surveiller</h3>
                <span>Taux de validation les plus faibles</span>
              </div>
              <i class="pi pi-exclamation-triangle"></i>
            </div>
            <div class="mini-chart" *ngIf="classesEmargement.length > 0">
              <div class="chart-row" *ngFor="let row of classesEmargement | slice: 0 : 4">
                <span>{{ row.libelle }}</span>
                <div class="chart-track">
                  <div
                    class="chart-bar warning"
                    [style.width.%]="toPercent(row.tauxValidation)"
                  ></div>
                </div>
                <strong>{{ row.tauxValidation }}%</strong>
              </div>
            </div>
            <div class="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Classe</th>
                    <th>Validées</th>
                    <th>Taux</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngIf="classesEmargement.length === 0">
                    <td colspan="3" class="empty-row">Aucune donnée disponible</td>
                  </tr>
                  <tr *ngFor="let row of classesEmargement | slice: 0 : 5">
                    <td>
                      <strong>{{ row.libelle }}</strong>
                      <small>{{ row.filiere }} · {{ row.niveau }}</small>
                    </td>
                    <td>{{ row.emargementsValides }}/{{ row.seancesPlanifiees }}</td>
                    <td>
                      <span class="rate-badge" [class.warn]="row.tauxValidation < 70"
                        >{{ row.tauxValidation }}%</span
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </article>
        </div>
      </section>

      <!-- TEXTES DE PRÉSENTATION (en bas des stats) -->
      <header class="page-header">
        <div class="header-actions">
          <button class="btn-secondary" [routerLink]="['/attendance']">
            <i class="pi pi-chart-bar"></i>
            Voir les présences
          </button>
        </div>
      </header>

      <!-- HUB DE NAVIGATION (CARTES DES MODULES) -->
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
        gap: 0;
      }

      /* TYPOGRAPHIE & TITRES */
      h1 {
        font-size: clamp(1.1rem, 1.6vw, 1.45rem);
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
        padding: 22px 0 4px;
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
          font-size: 1.05rem;
          letter-spacing: 0.08em;
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

      /* ANALYTICS DECISIONNELS */
      .analytics-section {
        margin-top: 18px;
      }

      .analytics-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 16px;
      }

      .analytics-card {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 20px;
        padding: 18px;
        box-shadow: 0 12px 28px rgba(15, 23, 42, 0.06);
        overflow: hidden;

        &.priority {
          border-color: #fed7aa;
          box-shadow: 0 12px 28px rgba(249, 115, 22, 0.1);
        }
      }

      .analytics-card-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 12px;
        margin-bottom: 14px;

        h3 {
          margin: 0 0 4px;
          color: #0f172a;
          font-size: 1rem;
          font-weight: 850;
        }

        span {
          color: #64748b;
          font-size: 0.78rem;
          font-weight: 650;
        }

        i {
          width: 36px;
          height: 36px;
          min-width: 36px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #1d4ed8;
          background: #eff6ff;
        }
      }

      .mini-chart {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 12px;
        margin-bottom: 14px;
        border-radius: 16px;
        background: linear-gradient(135deg, #f8fafc, #ffffff);
        border: 1px solid #e2e8f0;
      }

      .chart-row {
        display: grid;
        grid-template-columns: minmax(92px, 1fr) minmax(110px, 1.4fr) 48px;
        align-items: center;
        gap: 10px;
        font-size: 0.76rem;
        color: #475569;

        span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-weight: 750;
        }

        strong {
          color: #0f172a;
          font-weight: 900;
          text-align: right;
        }
      }

      .chart-track {
        height: 9px;
        border-radius: 999px;
        background: #e2e8f0;
        overflow: hidden;
      }

      .chart-bar {
        height: 100%;
        min-width: 4px;
        border-radius: inherit;
        transition: width 0.35s ease;

        &.success {
          background: linear-gradient(90deg, #22c55e, #16a34a);
        }

        &.info {
          background: linear-gradient(90deg, #38bdf8, #2563eb);
        }

        &.warning {
          background: linear-gradient(90deg, #f97316, #ef4444);
        }
      }

      .table-responsive {
        overflow-x: auto;
      }

      .analytics-card table {
        width: 100%;
        border-collapse: collapse;
        min-width: 360px;
      }

      .analytics-card th,
      .analytics-card td {
        padding: 10px 8px;
        border-bottom: 1px solid #f1f5f9;
        text-align: left;
        font-size: 0.82rem;
      }

      .analytics-card th {
        color: #475569;
        font-size: 0.72rem;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        background: #f8fafc;
      }

      .analytics-card td {
        color: #334155;
        vertical-align: top;
      }

      .analytics-card strong {
        display: block;
        color: #0f172a;
        font-weight: 800;
      }

      .analytics-card small {
        display: block;
        color: #64748b;
        font-size: 0.72rem;
        margin-top: 2px;
      }

      .rate-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 52px;
        padding: 4px 8px;
        border-radius: 999px;
        background: #dcfce7;
        color: #166534;
        font-weight: 850;
        font-size: 0.76rem;

        &.warn {
          background: #ffedd5;
          color: #c2410c;
        }
      }

      .empty-row {
        text-align: center !important;
        color: #94a3b8 !important;
        font-weight: 700;
      }

      /* HUB DE NAVIGATION */
      .workspace-hub {
        margin-top: 14px;
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
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
            font-weight: 700;
            color: #64748b;
            background: #f1f5f9;
            padding: 4px 10px;
            border-radius: 999px;
            text-transform: uppercase;
            letter-spacing: 0.04em;
          }
        }

        .card-body {
          h3 {
            font-size: 1.1rem;
            font-weight: 800;
            color: #0f172a;
            margin: 0 0 6px;
          }

          p {
            font-size: 0.88rem;
            color: #64748b;
            margin: 0 0 12px;
          }

          .module-indicator {
            display: inline-block;
            font-size: 0.78rem;
            font-weight: 700;
            color: var(--tile-color);
            background: color-mix(in srgb, var(--tile-color) 10%, transparent);
            padding: 4px 10px;
            border-radius: 8px;
          }
        }

        .card-footer {
          margin-top: 16px;
          padding-top: 14px;
          border-top: 1px solid #f1f5f9;

          .action-link {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 0.85rem;
            font-weight: 700;
            color: #94a3b8;
            transition: color 0.2s;
          }
        }
      }

      .data-card {
        background: rgba(255, 255, 255, 0.96);
        border-radius: 24px;
        padding: 28px;
        border: 1px solid rgba(226, 232, 240, 0.95);
        box-shadow: 0 18px 42px rgba(15, 23, 42, 0.06);
      }

      @media (max-width: 1180px) {
        .hub-grid,
        .analytics-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      @media (max-width: 720px) {
        .hub-grid,
        .analytics-grid {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 720px) {
        .page-header {
          padding: 18px;
        }

        .stats-overview {
          position: static;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          padding: 0;
          background: transparent;
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
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

  topEnseignants: TopEnseignantRow[] = [];
  matieresVolumetrie: MatiereVolumetrieRow[] = [];
  classesEmargement: ClasseEmargementRow[] = [];

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

  get sortedHubTiles(): HubTile[] {
    return sortByAlpha(this.hubTiles, (tile) => tile.label);
  }

  toPercent(value: number | null | undefined): number {
    return Math.max(0, Math.min(100, Number(value) || 0));
  }

  getVolumePercent(value: number | null | undefined): number {
    const maxVolume = Math.max(
      ...this.matieresVolumetrie.map((row) => Number(row.volumeHoraireTotal) || 0),
      1,
    );
    return Math.max(4, Math.min(100, ((Number(value) || 0) / maxVolume) * 100));
  }

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

  constructor(
    private dashboardService: DashboardService,
    private teacherService: TeacherService,
    private classeService: ClasseService,
    private matiereService: MatiereService,
    private scheduleService: ScheduleService,
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
      dashboardStats: this.dashboardService.getDashboardData().pipe(
        catchError((error) => {
          console.error('[Dashboard] Erreur API Dashboard:', error);
          return of(null);
        }),
      ),
      teachers: this.teacherService.getTeachers().pipe(
        catchError((error) => {
          console.error('[Dashboard] Erreur chargement enseignants:', error);
          return of([]);
        }),
      ),
      classes: this.classeService.getAll().pipe(
        catchError((error) => {
          console.error('[Dashboard] Erreur chargement classes:', error);
          return of([]);
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
          return of([]);
        }),
      ),
    }).subscribe(({ dashboardStats, teachers, classes, matieres, seances }) => {
      // KPI cards : toujours alimentés depuis les sources individuelles (fiability).
      // On privilégie les données fraîches des services dédiés ; le endpoint
      // dashboard sert de retombée si un service individuel échoue.
      const today = new Date().toISOString().slice(0, 10);
      const seancesTodayCount = seances.filter((s) => {
        const d = s.dateCours ? new Date(s.dateCours).toISOString().slice(0, 10) : null;
        return d === today;
      }).length;

      this.stats[0].value = teachers.length || dashboardStats?.totalTeachers || 0;
      this.stats[1].value = classes.length || dashboardStats?.totalClasses || 0;
      this.stats[2].value = matieres.length || dashboardStats?.totalMatieres || 0;
      this.stats[3].value = seancesTodayCount || dashboardStats?.sessionsToday || 0;

      // Indicateurs des tuiles du hub de navigation.
      this.hubTiles[2].indicator = `${teachers.length} enseignant${teachers.length > 1 ? 's' : ''}`;
      this.hubTiles[0].indicator = `${classes.length} classe${classes.length > 1 ? 's' : ''}`;
      this.hubTiles[1].indicator = `${matieres.length} matière${matieres.length > 1 ? 's' : ''}`;
      this.hubTiles[3].indicator = `${seances.length} séance${seances.length > 1 ? 's' : ''}`;
      this.hubTiles[5].indicator = `${seances.length} émargement${seances.length > 1 ? 's' : ''}`;

      // Tableaux analytiques : depuis le endpoint dashboard.
      if (dashboardStats) {
        this.topEnseignants = sortByNumber(
          dashboardStats.topEnseignants || [],
          (row) => row.tauxValidation,
          'desc',
        );
        this.matieresVolumetrie = sortByNumber(
          dashboardStats.matieresVolumetrie || [],
          (row) => row.volumeHoraireTotal,
          'desc',
        );
        this.classesEmargement = sortByNumber(
          dashboardStats.classesEmargement || [],
          (row) => row.tauxValidation,
          'asc',
        );
      }
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
