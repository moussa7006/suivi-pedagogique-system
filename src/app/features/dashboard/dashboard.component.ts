import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <div class="header-section">
        <h1>Tableau de Bord</h1>
        <p>Aperçu en temps réel de l'activité académique</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="icon-box blue">
            <i class="pi pi-users"></i>
          </div>
          <div class="stat-info">
            <span class="label">Enseignants Actifs</span>
            <span class="value">124</span>
            <span class="trend positive"><i class="pi pi-arrow-up"></i> +12%</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="icon-box green">
            <i class="pi pi-check-circle"></i>
          </div>
          <div class="stat-info">
            <span class="label">Séances Aujourd'hui</span>
            <span class="value">42</span>
            <span class="trend neutral">Stable</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="icon-box orange">
            <i class="pi pi-clock"></i>
          </div>
          <div class="stat-info">
            <span class="label">Retards Signalés</span>
            <span class="value">3</span>
            <span class="trend negative"><i class="pi pi-arrow-down"></i> -2</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="icon-box purple">
            <i class="pi pi-book"></i>
          </div>
          <div class="stat-info">
            <span class="label">Progression Moyenne</span>
            <span class="value">68%</span>
            <div class="progress-bar-mini">
              <div class="fill" style="width: 68%"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="content-grid">
        <div class="card main-chart">
          <h3>Taux d'assiduité hebdomadaire</h3>
          <div class="chart-placeholder">
            <!-- On intégrera Chart.js ici -->
            <div class="fake-chart">
              <div class="bar" style="height: 80%"></div>
              <div class="bar" style="height: 60%"></div>
              <div class="bar" style="height: 90%"></div>
              <div class="bar" style="height: 75%"></div>
              <div class="bar" style="height: 85%"></div>
            </div>
          </div>
        </div>

        <div class="card recent-activity">
          <h3>Activités Récentes</h3>
          <div class="activity-item">
            <div class="avatar">DA</div>
            <div class="details">
              <strong>Dr. Alou</strong> a validé son émargement
              <span>Il y a 5 min • Amphi 500</span>
            </div>
          </div>
          <div class="activity-item">
            <div class="avatar orange">KB</div>
            <div class="details">
              <strong>K. Barry</strong> : Absence signalée
              <span>Il y a 15 min • Salle 12</span>
            </div>
          </div>
          <div class="activity-item">
            <div class="avatar green">ML</div>
            <div class="details">
              <strong>M. Lougue</strong> a rempli son cahier de textes
              <span>Il y a 1h • Mathématiques</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .header-section {
      h1 { margin: 0; font-size: 1.8rem; font-weight: 700; }
      p { margin: 4px 0 0; color: #64748b; }
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 24px;
      @media (max-width: 640px) { grid-template-columns: 1fr; gap: 16px; }
    }

    .stat-card {
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(10px);
      padding: 24px;
      border-radius: 16px;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
      display: flex;
      align-items: center;
      gap: 20px;
      border: 1px solid rgba(226, 232, 240, 0.5);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      cursor: pointer;
      @media (max-width: 640px) { padding: 16px; gap: 12px; }

      &:hover {
        box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
        border-color: #3b82f6;

        .icon-box {
          transform: scale(1.1) rotate(5deg);
        }
      }

      .icon-box {
        width: 60px;
        height: 60px;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.6rem;
        transition: transform 0.3s ease;
        
        &.blue { background: #eff6ff; color: #3b82f6; }
        &.green { background: #f0fdf4; color: #22c55e; }
        &.orange { background: #fff7ed; color: #f97316; }
        &.purple { background: #faf5ff; color: #a855f7; }
      }

      .stat-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
        
        .label { color: #64748b; font-size: 0.875rem; font-weight: 500; }
        .value { font-size: 1.5rem; font-weight: 700; color: #0f172a; }
        .trend {
          font-size: 0.75rem;
          font-weight: 600;
          &.positive { color: #22c55e; }
          &.negative { color: #ef4444; }
          &.neutral { color: #94a3b8; }
        }
      }
    }

    .progress-bar-mini {
      height: 6px;
      background: #f1f5f9;
      border-radius: 3px;
      width: 100px;
      margin-top: 8px;
      .fill { height: 100%; background: #a855f7; border-radius: 3px; }
    }

    .content-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 24px;
      @media (max-width: 1100px) { grid-template-columns: 1fr; }
    }

    .card {
      background: white;
      padding: 24px;
      border-radius: 16px;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
      h3 { margin: 0 0 20px; font-size: 1.1rem; color: #1e293b; }
    }

    .fake-chart {
      display: flex;
      align-items: flex-end;
      gap: 20px;
      height: 200px;
      padding-top: 40px;
      .bar {
        flex: 1;
        background: #3b82f6;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        opacity: 0.8;
        transition: opacity 0.3s;
        &:hover { opacity: 1; }
      }
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 0;
      border-bottom: 1px solid #f1f5f9;
      &:last-child { border: none; }

      .avatar {
        width: 40px;
        height: 40px;
        background: #3b82f6;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 0.85rem;
        &.orange { background: #f97316; }
        &.green { background: #22c55e; }
      }

      .details {
        display: flex;
        flex-direction: column;
        font-size: 0.9rem;
        span { font-size: 0.75rem; color: #64748b; }
      }
    }
  `]
})
export class DashboardComponent {}
