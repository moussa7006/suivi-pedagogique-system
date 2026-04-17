import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedagogyService } from '../../core/services/pedagogy.service';
import { ExportService } from '../../core/services/export.service';
import { LessonLog } from '../../core/models/lesson-log.model';

@Component({
  selector: 'app-pedagogy',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="pedagogy-container">
      <!-- ════════════════════════════════════════ -->
      <!-- HEADER                                    -->
      <!-- ════════════════════════════════════════ -->
      <div class="page-header">
        <div class="header-left">
          <h1><i class="pi pi-book"></i> Cahier de Texte</h1>
          <p>Gérez et validez les séances pédagogiques</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-outline" (click)="exportPdf()">
            <i class="pi pi-file-pdf"></i> PDF
          </button>
          <button class="btn btn-outline" (click)="exportExcel()">
            <i class="pi pi-file-excel"></i> Excel
          </button>
          <button class="btn btn-primary" (click)="openAddModal()">
            <i class="pi pi-plus"></i> Nouvelle séance
          </button>
        </div>
      </div>

      <!-- ════════════════════════════════════════ -->
      <!-- STATS                                     -->
      <!-- ════════════════════════════════════════ -->
      <div class="stats-summary">
        <div
          class="summary-card total"
          (click)="filterByStatus('all')"
          [class.active]="activeFilter === 'all'"
        >
          <div class="stat-icon blue">
            <i class="pi pi-book"></i>
          </div>
          <div class="stat-content">
            <span class="value">{{ stats.total }}</span>
            <span class="label">Total Séances</span>
          </div>
        </div>
        <div
          class="summary-card warning"
          (click)="filterByStatus('En attente')"
          [class.active]="activeFilter === 'En attente'"
        >
          <div class="stat-icon orange">
            <i class="pi pi-clock"></i>
          </div>
          <div class="stat-content">
            <span class="value">{{ stats.enAttente }}</span>
            <span class="label">En attente</span>
          </div>
        </div>
        <div
          class="summary-card success"
          (click)="filterByStatus('Validé')"
          [class.active]="activeFilter === 'Validé'"
        >
          <div class="stat-icon green">
            <i class="pi pi-check-circle"></i>
          </div>
          <div class="stat-content">
            <span class="value">{{ stats.valide }}</span>
            <span class="label">Validées</span>
          </div>
        </div>
        <div
          class="summary-card danger"
          (click)="filterByStatus('Rejeté')"
          [class.active]="activeFilter === 'Rejeté'"
        >
          <div class="stat-icon red">
            <i class="pi pi-times-circle"></i>
          </div>
          <div class="stat-content">
            <span class="value">{{ stats.rejete }}</span>
            <span class="label">Rejetées</span>
          </div>
        </div>
      </div>

      <!-- ════════════════════════════════════════ -->
      <!-- SEARCH BAR                                -->
      <!-- ════════════════════════════════════════ -->
      <div class="search-bar">
        <div class="search-input-wrapper">
          <i class="pi pi-search"></i>
          <input
            type="text"
            placeholder="Rechercher par titre, contenu, enseignant..."
            [(ngModel)]="searchTerm"
            (input)="onSearch()"
          />
          @if (searchTerm) {
            <button class="clear-btn" (click)="clearSearch()">
              <i class="pi pi-times"></i>
            </button>
          }
        </div>
      </div>

      <!-- ════════════════════════════════════════ -->
      <!-- TABLE VIEW                                -->
      <!-- ════════════════════════════════════════ -->
      <div class="table-card">
        @if (filteredLogs.length === 0) {
          <div class="empty-state">
            <div class="empty-icon">
              <i class="pi pi-inbox"></i>
            </div>
            <h3 class="empty-title">Aucune séance trouvée</h3>
            <p class="empty-desc">
              {{
                searchTerm
                  ? 'Aucun résultat pour "' + searchTerm + '"'
                  : 'Aucune séance enregistrée pour le moment.'
              }}
            </p>
            @if (!searchTerm) {
              <button class="btn btn-primary empty-action" (click)="openAddModal()">
                <i class="pi pi-plus"></i> Ajouter une séance
              </button>
            }
          </div>
        } @else {
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th class="col-id">ID</th>
                  <th class="col-title">Titre du Cours</th>
                  <th class="col-contenu">Contenu</th>
                  <th class="col-date">Date de Création</th>
                  <th class="col-teacher">Enseignant</th>
                  <th class="col-subject">Matière</th>
                  <th class="col-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (log of filteredLogs; track log.id) {
                  <tr class="table-row" (click)="openDetailModal(log)">
                    <td class="col-id">
                      <span class="id-badge">#{{ log.id }}</span>
                    </td>
                    <td class="col-title">
                      <span class="title-text">{{ log.titleCours }}</span>
                    </td>
                    <td class="col-contenu">
                      <span class="contenu-text" [title]="log.contenu">{{
                        truncateText(log.contenu, 80)
                      }}</span>
                    </td>
                    <td class="col-date">
                      <span class="date-text">
                        <i class="pi pi-calendar"></i>
                        {{ formatDate(log.dateDeCreation) }}
                      </span>
                    </td>
                    <td class="col-teacher">
                      <span class="teacher-text">{{ log.teacherName }}</span>
                    </td>
                    <td class="col-subject">
                      <span class="subject-chip">{{ log.subject }}</span>
                    </td>
                    <td class="col-actions">
                      <div class="action-buttons" (click)="$event.stopPropagation()">
                        <button
                          class="icon-btn view"
                          (click)="openDetailModal(log)"
                          title="Voir détails"
                        >
                          <i class="pi pi-eye"></i>
                        </button>
                        <button
                          class="icon-btn pdf"
                          (click)="exportSinglePdf(log)"
                          title="Exporter PDF"
                        >
                          <i class="pi pi-file-pdf"></i>
                        </button>
                        <button class="icon-btn delete" (click)="deleteLog(log)" title="Supprimer">
                          <i class="pi pi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>

      <!-- ════════════════════════════════════════ -->
      <!-- ADD MODAL                                 -->
      <!-- ════════════════════════════════════════ -->
      @if (showAddModal) {
        <div class="modal-overlay" (click)="closeAddModal()">
          <div class="modal-container" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2><i class="pi pi-plus-circle"></i> Nouvelle Séance</h2>
              <button class="modal-close" (click)="closeAddModal()">
                <i class="pi pi-times"></i>
              </button>
            </div>
            <div class="modal-body">
              <div class="form-grid">
                <div class="form-group full-width">
                  <label for="addTitle">Titre du Cours <span class="required">*</span></label>
                  <input
                    id="addTitle"
                    type="text"
                    placeholder="Ex: Les Arbres Binaires de Recherche"
                    [(ngModel)]="newLog.titleCours"
                    [class.invalid]="addErrors['titleCours']"
                  />
                  @if (addErrors['titleCours']) {
                    <span class="error-msg">{{ addErrors['titleCours'] }}</span>
                  }
                </div>

                <div class="form-group">
                  <label for="addTeacher">Enseignant <span class="required">*</span></label>
                  <input
                    id="addTeacher"
                    type="text"
                    placeholder="Ex: Dr. Alou Diarra"
                    [(ngModel)]="newLog.teacherName"
                    [class.invalid]="addErrors['teacherName']"
                  />
                  @if (addErrors['teacherName']) {
                    <span class="error-msg">{{ addErrors['teacherName'] }}</span>
                  }
                </div>

                <div class="form-group">
                  <label for="addSubject">Matière <span class="required">*</span></label>
                  <input
                    id="addSubject"
                    type="text"
                    placeholder="Ex: Algorithmique"
                    [(ngModel)]="newLog.subject"
                    [class.invalid]="addErrors['subject']"
                  />
                  @if (addErrors['subject']) {
                    <span class="error-msg">{{ addErrors['subject'] }}</span>
                  }
                </div>

                <div class="form-group full-width">
                  <label for="addContenu">Contenu <span class="required">*</span></label>
                  <textarea
                    id="addContenu"
                    rows="5"
                    placeholder="Décrivez le contenu de la séance..."
                    [(ngModel)]="newLog.contenu"
                    [class.invalid]="addErrors['contenu']"
                  ></textarea>
                  @if (addErrors['contenu']) {
                    <span class="error-msg">{{ addErrors['contenu'] }}</span>
                  }
                </div>

                <div class="form-group">
                  <label for="addDate">Date de Création</label>
                  <input id="addDate" type="date" [(ngModel)]="newLog.dateDeCreation" />
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-outline" (click)="closeAddModal()">Annuler</button>
              <button class="btn btn-primary" (click)="addLessonLog()">
                <i class="pi pi-check"></i> Enregistrer
              </button>
            </div>
          </div>
        </div>
      }

      <!-- ════════════════════════════════════════ -->
      <!-- DETAIL MODAL                              -->
      <!-- ════════════════════════════════════════ -->
      @if (showDetailModal && selectedLog) {
        <div class="modal-overlay" (click)="closeDetailModal()">
          <div class="modal-container detail-modal" (click)="$event.stopPropagation()">
            <div class="modal-header detail-header">
              <div class="detail-title-row">
                <span class="detail-id-badge">#{{ selectedLog.id }}</span>
                <h2>{{ selectedLog.titleCours }}</h2>
              </div>
              <div class="detail-header-actions">
                <button class="modal-close" (click)="closeDetailModal()">
                  <i class="pi pi-times"></i>
                </button>
              </div>
            </div>
            <div class="modal-body detail-body">
              <div class="detail-meta-grid">
                <div class="detail-field">
                  <div class="field-icon"><i class="pi pi-calendar"></i></div>
                  <div>
                    <span class="field-label">Date de Création</span>
                    <span class="field-value">{{ formatDate(selectedLog.dateDeCreation) }}</span>
                  </div>
                </div>
                <div class="detail-field">
                  <div class="field-icon"><i class="pi pi-user"></i></div>
                  <div>
                    <span class="field-label">Enseignant</span>
                    <span class="field-value">{{ selectedLog.teacherName }}</span>
                  </div>
                </div>
                <div class="detail-field">
                  <div class="field-icon"><i class="pi pi-bookmark"></i></div>
                  <div>
                    <span class="field-label">Matière</span>
                    <span class="field-value">{{ selectedLog.subject }}</span>
                  </div>
                </div>
              </div>

              <div class="detail-section">
                <h3><i class="pi pi-align-left"></i> Contenu</h3>
                <div class="contenu-block">{{ selectedLog.contenu }}</div>
              </div>

              @if (selectedLog.comments) {
                <div class="detail-section">
                  <h3><i class="pi pi-comment"></i> Commentaires</h3>
                  <div class="comments-block">{{ selectedLog.comments }}</div>
                </div>
              }
            </div>
            <div class="modal-footer detail-footer">
              <button class="btn btn-outline" (click)="exportSinglePdf(selectedLog)">
                <i class="pi pi-file-pdf"></i> Exporter PDF
              </button>
              <button class="modal-close-bottom" (click)="closeDetailModal()">Fermer</button>
            </div>
          </div>
        </div>
      }

      <!-- ════════════════════════════════════════ -->
      <!-- TOAST NOTIFICATION                        -->
      <!-- ════════════════════════════════════════ -->
      @if (toastMessage) {
        <div class="toast" [ngClass]="toastType">
          <i class="pi" [ngClass]="getToastIcon()"></i>
          <span>{{ toastMessage }}</span>
          <button class="toast-close" (click)="toastMessage = null">
            <i class="pi pi-times"></i>
          </button>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .pedagogy-container {
        display: flex;
        flex-direction: column;
        gap: 28px;
      }

      /* ════════════════════════════════════════
         HEADER
         ════════════════════════════════════════ */
      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 16px;

        .header-left {
          h1 {
            margin: 0;
            font-size: 2rem;
            font-weight: 800;
            color: #0f172a;
            letter-spacing: -0.02em;
            display: flex;
            align-items: center;
            gap: 14px;

            i {
              color: var(--primary-color);
              font-size: 1.3rem;
            }
          }

          p {
            color: #64748b;
            margin: 6px 0 0;
            font-size: 1.02rem;
            font-weight: 500;
          }
        }

        .header-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
      }

      /* ════════════════════════════════════════
         BUTTONS
         ════════════════════════════════════════ */
      .btn {
        padding: 12px 20px;
        border-radius: 14px;
        font-weight: 600;
        font-size: 0.95rem;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        border: none;
        transition: all 0.2s ease;
        white-space: nowrap;

        i {
          font-size: 1rem;
        }

        &.btn-primary {
          background: var(--primary-color);
          color: white;
          box-shadow: 0 4px 12px rgba(29, 78, 216, 0.3);

          &:hover {
            background: #1e40af;
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(29, 78, 216, 0.4);
          }
        }

        &.btn-outline {
          background: white;
          border: 1px solid var(--border-color);
          color: #475569;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);

          &:hover {
            background: #f8fafc;
            border-color: #cbd5e1;
            transform: translateY(-1px);
          }
        }

        &.btn-approve {
          background: rgba(220, 252, 231, 0.9);
          color: #166534;
          border: 1px solid rgba(34, 197, 94, 0.3);

          &:hover {
            background: #22c55e;
            color: white;
            transform: translateY(-1px);
            box-shadow: 0 6px 16px rgba(34, 197, 94, 0.35);
          }
        }

        &.btn-reject {
          background: rgba(254, 226, 226, 0.9);
          color: #b91c1c;
          border: 1px solid rgba(239, 68, 68, 0.3);

          &:hover {
            background: #ef4444;
            color: white;
            transform: translateY(-1px);
            box-shadow: 0 6px 16px rgba(239, 68, 68, 0.35);
          }
        }

        &.btn-danger {
          background: #ef4444;
          color: white;
          border: 1px solid #dc2626;

          &:hover {
            background: #dc2626;
            transform: translateY(-1px);
            box-shadow: 0 6px 16px rgba(239, 68, 68, 0.35);
          }
        }
      }

      /* ════════════════════════════════════════
         STATS SUMMARY
         ════════════════════════════════════════ */
      .stats-summary {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 18px;

        @media (max-width: 1024px) {
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        @media (max-width: 480px) {
          grid-template-columns: 1fr;
          gap: 12px;
        }

        .summary-card {
          background: white;
          padding: 24px 28px;
          border-radius: 16px;
          border: 1px solid rgba(226, 232, 240, 0.9);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
          display: flex;
          align-items: center;
          gap: 16px;
          cursor: pointer;
          transition: all 0.2s ease;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
          }

          &.active {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.15);
          }

          .stat-icon {
            width: 52px;
            height: 52px;
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            flex-shrink: 0;

            &.blue {
              background: rgba(219, 234, 254, 0.8);
              color: #1d4ed8;
            }

            &.orange {
              background: rgba(254, 237, 195, 0.8);
              color: #b45309;
            }

            &.green {
              background: rgba(220, 252, 231, 0.8);
              color: #166534;
            }

            &.red {
              background: rgba(254, 226, 226, 0.8);
              color: #b91c1c;
            }
          }

          .stat-content {
            display: flex;
            flex-direction: column;

            .value {
              font-size: 1.85rem;
              font-weight: 800;
              color: #0f172a;
              line-height: 1;
            }

            .label {
              font-size: 0.85rem;
              color: #64748b;
              font-weight: 600;
              margin-top: 4px;
            }
          }

          &.warning .value {
            color: #b45309;
          }

          &.success .value {
            color: #166534;
          }

          &.danger .value {
            color: #b91c1c;
          }
        }
      }

      /* ════════════════════════════════════════
         SEARCH BAR
         ════════════════════════════════════════ */
      .search-bar {
        .search-input-wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
          background: white;
          border: 1px solid var(--border-color);
          padding: 12px 18px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
          transition: all 0.2s;

          i.pi-search {
            color: #94a3b8;
            font-size: 1rem;
          }

          input {
            flex: 1;
            border: none;
            background: transparent;
            outline: none;
            font-size: 0.92rem;
            font-weight: 500;
            color: #0f172a;

            &::placeholder {
              color: #94a3b8;
            }
          }

          &:focus-within {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 4px rgba(29, 78, 216, 0.1);
          }

          .clear-btn {
            background: none;
            border: none;
            cursor: pointer;
            color: #94a3b8;
            padding: 4px;
            border-radius: 6px;

            &:hover {
              background: #f1f5f9;
              color: #475569;
            }
          }
        }
      }

      /* ════════════════════════════════════════
         TABLE CARD
         ════════════════════════════════════════ */
      .table-card {
        background: white;
        border-radius: 16px;
        border: 1px solid rgba(226, 232, 240, 0.9);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
        overflow: hidden;
      }

      .data-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.88rem;

        thead th {
          background: #f8fafc;
          color: #475569;
          font-weight: 700;
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          padding: 14px 16px;
          border-bottom: 2px solid #e2e8f0;
          text-align: left;
          white-space: nowrap;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        tbody tr {
          transition: all 0.15s ease;
          cursor: pointer;

          &:hover {
            background: rgba(29, 78, 216, 0.03);
          }

          &:not(:last-child) td {
            border-bottom: 1px solid rgba(241, 245, 249, 0.9);
          }
        }

        td {
          padding: 14px 16px;
          vertical-align: middle;
        }
      }

      /* Table cell styles */
      .col-id {
        width: 70px;
      }

      .id-badge {
        font-weight: 700;
        color: var(--primary-color);
        font-size: 0.82rem;
        background: rgba(29, 78, 216, 0.08);
        padding: 4px 10px;
        border-radius: 6px;
      }

      .col-title {
        min-width: 200px;
      }

      .title-text {
        font-weight: 700;
        color: #0f172a;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .col-contenu {
        min-width: 180px;
        max-width: 260px;
      }

      .contenu-text {
        color: #475569;
        line-height: 1.5;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        font-size: 0.85rem;
      }

      .col-date {
        width: 140px;
      }

      .date-text {
        display: flex;
        align-items: center;
        gap: 6px;
        color: #475569;
        font-size: 0.85rem;
        white-space: nowrap;

        i {
          color: #94a3b8;
          font-size: 0.9rem;
        }
      }

      .col-pj {
        width: 180px;
      }

      .pj-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 5px 12px;
        border-radius: 8px;
        background: rgba(29, 78, 216, 0.06);
        color: var(--primary-color);
        font-size: 0.82rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.15s;

        i {
          font-size: 0.85rem;
        }

        .pj-size {
          color: #94a3b8;
          font-weight: 400;
          font-size: 0.75rem;
        }

        &:hover {
          background: rgba(29, 78, 216, 0.12);
          transform: translateY(-1px);
        }
      }

      .no-pj {
        color: #cbd5e1;
        font-size: 1.1rem;
      }

      .col-teacher {
        width: 150px;
      }

      .teacher-text {
        font-weight: 600;
        color: #1e293b;
        font-size: 0.88rem;
      }

      .col-subject {
        width: 140px;
      }

      .subject-chip {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 999px;
        background: var(--chip-bg);
        color: var(--chip-text);
        font-size: 0.78rem;
        font-weight: 700;
        white-space: nowrap;
      }

      .col-status {
        width: 130px;
      }

      .status-pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 5px 14px;
        border-radius: 999px;
        font-size: 0.78rem;
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

        &.pending {
          background: rgba(254, 243, 199, 0.85);
          color: #b45309;
          border-color: rgba(251, 191, 36, 0.5);

          .status-dot {
            background: #f59e0b;
            box-shadow: 0 0 8px rgba(245, 158, 11, 0.5);
          }
        }

        &.validated {
          background: rgba(220, 252, 231, 0.85);
          color: #166534;
          border-color: rgba(34, 197, 94, 0.5);

          .status-dot {
            background: #22c55e;
            box-shadow: 0 0 8px rgba(34, 197, 94, 0.5);
          }
        }

        &.rejected {
          background: rgba(254, 226, 226, 0.85);
          color: #b91c1c;
          border-color: rgba(239, 68, 68, 0.5);

          .status-dot {
            background: #ef4444;
            box-shadow: 0 0 8px rgba(239, 68, 68, 0.5);
          }
        }
      }

      .col-actions {
        width: 200px;
      }

      .action-buttons {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .icon-btn {
        width: 34px;
        height: 34px;
        border-radius: 8px;
        border: 1px solid transparent;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.15s ease;
        background: transparent;
        font-size: 0.88rem;

        &.view {
          color: var(--primary-color);

          &:hover {
            background: rgba(29, 78, 216, 0.1);
            border-color: rgba(29, 78, 216, 0.2);
          }
        }

        &.pdf {
          color: #dc2626;

          &:hover {
            background: rgba(239, 68, 68, 0.08);
            border-color: rgba(239, 68, 68, 0.2);
          }
        }

        &.approve {
          color: #16a34a;

          &:hover {
            background: rgba(34, 197, 94, 0.1);
            border-color: rgba(34, 197, 94, 0.2);
          }
        }

        &.reject {
          color: #dc2626;

          &:hover {
            background: rgba(239, 68, 68, 0.08);
            border-color: rgba(239, 68, 68, 0.2);
          }
        }

        &.delete {
          color: #94a3b8;

          &:hover {
            background: rgba(239, 68, 68, 0.08);
            color: #dc2626;
            border-color: rgba(239, 68, 68, 0.2);
          }
        }
      }

      /* ════════════════════════════════════════
         MODALS
         ════════════════════════════════════════ */
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        animation: fadeIn 0.2s ease;
        padding: 20px;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .modal-container {
        background: white;
        border-radius: 20px;
        width: 100%;
        max-width: 680px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 25px 60px rgba(0, 0, 0, 0.2);
        animation: slideUp 0.3s ease;

        &.detail-modal {
          max-width: 780px;
        }

        &.reject-modal,
        &.delete-modal {
          max-width: 520px;
        }
      }

      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 28px;
        border-bottom: 1px solid rgba(226, 232, 240, 0.9);
        background: rgba(248, 250, 252, 0.6);

        h2 {
          margin: 0;
          font-size: 1.2rem;
          font-weight: 800;
          color: #0f172a;
          display: flex;
          align-items: center;
          gap: 10px;

          i {
            font-size: 1.2rem;
          }
        }

        &.detail-header {
          background: var(--primary-color);
          color: white;

          h2 {
            color: white;
          }

          .modal-close {
            color: rgba(255, 255, 255, 0.8);
            &:hover {
              background: rgba(255, 255, 255, 0.15);
              color: white;
            }
          }

          .status-pill {
            &.pending {
              background: rgba(255, 255, 255, 0.2);
              color: #fef3c7;
              border-color: rgba(255, 255, 255, 0.3);

              .status-dot {
                background: #fbbf24;
              }
            }

            &.validated {
              background: rgba(34, 197, 94, 0.2);
              color: #bbf7d0;
              border-color: rgba(34, 197, 94, 0.4);

              .status-dot {
                background: #22c55e;
              }
            }

            &.rejected {
              background: rgba(239, 68, 68, 0.2);
              color: #fecaca;
              border-color: rgba(239, 68, 68, 0.4);

              .status-dot {
                background: #ef4444;
              }
            }
          }
        }
      }

      .modal-close {
        width: 36px;
        height: 36px;
        border-radius: 10px;
        border: none;
        background: transparent;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #64748b;
        font-size: 1rem;
        transition: all 0.15s;

        &:hover {
          background: #f1f5f9;
          color: #0f172a;
        }
      }

      .modal-body {
        padding: 24px 28px;
      }

      .modal-footer {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 10px;
        padding: 18px 28px;
        border-top: 1px solid rgba(226, 232, 240, 0.9);
        background: rgba(248, 250, 252, 0.4);

        &.detail-footer {
          flex-wrap: wrap;
          justify-content: space-between;
        }
      }

      .modal-close-bottom {
        padding: 10px 22px;
        border-radius: 10px;
        border: 1px solid var(--border-color);
        background: white;
        color: #475569;
        font-weight: 600;
        font-size: 0.88rem;
        cursor: pointer;
        transition: all 0.15s;

        &:hover {
          background: #f8fafc;
        }
      }

      /* ════════════════════════════════════════
         FORM
         ════════════════════════════════════════ */
      .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;

        @media (max-width: 600px) {
          grid-template-columns: 1fr;
        }
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 6px;

        &.full-width {
          grid-column: 1 / -1;
        }

        label {
          font-size: 0.82rem;
          font-weight: 700;
          color: #334155;
          text-transform: uppercase;
          letter-spacing: 0.03em;

          .required {
            color: #ef4444;
          }
        }

        input[type='text'],
        input[type='date'] {
          padding: 11px 16px;
          border: 1px solid var(--border-color);
          border-radius: 10px;
          font-size: 0.9rem;
          color: #0f172a;
          background: white;
          transition: all 0.2s;

          &::placeholder {
            color: #94a3b8;
          }

          &:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 4px rgba(29, 78, 216, 0.12);
          }

          &.invalid {
            border-color: #ef4444;
            box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
          }
        }

        textarea {
          padding: 11px 16px;
          border: 1px solid var(--border-color);
          border-radius: 10px;
          font-size: 0.9rem;
          color: #0f172a;
          background: white;
          resize: vertical;
          min-height: 80px;
          font-family: inherit;
          transition: all 0.2s;

          &::placeholder {
            color: #94a3b8;
          }

          &:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 4px rgba(29, 78, 216, 0.12);
          }

          &.invalid {
            border-color: #ef4444;
            box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
          }
        }

        .error-msg {
          font-size: 0.78rem;
          color: #ef4444;
          font-weight: 600;
        }
      }

      .file-upload-zone {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 14px 18px;
        border: 2px dashed var(--border-color);
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.2s;
        color: #64748b;
        font-size: 0.88rem;

        i {
          font-size: 1.2rem;
          color: var(--primary-color);
        }

        &:hover {
          border-color: var(--primary-color);
          background: rgba(29, 78, 216, 0.03);
          color: #0f172a;
        }
      }

      /* ════════════════════════════════════════
         DETAIL VIEW
         ════════════════════════════════════════ */
      .detail-title-row {
        display: flex;
        align-items: center;
        gap: 14px;

        h2 {
          margin: 0;
          font-size: 1.3rem;
        }

        .detail-id-badge {
          background: rgba(255, 255, 255, 0.2);
          padding: 4px 12px;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 700;
        }
      }

      .detail-header-actions {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .detail-meta-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
        margin-bottom: 28px;

        @media (max-width: 600px) {
          grid-template-columns: 1fr;
        }
      }

      .detail-field {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 14px 16px;
        background: #f8fafc;
        border-radius: 12px;
        border: 1px solid rgba(226, 232, 240, 0.9);

        .field-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: rgba(29, 78, 216, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary-color);
          flex-shrink: 0;
        }

        .field-label {
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #64748b;
          font-weight: 700;
        }

        .field-value {
          font-size: 0.95rem;
          font-weight: 600;
          color: #0f172a;
          display: block;
        }
      }

      .detail-section {
        margin-bottom: 24px;

        h3 {
          font-size: 0.92rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 12px 0;
          display: flex;
          align-items: center;
          gap: 8px;

          i {
            color: var(--primary-color);
            font-size: 1rem;
          }
        }
      }

      .contenu-block {
        background: #f8fafc;
        border: 1px solid rgba(226, 232, 240, 0.9);
        border-radius: 12px;
        padding: 18px 20px;
        color: #334155;
        line-height: 1.7;
        font-size: 0.92rem;
      }

      .pj-detail-card {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 16px 20px;
        background: rgba(29, 78, 216, 0.04);
        border: 1px solid rgba(29, 78, 216, 0.15);
        border-radius: 12px;

        .pj-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: rgba(29, 78, 216, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
          color: var(--primary-color);
          flex-shrink: 0;
        }

        .pj-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;

          .pj-name {
            font-weight: 700;
            color: #0f172a;
            font-size: 0.92rem;
          }

          .pj-meta {
            font-size: 0.78rem;
            color: #94a3b8;
          }
        }

        .pj-download {
          flex-shrink: 0;
        }
      }

      .no-pj-detail {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 16px;
        background: #f8fafc;
        border-radius: 12px;
        color: #94a3b8;
        font-size: 0.9rem;

        i {
          font-size: 1.1rem;
        }
      }

      .comments-block {
        background: rgba(254, 243, 199, 0.3);
        border: 1px solid rgba(245, 158, 11, 0.2);
        border-radius: 12px;
        padding: 16px 20px;
        color: #92400e;
        line-height: 1.6;
        font-size: 0.9rem;
      }

      .validation-actions {
        display: flex;
        gap: 8px;
      }

      /* ════════════════════════════════════════
         TOAST
         ════════════════════════════════════════ */
      .toast {
        position: fixed;
        bottom: 28px;
        right: 28px;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px 20px;
        border-radius: 14px;
        font-weight: 600;
        font-size: 0.9rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        z-index: 3000;
        animation: slideInRight 0.3s ease;

        i {
          font-size: 1.2rem;
        }

        .toast-close {
          background: none;
          border: none;
          cursor: pointer;
          color: inherit;
          opacity: 0.6;
          padding: 4px;
          margin-left: 4px;

          &:hover {
            opacity: 1;
          }
        }

        &.success {
          background: #166534;
          color: white;
        }

        &.error {
          background: #991b1b;
          color: white;
        }

        &.info {
          background: #1d4ed8;
          color: white;
        }

        &.warning {
          background: #92400e;
          color: white;
        }
      }

      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translateX(40px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      /* ════════════════════════════════════════
         EMPTY STATE
         ════════════════════════════════════════ */
      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 64px 24px;
        text-align: center;

        .empty-icon {
          width: 96px;
          height: 96px;
          border-radius: 24px;
          background: rgba(241, 245, 249, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;

          i {
            font-size: 2.5rem;
            color: #94a3b8;
          }
        }

        .empty-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: #334155;
          margin: 0;
        }

        .empty-desc {
          font-size: 0.9rem;
          color: #94a3b8;
          margin: 8px 0 0;
        }

        .empty-action {
          margin-top: 20px;
        }
      }

      /* ════════════════════════════════════════
         RESPONSIVE
         ════════════════════════════════════════ */
      @media (max-width: 768px) {
        .page-header {
          flex-direction: column;
          align-items: flex-start;

          .header-actions {
            width: 100%;
            justify-content: flex-end;
            flex-wrap: wrap;
          }
        }

        .data-table {
          thead th,
          tbody td {
            padding: 10px 12px;
            font-size: 0.82rem;
          }

          .col-id,
          .col-teacher,
          .col-subject {
            display: none;
          }
        }

        .action-buttons {
          gap: 2px;

          .icon-btn {
            width: 30px;
            height: 30px;
          }
        }

        .detail-meta-grid {
          grid-template-columns: 1fr;
        }

        .modal-container {
          margin: 12px;
          max-height: 95vh;
        }

        .modal-body {
          padding: 18px 20px;
        }

        .modal-footer {
          padding: 14px 20px;
        }
      }
    `,
  ],
})
export class PedagogyComponent implements OnInit {
  lessonLogs: LessonLog[] = [];
  filteredLogs: LessonLog[] = [];
  stats = { total: 0, enAttente: 0, valide: 0, rejete: 0 };

  // Search & filter
  searchTerm = '';
  activeFilter: string = 'all';

  // Detail modal
  showDetailModal = false;
  selectedLog: LessonLog | null = null;

  // Add modal
  showAddModal = false;
  newLog: Omit<LessonLog, 'id'> = {
    titleCours: '',
    contenu: '',
    dateDeCreation: new Date().toISOString().split('T')[0],
    pieceJointe: null,
    teacherName: '',
    subject: '',
    status: 'En attente',
  };
  addErrors: Record<string, string> = {};
  selectedFileName = '';

  // Toast
  toastMessage: string | null = null;
  toastType: 'success' | 'error' | 'info' | 'warning' = 'info';

  constructor(
    private pedagogyService: PedagogyService,
    private exportService: ExportService,
  ) {}

  ngOnInit(): void {
    this.loadLessonLogs();
  }

  private loadLessonLogs(): void {
    this.pedagogyService.getLessonLogs().subscribe({
      next: (data) => {
        this.lessonLogs = data;
        this.applyFilters();
      },
      error: () => this.showToast('Erreur lors du chargement des données', 'error'),
    });
  }

  // ──────────────────────────────────────────────
  // FILTERS & SEARCH
  // ──────────────────────────────────────────────
  filterByStatus(status: string): void {
    this.activeFilter = status;
    this.applyFilters();
  }

  onSearch(): void {
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilters();
  }

  private applyFilters(): void {
    let result = [...this.lessonLogs];

    // Filter by status
    if (this.activeFilter !== 'all') {
      result = result.filter((log) => log.status === this.activeFilter);
    }

    // Filter by search term
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(
        (log) =>
          log.titleCours.toLowerCase().includes(term) ||
          log.contenu.toLowerCase().includes(term) ||
          log.teacherName.toLowerCase().includes(term) ||
          log.subject.toLowerCase().includes(term),
      );
    }

    this.filteredLogs = result;

    // Update stats
    this.stats = {
      total: this.lessonLogs.length,
      enAttente: this.lessonLogs.filter((l) => l.status === 'En attente').length,
      valide: this.lessonLogs.filter((l) => l.status === 'Validé').length,
      rejete: this.lessonLogs.filter((l) => l.status === 'Rejeté').length,
    };
  }

  // ──────────────────────────────────────────────
  // VALIDATION
  // ──────────────────────────────────────────────
  validateLog(id: number, status: 'Validé' | 'Rejeté'): void {
    this.pedagogyService.validateLog(id, status);
    this.loadLessonLogs();
    this.showToast(
      status === 'Validé' ? 'Séance approuvée avec succès' : 'Séance rejetée',
      status === 'Validé' ? 'success' : 'warning',
    );
    if (this.showDetailModal && this.selectedLog && this.selectedLog.id === id) {
      this.selectedLog = { ...this.selectedLog, status };
    }
  }

  // ──────────────────────────────────────────────
  // DETAIL MODAL
  // ──────────────────────────────────────────────
  openDetailModal(log: LessonLog): void {
    this.selectedLog = { ...log };
    this.showDetailModal = true;
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedLog = null;
  }

  // ──────────────────────────────────────────────
  // ADD MODAL
  // ──────────────────────────────────────────────
  openAddModal(): void {
    this.newLog = {
      titleCours: '',
      contenu: '',
      dateDeCreation: new Date().toISOString().split('T')[0],
      pieceJointe: null,
      teacherName: '',
      subject: '',
      status: 'En attente',
    };
    this.addErrors = {};
    this.selectedFileName = '';
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.addErrors = {};
  }

  addLessonLog(): void {
    this.addErrors = {};

    if (!this.newLog.titleCours.trim()) {
      this.addErrors['titleCours'] = 'Le titre du cours est requis';
    }
    if (!this.newLog.contenu.trim()) {
      this.addErrors['contenu'] = 'Le contenu est requis';
    }
    if (!this.newLog.teacherName.trim()) {
      this.addErrors['teacherName'] = "Le nom de l'enseignant est requis";
    }
    if (!this.newLog.subject.trim()) {
      this.addErrors['subject'] = 'La matière est requise';
    }

    if (Object.keys(this.addErrors).length > 0) {
      return;
    }

    this.pedagogyService.addLessonLog(this.newLog);
    this.closeAddModal();
    this.loadLessonLogs();
    this.showToast('Séance ajoutée avec succès', 'success');
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedFileName = file.name;
      this.newLog.pieceJointe = {
        id: Date.now(),
        nom: file.name,
        type: file.type,
        taille: file.size,
        url: '',
      };
    }
  }

  // ──────────────────────────────────────────────
  // DELETE
  // ──────────────────────────────────────────────
  deleteLog(log: LessonLog): void {
    this.pedagogyService.deleteLessonLog(log.id);
    this.loadLessonLogs();
    this.showToast('Séance supprimée', 'error');
    if (this.selectedLog && this.selectedLog.id === log.id) {
      this.closeDetailModal();
    }
  }

  // ──────────────────────────────────────────────
  // EXPORT
  // ──────────────────────────────────────────────
  exportPdf(): void {
    this.exportService.exportToPdf(this.filteredLogs, 'cahier-de-texte');
    this.showToast('Export PDF en cours...', 'info');
  }

  exportExcel(): void {
    this.exportService.exportToExcel(this.filteredLogs, 'cahier-de-texte');
    this.showToast('Export Excel en cours...', 'info');
  }

  exportSinglePdf(log: LessonLog): void {
    this.exportService.exportSingleToPdf(log);
    this.showToast('Export PDF de la séance #' + log.id, 'info');
  }

  // ──────────────────────────────────────────────
  // DOWNLOAD ATTACHMENT
  // ──────────────────────────────────────────────
  downloadAttachment(pj: { nom: string; url: string }): void {
    if (pj.url) {
      const link = document.createElement('a');
      link.href = pj.url;
      link.download = pj.nom;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      this.showToast('Fichier non disponible pour le moment', 'warning');
    }
  }

  // ──────────────────────────────────────────────
  // UTILITIES
  // ──────────────────────────────────────────────
  getStatusClass(status: string): string {
    switch (status) {
      case 'En attente':
        return 'pending';
      case 'Validé':
        return 'validated';
      case 'Rejeté':
        return 'rejected';
      default:
        return 'pending';
    }
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' o';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' Ko';
    return (bytes / 1048576).toFixed(1) + ' Mo';
  }

  truncateText(text: string, max: number): string {
    return text.length > max ? text.substring(0, max) + '…' : text;
  }

  getFileIcon(mimeType: string): string {
    if (mimeType.includes('pdf')) return 'pi-file-pdf';
    if (mimeType.includes('image')) return 'pi-image';
    if (mimeType.includes('sheet') || mimeType.includes('excel')) return 'pi-file-excel';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'pi-file-word';
    if (mimeType.includes('zip') || mimeType.includes('compress')) return 'pi-file-zip';
    return 'pi-file';
  }

  private showToast(message: string, type: 'success' | 'error' | 'info' | 'warning'): void {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => {
      this.toastMessage = null;
    }, 3000);
  }

  getToastIcon(): string {
    switch (this.toastType) {
      case 'success':
        return 'pi-check-circle';
      case 'error':
        return 'pi-times-circle';
      case 'warning':
        return 'pi-exclamation-circle';
      default:
        return 'pi-info-circle';
    }
  }
}
