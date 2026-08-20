import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonContent,
  IonInput,
  IonIcon,
  IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mail, arrowBack, alertCircleOutline, school } from 'ionicons/icons';
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
    IonInput,
    IonIcon,
    IonSpinner,
  ],
})
export class ForgotPasswordPage {
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  email = '';
  isLoading = false;
  errorMessage: string | null = null;

  constructor() {
    addIcons({ mail, arrowBack, alertCircleOutline, school });
  }

  goToLogin(): void {
    void this.router.navigateByUrl('/mobile/login', { replaceUrl: true });
  }

  submit() {
    this.isLoading = true;
    this.errorMessage = null;
    this.authService
      .forgotPassword(this.email)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/mobile/reset-password'], {
            queryParams: { email: this.email, sent: '1' },
          });
        },
        error: (err) => {
          this.errorMessage =
            err?.error?.error || "Impossible d'envoyer le code.";
          this.cdr.detectChanges();
        },
      });
  }
}
