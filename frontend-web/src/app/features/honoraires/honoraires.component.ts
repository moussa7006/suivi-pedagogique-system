import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { HonorairesCalcul } from '../../core/models/honoraires.model';
import { Teacher } from '../../core/models/user.model';
import { HonorairesService } from '../../core/services/honoraires.service';
import { TeacherService } from '../../core/services/teacher.service';

@Component({
  selector: 'app-honoraires',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
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
          <select [(ngModel)]="selectedTeacherId">
            <option [ngValue]="null">Sélectionner un enseignant</option>
            <option *ngFor="let teacher of teachers" [ngValue]="teacher.id">
              {{ teacher.prenom }} {{ teacher.nom }} - {{ teacher.matricule }}
            </option>
          </select>
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
                    >
                      <i class="pi pi-money-bill"></i>
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
      .status.ANNULE {
        background: #fee2e2;
        color: #991b1b;
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
  errorMessage = '';
  successMessage = '';
  currentRole = this.getCurrentUserRole();

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
      next: (teachers) => (this.teachers = this.sortTeachers(teachers || [])),
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
          next: (items) => (this.honoraires = this.sortHonoraires(items || [])),
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
          this.errorMessage = this.extractError(error, 'Impossible de charger les honoraires.');
        },
      });
  }

  calculer(): void {
    if (!this.isAdmin) {
      this.errorMessage = 'Seul l’administrateur peut calculer les honoraires.';
      return;
    }
    if (!this.selectedTeacherId) return;
    this.clearMessages();
    this.loading = true;
    this.honorairesService
      .calculer({ enseignantId: this.selectedTeacherId, annee: this.annee, mois: this.mois })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.successMessage = 'Honoraires calculés avec succès.';
          this.loadHonoraires();
        },
        error: (error) =>
          (this.errorMessage = this.extractError(
            error,
            'Erreur pendant le calcul des honoraires.',
          )),
      });
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
      BROUILLON: 'Brouillon',
      VALIDE: 'Validé',
      PAYE: 'Payé',
      ANNULE: 'Annulé',
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
