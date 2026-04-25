import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClasseService } from '../../core/services/classe.service';
import { Classe } from '../../core/models/classe.model';

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-left">
          <h1>Gestion des Classes</h1>
          <p>Gérez les différentes classes de l'établissement ({{ classes.length }} enregistrées)</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-primary" (click)="showAddForm()"><i class="pi pi-plus"></i> Nouvelle Classe</button>
        </div>
      </div>

      <!-- Add/Edit form -->
      <div class="form-card" *ngIf="displayForm">
        <h3>{{ editingId ? 'Modifier la Classe' : 'Nouvelle Classe' }}</h3>
        <div class="form-row">
          <div class="input-group">
            <label>Filière</label>
            <input type="text" [(ngModel)]="currentClasse.filiere" placeholder="Ex: Informatique de Gestion"/>
          </div>
          <div class="input-group">
            <label>Niveau</label>
            <input type="text" [(ngModel)]="currentClasse.niveau" placeholder="Ex: Licence 1"/>
          </div>
        </div>
        <div class="form-row">
          <div class="input-group">
            <label>Année Scolaire</label>
            <input type="text" [(ngModel)]="currentClasse.anneeScolaire" placeholder="Ex: 2023-2024"/>
          </div>
        </div>
        <div class="form-actions">
          <button class="btn btn-outline" (click)="displayForm = false">Annuler</button>
          <button class="btn btn-primary" (click)="save()"><i class="pi pi-check"></i> Enregistrer</button>
        </div>
      </div>

      <div class="table-card">
        <div class="table-header" style="display: flex; flex-direction: column; align-items: center; gap: 24px; position: relative;">
          <!-- Centered Search Bar -->
          <div class="search-container" style="align-self: stretch; max-width: 100%; display: flex; justify-content: center;">
            <div style="position: relative; width: 100%; max-width: 400px;">
              <i class="pi pi-search" style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #64748b;"></i>
              <input
                type="text"
                placeholder="Rechercher une filière, un niveau..."
                [(ngModel)]="searchText"
                (input)="filterClasses()"
                style="width: 100%; padding: 12px 16px 12px 42px; border-radius: 12px; border: 1px solid #cbd5e1; outline:none; background: rgba(255,255,255,0.9); font-family: inherit; transition: all 0.2s;"
              />
            </div>
          </div>
        </div>

        <div class="table-responsive">
          <table class="pro-table">
            <thead>
              <tr>
                <th>Filière</th>
                <th>Niveau</th>
                <th>Année Scolaire</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngIf="filteredClasses.length === 0">
                <td colspan="4" class="text-center" style="padding: 30px; color: #94a3b8;">Aucune classe trouvée.</td>
              </tr>
              <tr *ngFor="let classe of filteredClasses">
                <td data-label="Filière" style="font-weight: 600;">{{ classe.filiere || 'N/A' }}</td>
                <td data-label="Niveau"><span class="subject-chip">{{ classe.niveau || 'N/A' }}</span></td>
                <td data-label="Année Scolaire" style="color: #64748b;">{{ classe.anneeScolaire || 'N/A' }}</td>
                <td data-label="Actions" class="text-right">
                  <div class="action-buttons">
                    <button class="btn-icon" (click)="showEditForm(classe)"><i class="pi pi-pencil"></i></button>
                    <button class="btn-icon delete" (click)="delete(classe.id!)"><i class="pi pi-trash"></i></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styleUrl: './classes.scss'
})
export class Classes implements OnInit {
  classes: Classe[] = [];
  filteredClasses: Classe[] = [];
  searchText: string = '';
  displayForm: boolean = false;
  editingId: number | null = null;
  currentClasse: Partial<Classe> = {};

  constructor(private classeService: ClasseService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadClasses();
  }

  loadClasses() {
    this.classeService.getAll().subscribe({
      next: (data) => { 
        this.classes = data; 
        this.filterClasses();
        this.cdr.detectChanges();
      },
      error: () => { console.error('Erreur'); }
    });
  }

  filterClasses() {
    const text = this.searchText.toLowerCase();
    this.filteredClasses = this.classes.filter(
      (c) =>
        (c.filiere || '').toLowerCase().includes(text) ||
        (c.niveau || '').toLowerCase().includes(text) ||
        (c.anneeScolaire || '').toLowerCase().includes(text)
    );
  }

  showAddForm() {
    this.editingId = null;
    this.currentClasse = { filiere: '', niveau: '', anneeScolaire: '' };
    this.displayForm = true;
  }

  showEditForm(c: Classe) {
    this.editingId = c.id!;
    this.currentClasse = { ...c };
    this.displayForm = true;
  }

  save() {
    if (!this.currentClasse.filiere) return;
    if (this.editingId) {
      this.classeService.update(this.editingId, this.currentClasse as Classe).subscribe(() => {
        this.displayForm = false;
        this.loadClasses();
      });
    } else {
      this.classeService.create(this.currentClasse as Classe).subscribe(() => {
        this.displayForm = false;
        this.loadClasses();
      });
    }
  }

  delete(id: number) {
    if (confirm('Voulez-vous vraiment supprimer cette classe ?')) {
      this.classeService.delete(id).subscribe(() => this.loadClasses());
    }
  }
}
