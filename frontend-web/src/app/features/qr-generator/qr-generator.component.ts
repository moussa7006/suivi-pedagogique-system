import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QRCodeComponent } from 'angularx-qrcode';
import { ScheduleService } from '../../core/services/schedule.service';
import { Seance } from '../../core/models/schedule.model';
import { NotificationService } from '../../shared/notification/notification.service';

@Component({
  selector: 'app-qr-generator',
  standalone: true,
  imports: [CommonModule, FormsModule, QRCodeComponent, RouterLink],
  template: `
    <div class="qr-container">
      <div class="page-header">
        <h1>Générateur de QR Code Dynamique</h1>
        <p>Sécurisez l'émargement avec des codes à durée limitée</p>
      </div>

      <!-- Retour (visibilité premium) -->
      <div class="qr-back">
        <a
          routerLink="/dashboard"
          class="btn-back-arrow"
          aria-label="Retour au tableau de bord"
          title="Retour au tableau de bord"
        >
          <i class="pi pi-arrow-left"></i>
        </a>
      </div>

      <div class="grid-layout">
        <!-- Section Paramètres -->
        <div class="card settings-card">
          <div class="settings-header">
            <h3><i class="pi pi-cog"></i> Configuration de la Session</h3>
            <span class="auto-badge"><i class="pi pi-bolt"></i> Mode Auto Activé</span>
          </div>

          <div class="form-group">
            <label for="subject"><i class="pi pi-book"></i> Séance Active</label>
            <select id="subject" [(ngModel)]="selectedSeanceId" (change)="onSeanceChange()">
              <option value="">Sélectionnez une séance</option>
              <option *ngFor="let s of seances" [value]="s.id">
                {{ s.dateCours }} - {{ s.heureDebutReelle }} à {{ s.heureFinReelle }}
              </option>
            </select>
          </div>

          <div class="session-status" [ngClass]="{ active: isRunning }">
            <div class="status-dot"></div>
            <span>{{
              isRunning
                ? 'QR Code disponible pour le scan'
                : 'Aucun QR Code disponible pour cette séance'
            }}</span>
          </div>

          <p class="auto-note">
            <i class="pi pi-info-circle"></i>
            La génération du QR Code est automatique. L’administrateur ne peut pas la démarrer ni
            l’arrêter depuis cet écran.
          </p>
        </div>

        <!-- Section QR Code -->
        <div class="card qr-display-card">
          <div class="qr-wrapper" [class.blurred]="!isRunning">
            @if (isRunning && qrData) {
              <div class="qrcode-box">
                <qrcode [qrdata]="qrData" [width]="qrWidth" [errorCorrectionLevel]="'M'"></qrcode>
              </div>
              <p class="qr-payload" style="text-align: center; margin-top: 15px;">
                <i class="pi pi-check-circle" style="color: #10b981;"></i> QR Code actif pour toute
                la durée du cours
              </p>
            } @else {
              <div class="placeholder">
                <div class="placeholder-icon">
                  <i class="pi pi-shield"></i>
                </div>
                <p class="placeholder-text">Aucun QR Code actif à afficher</p>
                <p class="placeholder-sub">
                  Le QR Code apparaîtra ici lorsqu’il sera généré automatiquement par le système
                </p>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Logs de session -->
      <div class="card logs-card" *ngIf="false">
        <div class="logs-header">
          <h3><i class="pi pi-history"></i> Historique des scans récents</h3>
          <span class="log-count">{{ todayLogs.length }} événements</span>
        </div>
        <div class="log-list">
          <div class="log-item success">
            <div class="log-icon">
              <i class="pi pi-check-circle"></i>
            </div>
            <div class="log-content">
              <span class="log-message"
                ><strong>K. Keita</strong> a émargé avec succès (Position GPS validée)</span
              >
              <span class="log-time">14:32:05</span>
            </div>
          </div>
          <div class="log-item warning">
            <div class="log-icon">
              <i class="pi pi-exclamation-triangle"></i>
            </div>
            <div class="log-content">
              <span class="log-message"
                >Historique non disponible en temps réel ici. Veuillez vérifier le tableau de
                bord.</span
              >
              <span class="log-time">-</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .qr-container {
        display: flex;
        flex-direction: column;
        padding: clamp(12px, 3vw, 24px);
        gap: clamp(12px, 3vw, 24px);
        max-width: 100%;

        @media (max-width: 480px) {
          gap: 14px;
          padding: 12px 8px;
        }
      }

      .page-header {
        display: flex;
        flex-direction: column;
        gap: 16px;
        flex-wrap: wrap;

        h1 {
          margin: 0;
          font-size: clamp(1.1rem, 3vw, 1.6rem);
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;

          @media (max-width: 480px) {
            font-size: 1.3rem;
          }
        }

        p {
          margin: 0;
          color: #64748b;
          font-size: clamp(0.8rem, 2.5vw, 0.9rem);
          font-weight: 500;
        }
      }

      .grid-layout {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;

        @media (max-width: 768px) {
          grid-template-columns: 1fr;
        }
      }

      .card {
        background: white;
        border: 2px solid rgba(226, 232, 240, 0.8);
        border-radius: 14px;
        padding: 20px;
        transition:
          transform 0.25s cubic-bezier(0.22, 1, 0.36, 1),
          box-shadow 0.25s ease,
          border-color 0.25s ease;

        &:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
          border-color: rgba(59, 130, 246, 0.2);
        }
      }

      .settings-card {
        .settings-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;

          h3 {
            margin: 0;
            font-size: 1.05rem;
            font-weight: 700;
            color: #1e293b;
            display: flex;
            align-items: center;
            gap: 10px;

            i {
              color: var(--primary-color);
              font-size: 1.1rem;
            }
          }

          .auto-badge {
            font-size: 0.75rem;
            font-weight: 700;
            color: #16a34a;
            background: rgba(34, 197, 94, 0.15);
            padding: 4px 10px;
            border-radius: 20px;
            display: flex;
            align-items: center;
            gap: 5px;
          }
        }
      }

      .form-group {
        margin-bottom: 18px;

        label {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
          font-size: 0.8rem;
          font-weight: 600;
          color: #475569;

          i {
            color: #94a3b8;
            font-size: 0.85rem;
          }
        }

        select,
        input {
          width: 100%;
          padding: 10px 14px;
          border-radius: 10px;
          border: 2px solid rgba(226, 232, 240, 0.8);
          background: white;
          font-size: 0.9rem;
          color: #0f172a;
          transition: all 0.2s ease;

          &:focus {
            outline: none;
            border-color: rgba(37, 99, 235, 0.6);
            box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
          }

          &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            background: rgba(241, 245, 249, 0.8);
          }
        }

        select {
          cursor: pointer;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          padding-right: 40px;
        }
      }

      .session-status {
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 20px 0;
        padding: 10px 14px;
        border-radius: 10px;
        background: rgba(241, 245, 249, 0.6);
        color: #64748b;
        font-weight: 600;
        font-size: 0.85rem;
        border: 1px solid rgba(226, 232, 240, 0.6);
        transition: all 0.3s ease;

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #94a3b8;
          flex-shrink: 0;
        }

        &.active {
          background: rgba(220, 252, 231, 0.8);
          color: #166534;
          border: 1px solid rgba(187, 240, 208, 0.5);

          .status-dot {
            background: #22c55e;
            animation: pulse 1.5s infinite;
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4);
          }
        }
      }

      @keyframes pulse {
        0% {
          opacity: 1;
          transform: scale(1);
          box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4);
        }
        50% {
          opacity: 0.6;
          transform: scale(1.15);
          box-shadow: 0 0 0 8px rgba(34, 197, 94, 0);
        }
        100% {
          opacity: 1;
          transform: scale(1);
          box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
        }
      }

      .btn {
        width: 100%;
        padding: 12px 20px;
        border-radius: 10px;
        font-weight: 700;
        font-size: 0.9rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        border: none;
        transition:
          transform 0.2s ease,
          background-color 0.2s ease,
          box-shadow 0.2s ease;

        i {
          font-size: 1.05rem;
        }

        &.btn-primary {
          background: var(--primary-color);
          color: white;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);

          &:hover {
            transform: translateY(-3px) scale(1.02);
            box-shadow: 0 8px 16px rgba(37, 99, 235, 0.3);
          }

          &:active {
            transform: translateY(0) scale(1);
          }
        }

        &.btn-danger {
          background: #ef4444;
          color: white;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);

          &:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 16px rgba(239, 68, 68, 0.35);
          }
        }
      }

      .qr-display-card {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        min-height: clamp(340px, 52vw, 480px);
        overflow: hidden;
      }

      .qr-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: clamp(16px, 4vw, 32px);
        transition: all 0.4s ease;
        width: 100%;
        max-width: min(380px, 100%);

        &.blurred {
          filter: grayscale(0.7) opacity(0.5);
        }
      }

      .qrcode-box {
        width: min(100%, 380px);
        padding: clamp(10px, 3vw, 20px);
        border-radius: 14px;
        border: 2px dashed rgba(226, 232, 240, 0.9);
        background: #f8fafc;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        transition: all 0.3s ease;

        .session-active & {
          border: 2px solid rgba(37, 99, 235, 0.3);
          background: white;
        }
      }

      .qr-payload {
        font-family: 'SF Mono', 'Fira Code', monospace;
        color: #94a3b8;
        font-size: 0.78rem;
        background: rgba(241, 245, 249, 0.6);
        padding: 6px 14px;
        border-radius: 8px;
        border: 1px solid rgba(226, 232, 240, 0.5);
        letter-spacing: 0.02em;
      }

      .placeholder {
        text-align: center;
        padding: 48px 32px;

        .placeholder-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 20px;
          border-radius: 14px;
          border: 2px dashed rgba(226, 232, 240, 0.9);
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;

          i {
            font-size: 2.2rem;
            color: rgba(37, 99, 235, 0.45);
          }
        }

        .placeholder-text {
          font-weight: 600;
          color: #475569;
          font-size: 0.95rem;
          margin: 0 0 6px;
        }

        .placeholder-sub {
          font-size: 0.82rem;
          color: #94a3b8;
          font-weight: 500;
          margin: 0;
        }
      }

      .timer-ring {
        position: absolute;
        top: 20px;
        right: 20px;
        width: 60px;
        height: 60px;

        svg {
          transform: rotate(-90deg);
          width: 100%;
          height: 100%;
        }

        circle {
          fill: none;
          stroke-width: 6;
          stroke-linecap: round;
        }

        .bg-ring {
          stroke: rgba(241, 245, 249, 0.7);
        }

        .progress-ring {
          stroke: var(--primary-color);
          stroke-dasharray: 283;
          transition: stroke-dashoffset 1s linear;
          filter: drop-shadow(0 2px 3px rgba(37, 99, 235, 0.25));
        }

        .timer-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-weight: 700;
          font-size: 0.85rem;
          color: var(--primary-color);
          background: white;
          border-radius: 50%;
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
        }
      }

      .logs-card {
        padding: 20px;

        .logs-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;

          h3 {
            margin: 0;
            font-size: 1rem;
            font-weight: 700;
            color: #1e293b;
            display: flex;
            align-items: center;
            gap: 8px;

            i {
              color: #64748b;
              font-size: 1.05rem;
            }
          }

          .log-count {
            font-size: 0.75rem;
            color: #64748b;
            font-weight: 600;
            background: rgba(241, 245, 249, 0.6);
            padding: 4px 10px;
            border-radius: 999px;
          }
        }

        .log-list {
          display: flex;
          flex-direction: column;
        }

        .log-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px;
          border-radius: 10px;
          margin-bottom: 8px;
          background: rgba(248, 250, 252, 0.5);
          border: 1px solid transparent;
          transition:
            background 0.2s ease,
            border-color 0.2s ease;

          &:hover {
            background: rgba(37, 99, 235, 0.03);
            border-color: rgba(37, 99, 235, 0.08);
          }

          .log-icon {
            flex-shrink: 0;
            width: 32px;
            height: 32px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1rem;
            background: white;
            border: 1px solid rgba(226, 232, 240, 0.5);
          }

          .log-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 3px;
            min-width: 0;

            .log-message {
              font-size: 0.85rem;
              color: #334155;
              line-height: 1.35;

              strong {
                color: #0f172a;
                font-weight: 600;
              }
            }

            .log-time {
              font-size: 0.72rem;
              color: #94a3b8;
              font-weight: 600;
            }
          }

          &.success {
            .log-icon {
              color: #22c55e;
              border-color: rgba(34, 197, 94, 0.25);
            }
          }

          &.warning {
            .log-icon {
              color: #f59e0b;
              border-color: rgba(245, 158, 11, 0.25);
            }
          }
        }
      }

      @media (max-width: 768px) {
        .grid-layout {
          grid-template-columns: 1fr;
        }

        .settings-card .settings-header {
          align-items: flex-start;
          flex-direction: column;
          gap: 10px;
        }

        .qr-display-card {
          min-height: 380px;
        }
      }

      @media (max-width: 480px) {
        .card {
          padding: 14px;
        }

        .qr-display-card {
          min-height: 330px;
        }

        .placeholder {
          padding: 32px 12px;
        }
      }
    `,
  ],
})
export class QrGeneratorComponent implements OnInit, OnDestroy {
  qrData: string = '';
  errorMessage: string = '';
  isRunning: boolean = false;
  seances: Seance[] = [];
  selectedSeanceId: string | number = '';
  selectedSeance: Seance | null = null;
  qrWidth = 320;
  pollingTimer: any;
  todayLogs: any[] = [
    { id: 1, type: 'success' },
    { id: 2, type: 'warning' },
  ];

  constructor(
    private scheduleService: ScheduleService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    this.updateQrWidth();
    this.loadSeances();
    this.pollingTimer = setInterval(() => {
      this.loadSeances();
    }, 60000); // Polling every 60s
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.updateQrWidth();
  }

  loadSeances() {
    this.scheduleService.getAllSeances().subscribe((data) => {
      this.seances = (data || []).filter((seance) => this.isTodaySeance(seance));
      this.autoSelectSession();
    });
  }

  autoSelectSession() {
    let bestSeance: Seance | null = null;

    for (const s of this.seances) {
      if (this.canDisplayQrForSeance(s)) {
        bestSeance = s;
        break;
      }
    }

    if (bestSeance && bestSeance.id !== Number(this.selectedSeanceId)) {
      this.selectedSeanceId = bestSeance.id!;
      this.onSeanceChange();
    } else if (bestSeance) {
      this.selectedSeance = bestSeance;
      this.updateQrDisplayFromSelectedSeance();
    } else if (!bestSeance) {
      this.clearQrDisplay();
      this.selectedSeanceId = '';
      this.selectedSeance = null;
    }
  }

  onSeanceChange() {
    this.errorMessage = '';

    if (this.selectedSeanceId) {
      this.selectedSeance = this.seances.find((s) => s.id == this.selectedSeanceId) || null;
      this.updateQrDisplayFromSelectedSeance();
    } else {
      this.selectedSeance = null;
      this.clearQrDisplay();
    }
  }

  ngOnDestroy() {
    this.clearQrDisplay();
    if (this.pollingTimer) {
      clearInterval(this.pollingTimer);
    }
  }

  private updateQrWidth() {
    const viewport = typeof window !== 'undefined' ? window.innerWidth : 1200;
    this.qrWidth = Math.max(220, Math.min(320, viewport - 96));
  }

  private updateQrDisplayFromSelectedSeance() {
    if (!this.selectedSeance || !this.canDisplayQrForSeance(this.selectedSeance)) {
      this.clearQrDisplay();
      return;
    }

    this.qrData = this.selectedSeance.qrCodeToken || '';
    this.isRunning = !!this.qrData;
  }

  private canDisplayQrForSeance(seance: Seance): boolean {
    if (!seance.qrCodeToken || (seance.statut !== 'PREVUE' && seance.statut !== 'EN_COURS')) {
      return false;
    }

    const startDateTime = this.getDateTimeFromSeance(seance.dateCours, seance.heureDebutReelle);
    const endDateTime = this.getDateTimeFromSeance(seance.dateCours, seance.heureFinReelle);

    if (!startDateTime || !endDateTime) {
      return false;
    }

    const now = new Date();
    const visibleFrom = new Date(startDateTime.getTime() - 15 * 60000);

    return now >= visibleFrom && now <= endDateTime;
  }

  private isTodaySeance(seance: Seance): boolean {
    const seanceDate = this.getDateTimeFromSeance(seance.dateCours, seance.heureDebutReelle);
    const now = new Date();

    return (
      !!seanceDate &&
      seanceDate.getFullYear() === now.getFullYear() &&
      seanceDate.getMonth() === now.getMonth() &&
      seanceDate.getDate() === now.getDate()
    );
  }

  private getDateTimeFromSeance(dateValue: string | any, timeValue: string | any): Date | null {
    const dateParts = this.extractDateParts(dateValue);
    const timeParts = this.extractTimeParts(timeValue);

    if (!dateParts || !timeParts) {
      return null;
    }

    return new Date(
      dateParts.year,
      dateParts.month - 1,
      dateParts.day,
      timeParts.hours,
      timeParts.minutes,
      timeParts.seconds,
      0,
    );
  }

  private extractDateParts(
    dateValue: string | any,
  ): { year: number; month: number; day: number } | null {
    if (!dateValue) {
      return null;
    }

    if (typeof dateValue === 'string') {
      const [year, month, day] = dateValue.split('-').map((part) => Number(part));
      if (year && month && day) {
        return { year, month, day };
      }
    }

    if (Array.isArray(dateValue) && dateValue.length >= 3) {
      return { year: Number(dateValue[0]), month: Number(dateValue[1]), day: Number(dateValue[2]) };
    }

    return null;
  }

  private extractTimeParts(
    timeValue: string | any,
  ): { hours: number; minutes: number; seconds: number } | null {
    if (!timeValue) {
      return null;
    }

    if (typeof timeValue === 'string') {
      const [hours, minutes, seconds = 0] = timeValue.split(':').map((part) => Number(part));
      if (Number.isFinite(hours) && Number.isFinite(minutes)) {
        return { hours, minutes, seconds: Number(seconds) || 0 };
      }
    }

    if (Array.isArray(timeValue) && timeValue.length >= 2) {
      return {
        hours: Number(timeValue[0]),
        minutes: Number(timeValue[1]),
        seconds: Number(timeValue[2]) || 0,
      };
    }

    return null;
  }

  private clearQrDisplay() {
    this.isRunning = false;
    this.qrData = '';
  }
}
