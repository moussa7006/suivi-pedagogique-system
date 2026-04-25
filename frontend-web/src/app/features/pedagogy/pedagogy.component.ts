import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedagogyService } from '../../core/services/pedagogy.service';
import { LessonLog } from '../../core/models/lesson-log.model';

@Component({
  selector: 'app-pedagogy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pedagogy-container">
      <div class="page-header">
        <div class="header-left">
          <h1><i class="pi pi-book"></i> Validation Pédagogique</h1>
          <p>Vérifiez et approuvez les cahiers de textes des enseignants</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-outline"><i class="pi pi-filter"></i> Filtres</button>
          <button class="btn btn-outline"><i class="pi pi-download"></i> Exporter</button>
        </div>
      </div>

      <div class="stats-summary">
        <div class="summary-card total">
          <div class="stat-icon blue">
            <i class="pi pi-book"></i>
          </div>
          <div class="stat-content">
            <span class="value">42</span>
            <span class="label">Total Séances</span>
          </div>
        </div>
        <div class="summary-card warning">
          <div class="stat-icon orange">
            <i class="pi pi-clock"></i>
          </div>
          <div class="stat-content">
            <span class="value">12</span>
            <span class="label">À Valider</span>
          </div>
        </div>
        <div class="summary-card success">
          <div class="stat-icon green">
            <i class="pi pi-check-circle"></i>
          </div>
          <div class="stat-content">
            <span class="value">28</span>
            <span class="label">Approuvées</span>
          </div>
        </div>
      </div>

      <div class="logs-list">
        @for (log of lessonLogs; track log.id) {
          <div class="log-card" [ngClass]="getStatusClass(log.statutValidite || 'En attente')">
            <div class="log-header">
              <div class="teacher-info">
                <div class="teacher-avatar">{{ getInitials(log.enseignantNomPrenom || '') }}</div>
                <div class="details">
                  <span class="name">{{ log.enseignantNomPrenom }}</span>
                  <span class="subject">{{ log.matiereLibelle }} • {{ log.dateSeance }}</span>
                </div>
              </div>
              <div class="status-badge" [ngClass]="getStatusClass(log.statutValidite || 'En attente')">
                <span class="status-dot"></span>
                {{ log.statutValidite }}
              </div>
            </div>

            <div class="log-body">
              <div class="content-section">
                <div class="chapter-header">
                  <i class="pi pi-folder"></i>
                  <span class="chapter-title">{{ log.titreCours }}</span>
                </div>
                <p class="content-text">{{ log.contenu }}</p>
                <div class="meta-info">
                  <span class="meta-item">
                    <i class="pi pi-clock"></i>
                    <span>{{ log.heureSeance }}</span>
                  </span>
                  <span class="meta-item">
                    <i class="pi pi-calendar"></i>
                    <span>{{ log.dateSeance }}</span>
                  </span>
                </div>
              </div>

              @if (log.statutValidite === 'En attente') {
                <div class="actions">
                  <button class="btn btn-approve" (click)="updateStatus(log.id!, 'Validé')">
                    <i class="pi pi-check"></i> Approuver
                  </button>
                  <button class="btn btn-reject" (click)="updateStatus(log.id!, 'Rejeté')">
                    <i class="pi pi-times"></i> Rejeter
                  </button>
                </div>
              } @else {
                <div class="validated-label" [ngClass]="(log.statutValidite || '').toLowerCase()">
                  <i class="pi" [ngClass]="getValidatedIcon(log.statutValidite || '')"></i>
                  <span>Séance {{ (log.statutValidite || '').toLowerCase() }}e</span>
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .pedagogy-container {
        display: flex;
        flex-direction: column;
        gap: 28px;
      }

      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .header-left {
          h1 {
            margin: 0;
            font-size: 1.75rem;
            font-weight: 800;
            color: #0f172a;
            letter-spacing: -0.02em;
            display: flex;
            align-items: center;
            gap: 12px;

            i {
              color: var(--primary-color);
            }
          }

          p {
            color: #64748b;
            margin: 6px 0 0;
            font-size: 0.95rem;
            font-weight: 500;
          }
        }

        .header-actions {
          display: flex;
          gap: 10px;
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
          }
        }
      }

      .stats-summary {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;

        @media (max-width: 768px) {
          grid-template-columns: 1fr;
        }

        .summary-card {
          background: white;
          padding: 20px 24px;
          border-radius: 14px;
          border: 1px solid rgba(226, 232, 240, 0.9);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
          display: flex;
          align-items: center;
          gap: 16px;
          transition: all 0.2s ease;

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
            font-size: 1.4rem;
            flex-shrink: 0;

            &.blue {
              background: rgba(219, 234, 254, 0.8);
              color: #1d4ed8;
            }

            &.orange {
              background: rgba(254, 237, 195, 0.8);
              color: #b45309;
            }

            &.green {
              background: rgba(220, 252, 231, 0.8);
              color: #166534;
            }
          }

          .stat-content {
            display: flex;
            flex-direction: column;

            .value {
              font-size: 1.6rem;
              font-weight: 800;
              color: #0f172a;
              line-height: 1;
            }

            .label {
              font-size: 0.8rem;
              color: #64748b;
              font-weight: 600;
              margin-top: 4px;
            }
          }

          &.warning {
            .value {
              color: #b45309;
            }
          }

          &.success {
            .value {
              color: #166534;
            }
          }
        }
      }

      .logs-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .log-card {
        background: white;
        border-radius: 16px;
        border: 1px solid rgba(226, 232, 240, 0.9);
        transition: all 0.3s ease;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        overflow: hidden;

        &:hover {
          transform: translateX(4px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
          border-color: rgba(37, 99, 235, 0.3);
        }

        &.pending {
          border-left: 5px solid #f59e0b;
        }

        &.validated {
          border-left: 5px solid #22c55e;
        }

        &.rejected {
          border-left: 5px solid #ef4444;
        }
      }

      .log-header {
        padding: 18px 24px;
        border-bottom: 1px solid rgba(241, 245, 249, 0.9);
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: rgba(248, 250, 252, 0.4);

        .teacher-info {
          display: flex;
          align-items: center;
          gap: 14px;

          .teacher-avatar {
            width: 44px;
            height: 44px;
            border-radius: 12px;
            background: linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(148, 163, 184, 0.08));
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 0.9rem;
            color: var(--primary-color);
            border: 2px solid rgba(255, 255, 255, 0.9);
            flex-shrink: 0;
          }

          .details {
            display: flex;
            flex-direction: column;
            gap: 2px;

            .name {
              font-weight: 700;
              color: #0f172a;
              font-size: 0.95rem;
            }

            .subject {
              font-size: 0.8rem;
              color: #64748b;
              font-weight: 500;
            }
          }
        }
      }

      .status-badge {
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

        &.pending {
          background: rgba(254, 243, 199, 0.85);
          color: #b45309;
          border-color: rgba(251, 191, 36, 0.5);

          .status-dot {
            background: #f59e0b;
            box-shadow: 0 0 8px rgba(245, 158, 11, 0.5);
          }
        }

        &.validated {
          background: rgba(220, 252, 231, 0.85);
          color: #166534;
          border-color: rgba(34, 197, 94, 0.5);

          .status-dot {
            background: #22c55e;
            box-shadow: 0 0 8px rgba(34, 197, 94, 0.5);
          }
        }

        &.rejected {
          background: rgba(254, 226, 226, 0.85);
          color: #b91c1c;
          border-color: rgba(239, 68, 68, 0.5);

          .status-dot {
            background: #ef4444;
            box-shadow: 0 0 8px rgba(239, 68, 68, 0.5);
          }
        }
      }

      .log-body {
        padding: 24px;
        display: grid;
        grid-template-columns: 1fr 280px;
        gap: 24px;
        align-items: start;

        @media (max-width: 900px) {
          grid-template-columns: 1fr;
          gap: 20px;
        }

        .content-section {
          .chapter-header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 10px;

            i {
              color: var(--primary-color);
              font-size: 1rem;
            }

            .chapter-title {
              display: block;
              font-weight: 700;
              font-size: 1.05rem;
              color: #1e293b;
            }
          }

          .content-text {
            color: #475569;
            line-height: 1.7;
            margin-bottom: 16px;
            font-size: 0.92rem;
          }

          .meta-info {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;

            .meta-item {
              display: flex;
              align-items: center;
              gap: 7px;
              font-size: 0.85rem;
              color: #64748b;
              font-weight: 500;

              i {
                color: #94a3b8;
                font-size: 0.9rem;
              }
            }
          }
        }
      }

      .actions {
        display: flex;
        flex-direction: column;
        gap: 10px;
        min-width: 200px;

        .btn {
          width: 100%;
          padding: 12px 16px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.9rem;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s;

          &.btn-approve {
            background: rgba(220, 252, 231, 0.9);
            color: #166534;
            border: 1px solid rgba(34, 197, 94, 0.3);

            &:hover {
              background: #22c55e;
              color: white;
              transform: translateY(-2px);
              box-shadow: 0 6px 16px rgba(34, 197, 94, 0.35);
            }
          }

          &.btn-reject {
            background: rgba(254, 226, 226, 0.9);
            color: #b91c1c;
            border: 1px solid rgba(239, 68, 68, 0.3);

            &:hover {
              background: #ef4444;
              color: white;
              transform: translateY(-2px);
              box-shadow: 0 6px 16px rgba(239, 68, 68, 0.35);
            }
          }
        }
      }

      .validated-label {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        padding: 20px;
        border-radius: 12px;
        font-weight: 600;
        font-size: 0.9rem;
        background: rgba(241, 245, 249, 0.6);
        border: 1px solid rgba(226, 232, 240, 0.7);

        i {
          font-size: 1.3rem;
        }

        &.validé {
          color: #166534;
          background: rgba(220, 252, 231, 0.5);
          border-color: rgba(34, 197, 94, 0.3);

          i {
            color: #22c55e;
          }
        }

        &.rejeté {
          color: #b91c1c;
          background: rgba(254, 226, 226, 0.5);
          border-color: rgba(239, 68, 68, 0.3);

          i {
            color: #ef4444;
          }
        }
      }

      @media (max-width: 768px) {
        .page-header {
          flex-direction: column;
          align-items: flex-start;
          gap: 16px;

          .header-actions {
            width: 100%;
            justify-content: flex-end;
          }
        }

        .stats-summary {
          .summary-card {
            min-width: 140px;
            padding: 16px;
          }
        }
      }
    `,
  ],
})
export class PedagogyComponent implements OnInit {
  lessonLogs: LessonLog[] = [];

  constructor(private pedagogyService: PedagogyService) {}

  ngOnInit() {
    this.pedagogyService.getLessonLogs().subscribe((data) => (this.lessonLogs = data));
  }

  updateStatus(id: number, status: string) {
    this.pedagogyService.validateLog(id, status).subscribe(() => {
      // Refresh logs
      this.ngOnInit();
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'En attente':
        return 'pending';
      case 'Validé':
        return 'validated';
      case 'Rejeté':
        return 'rejected';
      default:
        return 'pending';
    }
  }

  getInitials(name: string): string {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  getValidatedIcon(status: string): string {
    return status === 'Validé' ? 'pi-check-circle' : 'pi-exclamation-circle';
  }
}
