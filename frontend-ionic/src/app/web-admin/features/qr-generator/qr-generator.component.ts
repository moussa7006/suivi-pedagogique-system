import { Component, HostListener, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QRCodeComponent } from 'angularx-qrcode';
import { ScheduleService } from '../../core/services/schedule.service';
import { Seance } from '../../core/models/schedule.model';
import { NotificationService } from '../../shared/notification/notification.service';
import { sortByAlpha } from '../../core/utils/sort-utils';

@Component({
  selector: 'app-qr-generator',
  standalone: true,
  imports: [CommonModule, FormsModule, QRCodeComponent, RouterLink],
  template: `
    <main class="qr-page">
      <header class="qr-page__header">
        <a routerLink="/web/dashboard" class="back-link" aria-label="Retour au tableau de bord">
          <i class="pi pi-arrow-left"></i><span>Tableau de bord</span>
        </a>
        <div class="qr-page__title"><p>Émargement</p><h1>QR de séance</h1></div>
        <div class="auto-status"><span></span>Mise à jour automatique</div>
      </header>

      <section class="qr-workspace">
        <aside class="session-panel">
          <div class="panel-kicker"><i class="pi pi-calendar"></i>Séance diffusée</div>
          <h2>Choisir une séance</h2>
          <p class="panel-intro">Sélectionnez le cours dont vous souhaitez afficher le QR.</p>
          <label for="subject">Cours du jour</label>
          <div class="select-wrap">
            <select id="subject" [(ngModel)]="selectedSeanceId" (change)="onSeanceChange()">
              <option value="">Aucune séance sélectionnée</option>
              <option *ngFor="let s of seances" [value]="s.id">{{ s.dateCours }} · {{ s.heureDebutReelle }} — {{ s.heureFinReelle }}</option>
            </select>
            <i class="pi pi-chevron-down"></i>
          </div>

          <div class="session-details" *ngIf="selectedSeance; else noSelection">
            <div class="session-details__line"><i class="pi pi-clock"></i><div><span>Horaire</span><strong>{{ selectedSeance.heureDebutReelle }} — {{ selectedSeance.heureFinReelle }}</strong></div></div>
            <div class="session-details__line"><i class="pi pi-calendar-plus"></i><div><span>Date</span><strong>{{ selectedSeance.dateCours }}</strong></div></div>
          </div>
          <ng-template #noSelection><div class="session-empty"><i class="pi pi-calendar-times"></i><span>Choisissez une séance pour consulter sa diffusion.</span></div></ng-template>
        </aside>

        <section class="qr-stage" [class.qr-stage--active]="isRunning">
          <div class="qr-stage__topline">
            <div class="live-indicator" [class.live-indicator--active]="isRunning"><span></span>{{ isRunning ? 'Diffusion en cours' : 'En attente de séance' }}</div>
            <i class="pi pi-qrcode"></i>
          </div>
          <div class="qr-stage__content" *ngIf="isRunning && qrData; else unavailableQr">
            <p class="qr-stage__eyebrow">Présentez ce code aux enseignants</p>
            <div class="qrcode-box"><qrcode [qrdata]="qrData" [width]="qrWidth" errorCorrectionLevel="M"></qrcode></div>
            <div class="qr-stage__footer"><i class="pi pi-check-circle"></i><span>Code disponible pendant le créneau de la séance</span></div>
          </div>
          <ng-template #unavailableQr><div class="qr-unavailable"><div class="qr-unavailable__icon"><i class="pi pi-qrcode"></i></div><h2>QR non disponible</h2><p>Il apparaîtra automatiquement lorsqu’une séance du jour pourra être émargée.</p></div></ng-template>
        </section>
      </section>
    </main>
  `,
  styles: [
    `
      :host { display: block; }
      .qr-page { max-width: 1240px; margin: 0 auto; padding: 28px; color: #172033; }
      .qr-page__header { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 20px; margin-bottom: 30px; }
      .back-link { display: inline-flex; align-items: center; gap: 9px; width: fit-content; color: #526078; font-size: .86rem; font-weight: 700; text-decoration: none; }
      .back-link i { font-size: .82rem; }
      .qr-page__title { text-align: center; }
      .qr-page__title p { margin: 0 0 3px; color: #7a879b; font-size: .72rem; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
      .qr-page__title h1 { margin: 0; font-size: clamp(1.45rem, 3vw, 2rem); letter-spacing: -.04em; }
      .auto-status { justify-self: end; display: inline-flex; align-items: center; gap: 8px; color: #27734c; font-size: .78rem; font-weight: 800; }
      .auto-status span, .live-indicator span { width: 8px; height: 8px; border-radius: 50%; background: currentColor; }
      .auto-status span { box-shadow: 0 0 0 4px #e2f5e9; }
      .qr-workspace { display: grid; grid-template-columns: minmax(270px, .75fr) minmax(0, 1.45fr); min-height: 570px; border: 1px solid #e4e8ef; background: #fff; }
      .session-panel { padding: 34px; border-right: 1px solid #e4e8ef; }
      .panel-kicker { display: flex; align-items: center; gap: 8px; color: #526078; font-size: .72rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; }
      .panel-kicker i { color: #3367d6; }
      .session-panel h2 { margin: 14px 0 8px; font-size: 1.28rem; letter-spacing: -.03em; }
      .panel-intro { margin: 0 0 30px; color: #718096; font-size: .88rem; line-height: 1.55; }
      .session-panel label { display: block; margin-bottom: 9px; color: #39465b; font-size: .78rem; font-weight: 800; }
      .select-wrap { position: relative; }
      .select-wrap select { appearance: none; width: 100%; padding: 13px 38px 13px 13px; border: 1px solid #cfd7e3; border-radius: 8px; background: #fff; color: #172033; font: inherit; font-size: .86rem; cursor: pointer; }
      .select-wrap select:focus { outline: 3px solid #dbe7ff; border-color: #3367d6; }
      .select-wrap i { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); pointer-events: none; color: #607089; font-size: .75rem; }
      .session-details { margin-top: 32px; border-top: 1px solid #e7ebf1; }
      .session-details__line { display: flex; gap: 12px; padding: 17px 0; border-bottom: 1px solid #e7ebf1; }
      .session-details__line > i { margin-top: 3px; color: #65748a; font-size: .9rem; }
      .session-details__line div { display: grid; gap: 3px; }
      .session-details__line span { color: #7a879b; font-size: .72rem; font-weight: 700; }
      .session-details__line strong { color: #293548; font-size: .86rem; }
      .session-empty { display: flex; gap: 10px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e7ebf1; color: #7a879b; font-size: .84rem; line-height: 1.45; }
      .qr-stage { display: flex; flex-direction: column; min-width: 0; padding: 26px 34px 34px; background: #172033; color: #fff; }
      .qr-stage--active { background: linear-gradient(145deg, #14213a 0%, #0e1728 100%); }
      .qr-stage__topline { display: flex; align-items: center; justify-content: space-between; color: #aab8cf; }
      .qr-stage__topline > i { font-size: 1.25rem; }
      .live-indicator { display: inline-flex; align-items: center; gap: 8px; color: #aab8cf; font-size: .74rem; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; }
      .live-indicator--active { color: #62dba0; }
      .live-indicator--active span { box-shadow: 0 0 0 5px rgba(98,219,160,.13); }
      .qr-stage__content, .qr-unavailable { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
      .qr-stage__eyebrow { margin: 0 0 22px; color: #c8d4e7; font-size: .86rem; }
      .qrcode-box { display: grid; place-items: center; padding: clamp(16px, 3vw, 26px); background: #fff; border-radius: 4px; box-shadow: 0 22px 55px rgba(0,0,0,.3); }
      .qr-stage__footer { display: inline-flex; align-items: center; gap: 8px; margin-top: 22px; color: #b6c5da; font-size: .78rem; }
      .qr-stage__footer i { color: #62dba0; }
      .qr-unavailable__icon { display: grid; place-items: center; width: 58px; height: 58px; margin-bottom: 17px; border: 1px solid #3c4b63; border-radius: 50%; color: #9eafc8; font-size: 1.45rem; }
      .qr-unavailable h2 { margin: 0 0 8px; font-size: 1.22rem; }
      .qr-unavailable p { max-width: 310px; margin: 0; color: #aab8cf; font-size: .86rem; line-height: 1.55; }
      @media (max-width: 800px) { .qr-page { padding: 18px; } .qr-page__header { grid-template-columns: 1fr auto; } .qr-page__title { grid-row: 2; grid-column: 1 / -1; text-align: left; } .qr-workspace { grid-template-columns: 1fr; } .session-panel { border-right: 0; border-bottom: 1px solid #e4e8ef; } .qr-stage { min-height: 480px; } }
      @media (max-width: 480px) { .qr-page { padding: 14px; } .back-link span, .auto-status { font-size: .7rem; } .session-panel, .qr-stage { padding: 24px 20px; } .qr-stage { min-height: 420px; } }
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
    private readonly cdr: ChangeDetectorRef,
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
    this.scheduleService.getAllSeances().subscribe({
      next: (data) => {
        this.seances = sortByAlpha(
          (data || []).filter((seance) => this.isTodaySeance(seance)),
          (seance) => `${seance.dateCours || ''} ${seance.heureDebutReelle || ''}`,
        );
        this.autoSelectSession();
        this.cdr.detectChanges();
      },
      error: () => {
        this.seances = [];
        this.clearQrDisplay();
        this.cdr.detectChanges();
      },
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
    this.cdr.detectChanges();
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
    this.cdr.detectChanges();
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
    this.cdr.detectChanges();
  }

  private updateQrDisplayFromSelectedSeance() {
    if (!this.selectedSeance || !this.canDisplayQrForSeance(this.selectedSeance)) {
      this.clearQrDisplay();
      return;
    }

    this.qrData = this.selectedSeance.qrCodeToken || '';
    this.isRunning = !!this.qrData;
    this.cdr.detectChanges();
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
