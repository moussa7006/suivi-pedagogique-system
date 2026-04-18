import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface AttendanceLog {
  id: number;
  teacherName: string;
  subject: string;
  time: string;
  location: string;
  status: 'Présent' | 'En retard' | 'Absent';
  method: 'QR Code' | 'Manuel';
}

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="attendance-page">
      <div class="page-header">
        <div class="header-left">
          <h1><i class="pi pi-clipboard-check"></i> Suivi des Émargements</h1>
          <p>Historique des présences enregistrées aujourd'hui ({{ todayLogs.length }} séances)</p>
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
            <span class="val">92%</span>
            <span class="lab">Taux de présence</span>
          </div>
        </div>
        <div class="mini-stat">
          <div class="stat-icon blue">
            <i class="pi pi-book"></i>
          </div>
          <div class="stat-content">
            <span class="val">42</span>
            <span class="lab">Séances validées</span>
          </div>
        </div>
        <div class="mini-stat">
          <div class="stat-icon orange">
            <i class="pi pi-clock"></i>
          </div>
          <div class="stat-content">
            <span class="val">3</span>
            <span class="lab">Retards</span>
          </div>
        </div>
      </div>

      <div class="table-card">
        <div class="table-header">
          <h3>Émargements du jour</h3>
          <span class="record-count">{{ todayLogs.length }} enregistrements</span>
        </div>
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
            @for (log of todayLogs; track log.id) {
              <tr>
                <td>
                  <div class="teacher-cell">
                    <div class="teacher-avatar">{{ getInitials(log.teacherName) }}</div>
                    <div class="teacher-name">
                      <strong>{{ log.teacherName }}</strong>
                    </div>
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
                  <span class="time-cell"> <i class="pi pi-clock"></i> {{ log.time }} </span>
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
                  <span class="status-pill" [ngClass]="getStatusClass(log.status)">
                    <span class="status-dot"></span>
                    {{ log.status }}
                  </span>
                </td>
              </tr>
            }
          </tbody>
        </table>
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
            margin: 4px 0 0;
            font-size: clamp(0.8rem, 2.5vw, 0.95rem);
            font-weight: 500;
          }
        }

        .header-actions {
          display: flex;
          gap: 10px;
          flex-shrink: 0;

          @media (max-width: 600px) {
            width: 100%;
            justify-content: flex-start;
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
        transition:
          transform 0.2s cubic-bezier(0.22, 1, 0.36, 1),
          box-shadow 0.2s ease,
          background-color 0.2s ease,
          border-color 0.2s ease,
          color 0.2s ease;
        position: relative;
        overflow: hidden;

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
          transition: left 0.4s ease;
        }

        i {
          font-size: 1rem;
          transition: transform 0.2s ease;
        }

        &.btn-outline {
          background: white;
          border: 2px solid rgba(226, 232, 240, 0.8);
          color: #475569;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);

          &:hover {
            transform: translateY(-3px) scale(1.02);
            background: var(--primary-color);
            border-color: var(--primary-color);
            color: #fff;
            box-shadow:
              0 10px 20px rgba(37, 99, 235, 0.2),
              0 4px 8px rgba(37, 99, 235, 0.1);

            &::before {
              left: 100%;
            }

            i {
              transform: rotate(6deg) scale(1.1);
            }
          }

          &:active {
            transform: translateY(-1px) scale(1);
            box-shadow: 0 4px 10px rgba(37, 99, 235, 0.15);
          }
        }
      }

      .stats-row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 16px;

        @media (max-width: 768px) {
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 12px;
        }

        @media (max-width: 480px) {
          grid-template-columns: 1fr;
        }

        .mini-stat {
          background: white;
          padding: 18px 20px;
          border-radius: 14px;
          border: 2px solid rgba(226, 232, 240, 0.9);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
          display: flex;
          align-items: center;
          gap: 14px;
          transition:
            transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.3s ease,
            border-color 0.3s ease;

          &:hover {
            transform: translateY(-4px) scale(1.01);
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
            border-color: rgba(59, 130, 246, 0.25);
          }

          .stat-icon {
            width: 44px;
            height: 44px;
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
              font-size: 1.6rem;
              font-weight: 800;
              color: #0f172a;
              line-height: 1;
            }

            .lab {
              font-size: 0.8rem;
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
        box-shadow: 0 10px 30px rgba(2, 6, 23, 0.06);
        overflow: hidden;
        overflow-x: auto;

        &:hover {
          box-shadow: 0 14px 40px rgba(2, 6, 23, 0.08);
          border-color: rgba(59, 130, 246, 0.15);
        }
      }

      .table-header {
        padding: 20px 24px;
        background: rgba(248, 250, 252, 0.6);
        border-bottom: 1px solid rgba(241, 245, 249, 0.9);
        display: flex;
        justify-content: space-between;
        align-items: center;

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

      .attendance-table {
        width: 100%;
        border-collapse: collapse;

        thead {
          th {
            padding: 14px 20px;
            background: rgba(148, 163, 184, 0.08);
            text-align: left;
            color: #475569;
            font-size: 0.8rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            border-bottom: 2px solid rgba(226, 232, 240, 0.8);
          }
        }

        tbody {
          tr {
            transition: background-color 0.15s ease;
            border-bottom: 1px solid rgba(241, 245, 249, 0.8);

            &:last-child {
              border-bottom: none;
            }

            &:hover {
              background: rgba(37, 99, 235, 0.03);
            }
          }

          td {
            padding: 18px 20px;
            vertical-align: middle;
            color: #334155;
            font-size: 0.9rem;
          }
        }
      }

      .teacher-cell {
        display: flex;
        align-items: center;
        gap: 12px;

        .teacher-avatar {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(148, 163, 184, 0.08));
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.85rem;
          color: var(--primary-color);
          border: 2px solid rgba(255, 255, 255, 0.9);
          flex-shrink: 0;
        }

        .teacher-name {
          strong {
            color: #0f172a;
            font-weight: 700;
            font-size: 0.95rem;
          }
        }
      }

      .sub-info {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .subject {
          color: #0f172a;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .location {
          color: #94a3b8;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 5px;

          i {
            font-size: 0.75rem;
          }
        }
      }

      .time-cell {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 600;
        color: #334155;
        font-size: 0.9rem;

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
          background: rgba(37, 99, 235, 0.08);
          color: #2563eb;
          border-color: rgba(37, 99, 235, 0.25);
        }

        &.manual-method {
          background: rgba(241, 245, 249, 0.9);
          color: #64748b;
          border-color: rgba(226, 232, 240, 0.7);
        }
      }

      .status-pill {
        padding: 6px 14px;
        border-radius: 999px;
        font-size: 0.8rem;
        font-weight: 700;
        display: inline-flex;
        align-items: center;
        gap: 7px;
        border: 1px solid;

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

        &.en-retard {
          background: rgba(254, 249, 195, 0.85);
          color: #854d0e;
          border-color: rgba(253, 230, 138, 0.6);

          .status-dot {
            background: #eab308;
            box-shadow: 0 0 8px rgba(234, 179, 8, 0.5);
          }
        }

        &.absent {
          background: rgba(254, 226, 226, 0.85);
          color: #991b1b;
          border-color: rgba(254, 202, 202, 0.6);

          .status-dot {
            background: #ef4444;
            box-shadow: 0 0 8px rgba(239, 68, 68, 0.5);
          }
        }
      }

      @media (max-width: 768px) {
        .table-card {
          overflow-x: auto;

          .attendance-table {
            min-width: 600px;
          }
        }

        .page-header {
          flex-direction: column;
          align-items: flex-start;

          .header-actions {
            width: 100%;
          }
        }
      }

      @media (max-width: 480px) {
        .header-left h1 {
          font-size: 1.3rem;

          i {
            display: none;
          }
        }
      }
    `,
  ],
})
export class AttendanceComponent implements OnInit {
  todayLogs: AttendanceLog[] = [
    {
      id: 1,
      teacherName: 'Dr. Alou Diarra',
      subject: 'Algorithmique',
      time: '08:05',
      location: 'Amphi 500',
      status: 'Présent',
      method: 'QR Code',
    },
    {
      id: 2,
      teacherName: 'K. Barry',
      subject: 'Mathématiques',
      time: '10:45',
      location: 'Salle 12',
      status: 'En retard',
      method: 'QR Code',
    },
    {
      id: 3,
      teacherName: 'F. Coulibaly',
      subject: 'Informatique',
      time: '14:00',
      location: 'Amphi A',
      status: 'Présent',
      method: 'Manuel',
    },
    {
      id: 4,
      teacherName: 'M. Traoré',
      subject: 'Physique',
      time: '--:--',
      location: 'Labo 1',
      status: 'Absent',
      method: 'Manuel',
    },
  ];

  constructor() {}

  ngOnInit() {}

  getInitials(name: string): string {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Présent':
        return 'present';
      case 'En retard':
        return 'en-retard';
      case 'Absent':
        return 'absent';
      default:
        return '';
    }
  }
}
