import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { timeout } from 'rxjs/operators';
import { NiveauEnseignement } from '../../core/models/niveau-enseignement.model';
import { NiveauEnseignementService } from '../../core/services/niveau-enseignement.service';

@Component({
  selector: 'app-niveaux-enseignement',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-left">
          <a routerLink="/dashboard" class="btn-back-arrow" title="Retour"><i class="pi pi-arrow-left"></i></a>
          <div>
            <h1>Niveaux d'enseignement</h1>
            <p>Niveaux utilisés par les classes et le calcul horaire ({{ niveaux.length }} enregistrés)</p>
          </div>
        </div>
        <button class="btn btn-primary" (click)="showAddForm()"><i class="pi pi-plus"></i> Nouveau Niveau</button>
      </div>

      <div class="form-card" *ngIf="displayForm">
        <div class="form-card-header"><h3>{{ editingId ? 'Modifier le Niveau' : 'Nouveau Niveau' }}</h3></div>
        <div class="form-card-body">
          <div *ngIf="errorMessage" class="error-banner"><i class="pi pi-exclamation-triangle"></i>{{ errorMessage }}</div>
          <div class="section-grid">
            <div class="input-group">
              <label>Libellé</label>
              <input type="text" [(ngModel)]="currentNiveau.libelle" placeholder="Ex: Licence 1" />
            </div>
            <div class="input-group">
              <label>Prix horaire</label>
              <input type="number" [(ngModel)]="currentNiveau.prixHoraire" placeholder="Ex: 5000" />
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
          <input type="text" placeholder="Rechercher un niveau..." [(ngModel)]="searchText" (input)="filterNiveaux()" />
        </div>
      </div>

      <div class="empty-state" *ngIf="filteredNiveaux.length === 0">
        <i class="pi pi-graduation-cap"></i>
        <h3>Aucun niveau trouvé</h3>
        <p>Créez les niveaux avant de créer les classes.</p>
      </div>

      <div class="cards-grid" *ngIf="filteredNiveaux.length > 0">
        <div class="ref-card" *ngFor="let niveau of filteredNiveaux">
          <div class="card-accent"></div>
          <div class="card-body">
            <div class="card-title">{{ niveau.libelle }}</div>
            <div class="detail-item"><i class="pi pi-money-bill"></i><span>Prix horaire : <strong>{{ niveau.prixHoraire | number:'1.0-0' }}</strong></span></div>
          </div>
          <div class="card-actions">
            <button class="btn-icon-sm edit" (click)="showEditForm(niveau)"><i class="pi pi-pencil"></i></button>
            <button class="btn-icon-sm delete" (click)="delete(niveau.id!)"><i class="pi pi-trash"></i></button>
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
export class NiveauxEnseignementComponent implements OnInit {
  niveaux: NiveauEnseignement[] = [];
  filteredNiveaux: NiveauEnseignement[] = [];
  searchText = '';
  displayForm = false;
  editingId: number | null = null;
  currentNiveau: Partial<NiveauEnseignement> = {};
  errorMessage = '';
  isSaving = false;
  confirmDeleteId: number | null = null;
  confirmDeleteMessage = '';

  constructor(private niveauService: NiveauEnseignementService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadNiveaux();
  }

  loadNiveaux(): void {
    this.niveauService.getAll().subscribe({
      next: (data) => {
        this.niveaux = data;
        this.filterNiveaux();
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = "Impossible de charger les niveaux d'enseignement.";
        this.cdr.detectChanges();
      },
    });
  }

  filterNiveaux(): void {
    const text = this.searchText.toLowerCase();
    this.filteredNiveaux = this.niveaux.filter((n) => (n.libelle || '').toLowerCase().includes(text));
  }

  showAddForm(): void {
    this.editingId = null;
    this.errorMessage = '';
    this.currentNiveau = { libelle: '', prixHoraire: 0 };
    this.displayForm = true;
  }

  showEditForm(niveau: NiveauEnseignement): void {
    this.editingId = niveau.id!;
    this.errorMessage = '';
    this.currentNiveau = { ...niveau };
    this.displayForm = true;
  }

  save(): void {
    const niveauToSave: NiveauEnseignement = {
      libelle: (this.currentNiveau.libelle || '').trim(),
      prixHoraire: Number(this.currentNiveau.prixHoraire || 0),
    };

    if (!niveauToSave.libelle || niveauToSave.prixHoraire <= 0) {
      this.errorMessage = 'Veuillez renseigner le libellé et un prix horaire valide.';
      return;
    }

    this.isSaving = true;
    const request$ = this.editingId
      ? this.niveauService.update(this.editingId, niveauToSave)
      : this.niveauService.create(niveauToSave);

    request$.pipe(timeout(12000)).subscribe({
      next: () => {
        this.isSaving = false;
        this.displayForm = false;
        this.editingId = null;
        this.currentNiveau = {};
        this.loadNiveaux();
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.handleSaveError(error, "Impossible d'enregistrer le niveau.");
        this.cdr.detectChanges();
      },
    });
  }

  delete(id: number): void {
    this.confirmDeleteId = id;
    this.confirmDeleteMessage = 'Voulez-vous vraiment supprimer ce niveau ? Les classes liées peuvent empêcher la suppression.';
  }

  cancelDelete(): void {
    this.confirmDeleteId = null;
    this.confirmDeleteMessage = '';
  }

  confirmDelete(): void {
    if (this.confirmDeleteId === null) return;
    const id = this.confirmDeleteId;
    this.cancelDelete();
    this.niveauService.delete(id).subscribe({
      next: () => {
        this.loadNiveaux();
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Impossible de supprimer ce niveau car il est peut-être utilisé.';
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
