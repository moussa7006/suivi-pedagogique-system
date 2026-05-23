import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';

interface AdminProfile {
  id: number | null;
  name: string;
  matricule: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  role: string;
  initials: string;
  photoUrl: string;
  forcePasswordChange: boolean;
}

interface ProfileEditForm {
  matricule: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  role: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="profile-page">
      <div class="profile-hero">
        <div class="hero-left">
          <a
            routerLink="/dashboard"
            class="btn-back-arrow"
            aria-label="Retour au tableau de bord"
            title="Retour au tableau de bord"
          >
            <i class="pi pi-arrow-left"></i>
          </a>
        </div>

        <button class="logout-top" type="button" (click)="logout()">
          <i class="pi pi-sign-out"></i>
          Déconnexion
        </button>
      </div>

      <div class="profile-grid">
        <section class="profile-card identity-card">
          <div class="avatar-ring">
            <ng-container *ngIf="profile.photoUrl; else initialsAvatar">
              <img class="avatar-photo" [src]="profile.photoUrl" alt="Photo de profil" />
            </ng-container>
            <ng-template #initialsAvatar>
              <div class="avatar">{{ profile.initials }}</div>
            </ng-template>
          </div>

          <div class="photo-actions">
            <input
              #photoInput
              type="file"
              accept="image/png,image/jpeg,image/webp"
              hidden
              (change)="onProfilePhotoSelected($event)"
            />

            <button class="photo-btn" type="button" (click)="photoInput.click()">
              <i class="pi pi-camera"></i>
              Changer la photo
            </button>

            <button
              class="photo-btn danger"
              type="button"
              *ngIf="profile.photoUrl"
              (click)="removeProfilePhoto()"
            >
              <i class="pi pi-times"></i>
              Retirer
            </button>
          </div>

          <div class="identity-info">
            <h2>{{ profile.name }}</h2>
            <p>{{ profile.email }}</p>
            <span class="role-badge">
              <i class="pi pi-shield"></i>
              {{ profile.role }}
            </span>
          </div>
        </section>

        <section class="profile-card details-card">
          <div class="card-header">
            <div>
              <span class="eyebrow">Informations</span>
              <h3>Détails du compte</h3>
            </div>
            <span class="status-pill">
              <span class="status-dot"></span>
              Connecté
            </span>
          </div>

          <div class="detail-list">
            <div class="detail-item">
              <div class="detail-icon blue">
                <i class="pi pi-user"></i>
              </div>
              <div>
                <span>Nom affiché</span>
                <strong>{{ profile.name }}</strong>
              </div>
            </div>

            <div class="detail-item">
              <div class="detail-icon violet">
                <i class="pi pi-envelope"></i>
              </div>
              <div>
                <span>Email</span>
                <strong>{{ profile.email }}</strong>
              </div>
            </div>

            <div class="detail-item">
              <div class="detail-icon green">
                <i class="pi pi-lock"></i>
              </div>
              <div>
                <span>Rôle</span>
                <strong>{{ profile.role }}</strong>
              </div>
            </div>

            <div class="detail-item">
              <div class="detail-icon amber">
                <i class="pi pi-key"></i>
              </div>
              <div>
                <span>Mot de passe</span>
                <strong>
                  {{ profile.forcePasswordChange ? 'Changement requis' : 'À jour' }}
                </strong>
              </div>
            </div>
          </div>
        </section>

        <section class="profile-card actions-card">
          <div class="card-header">
            <div>
              <span class="eyebrow">Sécurité</span>
              <h3>Actions rapides</h3>
            </div>
          </div>

          <div class="action-list">
            <button type="button" class="action-item" (click)="toggleEditForm()">
              <span class="action-icon">
                <i class="pi pi-user-edit"></i>
              </span>
              <span>
                <strong>Modifier mon profil</strong>
                <small>Mettre à jour les informations administrateur</small>
              </span>
            </button>

            <button type="button" class="action-item" (click)="togglePasswordForm()">
              <span class="action-icon">
                <i class="pi pi-key"></i>
              </span>
              <span>
                <strong>Changer le mot de passe</strong>
                <small>Mettre à jour le mot de passe administrateur</small>
              </span>
            </button>

            <button type="button" class="action-item" routerLink="/dashboard">
              <span class="action-icon">
                <i class="pi pi-home"></i>
              </span>
              <span>
                <strong>Retour au tableau de bord</strong>
                <small>Revenir à l’espace principal</small>
              </span>
            </button>

            <button type="button" class="action-item danger" (click)="logout()">
              <span class="action-icon">
                <i class="pi pi-sign-out"></i>
              </span>
              <span>
                <strong>Déconnexion</strong>
                <small>Fermer la session administrateur</small>
              </span>
            </button>
          </div>

          <form class="profile-edit-form" *ngIf="isEditFormOpen" (ngSubmit)="submitProfileUpdate()">
            <div class="form-grid">
              <div class="form-group">
                <label for="prenom">Prénom</label>
                <input
                  id="prenom"
                  name="prenom"
                  type="text"
                  [(ngModel)]="profileForm.prenom"
                  placeholder="Prénom"
                  required
                />
              </div>

              <div class="form-group">
                <label for="nom">Nom</label>
                <input
                  id="nom"
                  name="nom"
                  type="text"
                  [(ngModel)]="profileForm.nom"
                  placeholder="Nom"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                [(ngModel)]="profileForm.email"
                placeholder="Adresse email"
                required
              />
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label for="telephone">Téléphone</label>
                <input
                  id="telephone"
                  name="telephone"
                  type="text"
                  [(ngModel)]="profileForm.telephone"
                  placeholder="Téléphone"
                />
              </div>

              <div class="form-group">
                <label for="matricule">Matricule</label>
                <input
                  id="matricule"
                  name="matricule"
                  type="text"
                  [(ngModel)]="profileForm.matricule"
                  placeholder="Matricule"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="adresse">Adresse</label>
              <input
                id="adresse"
                name="adresse"
                type="text"
                [(ngModel)]="profileForm.adresse"
                placeholder="Adresse"
              />
            </div>

            <p class="form-message success" *ngIf="profileSuccessMessage">
              <i class="pi pi-check-circle"></i>
              {{ profileSuccessMessage }}
            </p>

            <p class="form-message error" *ngIf="profileErrorMessage">
              <i class="pi pi-exclamation-triangle"></i>
              {{ profileErrorMessage }}
            </p>

            <button class="submit-password" type="submit" [disabled]="isUpdatingProfile">
              <i
                class="pi"
                [class.pi-spin]="isUpdatingProfile"
                [class.pi-spinner]="isUpdatingProfile"
                [class.pi-save]="!isUpdatingProfile"
              ></i>
              {{ isUpdatingProfile ? 'Enregistrement...' : 'Enregistrer le profil' }}
            </button>
          </form>

          <form
            class="password-form"
            *ngIf="isPasswordFormOpen"
            (ngSubmit)="submitPasswordChange()"
          >
            <div class="form-group">
              <label for="newPassword">Nouveau mot de passe</label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                [(ngModel)]="newPassword"
                placeholder="Saisir le nouveau mot de passe"
                minlength="6"
                required
              />
            </div>

            <div class="form-group">
              <label for="confirmPassword">Confirmer le mot de passe</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                [(ngModel)]="confirmPassword"
                placeholder="Confirmer le nouveau mot de passe"
                minlength="6"
                required
              />
            </div>

            <p class="form-message success" *ngIf="passwordSuccessMessage">
              <i class="pi pi-check-circle"></i>
              {{ passwordSuccessMessage }}
            </p>

            <p class="form-message error" *ngIf="passwordErrorMessage">
              <i class="pi pi-exclamation-triangle"></i>
              {{ passwordErrorMessage }}
            </p>

            <button class="submit-password" type="submit" [disabled]="isChangingPassword">
              <i
                class="pi"
                [class.pi-spin]="isChangingPassword"
                [class.pi-spinner]="isChangingPassword"
                [class.pi-save]="!isChangingPassword"
              ></i>
              {{ isChangingPassword ? 'Modification...' : 'Enregistrer le nouveau mot de passe' }}
            </button>
          </form>
        </section>
      </div>
    </div>
  `,
  styles: [
    `
      .profile-page {
        max-width: 980px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 18px;
      }

      .profile-hero {
        padding: 0 0 4px;
        border-radius: 0;
        background: transparent;
        color: #0f172a;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 18px;
        border: none;
        box-shadow: none;
        overflow: visible;
        position: relative;
      }

      .profile-hero::after {
        display: none;
      }

      .hero-left {
        display: flex;
        align-items: flex-start;
        gap: 18px;
        position: relative;
        z-index: 1;
      }

      .btn-back-arrow {
        width: 40px;
        height: 40px;
        min-width: 40px;
        border-radius: 12px;
        background: #eff6ff;
        border: 1px solid #bfdbfe;
        color: #2563eb;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        box-shadow: 0 8px 18px rgba(37, 99, 235, 0.08);
        transition: all 0.2s ease;
      }

      .btn-back-arrow:hover {
        transform: translateX(-3px);
        background: #dbeafe;
      }

      .eyebrow {
        display: inline-flex;
        margin-bottom: 8px;
        font-size: 0.76rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        opacity: 0.84;
      }

      h1,
      h2,
      h3,
      p {
        margin: 0;
      }

      .profile-hero h1 {
        font-size: clamp(1.35rem, 2.4vw, 1.8rem);
        font-weight: 900;
        letter-spacing: -0.035em;
        color: #0f172a;
      }

      .profile-hero p {
        margin-top: 6px;
        max-width: 620px;
        color: #64748b;
        line-height: 1.5;
        font-weight: 500;
        font-size: 0.9rem;
      }

      .logout-top {
        position: relative;
        z-index: 1;
        border: 0;
        border-radius: 12px;
        padding: 11px 14px;
        background: #fee2e2;
        color: #b91c1c;
        font-weight: 800;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        box-shadow: none;
        transition: all 0.2s ease;
      }

      .logout-top:hover {
        transform: translateY(-1px);
        background: #fecaca;
      }

      .profile-grid {
        display: grid;
        grid-template-columns: 0.72fr 1.28fr;
        gap: 16px;
      }

      .profile-card {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 16px;
        padding: 18px;
        box-shadow: 0 8px 22px rgba(15, 23, 42, 0.04);
      }

      .identity-card {
        min-height: 220px;
        background: #ffffff;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }

      .avatar-ring {
        width: 96px;
        height: 96px;
        border-radius: 999px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #eff6ff;
        margin-bottom: 16px;
      }

      .avatar,
      .avatar-photo {
        width: 72px;
        height: 72px;
        border-radius: 26px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 14px 24px rgba(79, 70, 229, 0.2);
      }

      .avatar {
        background: linear-gradient(135deg, #2563eb, #7c3aed);
        color: white;
        font-size: 1.35rem;
        font-weight: 900;
      }

      .avatar-photo {
        object-fit: cover;
        background: #ffffff;
        border: 2px solid rgba(37, 99, 235, 0.18);
      }

      .photo-actions {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 8px;
        margin-bottom: 14px;
      }

      .photo-btn {
        border: 1px solid #bfdbfe;
        background: #eff6ff;
        color: #1d4ed8;
        border-radius: 999px;
        padding: 8px 12px;
        font-size: 0.78rem;
        font-weight: 800;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 7px;
        transition: all 0.2s ease;
      }

      .photo-btn:hover {
        background: #dbeafe;
        transform: translateY(-1px);
      }

      .photo-btn.danger {
        border-color: #fecaca;
        background: #fef2f2;
        color: #dc2626;
      }

      .photo-btn.danger:hover {
        background: #fee2e2;
      }

      .identity-info {
        text-align: center;
      }

      .identity-info h2 {
        color: #0f172a;
        font-size: 1.25rem;
        font-weight: 900;
      }

      .identity-info p {
        margin-top: 6px;
        color: #64748b;
        font-weight: 600;
        font-size: 0.9rem;
      }

      .role-badge {
        margin-top: 12px;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 7px 11px;
        border-radius: 999px;
        background: rgba(37, 99, 235, 0.1);
        color: #1d4ed8;
        font-weight: 800;
        font-size: 0.78rem;
      }

      .details-card {
        grid-row: span 2;
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 16px;
        margin-bottom: 24px;
      }

      .card-header .eyebrow {
        color: #6366f1;
      }

      .card-header h3 {
        color: #0f172a;
        font-size: 1.25rem;
        font-weight: 900;
      }

      .status-pill {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        border-radius: 999px;
        background: rgba(220, 252, 231, 0.9);
        color: #166534;
        font-size: 0.8rem;
        font-weight: 800;
      }

      .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 999px;
        background: #22c55e;
        box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.14);
      }

      .detail-list {
        display: grid;
        gap: 12px;
      }

      .detail-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px;
        border-radius: 14px;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
      }

      .detail-icon {
        width: 40px;
        height: 40px;
        min-width: 40px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1rem;
      }

      .detail-icon.blue {
        background: rgba(219, 234, 254, 0.9);
        color: #1d4ed8;
      }

      .detail-icon.violet {
        background: rgba(237, 233, 254, 0.9);
        color: #6d28d9;
      }

      .detail-icon.green {
        background: rgba(220, 252, 231, 0.9);
        color: #15803d;
      }

      .detail-icon.amber {
        background: rgba(254, 243, 199, 0.95);
        color: #b45309;
      }

      .detail-item span {
        display: block;
        color: #64748b;
        font-size: 0.82rem;
        font-weight: 700;
        margin-bottom: 3px;
      }

      .detail-item strong {
        color: #0f172a;
        font-size: 0.98rem;
        font-weight: 850;
      }

      .actions-card {
        align-self: start;
      }

      .action-list {
        display: grid;
        gap: 12px;
      }

      .action-item {
        width: 100%;
        border: 1px solid #e2e8f0;
        background: #ffffff;
        border-radius: 18px;
        padding: 16px;
        display: flex;
        align-items: center;
        gap: 14px;
        text-align: left;
        cursor: pointer;
        color: inherit;
        transition: all 0.2s ease;
      }

      .action-item:hover:not(:disabled) {
        transform: translateY(-2px);
        border-color: #93c5fd;
        box-shadow: 0 14px 28px rgba(15, 23, 42, 0.07);
      }

      .action-item:disabled {
        opacity: 0.62;
        cursor: not-allowed;
      }

      .action-icon {
        width: 42px;
        height: 42px;
        min-width: 42px;
        border-radius: 14px;
        background: rgba(37, 99, 235, 0.1);
        color: #2563eb;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .action-item strong {
        display: block;
        color: #0f172a;
        font-size: 0.93rem;
        font-weight: 850;
      }

      .action-item small {
        display: block;
        margin-top: 3px;
        color: #64748b;
        font-weight: 600;
      }

      .action-item.danger {
        border-color: rgba(248, 113, 113, 0.28);
        background: rgba(254, 242, 242, 0.8);
      }

      .action-item.danger .action-icon {
        background: rgba(239, 68, 68, 0.1);
        color: #dc2626;
      }

      .action-item.danger:hover {
        border-color: rgba(220, 38, 38, 0.4);
      }

      .profile-edit-form,
      .password-form {
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid #e2e8f0;
        display: grid;
        gap: 13px;
      }

      .form-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }

      .form-group {
        display: grid;
        gap: 8px;
      }

      .form-group label {
        color: #334155;
        font-size: 0.82rem;
        font-weight: 800;
      }

      .form-group input {
        width: 100%;
        border: 1px solid #cbd5e1;
        border-radius: 14px;
        padding: 13px 14px;
        font: inherit;
        color: #0f172a;
        background: #ffffff;
        transition: all 0.2s ease;
      }

      .form-group input:focus {
        outline: none;
        border-color: #2563eb;
        box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
      }

      .form-message {
        margin: 0;
        padding: 11px 12px;
        border-radius: 14px;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.84rem;
        font-weight: 750;
      }

      .form-message.success {
        background: rgba(220, 252, 231, 0.92);
        color: #166534;
      }

      .form-message.error {
        background: rgba(254, 242, 242, 0.95);
        color: #b91c1c;
      }

      .submit-password {
        border: 0;
        border-radius: 14px;
        padding: 13px 16px;
        background: linear-gradient(135deg, #2563eb, #7c3aed);
        color: #ffffff;
        font-weight: 850;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 9px;
        transition: all 0.2s ease;
      }

      .submit-password:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 14px 26px rgba(37, 99, 235, 0.2);
      }

      .submit-password:disabled {
        opacity: 0.65;
        cursor: not-allowed;
      }

      @media (max-width: 980px) {
        .profile-hero {
          align-items: flex-start;
          flex-direction: column;
        }

        .profile-grid {
          grid-template-columns: 1fr;
        }

        .details-card {
          grid-row: auto;
        }
      }

      @media (max-width: 640px) {
        .profile-hero,
        .profile-card {
          padding: 22px;
          border-radius: 22px;
        }

        .hero-left {
          flex-direction: column;
        }

        .logout-top {
          width: 100%;
          justify-content: center;
        }

        .form-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class ProfileComponent implements OnInit {
  profile: AdminProfile = {
    id: null,
    name: 'Admin User',
    matricule: '',
    nom: '',
    prenom: '',
    email: 'admin@edutrack.local',
    telephone: '',
    adresse: '',
    role: 'Administrateur',
    initials: 'AU',
    photoUrl: '',
    forcePasswordChange: false,
  };

  isEditFormOpen = false;
  isUpdatingProfile = false;
  profileSuccessMessage = '';
  profileErrorMessage = '';
  profileForm: ProfileEditForm = {
    matricule: '',
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    role: 'ADMIN',
  };

  isPasswordFormOpen = false;
  isChangingPassword = false;
  newPassword = '';
  confirmPassword = '';
  passwordSuccessMessage = '';
  passwordErrorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    const savedUser = localStorage.getItem('user');

    if (!savedUser) {
      return;
    }

    try {
      const user = JSON.parse(savedUser);
      const email = user.email || user.username || user.sub || 'admin@edutrack.local';
      const role = this.formatRole(user.role || 'ADMIN');
      const name =
        user.nom && user.prenom ? `${user.prenom} ${user.nom}` : this.getNameFromEmail(email);

      this.profile = {
        id: user.id || null,
        name,
        matricule: user.matricule || '',
        nom: user.nom || '',
        prenom: user.prenom || '',
        email,
        telephone: user.telephone || '',
        adresse: user.adresse || '',
        role,
        initials: this.getInitials(name),
        photoUrl: user.photoUrl || '',
        forcePasswordChange: Boolean(user.forcePasswordChange),
      };
      this.syncProfileForm();
    } catch {
      this.profile = {
        id: null,
        name: 'Admin User',
        matricule: '',
        nom: '',
        prenom: '',
        email: 'admin@edutrack.local',
        telephone: '',
        adresse: '',
        role: 'Administrateur',
        initials: 'AU',
        photoUrl: '',
        forcePasswordChange: false,
      };
      this.syncProfileForm();
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleEditForm(): void {
    this.isEditFormOpen = !this.isEditFormOpen;
    this.profileSuccessMessage = '';
    this.profileErrorMessage = '';
    this.isPasswordFormOpen = false;
    this.syncProfileForm();
  }

  onProfilePhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.profileErrorMessage = 'Veuillez sélectionner une image valide.';
      input.value = '';
      return;
    }

    const maxSizeInBytes = 2 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      this.profileErrorMessage = 'La photo ne doit pas dépasser 2 Mo.';
      input.value = '';
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const photoUrl = String(reader.result || '');
      this.updateStoredProfilePhoto(photoUrl);
      this.profile = {
        ...this.profile,
        photoUrl,
      };
      this.profileSuccessMessage = 'Photo de profil mise à jour.';
      this.profileErrorMessage = '';
      input.value = '';
    };

    reader.onerror = () => {
      this.profileErrorMessage = 'Impossible de charger cette photo.';
      input.value = '';
    };

    reader.readAsDataURL(file);
  }

  removeProfilePhoto(): void {
    this.updateStoredProfilePhoto('');
    this.profile = {
      ...this.profile,
      photoUrl: '',
    };
    this.profileSuccessMessage = 'Photo de profil retirée.';
    this.profileErrorMessage = '';
  }

  togglePasswordForm(): void {
    this.isPasswordFormOpen = !this.isPasswordFormOpen;
    this.passwordSuccessMessage = '';
    this.passwordErrorMessage = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.isEditFormOpen = false;
  }

  submitProfileUpdate(): void {
    this.profileSuccessMessage = '';
    this.profileErrorMessage = '';

    if (!this.profile.id) {
      this.profileErrorMessage = 'Impossible de retrouver l’identifiant du compte connecté.';
      return;
    }

    if (
      !this.profileForm.nom.trim() ||
      !this.profileForm.prenom.trim() ||
      !this.profileForm.email.trim()
    ) {
      this.profileErrorMessage = 'Le prénom, le nom et l’email sont obligatoires.';
      return;
    }

    this.isUpdatingProfile = true;

    this.http
      .put<any>(`${environment.apiUrl}/utilisateurs/modifier/${this.profile.id}`, {
        ...this.profileForm,
        role: this.profileForm.role || 'ADMIN',
      })
      .subscribe({
        next: (updatedUser) => {
          this.isUpdatingProfile = false;

          const savedUser = localStorage.getItem('user');
          const currentUser = savedUser ? JSON.parse(savedUser) : {};
          const nextUser = {
            ...currentUser,
            ...this.profileForm,
            ...updatedUser,
            id: this.profile.id,
            role: currentUser.role, // On garde le rôle actuel pour éviter de perdre les droits si le backend ne le renvoie pas ou le change
          };

          this.authService.updateCurrentUser(nextUser);
          this.applyUserToProfile(nextUser);
          this.profileSuccessMessage = 'Profil administrateur mis à jour avec succès.';
        },
        error: () => {
          this.isUpdatingProfile = false;
          this.profileErrorMessage = 'Impossible de modifier le profil. Veuillez réessayer.';
        },
      });
  }

  submitPasswordChange(): void {
    this.passwordSuccessMessage = '';
    this.passwordErrorMessage = '';

    if (!this.newPassword || !this.confirmPassword) {
      this.passwordErrorMessage = 'Veuillez renseigner et confirmer le nouveau mot de passe.';
      return;
    }

    if (this.newPassword.length < 14) {
      this.passwordErrorMessage = 'Le mot de passe doit contenir au moins 14 caractères.';
      return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{14,}$/.test(this.newPassword)) {
      this.passwordErrorMessage =
        'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.passwordErrorMessage = 'Les deux mots de passe ne correspondent pas.';
      return;
    }

    this.isChangingPassword = true;

    this.authService.changePassword(this.newPassword).subscribe({
      next: () => {
        this.isChangingPassword = false;
        this.passwordSuccessMessage = 'Mot de passe modifié avec succès.';
        this.newPassword = '';
        this.confirmPassword = '';

        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          try {
            const user = JSON.parse(savedUser);
            user.forcePasswordChange = false;
            localStorage.setItem('user', JSON.stringify(user));
            this.profile = {
              ...this.profile,
              forcePasswordChange: false,
            };
          } catch {
            localStorage.removeItem('user');
          }
        }
      },
      error: () => {
        this.isChangingPassword = false;
        this.passwordErrorMessage = 'Impossible de modifier le mot de passe. Veuillez réessayer.';
      },
    });
  }

  private syncProfileForm(): void {
    this.profileForm = {
      matricule: this.profile.matricule,
      nom: this.profile.nom,
      prenom: this.profile.prenom,
      email: this.profile.email,
      telephone: this.profile.telephone,
      adresse: this.profile.adresse,
      role: this.profile.role === 'Administrateur' ? 'ADMIN' : this.profile.role,
    };
  }

  private applyUserToProfile(user: any): void {
    const email = user.email || 'admin@edutrack.local';
    const role = this.formatRole(user.role || 'ADMIN');
    const name =
      user.nom && user.prenom ? `${user.prenom} ${user.nom}` : this.getNameFromEmail(email);

    this.profile = {
      id: user.id || this.profile.id,
      name,
      matricule: user.matricule || '',
      nom: user.nom || '',
      prenom: user.prenom || '',
      email,
      telephone: user.telephone || '',
      adresse: user.adresse || '',
      role,
      initials: this.getInitials(name),
      photoUrl: user.photoUrl || '',
      forcePasswordChange: Boolean(user.forcePasswordChange),
    };

    this.syncProfileForm();
  }

  private updateStoredProfilePhoto(photoUrl: string): void {
    const savedUser = localStorage.getItem('user');
    const user = savedUser ? JSON.parse(savedUser) : {};

    if (photoUrl) {
      user.photoUrl = photoUrl;
    } else {
      delete user.photoUrl;
    }

    localStorage.setItem('user', JSON.stringify(user));
    window.dispatchEvent(new Event('profile-updated'));
  }

  private getNameFromEmail(email: string): string {
    const localPart = email.split('@')[0];

    if (!localPart) {
      return 'Admin User';
    }

    return localPart
      .replace(/[._-]+/g, ' ')
      .split(' ')
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');
  }

  private getInitials(name: string): string {
    const initials = name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');

    return initials || 'AU';
  }

  private formatRole(role: string): string {
    const normalizedRole = role.toUpperCase();

    if (normalizedRole === 'ADMIN') {
      return 'Administrateur';
    }

    if (normalizedRole === 'ENSEIGNANT') {
      return 'Enseignant';
    }

    return role;
  }
}
