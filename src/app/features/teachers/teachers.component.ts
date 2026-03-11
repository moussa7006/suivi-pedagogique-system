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
    <div class="teachers-page">
      <div class="page-header">
        <div class="header-left">
          <h1>Gestion des Enseignants</h1>
          <p>Supervisez l'ensemble du corps professoral ({{teachers.length}} enregistrés)</p>
        </div>
        <button class="btn btn-primary">
          <i class="pi pi-plus"></i> Nouveau Enseignant
        </button>
      </div>

      <div class="table-card">
        <div class="table-header">
          <div class="search-container">
            <i class="pi pi-search"></i>
            <input 
              type="text" 
              placeholder="Rechercher un matricule, nom ou département..."
              [(ngModel)]="searchText"
              (input)="filterTeachers()"
            >
          </div>
          <div class="filter-actions">
            <button class="btn btn-outline"><i class="pi pi-filter"></i> Filtres</button>
            <button class="btn btn-outline"><i class="pi pi-download"></i> Exporter</button>
          </div>
        </div>

        <div class="table-responsive">
          <table class="pro-table">
            <thead>
              <tr>
                <th>Enseignant</th>
                <th>Matricule</th>
                <th>Département</th>
                <th>Matières</th>
                <th>Statut</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (teacher of filteredTeachers; track teacher.id) {
                <tr>
                  <td>
                    <div class="teacher-identity">
                      <img [src]="teacher.avatar" alt="Avatar">
                      <div class="name-info">
                        <span class="full-name">{{teacher.firstName}} {{teacher.lastName}}</span>
                        <span class="email">{{teacher.email}}</span>
                      </div>
                    </div>
                  </td>
                  <td><span class="matricule-badge">{{teacher.matricule}}</span></td>
                  <td>{{teacher.department}}</td>
                  <td>
                    <div class="subjects-list">
                      @for (subject of teacher.subjects; track subject) {
                        <span class="subject-chip">{{subject}}</span>
                      }
                    </div>
                  </td>
                  <td>
                    <span class="status-badge" [ngClass]="getStatusClass(teacher.status)">
                      {{teacher.status}}
                    </span>
                  </td>
                  <td class="text-right">
                    <div class="action-buttons">
                      <button title="Modifier"><i class="pi pi-pencil"></i></button>
                      <button title="Voir Statistiques"><i class="pi pi-chart-line"></i></button>
                      <button class="delete" title="Supprimer"><i class="pi pi-trash"></i></button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .teachers-page { display: flex; flex-direction: column; gap: 24px; }
    
    .page-header {
      display: flex; justify-content: space-between; align-items: flex-end;
      h1 { margin: 0; font-size: 1.7rem; font-weight: 800; }
      p { margin: 4px 0 0; color: #64748b; font-size: 1rem; }
    }

    .btn {
      padding: 10px 20px; border-radius: 10px; font-weight: 600; cursor: pointer;
      display: flex; align-items: center; gap: 8px; border: none; transition: all 0.2s;
      &.btn-primary { background: var(--primary-color); color: white; &:hover { opacity: 0.9; transform: translateY(-1px); } }
      &.btn-outline { background: white; border: 1px solid #e2e8f0; color: #64748b; &:hover { background: #f8fafc; } }
    }

    .table-card {
      background: white; border-radius: 16px; border: 1px solid #e2e8f0;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); overflow: hidden;
    }

    .table-header {
      padding: 20px; border-bottom: 1px solid #f1f5f9;
      display: flex; justify-content: space-between; align-items: center;
      .search-container {
        position: relative; width: 400px;
        i { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #94a3b8; }
        input {
          width: 100%; padding: 10px 14px 10px 40px; border-radius: 10px;
          border: 1px solid #e2e8f0; background: #f8fafc; outline: none;
          &:focus { border-color: var(--primary-color); background: white; }
        }
      }
      .filter-actions { display: flex; gap: 12px; }
    }

    .pro-table {
      width: 100%; border-collapse: collapse;
      th { padding: 16px 20px; background: #f8fafc; text-align: left; color: #64748b; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; }
      td { padding: 16px 20px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
    }

    .teacher-identity {
      display: flex; align-items: center; gap: 12px;
      img { width: 40px; height: 40px; border-radius: 12px; object-fit: cover; }
      .name-info { display: flex; flex-direction: column; .full-name { font-weight: 700; color: #0f172a; } .email { font-size: 0.8rem; color: #64748b; } }
    }

    .matricule-badge { background: #eff6ff; color: #3b82f6; padding: 4px 10px; border-radius: 6px; font-family: monospace; font-weight: 600; font-size: 0.9rem; }

    .subjects-list { display: flex; flex-wrap: wrap; gap: 4px; }
    .subject-chip { background: #f1f5f9; color: #475569; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 500; }

    .status-badge {
      padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600;
      &.status-active { background: #dcfce7; color: #166534; }
      &.status-away { background: #fef9c3; color: #854d0e; }
      &.status-inactive { background: #fee2e2; color: #991b1b; }
    }

    .action-buttons {
      display: flex; gap: 8px; justify-content: flex-end;
      button {
        width: 32px; height: 32px; border-radius: 8px; border: 1px solid #e2e8f0;
        background: white; color: #64748b; cursor: pointer; transition: all 0.2s;
        &:hover { background: #f1f5f9; color: var(--primary-color); border-color: var(--primary-color); }
        &.delete:hover { background: #fef2f2; color: #ef4444; border-color: #ef4444; }
      }
    }

    .text-right { text-align: right; }
  `]
})
export class TeachersComponent implements OnInit {
  teachers: Teacher[] = [];
  filteredTeachers: Teacher[] = [];
  searchText: string = '';

  constructor(private teacherService: TeacherService) {}

  ngOnInit() {
    this.teacherService.getTeachers().subscribe(data => {
      this.teachers = data;
      this.filteredTeachers = data;
    });
  }

  filterTeachers() {
    const text = this.searchText.toLowerCase();
    this.filteredTeachers = this.teachers.filter(t => 
      t.firstName.toLowerCase().includes(text) || 
      t.lastName.toLowerCase().includes(text) || 
      t.matricule.toLowerCase().includes(text) ||
      t.department.toLowerCase().includes(text)
    );
  }

  getStatusClass(status: string) {
    switch(status) {
      case 'Actif': return 'status-active';
      case 'En congé': return 'status-away';
      case 'Inactif': return 'status-inactive';
      default: return '';
    }
  }
}
