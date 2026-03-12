import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../../core/services/auth.service';
import { addIcons } from 'ionicons';
import { personOutline, lockClosedOutline, eyeOutline, eyeOffOutline, arrowForwardOutline } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule],
  template: `
    <ion-content [fullscreen]="true" class="login-content">
      <div class="blob-bg">
        <div class="blob b1"></div>
        <div class="blob b2"></div>
      </div>

      <div class="main-wrapper">
        <div class="header-section">
          <div class="logo-circle">
            <ion-icon name="school-outline"></ion-icon>
          </div>
          <h1>Portail <span>Enseignant</span></h1>
          <p>Système National de Suivi Pédagogique</p>
        </div>

        <div class="form-container">
          <div class="card-glass">
            <div class="welcome-header">
              <h2>Bienvenue</h2>
              <p>Connectez-vous pour commencer votre séance</p>
            </div>

            <form [formGroup]="loginForm" (ngSubmit)="onLogin()">
              <div class="input-item" [class.focused]="activeField === 'user'">
                <ion-label>Identifiant</ion-label>
                <div class="input-box">
                  <ion-icon name="person-outline"></ion-icon>
                  <input 
                    type="text" 
                    formControlName="username" 
                    placeholder="Ex: MALI-12345"
                    (focus)="activeField = 'user'"
                    (blur)="activeField = ''">
                </div>
              </div>

              <div class="input-item" [class.focused]="activeField === 'pass'">
                <ion-label>Mot de passe</ion-label>
                <div class="input-box">
                  <ion-icon name="lock-closed-outline"></ion-icon>
                  <input 
                    [type]="showPassword ? 'text' : 'password'" 
                    formControlName="password" 
                    placeholder="••••••••"
                    (focus)="activeField = 'pass'"
                    (blur)="activeField = ''">
                  <ion-icon 
                    [name]="showPassword ? 'eye-off-outline' : 'eye-outline'" 
                    class="toggle-eye"
                    (click)="showPassword = !showPassword">
                  </ion-icon>
                </div>
              </div>

              <div class="extra-actions">
                <ion-button fill="clear" color="primary" class="forgot-btn">
                  Accès oublié ?
                </ion-button>
              </div>

              <ion-button 
                type="submit" 
                expand="block" 
                class="login-btn"
                [disabled]="loginForm.invalid || isLoading">
                <span *ngIf="!isLoading">Se connecter</span>
                <ion-icon *ngIf="!isLoading" slot="end" name="arrow-forward-outline"></ion-icon>
                <ion-spinner *ngIf="isLoading" name="crescent"></ion-spinner>
              </ion-button>
            </form>
          </div>
        </div>

        <div class="footer-legal">
          <div class="flag-divider">
            <span class="v"></span><span class="j"></span><span class="r"></span>
          </div>
          <p>RÉPUBLIQUE DU MALI</p>
          <span>Un Peuple - Un But - Une Foi</span>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    .login-content {
      --background: #fdfdfd;
    }

    /* Background Blobs */
    .blob-bg {
      position: absolute; width: 100%; height: 100%; overflow: hidden; z-index: 0;
      .blob { position: absolute; border-radius: 50%; filter: blur(60px); opacity: 0.15; }
      .b1 { width: 300px; height: 300px; background: #2563eb; top: -100px; right: -100px; }
      .b2 { width: 250px; height: 250px; background: #059669; bottom: -50px; left: -50px; }
    }

    .main-wrapper {
      position: relative; z-index: 10; display: flex; flex-direction: column;
      min-height: 100%; padding: 20px;
    }

    .header-section {
      text-align: center; margin-top: 60px; margin-bottom: 40px;
      .logo-circle {
        width: 70px; height: 70px; background: white; color: #2563eb;
        border-radius: 22px; display: flex; align-items: center; justify-content: center;
        font-size: 2.5rem; margin: 0 auto 20px;
        box-shadow: 0 10px 25px rgba(37, 99, 235, 0.15);
      }
      h1 { font-size: 2rem; font-weight: 900; color: #0f172a; margin: 0; letter-spacing: -1px;
        span { color: #2563eb; }
      }
      p { color: #64748b; font-size: 0.9rem; font-weight: 600; margin-top: 5px; }
    }

    .card-glass {
      background: white; border-radius: 35px; padding: 30px 25px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.05);
      border: 1px solid #f1f5f9;
    }

    .welcome-header {
      margin-bottom: 30px;
      h2 { font-size: 1.5rem; font-weight: 800; color: #1e293b; margin: 0; }
      p { color: #94a3b8; font-size: 0.9rem; margin-top: 5px; }
    }

    .input-item {
      margin-bottom: 20px;
      ion-label { display: block; font-size: 0.8rem; font-weight: 700; color: #475569; margin-bottom: 8px; margin-left: 5px; }
      .input-box {
        display: flex; align-items: center; background: #f8fafc; border: 2px solid #f1f5f9;
        border-radius: 18px; padding: 12px 16px; transition: all 0.3s;
        ion-icon { font-size: 1.3rem; color: #94a3b8; margin-right: 12px; }
        input { border: none; background: transparent; width: 100%; font-size: 1rem; font-weight: 600; color: #1e293b; outline: none; }
        .toggle-eye { margin-right: 0; margin-left: 10px; cursor: pointer; }
      }
      &.focused .input-box { border-color: #2563eb; background: white; box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.05);
        ion-icon { color: #2563eb; }
      }
    }

    .extra-actions { text-align: right; margin-bottom: 25px; .forgot-btn { --padding-end: 0; font-size: 0.85rem; font-weight: 700; } }

    .login-btn {
      --background: #1e293b; --color: white; --border-radius: 20px; --padding-top: 22px; --padding-bottom: 22px;
      font-weight: 800; font-size: 1.1rem; text-transform: none; margin-top: 10px;
      box-shadow: 0 10px 20px rgba(30, 41, 59, 0.2);
    }

    .footer-legal {
      margin-top: auto; padding: 40px 0 20px; text-align: center;
      .flag-divider {
        display: flex; height: 4px; width: 40px; margin: 0 auto 15px; border-radius: 2px; overflow: hidden;
        span { flex: 1; } .v { background: #00913f; } .j { background: #f8d317; } .r { background: #ce1126; }
      }
      p { font-size: 0.8rem; font-weight: 800; color: #1e293b; margin: 0; letter-spacing: 1px; }
      span { font-size: 0.65rem; color: #94a3b8; font-weight: 600; font-style: italic; }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading: boolean = false;
  activeField: string = '';
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  async onLogin() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const loading = await this.loadingCtrl.create({
        message: 'Authentification...',
        spinner: 'crescent',
        cssClass: 'custom-loading'
      });
      await loading.present();

      this.authService.login(this.loginForm.value).subscribe({
        next: (user) => {
          loading.dismiss();
          this.isLoading = false;
          this.router.navigate(['/home']);
        },
        error: async (err) => {
          loading.dismiss();
          this.isLoading = false;
          const toast = await this.toastCtrl.create({
            message: 'Identifiants incorrects',
            duration: 3000,
            color: 'danger',
            position: 'bottom'
          });
          toast.present();
        }
      });
    }
  }
}
