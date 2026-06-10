import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ScheduleService } from '../../core/services/schedule.service';
import { ClasseService } from '../../core/services/classe.service';
import { TeacherService } from '../../core/services/teacher.service';
import { SalleService } from '../../core/services/salle.service';
import { Seance } from '../../core/models/schedule.model';
import { Classe } from '../../core/models/classe.model';
import { Teacher } from '../../core/models/user.model';
import { Salle } from '../../core/models/salle.model';

@Component({
  selector: 'app-seances',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-container">
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
              <h1>Séances (Sessions réelles)</h1>
              <p>Aperçu des séances générées par le système ({{ seances.length }} au total)</p>
            </div>
          </div>
        </div>
      </div>

      <div class="table-card">
        <div class="table-scrollless">
          <table class="data-table">
            <thead>
              <tr>
                <th>Date & Heure</th>
                <th>Enseignant</th>
                <th>Salle</th>
                <th>Classe</th>
                <th>Statut / QR Code</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngIf="seances.length === 0">
                <td colspan="5" class="text-center empty-state-cell">
                  Aucune séance générée pour le moment.
                </td>
              </tr>
              <tr *ngFor="let s of seances">
                <td>
                  <strong>{{ s.dateCours }}</strong
                  ><br />
                  <small>{{ s.heureDebutReelle }} - {{ s.heureFinReelle }}</small>
                </td>
                <td>
                  <div class="teacher-cell">
                    <div class="teacher-avatar">
                      <i class="pi pi-user"></i>
                    </div>
                    <div class="teacher-name">
                      <strong>{{ getEnseignantNom(s) }}</strong>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="badge-salle">
                    <i class="pi pi-map-marker"></i>
                    {{ getSalleNom(s) }}
                  </span>
                </td>
                <td>
                  <span class="badge-classe">{{ getClasseLibelle(s) }}</span>
                </td>
                <td>
                  <div class="status-group">
                    <span class="status-pill" [ngClass]="s.statut.toLowerCase()">
                      <span class="status-dot"></span>
                      {{ s.statut || 'N/A' }}
                    </span>
                    <span class="qr-status" *ngIf="s.qrCodeToken">
                      <i class="pi pi-qrcode"></i> Code Généré
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .page-container {
        display: flex;
        flex-direction: column;
        padding: clamp(12px, 3vw, 24px);
        gap: clamp(12px, 3vw, 24px);
        max-width: 100%;
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

          .header-left-top {
            display: flex;
            align-items: flex-start;
            gap: 16px;

            .btn-back-arrow {
              width: 36px;
              height: 36px;
              border-radius: 10px;
              display: flex;
              align-items: center;
              justify-content: center;
              background: white;
              border: 1px solid rgba(226, 232, 240, 0.8);
              color: #64748b;
              text-decoration: none;
              transition: all 0.2s ease;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
              margin-top: 2px;

              &:hover {
                background: #f8fafc;
                color: #0f172a;
                border-color: #cbd5e1;
                transform: translateX(-2px);
              }

              i {
                font-size: 1rem;
              }
            }
          }

          h1 {
            margin: 0 0 4px;
            font-size: clamp(1.1rem, 3vw, 1.75rem);
            font-weight: 800;
            color: #0f172a;
            letter-spacing: -0.02em;
          }

          p {
            color: #64748b;
            margin: 6px 0 0;
            font-size: clamp(0.8rem, 1.5vw, 0.95rem);
            font-weight: 500;
          }
        }
      }

      .btn {
        padding: 10px 16px;
        border-radius: 10px;
        font-weight: 600;
        font-size: 0.9rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        border: none;
        transition: all 0.2s;

        &.btn-primary {
          background: var(--primary-color, #3b82f6);
          color: white;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(37, 99, 235, 0.35);
          }
        }
      }

      .table-card {
        background: white;
        border-radius: 16px;
        border: 1px solid rgba(226, 232, 240, 0.9);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
        overflow: hidden;
      }

      .table-scrollless {
        overflow-x: auto;
      }

      .data-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.9rem;
        min-width: 700px;

        thead {
          th {
            padding: 16px 20px;
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
            color: #334155;
          }
        }
      }

      .empty-state-cell {
        padding: 48px 24px !important;
        color: #94a3b8 !important;
        font-size: 0.95rem;
      }

      .teacher-cell {
        display: flex;
        align-items: center;
        gap: 12px;

        .teacher-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(37, 99, 235, 0.1);
          color: #3b82f6;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
        }

        .teacher-name {
          strong {
            color: #1e293b;
            font-size: 0.88rem;
          }
        }
      }

      .badge-salle {
        background: #f1f5f9;
        color: #475569;
        padding: 4px 10px;
        border-radius: 6px;
        font-size: 0.8rem;
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        border: 1px solid #e2e8f0;

        i {
          color: #94a3b8;
          font-size: 0.75rem;
        }
      }

      .badge-classe {
        background: rgba(139, 92, 246, 0.1);
        color: #7c3aed;
        padding: 4px 10px;
        border-radius: 6px;
        font-size: 0.8rem;
        font-weight: 600;
        border: 1px solid rgba(139, 92, 246, 0.2);
      }

      .status-group {
        display: flex;
        flex-direction: column;
        gap: 6px;
        align-items: flex-start;
      }

      .status-pill {
        padding: 4px 12px;
        border-radius: 999px;
        font-size: 0.75rem;
        font-weight: 700;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        border: 1px solid;
        text-transform: uppercase;
        letter-spacing: 0.03em;

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          display: inline-block;
        }

        &.prevue {
          background: rgba(219, 234, 254, 0.85);
          color: #1d4ed8;
          border-color: rgba(59, 130, 246, 0.4);
          .status-dot {
            background: #3b82f6;
          }
        }

        &.terminee {
          background: rgba(220, 252, 231, 0.85);
          color: #166534;
          border-color: rgba(34, 197, 94, 0.4);
          .status-dot {
            background: #22c55e;
          }
        }
      }

      .qr-status {
        font-size: 0.72rem;
        color: #10b981;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 4px;
        background: rgba(16, 185, 129, 0.1);
        padding: 2px 8px;
        border-radius: 4px;
      }
    `,
  ],
})
export class SeancesComponent implements OnInit, OnDestroy {
  seances: Seance[] = [];
  teachers: Teacher[] = [];
  salles: Salle[] = [];
  classes: Classe[] = [];
  pollingTimer: any;

  constructor(
    private scheduleService: ScheduleService,
    private teacherService: TeacherService,
    private salleService: SalleService,
    private classeService: ClasseService,
  ) {}

  ngOnInit() {
    this.loadData();
    this.loadSeances();

    // Rafraîchissement automatique toutes les 30 secondes
    this.pollingTimer = setInterval(() => {
      this.loadSeances();
    }, 30000);
  }

  ngOnDestroy() {
    if (this.pollingTimer) {
      clearInterval(this.pollingTimer);
    }
  }

  loadData() {
    this.teacherService.getTeachers().subscribe((t) => (this.teachers = t));
    this.salleService.getAll().subscribe((s) => (this.salles = s));
    this.classeService.getAll().subscribe((c) => (this.classes = c));
  }

  loadSeances() {
    this.scheduleService.getAllSeances().subscribe({
      next: (data) => {
        console.log('Séances reçues:', data);
        if (!data || !Array.isArray(data)) {
          this.seances = [];
          return;
        }
        // Trier par date/heure la plus récente
        this.seances = data.sort((a, b) => {
          const dtA = a.dateCours ? a.dateCours.toString() : '1970-01-01';
          const hrA = a.heureDebutReelle ? a.heureDebutReelle.toString() : '00:00:00';
          const dtB = b.dateCours ? b.dateCours.toString() : '1970-01-01';
          const hrB = b.heureDebutReelle ? b.heureDebutReelle.toString() : '00:00:00';

          const dateA = new Date(dtA + 'T' + hrA).getTime();
          const dateB = new Date(dtB + 'T' + hrB).getTime();
          return dateB - dateA;
        });
      },
      error: (err) => {
        console.error('Erreur lors du chargement des séances:', err);
        alert('Erreur serveur: Impossible de charger les séances. ' + (err.message || ''));
      },
    });
  }

  getEnseignantNom(s: Seance): string {
    if (s.enseignantId) {
      const t = this.teachers.find((teacher) => teacher.id === s.enseignantId);
      if (t) return `${t.prenom} ${t.nom}`;
    }
    return `Enseignant #${s.enseignantId || '?'}`;
  }

  getSalleNom(s: Seance): string {
    if (s.salleId) {
      const salle = this.salles.find((sa) => sa.id === s.salleId);
      if (salle) return `${salle.nom} (${salle.batiment})`;
    }
    return `Salle #${s.salleId || '?'}`;
  }

  getClasseLibelle(s: Seance): string {
    if (s.classeId) {
      const c = this.classes.find((cl) => cl.id === s.classeId);
      if (c) return c.libelle;
    }
    return `Classe #${s.classeId || '?'}`;
  }
}
