import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController } from '@ionic/angular';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-folder',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Tableau de Bord</ion-title>
        <ion-buttons slot="end">
          <ion-avatar class="top-avatar">
            <img src="https://ui-avatars.com/api/?name=Dr+Alou&background=2563eb&color=fff">
          </ion-avatar>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true" class="dashboard-content">
      <div class="welcome-banner">
        <div class="user-intro">
          <p>Bonjour,</p>
          <h1>Dr. Alou Diarra</h1>
        </div>
        <div class="date-chip">
          {{ today | date:'EEEE, d MMMM' }}
        </div>
      </div>

      <div class="quick-stats">
        <div class="stat-card blue">
          <span class="val">42h</span>
          <span class="lab">Ce mois</span>
        </div>
        <div class="stat-card green">
          <span class="val">95%</span>
          <span class="lab">Présence</span>
        </div>
        <div class="stat-card orange">
          <span class="val">3</span>
          <span class="lab">À remplir</span>
        </div>
      </div>

      <div class="action-grid">
        <div class="action-card primary" (click)="goTo('/scan')">
          <div class="icon-wrap">
            <ion-icon name="qr-code-outline"></ion-icon>
          </div>
          <h3>Émarger</h3>
          <p>Scanner un QR Code</p>
        </div>

        <div class="action-card secondary" (click)="goTo('/lesson-entry')">
          <div class="icon-wrap">
            <ion-icon name="book-outline"></ion-icon>
          </div>
          <h3>Cahier</h3>
          <p>Remplir séance</p>
        </div>
      </div>

      <div class="section-header">
        <h2>Prochaines Séances</h2>
        <ion-button fill="clear" size="small">Voir tout</ion-button>
      </div>

      <div class="schedule-list">
        <div class="schedule-item">
          <div class="time-box">
            <span class="start">08:00</span>
            <span class="end">10:00</span>
          </div>
          <div class="details">
            <h3>Algorithmique</h3>
            <p>Amphi 500 • L1 Informatique</p>
          </div>
          <div class="status-indicator"></div>
        </div>

        <div class="schedule-item">
          <div class="time-box">
            <span class="start">10:30</span>
            <span class="end">12:30</span>
          </div>
          <div class="details">
            <h3>Programmation Java</h3>
            <p>Salle 12 • L2 Informatique</p>
          </div>
          <div class="status-indicator waiting"></div>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    .dashboard-content { --background: #f8fafc; }

    .welcome-banner {
      padding: 30px 20px; background: white; border-bottom-left-radius: 40px; border-bottom-right-radius: 40px;
      display: flex; justify-content: space-between; align-items: flex-start;
      margin-bottom: 25px; box-shadow: 0 4px 12px rgba(0,0,0,0.03);
      
      .user-intro {
        p { margin: 0; color: #64748b; font-size: 1rem; font-weight: 500; }
        h1 { margin: 5px 0 0; color: #1e293b; font-size: 1.8rem; font-weight: 800; letter-spacing: -0.5px; }
      }
      .date-chip { background: #eff6ff; color: #2563eb; padding: 8px 16px; border-radius: 99px; font-size: 0.75rem; font-weight: 700; text-transform: capitalize; }
    }

    .top-avatar { width: 32px; height: 32px; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }

    .quick-stats {
      display: flex; gap: 15px; padding: 0 20px; margin-bottom: 30px;
      .stat-card {
        flex: 1; padding: 15px; border-radius: 20px; display: flex; flex-direction: column; gap: 5px;
        .val { font-size: 1.4rem; font-weight: 800; }
        .lab { font-size: 0.7rem; font-weight: 600; opacity: 0.8; }
        &.blue { background: #2563eb; color: white; }
        &.green { background: #059669; color: white; }
        &.orange { background: #f59e0b; color: white; }
      }
    }

    .action-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 15px; padding: 0 20px; margin-bottom: 30px;
      .action-card {
        padding: 20px; border-radius: 25px; background: white; border: 1px solid #e2e8f0;
        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); transition: all 0.2s;
        &:active { transform: scale(0.95); background: #f1f5f9; }
        .icon-wrap { width: 45px; height: 45px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 15px; }
        h3 { margin: 0; font-size: 1rem; font-weight: 800; color: #1e293b; }
        p { margin: 5px 0 0; font-size: 0.75rem; color: #64748b; font-weight: 500; }
        
        &.primary .icon-wrap { background: #eff6ff; color: #2563eb; }
        &.secondary .icon-wrap { background: #f0fdf4; color: #059669; }
      }
    }

    .section-header {
      display: flex; justify-content: space-between; align-items: center; padding: 0 20px; margin-bottom: 15px;
      h2 { font-size: 1.1rem; font-weight: 800; color: #1e293b; margin: 0; }
    }

    .schedule-list {
      padding: 0 20px 40px;
      .schedule-item {
        background: white; padding: 15px; border-radius: 20px; display: flex; align-items: center; gap: 15px;
        margin-bottom: 12px; border: 1px solid #f1f5f9;
        .time-box {
          display: flex; flex-direction: column; align-items: center; padding-right: 15px; border-right: 1px solid #f1f5f9;
          .start { font-weight: 800; color: #1e293b; font-size: 0.9rem; }
          .end { color: #94a3b8; font-size: 0.75rem; font-weight: 600; }
        }
        .details {
          flex: 1;
          h3 { margin: 0; font-size: 0.95rem; font-weight: 700; color: #1e293b; }
          p { margin: 3px 0 0; font-size: 0.75rem; color: #64748b; }
        }
        .status-indicator {
          width: 8px; height: 8px; border-radius: 50%; background: #22c55e;
          &.waiting { background: #f59e0b; }
        }
      }
    }
  `]
})
export class FolderPage implements OnInit {
  today = new Date();

  constructor(private navCtrl: NavController) {}

  ngOnInit() {}

  goTo(path: string) {
    this.navCtrl.navigateForward(path);
  }
}
