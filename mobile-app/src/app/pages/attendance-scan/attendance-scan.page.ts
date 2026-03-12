import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController, LoadingController, NavController } from '@ionic/angular';
import { AttendanceService } from '../../core/services/attendance.service';

@Component({
  selector: 'app-attendance-scan',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/home" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Scanner QR Code</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true" class="scan-content">
      <div class="scan-header">
        <div class="status-pills">
          <div class="pill" [class.active]="gpsActive">
            <span class="dot"></span>
            GPS {{ gpsActive ? 'Activé' : 'Recherche...' }}
          </div>
          <div class="pill active">
            <span class="dot online"></span>
            En ligne
          </div>
        </div>
        <h1>Émargement Séance</h1>
        <p>Positionnez le code dans le cadre</p>
      </div>

      <div class="scanner-container">
        <div class="scanner-window" [class.active]="isScanning">
          <div class="corners">
            <span class="tl"></span><span class="tr"></span>
            <span class="bl"></span><span class="br"></span>
          </div>
          
          <div class="scan-laser" *ngIf="isScanning"></div>
          
          <div class="scan-placeholder" *ngIf="!isScanning">
            <ion-icon name="qr-code-outline"></ion-icon>
            <p>Scanner prêt</p>
          </div>
        </div>
      </div>

      <div class="instructions-card">
        <div class="info-row">
          <ion-icon name="information-circle-outline"></ion-icon>
          <div class="text">
            <strong>Sécurité GPS</strong>
            <p>Votre position sera vérifiée pour valider l'amphi.</p>
          </div>
        </div>
      </div>

      <div class="action-zone">
        <ion-button 
          expand="block" 
          class="main-scan-btn" 
          (click)="handleScan()"
          [disabled]="isLoading">
          <ion-icon slot="start" [name]="isScanning ? 'stop-circle-outline' : 'scan-circle-outline'"></ion-icon>
          {{ isScanning ? 'Arrêter le Scanner' : 'Démarrer le Scan' }}
        </ion-button>
      </div>
    </ion-content>
  `,
  styles: [`
    .scan-content { --background: #0f172a; color: white; }

    ion-toolbar { --background: transparent; --color: white; }

    .scan-header {
      padding: 20px; text-align: center;
      .status-pills {
        display: flex; justify-content: center; gap: 10px; margin-bottom: 20px;
        .pill {
          background: rgba(255,255,255,0.1); padding: 6px 12px; border-radius: 99px;
          font-size: 0.7rem; font-weight: 700; display: flex; align-items: center; gap: 6px;
          .dot { width: 6px; height: 6px; border-radius: 50%; background: #94a3b8; }
          &.active { .dot { background: #22c55e; box-shadow: 0 0 10px #22c55e; } }
          .dot.online { background: #3b82f6; box-shadow: 0 0 10px #3b82f6; }
        }
      }
      h1 { font-size: 1.8rem; font-weight: 800; margin: 0; }
      p { opacity: 0.6; font-size: 0.9rem; margin-top: 5px; }
    }

    .scanner-container {
      display: flex; align-items: center; justify-content: center; height: 45vh;
    }

    .scanner-window {
      width: 260px; height: 260px; position: relative;
      background: rgba(255,255,255,0.03); border-radius: 40px;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      transition: all 0.3s;
      &.active { background: transparent; }

      .corners {
        position: absolute; width: 100%; height: 100%;
        span { position: absolute; width: 40px; height: 40px; border: 4px solid #3b82f6; border-radius: 15px; }
        .tl { top: -5px; left: -5px; border-right: 0; border-bottom: 0; }
        .tr { top: -5px; right: -5px; border-left: 0; border-bottom: 0; }
        .bl { bottom: -5px; left: -5px; border-right: 0; border-top: 0; }
        .br { bottom: -5px; right: -5px; border-left: 0; border-top: 0; }
      }

      .scan-laser {
        position: absolute; top: 10%; left: 10%; width: 80%; height: 2px;
        background: #3b82f6; box-shadow: 0 0 15px #3b82f6;
        animation: laserMove 2s ease-in-out infinite;
      }

      .scan-placeholder {
        text-align: center; color: rgba(255,255,255,0.2);
        ion-icon { font-size: 5rem; }
        p { font-weight: 700; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; margin-top: 10px; }
      }
    }

    @keyframes laserMove { 0%, 100% { top: 10%; } 50% { top: 90%; } }

    .instructions-card {
      margin: 20px; padding: 20px; background: rgba(255,255,255,0.05); border-radius: 20px;
      .info-row {
        display: flex; align-items: flex-start; gap: 15px;
        ion-icon { font-size: 1.5rem; color: #fbbf24; }
        .text {
          strong { display: block; font-size: 0.9rem; margin-bottom: 2px; }
          p { margin: 0; font-size: 0.8rem; opacity: 0.6; line-height: 1.4; }
        }
      }
    }

    .action-zone {
      padding: 20px 30px;
      .main-scan-btn {
        --background: #3b82f6; --color: white; --border-radius: 20px;
        --padding-top: 25px; --padding-bottom: 25px;
        font-weight: 800; font-size: 1.1rem; text-transform: none;
        box-shadow: 0 15px 30px rgba(59, 130, 246, 0.3);
      }
    }
  `]
})
export class AttendanceScanComponent {
  isScanning: boolean = false;
  gpsActive: boolean = false;
  isLoading: boolean = false;

  constructor(
    private attendanceService: AttendanceService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController
  ) {
    this.checkGps();
  }

  async checkGps() {
    try {
      const coords = await this.attendanceService.getCurrentLocation();
      this.gpsActive = !!coords;
    } catch (e) {
      this.gpsActive = false;
    }
  }

  async handleScan() {
    if (this.isScanning) {
      this.isScanning = false;
      return;
    }
    this.isScanning = true;
    // Simulate scan for demo if needed or call real service
    const result = await this.attendanceService.startScan();
    if (result) {
      this.processResult(result);
    }
  }

  async processResult(qrData: string) {
    this.isScanning = false;
    this.isLoading = true;
    
    const loading = await this.loadingCtrl.create({
      message: 'Vérification GPS...',
      spinner: 'crescent',
      cssClass: 'custom-loading'
    });
    await loading.present();

    try {
      const coords = await this.attendanceService.getCurrentLocation();
      const verified = this.attendanceService.verifyAttendance(qrData, coords);

      await loading.dismiss();
      this.isLoading = false;

      if (verified) {
        this.navCtrl.navigateForward('/lesson-entry');
      }
    } catch (error) {
      await loading.dismiss();
      this.isLoading = false;
    }
  }
}
