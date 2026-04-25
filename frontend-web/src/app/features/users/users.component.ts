import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
          <h1>Gestion des Utilisateurs</h1>
          <p>Supervisez l'ensemble des administrateurs et enseignants ({{ teachers.length }} enregistrés)</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-primary" (click)="showAddForm()"><i class="pi pi-plus"></i> Nouvel Utilisateur</button>
        </div>
      </div>

      <div class="form-card" *ngIf="displayForm">
        <h3>{{ editingId ? 'Modifier Utilisateur' : 'Nouvel Utilisateur' }}</h3>
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
        <div class="form-row">
          <div class="input-group">
            <label>Rôle</label>
            <select [(ngModel)]="currentTeacher.role">
              <option value="ENSEIGNANT">Enseignant</option>
              <option value="ADMIN">Administrateur</option>
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
          
          <!-- Premium Centered Tabs -->
          <div style="display: inline-flex; background: rgba(226, 232, 240, 0.4); padding: 6px; border-radius: 99px; gap: 4px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);">
            <button 
              style="padding: 10px 24px; border-radius: 99px; font-weight: 700; font-size: 0.95rem; border: none; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; gap: 8px;"
              [ngStyle]="activeTab === 'ENSEIGNANT' ? {'background': 'var(--primary-gradient)', 'color': 'white', 'box-shadow': '0 4px 15px rgba(79, 70, 229, 0.3)'} : {'background': 'transparent', 'color': '#64748b'}"
              (click)="activeTab = 'ENSEIGNANT'">
              <i class="pi pi-users"></i> Enseignants
              <span style="background: rgba(255,255,255,0.2); padding: 2px 8px; border-radius: 12px; font-size: 0.8rem; margin-left: 4px;">{{ filteredEnseignants.length }}</span>
            </button>
            <button 
              style="padding: 10px 24px; border-radius: 99px; font-weight: 700; font-size: 0.95rem; border: none; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; gap: 8px;"
              [ngStyle]="activeTab === 'ADMIN' ? {'background': 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 'color': 'white', 'box-shadow': '0 4px 15px rgba(245, 158, 11, 0.3)'} : {'background': 'transparent', 'color': '#64748b'}"
              (click)="activeTab = 'ADMIN'">
              <i class="pi pi-shield"></i> Administrateurs
              <span style="background: rgba(255,255,255,0.2); padding: 2px 8px; border-radius: 12px; font-size: 0.8rem; margin-left: 4px;">{{ filteredAdmins.length }}</span>
            </button>
          </div>

          <!-- Search Bar (Centered) -->
          <div class="search-container" style="align-self: stretch; max-width: 100%; display: flex; justify-content: center;">
            <div style="position: relative; width: 100%; max-width: 400px;">
              <i class="pi pi-search" style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #64748b;"></i>
              <input
                type="text"
                placeholder="Rechercher nom, prénom, matricule ou email..."
                [(ngModel)]="searchText"
                (input)="filterTeachers()"
                style="width: 100%; padding: 12px 16px 12px 42px; border-radius: 12px; border: 1px solid #cbd5e1; outline:none; background: rgba(255,255,255,0.9); font-family: inherit; transition: all 0.2s;"
              />
            </div>
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
            <tbody *ngIf="activeTab === 'ENSEIGNANT'">
              <tr *ngIf="filteredEnseignants.length === 0">
                <td colspan="5" class="text-center" style="padding: 30px; color: #94a3b8;">Aucun enseignant trouvé.</td>
              </tr>
              <tr *ngFor="let teacher of filteredEnseignants">
                <td data-label="Identité">
                  <div style="font-weight: 700; color: #0f172a;">{{ teacher.prenom }} {{ teacher.nom }}</div>
                  <div style="font-size: 0.8rem; padding: 2px 6px; border-radius: 4px; display: inline-block; margin-top: 4px; background: #e0f2fe; color: #0369a1;">
                    {{ teacher.role || 'ENSEIGNANT' }}
                  </div>
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
            <tbody *ngIf="activeTab === 'ADMIN'">
              <tr *ngIf="filteredAdmins.length === 0">
                <td colspan="5" class="text-center" style="padding: 30px; color: #94a3b8;">Aucun administrateur trouvé.</td>
              </tr>
              <tr *ngFor="let teacher of filteredAdmins">
                <td data-label="Identité">
                  <div style="font-weight: 700; color: #0f172a;">{{ teacher.prenom }} {{ teacher.nom }}</div>
                  <div style="font-size: 0.8rem; padding: 2px 6px; border-radius: 4px; display: inline-block; margin-top: 4px; background: #fee2e2; color: #991b1b;">
                    {{ teacher.role }}
                  </div>
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
  filteredEnseignants: Teacher[] = [];
  filteredAdmins: Teacher[] = [];
  activeTab: 'ENSEIGNANT' | 'ADMIN' = 'ENSEIGNANT';
  searchText: string = '';

  displayForm: boolean = false;
  editingId: number | null = null;
  currentTeacher: Partial<Teacher> = {};

  constructor(private teacherService: TeacherService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadTeachers();
  }

  loadTeachers() {
    this.teacherService.getTeachers().subscribe({
      next: (data) => {
        console.log('Données brutes reçues du backend :', data);
        this.teachers = data;
        this.filterTeachers();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des utilisateurs:', err);
      }
    });
  }

  filterTeachers() {
    const text = this.searchText.toLowerCase();
    const filtered = this.teachers.filter(
      (t) =>
        (t.nom || '').toLowerCase().includes(text) ||
        (t.prenom || '').toLowerCase().includes(text) ||
        (t.matricule || '').toLowerCase().includes(text) ||
        (t.email || '').toLowerCase().includes(text)
    );
    this.filteredEnseignants = filtered.filter(t => t.role !== 'ADMIN');
    this.filteredAdmins = filtered.filter(t => t.role === 'ADMIN');
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
          alert("Erreur lors de la mise à jour de l'utilisateur.");
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
          alert("Erreur lors de la création de l'utilisateur.");
        }
      });
    }
  }

  deleteTeacher(id: number) {
    if(confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      this.teacherService.delete(id).subscribe({
        next: () => this.loadTeachers(),
        error: (err) => console.error('Erreur lors de la suppression', err)
      });
    }
  }
}
