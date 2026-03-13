import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedagogyService } from '../../core/services/pedagogy.service';
import { LessonLog } from '../../core/models/lesson-log.model';

@Component({
  selector: 'app-pedagogy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pedagogy-container">
      <div class="page-header">
        <h1>Validation Pédagogique (Cahiers de Textes)</h1>
        <p>Vérifiez et approuvez les séances dispensées par les enseignants.</p>
      </div>

      <div class="stats-summary">
        <div class="summary-card">
          <span class="label">Total Séances</span>
          <span class="value">42</span>
        </div>
        <div class="summary-card warning">
          <span class="label">À Valider</span>
          <span class="value">12</span>
        </div>
        <div class="summary-card success">
          <span class="label">Approuvées</span>
          <span class="value">28</span>
        </div>
      </div>

      <div class="logs-list">
        @for (log of lessonLogs; track log.id) {
          <div class="log-card" [ngClass]="log.status.toLowerCase()">
            <div class="log-header">
              <div class="teacher-info">
                <img src="https://ui-avatars.com/api/?name={{log.teacherName}}&background=random" alt="Avatar">
                <div class="details">
                  <span class="name">{{log.teacherName}}</span>
                  <span class="subject">{{log.subject}} • {{log.date}}</span>
                </div>
              </div>
              <div class="status-badge" [ngClass]="log.status.toLowerCase()">
                {{log.status}}
              </div>
            </div>

            <div class="log-body">
              <div class="content-section">
                <span class="chapter-title">{{log.chapter}}</span>
                <p class="content-text">{{log.content}}</p>
                <div class="time-info">
                  <i class="pi pi-clock"></i> 
                  <span>Durée : {{log.startTime}} - {{log.endTime}} (2h 00)</span>
                </div>
              </div>

              @if (log.status === 'En attente') {
                <div class="actions">
                  <button class="btn btn-approve" (click)="updateStatus(log.id, 'Validé')">
                    <i class="pi pi-check"></i> Approuver
                  </button>
                  <button class="btn btn-reject" (click)="updateStatus(log.id, 'Rejeté')">
                    <i class="pi pi-times"></i> Rejeter
                  </button>
                </div>
              } @else {
                <div class="validated-label">
                  <i class="pi" [ngClass]="log.status === 'Validé' ? 'pi-check-circle' : 'pi-exclamation-circle'"></i>
                  Séance déjà {{log.status.toLowerCase()}}e
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .pedagogy-container { display: flex; flex-direction: column; gap: 24px; }
    .page-header { h1 { margin: 0; font-size: 1.7rem; } p { color: #64748b; margin-top: 4px; } }

    .stats-summary {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;
      .summary-card {
        background: white; padding: 20px; border-radius: 12px; border-left: 5px solid #cbd5e1;
        display: flex; flex-direction: column; box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        .label { font-size: 0.85rem; color: #64748b; font-weight: 600; }
        .value { font-size: 1.8rem; font-weight: 800; color: #0f172a; }
        &.warning { border-left-color: #f59e0b; .value { color: #f59e0b; } }
        &.success { border-left-color: #22c55e; .value { color: #22c55e; } }
      }
    }

    .logs-list { display: flex; flex-direction: column; gap: 16px; }

    .log-card {
      background: white; border-radius: 16px; border: 1px solid #e2e8f0;
      transition: all 0.3s ease; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
      &:hover { transform: translateX(5px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
      &.validé { border-left: 8px solid #22c55e; }
      &.rejeté { border-left: 8px solid #ef4444; }
      &.en { border-left: 8px solid #f59e0b; }
    }

    .log-header {
      padding: 16px 24px; border-bottom: 1px solid #f1f5f9;
      display: flex; justify-content: space-between; align-items: center;
      .teacher-info {
        display: flex; align-items: center; gap: 12px;
        img { width: 36px; height: 36px; border-radius: 50%; }
        .details { display: flex; flex-direction: column; .name { font-weight: 700; color: #0f172a; } .subject { font-size: 0.75rem; color: #64748b; } }
      }
    }

    .status-badge {
      padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase;
      &.en { background: #fef3c7; color: #b45309; }
      &.validé { background: #dcfce7; color: #15803d; }
      &.rejeté { background: #fee2e2; color: #b91c1c; }
    }

    .log-body {
      padding: 24px; display: grid; grid-template-columns: 1fr 250px; gap: 24px;
      .chapter-title { display: block; font-weight: 800; font-size: 1.1rem; color: #1e293b; margin-bottom: 8px; }
      .content-text { color: #475569; line-height: 1.6; margin-bottom: 16px; }
      .time-info {
        display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: #64748b; font-weight: 500;
        i { color: var(--primary-color); }
      }
    }

    .actions {
      display: flex; flex-direction: column; gap: 10px;
      .btn {
        width: 100%; padding: 12px; border-radius: 10px; font-weight: 700; border: none; cursor: pointer;
        display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s;
        &.btn-approve { background: #dcfce7; color: #15803d; &:hover { background: #22c55e; color: white; } }
        &.btn-reject { background: #fee2e2; color: #b91c1c; &:hover { background: #ef4444; color: white; } }
      }
    }

    .validated-label {
      display: flex; align-items: center; justify-content: center; gap: 8px;
      height: 100%; font-weight: 600; color: #94a3b8; font-size: 0.9rem;
      i { font-size: 1.2rem; }
    }
  `]
})
export class PedagogyComponent implements OnInit {
  lessonLogs: LessonLog[] = [];

  constructor(private pedagogyService: PedagogyService) {}

  ngOnInit() {
    this.pedagogyService.getLessonLogs().subscribe(data => this.lessonLogs = data);
  }

  updateStatus(id: number, status: 'Validé' | 'Rejeté') {
    this.pedagogyService.validateLog(id, status);
  }
}
