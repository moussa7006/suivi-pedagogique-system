import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../shared/notification/notification.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <form class="auth-card" (ngSubmit)="submit()">
        <div class="auth-icon"><i class="pi pi-key"></i></div>
        <h2>Réinitialisation du mot de passe</h2>
        <p>
          Saisissez l’email associé à votre compte. Si le compte existe, le backend enverra un code
          sécurisé à 6 chiffres valable 10 minutes.
        </p>

        <label for="email">Adresse email</label>
        <div class="input-wrapper">
          <i class="pi pi-envelope"></i>
          <input
            id="email"
            name="email"
            type="email"
            [(ngModel)]="email"
            placeholder="email@exemple.com"
            autocomplete="email"
            required
          />
        </div>

        <button type="submit" [disabled]="isLoading || !email">
          <i class="pi" [ngClass]="isLoading ? 'pi-spin pi-spinner' : 'pi-send'"></i>
          {{ isLoading ? 'Envoi du code...' : 'Recevoir le code' }}
        </button>

        <div class="helper-box">
          <i class="pi pi-info-circle"></i>
          <span
            >Vérifiez aussi vos spams si le code n’apparaît pas dans votre boîte de réception.</span
          >
        </div>

        <div class="auth-actions">
          <a routerLink="/reset-password">J’ai déjà un code</a>
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
        gap: 14px;
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
      }
      p {
        margin: 0 0 4px;
        color: #64748b;
        line-height: 1.6;
      }
      label {
        color: #334155;
        font-size: 0.86rem;
        font-weight: 800;
      }
      .input-wrapper {
        position: relative;
      }
      .input-wrapper i {
        position: absolute;
        left: 14px;
        top: 50%;
        transform: translateY(-50%);
        color: #94a3b8;
      }
      input {
        width: 100%;
        border: 1px solid #cbd5e1;
        border-radius: 14px;
        padding: 14px 14px 14px 42px;
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
        cursor: not-allowed;
      }
      .helper-box {
        display: flex;
        gap: 10px;
        align-items: flex-start;
        padding: 12px;
        border-radius: 14px;
        background: #eff6ff;
        color: #475569;
        font-size: 0.82rem;
        line-height: 1.45;
      }
      .helper-box i {
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

      @media (max-width: 420px), (max-height: 560px) {
        .auth-page {
          place-items: start center;
        }
      }
    `,
  ],
})
export class ForgotPasswordComponent {
  email = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router,
  ) {}

  submit(): void {
    this.email = this.email.trim().toLowerCase();
    this.isLoading = true;
    this.authService.forgotPassword(this.email).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.notificationService.success(
          res?.message || 'Si cet email existe, un code a été envoyé.',
        );
        this.router.navigate(['/reset-password'], { queryParams: { email: this.email } });
      },
      error: (err) => {
        this.isLoading = false;
        this.notificationService.error(err?.error?.error || "Impossible d'envoyer le code.");
      },
    });
  }
}
