import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatiereService } from '../../core/services/matiere.service';
import { DepartementService } from '../../core/services/departement.service';
import { Matiere } from '../../core/models/matiere.model';
import { Departement } from '../../core/models/departement.model';
import { timeout } from 'rxjs/operators';

@Component({
  selector: 'app-matieres',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
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
              <h1>Gestion des Matières</h1>
              <p>Gérez les matières ({{ matieres.length }} enregistrées)</p>
            </div>
          </div>
        </div>
        <div class="header-actions">
          <button class="btn btn-primary" (click)="showAddForm()">
            <i class="pi pi-plus"></i> Nouvelle Matière
          </button>
        </div>
      </div>

      <div class="form-card" *ngIf="displayForm">
        <div class="form-card-header">
          <h3>{{ editingId ? 'Modifier la Matière' : 'Nouvelle Matière' }}</h3>
        </div>
        <div class="form-card-body">
          <div *ngIf="errorMessage" class="error-banner">
            <i class="pi pi-exclamation-triangle"></i>
            {{ errorMessage }}
          </div>

          <div class="form-section">
            <div class="section-label">
              <i class="pi pi-book"></i>
              <span>Détails de la matière</span>
            </div>
            <div class="section-grid">
              <div class="input-group">
                <label>Code</label>
                <input
                  type="text"
                  [(ngModel)]="currentMatiere.code"
                  placeholder="Ex: INFO101"
                />
              </div>
              <div class="input-group">
                <label>Libellé</label>
                <input
                  type="text"
                  [(ngModel)]="currentMatiere.libelle"
                  placeholder="Ex: Algorithmique"
                />
              </div>
              <div class="input-group">
                <label>Volume Horaire Total</label>
                <input
                  type="number"
                  [(ngModel)]="currentMatiere.volumeHoraireTotal"
                  placeholder="Ex: 60"
                />
              </div>
              <div class="input-group">
                <label>Département</label>
                <select [(ngModel)]="currentMatiere.departementId">
                  <option [value]="null" disabled>Sélectionnez un département</option>
                  <option *ngFor="let d of departements" [value]="d.id">
                    {{ d.libelle }}
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div class="form-actions">
            <button class="btn btn-outline" (click)="displayForm = false" [disabled]="isSaving">
              Annuler
            </button>
            <button class="btn btn-primary" (click)="save()" [disabled]="isSaving">
              <i
                class="pi"
                [class.pi-check]="!isSaving"
                [class.pi-spin]="isSaving"
                [class.pi-spinner]="isSaving"
              ></i>
              {{ isSaving ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
          </div>
        </div>
      </div>

      <div class="search-section">
        <div class="search-wrapper">
          <i class="pi pi-search"></i>
          <input
            type="text"
            placeholder="Rechercher code ou libellé..."
            [(ngModel)]="searchText"
            (input)="filterMatieres()"
          />
        </div>
      </div>

      <div class="empty-state" *ngIf="filteredMatieres.length === 0">
        <div class="empty-icon">
          <i class="pi pi-book"></i>
        </div>
        <h3>Aucune matière trouvée</h3>
        <p>Créez une nouvelle matière pour commencer.</p>
      </div>

      <div class="cards-grid" *ngIf="filteredMatieres.length > 0">
        <div class="matiere-card" *ngFor="let m of filteredMatieres">
          <div class="card-accent"></div>
          <div class="card-body">
            <div class="card-code">{{ m.code }}</div>
            <div class="card-title">{{ m.libelle }}</div>
            <div class="card-details">
              <div class="detail-item">
                <i class="pi pi-calculator"></i>
                <span>Volume : <strong>{{ m.volumeHoraireTotal }}h</strong></span>
              </div>
              <div class="detail-item">
                <i class="pi pi-folder"></i>
                <span>{{ getDepartementLibelle(m.departementId) }}</span>
              </div>
            </div>
          </div>
          <div class="card-actions">
            <button class="btn-icon-sm edit" (click)="showEditForm(m)" title="Modifier">
              <i class="pi pi-pencil"></i>
            </button>
            <button class="btn-icon-sm delete" (click)="delete(m.id!)" title="Supprimer">
              <i class="pi pi-trash"></i>
            </button>
          </div>
        </div>
      </div>

      <div class="confirm-backdrop" *ngIf="confirmDeleteId !== null" (click)="cancelDelete()">
        <div
          class="confirm-dialog"
          role="dialog"
          aria-modal="true"
          (click)="$event.stopPropagation()"
        >
          <div class="confirm-icon">
            <i class="pi pi-trash"></i>
          </div>
          <h3>Confirmer la suppression</h3>
          <p>{{ confirmDeleteMessage }}</p>
          <div class="confirm-actions">
            <button class="btn btn-outline" type="button" (click)="cancelDelete()">Annuler</button>
            <button class="btn btn-danger" type="button" (click)="confirmDelete()">OK</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './matieres.scss',
})
export class Matieres implements OnInit {
  matieres: Matiere[] = [];
  filteredMatieres: Matiere[] = [];
  searchText: string = '';
  departements: Departement[] = [];
  displayForm: boolean = false;
  editingId: number | null = null;
  currentMatiere: Partial<Matiere> = {};
  errorMessage: string = '';
  isSaving: boolean = false;
  confirmDeleteId: number | null = null;
  confirmDeleteMessage = '';

  constructor(
    private matiereService: MatiereService,
    private departementService: DepartementService,
  ) {}

  ngOnInit() {
    this.loadMatieres();
    this.departementService.getAll().subscribe((d) => (this.departements = d));
  }

  loadMatieres() {
    this.matiereService.getAll().subscribe((data) => {
      this.matieres = data;
      this.filterMatieres();
    });
  }

  filterMatieres() {
    const text = this.searchText.toLowerCase();
    this.filteredMatieres = this.matieres.filter(
      (m) =>
        (m.code || '').toLowerCase().includes(text) ||
        (m.libelle || '').toLowerCase().includes(text),
    );
  }

  getDepartementLibelle(departementId: number | undefined): string {
    if (!departementId) return 'Non assigné';
    const d = this.departements.find((dept) => dept.id === departementId);
    return d ? d.libelle : 'Non assigné';
  }

  showAddForm() {
    this.editingId = null;
    this.errorMessage = '';
    this.isSaving = false;
    this.currentMatiere = { code: '', libelle: '', volumeHoraireTotal: 60, departementId: undefined };
    this.displayForm = true;
  }

  showEditForm(m: Matiere) {
    this.editingId = m.id!;
    this.errorMessage = '';
    this.isSaving = false;
    this.currentMatiere = { ...m };
    this.displayForm = true;
  }

  save() {
    this.errorMessage = '';

    const matiereToSave: Matiere = {
      ...this.currentMatiere,
      code: (this.currentMatiere.code || '').trim(),
      libelle: (this.currentMatiere.libelle || '').trim(),
      volumeHoraireTotal: Number(this.currentMatiere.volumeHoraireTotal || 0),
      departementId: Number(this.currentMatiere.departementId),
    };

    if (!matiereToSave.code || !matiereToSave.libelle || !matiereToSave.volumeHoraireTotal || !matiereToSave.departementId) {
      this.errorMessage =
        'Veuillez renseigner le code, le libellé, le volume horaire total et le département avant d\'enregistrer.';
      return;
    }

    this.isSaving = true;

    const request$ = this.editingId
      ? this.matiereService.update(this.editingId, matiereToSave)
      : this.matiereService.create(matiereToSave);

    request$.pipe(timeout(12000)).subscribe({
      next: (savedMatiere) => {
        if (this.editingId) {
          this.matieres = this.matieres.map((matiere) =>
            matiere.id === this.editingId ? savedMatiere : matiere,
          );
        } else {
          this.matieres = [savedMatiere, ...this.matieres];
        }

        this.filterMatieres();
        this.displayForm = false;
        this.isSaving = false;
        this.errorMessage = '';
        this.currentMatiere = {};
        this.editingId = null;
      },
      error: (error) => {
        this.isSaving = false;

        if (error?.name === 'TimeoutError') {
          this.errorMessage =
            'Le serveur met trop de temps à répondre. Vérifiez que le backend est démarré puis réessayez.';
          return;
        }

        if (error?.status === 401) {
          this.errorMessage = 'Votre session a expiré. Veuillez vous reconnecter.';
          return;
        }

        if (error?.status === 403) {
          this.errorMessage =
            'Vous n\'avez pas les droits nécessaires pour enregistrer une matière.';
          return;
        }

        this.errorMessage =
          error?.error?.error ||
          error?.error?.message ||
          'Impossible d\'enregistrer la matière. Vérifiez le backend et réessayez.';
      },
    });
  }

  delete(id: number) {
    this.confirmDeleteId = id;
    this.confirmDeleteMessage = 'Voulez-vous vraiment supprimer cette matière ?';
  }

  cancelDelete() {
    this.confirmDeleteId = null;
    this.confirmDeleteMessage = '';
  }

  confirmDelete() {
    if (this.confirmDeleteId === null) {
      return;
    }

    const id = this.confirmDeleteId;
    this.cancelDelete();
    this.matiereService.delete(id).subscribe(() => this.loadMatieres());
  }
}
