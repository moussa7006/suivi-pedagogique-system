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
        <h2>Mot de passe oublié</h2>
        <p>
          Entrez votre email. Si un compte existe, un code à 6 chiffres sera envoyé dans votre boîte
          mail.
        </p>
        <input
          name="email"
          type="email"
          [(ngModel)]="email"
          placeholder="email@exemple.com"
          required
        />
        <button type="submit" [disabled]="isLoading">
          {{ isLoading ? 'Envoi...' : 'Recevoir le code' }}
        </button>
        <a routerLink="/reset-password">J’ai déjà un code</a>
        <a routerLink="/login">Retour à la connexion</a>
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
        background: #f8fafc;
        padding: clamp(16px, 4vw, 32px);
        overflow-y: auto;
      }
      .auth-card {
        width: min(460px, 100%);
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: clamp(16px, 4vw, 22px);
        padding: clamp(20px, 5vw, 32px);
        box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
        display: grid;
        gap: 14px;
      }
      h2 {
        margin: 0;
        color: #0f172a;
        font-size: clamp(1.35rem, 5vw, 1.9rem);
      }
      p {
        margin: 0;
        color: #64748b;
        line-height: 1.6;
      }
      input {
        width: 100%;
        border: 1px solid #cbd5e1;
        border-radius: 12px;
        padding: 13px 14px;
        font: inherit;
      }
      button {
        width: 100%;
        border: 0;
        border-radius: 12px;
        padding: 13px 14px;
        font-weight: 800;
        background: #2563eb;
        color: white;
        cursor: pointer;
      }
      button:disabled {
        opacity: 0.65;
        cursor: wait;
      }
      a {
        color: #2563eb;
        font-weight: 700;
        overflow-wrap: anywhere;
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
