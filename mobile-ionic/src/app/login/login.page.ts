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

  onSubmit() {
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
    let currentIp =
      localStorage.getItem('custom_api_url') || 'http://192.168.1.7:8099/api';
    let simpleIp = currentIp.replace('http://', '').replace(':8099/api', '');

    const alert = await this.alertController.create({
      header: 'Configuration Serveur',
      message:
        "Entrez l'adresse IP locale de votre ordinateur (ex: 192.168.1.15).",
      inputs: [
        {
          name: 'ipAddress',
          type: 'text',
          placeholder: 'Ex: 192.168.1.7',
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
            if (data.ipAddress) {
              const fullUrl = `http://${data.ipAddress.trim()}:8099/api`;
              localStorage.setItem('custom_api_url', fullUrl);
            }
          },
        },
      ],
    });
    await alert.present();
  }
}
