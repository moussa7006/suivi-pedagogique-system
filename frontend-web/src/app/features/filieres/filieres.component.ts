import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { timeout } from 'rxjs/operators';
import { Filiere } from '../../core/models/filiere.model';
import { Departement } from '../../core/models/departement.model';
import { FiliereService } from '../../core/services/filiere.service';
import { DepartementService } from '../../core/services/departement.service';

@Component({
  selector: 'app-filieres',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-left">
          <a routerLink="/dashboard" class="btn-back-arrow" title="Retour"><i class="pi pi-arrow-left"></i></a>
          <div>
            <h1>Gestion des Filières</h1>
            <p>Filières rattachées aux départements ({{ filieres.length }} enregistrées)</p>
          </div>
        </div>
        <button class="btn btn-primary" (click)="showAddForm()"><i class="pi pi-plus"></i> Nouvelle Filière</button>
      </div>

      <div class="form-card" *ngIf="displayForm">
        <div class="form-card-header"><h3>{{ editingId ? 'Modifier la Filière' : 'Nouvelle Filière' }}</h3></div>
        <div class="form-card-body">
          <div *ngIf="errorMessage" class="error-banner"><i class="pi pi-exclamation-triangle"></i>{{ errorMessage }}</div>
          <div class="section-grid">
            <div class="input-group">
              <label>Libellé</label>
              <input type="text" [(ngModel)]="currentFiliere.libelle" placeholder="Ex: Informatique de Gestion" />
            </div>
            <div class="input-group">
              <label>Département</label>
              <select [(ngModel)]="currentFiliere.departementId">
                <option [ngValue]="undefined" disabled>Sélectionnez un département</option>
                <option *ngFor="let departement of departements" [ngValue]="departement.id">{{ departement.libelle }}</option>
              </select>
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
          <input type="text" placeholder="Rechercher une filière ou un département..." [(ngModel)]="searchText" (input)="filterFilieres()" />
        </div>
      </div>

      <div class="empty-state" *ngIf="filteredFilieres.length === 0">
        <i class="pi pi-sitemap"></i>
        <h3>Aucune filière trouvée</h3>
        <p>Créez une filière après avoir créé au moins un département.</p>
      </div>

      <div class="cards-grid" *ngIf="filteredFilieres.length > 0">
        <div class="ref-card" *ngFor="let filiere of filteredFilieres">
          <div class="card-accent"></div>
          <div class="card-body">
            <div class="card-title">{{ filiere.libelle }}</div>
            <div class="detail-item"><i class="pi pi-folder"></i><span>{{ getDepartementLibelle(filiere.departementId) }}</span></div>
          </div>
          <div class="card-actions">
            <button class="btn-icon-sm edit" (click)="showEditForm(filiere)"><i class="pi pi-pencil"></i></button>
            <button class="btn-icon-sm delete" (click)="delete(filiere.id!)"><i class="pi pi-trash"></i></button>
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
export class FilieresComponent implements OnInit {
  filieres: Filiere[] = [];
  filteredFilieres: Filiere[] = [];
  departements: Departement[] = [];
  searchText = '';
  displayForm = false;
  editingId: number | null = null;
  currentFiliere: Partial<Filiere> = {};
  errorMessage = '';
  isSaving = false;
  confirmDeleteId: number | null = null;
  confirmDeleteMessage = '';

  constructor(
    private filiereService: FiliereService,
    private departementService: DepartementService,
  ) {}

  ngOnInit(): void {
    this.loadDepartements();
    this.loadFilieres();
  }

  loadDepartements(): void {
    this.departementService.getAll().subscribe({
      next: (data) => (this.departements = data),
      error: () => (this.errorMessage = 'Impossible de charger les départements.'),
    });
  }

  loadFilieres(): void {
    this.filiereService.getAll().subscribe({
      next: (data) => {
        this.filieres = data;
        this.filterFilieres();
      },
      error: () => (this.errorMessage = 'Impossible de charger les filières.'),
    });
  }

  filterFilieres(): void {
    const text = this.searchText.toLowerCase();
    this.filteredFilieres = this.filieres.filter((f) =>
      (f.libelle || '').toLowerCase().includes(text) ||
      this.getDepartementLibelle(f.departementId).toLowerCase().includes(text),
    );
  }

  getDepartementLibelle(id: number | undefined): string {
    return this.departements.find((d) => d.id === id)?.libelle || 'Département non assigné';
  }

  showAddForm(): void {
    this.editingId = null;
    this.errorMessage = '';
    this.currentFiliere = { libelle: '', departementId: undefined };
    this.displayForm = true;
  }

  showEditForm(filiere: Filiere): void {
    this.editingId = filiere.id!;
    this.errorMessage = '';
    this.currentFiliere = { ...filiere };
    this.displayForm = true;
  }

  save(): void {
    const filiereToSave: Filiere = {
      libelle: (this.currentFiliere.libelle || '').trim(),
      departementId: Number(this.currentFiliere.departementId),
    };

    if (!filiereToSave.libelle || !filiereToSave.departementId) {
      this.errorMessage = 'Veuillez renseigner le libellé et le département.';
      return;
    }

    this.isSaving = true;
    const request$ = this.editingId
      ? this.filiereService.update(this.editingId, filiereToSave)
      : this.filiereService.create(filiereToSave);

    request$.pipe(timeout(12000)).subscribe({
      next: () => {
        this.isSaving = false;
        this.displayForm = false;
        this.editingId = null;
        this.currentFiliere = {};
        this.loadFilieres();
      },
      error: (error) => this.handleSaveError(error, "Impossible d'enregistrer la filière."),
    });
  }

  delete(id: number): void {
    this.confirmDeleteId = id;
    this.confirmDeleteMessage = 'Voulez-vous vraiment supprimer cette filière ? Les classes liées peuvent empêcher la suppression.';
  }

  cancelDelete(): void {
    this.confirmDeleteId = null;
    this.confirmDeleteMessage = '';
  }

  confirmDelete(): void {
    if (this.confirmDeleteId === null) return;
    const id = this.confirmDeleteId;
    this.cancelDelete();
    this.filiereService.delete(id).subscribe({
      next: () => this.loadFilieres(),
      error: () => (this.errorMessage = 'Impossible de supprimer cette filière car elle est peut-être utilisée.'),
    });
  }

  private handleSaveError(error: any, fallback: string): void {
    this.isSaving = false;
    this.errorMessage = error?.name === 'TimeoutError'
      ? 'Le serveur met trop de temps à répondre.'
      : error?.error?.error || error?.error?.message || fallback;
  }
}
