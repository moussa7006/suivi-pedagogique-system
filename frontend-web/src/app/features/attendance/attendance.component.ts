import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ScanLog {
  id: number;
  teacherName: string;
  subject: string;
  time: string;
  location: string;
  method: 'QR Code' | 'Manuel';
  status: 'success' | 'blocked';
}

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="attendance-page">
      <div class="page-header">
        <div class="header-left">
          <div class="header-icon">
            <i class="pi pi-clipboard-check"></i>
          </div>
          <div>
            <h1>Historique des Émargements</h1>
            <p>Liste des enseignants ayant scanné le QR Code pour émarger</p>
          </div>
        </div>
        <div class="header-actions">
          <button class="btn btn-outline">
            <i class="pi pi-download"></i> <span class="btn-text">Exporter</span>
          </button>
          <button class="btn btn-outline">
            <i class="pi pi-filter"></i> <span class="btn-text">Filtres</span>
          </button>
        </div>
      </div>

      <div class="stats-row">
        <div class="stat-card" style="--accent: #22c55e">
          <div class="stat-icon green"><i class="pi pi-check-circle"></i></div>
          <div class="stat-info">
            <span class="stat-value">92%</span>
            <span class="stat-label">Taux de présence</span>
          </div>
        </div>
        <div class="stat-card" style="--accent: #3b82f6">
          <div class="stat-icon blue"><i class="pi pi-book"></i></div>
          <div class="stat-info">
            <span class="stat-value">28</span>
            <span class="stat-label">Cahiers validés</span>
          </div>
        </div>
        <div class="stat-card" style="--accent: #ef4444">
          <div class="stat-icon red"><i class="pi pi-ban"></i></div>
          <div class="stat-info">
            <span class="stat-value">3</span>
            <span class="stat-label">Scans bloqués</span>
          </div>
        </div>
      </div>

      <div class="table-card">
        <div class="table-top">
          <h3>Scans d'émargement du jour</h3>
          <span class="record-count">{{ scanLogs.length }} enregistrements</span>
        </div>

        <div class="table-scroll">
          <table class="attendance-table">
            <thead>
              <tr>
                <th>Enseignant</th>
                <th>Matière / Lieu</th>
                <th>Heure</th>
                <th>Méthode</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              @for (log of scanLogs; track log.id) {
                <tr [ngClass]="log.status === 'success' ? 'row-success' : 'row-blocked'">
                  <td>
                    <div class="teacher-cell">
                      <div
                        class="teacher-avatar"
                        [ngClass]="log.status === 'success' ? 'avatar-ok' : 'avatar-blocked'"
                      >
                        {{ getInitials(log.teacherName) }}
                      </div>
                      <span class="teacher-name">{{ log.teacherName }}</span>
                    </div>
                  </td>
                  <td>
                    <div class="sub-info">
                      <span class="subject">{{ log.subject }}</span>
                      <small class="location"
                        ><i class="pi pi-map-marker"></i> {{ log.location }}</small
                      >
                    </div>
                  </td>
                  <td>
                    <span class="time-cell"><i class="pi pi-clock"></i> {{ log.time }}</span>
                  </td>
                  <td>
                    <span
                      class="method-tag"
                      [ngClass]="log.method === 'QR Code' ? 'qr-method' : 'manual-method'"
                    >
                      <i
                        class="pi"
                        [ngClass]="log.method === 'QR Code' ? 'pi-qrcode' : 'pi-pencil'"
                      ></i>
                      {{ log.method }}
                    </span>
                  </td>
                  <td>
                    @if (log.status === 'success') {
                      <div class="status-cell">
                        <span class="status-pill present">
                          <span class="status-dot"></span>
                          Émargé
                        </span>
                        <span class="auto-badge"
                          ><i class="pi pi-check-circle"></i> Cahier auto-validé</span
                        >
                      </div>
                    } @else {
                      <div class="status-cell">
                        <span class="status-pill blocked">
                          <span class="status-dot"></span>
                          Bloqué
                        </span>
                        <span class="block-reason"
                          ><i class="pi pi-exclamation-circle"></i> Cahier manquant</span
                        >
                      </div>
                    }
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
      }

      /* ===== HEADER ===== */
      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
        flex-wrap: wrap;

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1;
          min-width: 0;

          .header-icon {
            width: 48px;
            height: 48px;
            border-radius: 14px;
            background: linear-gradient(135deg, rgba(22, 163, 74, 0.1), rgba(34, 197, 94, 0.05));
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;

            i {
              font-size: 1.3rem;
              color: #16a34a;
            }
          }

          h1 {
            margin: 0;
            font-size: clamp(1.1rem, 3vw, 1.6rem);
            font-weight: 800;
            color: #0f172a;
            letter-spacing: -0.02em;
          }

          p {
            margin: 4px 0 0;
            color: #64748b;
            font-size: 0.9rem;
            font-weight: 500;
          }
        }

        .header-actions {
          display: flex;
          gap: 10px;
          flex-shrink: 0;
        }
      }

      /* ===== BUTTONS ===== */
      .btn {
        padding: 10px 18px;
        border-radius: 10px;
        font-weight: 600;
        font-size: 0.88rem;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 7px;
        border: none;
        transition: all 0.2s ease;

        i {
          font-size: 0.95rem;
        }

        &.btn-outline {
          background: white;
          border: 1.5px solid rgba(226, 232, 240, 0.9);
          color: #475569;

          &:hover {
            border-color: var(--primary-color);
            color: var(--primary-color);
            background: rgba(37, 99, 235, 0.04);
          }
        }
      }

      @media (max-width: 640px) {
        .btn .btn-text {
          display: none;
        }
        .btn {
          padding: 10px 12px;
        }
      }

      /* ===== STATS ===== */
      .stats-row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
      }

      .stat-card {
        background: white;
        border-radius: 14px;
        border: 1px solid rgba(226, 232, 240, 0.9);
        padding: 20px;
        display: flex;
        align-items: center;
        gap: 14px;
        transition: all 0.25s ease;
        position: relative;
        overflow: hidden;

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: var(--accent);
          border-radius: 4px 0 0 4px;
          transform: scaleY(0);
          transition: transform 0.3s ease;
        }

        &:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 24px rgba(2, 6, 23, 0.07);
          border-color: color-mix(in srgb, var(--accent) 30%, white);

          &::before {
            transform: scaleY(1);
          }
          .stat-icon {
            transform: scale(1.08);
          }
        }

        .stat-icon {
          width: 46px;
          height: 46px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          flex-shrink: 0;
          transition: transform 0.2s ease;

          &.green {
            background: rgba(220, 252, 231, 0.7);
            color: #166534;
          }
          &.blue {
            background: rgba(219, 234, 254, 0.7);
            color: #1d4ed8;
          }
          &.red {
            background: rgba(254, 226, 226, 0.7);
            color: #991b1b;
          }
        }

        .stat-info {
          display: flex;
          flex-direction: column;

          .stat-value {
            font-size: 1.5rem;
            font-weight: 800;
            color: #0f172a;
            line-height: 1;
          }

          .stat-label {
            font-size: 0.8rem;
            color: #64748b;
            font-weight: 600;
            margin-top: 4px;
          }
        }
      }

      /* ===== TABLE CARD ===== */
      .table-card {
        background: white;
        border-radius: 16px;
        border: 1px solid rgba(226, 232, 240, 0.9);
        box-shadow: 0 4px 16px rgba(2, 6, 23, 0.04);
        overflow: hidden;
      }

      .table-top {
        padding: 20px 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid rgba(241, 245, 249, 0.9);
        background: rgba(248, 250, 252, 0.5);

        h3 {
          margin: 0;
          font-size: 1.05rem;
          font-weight: 700;
          color: #1e293b;
        }

        .record-count {
          font-size: 0.8rem;
          color: #94a3b8;
          font-weight: 600;
          background: rgba(241, 245, 249, 0.8);
          padding: 4px 12px;
          border-radius: 999px;
        }
      }

      .table-scroll {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
      }

      /* ===== TABLE ===== */
      .attendance-table {
        width: 100%;
        border-collapse: collapse;
        min-width: 700px;

        thead th {
          padding: 14px 20px;
          background: rgba(248, 250, 252, 0.8);
          text-align: left;
          color: #475569;
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          border-bottom: 2px solid rgba(226, 232, 240, 0.8);
        }

        tbody tr {
          transition: all 0.15s ease;
          border-bottom: 1px solid rgba(241, 245, 249, 0.9);

          &:last-child {
            border-bottom: none;
          }

          &:hover {
            background: rgba(37, 99, 235, 0.025);
          }

          &.row-success {
            border-left: 3px solid #22c55e;
          }

          &.row-blocked {
            border-left: 3px solid #ef4444;
          }
        }

        tbody td {
          padding: 16px 20px;
          vertical-align: middle;
          color: #334155;
          font-size: 0.88rem;
        }
      }

      /* ===== TABLE CELLS ===== */
      .teacher-cell {
        display: flex;
        align-items: center;
        gap: 12px;

        .teacher-avatar {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.85rem;
          flex-shrink: 0;
          border: 2px solid rgba(255, 255, 255, 0.9);

          &.avatar-ok {
            background: linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(34, 197, 94, 0.05));
            color: #166534;
          }

          &.avatar-blocked {
            background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.05));
            color: #991b1b;
          }
        }

        .teacher-name {
          font-weight: 700;
          color: #0f172a;
          font-size: 0.92rem;
        }
      }

      .sub-info {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .subject {
          color: #0f172a;
          font-weight: 600;
          font-size: 0.88rem;
        }

        .location {
          color: #94a3b8;
          font-size: 0.78rem;
          display: flex;
          align-items: center;
          gap: 5px;

          i {
            font-size: 0.72rem;
          }
        }
      }

      .time-cell {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 600;
        color: #334155;
        font-size: 0.88rem;

        i {
          color: #94a3b8;
          font-size: 0.85rem;
        }
      }

      .method-tag {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 0.8rem;
        font-weight: 600;
        padding: 5px 11px;
        border-radius: 8px;
        border: 1px solid;

        i {
          font-size: 0.85rem;
        }

        &.qr-method {
          background: rgba(219, 234, 254, 0.7);
          color: #2563eb;
          border-color: rgba(37, 99, 235, 0.2);
        }

        &.manual-method {
          background: rgba(241, 245, 249, 0.9);
          color: #64748b;
          border-color: rgba(226, 232, 240, 0.7);
        }
      }

      .status-cell {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .status-pill {
        padding: 5px 14px;
        border-radius: 999px;
        font-size: 0.8rem;
        font-weight: 700;
        display: inline-flex;
        align-items: center;
        gap: 7px;
        border: 1px solid;
        width: fit-content;

        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          display: inline-block;
        }

        &.present {
          background: rgba(220, 252, 231, 0.85);
          color: #166534;
          border-color: rgba(187, 240, 208, 0.6);

          .status-dot {
            background: #22c55e;
            box-shadow: 0 0 8px rgba(34, 197, 94, 0.5);
          }
        }

        &.blocked {
          background: rgba(254, 226, 226, 0.85);
          color: #991b1b;
          border-color: rgba(254, 202, 202, 0.6);

          .status-dot {
            background: #ef4444;
            box-shadow: 0 0 8px rgba(239, 68, 68, 0.5);
          }
        }
      }

      .auto-badge {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        font-size: 0.72rem;
        font-weight: 600;
        color: #166534;
        background: rgba(220, 252, 231, 0.5);
        padding: 3px 8px;
        border-radius: 6px;
        width: fit-content;

        i {
          font-size: 0.75rem;
        }
      }

      .block-reason {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        font-size: 0.72rem;
        font-weight: 600;
        color: #991b1b;
        background: rgba(254, 226, 226, 0.5);
        padding: 3px 8px;
        border-radius: 6px;
        width: fit-content;

        i {
          font-size: 0.75rem;
        }
      }

      /* ===== RESPONSIVE ===== */
      @media (max-width: 768px) {
        .page-header {
          flex-direction: column;
          align-items: flex-start;
        }

        .stats-row {
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        }

        .table-card {
          overflow-x: auto;

          .attendance-table {
            min-width: 600px;
          }
        }

        .status-cell {
          gap: 4px;
        }

        .auto-badge,
        .block-reason {
          font-size: 0.68rem;
          padding: 2px 6px;
        }
      }

      @media (max-width: 480px) {
        .page-header .header-left h1 {
          font-size: 1.2rem;
        }

        .page-header .header-left .header-icon {
          width: 40px;
          height: 40px;

          i {
            font-size: 1.1rem;
          }
        }

        .stats-row {
          grid-template-columns: 1fr;
        }

        .auto-badge,
        .block-reason {
          font-size: 0.65rem;
        }
      }
    `,
  ],
})
export class AttendanceComponent {
  scanLogs: ScanLog[] = [
    {
      id: 1,
      teacherName: 'Dr. Alou Diarra',
      subject: 'Algorithmique',
      time: '08:05',
      location: 'Amphi 500',
      status: 'success',
      method: 'QR Code',
    },
    {
      id: 2,
      teacherName: 'K. Barry',
      subject: 'Mathématiques',
      time: '08:12',
      location: 'Salle 12',
      status: 'success',
      method: 'QR Code',
    },
    {
      id: 3,
      teacherName: 'F. Coulibaly',
      subject: 'Bases de données',
      time: '08:10',
      location: 'Amphi A',
      status: 'blocked',
      method: 'QR Code',
    },
    {
      id: 4,
      teacherName: 'M. Traoré',
      subject: 'Physique',
      time: '--:--',
      location: 'Labo 1',
      status: 'blocked',
      method: 'Manuel',
    },
    {
      id: 5,
      teacherName: 'S. Keita',
      subject: 'Droit Civil',
      time: '10:30',
      location: 'Salle 8',
      status: 'success',
      method: 'QR Code',
    },
  ];

  getInitials(name: string): string {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }
}
