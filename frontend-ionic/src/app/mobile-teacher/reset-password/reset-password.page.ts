import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
<<<<<<< HEAD
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonIcon,
  IonSpinner,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  lockClosedOutline,
  mailOutline,
  keypadOutline,
  arrowBackOutline,
=======
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
>>>>>>> d6b8d3bf8fe91554ef39feb5f2aba44b33093b1d
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
<<<<<<< HEAD
    IonItem,
    IonInput,
    IonButton,
=======
    IonInput,
>>>>>>> d6b8d3bf8fe91554ef39feb5f2aba44b33093b1d
    IonIcon,
    IonSpinner,
  ],
})
export class ResetPasswordPage {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
<<<<<<< HEAD
  private toastController = inject(ToastController);
=======
>>>>>>> d6b8d3bf8fe91554ef39feb5f2aba44b33093b1d
  private cdr = inject(ChangeDetectorRef);
  email = this.route.snapshot.queryParamMap.get('email') || '';
  code = '';
  newPassword = '';
  confirmPassword = '';
  isLoading = false;
<<<<<<< HEAD
=======
  showPassword = false;
  showConfirmPassword = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
>>>>>>> d6b8d3bf8fe91554ef39feb5f2aba44b33093b1d
  private readonly passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{14,}$/;
  private readonly emailRegex =
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  constructor() {
    addIcons({
<<<<<<< HEAD
      lockClosedOutline,
      mailOutline,
      keypadOutline,
      arrowBackOutline,
    });
=======
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
>>>>>>> d6b8d3bf8fe91554ef39feb5f2aba44b33093b1d
  }

  goToLogin(): void {
    void this.router.navigateByUrl('/mobile/login', { replaceUrl: true });
  }

<<<<<<< HEAD
  async submit() {
    if (!this.emailRegex.test(this.email)) {
      await this.toast('Veuillez renseigner un email valide.', 'danger');
      return;
    }
    if (!/^\d{6}$/.test(this.code)) {
      await this.toast(
        'Le code doit contenir exactement 6 chiffres.',
        'danger',
      );
      return;
    }
    if (!this.passwordRegex.test(this.newPassword)) {
      await this.toast(
        'Le mot de passe doit contenir au moins 14 caractères, une majuscule, une minuscule, un chiffre et un symbole.',
        'danger',
      );
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      await this.toast('Les mots de passe ne correspondent pas.', 'danger');
=======
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
>>>>>>> d6b8d3bf8fe91554ef39feb5f2aba44b33093b1d
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
<<<<<<< HEAD
        next: async () => {
          await this.toast(
            'Mot de passe réinitialisé. Vous pouvez vous connecter.',
            'success',
          );
          this.router.navigate(['/mobile/login']);
        },
        error: async (err) => {
          await this.toast(
            err?.error?.error || 'Réinitialisation impossible.',
            'danger',
          );
=======
        next: () => {
          this.router.navigate(['/mobile/login']);
        },
        error: (err) => {
          this.errorMessage =
            err?.error?.error || 'Réinitialisation impossible.';
>>>>>>> d6b8d3bf8fe91554ef39feb5f2aba44b33093b1d
          this.cdr.detectChanges();
        },
      });
  }
<<<<<<< HEAD

  private async toast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message,
      color,
      duration: 3000,
      position: 'top',
    });
    await toast.present();
  }
=======
>>>>>>> d6b8d3bf8fe91554ef39feb5f2aba44b33093b1d
}
