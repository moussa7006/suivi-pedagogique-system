import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AttendanceService } from '../../core/services/attendance.service';
import { Emargement } from '../../core/models/attendance.model';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="attendance-page">
      <div class="page-header">
        <div class="header-left">
          <div class="header-left-top">
            <a
              routerLink="/dashboard"
              class="btn-back-arrow"
              aria-label="Retour au tableau de bord"
              title="Retour au tableau de bord"
            >
              <i class="pi pi-arrow-left"></i>
            </a>
            <div class="header-left-titles">
              <h1>Suivi des Émargements</h1>
              <p>Historique des émargements enregistrés ({{ todayLogs.length }} entrées)</p>
            </div>
          </div>
        </div>
        <div class="header-actions">
          <button class="btn btn-outline"><i class="pi pi-download"></i> Exporter</button>
          <button class="btn btn-outline"><i class="pi pi-filter"></i> Filtres</button>
        </div>
      </div>

      <div class="stats-row">
        <div class="mini-stat">
          <div class="stat-icon green">
            <i class="pi pi-check-circle"></i>
          </div>
          <div class="stat-content">
            <span class="val">{{ getStats().valides }}</span>
            <span class="lab">Validés</span>
          </div>
        </div>
        <div class="mini-stat">
          <div class="stat-icon orange">
            <i class="pi pi-exclamation-triangle"></i>
          </div>
          <div class="stat-content">
            <span class="val">{{ getStats().horsPerimetre }}</span>
            <span class="lab">Hors périmètre</span>
          </div>
        </div>
        <div class="mini-stat">
          <div class="stat-icon blue">
            <i class="pi pi-file"></i>
          </div>
          <div class="stat-content">
            <span class="val">{{ getStats().justifies }}</span>
            <span class="lab">Justifiés</span>
          </div>
        </div>
      </div>

      <div class="table-card">
        <div class="table-header custom-table-header">
          <div class="table-header-top">
            <h3>Émargements</h3>
            <span class="record-count">{{ filteredLogs.length }} / {{ todayLogs.length }}</span>
          </div>

          <!-- Centered Search Bar -->
          <div class="search-container centered-search">
            <div class="search-input-wrapper">
              <i class="pi pi-search"></i>
              <input
                type="text"
                placeholder="Rechercher enseignant, lieu, statut..."
                [(ngModel)]="searchText"
                (input)="filterLogs()"
              />
            </div>
          </div>
        </div>
        <div class="table-scrollless">
          <table class="attendance-table">
            <thead>
              <tr>
                <th>Enseignant</th>
                <th>Lieu / Adresse</th>
                <th>Date & Heure</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngIf="filteredLogs.length === 0">
                <td colspan="4" class="text-center empty-state-cell">
                  Aucun enregistrement trouvé.
                </td>
              </tr>
              @for (log of filteredLogs; track log.id) {
                <tr>
                  <td>
                    <div class="teacher-cell">
                      <div class="teacher-avatar">
                        {{ getInitials(log.enseignantNomPrenom || '??') }}
                      </div>
                      <div class="teacher-name">
                        <strong>{{ log.enseignantNomPrenom }}</strong>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="sub-info">
                      <span class="subject">{{ log.lieu || 'Non spécifié' }}</span>
                      <small class="location"
                        ><i class="pi pi-map-marker"></i> {{ log.adresseApproximative }}</small
                      >
                    </div>
                  </td>
                  <td>
                    <span class="time-cell">
                      <i class="pi pi-clock"></i>
                      {{
                        log.dateHeureScan
                          ? (log.dateHeureScan | date: 'dd/MM/yy HH:mm')
                          : log.heureSeance
                      }}
                    </span>
                  </td>
                  <td>
                    <span class="status-pill" [ngClass]="getStatusClass(log.statut || '')">
                      <span class="status-dot"></span>
                      {{ getStatutLabel(log.statut) }}
                    </span>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .attendance-page {
        display: flex;
        flex-direction: column;
        gap: 24px;

        @media (max-width: 768px) {
          gap: 18px;
        }

        @media (max-width: 480px) {
          gap: 14px;
        }
      }

      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 12px;
        flex-wrap: wrap;

        .header-left {
          flex: 1;
          min-width: 220px;

          h1 {
            margin: 0 0 4px;
            font-size: clamp(1.1rem, 3vw, 1.75rem);
            font-weight: 800;
            color: #0f172a;
            letter-spacing: -0.02em;
            display: flex;
            align-items: center;
            gap: 12px;
            word-break: break-word;

            i {
              color: var(--primary-color);
              font-size: clamp(1.2rem, 3vw, 1.6rem);
            }
          }

          p {
            color: #64748b;
            margin: 6px 0 0;
            font-size: clamp(0.8rem, 1.5vw, 0.95rem);
            font-weight: 500;
          }
        }

        .header-actions {
          display: flex;
          gap: 10px;

          @media (max-width: 600px) {
            width: 100%;
            justify-content: flex-end;
          }
        }
      }

      .btn {
        padding: 11px 18px;
        border-radius: 12px;
        font-weight: 600;
        font-size: 0.9rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        border: none;
        transition: all 0.15s ease;
        position: relative;
        overflow: hidden;

        &::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255, 255, 255, 0.05);
          transition: opacity 0.3s;
          opacity: 0;
        }

        i {
          font-size: 1rem;
        }

        &.btn-outline {
          background: white;
          border: 1px solid var(--border-color);
          color: #475569;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);

          &:hover {
            background: #f8fafc;
            border-color: #cbd5e1;
            transform: translateY(-1px);
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);

            &::before {
              opacity: 1;
            }
          }

          &:active {
            transform: scale(0.97);
          }
        }
      }

      .stats-row {
        display: flex;
        gap: 18px;
        flex-wrap: wrap;

        @media (max-width: 768px) {
          gap: 12px;
        }

        @media (max-width: 480px) {
          flex-direction: column;
        }

        .mini-stat {
          background: white;
          flex: 1;
          min-width: 150px;
          padding: 18px 20px;
          border-radius: 14px;
          border: 1px solid rgba(226, 232, 240, 0.9);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
          display: flex;
          align-items: center;
          gap: 16px;
          transition: all 0.2s;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
          }

          .stat-icon {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.3rem;
            flex-shrink: 0;

            &.green {
              background: rgba(220, 252, 231, 0.8);
              color: #166534;
            }

            &.blue {
              background: rgba(219, 234, 254, 0.8);
              color: #1d4ed8;
            }

            &.orange {
              background: rgba(254, 237, 195, 0.8);
              color: #b45309;
            }
          }

          .stat-content {
            display: flex;
            flex-direction: column;

            .val {
              font-size: 1.5rem;
              font-weight: 800;
              color: #0f172a;
              line-height: 1;
            }

            .lab {
              font-size: 0.75rem;
              color: #64748b;
              font-weight: 600;
              margin-top: 4px;
            }
          }
        }
      }

      .table-card {
        background: white;
        border-radius: 16px;
        border: 1px solid rgba(226, 232, 240, 0.9);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);

        &:hover {
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
        }
      }

      .table-header {
        padding: 20px 24px;
        border-bottom: 1px solid rgba(241, 245, 249, 0.9);
      }

      .custom-table-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 12px;
      }

      .table-header-top {
        display: flex;
        align-items: center;
        gap: 12px;

        h3 {
          margin: 0;
          font-size: 1.15rem;
          font-weight: 700;
          color: #0f172a;
        }

        .record-count {
          background: rgba(219, 234, 254, 0.7);
          padding: 3px 10px;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 700;
          color: #1d4ed8;
        }
      }

      .centered-search {
        flex: 1;
        min-width: 240px;
        max-width: 380px;
      }

      .search-input-wrapper {
        position: relative;
        width: 100%;

        .pi-search {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          font-size: 0.9rem;
          pointer-events: none;
        }

        input {
          width: 100%;
          padding: 10px 14px 10px 40px;
          border-radius: 10px;
          border: 1px solid var(--border-color);
          font-size: 0.88rem;
          background: #f8fafc;
          transition: all 0.2s;
          box-sizing: border-box;

          &:focus {
            outline: none;
            border-color: var(--primary-color);
            background: white;
            box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.08);
          }

          &::placeholder {
            color: #94a3b8;
            font-weight: 400;
          }
        }
      }

      .table-scrollless {
        overflow-x: auto;
      }

      .table-scrollless::-webkit-scrollbar {
        height: 6px;
      }

      .empty-state-cell {
        padding: 48px 24px !important;
        color: #94a3b8;
        font-size: 0.95rem;
      }

      .attendance-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.9rem;
        min-width: 580px;

        thead {
          th {
            padding: 14px 20px;
            text-align: left;
            font-size: 0.78rem;
            font-weight: 700;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            background: rgba(248, 250, 252, 0.6);
            border-bottom: 1px solid rgba(226, 232, 240, 0.8);
          }
        }

        tbody {
          tr {
            transition: background 0.15s;

            &:last-child {
              td {
                border-bottom: none;
              }
            }

            &:hover {
              background: rgba(248, 250, 252, 0.6);
            }
          }

          td {
            padding: 16px 20px;
            border-bottom: 1px solid rgba(241, 245, 249, 0.9);
            vertical-align: middle;
          }
        }
      }

      .teacher-cell {
        display: flex;
        align-items: center;
        gap: 12px;

        .teacher-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(148, 163, 184, 0.07));
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.78rem;
          color: var(--primary-color);
          flex-shrink: 0;
        }

        .teacher-name {
          strong {
            color: #1e293b;
            font-size: 0.88rem;
          }
        }
      }

      .sub-info {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .subject {
          font-weight: 600;
          color: #334155;
          font-size: 0.88rem;
        }

        .location {
          color: #64748b;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 5px;

          i {
            color: #94a3b8;
            font-size: 0.75rem;
          }
        }
      }

      .time-cell {
        font-size: 0.85rem;
        color: #475569;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 6px;

        i {
          color: #94a3b8;
          font-size: 0.85rem;
        }
      }

      .status-pill {
        padding: 6px 14px;
        border-radius: 999px;
        font-size: 0.78rem;
        font-weight: 700;
        display: inline-flex;
        align-items: center;
        gap: 7px;
        border: 1px solid;
        text-transform: uppercase;
        letter-spacing: 0.03em;

        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          display: inline-block;
        }

        &.valide {
          background: rgba(220, 252, 231, 0.85);
          color: #166534;
          border-color: rgba(34, 197, 94, 0.5);

          .status-dot {
            background: #22c55e;
            box-shadow: 0 0 8px rgba(34, 197, 94, 0.5);
          }
        }

        &.hors-perimetre {
          background: rgba(254, 226, 226, 0.85);
          color: #b91c1c;
          border-color: rgba(239, 68, 68, 0.5);

          .status-dot {
            background: #ef4444;
            box-shadow: 0 0 8px rgba(239, 68, 68, 0.4);
          }
        }

        &.justifie {
          background: rgba(254, 237, 195, 0.85);
          color: #b45309;
          border-color: rgba(251, 191, 36, 0.5);

          .status-dot {
            background: #f59e0b;
            box-shadow: 0 0 8px rgba(245, 158, 11, 0.5);
          }
        }
      }

      @media (max-width: 768px) {
        .table-card {
          .attendance-table {
            font-size: 0.82rem;
          }
        }

        .page-header {
          .header-actions {
            width: 100%;
          }
        }
      }

      @media (max-width: 480px) {
        .header-left h1 {
          i {
            display: none;
          }
        }
      }
    `,
  ],
})
export class AttendanceComponent implements OnInit {
  todayLogs: Emargement[] = [];
  filteredLogs: Emargement[] = [];
  searchText: string = '';

  constructor(private attendanceService: AttendanceService) {}

  ngOnInit() {
    this.attendanceService.getAllAttendances().subscribe((data) => {
      this.todayLogs = data;
      this.filterLogs();
    });
  }

  filterLogs() {
    const text = this.searchText.toLowerCase();
    this.filteredLogs = this.todayLogs.filter(
      (log) =>
        (log.enseignantNomPrenom || '').toLowerCase().includes(text) ||
        (log.lieu || '').toLowerCase().includes(text) ||
        (log.adresseApproximative || '').toLowerCase().includes(text) ||
        (log.statut || '').toLowerCase().includes(text),
    );
  }

  getStats() {
    const valides = this.todayLogs.filter((l) => l.statut === 'VALIDE').length;
    const horsPerimetre = this.todayLogs.filter((l) => l.statut === 'HORS_PERIMETRE').length;
    const justifies = this.todayLogs.filter((l) => l.statut === 'JUSTIFIE').length;
    return { valides, horsPerimetre, justifies };
  }

  getStatutLabel(statut: string | undefined): string {
    switch (statut) {
      case 'EN_ATTENTE_FICHE':
        return 'Scan validé - fiche attendue';
      case 'VALIDE':
        return 'Validé';
      case 'HORS_PERIMETRE':
        return 'Hors périmètre';
      case 'JUSTIFIE':
        return 'Justifié';
      default:
        return statut || 'N/A';
    }
  }

  getInitials(name: string): string {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  getStatusClass(statut: string): string {
    switch (statut) {
      case 'EN_ATTENTE_FICHE':
        return 'pending';
      case 'VALIDE':
        return 'valide';
      case 'HORS_PERIMETRE':
        return 'hors-perimetre';
      case 'JUSTIFIE':
        return 'justifie';
      default:
        return '';
    }
  }
}
