import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { timeout } from 'rxjs/operators';
import { Departement } from '../../core/models/departement.model';
import { DepartementService } from '../../core/services/departement.service';

@Component({
  selector: 'app-departements',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-left">
          <a routerLink="/dashboard" class="btn-back-arrow" title="Retour au tableau de bord">
            <i class="pi pi-arrow-left"></i>
          </a>
          <div>
            <h1>Gestion des Départements</h1>
            <p>Référentiel académique des départements ({{ departements.length }} enregistrés)</p>
          </div>
        </div>
        <button class="btn btn-primary" (click)="showAddForm()">
          <i class="pi pi-plus"></i> Nouveau Département
        </button>
      </div>

      <div class="form-card" *ngIf="displayForm">
        <div class="form-card-header">
          <h3>{{ editingId ? 'Modifier le Département' : 'Nouveau Département' }}</h3>
        </div>
        <div class="form-card-body">
          <div *ngIf="errorMessage" class="error-banner">
            <i class="pi pi-exclamation-triangle"></i>{{ errorMessage }}
          </div>
          <div class="section-grid">
            <div class="input-group">
              <label>Libellé</label>
              <input type="text" [(ngModel)]="currentDepartement.libelle" placeholder="Ex: Informatique" />
            </div>
          </div>
          <div class="form-actions">
            <button class="btn btn-outline" (click)="displayForm = false" [disabled]="isSaving">Annuler</button>
            <button class="btn btn-primary" (click)="save()" [disabled]="isSaving">
              <i class="pi" [class.pi-check]="!isSaving" [class.pi-spin]="isSaving" [class.pi-spinner]="isSaving"></i>
              {{ isSaving ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
          </div>
        </div>
      </div>

      <div class="search-section">
        <div class="search-wrapper">
          <i class="pi pi-search"></i>
          <input type="text" placeholder="Rechercher un département..." [(ngModel)]="searchText" (input)="filterDepartements()" />
        </div>
      </div>

      <div class="empty-state" *ngIf="filteredDepartements.length === 0">
        <i class="pi pi-folder-open"></i>
        <h3>Aucun département trouvé</h3>
        <p>Créez un département pour organiser les filières et matières.</p>
      </div>

      <div class="cards-grid" *ngIf="filteredDepartements.length > 0">
        <div class="ref-card" *ngFor="let departement of filteredDepartements">
          <div class="card-accent"></div>
          <div class="card-body">
            <div class="card-title">{{ departement.libelle }}</div>
            <div class="card-subtitle">Département académique</div>
          </div>
          <div class="card-actions">
            <button class="btn-icon-sm edit" (click)="showEditForm(departement)" title="Modifier"><i class="pi pi-pencil"></i></button>
            <button class="btn-icon-sm delete" (click)="delete(departement.id!)" title="Supprimer"><i class="pi pi-trash"></i></button>
          </div>
        </div>
      </div>

      <div class="confirm-backdrop" *ngIf="confirmDeleteId !== null" (click)="cancelDelete()">
        <div class="confirm-dialog" (click)="$event.stopPropagation()">
          <div class="confirm-icon"><i class="pi pi-trash"></i></div>
          <h3>Confirmer la suppression</h3>
          <p>{{ confirmDeleteMessage }}</p>
          <div class="confirm-actions">
            <button class="btn btn-outline" (click)="cancelDelete()">Annuler</button>
            <button class="btn btn-danger" (click)="confirmDelete()">OK</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: '../referentiel-admin.scss',
})
export class DepartementsComponent implements OnInit {
  departements: Departement[] = [];
  filteredDepartements: Departement[] = [];
  searchText = '';
  displayForm = false;
  editingId: number | null = null;
  currentDepartement: Partial<Departement> = {};
  errorMessage = '';
  isSaving = false;
  confirmDeleteId: number | null = null;
  confirmDeleteMessage = '';

  constructor(private departementService: DepartementService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadDepartements();
  }

  loadDepartements(): void {
    this.departementService.getAll().subscribe({
      next: (data) => {
        this.departements = data;
        this.filterDepartements();
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les départements. Vérifiez le backend.';
        this.cdr.detectChanges();
      },
    });
  }

  filterDepartements(): void {
    const text = this.searchText.toLowerCase();
    this.filteredDepartements = this.departements.filter((d) => (d.libelle || '').toLowerCase().includes(text));
  }

  showAddForm(): void {
    this.editingId = null;
    this.errorMessage = '';
    this.currentDepartement = { libelle: '' };
    this.displayForm = true;
  }

  showEditForm(departement: Departement): void {
    this.editingId = departement.id!;
    this.errorMessage = '';
    this.currentDepartement = { ...departement };
    this.displayForm = true;
  }

  save(): void {
    const departementToSave: Departement = {
      libelle: (this.currentDepartement.libelle || '').trim(),
    };

    if (!departementToSave.libelle) {
      this.errorMessage = 'Veuillez renseigner le libellé du département.';
      return;
    }

    this.isSaving = true;
    const request$ = this.editingId
      ? this.departementService.update(this.editingId, departementToSave)
      : this.departementService.create(departementToSave);

    request$.pipe(timeout(12000)).subscribe({
      next: () => {
        this.isSaving = false;
        this.displayForm = false;
        this.currentDepartement = {};
        this.editingId = null;
        this.loadDepartements();
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.handleSaveError(error, "Impossible d'enregistrer le département.");
        this.cdr.detectChanges();
      },
    });
  }

  delete(id: number): void {
    this.confirmDeleteId = id;
    this.confirmDeleteMessage = 'Voulez-vous vraiment supprimer ce département ? Les filières et matières liées peuvent empêcher la suppression.';
  }

  cancelDelete(): void {
    this.confirmDeleteId = null;
    this.confirmDeleteMessage = '';
  }

  confirmDelete(): void {
    if (this.confirmDeleteId === null) return;
    const id = this.confirmDeleteId;
    this.cancelDelete();
    this.departementService.delete(id).subscribe({
      next: () => {
        this.loadDepartements();
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Impossible de supprimer ce département car il est peut-être utilisé.';
        this.cdr.detectChanges();
      },
    });
  }

  private handleSaveError(error: any, fallback: string): void {
    this.isSaving = false;
    this.errorMessage = error?.name === 'TimeoutError'
      ? 'Le serveur met trop de temps à répondre.'
      : error?.error?.error || error?.error?.message || fallback;
  }
}
