import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface AttendanceLog {
  id: number;
  teacherName: string;
  subject: string;
  time: string;
  location: string;
  status: 'Présent' | 'En retard' | 'Absent';
  method: 'QR Code' | 'Manuel';
}

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="attendance-page">
      <div class="page-header">
        <h1>Suivi des Émargements</h1>
        <p>Historique des présences enregistrées aujourd'hui ({{todayLogs.length}})</p>
      </div>

      <div class="stats-row">
        <div class="mini-stat">
          <span class="val">92%</span>
          <span class="lab">Taux de présence</span>
        </div>
        <div class="mini-stat">
          <span class="val">42</span>
          <span class="lab">Séances validées</span>
        </div>
        <div class="mini-stat">
          <span class="val">3</span>
          <span class="lab">Retards</span>
        </div>
      </div>

      <div class="table-card">
        <table class="attendance-table">
          <thead>
            <tr>
              <th>Enseignant</th>
              <th>Matière / Amphi</th>
              <th>Heure</th>
              <th>Méthode</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            @for (log of todayLogs; track log.id) {
              <tr>
                <td><strong>{{log.teacherName}}</strong></td>
                <td>
                  <div class="sub-info">
                    <span>{{log.subject}}</span>
                    <small>{{log.location}}</small>
                  </div>
                </td>
                <td>{{log.time}}</td>
                <td>
                  <span class="method-tag">
                    <i class="pi" [ngClass]="log.method === 'QR Code' ? 'pi-qrcode' : 'pi-pencil'"></i>
                    {{log.method}}
                  </span>
                </td>
                <td>
                  <span class="status-pill" [ngClass]="log.status.toLowerCase().replace(' ', '-')">
                    {{log.status}}
                  </span>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .attendance-page { display: flex; flex-direction: column; gap: 24px; }
    .page-header { h1 { margin: 0; font-size: 1.7rem; } p { color: #64748b; margin-top: 4px; } }

    .stats-row {
      display: flex; gap: 20px;
      .mini-stat {
        background: white; padding: 16px 24px; border-radius: 12px; border: 1px solid #e2e8f0;
        display: flex; flex-direction: column; min-width: 150px;
        .val { font-size: 1.5rem; font-weight: 800; color: #2563eb; }
        .lab { font-size: 0.8rem; color: #64748b; font-weight: 600; }
      }
    }

    .table-card {
      background: white; border-radius: 16px; border: 1px solid #e2e8f0;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); overflow: hidden;
    }

    .attendance-table {
      width: 100%; border-collapse: collapse;
      th { padding: 16px 20px; background: #f8fafc; text-align: left; color: #64748b; font-size: 0.8rem; text-transform: uppercase; }
      td { padding: 16px 20px; border-bottom: 1px solid #f1f5f9; font-size: 0.9rem; }
    }

    .sub-info {
      display: flex; flex-direction: column;
      small { color: #94a3b8; }
    }

    .method-tag {
      display: inline-flex; align-items: center; gap: 6px; font-size: 0.8rem; color: #64748b;
      background: #f1f5f9; padding: 4px 8px; border-radius: 4px;
    }

    .status-pill {
      padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600;
      &.présent { background: #dcfce7; color: #166534; }
      &.en-retard { background: #fef9c3; color: #854d0e; }
      &.absent { background: #fee2e2; color: #991b1b; }
    }
  `]
})
export class AttendanceComponent implements OnInit {
  todayLogs: AttendanceLog[] = [
    { id: 1, teacherName: 'Dr. Alou Diarra', subject: 'Algorithmique', time: '08:05', location: 'Amphi 500', status: 'Présent', method: 'QR Code' },
    { id: 2, teacherName: 'K. Barry', subject: 'Mathématiques', time: '10:45', location: 'Salle 12', status: 'En retard', method: 'QR Code' },
    { id: 3, teacherName: 'F. Coulibaly', subject: 'Informatique', time: '14:00', location: 'Amphi A', status: 'Présent', method: 'Manuel' },
    { id: 4, teacherName: 'M. Traoré', subject: 'Physique', time: '--:--', location: 'Labo 1', status: 'Absent', method: 'Manuel' },
  ];

  constructor() {}

  ngOnInit() {}
}
