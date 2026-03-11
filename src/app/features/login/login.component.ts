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
    <div class="login-screen">
      <!-- CÔTÉ GAUCHE : BRANDING & INSPIRATION -->
      <div class="branding-side">
        <div class="overlay"></div>
        <div class="content">
          <div class="logo-wrapper">
             <i class="pi pi-verified"></i>
             <span>SYSTEME DE SUIVI PEDAGOGIQUE</span>
          </div>
          <div class="hero-text">
            <h1>L'excellence par la <span>transparence</span>.</h1>
            <p>Plateforme officielle de gestion et de suivi de l'assiduité des enseignants universitaires du Mali.</p>
          </div>
          <div class="features-mini">
            <div class="f-item"><i class="pi pi-qrcode"></i> QR Code Dynamique</div>
            <div class="f-item"><i class="pi pi-map-marker"></i> Géolocalisation GPS</div>
            <div class="f-item"><i class="pi pi-chart-bar"></i> Statistiques Temps Réel</div>
          </div>
        </div>
        <div class="footer-branding">
          REPULIQUE DU MALI • UN PEUPLE - UN BUT - UNE FOI
        </div>
      </div>

      <!-- CÔTÉ DROIT : FORMULAIRE -->
      <div class="form-side">
        <div class="login-box">
          <div class="form-header">
            <h2>Bon retour !</h2>
            <p>Veuillez vous identifier pour accéder à l'administration.</p>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div class="input-group" [class.focused]="activeField === 'user'">
              <label>Identifiant</label>
              <div class="input-wrapper">
                <i class="pi pi-user"></i>
                <input 
                  type="text" 
                  formControlName="username" 
                  placeholder="admin_mali"
                  (focus)="activeField = 'user'"
                  (blur)="activeField = ''">
              </div>
            </div>

            <div class="input-group" [class.focused]="activeField === 'pass'">
              <label>Mot de passe</label>
              <div class="input-wrapper">
                <i class="pi pi-lock"></i>
                <input 
                  type="password" 
                  formControlName="password" 
                  placeholder="••••••••"
                  (focus)="activeField = 'pass'"
                  (blur)="activeField = ''">
              </div>
            </div>

            <div class="options">
              <label class="check-container">
                <input type="checkbox"> Se souvenir de moi
              </label>
              <a href="#" class="link">Besoin d'aide ?</a>
            </div>

            <button type="submit" class="submit-btn" [disabled]="loginForm.invalid || isLoading">
              <span *ngIf="!isLoading">Accéder au Dashboard</span>
              <i *ngIf="isLoading" class="pi pi-spin pi-spinner"></i>
            </button>
          </form>

          <div class="security-note">
             <i class="pi pi-lock"></i>
             Connexion sécurisée par cryptage SSL 256-bit
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-screen {
      display: flex; width: 100vw; height: 100vh;
      font-family: 'Inter', sans-serif; background: white;
      @media (max-width: 1024px) { flex-direction: column; overflow-y: auto; }
    }

    /* BRANDING SIDE */
    .branding-side {
      flex: 1.2; background: url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=2070') center/cover;
      position: relative; display: flex; flex-direction: column; justify-content: space-between;
      padding: 60px; color: white;
      @media (max-width: 1024px) { padding: 40px; min-height: 400px; flex: none; }
      @media (max-width: 640px) { padding: 30px; min-height: 300px; }

      .overlay {
        position: absolute; top:0; left:0; width:100%; height:100%;
        background: linear-gradient(135deg, rgba(30, 58, 138, 0.95) 0%, rgba(88, 28, 135, 0.9) 100%);
      }

      .content { position: relative; z-index: 2; }
      
      .logo-wrapper {
        display: flex; align-items: center; gap: 12px; font-weight: 800; font-size: 1.1rem;
        letter-spacing: 1px; margin-bottom: 80px;
        i { font-size: 1.8rem; color: #60a5fa; }
      }

      .hero-text {
        h1 { font-size: 3.5rem; font-weight: 900; line-height: 1.1; margin-bottom: 24px;
          span { color: #60a5fa; }
        }
        p { font-size: 1.2rem; line-height: 1.6; opacity: 0.9; max-width: 500px; }
      }

      .features-mini {
        display: flex; gap: 30px; margin-top: 60px;
        .f-item {
          display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 0.9rem;
          background: rgba(255,255,255,0.1); padding: 8px 16px; border-radius: 99px;
          i { color: #60a5fa; }
        }
      }

      .footer-branding { position: relative; z-index: 2; font-size: 0.8rem; letter-spacing: 3px; opacity: 0.6; }
    }

    /* FORM SIDE */
    .form-side {
      flex: 1; display: flex; align-items: center; justify-content: center;
      background: #ffffff; padding: 40px;
    }

    .login-box { width: 100%; max-width: 420px; animation: slideUp 0.6s ease-out; }

    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

    .form-header {
      margin-bottom: 40px;
      h2 { font-size: 2.2rem; font-weight: 800; color: #1e293b; margin: 0 0 10px; }
      p { color: #64748b; font-size: 1rem; }
    }

    .input-group {
      margin-bottom: 24px;
      label { display: block; font-weight: 700; font-size: 0.9rem; color: #475569; margin-bottom: 10px; }
      .input-wrapper {
        position: relative; display: flex; align-items: center;
        i { position: absolute; left: 16px; color: #94a3b8; transition: color 0.3s; }
        input {
          width: 100%; padding: 16px 16px 16px 48px; border-radius: 12px;
          border: 2px solid #f1f5f9; background: #f8fafc; outline: none;
          font-size: 1rem; font-weight: 500; transition: all 0.3s;
          &::placeholder { color: #cbd5e1; }
        }
      }
      &.focused {
        label { color: #2563eb; }
        .input-wrapper i { color: #2563eb; }
        .input-wrapper input { border-color: #2563eb; background: white; box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.1); }
      }
    }

    .options {
      display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;
      .check-container { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; color: #64748b; font-weight: 500; cursor: pointer; }
      .link { color: #2563eb; text-decoration: none; font-weight: 700; font-size: 0.9rem; &:hover { text-decoration: underline; } }
    }

    .submit-btn {
      width: 100%; padding: 18px; border-radius: 14px; border: none;
      background: #1e293b; color: white; font-weight: 800; font-size: 1.1rem;
      cursor: pointer; transition: all 0.3s; box-shadow: 0 10px 15px -3px rgba(30, 41, 59, 0.2);
      &:hover:not(:disabled) { background: #0f172a; transform: translateY(-2px); box-shadow: 0 20px 25px -5px rgba(30, 41, 59, 0.3); }
      &:disabled { opacity: 0.6; cursor: not-allowed; }
    }

    .security-note {
      margin-top: 40px; display: flex; align-items: center; justify-content: center; gap: 8px;
      color: #94a3b8; font-size: 0.8rem; font-weight: 500;
      i { font-size: 0.9rem; }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading: boolean = false;
  activeField: string = '';

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
