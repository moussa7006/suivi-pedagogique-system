import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../shared/notification/notification.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <form class="auth-card" (ngSubmit)="submit()">
        <div class="auth-icon"><i class="pi pi-shield"></i></div>
        <h2>Créer un nouveau mot de passe</h2>
        <p>Renseignez le code reçu par email puis choisissez un mot de passe conforme.</p>

        <label for="email">Adresse email</label>
        <input
          id="email"
          name="email"
          type="email"
          [(ngModel)]="email"
          placeholder="Email"
          autocomplete="email"
          required
        />

        <label for="code">Code de vérification</label>
        <input
          id="code"
          name="code"
          type="text"
          inputmode="numeric"
          maxlength="6"
          [(ngModel)]="code"
          placeholder="Code à 6 chiffres"
          autocomplete="one-time-code"
          required
        />

        <label for="newPassword">Nouveau mot de passe</label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          [(ngModel)]="newPassword"
          placeholder="Nouveau mot de passe"
          autocomplete="new-password"
          required
        />

        <label for="confirmPassword">Confirmation</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          [(ngModel)]="confirmPassword"
          placeholder="Confirmer le mot de passe"
          autocomplete="new-password"
          required
        />

        <small
          ><i class="pi pi-info-circle"></i> Minimum 14 caractères avec majuscule, minuscule,
          chiffre et symbole.</small
        >
        <button type="submit" [disabled]="isLoading">
          <i class="pi" [ngClass]="isLoading ? 'pi-spin pi-spinner' : 'pi-check-circle'"></i>
          {{ isLoading ? 'Réinitialisation...' : 'Réinitialiser' }}
        </button>

        <div class="auth-actions">
          <a routerLink="/forgot-password">Recevoir un nouveau code</a>
          <a routerLink="/login">Retour à la connexion</a>
        </div>
      </form>
    </div>
  `,
  styles: [
    `
      .auth-page {
        min-height: 100vh;
        min-height: 100dvh;
        display: grid;
        place-items: center;
        background:
          radial-gradient(circle at top left, rgba(37, 99, 235, 0.12), transparent 32%),
          radial-gradient(circle at bottom right, rgba(245, 158, 11, 0.16), transparent 34%),
          #f8fafc;
        padding: clamp(16px, 4vw, 32px);
        overflow-y: auto;
      }
      .auth-card {
        width: min(500px, 100%);
        background: rgba(255, 255, 255, 0.96);
        border: 1px solid #dbeafe;
        border-radius: clamp(18px, 4vw, 26px);
        padding: clamp(22px, 5vw, 34px);
        box-shadow: 0 24px 60px rgba(15, 23, 42, 0.12);
        display: grid;
        gap: 11px;
      }
      .auth-icon {
        width: 58px;
        height: 58px;
        border-radius: 18px;
        display: grid;
        place-items: center;
        background: linear-gradient(135deg, #1d4ed8, #f59e0b);
        color: #fff;
        font-size: 1.35rem;
        box-shadow: 0 14px 28px rgba(37, 99, 235, 0.22);
      }
      h2 {
        margin: 0;
        color: #0f172a;
        font-size: clamp(1.35rem, 5vw, 1.9rem);
        letter-spacing: -0.03em;
        overflow-wrap: anywhere;
      }
      p {
        margin: 0 0 4px;
        color: #64748b;
        line-height: 1.55;
      }
      label {
        color: #334155;
        font-size: 0.82rem;
        font-weight: 800;
      }
      input {
        width: 100%;
        border: 1px solid #cbd5e1;
        border-radius: 14px;
        padding: 13px 14px;
        font: inherit;
        outline: none;
        transition: all 0.2s ease;
      }
      input:focus {
        border-color: #2563eb;
        box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
      }
      button {
        width: 100%;
        border: 0;
        border-radius: 14px;
        padding: 14px;
        font-weight: 850;
        background: linear-gradient(135deg, #1d4ed8, #2563eb 55%, #f59e0b);
        color: white;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }
      button:disabled {
        opacity: 0.65;
        cursor: wait;
      }
      small {
        display: flex;
        gap: 8px;
        align-items: flex-start;
        color: #64748b;
        line-height: 1.45;
        background: #eff6ff;
        border-radius: 14px;
        padding: 11px 12px;
      }
      small i {
        color: #2563eb;
        margin-top: 2px;
      }
      .auth-actions {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        flex-wrap: wrap;
      }
      a {
        color: #2563eb;
        font-weight: 800;
        text-decoration: none;
        overflow-wrap: anywhere;
      }
      a:hover {
        color: #f59e0b;
      }

      @media (max-width: 420px), (max-height: 640px) {
        .auth-page {
          place-items: start center;
        }
      }
    `,
  ],
})
export class ResetPasswordComponent {
  email = '';
  code = '';
  newPassword = '';
  confirmPassword = '';
  isLoading = false;
  private readonly passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{14,}$/;
  private readonly emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService,
  ) {
    this.email = this.route.snapshot.queryParamMap.get('email') || '';
  }

  submit(): void {
    this.email = this.email.trim().toLowerCase();
    this.code = this.code.trim();

    if (!this.emailRegex.test(this.email)) {
      this.notificationService.error('Veuillez renseigner un email valide.');
      return;
    }
    if (!/^\d{6}$/.test(this.code)) {
      this.notificationService.error('Le code doit contenir exactement 6 chiffres.');
      return;
    }
    if (!this.passwordRegex.test(this.newPassword)) {
      this.notificationService.error(
        'Le mot de passe doit contenir au moins 14 caractères, une majuscule, une minuscule, un chiffre et un symbole.',
      );
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.notificationService.error('Les mots de passe ne correspondent pas.');
      return;
    }

    this.isLoading = true;
    this.authService.resetPassword(this.email, this.code, this.newPassword).subscribe({
      next: () => {
        this.notificationService.success('Mot de passe réinitialisé. Vous pouvez vous connecter.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        this.notificationService.error(err?.error?.error || 'Réinitialisation impossible.');
      },
    });
  }
}
