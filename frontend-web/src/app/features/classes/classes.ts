import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ClasseService } from '../../core/services/classe.service';
import { FiliereService } from '../../core/services/filiere.service';
import { NiveauEnseignementService } from '../../core/services/niveau-enseignement.service';
import { Classe } from '../../core/models/classe.model';
import { Filiere } from '../../core/models/filiere.model';
import { NiveauEnseignement } from '../../core/models/niveau-enseignement.model';
import { timeout } from 'rxjs/operators';

@Component({
  selector: 'app-classes',
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
              <h1>Gestion des Classes</h1>
              <p>
                Gérez les différentes classes de l'établissement ({{ classes.length }} enregistrées)
              </p>
            </div>
          </div>
        </div>
        <div class="header-actions">
          <button class="btn btn-primary" (click)="showAddForm()">
            <i class="pi pi-plus"></i> Nouvelle Classe
          </button>
        </div>
      </div>

      <div class="form-card" *ngIf="displayForm">
        <div class="form-card-header">
          <h3>{{ editingId ? 'Modifier la Classe' : 'Nouvelle Classe' }}</h3>
        </div>
        <div class="form-card-body">
          <div *ngIf="errorMessage" class="error-banner">
            <i class="pi pi-exclamation-triangle"></i>
            {{ errorMessage }}
          </div>

          <div class="form-section">
            <div class="section-label">
              <i class="pi pi-info-circle"></i>
              <span>Informations de la classe</span>
            </div>
            <div class="section-grid">
              <div class="input-group">
                <label>Libellé</label>
                <input
                  type="text"
                  [(ngModel)]="currentClasse.libelle"
                  placeholder="Ex: Licence 1 Informatique de Gestion"
                />
              </div>
              <div class="input-group">
                <label>Filière</label>
                <select [(ngModel)]="currentClasse.filiereId" (ngModelChange)="autoFillLibelle()">
                  <option [ngValue]="null" disabled>Sélectionnez une filière</option>
                  <option *ngFor="let f of filieres" [ngValue]="f.id">
                    {{ f.libelle }}
                  </option>
                </select>
              </div>
              <div class="input-group">
                <label>Niveau d'Enseignement</label>
                <select [(ngModel)]="currentClasse.niveauEnseignementId" (ngModelChange)="autoFillLibelle()">
                  <option [ngValue]="null" disabled>Sélectionnez un niveau</option>
                  <option *ngFor="let n of niveauxEnseignement" [ngValue]="n.id">
                    {{ n.libelle }}
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div class="form-actions">
            <button class="btn btn-outline" (click)="displayForm = false">Annuler</button>
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
            placeholder="Rechercher un libellé..."
            [(ngModel)]="searchText"
            (input)="filterClasses()"
          />
        </div>
      </div>

      <div class="empty-state" *ngIf="filteredClasses.length === 0">
        <div class="empty-icon">
          <i class="pi pi-folder-open"></i>
        </div>
        <h3>Aucune classe trouvée</h3>
        <p>Créez une nouvelle classe pour commencer.</p>
      </div>

      <div class="cards-grid" *ngIf="filteredClasses.length > 0">
        <div class="class-card" *ngFor="let classe of filteredClasses">
          <div class="card-accent"></div>
          <div class="card-body">
            <div class="card-title">{{ classe.libelle || 'N/A' }}</div>
            <div class="card-badges">
              <span class="badge-niveau">{{ getFiliereLibelle(classe.filiereId) }}</span>
              <span class="badge-niveau">{{ getNiveauLibelle(classe.niveauEnseignementId) }}</span>
            </div>
          </div>
          <div class="card-actions">
            <button class="btn-icon-sm edit" (click)="showEditForm(classe)" title="Modifier">
              <i class="pi pi-pencil"></i>
            </button>
            <button class="btn-icon-sm delete" (click)="delete(classe.id!)" title="Supprimer">
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
  styleUrl: './classes.scss',
})
export class Classes implements OnInit {
  classes: Classe[] = [];
  filteredClasses: Classe[] = [];
  filieres: Filiere[] = [];
  niveauxEnseignement: NiveauEnseignement[] = [];
  searchText: string = '';
  displayForm: boolean = false;
  editingId: number | null = null;
  currentClasse: Partial<Classe> = {};
  errorMessage: string = '';
  isSaving: boolean = false;
  confirmDeleteId: number | null = null;
  confirmDeleteMessage = '';

  constructor(
    private classeService: ClasseService,
    private filiereService: FiliereService,
    private niveauEnseignementService: NiveauEnseignementService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadClasses();
    this.loadFilieres();
    this.loadNiveauxEnseignement();
  }

  private loadFilieres(): void {
    this.filiereService.getAll().subscribe({
      next: (data) => (this.filieres = data),
      error: (err) => {
        console.error('[Classes] Erreur chargement filières:', err);
        this.errorMessage = 'Impossible de charger les filières. Vérifiez le backend.';
      },
    });
  }

  private loadNiveauxEnseignement(): void {
    this.niveauEnseignementService.getAll().subscribe({
      next: (data) => (this.niveauxEnseignement = data),
      error: (err) => {
        console.error('[Classes] Erreur chargement niveaux:', err);
        this.errorMessage =
          "Impossible de charger les niveaux d'enseignement. Vérifiez le backend.";
      },
    });
  }

  loadClasses() {
    this.classeService.getAll().subscribe({
      next: (data) => {
        this.classes = data;
        this.filterClasses();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[Classes] Erreur chargement classes:', err);
        this.errorMessage = 'Impossible de charger les classes. Vérifiez le backend.';
      },
    });
  }

  filterClasses() {
    const text = this.searchText.toLowerCase();
    this.filteredClasses = this.classes.filter((c) =>
      (c.libelle || '').toLowerCase().includes(text),
    );
  }

  getFiliereLibelle(filiereId: number | string | undefined): string {
    if (!filiereId) return 'N/A';
    const id = Number(filiereId);
    const f = this.filieres.find((f) => f.id === id);
    return f ? f.libelle : 'N/A';
  }

  getNiveauLibelle(niveauId: number | string | undefined): string {
    if (!niveauId) return 'N/A';
    const id = Number(niveauId);
    const n = this.niveauxEnseignement.find((n) => n.id === id);
    return n ? n.libelle : 'N/A';
  }

  autoFillLibelle() {
    if (this.currentClasse.filiereId && this.currentClasse.niveauEnseignementId) {
      const filiere = this.getFiliereLibelle(this.currentClasse.filiereId);
      const niveau = this.getNiveauLibelle(this.currentClasse.niveauEnseignementId);
      if (filiere !== 'N/A' && niveau !== 'N/A') {
        this.currentClasse.libelle = `${niveau} - ${filiere}`;
      }
    }
  }

  showAddForm() {
    this.editingId = null;
    this.errorMessage = '';
    this.isSaving = false;
    this.currentClasse = { libelle: '', filiereId: undefined, niveauEnseignementId: undefined };
    this.displayForm = true;
  }

  showEditForm(c: Classe) {
    this.editingId = c.id!;
    this.errorMessage = '';
    this.isSaving = false;
    this.currentClasse = { ...c };
    this.displayForm = true;
  }

  save() {
    this.errorMessage = '';

    const classeToSave: Classe = {
      ...this.currentClasse,
      libelle: (this.currentClasse.libelle || '').trim(),
      filiereId: Number(this.currentClasse.filiereId),
      niveauEnseignementId: Number(this.currentClasse.niveauEnseignementId),
    };

    if (!classeToSave.libelle || !classeToSave.filiereId || !classeToSave.niveauEnseignementId) {
      this.errorMessage =
        "Veuillez renseigner le libellé, la filière et le niveau d'enseignement avant d'enregistrer.";
      return;
    }

    this.isSaving = true;

    const request$ = this.editingId
      ? this.classeService.update(this.editingId, classeToSave)
      : this.classeService.create(classeToSave);

    request$.pipe(timeout(12000)).subscribe({
      next: (savedClasse) => {
        if (this.editingId) {
          this.classes = this.classes.map((classe) =>
            classe.id === this.editingId ? savedClasse : classe,
          );
        } else {
          this.classes = [savedClasse, ...this.classes];
        }

        this.filterClasses();
        this.displayForm = false;
        this.isSaving = false;
        this.errorMessage = '';
        this.currentClasse = {};
        this.editingId = null;
        this.cdr.detectChanges();
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
          this.errorMessage = "Vous n'avez pas les droits nécessaires pour enregistrer une classe.";
          return;
        }

        this.errorMessage =
          error?.error?.error ||
          error?.error?.message ||
          "Impossible d'enregistrer la classe. Vérifiez le backend et réessayez.";
      },
    });
  }

  delete(id: number) {
    this.confirmDeleteId = id;
    this.confirmDeleteMessage = 'Voulez-vous vraiment supprimer cette classe ?';
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
    this.classeService.delete(id).subscribe(() => this.loadClasses());
  }
}
