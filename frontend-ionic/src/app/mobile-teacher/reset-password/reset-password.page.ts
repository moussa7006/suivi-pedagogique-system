import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  IonContent,
  IonInput,
  IonIcon,
  IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  lockClosed,
  mail,
  keypad,
  arrowBack,
  alertCircleOutline,
  checkmarkCircleOutline,
  eye,
  eyeOff,
  school
} from 'ionicons/icons';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonContent,
    IonInput,
    IonIcon,
    IonSpinner,
  ],
})
export class ResetPasswordPage {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  email = this.route.snapshot.queryParamMap.get('email') || '';
  code = '';
  newPassword = '';
  confirmPassword = '';
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  private readonly passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{14,}$/;
  private readonly emailRegex =
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  constructor() {
    addIcons({
      lockClosed,
      mail,
      keypad,
      arrowBack,
      alertCircleOutline,
      checkmarkCircleOutline,
      eye,
      eyeOff,
      school
    });

    if (this.route.snapshot.queryParamMap.get('sent') === '1') {
      this.successMessage = 'Un code a été envoyé à votre email.';
    }
  }

  goToLogin(): void {
    void this.router.navigateByUrl('/mobile/login', { replaceUrl: true });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
    this.cdr.detectChanges();
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
    this.cdr.detectChanges();
  }

  submit() {
    this.errorMessage = null;

    if (!this.emailRegex.test(this.email)) {
      this.errorMessage = 'Veuillez renseigner un email valide.';
      return;
    }
    if (!/^\d{6}$/.test(this.code)) {
      this.errorMessage = 'Le code doit contenir exactement 6 chiffres.';
      return;
    }
    if (!this.passwordRegex.test(this.newPassword)) {
      this.errorMessage =
        'Le mot de passe doit contenir au moins 14 caractères, une majuscule, une minuscule, un chiffre et un symbole.';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas.';
      return;
    }

    this.isLoading = true;
    this.authService
      .resetPassword(this.email, this.code, this.newPassword)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/mobile/login']);
        },
        error: (err) => {
          this.errorMessage =
            err?.error?.error || 'Réinitialisation impossible.';
          this.cdr.detectChanges();
        },
      });
  }
}
