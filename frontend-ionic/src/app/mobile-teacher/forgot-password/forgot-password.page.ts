import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
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
import { keyOutline, mailOutline, arrowBackOutline } from 'ionicons/icons';
=======
  IonContent,
  IonInput,
  IonIcon,
  IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mail, arrowBack, alertCircleOutline, school } from 'ionicons/icons';
>>>>>>> d6b8d3bf8fe91554ef39feb5f2aba44b33093b1d
import { finalize } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
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
export class ForgotPasswordPage {
  private authService = inject(AuthService);
<<<<<<< HEAD
  private toastController = inject(ToastController);
=======
>>>>>>> d6b8d3bf8fe91554ef39feb5f2aba44b33093b1d
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  email = '';
  isLoading = false;
<<<<<<< HEAD

  constructor() {
    addIcons({ keyOutline, mailOutline, arrowBackOutline });
=======
  errorMessage: string | null = null;

  constructor() {
    addIcons({ mail, arrowBack, alertCircleOutline, school });
>>>>>>> d6b8d3bf8fe91554ef39feb5f2aba44b33093b1d
  }

  goToLogin(): void {
    void this.router.navigateByUrl('/mobile/login', { replaceUrl: true });
  }

  submit() {
    this.isLoading = true;
<<<<<<< HEAD
=======
    this.errorMessage = null;
>>>>>>> d6b8d3bf8fe91554ef39feb5f2aba44b33093b1d
    this.authService
      .forgotPassword(this.email)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
<<<<<<< HEAD
        next: async (res: any) => {
          await this.toast(
            res?.message || 'Si cet email existe, un code a été envoyé.',
            'success',
          );
          this.router.navigate(['/mobile/reset-password'], {
            queryParams: { email: this.email },
          });
        },
        error: async (err) => {
          await this.toast(
            err?.error?.error || "Impossible d'envoyer le code.",
            'danger',
          );
=======
        next: () => {
          this.router.navigate(['/mobile/reset-password'], {
            queryParams: { email: this.email, sent: '1' },
          });
        },
        error: (err) => {
          this.errorMessage =
            err?.error?.error || "Impossible d'envoyer le code.";
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
