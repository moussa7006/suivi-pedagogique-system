import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QRCodeComponent } from 'angularx-qrcode';
import { catchError, interval, of, startWith, Subscription, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';

interface QrSalleDisplay {
  seanceId: number;
  salleId: number;
  salleNom: string;
  qrCodeToken: string;
  dateHeureExpiration: string;
  enseignantNomPrenom?: string;
  classeLibelle?: string;
}

interface SalleDisplayInfo {
  id: number;
  nom?: string;
  salleNom?: string;
  batiment?: string;
}

@Component({
  selector: 'app-salle-display',
  standalone: true,
  imports: [CommonModule, QRCodeComponent],
  template: `
    <div class="screen-shell">
      <div class="screen-background"></div>

      <section class="display-card" [class.empty-card]="!qr">
        <div class="display-header">
          <div>
            <span class="eyebrow">EduTrack</span>
            <h1>{{ displayTitle }}</h1>
          </div>
          <div class="live-badge" [class.active]="!!qr">
            <span></span>
            {{ qr ? 'QR actif' : 'En attente' }}
          </div>
        </div>

        <main *ngIf="qr; else emptyState" class="qr-layout">
          <div class="qr-card">
            <qrcode
              [qrdata]="qr.qrCodeToken"
              [width]="qrWidth"
              [errorCorrectionLevel]="'M'"
            ></qrcode>
          </div>

          <div class="session-info">
            <p class="label">Séance en cours</p>
            <h2>{{ qr.classeLibelle || 'Classe non renseignée' }}</h2>
            <p class="teacher">{{ qr.enseignantNomPrenom || 'Enseignant non renseigné' }}</p>
            <div class="expiration">
              Valable jusqu’à <strong>{{ qr.dateHeureExpiration | date: 'HH:mm' }}</strong>
            </div>
          </div>
        </main>

        <ng-template #emptyState>
          <div class="empty-state">
            <div class="empty-icon">QR</div>
            <h2>Aucun QR code actif</h2>
            <p>Le QR code apparaîtra automatiquement lorsqu’il sera généré pour cette salle.</p>
            <small *ngIf="lastError">{{ lastError }}</small>
          </div>
        </ng-template>
      </section>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
        min-height: 100dvh;
      }

      .screen-shell {
        position: relative;
        min-height: 100vh;
        min-height: 100dvh;
        overflow-x: hidden;
        overflow-y: auto;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: clamp(12px, 3.5vw, 52px);
        background: #020617;
        color: #fff;
      }

      .screen-background {
        position: absolute;
        inset: -20%;
        background:
          radial-gradient(circle at 20% 20%, rgba(37, 99, 235, 0.45), transparent 28%),
          radial-gradient(circle at 80% 30%, rgba(14, 165, 233, 0.35), transparent 26%),
          radial-gradient(circle at 50% 90%, rgba(16, 185, 129, 0.32), transparent 30%);
        filter: blur(12px);
      }

      .display-card {
        position: relative;
        z-index: 1;
        width: min(1180px, 100%);
        min-height: min(720px, calc(100vh - 24px));
        min-height: min(720px, calc(100dvh - 24px));
        background: rgba(15, 23, 42, 0.78);
        border: 1px solid rgba(255, 255, 255, 0.18);
        border-radius: 32px;
        box-shadow: 0 32px 90px rgba(0, 0, 0, 0.45);
        backdrop-filter: blur(24px);
        padding: clamp(16px, 3.6vw, 48px);
        display: flex;
        flex-direction: column;
        gap: clamp(20px, 3vw, 34px);
      }

      .display-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 24px;
      }

      .eyebrow {
        display: inline-flex;
        margin-bottom: 8px;
        color: #93c5fd;
        font-size: clamp(0.85rem, 1.4vw, 1.05rem);
        font-weight: 800;
        letter-spacing: 0.24em;
        text-transform: uppercase;
      }

      h1 {
        margin: 0;
        max-width: 100%;
        overflow-wrap: anywhere;
        font-size: clamp(2.1rem, 4.6vw, 5rem);
        line-height: 1;
        letter-spacing: -0.05em;
      }

      .live-badge {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 12px 18px;
        border-radius: 999px;
        background: rgba(148, 163, 184, 0.16);
        color: #cbd5e1;
        font-weight: 800;
        white-space: nowrap;
      }

      .live-badge span {
        width: 10px;
        height: 10px;
        border-radius: 999px;
        background: #94a3b8;
      }

      .live-badge.active {
        color: #86efac;
        background: rgba(34, 197, 94, 0.16);
      }

      .live-badge.active span {
        background: #22c55e;
        box-shadow: 0 0 0 8px rgba(34, 197, 94, 0.14);
      }

      .qr-layout {
        flex: 1;
        display: grid;
        grid-template-columns: minmax(280px, 470px) minmax(0, 1fr);
        align-items: center;
        gap: clamp(24px, 4.8vw, 64px);
      }

      .qr-card {
        background: #fff;
        border-radius: 28px;
        width: min(100%, 470px);
        padding: clamp(10px, 2.4vw, 28px);
        overflow: hidden;
        display: grid;
        place-items: center;
        box-shadow: 0 24px 80px rgba(0, 0, 0, 0.35);
      }

      .session-info {
        min-width: 0;
      }

      .session-info .label {
        margin: 0 0 12px;
        color: #93c5fd;
        font-size: clamp(0.95rem, 1.6vw, 1.2rem);
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.18em;
      }

      .session-info h2 {
        margin: 0;
        overflow-wrap: anywhere;
        font-size: clamp(1.9rem, 4.2vw, 4.2rem);
        line-height: 1.05;
        letter-spacing: -0.04em;
      }

      .teacher {
        margin: clamp(12px, 2vw, 20px) 0;
        color: #e2e8f0;
        overflow-wrap: anywhere;
        font-size: clamp(1.2rem, 2.5vw, 2.25rem);
        font-weight: 700;
      }

      .expiration {
        display: inline-flex;
        flex-wrap: wrap;
        justify-content: center;
        padding: clamp(12px, 1.8vw, 16px) clamp(14px, 2vw, 20px);
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.1);
        color: #dbeafe;
        font-size: clamp(1rem, 1.7vw, 1.3rem);
      }

      .empty-card {
        justify-content: center;
      }

      .empty-state {
        margin: auto;
        max-width: 680px;
        text-align: center;
      }

      .empty-icon {
        width: 132px;
        height: 132px;
        margin: 0 auto 28px;
        border-radius: 32px;
        display: grid;
        place-items: center;
        border: 2px dashed rgba(255, 255, 255, 0.28);
        color: #93c5fd;
        font-size: 2rem;
        font-weight: 900;
      }

      .empty-state h2 {
        margin: 0 0 14px;
        font-size: clamp(2rem, 5vw, 4rem);
        letter-spacing: -0.05em;
      }

      .empty-state p {
        margin: 0;
        color: #cbd5e1;
        font-size: clamp(1.1rem, 2.5vw, 1.5rem);
      }

      .empty-state small {
        display: block;
        margin-top: 18px;
        color: #fca5a5;
      }

      @media (max-width: 960px) {
        .qr-layout {
          grid-template-columns: 1fr;
          justify-items: center;
          text-align: center;
        }

        .display-header {
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
      }

      @media (max-height: 700px) and (min-width: 861px) {
        .screen-shell {
          align-items: flex-start;
        }

        .display-card {
          min-height: auto;
        }

        h1 {
          font-size: clamp(1.9rem, 3.4vw, 3.6rem);
        }

        .session-info h2 {
          font-size: clamp(1.7rem, 3.2vw, 3.1rem);
        }

        .teacher {
          font-size: clamp(1.05rem, 2vw, 1.7rem);
        }
      }

      @media (max-width: 860px) {
        .display-card {
          min-height: calc(100vh - 24px);
          min-height: calc(100dvh - 24px);
        }
      }

      @media (max-width: 520px) {
        .screen-shell {
          align-items: stretch;
          padding: 10px;
        }

        .display-card {
          border-radius: 22px;
          gap: 20px;
        }

        .eyebrow {
          letter-spacing: 0.18em;
        }

        .live-badge {
          width: 100%;
          justify-content: center;
          padding: 10px 14px;
        }

        .qr-card {
          border-radius: 20px;
          width: min(100%, 390px);
        }

        .teacher {
          margin: 12px 0;
        }

        .expiration {
          width: 100%;
          justify-content: center;
        }
      }

      @media (max-width: 380px) {
        .display-card {
          padding: 14px;
        }

        .empty-icon {
          width: 96px;
          height: 96px;
          margin-bottom: 18px;
        }
      }
    `,
  ],
})
export class SalleDisplayComponent implements OnInit, OnDestroy {
  qr: QrSalleDisplay | null = null;
  salleNom = '';
  lastError = '';
  qrWidth = 420;
  private subscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.updateQrWidth();
    const token = this.route.snapshot.paramMap.get('token') || '';
    this.loadSalleInfo(token);

    this.subscription = interval(5000)
      .pipe(
        startWith(0),
        switchMap(() => this.loadActiveQrCode(token)),
      )
      .subscribe((qr) => {
        this.qr = qr;
        if (qr?.salleNom) {
          this.salleNom = qr.salleNom;
        }
      });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  get displayTitle(): string {
    const nomSalle = this.qr?.salleNom || this.salleNom;
    return nomSalle ? `Écran de salle - ${nomSalle}` : 'Écran de salle';
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.updateQrWidth();
  }

  private updateQrWidth(): void {
    if (typeof window === 'undefined') {
      this.qrWidth = 440;
      return;
    }

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const availableByWidth = viewportWidth <= 520 ? viewportWidth - 82 : viewportWidth * 0.38;
    const availableByHeight = viewportHeight * (viewportHeight < 700 ? 0.38 : 0.48);

    this.qrWidth = Math.round(Math.max(230, Math.min(440, availableByWidth, availableByHeight)));
  }

  private loadSalleInfo(token: string): void {
    if (!token) {
      this.lastError = 'Token d’affichage manquant.';
      return;
    }

    this.http
      .get<SalleDisplayInfo>(
        `${environment.apiUrl}/ecrans/salles/${encodeURIComponent(token)}/info`,
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 403 || error.status === 404 || error.status === 500) {
            this.lastError = 'Écran de salle non autorisé ou token invalide.';
          }
          return of(null);
        }),
      )
      .subscribe((salle) => {
        const apiSalleNom = this.formatSalleNom(salle);
        if (apiSalleNom) {
          this.salleNom = apiSalleNom;
        }
      });
  }

  private formatSalleNom(salle: SalleDisplayInfo | null): string {
    if (!salle) {
      return '';
    }

    return salle.nom || salle.salleNom || '';
  }

  private loadActiveQrCode(token: string) {
    if (!token) {
      this.lastError = 'Token d’affichage manquant.';
      return of(null);
    }

    return this.http
      .get<QrSalleDisplay>(
        `${environment.apiUrl}/ecrans/salles/${encodeURIComponent(token)}/qr-actif`,
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.qr = null;
          if (error.status === 204 || error.status === 0) {
            this.lastError = '';
          } else if (error.status === 403 || error.status === 404 || error.status === 500) {
            this.lastError = 'Écran de salle non autorisé ou token invalide.';
          } else {
            this.lastError = '';
          }
          return of(null);
        }),
      );
  }
}
