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
        <h2>Réinitialiser le mot de passe</h2>
        <input name="email" type="email" [(ngModel)]="email" placeholder="Email" required />
        <input
          name="code"
          type="text"
          inputmode="numeric"
          maxlength="6"
          [(ngModel)]="code"
          placeholder="Code à 6 chiffres"
          required
        />
        <input
          name="newPassword"
          type="password"
          [(ngModel)]="newPassword"
          placeholder="Nouveau mot de passe"
          required
        />
        <input
          name="confirmPassword"
          type="password"
          [(ngModel)]="confirmPassword"
          placeholder="Confirmer le mot de passe"
          required
        />
        <small>Minimum 14 caractères avec majuscule, minuscule, chiffre et symbole.</small>
        <button type="submit" [disabled]="isLoading">
          {{ isLoading ? 'Réinitialisation...' : 'Réinitialiser' }}
        </button>
        <a routerLink="/forgot-password">Recevoir un nouveau code</a>
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
      small {
        color: #64748b;
      }
      a {
        color: #2563eb;
        font-weight: 700;
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
