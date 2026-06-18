import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { HonorairesCalcul } from '../../core/models/honoraires.model';
import { Teacher } from '../../core/models/user.model';
import { HonorairesService } from '../../core/services/honoraires.service';
import { TeacherService } from '../../core/services/teacher.service';

import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-honoraires',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SelectModule],
  template: `
    <div class="honoraires-page">
      <div class="page-header">
        <div class="header-left-top">
          <a routerLink="/dashboard" class="btn-back-arrow" title="Retour au tableau de bord">
            <i class="pi pi-arrow-left"></i>
          </a>
          <div>
            <h1>Honoraires enseignants</h1>
            <p>Calculez, validez et suivez les paiements mensuels des enseignants.</p>
          </div>
        </div>
      </div>

      <div class="filters-card">
        <div class="field">
          <label>Année</label>
          <input type="number" [(ngModel)]="annee" min="2020" max="2100" />
        </div>
        <div class="field">
          <label>Mois</label>
          <select [(ngModel)]="mois">
            <option *ngFor="let m of moisOptions" [ngValue]="m.value">{{ m.label }}</option>
          </select>
        </div>
        <div class="field teacher-field" *ngIf="isAdmin">
          <label>Enseignant pour le calcul</label>
          <p-select
            [options]="dropdownOptions"
            [(ngModel)]="selectedTeacherId"
            optionLabel="label"
            optionValue="value"
            placeholder="Sélectionner un enseignant"
            [style]="{
              width: '100%',
              height: '42px',
              'border-radius': '12px',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
            }"
            [panelStyle]="{
              'max-height': '300px',
              background: '#ffffff',
              'box-shadow': '0 10px 25px rgba(0,0,0,0.15)',
              border: '1px solid #e2e8f0',
              'border-radius': '8px',
              'z-index': '1000',
            }"
          >
            <ng-template pTemplate="selectedItem">
              <div class="teacher-dropdown-item" *ngIf="selectedTeacherData">
                <img
                  *ngIf="selectedTeacherData.photoUrl"
                  [src]="selectedTeacherData.photoUrl"
                  class="teacher-dropdown-avatar"
                />
                <div
                  *ngIf="
                    !selectedTeacherData.photoUrl &&
                    selectedTeacherData.id !== -1 &&
                    selectedTeacherData.id !== null
                  "
                  class="teacher-dropdown-initials"
                >
                  {{ getInitials(selectedTeacherData.prenom + ' ' + selectedTeacherData.nom) }}
                </div>
                <div class="teacher-dropdown-info">
                  <span>{{ selectedTeacherData.label }}</span>
                  <small
                    *ngIf="selectedTeacherData.matricule"
                    style="color:#64748b; margin-left: 5px;"
                    >- {{ selectedTeacherData.matricule }}</small
                  >
                </div>
              </div>
              <div *ngIf="!selectedTeacherData">Sélectionner un enseignant</div>
            </ng-template>

            <ng-template pTemplate="item" let-item>
              <div class="teacher-dropdown-item">
                <img *ngIf="item.photoUrl" [src]="item.photoUrl" class="teacher-dropdown-avatar" />
                <div *ngIf="!item.photoUrl && item.value !== -1" class="teacher-dropdown-initials">
                  {{ getInitials(item.prenom + ' ' + item.nom) }}
                </div>
                <div *ngIf="item.value === -1" class="teacher-dropdown-icon">
                  <i class="pi pi-users"></i>
                </div>
                <div class="teacher-dropdown-info">
                  <span>{{ item.label }}</span>
                  <small
                    *ngIf="item.matricule"
                    style="display:block; color:#64748b; font-size: 0.8em;"
                    >{{ item.matricule }}</small
                  >
                </div>
              </div>
            </ng-template>
          </p-select>
        </div>
        <button class="btn btn-outline" (click)="loadHonoraires()" [disabled]="loading">
          <i class="pi pi-refresh"></i> Actualiser
        </button>
        <button
          *ngIf="isAdmin"
          class="btn btn-primary"
          (click)="calculer()"
          [disabled]="loading || !selectedTeacherId"
        >
          <i class="pi pi-calculator"></i> Calculer
        </button>
        <button
          *ngIf="isAdmin && honoraires.length > 0"
          class="btn btn-secondary"
          (click)="exportExcel()"
          [disabled]="exportingExcel"
        >
          <i class="pi pi-file-excel"></i> Export Excel
        </button>
      </div>

      <div class="alert error" *ngIf="errorMessage">{{ errorMessage }}</div>
      <div class="alert success" *ngIf="successMessage">{{ successMessage }}</div>

      <div class="stats-row">
        <div class="stat-card">
          <span class="stat-label">Bulletins</span>
          <strong>{{ honoraires.length }}</strong>
        </div>
        <div class="stat-card">
          <span class="stat-label">Heures totales</span>
          <strong>{{ totalHeures | number: '1.0-2' }} h</strong>
        </div>
        <div class="stat-card">
          <span class="stat-label">Montant total</span>
          <strong>{{ totalMontant | number: '1.0-0' }} FCFA</strong>
        </div>
      </div>

      <div class="table-card">
        <div class="table-header">
          <h3>Honoraires du {{ getMoisLabel(mois) }} {{ annee }}</h3>
          <span>{{ honoraires.length }} résultat(s)</span>
        </div>

        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Enseignant</th>
                <th>Heures</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Date calcul</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngIf="!loading && honoraires.length === 0">
                <td colspan="6" class="empty-cell">Aucun honoraire trouvé pour cette période.</td>
              </tr>
              <tr *ngFor="let item of honoraires">
                <td>
                  <div class="teacher-cell">
                    <div class="avatar">{{ getInitials(item.enseignantNomPrenom) }}</div>
                    <div>
                      <strong>{{
                        item.enseignantNomPrenom || 'Enseignant #' + item.enseignantId
                      }}</strong>
                      <small>{{ item.detailsHonoraires?.length || 0 }} séance(s)</small>
                    </div>
                  </div>
                </td>
                <td>{{ item.totalHeures || 0 | number: '1.0-2' }} h</td>
                <td>{{ item.montantBrut || 0 | number: '1.0-0' }} FCFA</td>
                <td>
                  <span class="status" [ngClass]="item.statut">{{
                    getStatutLabel(item.statut)
                  }}</span>
                </td>
                <td>{{ item.dateCalcul ? (item.dateCalcul | date: 'dd/MM/yyyy HH:mm') : '-' }}</td>
                <td>
                  <div class="actions">
                    <button class="icon-btn" (click)="toggleDetails(item)" title="Détails">
                      <i
                        class="pi"
                        [ngClass]="selected?.id === item.id ? 'pi-eye-slash' : 'pi-eye'"
                      ></i>
                    </button>
                    <button
                      *ngIf="isAdmin"
                      class="icon-btn validate"
                      (click)="valider(item)"
                      [disabled]="item.statut !== 'BROUILLON'"
                    >
                      <i class="pi pi-check"></i>
                    </button>
                    <button
                      *ngIf="isAdmin"
                      class="icon-btn pay"
                      (click)="payer(item)"
                      [disabled]="item.statut !== 'VALIDE'"
                      title="Marquer comme payé"
                    >
                      <i class="pi pi-money-bill"></i>
                    </button>
                    <button
                      class="icon-btn"
                      (click)="exportPdf(item)"
                      title="Télécharger Fiche de Paie"
                      [disabled]="exportingPdf === item.id"
                    >
                      <i
                        class="pi"
                        [ngClass]="exportingPdf === item.id ? 'pi-spin pi-spinner' : 'pi-file-pdf'"
                      ></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="details-card" *ngIf="selected">
        <div class="table-header">
          <h3>Détails - {{ selected.enseignantNomPrenom }}</h3>
          <button class="btn btn-outline" (click)="selected = null">Fermer</button>
        </div>
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Matière</th>
                <th>Classe</th>
                <th>Horaire</th>
                <th>Heures</th>
                <th>Taux</th>
                <th>Montant</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let detail of selected.detailsHonoraires || []">
                <td>{{ detail.dateCours | date: 'dd/MM/yyyy' }}</td>
                <td>{{ detail.matiereLibelle || '-' }}</td>
                <td>{{ detail.classeLibelle || '-' }}</td>
                <td>{{ formatTime(detail.heureDebut) }} - {{ formatTime(detail.heureFin) }}</td>
                <td>{{ detail.nombreHeures || 0 | number: '1.0-2' }}</td>
                <td>{{ detail.tauxHoraire || 0 | number: '1.0-0' }} FCFA</td>
                <td>{{ detail.montant || 0 | number: '1.0-0' }} FCFA</td>
              </tr>
              <tr *ngIf="!selected.detailsHonoraires?.length">
                <td colspan="7" class="empty-cell">Aucun détail disponible.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .honoraires-page {
        display: flex;
        flex-direction: column;
        gap: 22px;
      }
      .page-header {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        flex-wrap: wrap;
      }
      .header-left-top {
        display: flex;
        align-items: center;
        gap: 14px;
      }
      h1 {
        margin: 0;
        color: #0f172a;
        font-size: clamp(1.35rem, 3vw, 1.9rem);
        font-weight: 800;
      }
      p {
        margin: 6px 0 0;
        color: #64748b;
      }
      .btn-back-arrow {
        width: 42px;
        height: 42px;
        border-radius: 14px;
        display: grid;
        place-items: center;
        color: #334155;
        background: #fff;
        border: 1px solid #e2e8f0;
        text-decoration: none;
      }
      .filters-card,
      .stats-row,
      .table-card,
      .details-card {
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 18px;
        box-shadow: 0 10px 25px rgba(15, 23, 42, 0.05);
      }
      .filters-card {
        padding: 18px;
        display: grid;
        grid-template-columns: 120px 180px minmax(240px, 1fr) auto auto;
        gap: 14px;
        align-items: end;
      }
      .field {
        display: flex;
        flex-direction: column;
        gap: 7px;
      }
      .teacher-dropdown-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 4px 8px; /* added padding for better spacing */
      }
      .teacher-dropdown-item:hover {
        background-color: #f8fafc;
        border-radius: 6px;
      }
      .teacher-dropdown-avatar {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        object-fit: cover;
      }
      .teacher-dropdown-initials,
      .teacher-dropdown-icon {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background-color: #e2e8f0;
        color: #475569;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        font-weight: bold;
      }
      .teacher-dropdown-info {
        display: flex;
        flex-direction: column;
        line-height: 1.2;
      }
      label {
        color: #475569;
        font-size: 0.84rem;
        font-weight: 700;
      }
      input,
      select {
        height: 42px;
        border: 1px solid #cbd5e1;
        border-radius: 12px;
        padding: 0 12px;
        color: #0f172a;
        background: #fff;
      }
      .btn {
        height: 42px;
        border-radius: 12px;
        border: none;
        padding: 0 16px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        cursor: pointer;
        font-weight: 700;
      }
      .btn:disabled,
      .icon-btn:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }
      .btn-primary {
        background: #2563eb;
        color: #fff;
      }
      .btn-outline {
        background: #fff;
        color: #334155;
        border: 1px solid #cbd5e1;
      }
      .alert {
        padding: 12px 14px;
        border-radius: 12px;
        font-weight: 600;
      }
      .alert.error {
        background: #fee2e2;
        color: #991b1b;
      }
      .alert.success {
        background: #dcfce7;
        color: #166534;
      }
      .stats-row {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0;
        overflow: hidden;
      }
      .stat-card {
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 6px;
        border-right: 1px solid #e2e8f0;
      }
      .stat-card:last-child {
        border-right: 0;
      }
      .stat-label {
        color: #64748b;
        font-weight: 700;
        font-size: 0.85rem;
      }
      .stat-card strong {
        color: #0f172a;
        font-size: 1.55rem;
      }
      .table-card,
      .details-card {
        overflow: hidden;
      }
      .table-header {
        padding: 16px 18px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        border-bottom: 1px solid #e2e8f0;
      }
      .table-header h3 {
        margin: 0;
        color: #0f172a;
      }
      .table-header span {
        color: #64748b;
        font-weight: 700;
      }
      .table-responsive {
        overflow-x: auto;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        min-width: 780px;
      }
      th,
      td {
        padding: 14px 16px;
        border-bottom: 1px solid #edf2f7;
        text-align: left;
        color: #334155;
      }
      th {
        color: #64748b;
        font-size: 0.78rem;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        background: #f8fafc;
      }
      .teacher-cell {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .teacher-cell small {
        display: block;
        color: #64748b;
        margin-top: 2px;
      }
      .avatar {
        width: 38px;
        height: 38px;
        border-radius: 12px;
        display: grid;
        place-items: center;
        background: #dbeafe;
        color: #1d4ed8;
        font-weight: 800;
      }
      .status {
        padding: 6px 10px;
        border-radius: 999px;
        font-weight: 800;
        font-size: 0.76rem;
      }
      .status.BROUILLON {
        background: #fef3c7;
        color: #92400e;
      }
      .status.VALIDE {
        background: #dbeafe;
        color: #1d4ed8;
      }
      .status.PAYE {
        background: #dcfce7;
        color: #166534;
      }
      .actions {
        display: flex;
        gap: 8px;
      }
      .icon-btn {
        width: 34px;
        height: 34px;
        border-radius: 10px;
        border: 1px solid #e2e8f0;
        background: #fff;
        color: #334155;
        cursor: pointer;
      }
      .icon-btn.validate {
        color: #166534;
      }
      .icon-btn.pay {
        color: #2563eb;
      }
      .empty-cell {
        text-align: center;
        color: #94a3b8;
        padding: 30px;
      }
      @media (max-width: 900px) {
        .filters-card {
          grid-template-columns: 1fr;
        }
        .stats-row {
          grid-template-columns: 1fr;
        }
        .stat-card {
          border-right: 0;
          border-bottom: 1px solid #e2e8f0;
        }
      }
    `,
  ],
})
export class HonorairesComponent implements OnInit {
  teachers: Teacher[] = [];
  honoraires: HonorairesCalcul[] = [];
  selected: HonorairesCalcul | null = null;
  selectedTeacherId: number | null = null;
  annee = new Date().getFullYear();
  mois = new Date().getMonth() + 1;
  loading = false;
  exportingExcel = false;
  exportingPdf: number | null = null;
  errorMessage = '';
  successMessage = '';
  currentRole = this.getCurrentUserRole();
  dropdownOptions: any[] = [];

  get selectedTeacherData(): any {
    if (this.selectedTeacherId === null) return null;
    return this.dropdownOptions.find((o) => o.value === this.selectedTeacherId);
  }

  moisOptions = [
    { value: 1, label: 'Janvier' },
    { value: 2, label: 'Février' },
    { value: 3, label: 'Mars' },
    { value: 4, label: 'Avril' },
    { value: 5, label: 'Mai' },
    { value: 6, label: 'Juin' },
    { value: 7, label: 'Juillet' },
    { value: 8, label: 'Août' },
    { value: 9, label: 'Septembre' },
    { value: 10, label: 'Octobre' },
    { value: 11, label: 'Novembre' },
    { value: 12, label: 'Décembre' },
  ];

  constructor(
    private honorairesService: HonorairesService,
    private teacherService: TeacherService,
  ) {}

  get totalHeures(): number {
    return this.honoraires.reduce((sum, item) => sum + (item.totalHeures || 0), 0);
  }

  get totalMontant(): number {
    return this.honoraires.reduce((sum, item) => sum + (item.montantBrut || 0), 0);
  }

  get isAdmin(): boolean {
    return this.currentRole === 'ADMINISTRATEUR';
  }

  ngOnInit(): void {
    if (this.isAdmin) {
      this.loadTeachers();
    }
    this.loadHonoraires();
  }

  loadTeachers(): void {
    this.teacherService.getTeachers().subscribe({
      next: (data) => {
        this.teachers = this.sortTeachers(data || []);
        this.dropdownOptions = [
          { label: '-- Tous les enseignants --', value: -1, id: -1 },
          ...this.teachers.map((t) => ({
            label: `${t.prenom} ${t.nom}`,
            value: t.id,
            id: t.id,
            prenom: t.prenom,
            nom: t.nom,
            matricule: t.matricule,
            photoUrl: t.photoUrl,
          })),
        ];
      },
      error: () => (this.errorMessage = 'Impossible de charger la liste des enseignants.'),
    });
  }

  loadHonoraires(): void {
    this.clearMessages();
    this.loading = true;
    this.selected = null;

    if (this.isAdmin) {
      this.honorairesService
        .getParMois(this.annee, this.mois)
        .pipe(finalize(() => (this.loading = false)))
        .subscribe({
          next: (items) => {
            let results = items || [];
            if (this.selectedTeacherId && this.selectedTeacherId !== -1) {
              results = results.filter((item) => item.enseignantId === this.selectedTeacherId);
            }
            this.honoraires = this.sortHonoraires(results);
          },
          error: (error) =>
            (this.errorMessage = this.extractError(error, 'Impossible de charger les honoraires.')),
        });
      return;
    }

    this.honorairesService
      .getMesHonorairesParMois(this.annee, this.mois)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (item) => {
          this.honoraires = item ? this.sortHonoraires([item]) : [];
        },
        error: (error) => {
          this.honoraires = [];
          // Cas normal : aucune séance payable ce mois-ci. On affiche un
          // état vide plutôt qu'une erreur intrusive.
          if (this.isNoPayableSessionError(error)) {
            return;
          }
          this.errorMessage = this.extractError(error, 'Impossible de charger les honoraires.');
        },
      });
  }

  private isNoPayableSessionError(error: any): boolean {
    const message = String(error?.error?.error || error?.error?.message || '');
    return message.toLowerCase().includes('aucune séance payable');
  }

  calculer(): void {
    if (!this.isAdmin) {
      this.errorMessage = 'Seul l’administrateur peut calculer les honoraires.';
      return;
    }
    // "Tous les enseignants" option corresponds to selectedTeacherId === -1
    if (this.selectedTeacherId === null) return;

    this.clearMessages();
    this.loading = true;

    if (this.selectedTeacherId === -1) {
      // Calculate for all teachers
      if (!this.teachers || this.teachers.length === 0) {
        this.errorMessage = 'Aucun enseignant trouvé.';
        this.loading = false;
        return;
      }

      let successCount = 0;
      let errorCount = 0;
      let completedRequests = 0;

      this.teachers.forEach((teacher) => {
        this.honorairesService
          .calculer({ enseignantId: teacher.id!, annee: this.annee, mois: this.mois })
          .subscribe({
            next: () => {
              successCount++;
              checkCompletion();
            },
            error: (err) => {
              // Ignore "Aucune nouvelle séance payable" errors for batch processing
              if (!this.isNoPayableSessionError(err)) {
                errorCount++;
              }
              checkCompletion();
            },
          });
      });

      const checkCompletion = () => {
        completedRequests++;
        if (completedRequests === this.teachers.length) {
          this.loading = false;
          if (successCount > 0) {
            this.successMessage = `Honoraires calculés avec succès pour ${successCount} enseignant(s).`;
            if (errorCount > 0) {
              this.errorMessage = `Échec du calcul pour ${errorCount} enseignant(s).`;
            }
          } else if (errorCount > 0) {
            this.errorMessage = `Erreur pendant le calcul des honoraires.`;
          } else {
            this.successMessage = `Aucune nouvelle séance payable n'a été trouvée pour les enseignants ce mois-ci.`;
          }
          this.loadHonoraires();
        }
      };
    } else {
      // Calculate for a single teacher
      this.honorairesService
        .calculer({ enseignantId: this.selectedTeacherId, annee: this.annee, mois: this.mois })
        .pipe(finalize(() => (this.loading = false)))
        .subscribe({
          next: () => {
            this.successMessage = 'Honoraires calculés avec succès.';
            this.loadHonoraires();
          },
          error: (error) => {
            if (this.isNoPayableSessionError(error)) {
              this.errorMessage =
                'Aucune nouvelle séance payable trouvée pour cet enseignant sur ce mois.';
            } else {
              this.errorMessage = this.extractError(
                error,
                'Erreur pendant le calcul des honoraires.',
              );
            }
          },
        });
    }
  }

  valider(item: HonorairesCalcul): void {
    if (!this.isAdmin) {
      this.errorMessage = 'Seul l’administrateur peut valider les honoraires.';
      return;
    }
    if (!item.id) return;
    this.honorairesService.valider(item.id).subscribe({
      next: () => {
        this.successMessage = 'Honoraires validés.';
        this.loadHonoraires();
      },
      error: (error) => (this.errorMessage = this.extractError(error, 'Validation impossible.')),
    });
  }

  payer(item: HonorairesCalcul): void {
    if (!this.isAdmin) {
      this.errorMessage = 'Seul l’administrateur peut marquer les honoraires comme payés.';
      return;
    }
    if (!item.id) return;
    this.honorairesService.payer(item.id).subscribe({
      next: () => {
        this.successMessage = 'Honoraires marqués comme payés.';
        this.loadHonoraires();
      },
      error: (error) => (this.errorMessage = this.extractError(error, 'Paiement impossible.')),
    });
  }

  toggleDetails(item: HonorairesCalcul): void {
    this.selected = this.selected?.id === item.id ? null : item;
  }

  async exportExcel(): Promise<void> {
    this.exportingExcel = true;
    this.errorMessage = '';

    // Fallback fileName si on ne trouve pas de prof précis
    let fileName = `honoraires_${this.annee}_${this.mois}.xlsx`;

    this.honorairesService
      .exportHonorairesExcel(this.annee, this.mois)
      .pipe(finalize(() => (this.exportingExcel = false)))
      .subscribe({
        next: async (blob) => {
          await this.saveFile(blob, fileName, 'xlsx');
        },
        error: (error) =>
          (this.errorMessage = this.extractError(error, "Échec de l'export Excel.")),
      });
  }

  async exportPdf(item: HonorairesCalcul): Promise<void> {
    if (!item.id) return;
    this.exportingPdf = item.id;
    this.errorMessage = '';

    // Format attendu: fiche_paie_Nom_Matricule.pdf
    const teacherName = item.enseignantNomPrenom
      ? item.enseignantNomPrenom.replace(/\s+/g, '_')
      : 'Enseignant';
    // On cherche le matricule dans this.dropdownOptions
    const teacherData = this.dropdownOptions.find((t) => t.value === item.enseignantId);
    const matricule = teacherData?.matricule ? teacherData.matricule : 'Inconnu';

    const fileName = `fiche_paie_${teacherName}_${matricule}.pdf`;

    this.honorairesService
      .exportFichePaiePdf(item.id)
      .pipe(finalize(() => (this.exportingPdf = null)))
      .subscribe({
        next: async (blob) => {
          await this.saveFile(blob, fileName, 'pdf');
        },
        error: (error) =>
          (this.errorMessage = this.extractError(error, 'Échec de la génération du PDF.')),
      });
  }

  private async saveFile(blob: Blob, defaultFileName: string, extension: string) {
    // Si l'API File System Access est disponible (Chrome, Edge, etc.)
    if ('showSaveFilePicker' in window) {
      try {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: defaultFileName,
          types: [
            {
              description: extension === 'pdf' ? 'Fichier PDF' : 'Fichier Excel',
              accept: {
                [extension === 'pdf'
                  ? 'application/pdf'
                  : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']: [
                  `.${extension}`,
                ],
              },
            },
          ],
        });
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        return; // Fichier enregistré avec succès par l'utilisateur
      } catch (err: any) {
        // L'utilisateur a annulé le prompt (AbortError), on ne fait rien
        if (err.name === 'AbortError') return;
        console.error('Erreur avec showSaveFilePicker:', err);
        // On fallback sur l'ancienne méthode si erreur inattendue
      }
    }

    // Fallback pour les anciens navigateurs / Safari / Firefox
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = defaultFileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  getInitials(name?: string): string {
    return (name || 'EN')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('');
  }

  getStatutLabel(statut?: string): string {
    const labels: Record<string, string> = {
      BROUILLON: 'EN ATTENTE',
      VALIDE: 'VALIDÉ',
      PAYE: 'PAYÉ',
    };
    return statut ? labels[statut] || statut : '-';
  }

  getMoisLabel(value: number): string {
    return this.moisOptions.find((m) => m.value === Number(value))?.label || String(value);
  }

  private sortTeachers(teachers: Teacher[]): Teacher[] {
    return [...teachers].sort((a, b) =>
      this.compareAlphaNumeric(
        `${a.prenom || ''} ${a.nom || ''} ${a.matricule || ''}`,
        `${b.prenom || ''} ${b.nom || ''} ${b.matricule || ''}`,
      ),
    );
  }

  private sortHonoraires(items: HonorairesCalcul[]): HonorairesCalcul[] {
    return [...items]
      .map((item) => ({
        ...item,
        detailsHonoraires: [...(item.detailsHonoraires || [])].sort((a, b) => {
          const aKey = `${a.dateCours || ''} ${a.matiereLibelle || ''} ${a.classeLibelle || ''} ${a.seanceId || ''}`;
          const bKey = `${b.dateCours || ''} ${b.matiereLibelle || ''} ${b.classeLibelle || ''} ${b.seanceId || ''}`;
          return this.compareAlphaNumeric(aKey, bKey);
        }),
      }))
      .sort((a, b) => {
        const aKey = `${a.enseignantNomPrenom || ''} ${a.enseignantId || ''}`;
        const bKey = `${b.enseignantNomPrenom || ''} ${b.enseignantId || ''}`;
        return this.compareAlphaNumeric(aKey, bKey);
      });
  }

  private compareAlphaNumeric(a: string, b: string): number {
    return a.localeCompare(b, 'fr', { numeric: true, sensitivity: 'base' });
  }

  formatTime(value?: string): string {
    return value ? value.substring(0, 5) : '--:--';
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  private extractError(error: any, fallback: string): string {
    if (typeof error?.error === 'string' && error.error.trim()) {
      return error.error;
    }

    return error?.error?.message || error?.error?.error || error?.message || fallback;
  }

  private getCurrentUserRole(): string {
    try {
      const savedUser = localStorage.getItem('user');
      const user = savedUser ? JSON.parse(savedUser) : null;
      const role = String(user?.role || '')
        .replace(/^ROLE_/, '')
        .toUpperCase();

      return role === 'ADMIN' ? 'ADMINISTRATEUR' : role;
    } catch {
      return '';
    }
  }
}
