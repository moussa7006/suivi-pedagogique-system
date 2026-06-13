import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../shared/notification/notification.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-page">
      <form class="auth-card" (ngSubmit)="submit()">
        <h2>Changer le mot de passe</h2>
        <p class="hint" *ngIf="forced">
          Votre premier mot de passe doit être remplacé avant de continuer.
        </p>
        <label>Ancien mot de passe</label>
        <input
          name="currentPassword"
          type="password"
          [(ngModel)]="currentPassword"
          required
          autocomplete="current-password"
        />
        <label>Nouveau mot de passe</label>
        <input
          name="newPassword"
          type="password"
          [(ngModel)]="newPassword"
          required
          autocomplete="new-password"
        />
        <label>Confirmer le nouveau mot de passe</label>
        <input
          name="confirmPassword"
          type="password"
          [(ngModel)]="confirmPassword"
          required
          autocomplete="new-password"
        />
        <small>Minimum 14 caractères avec majuscule, minuscule, chiffre et symbole.</small>
        <button type="submit" [disabled]="isLoading">
          {{ isLoading ? 'Modification...' : 'Enregistrer' }}
        </button>
        <button type="button" class="secondary" *ngIf="!forced" (click)="goBack()">Retour</button>
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
        width: min(480px, 100%);
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: clamp(16px, 4vw, 22px);
        padding: clamp(20px, 5vw, 32px);
        box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
        display: grid;
        gap: 13px;
      }

      h2 {
        margin: 0;
        color: #0f172a;
        font-size: clamp(1.35rem, 5vw, 1.9rem);
        overflow-wrap: anywhere;
      }

      .hint {
        color: #b45309;
        background: #fffbeb;
        border: 1px solid #fde68a;
        padding: 10px;
        border-radius: 12px;
        margin: 0;
        line-height: 1.45;
      }

      label {
        font-weight: 700;
        color: #334155;
      }

      input {
        width: 100%;
        border: 1px solid #cbd5e1;
        border-radius: 12px;
        padding: 13px 14px;
        font: inherit;
      }

      small {
        color: #64748b;
        line-height: 1.45;
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

      button.secondary {
        background: #e2e8f0;
        color: #0f172a;
      }

      button:disabled {
        opacity: 0.65;
        cursor: wait;
      }

      @media (max-width: 420px), (max-height: 640px) {
        .auth-page {
          place-items: start center;
        }
      }
    `,
  ],
})
export class ChangePasswordComponent {
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  isLoading = false;
  forced = history.state?.forced === true || this.getCurrentUser()?.forcePasswordChange === true;
  private readonly passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{14,}$/;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
  ) {}

  submit(): void {
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
    this.authService.changePassword(this.currentPassword, this.newPassword).subscribe({
      next: () => {
        const user = this.getCurrentUser();
        if (user) {
          user.forcePasswordChange = false;
          this.authService.updateCurrentUser(user);
        }
        this.notificationService.success('Mot de passe modifié avec succès.');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.notificationService.error(
          err?.error?.error || 'Erreur lors du changement de mot de passe.',
        );
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/profile']);
  }

  private getCurrentUser(): any | null {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }
}
