import { Component, inject } from '@angular/core';
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
  AlertController,
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
  settingsOutline,
} from 'ionicons/icons';
import { AuthService } from '../core/services/auth.service';
import { ApiErrorService } from '../core/services/api-error.service';
import { ApiConfigService } from '../core/services/api-config.service';
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
  ],
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private apiError = inject(ApiErrorService);
  private apiConfig = inject(ApiConfigService);
  private alertController = inject(AlertController);

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
      settingsOutline,
    });

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async onSubmit() {
    if (!this.apiConfig.hasConfiguredBaseUrl()) {
      await this.presentServerConfigurationRequired();
      return;
    }

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
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (user) => {
          if (user?.forcePasswordChange) {
            this.router.navigate(['/change-password'], {
              state: { forced: true },
            });
            return;
          }
          this.router.navigate(['/tabs']);
        },
        error: (err) => {
          this.apiError.presentError(err, 'Email ou mot de passe incorrect.');
        },
      });
  }

  async changeServerIp() {
    const simpleIp = this.apiConfig.getConfiguredServerIp();

    const alert = await this.alertController.create({
      header: 'Configuration Serveur',
      message:
        "Entrez l'adresse du backend sur le même Wi-Fi. Exemple : 192.168.1.15 ou 192.168.1.15:8099/api.",
      inputs: [
        {
          name: 'ipAddress',
          type: 'text',
          placeholder: 'Ex: 192.168.1.15:8099/api',
          value: simpleIp,
        },
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
        },
        {
          text: 'Enregistrer',
          handler: (data) => {
            if (!data.ipAddress) {
              return false;
            }

            return this.apiConfig.setServerIp(data.ipAddress);
          },
        },
      ],
    });
    await alert.present();
  }

  private async presentServerConfigurationRequired(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Serveur non configuré',
      message:
        "Configurez d'abord l'IP de l'ordinateur qui exécute le backend. Le téléphone et l'ordinateur doivent être sur le même Wi-Fi.",
      buttons: [
        {
          text: "Configurer l'IP",
          handler: () => {
            void this.changeServerIp();
          },
        },
      ],
    });

    await alert.present();
  }
}
