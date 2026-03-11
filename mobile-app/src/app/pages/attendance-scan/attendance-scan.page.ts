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
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Nouvel Émargement</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true" class="scan-page">
      <div class="header-banner">
        <h2>Prêt pour le scan ?</h2>
        <p>Alignez le QR Code au centre du viseur</p>
      </div>

      <div class="scan-area">
        <div class="scanner-frame" [class.scanning]="isScanning">
          <div class="corner top-left"></div>
          <div class="corner top-right"></div>
          <div class="corner bottom-left"></div>
          <div class="corner bottom-right"></div>
          <div class="scan-line" *ngIf="isScanning"></div>
          
          <div class="placeholder" *ngIf="!isScanning">
            <ion-icon name="qr-code-outline"></ion-icon>
          </div>
        </div>
      </div>

      <div class="status-panel">
        <div class="status-item">
          <div class="dot" [class.active]="gpsActive"></div>
          <span>GPS : {{ gpsActive ? 'Activé' : 'Vérification...' }}</span>
        </div>
        <div class="status-item">
          <div class="dot active"></div>
          <span>Connecté : Dr. Alou</span>
        </div>
      </div>

      <div class="action-footer">
        <ion-button 
          expand="block" 
          class="scan-btn" 
          (click)="handleScan()"
          [disabled]="isLoading">
          <ion-icon slot="start" [name]="isScanning ? 'close-circle-outline' : 'scan-outline'"></ion-icon>
          {{ isScanning ? 'Arrêter le scan' : 'Démarrer le Scanner' }}
        </ion-button>
      </div>
    </ion-content>
  `,
  styles: [`
    .scan-page {
      --background: #f8fafc;
    }

    .header-banner {
      padding: 30px 20px; text-align: center; background: white; border-bottom-left-radius: 40px; border-bottom-right-radius: 40px;
      h2 { font-weight: 800; color: #1e293b; font-size: 1.5rem; margin: 0; }
      p { color: #64748b; font-size: 0.9rem; margin-top: 5px; font-weight: 500; }
    }

    .scan-area {
      display: flex; align-items: center; justify-content: center; height: 50vh;
    }

    .scanner-frame {
      width: 250px; height: 250px; position: relative; display: flex; align-items: center; justify-content: center;
      background: rgba(255, 255, 255, 0.8); border-radius: 30px; border: 1px solid #e2e8f0;

      &.scanning { background: transparent; border: none; }

      .corner { position: absolute; width: 40px; height: 40px; border: 4px solid #2563eb; }
      .top-left { top: -10px; left: -10px; border-right: 0; border-bottom: 0; border-top-left-radius: 15px; }
      .top-right { top: -10px; right: -10px; border-left: 0; border-bottom: 0; border-top-right-radius: 15px; }
      .bottom-left { bottom: -10px; left: -10px; border-right: 0; border-top: 0; border-bottom-left-radius: 15px; }
      .bottom-right { bottom: -10px; right: -10px; border-left: 0; border-top: 0; border-bottom-right-radius: 15px; }

      .placeholder {
        ion-icon { font-size: 6rem; color: #cbd5e1; }
      }

      .scan-line {
        position: absolute; top: 0; width: 100%; height: 3px; background: #2563eb;
        box-shadow: 0 0 15px rgba(37, 99, 235, 0.8); animation: scanLine 2s linear infinite;
      }
    }

    @keyframes scanLine { 0% { top: 0; } 50% { top: 100%; } 100% { top: 0; } }

    .status-panel {
      display: flex; justify-content: center; gap: 30px; margin-top: 20px;
      .status-item {
        display: flex; align-items: center; gap: 8px; font-size: 0.85rem; font-weight: 600; color: #64748b;
        .dot { width: 10px; height: 10px; border-radius: 50%; background: #cbd5e1; &.active { background: #22c55e; } }
      }
    }

    .action-footer {
      padding: 30px;
      .scan-btn {
        --background: #1e293b; --border-radius: 20px; --padding-top: 20px; --padding-bottom: 20px;
        font-weight: 800; text-transform: none; font-size: 1.1rem;
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
      this.stopScan();
      return;
    }

    this.isScanning = true;
    const result = await this.attendanceService.startScan();
    
    if (result) {
      this.processResult(result);
    }
  }

  async processResult(qrData: string) {
    this.isScanning = false;
    this.isLoading = true;
    
    const loading = await this.loadingCtrl.create({
      message: 'Vérification de la position...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      const coords = await this.attendanceService.getCurrentLocation();
      const verified = this.attendanceService.verifyAttendance(qrData, coords);

      await loading.dismiss();
      this.isLoading = false;

      if (verified) {
        await this.showSuccess();
        this.navCtrl.navigateForward('/lesson-entry');
      }
    } catch (error) {
      await loading.dismiss();
      this.isLoading = false;
      this.showError('Impossible de récupérer la position GPS');
    }
  }

  async showSuccess() {
    const alert = await this.alertCtrl.create({
      header: 'Émargement Réussi !',
      message: 'Votre présence a été validée. Vous pouvez maintenant remplir votre cahier de textes.',
      buttons: ['OK']
    });
    await alert.present();
  }

  async showError(msg: string) {
    const alert = await this.alertCtrl.create({
      header: 'Échec émargement',
      message: msg,
      buttons: ['Réessayer']
    });
    await alert.present();
  }

  stopScan() {
    this.isScanning = false;
  }
}
