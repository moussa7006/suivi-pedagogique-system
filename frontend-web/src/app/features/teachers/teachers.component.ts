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
      <!-- HEADER -->
      <div class="page-header">
        <div class="header-left">
          <h1>Gestion des Enseignants</h1>
          <p>Supervisez l'ensemble du corps professoral ({{ teachers.length }} enregistrés)</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-outline"><i class="pi pi-filter"></i> Filtres</button>
          <button class="btn btn-primary"><i class="pi pi-plus"></i> Nouveau Enseignant</button>
        </div>
      </div>

      <!-- TABLE CARD -->
      <div class="table-card">
        <div class="table-header">
          <div class="search-container">
            <i class="pi pi-search"></i>
            <input
              type="text"
              placeholder="Rechercher un matricule, nom ou département..."
              [(ngModel)]="searchText"
              (input)="filterTeachers()"
            />
          </div>
          <div class="header-extra">
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
                  <td data-label="Enseignant">
                    <div class="teacher-identity">
                      <img [src]="teacher.avatar" alt="Avatar" />
                      <div class="name-info">
                        <span class="full-name"
                          >{{ teacher.firstName }} {{ teacher.lastName }}</span
                        >
                        <span class="email">{{ teacher.email }}</span>
                      </div>
                    </div>
                  </td>
                  <td data-label="Matricule">
                    <span class="matricule-badge">{{ teacher.matricule }}</span>
                  </td>
                  <td data-label="Département">{{ teacher.department }}</td>
                  <td data-label="Matières">
                    <div class="subjects-list">
                      @for (subject of teacher.subjects; track subject) {
                        <span class="subject-chip">{{ subject }}</span>
                      }
                    </div>
                  </td>
                  <td data-label="Statut">
                    <span class="status-badge" [ngClass]="getStatusClass(teacher.status)">
                      {{ teacher.status }}
                    </span>
                  </td>
                  <td data-label="Actions" class="text-right">
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
  styles: [
    `
      /* ========== Global Layout ========== */
      .teachers-page {
        display: flex;
        flex-direction: column;
        gap: 24px;
        padding: clamp(12px, 3vw, 24px);

        @media (max-width: 768px) {
          gap: 18px;
        }

        @media (max-width: 480px) {
          gap: 14px;
        }
      }

      /* ========== Page Header ========== */
      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 16px;
        flex-wrap: wrap;

        .header-left {
          flex: 1;
          min-width: 220px;

          h1 {
            margin: 0 0 4px;
            font-size: clamp(1.1rem, 3vw, 1.75rem);
            font-weight: 800;
            color: #0f172a;
            letter-spacing: -0.02em;
            word-break: break-word;
          }

          p {
            margin: 0;
            color: #64748b;
            font-size: clamp(0.8rem, 2.5vw, 0.95rem);
            font-weight: 500;
          }
        }

        .header-actions {
          display: flex;
          gap: 10px;
          flex-shrink: 0;
          align-items: center;

          @media (max-width: 600px) {
            width: 100%;
            justify-content: flex-end;
          }
        }
      }

      /* ========== Premium Buttons ========== */
      .btn {
        padding: 11px 18px;
        border-radius: 12px;
        font-weight: 600;
        font-size: 0.9rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        border: none;
        transition:
          transform 0.2s cubic-bezier(0.22, 1, 0.36, 1),
          box-shadow 0.2s ease,
          background-color 0.2s ease,
          border-color 0.2s ease,
          color 0.2s ease;
        position: relative;
        overflow: hidden;

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
          transition: left 0.4s ease;
        }

        i {
          font-size: 1rem;
          transition: transform 0.2s ease;
        }

        &.btn-primary {
          background: var(--primary-color);
          color: white;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);

          &:hover {
            transform: translateY(-3px) scale(1.02);
            box-shadow: 0 8px 20px rgba(37, 99, 235, 0.35);

            &::before {
              left: 100%;
            }
          }

          &:active {
            transform: translateY(-1px) scale(1);
          }
        }

        &.btn-outline {
          background: white;
          border: 2px solid rgba(226, 232, 240, 0.8);
          color: #475569;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);

          &:hover {
            transform: translateY(-3px) scale(1.02);
            background: var(--primary-color);
            border-color: var(--primary-color);
            color: #fff;
            box-shadow:
              0 10px 20px rgba(37, 99, 235, 0.2),
              0 4px 8px rgba(37, 99, 235, 0.1);

            &::before {
              left: 100%;
            }

            i {
              transform: rotate(6deg) scale(1.1);
            }
          }

          &:active {
            transform: translateY(-1px) scale(1);
            box-shadow: 0 4px 10px rgba(37, 99, 235, 0.15);
          }
        }
      }

      /* ========== Table Card ========== */
      .table-card {
        background: white;
        border-radius: 16px;
        border: 1px solid rgba(226, 232, 240, 0.9);
        box-shadow: 0 10px 30px rgba(2, 6, 23, 0.06);
        overflow: hidden;
        transition:
          box-shadow 0.25s ease,
          border-color 0.25s ease;

        &:hover {
          box-shadow: 0 14px 40px rgba(2, 6, 23, 0.08);
          border-color: rgba(59, 130, 246, 0.15);
        }
      }

      .table-header {
        padding: 20px 24px;
        border-bottom: 1px solid rgba(241, 245, 249, 0.9);
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 16px;
        background: rgba(248, 250, 252, 0.5);

        .search-container {
          position: relative;
          flex: 1;
          max-width: 400px;
          min-width: 220px;

          i {
            position: absolute;
            left: 16px;
            top: 50%;
            transform: translateY(-50%);
            color: #94a3b8;
            font-size: 0.9rem;
            transition: color 0.2s ease;
          }

          input {
            width: 100%;
            padding: 11px 16px 11px 42px;
            border-radius: 12px;
            border: 1px solid var(--border-color);
            background: white;
            outline: none;
            font-size: 0.9rem;
            color: #0f172a;
            transition: all 0.2s ease;

            &:focus {
              border-color: rgba(37, 99, 235, 0.6);
              box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
              background: white;

              & + i {
                color: var(--primary-color);
              }
            }

            &::placeholder {
              color: #94a3b8;
            }
          }
        }

        .header-extra {
          display: flex;
          gap: 10px;
          flex-shrink: 0;
        }
      }

      /* ========== Responsive Table ========== */
      .table-responsive {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
      }

      .pro-table {
        width: 100%;
        border-collapse: collapse;

        thead {
          th {
            padding: 14px 20px;
            background: rgba(148, 163, 184, 0.08);
            text-align: left;
            color: #475569;
            font-size: 0.8rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            border-bottom: 2px solid rgba(226, 232, 240, 0.8);
          }
        }

        tbody {
          tr {
            transition: background-color 0.15s ease;
            border-bottom: 1px solid rgba(241, 245, 249, 0.8);

            &:last-child {
              border-bottom: none;
            }

            &:hover {
              background: rgba(37, 99, 235, 0.03);
            }
          }

          td {
            padding: 18px 20px;
            vertical-align: middle;
            color: #334155;
            font-size: 0.9rem;
          }
        }
      }

      /* ========== Table Cells ========== */
      .teacher-identity {
        display: flex;
        align-items: center;
        gap: 14px;

        img {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          object-fit: cover;
          border: 2px solid rgba(255, 255, 255, 0.9);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
          background: #f1f5f9;
        }

        .name-info {
          display: flex;
          flex-direction: column;
          gap: 2px;

          .full-name {
            font-weight: 700;
            color: #0f172a;
            font-size: 0.95rem;
          }

          .email {
            font-size: 0.8rem;
            color: #64748b;
            font-weight: 500;
          }
        }
      }

      .matricule-badge {
        background: rgba(239, 246, 255, 0.8);
        color: #2563eb;
        padding: 5px 11px;
        border-radius: 8px;
        font-family: 'SF Mono', 'Fira Code', monospace;
        font-weight: 600;
        font-size: 0.85rem;
        border: 1px solid rgba(219, 228, 238, 0.7);
        letter-spacing: 0.02em;
      }

      .subjects-list {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }

      .subject-chip {
        background: rgba(241, 245, 249, 0.9);
        color: #334155;
        padding: 4px 10px;
        border-radius: 6px;
        font-size: 0.78rem;
        font-weight: 600;
        border: 1px solid rgba(226, 232, 240, 0.7);
        transition: all 0.15s ease;

        &:hover {
          background: rgba(37, 99, 235, 0.08);
          border-color: rgba(37, 99, 235, 0.3);
          color: #1e40af;
        }
      }

      .status-badge {
        padding: 5px 13px;
        border-radius: 999px;
        font-size: 0.78rem;
        font-weight: 700;
        letter-spacing: 0.02em;
        display: inline-flex;
        align-items: center;
        gap: 5px;

        &::before {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          display: inline-block;
        }

        &.status-active {
          background: rgba(220, 252, 231, 0.85);
          color: #166534;
          border: 1px solid rgba(187, 240, 208, 0.6);

          &::before {
            background: #22c55e;
            box-shadow: 0 0 8px rgba(34, 197, 94, 0.5);
          }
        }

        &.status-away {
          background: rgba(254, 249, 195, 0.85);
          color: #854d0e;
          border: 1px solid rgba(253, 230, 138, 0.6);

          &::before {
            background: #eab308;
            box-shadow: 0 0 8px rgba(234, 179, 8, 0.5);
          }
        }

        &.status-inactive {
          background: rgba(254, 226, 226, 0.85);
          color: #991b1b;
          border: 1px solid rgba(254, 202, 202, 0.6);

          &::before {
            background: #ef4444;
            box-shadow: 0 0 8px rgba(239, 68, 68, 0.5);
          }
        }
      }

      .action-buttons {
        display: flex;
        gap: 6px;
        justify-content: flex-end;

        button {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          background: white;
          color: #64748b;
          cursor: pointer;
          transition: all 0.15s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.95rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);

          &:hover {
            transform: translateY(-2px);
            background: #f8fafc;
            color: var(--primary-color);
            border-color: rgba(37, 99, 235, 0.5);
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
          }

          &.delete:hover {
            background: #fef2f2;
            color: #dc2626;
            border-color: rgba(220, 38, 38, 0.5);
            box-shadow: 0 4px 12px rgba(220, 38, 38, 0.2);
          }
        }
      }

      .text-right {
        text-align: right;
      }

      /* ========== Mobile Responsive ========== */
      @media (max-width: 768px) {
        .page-header {
          flex-direction: column;
          align-items: flex-start;
        }

        .table-header {
          .search-container {
            width: 100%;
            max-width: none;
          }

          .header-extra {
            width: 100%;
            justify-content: flex-end;
          }
        }

        .pro-table {
          thead {
            display: none;
          }

          tbody {
            tr {
              display: flex;
              flex-direction: column;
              gap: 12px;
              padding: 16px;
              border-bottom: 2px solid rgba(226, 232, 240, 0.6);
            }

            td {
              padding: 8px 0;
              display: flex;
              justify-content: space-between;
              align-items: center;

              &::before {
                content: attr(data-label);
                font-weight: 700;
                color: #64748b;
                font-size: 0.8rem;
                text-transform: uppercase;
              }
            }
          }
        }
      }
    `,
  ],
})
export class TeachersComponent implements OnInit {
  teachers: Teacher[] = [];
  filteredTeachers: Teacher[] = [];
  searchText: string = '';

  constructor(private teacherService: TeacherService) {}

  ngOnInit() {
    this.teacherService.getTeachers().subscribe((data) => {
      this.teachers = data;
      this.filteredTeachers = data;
    });
  }

  filterTeachers() {
    const text = this.searchText.toLowerCase();
    this.filteredTeachers = this.teachers.filter(
      (t) =>
        t.firstName.toLowerCase().includes(text) ||
        t.lastName.toLowerCase().includes(text) ||
        t.matricule.toLowerCase().includes(text) ||
        t.department.toLowerCase().includes(text),
    );
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'Actif':
        return 'status-active';
      case 'En congé':
        return 'status-away';
      case 'Inactif':
        return 'status-inactive';
      default:
        return '';
    }
  }
}
