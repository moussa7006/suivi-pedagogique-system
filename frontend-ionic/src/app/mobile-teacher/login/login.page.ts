import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  IonContent,
  IonInput,
  IonIcon,
  IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  mail,
  lockClosed,
  eye,
  eyeOff,
  alertCircleOutline,
  school,
  warningOutline,
  serverOutline
} from 'ionicons/icons';
import { AuthService } from '../../core/services/auth.service';
import { ApiErrorService } from '../../core/services/api-error.service';
import { ApiConfigService } from '../../core/services/api-config.service';
import { ServerDiscoveryService } from '../../core/services/server-discovery.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    IonContent,
    IonInput,
    IonIcon,
    IonSpinner,
  ],
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private apiError = inject(ApiErrorService);
  private apiConfig = inject(ApiConfigService);
  private serverDiscovery = inject(ServerDiscoveryService);
  private cdr = inject(ChangeDetectorRef);

  loginForm: FormGroup;
  showPassword = false;
  isLoading = false;
  serverError: string | null = null;
  loginError: string | null = null;

  constructor() {
    addIcons({
      mail,
      lockClosed,
      eye,
      eyeOff,
      alertCircleOutline,
      school,
      warningOutline,
      serverOutline
    });

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  async ionViewWillEnter() {
    this.clearLoginFields();

    if (!this.apiConfig.hasConfiguredBaseUrl()) {
      const found = await this.serverDiscovery.autoDetect();
      this.serverError = found
        ? null
        : 'Serveur introuvable sur le Wi-Fi actuel. Vérifiez que le backend est lancé.';
    } else {
      this.serverError = null;
    }
  }

  ionViewDidLeave(): void {
    this.clearLoginFields();
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
    this.cdr.detectChanges();
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.loginError = null;

    const credentials = {
      email: this.loginForm.value.email,
      motDePasse: this.loginForm.value.password,
    };

    this.authService
      .login(credentials)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (user) => {
          this.clearLoginFields();
          if (user?.forcePasswordChange) {
            this.router.navigate(['/mobile/change-password'], {
              state: { forced: true },
            });
            return;
          }
          this.router.navigate(['/mobile/tabs']);
        },
        error: (err) => {
          this.loginError = this.apiError.extractMessage(
            err,
            'Email ou mot de passe incorrect.',
          );
          this.cdr.detectChanges();
        },
      });
  }

  private clearLoginFields(): void {
    this.showPassword = false;
    this.loginError = null;
    this.loginForm.reset({ email: '', password: '' });
    this.loginForm.markAsPristine();
    this.loginForm.markAsUntouched();
    this.cdr.detectChanges();
  }
}
