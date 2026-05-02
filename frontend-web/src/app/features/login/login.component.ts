import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-page">
      <div class="login-background">
        <img src="assets/images/intec.png" alt="Background" class="bg-image" />
        <div class="bg-overlay"></div>
      </div>

      <div class="login-content">
        <div class="auth-container">
          <div class="auth-header">
            <div class="brand-logo">
              <img src="assets/images/intec1.png" alt="Logo INTEC" />
            </div>
            <h2>EduTrack</h2>
            <p>Système de Suivi Pédagogique</p>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="portal-form">
            <div class="form-group">
              <label for="username">Identifiant</label>
              <div class="input-wrapper">
                <i class="pi pi-user icon-left"></i>
                <input
                  id="username"
                  type="text"
                  formControlName="username"
                  placeholder="Votre identifiant"
                  autocomplete="username"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="password">Mot de passe</label>
              <div class="input-wrapper">
                <i class="pi pi-lock icon-left"></i>
                <input
                  id="password"
                  [type]="showPassword ? 'text' : 'password'"
                  formControlName="password"
                  placeholder="Votre mot de passe"
                  autocomplete="current-password"
                />
                <button
                  type="button"
                  class="eye-toggle"
                  (click)="showPassword = !showPassword"
                  tabindex="-1"
                >
                  <i class="pi" [ngClass]="showPassword ? 'pi-eye-slash' : 'pi-eye'"></i>
                </button>
              </div>
            </div>

            <button type="submit" class="btn-connect" [disabled]="loginForm.invalid || isLoading">
              <span *ngIf="!isLoading" class="btn-content"
                >Se connecter <i class="pi pi-arrow-right"></i
              ></span>
              <span *ngIf="isLoading" class="btn-content btn-loading"
                ><span class="spinner"></span> Connexion...</span
              >
            </button>
          </form>

          <div class="security-footer">
            <i class="pi pi-shield"></i>
            <span>Accès sécurisé réservé au personnel</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .login-page {
        height: 100vh;
        width: 100vw;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
        background: #0f172a;
        font-family: 'Inter', sans-serif;
      }

      .login-background {
        position: absolute;
        inset: 0;
        z-index: 0;
      }

      .bg-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0.6;
        filter: blur(4px) scale(1.1);
      }

      .bg-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 58, 138, 0.7));
      }

      .login-content {
        position: relative;
        z-index: 1;
        width: 100%;
        max-width: 440px;
        padding: 20px;
      }

      .auth-container {
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(20px);
        padding: 40px;
        border-radius: 30px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.3);
      }

      .auth-header {
        text-align: center;
        margin-bottom: 35px;
      }

      .brand-logo {
        width: 100px;
        height: 100px;
        margin: 0 auto 15px;
        background: white;
        padding: 10px;
        border-radius: 20px;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }

      .auth-header h2 {
        font-size: 2rem;
        font-weight: 800;
        color: #1e3a8a;
        margin: 0;
        letter-spacing: -1px;
      }

      .auth-header p {
        color: #64748b;
        margin-top: 5px;
        font-weight: 500;
      }

      .portal-form {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .form-group label {
        font-size: 0.85rem;
        font-weight: 700;
        color: #334155;
        margin-left: 4px;
      }

      .input-wrapper {
        position: relative;
      }

      .input-wrapper .icon-left {
        position: absolute;
        left: 16px;
        top: 50%;
        transform: translateY(-50%);
        color: #94a3b8;
      }

      .input-wrapper input {
        width: 100%;
        padding: 14px 16px 14px 48px;
        border: 2px solid #e2e8f0;
        border-radius: 15px;
        font-size: 1rem;
        transition: all 0.3s;
        background: #f8fafc;
      }

      .input-wrapper input:focus {
        border-color: #2563eb;
        background: white;
        box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
        outline: none;
      }

      .eye-toggle {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: #94a3b8;
        cursor: pointer;
        padding: 5px;
      }

      .btn-connect {
        margin-top: 10px;
        padding: 16px;
        border-radius: 15px;
        border: none;
        background: linear-gradient(135deg, #1e3a8a, #2563eb);
        color: white;
        font-size: 1.1rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s;
        box-shadow: 0 10px 20px rgba(37, 99, 235, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
      }

      .btn-connect:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 15px 30px rgba(37, 99, 235, 0.4);
        background: linear-gradient(135deg, #2563eb, #3b82f6);
      }

      .btn-connect:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }

      .spinner {
        width: 20px;
        height: 20px;
        border: 3px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      .security-footer {
        margin-top: 30px;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        color: #94a3b8;
        font-size: 0.8rem;
        font-weight: 600;
      }

      .security-footer i {
        color: #10b981;
      }
    `,
  ],
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading: boolean = false;
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.loginForm.markAllAsTouched();

      const formValue = this.loginForm.value;
      // Le backend (LoginRequest.java) attend un objet avec "email" et "motDePasse"
      const payload = {
        email: formValue.username, // le champs username est utilisé pour l'email
        motDePasse: formValue.password,
      };

      this.authService.login(payload).subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: (err) => {
          this.isLoading = false;
          console.error('Erreur de connexion:', err);
          alert('Échec de connexion. Vérifiez vos identifiants.');
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
