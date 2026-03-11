import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule],
  template: `
    <ion-content [fullscreen]="true" class="login-page">
      <div class="login-header">
        <div class="logo-box">
          <ion-icon name="school-outline"></ion-icon>
        </div>
        <h1>Bienvenue</h1>
        <p>Espace Enseignant • Suivi Pédagogique</p>
      </div>

      <div class="login-form-card">
        <form [formGroup]="loginForm" (ngSubmit)="onLogin()">
          <div class="input-group">
            <ion-item lines="none" class="pro-item">
              <ion-icon name="person-outline" slot="start"></ion-icon>
              <ion-input 
                type="text" 
                formControlName="username" 
                placeholder="Identifiant"
                label="Identifiant"
                labelPlacement="floating">
              </ion-input>
            </ion-item>
          </div>

          <div class="input-group">
            <ion-item lines="none" class="pro-item">
              <ion-icon name="lock-closed-outline" slot="start"></ion-icon>
              <ion-input 
                type="password" 
                formControlName="password" 
                placeholder="Mot de passe"
                label="Mot de passe"
                labelPlacement="floating">
              </ion-input>
            </ion-item>
          </div>

          <div class="forgot-pass">
            <span>Mot de passe oublié ?</span>
          </div>

          <ion-button 
            type="submit" 
            expand="block" 
            class="submit-btn" 
            [disabled]="loginForm.invalid || isLoading">
            <span *ngIf="!isLoading">Se connecter</span>
            <ion-spinner *ngIf="isLoading" name="crescent"></ion-spinner>
          </ion-button>
        </form>
      </div>

      <div class="login-footer">
        <p>MALI • MINISTÈRE DE L'ENSEIGNEMENT SUPÉRIEUR</p>
      </div>
    </ion-content>
  `,
  styles: [`
    .login-page {
      --background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 30px;
    }

    .login-header {
      text-align: center;
      margin-top: 80px;
      margin-bottom: 50px;
      color: white;

      .logo-box {
        width: 80px; height: 80px; background: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px); border-radius: 24px;
        display: flex; align-items: center; justify-content: center;
        margin: 0 auto 20px;
        ion-icon { font-size: 3rem; color: white; }
      }

      h1 { font-size: 2.5rem; font-weight: 800; margin: 0; letter-spacing: -1px; }
      p { font-size: 1rem; opacity: 0.8; margin-top: 8px; font-weight: 500; }
    }

    .login-form-card {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 30px;
      padding: 30px 20px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.2);
    }

    .pro-item {
      --background: transparent;
      margin-bottom: 15px;
      border: 1px solid #e2e8f0;
      border-radius: 15px;
      padding: 0 10px;
      
      ion-icon { color: #64748b; margin-right: 12px; font-size: 1.3rem; }
      ion-input { font-weight: 600; font-size: 1rem; }
    }

    .forgot-pass {
      text-align: right;
      margin: 15px 0 30px;
      span { color: #2563eb; font-weight: 700; font-size: 0.9rem; }
    }

    .submit-btn {
      --background: #1e293b;
      --border-radius: 15px;
      --padding-top: 18px;
      --padding-bottom: 18px;
      font-weight: 800;
      font-size: 1.1rem;
      text-transform: none;
      margin-top: 20px;
      box-shadow: 0 10px 15px -3px rgba(30, 41, 59, 0.3);
    }

    .login-footer {
      position: absolute;
      bottom: 40px;
      width: 100%;
      left: 0;
      text-align: center;
      p { color: rgba(255,255,255,0.6); font-size: 0.75rem; font-weight: 700; letter-spacing: 1px; }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: (user) => {
          this.router.navigate(['/home']);
        },
        error: (err) => {
          this.isLoading = false;
          console.error(err);
        }
      });
    }
  }
}
