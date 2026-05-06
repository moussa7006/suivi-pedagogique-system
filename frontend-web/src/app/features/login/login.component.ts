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
      <!-- Left: Branding Panel -->
      <div class="login-branding">
        <div class="floating-shapes">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
          <div class="shape shape-3"></div>
          <div class="shape shape-4"></div>
          <div class="shape shape-5"></div>
        </div>
        <div class="branding-content">
          <div class="brand-icon">
            <img src="assets/images/intec.png" alt="Logo INTEC" />
          </div>
          <h1>INTEC - Suivi Pédagogique</h1>
          <p>Plateforme officielle de gestion académique intelligente et sécurisée</p>
          <div class="brand-features">
            <div class="feature">
              <i class="pi pi-check-circle"></i><span>Suivi des émargements en temps réel</span>
            </div>
            <div class="feature">
              <i class="pi pi-check-circle"></i><span>Cahier de textes numérique</span>
            </div>
            <div class="feature">
              <i class="pi pi-check-circle"></i><span>Génération QR Code dynamique</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Auth Form -->
      <div class="login-auth">
        <div class="auth-container">
          <div class="auth-header">
            <div class="auth-mobile-logo">
              <img src="assets/images/intec1.png" alt="Logo INTEC" />
            </div>
            <h2>Bienvenue</h2>
            <p>Connectez-vous à votre espace</p>
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
                  placeholder="Entrez votre identifiant"
                  autocomplete="username"
                />
              </div>
              <span
                class="error-msg"
                *ngIf="loginForm.get('username')?.invalid && loginForm.get('username')?.touched"
              >
                <i class="pi pi-exclamation-circle"></i> Identifiant requis (min. 3 caractères)
              </span>
            </div>

            <div class="form-group">
              <label for="password">Mot de passe</label>
              <div class="input-wrapper">
                <i class="pi pi-lock icon-left"></i>
                <input
                  id="password"
                  [type]="showPassword ? 'text' : 'password'"
                  formControlName="password"
                  placeholder="Entrez votre mot de passe"
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
              <span
                class="error-msg"
                *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
              >
                <i class="pi pi-exclamation-circle"></i> Mot de passe requis (min. 4 caractères)
              </span>
            </div>

            <button type="submit" class="btn-connect" [disabled]="loginForm.invalid || isLoading">
              <span class="btn-shimmer"></span>
              <span *ngIf="!isLoading" class="btn-content"
                ><i class="pi pi-sign-in"></i> Se connecter</span
              >
              <span *ngIf="isLoading" class="btn-content btn-loading"
                ><span class="spinner"></span> Connexion...</span
              >
            </button>
          </form>

          <div class="security-footer">
            <i class="pi pi-shield"></i>
            <span>Connexion sécurisée et chiffrée</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      * {
        box-sizing: border-box;
      }

      .login-page {
        display: flex;
        height: 100vh;
        min-height: 100vh;
        overflow: hidden;
        font-family:
          'Inter',
          -apple-system,
          BlinkMacSystemFont,
          'Segoe UI',
          Roboto,
          sans-serif;
      }

      /* ========== LEFT: BRANDING ========== */
      .login-branding {
        width: 50%;
        background: linear-gradient(135deg, #0b3a82 0%, #1d4ed8 55%, #f59e0b 100%);
        position: relative;
        overflow: hidden;
      }

      .floating-shapes {
        position: absolute;
        inset: 0;
        pointer-events: none;
        overflow: hidden;
      }

      .shape {
        position: absolute;
        border-radius: 50%;
        opacity: 0.06;
        background: white;
      }
      .shape-1 {
        width: 300px;
        height: 300px;
        top: -80px;
        right: -60px;
        animation: float1 20s ease-in-out infinite;
      }
      .shape-2 {
        width: 200px;
        height: 200px;
        bottom: 10%;
        left: -40px;
        animation: float2 15s ease-in-out infinite;
      }
      .shape-3 {
        width: 120px;
        height: 120px;
        top: 40%;
        right: 15%;
        animation: float3 18s ease-in-out infinite;
      }
      .shape-4 {
        width: 80px;
        height: 80px;
        top: 20%;
        left: 20%;
        animation: float1 12s ease-in-out infinite reverse;
      }
      .shape-5 {
        width: 160px;
        height: 160px;
        bottom: -30px;
        right: 30%;
        border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
        animation:
          morph 10s ease-in-out infinite,
          float2 14s ease-in-out infinite;
      }

      @keyframes float1 {
        0%,
        100% {
          transform: translate(0, 0) scale(1);
        }
        33% {
          transform: translate(30px, -30px) scale(1.1);
        }
        66% {
          transform: translate(-20px, 20px) scale(0.95);
        }
      }
      @keyframes float2 {
        0%,
        100% {
          transform: translate(0, 0) rotate(0deg);
        }
        50% {
          transform: translate(25px, -25px) rotate(45deg);
        }
      }
      @keyframes float3 {
        0%,
        100% {
          transform: translate(0, 0);
        }
        25% {
          transform: translate(15px, 25px);
        }
        75% {
          transform: translate(-15px, -15px);
        }
      }
      @keyframes morph {
        0%,
        100% {
          border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
        }
        50% {
          border-radius: 70% 30% 30% 70% / 70% 70% 30% 30%;
        }
      }

      .branding-content {
        position: relative;
        z-index: 2;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: white;
        padding: 40px;
        text-align: center;
        height: 100%;

        @media (max-height: 700px) {
          padding: 24px;
        }
      }

      .brand-icon {
        width: 100px;
        height: 100px;
        border-radius: 20px;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(12px);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 24px;
        border: 1px solid rgba(255, 255, 255, 0.3);
        animation: slideIn 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        box-shadow: 0 10px 24px rgba(2, 6, 23, 0.2);

        @media (max-height: 700px) {
          width: 72px;
          height: 72px;
          margin-bottom: 16px;
        }

        img {
          width: 80%;
          height: 80%;
          object-fit: contain;
          border-radius: 14px;
        }
      }

      .branding-content h1 {
        font-size: clamp(1.4rem, 3vw, 2.2rem);
        font-weight: 800;
        margin: 0 0 12px;
        letter-spacing: -0.03em;
        line-height: 1.2;

        @media (max-height: 700px) {
          font-size: 1.3rem;
          margin: 0 0 8px;
        }
      }

      .branding-content > p {
        font-size: 1.05rem;
        opacity: 0.75;
        max-width: 400px;
        line-height: 1.6;
        margin: 0;
      }

      .brand-features {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-top: 32px;
        align-items: flex-start;

        @media (max-height: 700px) {
          margin-top: 20px;
          gap: 8px;
        }
      }

      .feature {
        display: flex;
        align-items: center;
        gap: 14px;
        font-size: 0.95rem;
        opacity: 0.9;
      }
      .feature i {
        color: #f59e0b;
        font-size: 1.15rem;
      }

      /* ========== RIGHT: AUTH PANEL ========== */
      .login-auth {
        flex: 1;
        display: flex;
        align-items: stretch;
        justify-content: center;
        background: #fff;
        position: relative;
        padding: 0;
        overflow-y: auto;
        overflow-x: hidden;
      }

      .login-auth::before {
        content: '';
        position: absolute;
        top: -150px;
        right: -150px;
        width: 400px;
        height: 400px;
        background: radial-gradient(circle, rgba(29, 78, 216, 0.06) 0%, transparent 70%);
        border-radius: 50%;
      }
      .login-auth::after {
        content: '';
        position: absolute;
        bottom: -100px;
        left: -100px;
        width: 300px;
        height: 300px;
        background: radial-gradient(circle, rgba(245, 158, 11, 0.08) 0%, transparent 70%);
        border-radius: 50%;
      }

      .auth-container {
        width: 100%;
        max-width: 480px;
        padding: 0 40px;
        animation: slideIn 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-height: 100vh;
        transform: translateY(56px);
      }

      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(24px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .auth-header {
        margin-bottom: 32px;
        text-align: center;
        flex-shrink: 0;
      }

      .auth-mobile-logo {
        display: none;
        align-items: center;
        justify-content: center;
        margin: 0 auto 12px;

        img {
          width: 64px;
          height: 64px;
          object-fit: contain;
          border-radius: 14px;
          background: #fff;
          padding: 6px;
          border: 1px solid rgba(226, 232, 240, 0.9);
          box-shadow: 0 6px 14px rgba(2, 6, 23, 0.08);
        }

        @media (max-height: 600px) {
          display: none;
        }
      }
      .auth-header h2 {
        font-size: 1.75rem;
        font-weight: 800;
        color: #0f172a;
        margin: 0 0 6px;
        letter-spacing: -0.025em;

        @media (max-height: 700px) {
          font-size: 1.4rem;
          margin: 0 0 4px;
        }
      }
      .auth-header p {
        color: #64748b;
        font-size: 0.9rem;
        margin: 0;
        font-weight: 400;

        @media (max-height: 700px) {
          font-size: 0.82rem;
        }
      }

      /* Form */
      .portal-form {
        display: flex;
        flex-direction: column;
        gap: 14px;
        flex: 0 0 auto;
        justify-content: center;
      }
      .form-group {
        display: flex;
        flex-direction: column;
        gap: 6px;
        min-height: 82px;
      }
      .form-group label {
        font-size: 0.82rem;
        font-weight: 650;
        color: #374151;
        letter-spacing: 0.01em;

        @media (max-height: 700px) {
          font-size: 0.76rem;
          margin-bottom: 2px;
        }
      }

      .input-wrapper {
        position: relative;
        transition: all 0.25s ease;
      }
      .input-wrapper .icon-left {
        position: absolute;
        left: 16px;
        top: 50%;
        transform: translateY(-50%);
        color: #94a3b8;
        font-size: 1rem;
        pointer-events: none;
        transition: all 0.25s ease;
        z-index: 1;
      }
      .input-wrapper:focus-within .icon-left {
        color: #2563eb;
      }

      .input-wrapper input {
        width: 100%;
        padding: 12px 16px 12px 46px;
        border: 2px solid #e2e8f0;
        border-radius: 14px;
        font-size: 0.95rem;
        background: #fafbfc;
        transition: all 0.25s ease;
        outline: none;
        color: #0f172a;
        font-weight: 500;

        @media (max-height: 700px) {
          padding: 10px 14px 10px 42px;
          font-size: 0.9rem;
        }
      }
      .input-wrapper input:hover {
        border-color: #cbd5e1;
        background: #fff;
      }
      .input-wrapper input:focus {
        border-color: #2563eb;
        background: #fff;
        box-shadow:
          0 0 0 4px rgba(37, 99, 235, 0.1),
          0 2px 8px rgba(37, 99, 235, 0.06);
      }
      .input-wrapper input::placeholder {
        color: #b0b8c4;
        font-weight: 400;
      }

      .input-wrapper .eye-toggle {
        position: absolute;
        right: 8px;
        top: 50%;
        transform: translateY(-50%);
        background: transparent;
        border: none;
        color: #94a3b8;
        cursor: pointer;
        padding: 8px;
        font-size: 1.05rem;
        border-radius: 8px;
        transition: all 0.2s ease;
      }
      .input-wrapper .eye-toggle:hover {
        color: #2563eb;
        background: rgba(37, 99, 235, 0.06);
      }

      .error-msg {
        font-size: 0.75rem;
        color: #ef4444;
        margin-top: 2px;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 6px;
        animation: shakeIn 0.4s ease;
      }
      .error-msg i {
        font-size: 0.85rem;
      }
      @keyframes shakeIn {
        0% {
          transform: translateX(-4px);
          opacity: 0;
        }
        50% {
          transform: translateX(3px);
        }
        100% {
          transform: translateX(0);
          opacity: 1;
        }
      }

      /* Button */
      .btn-connect {
        position: relative;
        overflow: hidden;
        width: 100%;
        padding: 16px 24px;
        border-radius: 14px;
        background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 55%, #f59e0b 100%);
        color: white;
        font-size: 1rem;
        font-weight: 700;
        border: none;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        box-shadow: 0 6px 16px rgba(29, 78, 216, 0.32);
        margin-top: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        flex-shrink: 0;
      }
      .btn-connect:hover:not(:disabled) {
        box-shadow:
          0 12px 28px rgba(29, 78, 216, 0.35),
          0 6px 14px rgba(245, 158, 11, 0.22);
      }
      .btn-connect:active:not(:disabled) {
        box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3);
      }
      .btn-connect:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
      }

      /* Button Shimmer */
      .btn-connect::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 50%;
        height: 100%;
        background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.25), transparent);
        transition: left 0.6s ease;
      }
      .btn-connect:hover:not(:disabled)::before {
        left: 120%;
      }

      .spinner {
        display: inline-block;
        width: 18px;
        height: 18px;
        border: 2.5px solid rgba(255, 255, 255, 0.3);
        border-top-color: #fff;
        border-radius: 50%;
        animation: spin 0.7s linear infinite;
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      /* Security Footer */
      .security-footer {
        margin-top: 24px;
        padding-top: 0;
        padding-bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        font-size: 0.78rem;
        color: #94a3b8;
        font-weight: 500;
        letter-spacing: 0.02em;
        flex-shrink: 0;
      }
      .security-footer i {
        color: #f59e0b;
        font-size: 0.95rem;
      }

      /* Responsive - Tablet */
      @media (max-width: 900px) {
        .login-page {
          height: auto;
          min-height: 100vh;
        }

        .login-branding {
          display: none;
        }

        .login-auth {
          width: 100%;
          height: 100vh;
          padding: 0;
          align-items: center;
        }

        .auth-container {
          padding: 0 24px;
          min-height: 100vh;
          transform: translateY(36px);
        }

        .auth-mobile-logo {
          display: flex;
        }

        .auth-header h2 {
          font-size: 1.5rem;
        }
      }

      /* Responsive - Mobile */
      @media (max-width: 480px) {
        .login-page {
          height: 100vh;
          min-height: 100vh;
        }

        .login-auth {
          min-height: 100vh;
          padding: 0;
          align-items: center;
          overflow-y: auto;
        }

        .auth-container {
          padding: 20px 16px;
          max-width: 100%;
          min-height: 100vh;
          transform: translateY(24px);
        }

        .auth-header {
          margin-bottom: 20px;
        }

        .auth-mobile-logo {
          margin: 0 auto 10px;

          img {
            width: 52px;
            height: 52px;
          }
        }

        .auth-header h2 {
          font-size: 1.3rem;
        }

        .auth-header p {
          font-size: 0.82rem;
        }

        .portal-form {
          gap: 14px;
        }

        .form-group label {
          font-size: 0.78rem;
        }

        .input-wrapper input {
          padding: 11px 14px 11px 42px;
          font-size: 0.9rem;
        }

        .btn-connect {
          padding: 12px 18px;
          font-size: 0.92rem;
        }

        .security-footer {
          margin-top: 16px;
          font-size: 0.72rem;
        }
      }

      /* Responsive - Very small phones */
      @media (max-width: 360px), (max-height: 580px) {
        .login-auth {
          min-height: 100vh;
          align-items: center;
          overflow-y: auto;
        }

        .auth-container {
          padding: 16px 14px;
          min-height: auto;
          transform: translateY(0);
        }

        .auth-mobile-logo {
          display: none;
        }

        .auth-header {
          margin-bottom: 16px;
        }

        .auth-header h2 {
          font-size: 1.2rem;
        }

        .portal-form {
          gap: 12px;
        }

        .input-wrapper input {
          padding: 10px 12px 10px 38px;
          font-size: 0.88rem;
          border-radius: 10px;
        }

        .input-wrapper .icon-left {
          left: 12px;
          font-size: 0.9rem;
        }

        .btn-connect {
          padding: 11px 16px;
          font-size: 0.88rem;
          border-radius: 10px;
        }

        .security-footer {
          margin-top: 12px;
        }
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
      const formValue = this.loginForm.value;
      const payload = {
        email: formValue.username,
        motDePasse: formValue.password,
      };
      this.authService.login(payload).subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: () => {
          this.isLoading = false;
          alert('Échec de connexion. Vérifiez vos identifiants.');
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
