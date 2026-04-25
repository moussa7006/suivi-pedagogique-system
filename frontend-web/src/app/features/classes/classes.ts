import { Component, OnInit } from '@angular/core';
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
              <tr *ngIf="classes.length === 0">
                <td colspan="4" class="text-center" style="padding: 30px; color: #94a3b8;">Aucune classe trouvée.</td>
              </tr>
              <tr *ngFor="let classe of classes">
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
  displayForm: boolean = false;
  editingId: number | null = null;
  currentClasse: Partial<Classe> = {};

  constructor(private classeService: ClasseService) {}

  ngOnInit() {
    this.loadClasses();
  }

  loadClasses() {
    this.classeService.getAll().subscribe({
      next: (data) => { this.classes = data; },
      error: () => { console.error('Erreur'); }
    });
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
