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
          <div class="header-icon">
            <i class="pi pi-users"></i>
          </div>
          <div>
            <h1>Gestion des Enseignants</h1>
            <p>{{ teachers.length }} enseignants enregistrés dans le système</p>
          </div>
        </div>
        <div class="header-actions">
          <button class="btn btn-outline">
            <i class="pi pi-filter"></i> <span class="btn-text">Filtres</span>
          </button>
          <button class="btn btn-primary">
            <i class="pi pi-plus"></i> <span class="btn-text">Nouvel Enseignant</span>
          </button>
        </div>
      </div>

      <!-- STATS -->
      <div class="stats-grid">
        <div class="stat-card blue">
          <div class="stat-icon-wrap blue">
            <i class="pi pi-users"></i>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ teachers.length }}</span>
            <span class="stat-label">Total</span>
          </div>
        </div>
        <div class="stat-card green">
          <div class="stat-icon-wrap green">
            <i class="pi pi-check-circle"></i>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ activeCount }}</span>
            <span class="stat-label">Actifs</span>
          </div>
        </div>
        <div class="stat-card amber">
          <div class="stat-icon-wrap amber">
            <i class="pi pi-clock"></i>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ onLeaveCount }}</span>
            <span class="stat-label">En congé</span>
          </div>
        </div>
        <div class="stat-card red">
          <div class="stat-icon-wrap red">
            <i class="pi pi-ban"></i>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ inactiveCount }}</span>
            <span class="stat-label">Inactifs</span>
          </div>
        </div>
      </div>

      <!-- TABLE CARD (desktop) -->
      <div class="table-card">
        <div class="table-top">
          <div class="table-actions">
            <button class="btn btn-outline btn-sm">
              <i class="pi pi-download"></i> <span class="btn-text">Exporter</span>
            </button>
          </div>
        </div>

        <div class="table-scroll">
          <table class="pro-table">
            <thead>
              <tr>
                <th class="th-name">Enseignant</th>
                <th>Matière(s)</th>
                <th>Matricule</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th class="th-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (teacher of filteredTeachers; track teacher.id) {
                <tr class="teacher-row">
                  <td class="td-name">
                    <div class="teacher-identity">
                      <div class="avatar-circle" [style]="'background:' + getColor(teacher.id)">
                        {{ getInitials(teacher.firstName, teacher.lastName) }}
                      </div>
                      <div class="identity-text">
                        <span class="full-name"
                          >{{ teacher.firstName }} {{ teacher.lastName }}</span
                        >
                        <span class="address-line"
                          ><i class="pi pi-map-marker"></i> {{ teacher.adresse }}</span
                        >
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="chips">
                      @for (subject of teacher.subjects; track subject) {
                        <span class="chip">{{ subject }}</span>
                      }
                    </div>
                  </td>
                  <td>
                    <span class="matricule">{{ teacher.matricule }}</span>
                  </td>
                  <td>
                    <span class="contact-item"
                      ><i class="pi pi-envelope"></i> {{ teacher.email }}</span
                    >
                  </td>
                  <td>
                    <span class="contact-item"
                      ><i class="pi pi-phone"></i> {{ teacher.telephone }}</span
                    >
                  </td>
                  <td class="td-actions">
                    <div class="actions">
                      <button class="action-btn" title="Modifier">
                        <i class="pi pi-pencil"></i>
                      </button>
                      <button class="action-btn" title="Statistiques">
                        <i class="pi pi-chart-line"></i>
                      </button>
                      <button class="action-btn danger" title="Supprimer">
                        <i class="pi pi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        @if (filteredTeachers.length === 0) {
          <div class="empty-state">
            <div class="empty-icon"><i class="pi pi-search"></i></div>
            <h3>Aucun enseignant trouvé</h3>
            <p>Essayez de modifier vos critères de recherche</p>
          </div>
        }
      </div>

      <!-- MOBILE CARDS (visible on small screens only) -->
      <div class="mobile-cards">
        @for (teacher of filteredTeachers; track teacher.id) {
          <div class="teacher-card" [style]="'--accent:' + getColor(teacher.id)">
            <div class="card-top">
              <div class="card-avatar" [style]="'background:' + getColor(teacher.id)">
                {{ getInitials(teacher.firstName, teacher.lastName) }}
              </div>
              <div class="card-identity">
                <span class="card-name">{{ teacher.firstName }} {{ teacher.lastName }}</span>
                <span class="card-matricule">{{ teacher.matricule }}</span>
              </div>
            </div>
            <div class="card-body">
              <div class="card-info-row">
                <i class="pi pi-bookmark"></i>
                <div class="chips-mobile">
                  @for (subject of teacher.subjects; track subject) {
                    <span class="chip-mobile">{{ subject }}</span>
                  }
                </div>
              </div>
              <div class="card-info-row">
                <i class="pi pi-envelope"></i>
                <span>{{ teacher.email }}</span>
              </div>
              <div class="card-info-row">
                <i class="pi pi-phone"></i>
                <span>{{ teacher.telephone }}</span>
              </div>
              <div class="card-info-row">
                <i class="pi pi-map-marker"></i>
                <span>{{ teacher.adresse }}</span>
              </div>
            </div>
            <div class="card-actions">
              <button class="card-action-btn"><i class="pi pi-pencil"></i></button>
              <button class="card-action-btn"><i class="pi pi-chart-line"></i></button>
              <button class="card-action-btn danger"><i class="pi pi-trash"></i></button>
            </div>
          </div>
        }

        @if (filteredTeachers.length === 0) {
          <div class="empty-state">
            <div class="empty-icon"><i class="pi pi-search"></i></div>
            <h3>Aucun enseignant trouvé</h3>
            <p>Essayez de modifier vos critères de recherche</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .teachers-page {
        display: flex;
        flex-direction: column;
        gap: 28px;
      }

      /* ===== HEADER ===== */
      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
        flex-wrap: wrap;

        .header-left {
          display: flex;
          align-items: center;
          gap: 18px;
          flex: 1;
          min-width: 0;

          .header-icon {
            width: 56px;
            height: 56px;
            border-radius: 16px;
            background: linear-gradient(135deg, rgba(37, 99, 235, 0.12), rgba(59, 130, 246, 0.06));
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;

            i {
              font-size: 1.5rem;
              color: var(--primary-color);
            }
          }

          h1 {
            margin: 0;
            font-size: 2rem;
            font-weight: 800;
            color: #0f172a;
            letter-spacing: -0.02em;
          }

          p {
            margin: 6px 0 0;
            color: #64748b;
            font-size: 1rem;
            font-weight: 500;
          }
        }

        .header-actions {
          display: flex;
          gap: 12px;
          flex-shrink: 0;
        }
      }

      /* ===== BUTTONS ===== */
      .btn {
        padding: 12px 22px;
        border-radius: 14px;
        font-weight: 600;
        font-size: 0.95rem;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        border: none;
        transition: all 0.2s ease;

        i {
          font-size: 1rem;
        }

        &.btn-primary {
          background: var(--primary-color);
          color: white;
          box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);

          &:hover {
            background: #1e40af;
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(37, 99, 235, 0.35);
          }
        }

        &.btn-outline {
          background: white;
          border: 1.5px solid rgba(226, 232, 240, 0.9);
          color: #475569;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);

          &:hover {
            border-color: var(--primary-color);
            color: var(--primary-color);
            background: rgba(37, 99, 235, 0.04);
          }
        }

        &.btn-sm {
          padding: 10px 16px;
          font-size: 0.88rem;

          i {
            font-size: 0.9rem;
          }
        }
      }

      @media (max-width: 640px) {
        .btn .btn-text {
          display: none;
        }
        .btn {
          padding: 12px 14px;
        }
      }

      /* ===== STATS GRID ===== */
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 18px;

        @media (max-width: 1024px) {
          grid-template-columns: repeat(2, 1fr);
        }

        @media (max-width: 480px) {
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
      }

      .stat-card {
        background: white;
        border-radius: 18px;
        border: 2px solid rgba(226, 232, 240, 0.8);
        padding: 24px 28px;
        display: flex;
        align-items: center;
        gap: 16px;
        transition: all 0.25s ease;
        position: relative;
        overflow: hidden;

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: var(--accent, var(--primary-color));
          border-radius: 4px 0 0 4px;
          transform: scaleY(0);
          transition: transform 0.3s ease;
        }

        &.active {
          border-color: rgba(37, 99, 235, 0.3);
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        &:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 28px rgba(2, 6, 23, 0.08);

          &::before {
            transform: scaleY(1);
          }
        }

        &.blue {
          --accent: #3b82f6;
          .stat-value {
            color: #1d4ed8;
          }
        }
        &.green {
          --accent: #22c55e;
          .stat-value {
            color: #166534;
          }
        }
        &.amber {
          --accent: #f59e0b;
          .stat-value {
            color: #92400e;
          }
        }
        &.red {
          --accent: #ef4444;
          .stat-value {
            color: #991b1b;
          }
        }

        .stat-icon-wrap {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.35rem;
          flex-shrink: 0;
          transition: transform 0.2s ease;

          &.blue {
            background: rgba(219, 234, 254, 0.8);
            color: #1d4ed8;
          }
          &.green {
            background: rgba(220, 252, 231, 0.8);
            color: #166534;
          }
          &.amber {
            background: rgba(254, 249, 195, 0.8);
            color: #92400e;
          }
          &.red {
            background: rgba(254, 226, 226, 0.8);
            color: #991b1b;
          }
        }

        &:hover .stat-icon-wrap {
          transform: scale(1.08);
        }

        .stat-info {
          display: flex;
          flex-direction: column;

          .stat-value {
            font-size: 1.85rem;
            font-weight: 800;
            line-height: 1;
          }

          .stat-label {
            font-size: 0.85rem;
            color: #64748b;
            font-weight: 600;
            margin-top: 4px;
          }
        }
      }

      /* ===== TABLE CARD ===== */
      .table-card {
        background: white;
        border-radius: 18px;
        border: 1px solid rgba(226, 232, 240, 0.9);
        box-shadow: 0 4px 16px rgba(2, 6, 23, 0.04);
        overflow: hidden;

        @media (max-width: 768px) {
          display: none;
        }
      }

      .mobile-cards {
        display: none;

        @media (max-width: 768px) {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
      }

      .table-top {
        padding: 18px 28px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        border-bottom: 1px solid rgba(241, 245, 249, 0.9);
        background: rgba(248, 250, 252, 0.5);

        .table-actions {
          display: flex;
          gap: 10px;
        }
      }

      /* ===== TABLE ===== */
      .table-scroll {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
      }

      .pro-table {
        width: 100%;
        border-collapse: collapse;
        min-width: 1100px;

        thead th {
          padding: 16px 24px;
          background: rgba(248, 250, 252, 0.9);
          text-align: left;
          color: #475569;
          font-size: 0.82rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          border-bottom: 2px solid rgba(226, 232, 240, 0.8);
          position: sticky;
          top: 0;
          z-index: 2;
          white-space: nowrap;
        }

        tbody tr {
          transition: all 0.15s ease;
          border-bottom: 1px solid rgba(241, 245, 249, 0.9);

          &:last-child {
            border-bottom: none;
          }

          &:hover {
            background: rgba(37, 99, 235, 0.03);
          }
        }

        tbody td {
          padding: 18px 24px;
          vertical-align: middle;
          color: #334155;
          font-size: 0.92rem;
          white-space: nowrap;
        }
      }

      /* ===== TEACHER IDENTITY (avatar + name) ===== */
      .teacher-identity {
        display: flex;
        align-items: center;
        gap: 14px;
      }

      .avatar-circle {
        width: 44px;
        height: 44px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 800;
        font-size: 0.88rem;
        flex-shrink: 0;
        letter-spacing: 0.02em;
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.12);
      }

      .identity-text {
        display: flex;
        flex-direction: column;
        gap: 3px;

        .full-name {
          font-weight: 700;
          color: #0f172a;
          font-size: 0.95rem;
        }

        .address-line {
          font-size: 0.8rem;
          color: #94a3b8;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 4px;

          i {
            font-size: 0.75rem;
          }
        }
      }

      /* ===== STATUS BADGES ===== */
      .status-badge {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        padding: 6px 14px;
        border-radius: 999px;
        font-size: 0.82rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.02em;
        border: 1px solid;
        white-space: nowrap;

        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          display: inline-block;
        }

        &.status-active {
          background: rgba(220, 252, 231, 0.85);
          color: #166534;
          border-color: rgba(34, 197, 94, 0.4);

          .status-dot {
            background: #22c55e;
            box-shadow: 0 0 6px rgba(34, 197, 94, 0.5);
          }
        }

        &.status-away {
          background: rgba(254, 243, 199, 0.85);
          color: #92400e;
          border-color: rgba(245, 158, 11, 0.4);

          .status-dot {
            background: #f59e0b;
            box-shadow: 0 0 6px rgba(245, 158, 11, 0.5);
          }
        }

        &.status-inactive {
          background: rgba(254, 226, 226, 0.85);
          color: #991b1b;
          border-color: rgba(239, 68, 68, 0.4);

          .status-dot {
            background: #ef4444;
            box-shadow: 0 0 6px rgba(239, 68, 68, 0.5);
          }
        }
      }

      /* ===== MATRICULE ===== */
      .matricule {
        background: rgba(219, 234, 254, 0.6);
        color: #1d4ed8;
        padding: 5px 12px;
        border-radius: 8px;
        font-family: 'SF Mono', 'Fira Code', monospace;
        font-weight: 700;
        font-size: 0.84rem;
        border: 1px solid rgba(191, 219, 254, 0.5);
        display: inline-block;
      }

      /* ===== CONTACT ===== */
      .contact-item {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-size: 0.92rem;
        color: #334155;
        font-weight: 500;
        background: rgba(248, 250, 252, 0.8);
        padding: 6px 14px;
        border-radius: 8px;
        border: 1px solid rgba(226, 232, 240, 0.7);
        transition: all 0.15s ease;

        &:hover {
          background: rgba(219, 234, 254, 0.3);
          border-color: rgba(37, 99, 235, 0.2);
          color: #1d4ed8;
        }

        i {
          font-size: 0.9rem;
          color: var(--primary-color);
          flex-shrink: 0;
        }
      }

      /* ===== CHIPS ===== */
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }

      .chip {
        background: rgba(219, 234, 254, 0.6);
        color: #1d4ed8;
        padding: 4px 12px;
        border-radius: 8px;
        font-size: 0.78rem;
        font-weight: 700;
        border: 1px solid rgba(191, 219, 254, 0.6);
        transition: all 0.15s ease;
        white-space: nowrap;

        &:hover {
          background: rgba(37, 99, 235, 0.1);
          border-color: rgba(37, 99, 235, 0.3);
        }
      }

      /* ===== ACTION BUTTONS ===== */
      .text-right {
        text-align: right;
      }

      .actions {
        display: flex;
        gap: 8px;
        justify-content: flex-end;

        .action-btn {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          background: white;
          color: #64748b;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.95rem;
          transition: all 0.15s ease;

          &:hover {
            transform: translateY(-2px);
            color: var(--primary-color);
            border-color: rgba(37, 99, 235, 0.4);
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.12);
          }

          &.danger:hover {
            background: rgba(254, 226, 226, 0.8);
            color: #dc2626;
            border-color: rgba(220, 38, 38, 0.4);
            box-shadow: 0 4px 12px rgba(220, 38, 38, 0.12);
          }
        }
      }

      /* ===== MOBILE CARDS ===== */
      .teacher-card {
        background: white;
        border-radius: 16px;
        border: 1px solid rgba(226, 232, 240, 0.9);
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(2, 6, 23, 0.04);
        transition: all 0.2s ease;

        &:hover {
          box-shadow: 0 8px 20px rgba(2, 6, 23, 0.08);
          transform: translateY(-2px);
        }

        .card-top {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 18px 18px 14px;
          border-bottom: 1px solid rgba(241, 245, 249, 0.9);

          .card-avatar {
            width: 48px;
            height: 48px;
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 800;
            font-size: 0.92rem;
            flex-shrink: 0;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
          }

          .card-identity {
            flex: 1;
            min-width: 0;

            .card-name {
              display: block;
              font-weight: 700;
              color: #0f172a;
              font-size: 1rem;
              line-height: 1.3;
            }

            .card-matricule {
              display: block;
              font-size: 0.78rem;
              color: #64748b;
              font-weight: 600;
              font-family: 'SF Mono', 'Fira Code', monospace;
              margin-top: 2px;
            }
          }

          .status-badge-mobile {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            padding: 4px 10px;
            border-radius: 999px;
            font-size: 0.72rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.02em;
            border: 1px solid;
            white-space: nowrap;
            flex-shrink: 0;

            .status-dot {
              width: 6px;
              height: 6px;
              border-radius: 50%;
              display: inline-block;
            }

            &.status-active {
              background: rgba(220, 252, 231, 0.85);
              color: #166534;
              border-color: rgba(34, 197, 94, 0.4);
              .status-dot {
                background: #22c55e;
              }
            }
            &.status-away {
              background: rgba(254, 243, 199, 0.85);
              color: #92400e;
              border-color: rgba(245, 158, 11, 0.4);
              .status-dot {
                background: #f59e0b;
              }
            }
            &.status-inactive {
              background: rgba(254, 226, 226, 0.85);
              color: #991b1b;
              border-color: rgba(239, 68, 68, 0.4);
              .status-dot {
                background: #ef4444;
              }
            }
          }
        }

        .card-body {
          padding: 14px 18px;
          display: flex;
          flex-direction: column;
          gap: 10px;

          .card-info-row {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            font-size: 0.88rem;
            color: #475569;

            i {
              color: #94a3b8;
              font-size: 0.9rem;
              margin-top: 2px;
              flex-shrink: 0;
            }

            span {
              line-height: 1.4;
            }

            .chips-mobile {
              display: flex;
              flex-wrap: wrap;
              gap: 5px;
            }
          }

          .chip-mobile {
            background: rgba(219, 234, 254, 0.6);
            color: #1d4ed8;
            padding: 3px 10px;
            border-radius: 6px;
            font-size: 0.74rem;
            font-weight: 700;
            border: 1px solid rgba(191, 219, 254, 0.5);
          }
        }

        .card-actions {
          display: flex;
          gap: 0;
          border-top: 1px solid rgba(241, 245, 249, 0.9);

          .card-action-btn {
            flex: 1;
            padding: 13px;
            background: white;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1rem;
            color: #64748b;
            transition: all 0.15s ease;

            &:not(:last-child) {
              border-right: 1px solid rgba(241, 245, 249, 0.9);
            }

            &:hover {
              background: rgba(37, 99, 235, 0.04);
              color: var(--primary-color);
            }

            &.danger:hover {
              background: rgba(254, 226, 226, 0.5);
              color: #dc2626;
            }
          }
        }
      }

      /* ===== EMPTY STATE ===== */
      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 60px 24px;
        text-align: center;

        .empty-icon {
          width: 80px;
          height: 80px;
          border-radius: 22px;
          background: rgba(241, 245, 249, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;

          i {
            font-size: 2rem;
            color: #94a3b8;
          }
        }

        h3 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #334155;
          margin: 0 0 6px;
        }

        p {
          font-size: 0.9rem;
          color: #94a3b8;
          margin: 0;
        }
      }

      /* ===== RESPONSIVE ===== */
      @media (max-width: 1024px) {
        .stats-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      @media (max-width: 768px) {
        .table-top {
          flex-direction: column;
          align-items: stretch;

          .search-wrap {
            max-width: 100%;
          }
        }

        .page-header {
          flex-direction: column;
          align-items: flex-start;
        }
      }

      @media (max-width: 480px) {
        .stats-grid {
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .stat-card {
          padding: 18px 16px;

          .stat-icon-wrap {
            width: 44px;
            height: 44px;
            font-size: 1.15rem;
          }

          .stat-info .stat-value {
            font-size: 1.4rem;
          }
        }

        .page-header .header-left {
          h1 {
            font-size: 1.4rem;
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
  activeFilter: string = 'all';
  activeCount: number = 0;
  onLeaveCount: number = 0;
  inactiveCount: number = 0;

  constructor(private teacherService: TeacherService) {}

  ngOnInit() {
    this.teacherService.getTeachers().subscribe((data) => {
      this.teachers = data;
      this.filteredTeachers = data;
      this.activeCount = this.teachers.filter((t) => t.status === 'Actif').length;
      this.onLeaveCount = this.teachers.filter((t) => t.status === 'En congé').length;
      this.inactiveCount = this.teachers.filter((t) => t.status === 'Inactif').length;
    });
  }

  filterTeachers() {
    const text = this.searchText.toLowerCase();
    let result = this.teachers;

    if (this.activeFilter !== 'all') {
      result = result.filter((t) => t.status === this.activeFilter);
    }

    if (text) {
      result = result.filter(
        (t) =>
          t.firstName.toLowerCase().includes(text) ||
          t.lastName.toLowerCase().includes(text) ||
          t.matricule.toLowerCase().includes(text) ||
          t.email.toLowerCase().includes(text) ||
          t.telephone.toLowerCase().includes(text) ||
          t.adresse.toLowerCase().includes(text),
      );
    }

    this.filteredTeachers = result;
  }

  filterByStatus(status: string) {
    this.activeFilter = status;
    this.filterTeachers();
  }

  clearSearch() {
    this.searchText = '';
    this.filterTeachers();
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

  getInitials(firstName: string, lastName: string): string {
    return (firstName[0] + lastName[0]).toUpperCase();
  }

  getColor(id: number): string {
    const colors = [
      'linear-gradient(135deg, #3b82f6, #2563eb)',
      'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      'linear-gradient(135deg, #ec4899, #db2777)',
      'linear-gradient(135deg, #f59e0b, #d97706)',
      'linear-gradient(135deg, #22c55e, #16a34a)',
      'linear-gradient(135deg, #06b6d4, #0891b2)',
      'linear-gradient(135deg, #f97316, #ea580c)',
      'linear-gradient(135deg, #6366f1, #4f46e5)',
    ];
    return colors[id % colors.length];
  }
}
