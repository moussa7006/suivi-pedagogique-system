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
  IonItem,
  IonInput,
  IonButton,
  IonIcon,
  IonSpinner,
  IonCheckbox,
  ToastController
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
    IonItem,
    IonInput,
    IonButton,
    IonIcon,
    IonSpinner,
    IonCheckbox,
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
  private toastCtrl = inject(ToastController);

  loginForm: FormGroup;
  showPassword = false;
  isLoading = false;

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
      if (!found) {
         const toast = await this.toastCtrl.create({
           message: "⚠️ Aucun serveur trouvé sur le Wi-Fi actuel.",
           duration: 3000,
           color: "danger"
         });
         await toast.present();
      } else {
         const toast = await this.toastCtrl.create({
           message: "✅ Serveur connecté ! (" + found + ")",
           duration: 2000,
           color: "success"
         });
         await toast.present();
      }
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
          this.apiError.presentError(err, 'Email ou mot de passe incorrect.');
          this.cdr.detectChanges();
        },
      });
  }

  private clearLoginFields(): void {
    this.showPassword = false;
    this.loginForm.reset({ email: '', password: '' });
    this.loginForm.markAsPristine();
    this.loginForm.markAsUntouched();
    this.cdr.detectChanges();
  }
}
