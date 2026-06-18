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
import { NotificationService } from '../../shared/notification/notification.service';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-seances',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
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
              <p>
                Aperçu des séances ({{ filteredSeances.length }} affichées / {{ seances.length }} au
                total)
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="filters-card">
        <div class="field">
          <label>Date</label>
          <input type="date" [(ngModel)]="filterDate" (change)="applyFilters()" />
        </div>
        <div class="field">
          <label>Statut</label>
          <select [(ngModel)]="filterStatus" (change)="applyFilters()">
            <option value="">Tous les statuts</option>
            <option value="A_VENIR">À venir</option>
            <option value="EN_COURS">En cours</option>
            <option value="TERMINEE">Terminée</option>
          </select>
        </div>
        <div class="field search-field">
          <label>Rechercher</label>
          <input
            type="text"
            [(ngModel)]="searchText"
            (keyup)="applyFilters()"
            placeholder="Enseignant, Salle, Classe..."
          />
        </div>
        <div class="field actions">
          <button class="btn btn-outline" (click)="resetFilters()">
            <i class="pi pi-refresh"></i> Rénitialiser
          </button>
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
              <tr *ngIf="filteredSeances.length === 0">
                <td colspan="5" class="text-center empty-state-cell">
                  Aucune séance trouvée pour les filtres actuels.
                </td>
              </tr>
              <tr *ngFor="let s of filteredSeances">
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
                    <span class="status-pill" [ngClass]="getSeanceStatusClass(s)">
                      <span class="status-dot"></span>
                      {{ getSeanceStatusLabel(s) }}
                    </span>
                    <span class="qr-status" [ngClass]="getQrStatusClass(s)" *ngIf="hasQrCode(s)">
                      <i [class]="s.emargementId ? 'pi pi-check-circle' : 'pi pi-qrcode'"></i>
                      {{ getQrStatusLabel(s) }}
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
            }

            .header-left-titles {
              h1 {
                margin: 0 0 6px 0;
                font-size: 1.5rem;
                font-weight: 700;
                color: #0f172a;
                letter-spacing: -0.02em;
              }

              p {
                margin: 0;
                color: #64748b;
                font-size: 0.95rem;
              }
            }
          }
        }
      }

      .filters-card {
        background: white;
        border-radius: 12px;
        padding: 16px 24px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        align-items: flex-end;

        .field {
          display: flex;
          flex-direction: column;
          gap: 6px;

          label {
            font-size: 0.8rem;
            font-weight: 600;
            color: #64748b;
          }

          input,
          select {
            padding: 8px 12px;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            font-size: 0.9rem;
            color: #1e293b;
            min-width: 150px;
            outline: none;
            transition: border-color 0.2s;

            &:focus {
              border-color: #3b82f6;
            }
          }
        }

        .search-field {
          flex: 1;
          input {
            width: 100%;
          }
        }

        .actions {
          margin-bottom: 2px;
          .btn-outline {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            background: white;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            color: #475569;
            font-weight: 600;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.2s ease;

            &:hover {
              background: #f8fafc;
              border-color: #94a3b8;
              color: #1e293b;
            }
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
          background: rgba(254, 243, 199, 0.95);
          color: #92400e;
          border-color: rgba(245, 158, 11, 0.45);
          .status-dot {
            background: #f59e0b;
          }
        }

        &.en-cours {
          background: rgba(220, 252, 231, 0.95);
          color: #166534;
          border-color: rgba(34, 197, 94, 0.45);
          .status-dot {
            background: #22c55e;
          }
        }

        &.terminee {
          background: rgba(254, 226, 226, 0.95);
          color: #991b1b;
          border-color: rgba(239, 68, 68, 0.45);
          .status-dot {
            background: #ef4444;
          }
        }
      }

      .qr-status {
        font-size: 0.72rem;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 2px 8px;
        border-radius: 4px;

        &.active {
          color: #047857;
          background: rgba(16, 185, 129, 0.12);
        }

        &.completed {
          color: #b91c1c;
          background: rgba(239, 68, 68, 0.1);
        }
      }
    `,
  ],
})
export class SeancesComponent implements OnInit, OnDestroy {
  seances: Seance[] = [];
  filteredSeances: Seance[] = [];
  teachers: Teacher[] = [];
  salles: Salle[] = [];
  classes: Classe[] = [];
  pollingTimer: any;

  filterDate: string = new Date().toISOString().split('T')[0];
  filterStatus: string = '';
  searchText: string = '';

  constructor(
    private scheduleService: ScheduleService,
    private teacherService: TeacherService,
    private salleService: SalleService,
    private classeService: ClasseService,
    private notificationService: NotificationService,
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
          this.filteredSeances = [];
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

        this.applyFilters();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des séances:', err);
        this.notificationService.error(
          'Erreur serveur: Impossible de charger les séances. ' + (err.message || ''),
        );
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

  hasQrCode(s: Seance): boolean {
    return !!s.qrCodeToken || !!s.qrCodeId;
  }

  getSeanceStatusClass(s: Seance): string {
    if (this.isSeanceFinished(s)) {
      return 'terminee';
    }

    if (this.hasQrCode(s)) {
      return 'en-cours';
    }

    return 'prevue';
  }

  getSeanceStatusLabel(s: Seance): string {
    if (this.isSeanceFinished(s)) {
      return 'Terminée';
    }

    if (this.hasQrCode(s)) {
      return 'En cours';
    }

    return 'Prévue';
  }

  getQrStatusClass(s: Seance): string {
    return this.isSeanceFinished(s) ? 'completed' : 'active';
  }

  getQrStatusLabel(s: Seance): string {
    if (this.isSeanceFinished(s)) {
      return s.emargementId ? 'Terminée avec émargement' : 'Séance terminée';
    }

    return s.emargementId ? 'Émargement effectué' : 'Code généré';
  }

  private isSeanceFinished(s: Seance): boolean {
    if (!s.dateCours || !s.heureFinReelle) {
      return false;
    }

    const endDateTime = new Date(`${s.dateCours}T${s.heureFinReelle}`).getTime();

    return Number.isFinite(endDateTime) && Date.now() >= endDateTime;
  }

  applyFilters() {
    const searchLower = this.searchText.toLowerCase().trim();
    this.filteredSeances = this.seances.filter((s) => {
      // 1. Filtre par date
      if (this.filterDate && s.dateCours !== this.filterDate) {
        return false;
      }

      // 2. Filtre par statut
      if (this.filterStatus) {
        const isFinished = this.isSeanceFinished(s);
        const inProgress = this.hasQrCode(s) && !isFinished;
        if (this.filterStatus === 'TERMINEE' && !isFinished) return false;
        if (this.filterStatus === 'EN_COURS' && !inProgress) return false;
        if (this.filterStatus === 'A_VENIR' && (isFinished || inProgress)) return false;
      }

      // 3. Filtre de recherche par texte libre (Enseignant, Salle, Classe)
      if (searchLower) {
        const ens = this.getEnseignantNom(s).toLowerCase();
        const salle = this.getSalleNom(s).toLowerCase();
        const classe = this.getClasseLibelle(s).toLowerCase();
        if (
          !ens.includes(searchLower) &&
          !salle.includes(searchLower) &&
          !classe.includes(searchLower)
        ) {
          return false;
        }
      }

      return true;
    });
  }

  resetFilters() {
    this.filterDate = new Date().toISOString().split('T')[0];
    this.filterStatus = '';
    this.searchText = '';
    this.applyFilters();
  }
}
