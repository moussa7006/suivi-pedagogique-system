import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeacherService } from '../../core/services/teacher.service';
import { Teacher } from '../../core/models/teacher.model';

@Component({
  selector: 'app-teachers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-left">
          <h1>Gestion des Enseignants</h1>
          <p>Supervisez l'ensemble du corps professoral ({{ teachers.length }} enregistrés)</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-primary" (click)="showAddForm()"><i class="pi pi-plus"></i> Nouveau Enseignant</button>
        </div>
      </div>

      <div class="form-card" *ngIf="displayForm">
        <h3>{{ editingId ? 'Modifier Enseignant' : 'Nouvel Enseignant' }}</h3>
        <div class="form-row">
          <div class="input-group">
            <label>Matricule</label>
            <input type="text" [(ngModel)]="currentTeacher.matricule" placeholder="Ex: ENS-001"/>
          </div>
          <div class="input-group">
            <label>Prénom</label>
            <input type="text" [(ngModel)]="currentTeacher.prenom" placeholder="Prénom"/>
          </div>
          <div class="input-group">
            <label>Nom</label>
            <input type="text" [(ngModel)]="currentTeacher.nom" placeholder="Nom de famille"/>
          </div>
        </div>
        <div class="form-row">
          <div class="input-group">
            <label>Email</label>
            <input type="email" [(ngModel)]="currentTeacher.email" placeholder="email@exemple.com"/>
          </div>
          <div class="input-group">
            <label>Téléphone</label>
            <input type="text" [(ngModel)]="currentTeacher.telephone" placeholder="+223..."/>
          </div>
        </div>
        <div class="form-row" *ngIf="!editingId">
          <div class="input-group">
            <label>Adresse</label>
            <input type="text" [(ngModel)]="currentTeacher.adresse" placeholder="Quartier, Ville..."/>
          </div>
          <div class="input-group">
            <label>Mot de Passe (provisoire)</label>
            <input type="password" [(ngModel)]="currentTeacher.motDePasse"/>
          </div>
        </div>
        <div class="form-actions">
          <button class="btn btn-outline" (click)="displayForm = false">Annuler</button>
          <button class="btn btn-primary" (click)="save()"><i class="pi pi-check"></i> Enregistrer</button>
        </div>
      </div>

      <div class="table-card">
        <div class="table-header">
          <div class="search-container">
            <i class="pi pi-search"></i>
            <input
              type="text"
              placeholder="Rechercher nom, prénom, matricule ou email..."
              [(ngModel)]="searchText"
              (input)="filterTeachers()"
            />
          </div>
        </div>

        <div class="table-responsive">
          <table class="pro-table">
            <thead>
              <tr>
                <th>Identité</th>
                <th>Matricule</th>
                <th>Contacts</th>
                <th>Adresse</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngIf="filteredTeachers.length === 0">
                <td colspan="5" class="text-center" style="padding: 30px; color: #94a3b8;">Aucun enseignant trouvé.</td>
              </tr>
              <tr *ngFor="let teacher of filteredTeachers">
                <td data-label="Identité">
                  <div style="font-weight: 700; color: #0f172a;">{{ teacher.prenom }} {{ teacher.nom }}</div>
                  <div style="font-size: 0.8rem; color: #64748b;">{{ teacher.role || 'ENSEIGNANT' }}</div>
                </td>
                <td data-label="Matricule">
                  <span class="matricule-badge">{{ teacher.matricule || 'N/A' }}</span>
                </td>
                <td data-label="Contacts">
                  <div style="display:flex; flex-direction:column; gap:4px; font-size: 0.85rem;">
                    <span><i class="pi pi-envelope" style="margin-right:4px;"></i>{{ teacher.email }}</span>
                    <span><i class="pi pi-phone" style="margin-right:4px;"></i>{{ teacher.telephone }}</span>
                  </div>
                </td>
                <td data-label="Adresse" style="color: #64748b; font-size: 0.9rem;">
                  {{ teacher.adresse }}
                </td>
                <td data-label="Actions" class="text-right">
                  <div class="action-buttons">
                    <button class="btn-icon" (click)="showEditForm(teacher)"><i class="pi pi-pencil"></i></button>
                    <button class="btn-icon delete" (click)="deleteTeacher(teacher.id!)"><i class="pi pi-trash"></i></button>
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
export class TeachersComponent implements OnInit {
  teachers: Teacher[] = [];
  filteredTeachers: Teacher[] = [];
  searchText: string = '';

  displayForm: boolean = false;
  editingId: number | null = null;
  currentTeacher: Partial<Teacher> = {};

  constructor(private teacherService: TeacherService) {}

  ngOnInit() {
    this.loadTeachers();
  }

  loadTeachers() {
    this.teacherService.getTeachers().subscribe((data) => {
      this.teachers = data;
      this.filteredTeachers = data;
    });
  }

  filterTeachers() {
    const text = this.searchText.toLowerCase();
    this.filteredTeachers = this.teachers.filter(
      (t) =>
        (t.nom || '').toLowerCase().includes(text) ||
        (t.prenom || '').toLowerCase().includes(text) ||
        (t.matricule || '').toLowerCase().includes(text) ||
        (t.email || '').toLowerCase().includes(text)
    );
  }

  showAddForm() {
    this.editingId = null;
    this.currentTeacher = { role: 'ENSEIGNANT' };
    this.displayForm = true;
  }

  showEditForm(t: Teacher) {
    this.editingId = t.id!;
    this.currentTeacher = { ...t };
    this.displayForm = true;
  }

  save() {
    if (!this.currentTeacher.nom || !this.currentTeacher.prenom || !this.currentTeacher.email) return;
    
    if (this.editingId) {
      this.teacherService.update(this.editingId, this.currentTeacher as Teacher).subscribe({
        next: () => {
          this.displayForm = false;
          this.loadTeachers();
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour', err);
          alert('Erreur lors de la mise à jour de l\'enseignant.');
        }
      });
    } else {
      this.teacherService.create(this.currentTeacher as Teacher).subscribe({
        next: () => {
          this.displayForm = false;
          this.loadTeachers();
        },
        error: (err) => {
          console.error('Erreur lors de la création', err);
          alert('Erreur lors de la création de l\'enseignant.');
        }
      });
    }
  }

  deleteTeacher(id: number) {
    if(confirm('Voulez-vous vraiment supprimer cet enseignant ?')) {
      this.teacherService.delete(id).subscribe({
        next: () => this.loadTeachers(),
        error: (err) => console.error('Erreur lors de la suppression', err)
      });
    }
  }
}
