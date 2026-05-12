import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { timeout } from 'rxjs/operators';
import { Salle } from '../../core/models/salle.model';
import { SalleService } from '../../core/services/salle.service';

@Component({
  selector: 'app-salles',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-left">
          <a routerLink="/dashboard" class="btn-back-arrow" title="Retour"><i class="pi pi-arrow-left"></i></a>
          <div>
            <h1>Gestion des Salles</h1>
            <p>Salles utilisées par les emplois du temps et séances ({{ salles.length }} enregistrées)</p>
          </div>
        </div>
        <button class="btn btn-primary" (click)="showAddForm()"><i class="pi pi-plus"></i> Nouvelle Salle</button>
      </div>

      <div class="form-card" *ngIf="displayForm">
        <div class="form-card-header"><h3>{{ editingId ? 'Modifier la Salle' : 'Nouvelle Salle' }}</h3></div>
        <div class="form-card-body">
          <div *ngIf="errorMessage" class="error-banner"><i class="pi pi-exclamation-triangle"></i>{{ errorMessage }}</div>
          <div class="section-grid">
            <div class="input-group"><label>Nom</label><input type="text" [(ngModel)]="currentSalle.nom" placeholder="Ex: Salle 101" /></div>
            <div class="input-group"><label>Bâtiment</label><input type="text" [(ngModel)]="currentSalle.batiment" placeholder="Ex: Bloc A" /></div>
            <div class="input-group"><label>Capacité</label><input type="number" [(ngModel)]="currentSalle.capacite" placeholder="Ex: 40" /></div>
            <div class="input-group"><label>Adresse IP</label><input type="text" [(ngModel)]="currentSalle.adresseIp" placeholder="Ex: 192.168.1.20" /></div>
            <div class="input-group"><label>Équipement</label><input type="text" [(ngModel)]="currentSalle.equipement" placeholder="Ex: Projecteur, tableau" /></div>
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
          <input type="text" placeholder="Rechercher une salle, bâtiment ou IP..." [(ngModel)]="searchText" (input)="filterSalles()" />
        </div>
      </div>

      <div class="empty-state" *ngIf="filteredSalles.length === 0">
        <i class="pi pi-building"></i>
        <h3>Aucune salle trouvée</h3>
        <p>Créez les salles avant de planifier les cours.</p>
      </div>

      <div class="cards-grid" *ngIf="filteredSalles.length > 0">
        <div class="ref-card" *ngFor="let salle of filteredSalles">
          <div class="card-accent"></div>
          <div class="card-body">
            <div class="card-title">{{ salle.nom }}</div>
            <div class="detail-item"><i class="pi pi-building"></i><span>{{ salle.batiment }}</span></div>
            <div class="detail-item"><i class="pi pi-users"></i><span>Capacité : <strong>{{ salle.capacite }}</strong></span></div>
            <div class="detail-item"><i class="pi pi-desktop"></i><span>{{ salle.equipement }}</span></div>
            <div class="detail-item"><i class="pi pi-wifi"></i><span>{{ salle.adresseIp }}</span></div>
          </div>
          <div class="card-actions">
            <button class="btn-icon-sm edit" (click)="showEditForm(salle)"><i class="pi pi-pencil"></i></button>
            <button class="btn-icon-sm delete" (click)="delete(salle.id!)"><i class="pi pi-trash"></i></button>
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
export class SallesComponent implements OnInit {
  salles: Salle[] = [];
  filteredSalles: Salle[] = [];
  searchText = '';
  displayForm = false;
  editingId: number | null = null;
  currentSalle: Partial<Salle> = {};
  errorMessage = '';
  isSaving = false;
  confirmDeleteId: number | null = null;
  confirmDeleteMessage = '';

  constructor(private salleService: SalleService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadSalles();
  }

  loadSalles(): void {
    this.salleService.getAll().subscribe({
      next: (data) => {
        this.salles = data;
        this.filterSalles();
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les salles.';
        this.cdr.detectChanges();
      },
    });
  }

  filterSalles(): void {
    const text = this.searchText.toLowerCase();
    this.filteredSalles = this.salles.filter((s) =>
      (s.nom || '').toLowerCase().includes(text) ||
      (s.batiment || '').toLowerCase().includes(text) ||
      (s.adresseIp || '').toLowerCase().includes(text),
    );
  }

  showAddForm(): void {
    this.editingId = null;
    this.errorMessage = '';
    this.currentSalle = { nom: '', batiment: '', capacite: 0, equipement: '', adresseIp: '' };
    this.displayForm = true;
  }

  showEditForm(salle: Salle): void {
    this.editingId = salle.id!;
    this.errorMessage = '';
    this.currentSalle = { ...salle };
    this.displayForm = true;
  }

  save(): void {
    const salleToSave: Salle = {
      nom: (this.currentSalle.nom || '').trim(),
      batiment: (this.currentSalle.batiment || '').trim(),
      capacite: Number(this.currentSalle.capacite || 0),
      equipement: (this.currentSalle.equipement || '').trim(),
      adresseIp: (this.currentSalle.adresseIp || '').trim(),
    };

    if (!salleToSave.nom || !salleToSave.batiment || salleToSave.capacite <= 0 || !salleToSave.equipement || !salleToSave.adresseIp) {
      this.errorMessage = 'Veuillez renseigner le nom, le bâtiment, la capacité, les équipements et l’adresse IP.';
      return;
    }

    this.isSaving = true;
    const request$ = this.editingId
      ? this.salleService.update(this.editingId, salleToSave)
      : this.salleService.create(salleToSave);

    request$.pipe(timeout(12000)).subscribe({
      next: () => {
        this.isSaving = false;
        this.displayForm = false;
        this.editingId = null;
        this.currentSalle = {};
        this.loadSalles();
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.handleSaveError(error, "Impossible d'enregistrer la salle.");
        this.cdr.detectChanges();
      },
    });
  }

  delete(id: number): void {
    this.confirmDeleteId = id;
    this.confirmDeleteMessage = 'Voulez-vous vraiment supprimer cette salle ? Les emplois du temps ou séances liés peuvent empêcher la suppression.';
  }

  cancelDelete(): void {
    this.confirmDeleteId = null;
    this.confirmDeleteMessage = '';
  }

  confirmDelete(): void {
    if (this.confirmDeleteId === null) return;
    const id = this.confirmDeleteId;
    this.cancelDelete();
    this.salleService.delete(id).subscribe({
      next: () => {
        this.loadSalles();
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Impossible de supprimer cette salle car elle est peut-être utilisée.';
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
