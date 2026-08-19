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
<<<<<<< HEAD
  IonItem,
  IonInput,
  IonButton,
  IonIcon,
  IonSpinner,
  IonCheckbox,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  logInOutline,
  mailOutline,
  lockClosedOutline,
  eyeOutline,
  eyeOffOutline,
  schoolOutline,
  alertCircleOutline,
  arrowForwardOutline,
  playOutline,
  helpCircleOutline,
  logoGoogle,
=======
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
>>>>>>> d6b8d3bf8fe91554ef39feb5f2aba44b33093b1d
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
<<<<<<< HEAD
    IonItem,
    IonInput,
    IonButton,
    IonIcon,
    IonSpinner,
    IonCheckbox,
=======
    IonInput,
    IonIcon,
    IonSpinner,
>>>>>>> d6b8d3bf8fe91554ef39feb5f2aba44b33093b1d
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
<<<<<<< HEAD

  constructor() {
    addIcons({
      logInOutline,
      mailOutline,
      lockClosedOutline,
      eyeOutline,
      eyeOffOutline,
      schoolOutline,
      alertCircleOutline,
      arrowForwardOutline,
      playOutline,
      helpCircleOutline,
      logoGoogle,
=======
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
>>>>>>> d6b8d3bf8fe91554ef39feb5f2aba44b33093b1d
    });

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

<<<<<<< HEAD
  ionViewWillEnter(): void {
    this.clearLoginFields();
    // Détection silencieuse du serveur : si l'app et le backend sont sur le
    // même réseau local, le serveur est trouvé automatiquement et l'utilisateur
    // n'a rien à configurer.
    if (!this.apiConfig.hasConfiguredBaseUrl()) {
      void this.serverDiscovery.autoDetect();
=======
  async ionViewWillEnter() {
    this.clearLoginFields();

    if (!this.apiConfig.hasConfiguredBaseUrl()) {
      const found = await this.serverDiscovery.autoDetect();
      this.serverError = found
        ? null
        : 'Serveur introuvable sur le Wi-Fi actuel. Vérifiez que le backend est lancé.';
    } else {
      this.serverError = null;
>>>>>>> d6b8d3bf8fe91554ef39feb5f2aba44b33093b1d
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
<<<<<<< HEAD
=======
    this.loginError = null;
>>>>>>> d6b8d3bf8fe91554ef39feb5f2aba44b33093b1d

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
<<<<<<< HEAD
          this.apiError.presentError(err, 'Email ou mot de passe incorrect.');
=======
          this.loginError = this.apiError.extractMessage(
            err,
            'Email ou mot de passe incorrect.',
          );
>>>>>>> d6b8d3bf8fe91554ef39feb5f2aba44b33093b1d
          this.cdr.detectChanges();
        },
      });
  }

  private clearLoginFields(): void {
    this.showPassword = false;
<<<<<<< HEAD
=======
    this.loginError = null;
>>>>>>> d6b8d3bf8fe91554ef39feb5f2aba44b33093b1d
    this.loginForm.reset({ email: '', password: '' });
    this.loginForm.markAsPristine();
    this.loginForm.markAsUntouched();
    this.cdr.detectChanges();
  }
}
