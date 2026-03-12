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
    <div class="portal-env">
      <!-- Image de fond avec overlay progressif -->
      <div class="bg-scene"></div>
      <div class="bg-overlay"></div>

      <div class="main-card-wrapper">
        <div class="portal-card">
          <!-- Côté Gauche : Identité Visuelle -->
          <div class="info-panel">
            <div class="panel-pattern"></div>
            <div class="panel-content">
              <div class="state-header">
                <div class="flag-pill">
                  <span class="v"></span><span class="j"></span><span class="r"></span>
                </div>
                <span class="state-name">RÉPUBLIQUE DU MALI</span>
              </div>
              
              <div class="branding-hero">
                <div class="big-icon">
                  <i class="pi pi-shield"></i>
                </div>
                <h1>PEDAGO<span>SUIVI</span></h1>
                <p>Système Intégré de Gestion de la Performance Pédagogique Nationale.</p>
              </div>

              <div class="panel-footer">
                <div class="footer-stat">
                  <span class="n">2026</span>
                  <span class="t">ÉDITION OFFICIELLE</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Côté Droit : Formulaire de Connexion -->
          <div class="auth-panel">
            <div class="auth-container">
              <div class="auth-header">
                <h2>Bienvenue</h2>
                <p>Authentifiez-vous pour accéder au tableau de bord sécurisé.</p>
              </div>

              <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="portal-form">
                <div class="form-field" [class.focused]="activeField === 'user'">
                  <label>Identifiant Agent</label>
                  <div class="input-group">
                    <i class="pi pi-user"></i>
                    <input 
                      type="text" 
                      formControlName="username" 
                      placeholder="Nom d'utilisateur"
                      (focus)="activeField = 'user'"
                      (blur)="activeField = ''">
                  </div>
                </div>

                <div class="form-field" [class.focused]="activeField === 'pass'">
                  <label>Mot de passe</label>
                  <div class="input-group">
                    <i class="pi pi-lock"></i>
                    <input 
                      [type]="showPassword ? 'text' : 'password'" 
                      formControlName="password" 
                      placeholder="••••••••"
                      (focus)="activeField = 'pass'"
                      (blur)="activeField = ''">
                    <button type="button" class="eye-toggle" (click)="showPassword = !showPassword">
                      <i class="pi" [ngClass]="showPassword ? 'pi-eye-slash' : 'pi-eye'"></i>
                    </button>
                  </div>
                </div>

                <div class="form-options">
                  <label class="remember-me">
                    <input type="checkbox">
                    <span class="check-ui"></span>
                    Mémoriser la session
                  </label>
                  <a href="#" class="help-link">Besoin d'aide ?</a>
                </div>

                <button type="submit" class="portal-btn" [disabled]="loginForm.invalid || isLoading">
                  <span *ngIf="!isLoading">CONNEXION AU PORTAIL</span>
                  <div *ngIf="isLoading" class="portal-spinner"></div>
                </button>
              </form>

              <div class="security-badge">
                <i class="pi pi-lock"></i>
                <span>SÉCURISÉ PAR L'ÉTAT DU MALI - CHIFFREMENT DE BOUT EN BOUT</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { --primary: #1e3a8a; --accent: #fbbf24; --green: #059669; }

    .portal-env {
      height: 100vh; width: 100vw; display: flex; align-items: center; justify-content: center;
      position: relative; overflow: hidden; font-family: 'Inter', sans-serif;
      background: #020617;
    }

    /* Background Scene */
    .bg-scene {
      position: absolute; top: 0; left: 0; width: 100%; height: 100%;
      background: url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2069') center/cover;
      filter: blur(5px) grayscale(0.5); transform: scale(1.1);
    }
    .bg-overlay {
      position: absolute; top: 0; left: 0; width: 100%; height: 100%;
      background: linear-gradient(135deg, rgba(2, 6, 23, 0.9) 0%, rgba(2, 6, 23, 0.7) 100%);
    }

    .main-card-wrapper { position: relative; z-index: 10; width: 100%; max-width: 1000px; padding: 20px; animation: cardReveal 1s ease-out; }

    .portal-card {
      display: flex; background: white; border-radius: 30px; overflow: hidden;
      box-shadow: 0 40px 100px rgba(0,0,0,0.6); min-height: 600px;
      @media (max-width: 900px) { flex-direction: column; }
    }

    /* INFO PANEL (GAUCHE) */
    .info-panel {
      flex: 1; background: linear-gradient(145deg, #064e3b 0%, #0f172a 100%);
      position: relative; display: flex; color: white; padding: 60px;
      @media (max-width: 900px) { padding: 40px; min-height: 250px; }

      .panel-pattern {
        position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        background-image: radial-gradient(rgba(251, 191, 36, 0.1) 1px, transparent 1px);
        background-size: 30px 30px; opacity: 0.5;
      }

      .panel-content { position: relative; z-index: 5; display: flex; flex-direction: column; width: 100%; }

      .state-header {
        display: flex; align-items: center; gap: 12px; margin-bottom: 60px;
        .flag-pill {
          display: flex; height: 10px; width: 24px; border-radius: 2px; overflow: hidden;
          span { flex: 1; } .v { background: #00913f; } .j { background: #f8d317; } .r { background: #ce1126; }
        }
        .state-name { font-weight: 800; font-size: 0.8rem; letter-spacing: 2px; opacity: 0.8; }
      }

      .branding-hero {
        margin-top: 20px;
        .big-icon { font-size: 3rem; color: var(--accent); margin-bottom: 20px; }
        h1 { font-size: 3rem; font-weight: 900; letter-spacing: -1px; margin: 0; line-height: 1;
          span { color: var(--accent); }
        }
        p { font-size: 1.1rem; opacity: 0.7; margin-top: 20px; line-height: 1.5; max-width: 300px; }
      }

      .panel-footer {
        margin-top: auto;
        .footer-stat {
          display: flex; flex-direction: column;
          .n { font-size: 1.5rem; font-weight: 900; color: var(--accent); }
          .t { font-size: 0.7rem; font-weight: 700; opacity: 0.5; letter-spacing: 2px; }
        }
      }
    }

    /* AUTH PANEL (DROITE) */
    .auth-panel {
      flex: 1.2; background: white; padding: 60px; display: flex; align-items: center;
      @media (max-width: 900px) { padding: 40px; }
    }

    .auth-container { width: 100%; max-width: 400px; margin: 0 auto; }

    .auth-header {
      margin-bottom: 40px;
      h2 { font-size: 2.2rem; font-weight: 900; color: #0f172a; margin: 0 0 10px; }
      p { color: #64748b; font-size: 1rem; line-height: 1.5; }
    }

    .form-field {
      margin-bottom: 24px;
      label { display: block; font-weight: 700; font-size: 0.85rem; color: #475569; margin-bottom: 8px; }
      .input-group {
        position: relative; display: flex; align-items: center;
        i:not(.pi-eye) { position: absolute; left: 16px; color: #94a3b8; transition: all 0.3s; }
        .eye-toggle { position: absolute; right: 10px; background: none; border: none; color: #94a3b8; cursor: pointer; padding: 8px; &:hover { color: var(--primary); } }
        input {
          width: 100%; padding: 16px 16px 16px 48px; border-radius: 12px;
          border: 2px solid #f1f5f9; background: #f8fafc; font-size: 1rem; font-weight: 500;
          transition: all 0.3s; outline: none;
          &::placeholder { color: #cbd5e1; }
        }
      }
      &.focused {
        label { color: var(--primary); }
        .input-group i { color: var(--primary); }
        .input-group input { border-color: var(--primary); background: white; box-shadow: 0 10px 20px -5px rgba(30, 58, 138, 0.1); }
      }
    }

    .form-options {
      display: flex; justify-content: space-between; align-items: center; margin-bottom: 35px;
      .remember-me { display: flex; align-items: center; gap: 10px; cursor: pointer; font-size: 0.85rem; color: #64748b; font-weight: 600;
        input { display: none; }
        .check-ui { width: 18px; height: 18px; border: 2px solid #e2e8f0; border-radius: 5px; transition: 0.2s; position: relative; }
        input:checked + .check-ui { background: var(--primary); border-color: var(--primary); }
        input:checked + .check-ui::after { content: "✓"; position: absolute; color: white; font-size: 12px; left: 3px; top: -1px; }
      }
      .help-link { color: var(--primary); text-decoration: none; font-weight: 700; font-size: 0.85rem; }
    }

    .portal-btn {
      width: 100%; padding: 20px; border-radius: 14px; border: none;
      background: #0f172a; color: white; font-weight: 800; font-size: 1rem; letter-spacing: 1px;
      cursor: pointer; transition: all 0.3s;
      &:hover:not(:disabled) { background: #000; transform: translateY(-3px); box-shadow: 0 15px 30px rgba(0,0,0,0.2); }
      &:disabled { opacity: 0.5; cursor: not-allowed; }
    }

    .security-badge {
      margin-top: 40px; text-align: center; color: #cbd5e1; font-size: 0.65rem; font-weight: 800;
      display: flex; align-items: center; justify-content: center; gap: 8px; letter-spacing: 1px;
      i { font-size: 0.9rem; color: var(--green); }
    }

    @keyframes cardReveal { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
    .portal-spinner { width: 20px; height: 20px; border: 3px solid rgba(255,255,255,0.2); border-radius: 50%; border-top-color: white; animation: spin 0.8s linear infinite; margin: 0 auto; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading: boolean = false;
  activeField: string = '';
  showPassword: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: () => { this.isLoading = false; alert('Identifiants invalides'); }
      });
    }
  }
}
