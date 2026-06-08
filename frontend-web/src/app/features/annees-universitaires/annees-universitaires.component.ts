import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { timeout } from 'rxjs/operators';
import { AnneeUniversitaire } from '../../core/models/annee-universitaire.model';
import { AnneeUniversitaireService } from '../../core/services/annee-universitaire.service';

@Component({
  selector: 'app-annees-universitaires',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-left">
          <a routerLink="/dashboard" class="btn-back-arrow" title="Retour"
            ><i class="pi pi-arrow-left"></i
          ></a>
          <div>
            <h1>Années universitaires</h1>
            <p>
              Années utilisées pour organiser les emplois du temps ({{ annees.length }}
              enregistrées)
            </p>
          </div>
        </div>
        <button class="btn btn-primary" (click)="showAddForm()">
          <i class="pi pi-plus"></i> Nouvelle Année
        </button>
      </div>

      <div class="form-card" *ngIf="displayForm">
        <div class="form-card-header">
          <h3>{{ editingId ? 'Modifier l’Année' : 'Nouvelle Année' }}</h3>
        </div>
        <div class="form-card-body">
          <div *ngIf="errorMessage" class="error-banner">
            <i class="pi pi-exclamation-triangle"></i>{{ errorMessage }}
          </div>
          <div class="section-grid">
            <div class="input-group">
              <label>Libellé</label
              ><input type="text" [(ngModel)]="currentAnnee.libelle" placeholder="Ex: 2025-2026" />
            </div>
            <div class="input-group">
              <label>Date début</label><input type="date" [(ngModel)]="currentAnnee.dateDebut" />
            </div>
            <div class="input-group">
              <label>Date fin</label><input type="date" [(ngModel)]="currentAnnee.dateFin" />
            </div>
            <div class="input-group">
              <label>Statut</label>
              <div class="readonly-status">
                {{ getComputedStatusLabel() }}
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
            placeholder="Rechercher une année..."
            [(ngModel)]="searchText"
            (input)="filterAnnees()"
          />
        </div>
      </div>

      <div class="empty-state" *ngIf="filteredAnnees.length === 0">
        <i class="pi pi-calendar"></i>
        <h3>Aucune année trouvée</h3>
        <p>Créez une année universitaire avant de planifier les emplois du temps.</p>
      </div>

      <div class="cards-grid" *ngIf="filteredAnnees.length > 0">
        <div class="ref-card" *ngFor="let annee of filteredAnnees">
          <div class="card-accent"></div>
          <div class="card-body">
            <span [class]="annee.active ? 'badge-active' : 'badge-inactive'">{{
              annee.active ? 'Active' : 'Inactive'
            }}</span>
            <div class="card-title">{{ annee.libelle }}</div>
            <div class="detail-item">
              <i class="pi pi-calendar-plus"></i
              ><span>Début : {{ annee.dateDebut | date: 'dd/MM/yyyy' }}</span>
            </div>
            <div class="detail-item">
              <i class="pi pi-calendar-minus"></i
              ><span>Fin : {{ annee.dateFin | date: 'dd/MM/yyyy' }}</span>
            </div>
          </div>
          <div class="card-actions">
            <button class="btn-icon-sm edit" (click)="showEditForm(annee)">
              <i class="pi pi-pencil"></i>
            </button>
            <button class="btn-icon-sm delete" (click)="delete(annee.id!)">
              <i class="pi pi-trash"></i>
            </button>
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
export class AnneesUniversitairesComponent implements OnInit {
  annees: AnneeUniversitaire[] = [];
  filteredAnnees: AnneeUniversitaire[] = [];
  searchText = '';
  displayForm = false;
  editingId: number | null = null;
  currentAnnee: Partial<AnneeUniversitaire> = {};
  errorMessage = '';
  isSaving = false;
  confirmDeleteId: number | null = null;
  confirmDeleteMessage = '';

  constructor(
    private anneeService: AnneeUniversitaireService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadAnnees();
  }

  loadAnnees(): void {
    this.anneeService.getAll().subscribe({
      next: (data) => {
        this.annees = data;
        this.filterAnnees();
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les années universitaires.';
        this.cdr.detectChanges();
      },
    });
  }

  filterAnnees(): void {
    const text = this.searchText.toLowerCase();
    this.filteredAnnees = this.annees.filter((a) => (a.libelle || '').toLowerCase().includes(text));
  }

  showAddForm(): void {
    this.editingId = null;
    this.errorMessage = '';
    this.currentAnnee = { libelle: '', dateDebut: '', dateFin: '' };
    this.displayForm = true;
  }

  showEditForm(annee: AnneeUniversitaire): void {
    this.editingId = annee.id!;
    this.errorMessage = '';
    this.currentAnnee = { ...annee };
    this.displayForm = true;
  }

  save(): void {
    const anneeToSave: AnneeUniversitaire = {
      libelle: (this.currentAnnee.libelle || '').trim(),
      dateDebut: this.currentAnnee.dateDebut || '',
      dateFin: this.currentAnnee.dateFin || '',
    };

    if (!anneeToSave.libelle || !anneeToSave.dateDebut || !anneeToSave.dateFin) {
      this.errorMessage = 'Veuillez renseigner le libellé, la date de début et la date de fin.';
      return;
    }

    if (new Date(anneeToSave.dateDebut) >= new Date(anneeToSave.dateFin)) {
      this.errorMessage = 'La date de début doit être antérieure à la date de fin.';
      return;
    }

    this.isSaving = true;
    const request$ = this.editingId
      ? this.anneeService.update(this.editingId, anneeToSave)
      : this.anneeService.create(anneeToSave);

    request$.pipe(timeout(12000)).subscribe({
      next: () => {
        this.isSaving = false;
        this.displayForm = false;
        this.editingId = null;
        this.currentAnnee = {};
        this.loadAnnees();
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.handleSaveError(error, "Impossible d'enregistrer l’année universitaire.");
        this.cdr.detectChanges();
      },
    });
  }

  delete(id: number): void {
    this.confirmDeleteId = id;
    this.confirmDeleteMessage =
      'Voulez-vous vraiment supprimer cette année ? Les emplois du temps liés peuvent empêcher la suppression.';
  }

  cancelDelete(): void {
    this.confirmDeleteId = null;
    this.confirmDeleteMessage = '';
  }

  confirmDelete(): void {
    if (this.confirmDeleteId === null) return;
    const id = this.confirmDeleteId;
    this.cancelDelete();
    this.anneeService.delete(id).subscribe({
      next: () => {
        this.loadAnnees();
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Impossible de supprimer cette année car elle est peut-être utilisée.';
        this.cdr.detectChanges();
      },
    });
  }

  getComputedStatusLabel(): string {
    const dateDebut = this.currentAnnee.dateDebut;
    const dateFin = this.currentAnnee.dateFin;

    if (!dateDebut || !dateFin) {
      return 'À déterminer';
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(dateDebut);
    const end = new Date(dateFin);

    return today >= start && today <= end ? 'Active' : 'Inactive';
  }

  private handleSaveError(error: any, fallback: string): void {
    this.isSaving = false;
    this.errorMessage =
      error?.name === 'TimeoutError'
        ? 'Le serveur met trop de temps à répondre.'
        : error?.error?.error || error?.error?.message || fallback;
  }
}
