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
        display: grid;
        place-items: center;
        background: #f8fafc;
        padding: 24px;
      }
      .auth-card {
        width: min(440px, 100%);
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 18px;
        padding: 28px;
        box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
        display: grid;
        gap: 12px;
      }
      input {
        border: 1px solid #cbd5e1;
        border-radius: 12px;
        padding: 12px;
      }
      button {
        border: 0;
        border-radius: 12px;
        padding: 12px;
        font-weight: 800;
        background: #2563eb;
        color: white;
      }
      a {
        color: #2563eb;
        font-weight: 700;
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
