import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QRCodeComponent } from 'angularx-qrcode';

@Component({
  selector: 'app-qr-generator',
  standalone: true,
  imports: [CommonModule, FormsModule, QRCodeComponent],
  template: `
    <div class="qr-container">
      <div class="page-header">
        <h1>Générateur de QR Code Dynamique</h1>
        <p>Sécurisez l'émargement avec des codes à durée limitée</p>
      </div>

      <div class="grid-layout">
        <!-- Section Paramètres -->
        <div class="card settings-card">
          <h3>Configuration de la Session</h3>
          <div class="form-group">
            <label>Matière</label>
            <select [(ngModel)]="selectedSubject">
              <option value="Algorithmique">Algorithmique - Amphi 500</option>
              <option value="Java">Programmation Java - Salle 12</option>
              <option value="Bases de données">Bases de données - Amphi A</option>
            </select>
          </div>
          <div class="form-group">
            <label>Enseignant</label>
            <input type="text" disabled value="Dr. Alou Diarra">
          </div>
          <div class="form-group">
            <label>Durée de validité (secondes)</label>
            <input type="number" [(ngModel)]="refreshInterval" min="10" max="300">
          </div>
          
          <div class="session-status" [ngClass]="{'active': isRunning}">
            <div class="status-dot"></div>
            <span>{{ isRunning ? 'Session en cours...' : 'Session en attente' }}</span>
          </div>

          <button class="btn" [ngClass]="isRunning ? 'btn-danger' : 'btn-primary'" (click)="toggleSession()">
            <i class="pi" [ngClass]="isRunning ? 'pi-stop-circle' : 'pi-play-circle'"></i>
            {{ isRunning ? 'Arrêter la session' : 'Démarrer la session' }}
          </button>
        </div>

        <!-- Section QR Code -->
        <div class="card qr-display-card">
          <div class="qr-wrapper" [class.blurred]="!isRunning">
            @if (isRunning) {
              <div class="timer-ring">
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" class="bg-ring"></circle>
                  <circle cx="50" cy="50" r="45" class="progress-ring" 
                    [style.stroke-dashoffset]="dashOffset"></circle>
                </svg>
                <span class="timer-text">{{ timeLeft }}s</span>
              </div>
              <div class="qrcode-box">
                <qrcode [qrdata]="qrData" [width]="280" [errorCorrectionLevel]="'M'"></qrcode>
              </div>
              <p class="qr-payload">ID: {{ qrData.split('-')[1] }} | Ver: {{ qrData.split('-')[2] }}</p>
            } @else {
              <div class="placeholder">
                <i class="pi pi-lock"></i>
                <p>Démarrez la session pour générer le QR Code</p>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Logs de session -->
      <div class="card logs-card">
        <h3>Historique des scans récents</h3>
        <div class="log-item success">
          <i class="pi pi-check-circle"></i>
          <span><strong>K. Keita</strong> a émargé avec succès (Position GPS validée)</span>
          <span class="time">14:32:05</span>
        </div>
        <div class="log-item warning">
          <i class="pi pi-exclamation-triangle"></i>
          <span>Tentative d'émargement hors zone détectée (Utilisateur: M. Diallo)</span>
          <span class="time">14:31:12</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .qr-container { display: flex; flex-direction: column; gap: 24px; }
    .page-header { h1 { margin: 0; font-size: 1.7rem; } p { color: #64748b; margin-top: 4px; } }

    .grid-layout { display: grid; grid-template-columns: 350px 1fr; gap: 24px; }

    .form-group {
      margin-bottom: 20px;
      label { display: block; margin-bottom: 8px; font-weight: 600; color: #475569; }
      select, input {
        width: 100%; padding: 12px; border-radius: 10px; border: 1px solid #e2e8f0;
        background: #f8fafc; font-size: 1rem;
      }
    }

    .session-status {
      display: flex; align-items: center; gap: 10px; margin: 24px 0;
      padding: 12px; border-radius: 10px; background: #f1f5f9; color: #64748b; font-weight: 600;
      .status-dot { width: 10px; height: 10px; border-radius: 50%; background: #94a3b8; }
      &.active {
        background: #dcfce7; color: #166534;
        .status-dot { background: #22c55e; animation: pulse 1.5s infinite; }
      }
    }

    @keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }

    .btn {
      width: 100%; padding: 14px; border-radius: 12px; font-weight: 700; cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 10px; border: none; transition: all 0.2s;
      &.btn-primary { background: var(--primary-color); color: white; }
      &.btn-danger { background: #ef4444; color: white; }
      &:hover { transform: translateY(-2px); opacity: 0.9; }
    }

    .qr-display-card {
      display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden;
      min-height: 500px;
    }

    .qr-wrapper {
      display: flex; flex-direction: column; align-items: center; gap: 32px;
      transition: all 0.5s ease;
      &.blurred { filter: grayscale(1) opacity(0.5); }
    }

    .qrcode-box {
      padding: 20px; background: white; border-radius: 20px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.1); border: 1px solid #e2e8f0;
    }

    .qr-payload { font-family: monospace; color: #94a3b8; font-size: 0.8rem; }

    .placeholder {
      text-align: center; color: #94a3b8;
      i { font-size: 4rem; margin-bottom: 16px; opacity: 0.3; }
      p { font-weight: 500; }
    }

    /* Timer Ring Animation */
    .timer-ring {
      position: absolute; top: 20px; right: 20px; width: 60px; height: 60px;
      svg { transform: rotate(-90deg); }
      circle { fill: none; stroke-width: 8; stroke-linecap: round; }
      .bg-ring { stroke: #f1f5f9; }
      .progress-ring {
        stroke: var(--primary-color); stroke-dasharray: 283;
        transition: stroke-dashoffset 1s linear;
      }
      .timer-text {
        position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
        font-weight: 700; font-size: 0.9rem; color: var(--primary-color);
      }
    }

    .logs-card {
      h3 { margin-bottom: 20px; }
      .log-item {
        display: flex; align-items: center; gap: 12px; padding: 12px;
        border-radius: 10px; margin-bottom: 8px; border-left: 4px solid #cbd5e1;
        background: #f8fafc; font-size: 0.9rem;
        &.success { border-color: #22c55e; i { color: #22c55e; } }
        &.warning { border-color: #f59e0b; i { color: #f59e0b; } }
        .time { margin-left: auto; color: #94a3b8; font-size: 0.8rem; }
      }
    }
  `]
})
export class QrGeneratorComponent implements OnInit, OnDestroy {
  qrData: string = '';
  isRunning: boolean = false;
  timeLeft: number = 30;
  refreshInterval: number = 30;
  selectedSubject: string = 'Algorithmique';
  timer: any;
  dashOffset: number = 0;

  ngOnInit() {}

  ngOnDestroy() {
    this.stopSession();
  }

  toggleSession() {
    if (this.isRunning) {
      this.stopSession();
    } else {
      this.startSession();
    }
  }

  startSession() {
    this.isRunning = true;
    this.generateNewCode();
    this.startTimer();
  }

  stopSession() {
    this.isRunning = false;
    if (this.timer) clearInterval(this.timer);
    this.timeLeft = this.refreshInterval;
    this.dashOffset = 0;
  }

  startTimer() {
    this.timeLeft = this.refreshInterval;
    if (this.timer) clearInterval(this.timer);
    
    this.timer = setInterval(() => {
      this.timeLeft--;
      // Animation du cercle (dasharray de 283 pour un cercle de r=45)
      this.dashOffset = 283 - (this.timeLeft / this.refreshInterval) * 283;

      if (this.timeLeft <= 0) {
        this.generateNewCode();
        this.timeLeft = this.refreshInterval;
      }
    }, 1000);
  }

  generateNewCode() {
    // On simule un payload sécurisé : Matière + Timestamp + ID Aléatoire
    const timestamp = Date.now();
    const randomSalt = Math.random().toString(36).substring(7);
    this.qrData = `SESSION-${this.selectedSubject.substring(0,3).toUpperCase()}-${timestamp}-${randomSalt}`;
  }
}
