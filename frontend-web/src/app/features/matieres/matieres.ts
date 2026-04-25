import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatiereService } from '../../core/services/matiere.service';
import { ClasseService } from '../../core/services/classe.service';
import { Matiere } from '../../core/models/matiere.model';
import { Classe } from '../../core/models/classe.model';

@Component({
  selector: 'app-matieres',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-left">
          <h1>Gestion des Matières</h1>
          <p>Gérez les matières ({{ matieres.length }} enregistrées)</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-primary" (click)="showAddForm()"><i class="pi pi-plus"></i> Nouvelle Matière</button>
        </div>
      </div>

      <div class="form-card" *ngIf="displayForm">
        <h3>{{ editingId ? 'Modifier la Matière' : 'Nouvelle Matière' }}</h3>
        <div class="form-row">
          <div class="input-group">
            <label>Code Matière</label>
            <input type="text" [(ngModel)]="currentMatiere.codeMatiere" placeholder="Ex: INFO101"/>
          </div>
          <div class="input-group">
            <label>Libellé</label>
            <input type="text" [(ngModel)]="currentMatiere.libelle" placeholder="Ex: Algorithmique"/>
          </div>
        </div>
        <div class="form-row">
          <div class="input-group">
            <label>Coefficient</label>
            <input type="number" [(ngModel)]="currentMatiere.coefficient"/>
          </div>
          <div class="input-group">
            <label>Classe Rattachée</label>
            <select [(ngModel)]="selectedClasseId">
              <option *ngFor="let c of classes" [value]="c.id">{{c.filiere}} - {{c.niveau}}</option>
            </select>
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
                placeholder="Rechercher code ou libellé..."
                [(ngModel)]="searchText"
                (input)="filterMatieres()"
                style="width: 100%; padding: 12px 16px 12px 42px; border-radius: 12px; border: 1px solid #cbd5e1; outline:none; background: rgba(255,255,255,0.9); font-family: inherit; transition: all 0.2s;"
              />
            </div>
          </div>
        </div>

        <div class="table-responsive">
          <table class="pro-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Libellé</th>
                <th>Coefficient</th>
                <th>Classe</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngIf="filteredMatieres.length === 0">
                <td colspan="5" class="text-center" style="padding: 30px; color: #94a3b8;">Aucune matière trouvée.</td>
              </tr>
              <tr *ngFor="let m of filteredMatieres">
                <td data-label="Code" style="font-weight: 600;">{{ m.codeMatiere }}</td>
                <td data-label="Libellé" style="font-weight: 600; color:var(--primary-color);">{{ m.libelle }}</td>
                <td data-label="Coefficient">{{ m.coefficient }}</td>
                <td data-label="Classe"><span class="subject-chip">{{ m.classes && m.classes.length > 0 ? (m.classes[0].filiere + ' ' + m.classes[0].niveau) : 'N/A' }}</span></td>
                <td data-label="Actions" class="text-right">
                  <div class="action-buttons">
                    <button class="btn-icon" (click)="showEditForm(m)"><i class="pi pi-pencil"></i></button>
                    <button class="btn-icon delete" (click)="delete(m.id!)"><i class="pi pi-trash"></i></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styleUrl: '../classes/classes.scss'
})
export class Matieres implements OnInit {
  matieres: Matiere[] = [];
  filteredMatieres: Matiere[] = [];
  searchText: string = '';
  classes: Classe[] = [];
  displayForm: boolean = false;
  editingId: number | null = null;
  currentMatiere: Partial<Matiere> = {};
  selectedClasseId: number | null = null;

  constructor(private matiereService: MatiereService, private classeService: ClasseService) {}

  ngOnInit() {
    this.loadMatieres();
    this.classeService.getAll().subscribe(c => this.classes = c);
  }

  loadMatieres() {
    this.matiereService.getAll().subscribe(data => {
      this.matieres = data;
      this.filterMatieres();
    });
  }

  filterMatieres() {
    const text = this.searchText.toLowerCase();
    this.filteredMatieres = this.matieres.filter(
      (m) =>
        (m.codeMatiere || '').toLowerCase().includes(text) ||
        (m.libelle || '').toLowerCase().includes(text)
    );
  }

  showAddForm() {
    this.editingId = null;
    this.currentMatiere = { codeMatiere: '', libelle: '', coefficient: 1 };
    this.selectedClasseId = null;
    this.displayForm = true;
  }

  showEditForm(m: Matiere) {
    this.editingId = m.id!;
    this.currentMatiere = { ...m };
    this.selectedClasseId = m.classes && m.classes.length > 0 ? m.classes[0].id! : null;
    this.displayForm = true;
  }

  save() {
    if (!this.currentMatiere.libelle || !this.currentMatiere.codeMatiere) return;
    const classeSelectionnee = this.classes.find(c => c.id === Number(this.selectedClasseId));
    this.currentMatiere.classes = classeSelectionnee ? [classeSelectionnee] : [];
    
    if (this.editingId) {
      this.matiereService.update(this.editingId, this.currentMatiere as Matiere).subscribe(() => {
        this.displayForm = false;
        this.loadMatieres();
      });
    } else {
      this.matiereService.create(this.currentMatiere as Matiere).subscribe(() => {
        this.displayForm = false;
        this.loadMatieres();
      });
    }
  }

  delete(id: number) {
    if (confirm('Supprimer cette matière ?')) {
      this.matiereService.delete(id).subscribe(() => this.loadMatieres());
    }
  }
}
