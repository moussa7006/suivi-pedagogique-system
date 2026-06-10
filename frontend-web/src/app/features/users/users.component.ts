import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { Teacher } from '../../core/models/teacher.model';
import { timeout } from 'rxjs/operators';

@Component({
  selector: 'app-teachers',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-left">
          <div class="header-left-top">
            <a
              routerLink="/dashboard"
              class="btn-back-arrow"
              aria-label="Retour au tableau de bord"
              title="Retour au tableau de bord"
            >
              <i class="pi pi-arrow-left"></i>
            </a>
            <div class="header-left-titles">
              <h1>Gestion des Utilisateurs</h1>
              <p>
                Supervisez l'ensemble des administrateurs et enseignants ({{ teachers.length }}
                enregistrés)
              </p>
            </div>
          </div>
        </div>
        <div class="header-actions">
          <input
            type="file"
            #fileInput
            (change)="onFileSelected($event)"
            accept=".xlsx, .xls"
            style="display: none;"
          />
          <button class="btn btn-outline" type="button" (click)="downloadImportTemplate()">
            <i class="pi pi-download"></i> Modèle
          </button>
          <button
            class="btn btn-outline"
            type="button"
            (click)="fileInput.click()"
            [disabled]="isImporting"
          >
            <i
              class="pi"
              [class.pi-upload]="!isImporting"
              [class.pi-spin]="isImporting"
              [class.pi-spinner]="isImporting"
            ></i>
            {{ isImporting ? 'Import...' : 'Importer' }}
          </button>
          <button class="btn btn-primary" type="button" (click)="showAddForm()">
            <i class="pi pi-plus"></i> Nouveau
          </button>
        </div>
      </div>

      <!-- ── Form Card ── -->
      <div class="form-card" *ngIf="displayForm">
        <div class="form-card-header">
          <h3>{{ editingId ? 'Modifier l'utilisateur' : 'Nouvel utilisateur' }}</h3>
        </div>
        <div class="form-card-body">
          <div *ngIf="errorMessage" class="error-banner">
            <i class="pi pi-exclamation-triangle"></i>
            {{ errorMessage }}
          </div>

          <div class="form-section">
            <div class="section-label">
              <i class="pi pi-user"></i>
              <span>Identité</span>
            </div>
            <div class="section-grid">
              <div class="input-group">
                <label>Prénom</label>
                <input type="text" [(ngModel)]="currentTeacher.prenom" placeholder="Prénom" />
              </div>
              <div class="input-group">
                <label>Nom</label>
                <input type="text" [(ngModel)]="currentTeacher.nom" placeholder="Nom de famille" />
              </div>
              <div class="input-group">
                <label>Matricule</label>
                <input
                  type="text"
                  [(ngModel)]="currentTeacher.matricule"
                  placeholder="Ex: ENS-001"
                />
              </div>
              <div class="input-group">
                <label>Rôle</label>
                <select [(ngModel)]="currentTeacher.role">
                  <option value="ENSEIGNANT">Enseignant</option>
                  <option value="ADMINISTRATEUR">Administrateur</option>
                </select>
              </div>
            </div>
          </div>

          <div class="form-section">
            <div class="section-label">
              <i class="pi pi-phone"></i>
              <span>Contact</span>
            </div>
            <div class="section-grid">
              <div class="input-group">
                <label>Email</label>
                <input
                  type="email"
                  [(ngModel)]="currentTeacher.email"
                  placeholder="email@exemple.com"
                />
              </div>
              <div class="input-group">
                <label>Téléphone</label>
                <input type="text" [(ngModel)]="currentTeacher.telephone" placeholder="+223..." />
              </div>
              <div class="input-group" *ngIf="!editingId">
                <label>Adresse</label>
                <input
                  type="text"
                  [(ngModel)]="currentTeacher.adresse"
                  placeholder="Quartier, Ville..."
                />
              </div>
            </div>
          </div>

          <div class="form-section" *ngIf="!editingId">
            <div class="section-label">
              <i class="pi pi-lock"></i>
              <span>Sécurité</span>
            </div>
            <div class="section-grid">
              <div class="input-group">
                <label>Mot de Passe (provisoire)</label>
                <div class="password-wrapper">
                  <input
                    [type]="showPassword ? 'text' : 'password'"
                    [(ngModel)]="provisionalPassword"
                    placeholder="Minimum 8 caractères"
                    class="password-input"
                  />
                  <button
                    type="button"
                    class="eye-toggle"
                    (click)="showPassword = !showPassword"
                    [attr.aria-label]="
                      showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'
                    "
                    [title]="showPassword ? 'Masquer' : 'Afficher'"
                  >
                    <i
                      class="pi"
                      [class.pi-eye]="!showPassword"
                      [class.pi-eye-slash]="showPassword"
                    ></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button class="btn btn-outline" (click)="displayForm = false" [disabled]="isSaving">
              Annuler
            </button>
            <button class="btn btn-primary" (click)="save()" [disabled]="isSaving">
              <i
                class="pi"
                [class.pi-check]="!isSaving"
                [class.pi-spin]="isSaving"
                [class.pi-spinner]="isSaving"
              ></i>
              {{ isSaving ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
          </div>
        </div>
      </div>

      <!-- ── Tabs + Search ── -->
      <div class="toolbar-section">
        <div class="tabs-pill">
          <button
            class="tab-btn"
            [class.active-enseignant]="activeTab === 'ENSEIGNANT'"
            (click)="activeTab = 'ENSEIGNANT'"
          >
            <i class="pi pi-users"></i>
            <span>Enseignants</span>
            <span class="tab-count">{{ filteredEnseignants.length }}</span>
          </button>
          <button
            class="tab-btn"
            [class.active-admin]="activeTab === 'ADMINISTRATEUR'"
            (click)="activeTab = 'ADMINISTRATEUR'"
          >
            <i class="pi pi-shield"></i>
            <span>Administrateurs</span>
            <span class="tab-count">{{ filteredAdmins.length }}</span>
          </button>
        </div>

        <div class="search-wrapper">
          <i class="pi pi-search"></i>
          <input
            type="text"
            placeholder="Rechercher nom, prénom, matricule, email..."
            [(ngModel)]="searchText"
            (input)="filterTeachers()"
          />
        </div>
      </div>

      <!-- ── Empty State ── -->
      <div
        class="empty-state"
        *ngIf="
          (activeTab === 'ENSEIGNANT' && filteredEnseignants.length === 0) ||
          (activeTab === 'ADMINISTRATEUR' && filteredAdmins.length === 0)
        "
      >
        <div class="empty-icon">
          <i
            class="pi"
            [class.pi-users]="activeTab === 'ENSEIGNANT'"
            [class.pi-shield]="activeTab === 'ADMINISTRATEUR'"
          ></i>
        </div>
        <h3>
          {{
            activeTab === 'ENSEIGNANT' ? 'Aucun enseignant trouvé' : 'Aucun administrateur trouvé'
          }}
        </h3>
        <p>
          Utilisez le bouton "Nouveau" pour ajouter un
          {{ activeTab === 'ENSEIGNANT' ? 'enseignant' : 'administrateur' }}.
        </p>
      </div>

      <!-- ── Cards Grid ── -->
      <div class="cards-grid" *ngIf="activeTab === 'ENSEIGNANT' && filteredEnseignants.length > 0">
        <div class="user-card enseignant" *ngFor="let teacher of filteredEnseignants">
          <div class="card-accent"></div>
          <div class="card-body">
            <div class="card-avatar">
              {{ getInitials(teacher.prenom, teacher.nom) }}
            </div>
            <div class="card-identity">
              <div class="card-name">{{ teacher.prenom }} {{ teacher.nom }}</div>
              <span class="badge-role enseignant">{{ teacher.role || 'ENSEIGNANT' }}</span>
            </div>
            <div class="card-details">
              <div class="detail-item">
                <i class="pi pi-id-card"></i>
                <span>{{ teacher.matricule || 'N/A' }}</span>
              </div>
              <div class="detail-item">
                <i class="pi pi-envelope"></i>
                <span>{{ teacher.email }}</span>
              </div>
              <div class="detail-item">
                <i class="pi pi-phone"></i>
                <span>{{ teacher.telephone }}</span>
              </div>
              <div class="detail-item">
                <i class="pi pi-map-marker"></i>
                <span>{{ teacher.adresse }}</span>
              </div>
            </div>
          </div>
          <div class="card-actions">
            <button class="btn-icon-sm edit" (click)="showEditForm(teacher)" title="Modifier">
              <i class="pi pi-pencil"></i>
            </button>
            <button
              class="btn-icon-sm delete"
              (click)="deleteTeacher(teacher.id!)"
              title="Supprimer"
            >
              <i class="pi pi-trash"></i>
            </button>
          </div>
        </div>
      </div>

      <div class="cards-grid" *ngIf="activeTab === 'ADMINISTRATEUR' && filteredAdmins.length > 0">
        <div class="user-card admin" *ngFor="let teacher of filteredAdmins">
          <div class="card-accent admin-accent"></div>
          <div class="card-body">
            <div class="card-avatar admin-avatar">
              {{ getInitials(teacher.prenom, teacher.nom) }}
            </div>
            <div class="card-identity">
              <div class="card-name">{{ teacher.prenom }} {{ teacher.nom }}</div>
              <span class="badge-role admin">{{ teacher.role }}</span>
            </div>
            <div class="card-details">
              <div class="detail-item">
                <i class="pi pi-id-card"></i>
                <span>{{ teacher.matricule || 'N/A' }}</span>
              </div>
              <div class="detail-item">
                <i class="pi pi-envelope"></i>
                <span>{{ teacher.email }}</span>
              </div>
              <div class="detail-item">
                <i class="pi pi-phone"></i>
                <span>{{ teacher.telephone }}</span>
              </div>
              <div class="detail-item">
                <i class="pi pi-map-marker"></i>
                <span>{{ teacher.adresse }}</span>
              </div>
            </div>
          </div>
          <div class="card-actions">
            <button class="btn-icon-sm edit" (click)="showEditForm(teacher)" title="Modifier">
              <i class="pi pi-pencil"></i>
            </button>
            <button
              class="btn-icon-sm delete"
              (click)="deleteTeacher(teacher.id!)"
              title="Supprimer"
            >
              <i class="pi pi-trash"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- ── Confirm Delete Dialog ── -->
      <div class="confirm-backdrop" *ngIf="confirmDeleteId !== null" (click)="cancelDelete()">
        <div
          class="confirm-dialog"
          role="dialog"
          aria-modal="true"
          (click)="$event.stopPropagation()"
        >
          <div class="confirm-icon">
            <i class="pi pi-trash"></i>
          </div>
          <h3>Confirmer la suppression</h3>
          <p>{{ confirmDeleteMessage }}</p>
          <div class="confirm-actions">
            <button class="btn btn-outline" type="button" (click)="cancelDelete()">Annuler</button>
            <button class="btn btn-danger" type="button" (click)="confirmDelete()">OK</button>
          </div>
        </div>
      </div>

      <!-- ── Confirm Import Dialog ── -->
      <div class="confirm-backdrop" *ngIf="pendingImportFile" (click)="cancelImport()">
        <div
          class="confirm-dialog"
          role="dialog"
          aria-modal="true"
          (click)="$event.stopPropagation()"
        >
          <div class="confirm-icon import-icon">
            <i class="pi pi-upload"></i>
          </div>
          <h3>Confirmer l'import</h3>
          <p>{{ confirmImportMessage }}</p>
          <div class="confirm-actions">
            <button class="btn btn-outline" type="button" (click)="cancelImport()">Annuler</button>
            <button class="btn btn-primary" type="button" (click)="confirmImport()">OK</button>
          </div>
        </div>
      </div>

      <!-- ── Result Dialog ── -->
      <div class="confirm-backdrop" *ngIf="resultDialogMessage" (click)="closeResultDialog()">
        <div
          class="confirm-dialog"
          role="dialog"
          aria-modal="true"
          (click)="$event.stopPropagation()"
        >
          <div
            class="confirm-icon"
            [ngClass]="resultDialogType === 'success' ? 'success-icon' : 'error-icon'"
          >
            <i
              class="pi"
              [class.pi-check-circle]="resultDialogType === 'success'"
              [class.pi-exclamation-triangle]="resultDialogType === 'error'"
            ></i>
          </div>
          <h3>{{ resultDialogTitle }}</h3>
          <p>{{ resultDialogMessage }}</p>

          <div class="report-summary" *ngIf="importReportSummary.length > 0">
            <div class="report-row" *ngFor="let item of importReportSummary">
              <i class="pi pi-check-circle"></i>
              <span>{{ item }}</span>
            </div>
          </div>

          <div class="report-errors" *ngIf="importReportErrors.length > 0">
            <strong class="errors-title">Lignes ignorées</strong>
            <div class="error-row" *ngFor="let error of importReportErrors">• {{ error }}</div>
          </div>

          <div class="confirm-actions">
            <button class="btn btn-primary" type="button" (click)="closeResultDialog()">OK</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './users.component.scss',
})
export class TeachersComponent implements OnInit {
  teachers: Teacher[] = [];
  filteredEnseignants: Teacher[] = [];
  filteredAdmins: Teacher[] = [];
  activeTab: 'ENSEIGNANT' | 'ADMINISTRATEUR' = 'ENSEIGNANT';
  searchText: string = '';
  showPassword: boolean = false;
  provisionalPassword: string = '';

  displayForm: boolean = false;
  editingId: number | null = null;
  currentTeacher: Partial<Teacher> = {};
  errorMessage: string = '';
  isSaving: boolean = false;
  confirmDeleteId: number | null = null;
  confirmDeleteMessage = '';
  pendingImportFile: File | null = null;
  confirmImportMessage = '';
  resultDialogTitle = '';
  resultDialogMessage = '';
  resultDialogType: 'success' | 'error' = 'success';
  importReportSummary: string[] = [];
  importReportErrors: string[] = [];
  isImporting = false;

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadTeachers();
  }

  loadTeachers() {
    this.userService.getUsers().subscribe({
      next: (data) => {
        console.log('Données brutes reçues du backend :', data);
        this.teachers = data;
        this.filterTeachers();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des utilisateurs:', err);
      },
    });
  }

  filterTeachers() {
    const text = this.searchText.toLowerCase();
    const filtered = this.teachers.filter(
      (t) =>
        (t.nom || '').toLowerCase().includes(text) ||
        (t.prenom || '').toLowerCase().includes(text) ||
        (t.matricule || '').toLowerCase().includes(text) ||
        (t.email || '').toLowerCase().includes(text),
    );
    this.filteredEnseignants = filtered.filter((t) => this.normalizeRole(t.role) === 'ENSEIGNANT');
    this.filteredAdmins = filtered.filter((t) => this.normalizeRole(t.role) === 'ADMINISTRATEUR');
  }

  getInitials(prenom?: string, nom?: string): string {
    const p = (prenom || '').charAt(0).toUpperCase();
    const n = (nom || '').charAt(0).toUpperCase();
    return p + n || '??';
  }

  private normalizeRole(role?: string): 'ENSEIGNANT' | 'ADMINISTRATEUR' {
    const normalizedRole = (role || '').trim().toUpperCase();
    return normalizedRole === 'ADMIN' || normalizedRole === 'ADMINISTRATEUR'
      ? 'ADMINISTRATEUR'
      : 'ENSEIGNANT';
  }

  showAddForm() {
    this.editingId = null;
    this.errorMessage = '';
    this.isSaving = false;
    this.showPassword = false;
    this.provisionalPassword = '';
    this.currentTeacher = { role: 'ENSEIGNANT' };
    this.displayForm = true;
  }

  showEditForm(t: Teacher) {
    this.editingId = t.id!;
    this.errorMessage = '';
    this.isSaving = false;
    this.showPassword = false;
    this.provisionalPassword = '';
    this.currentTeacher = { ...t };
    this.displayForm = true;
  }

  save() {
    this.errorMessage = '';

    const teacherToSave: Teacher = {
      ...this.currentTeacher,
      matricule: this.currentTeacher.matricule?.trim() ?? '',
      nom: this.currentTeacher.nom?.trim() ?? '',
      prenom: this.currentTeacher.prenom?.trim() ?? '',
      email: this.currentTeacher.email?.trim() ?? '',
      telephone: this.currentTeacher.telephone?.trim() ?? '',
      adresse: this.currentTeacher.adresse?.trim() ?? '',
      role: this.normalizeRole(this.currentTeacher.role || 'ENSEIGNANT'),
      actif: true,
    };

    if (
      !teacherToSave.nom ||
      !teacherToSave.prenom ||
      !teacherToSave.email ||
      !teacherToSave.matricule ||
      !teacherToSave.telephone ||
      !teacherToSave.adresse
    ) {
      this.errorMessage =
        "Veuillez renseigner le matricule, le prénom, le nom, l'email, le téléphone et l'adresse.";
      return;
    }

    if (!this.editingId && !this.provisionalPassword) {
      this.errorMessage = 'Veuillez renseigner un mot de passe provisoire.';
      return;
    }

    if (!this.editingId && this.provisionalPassword && this.provisionalPassword.length < 14) {
      this.errorMessage = 'Le mot de passe doit contenir au moins 14 caractères.';
      return;
    }

    if (
      !this.editingId &&
      this.provisionalPassword &&
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{14,}$/.test(this.provisionalPassword)
    ) {
      this.errorMessage =
        'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre.';
      return;
    }

    this.isSaving = true;

    const request$ = this.editingId
      ? this.userService.update(this.editingId, teacherToSave)
      : this.userService.create({
          ...(teacherToSave as any),
          motDePasse: this.provisionalPassword,
        });

    request$.pipe(timeout(12000)).subscribe({
      next: (savedTeacher: any) => {
        const normalizedTeacher: Teacher = {
          ...teacherToSave,
          id: savedTeacher?.id || this.editingId || teacherToSave.id,
        };

        if (this.editingId) {
          this.teachers = this.teachers.map((teacher) =>
            teacher.id === this.editingId ? { ...teacher, ...normalizedTeacher } : teacher,
          );
        } else {
          this.teachers = [normalizedTeacher, ...this.teachers];
          this.activeTab =
            normalizedTeacher.role === 'ADMINISTRATEUR' ? 'ADMINISTRATEUR' : 'ENSEIGNANT';
        }

        this.filterTeachers();
        this.displayForm = false;
        this.isSaving = false;
        this.errorMessage = '';
        this.currentTeacher = {};
        this.editingId = null;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.isSaving = false;

        if (error?.name === 'TimeoutError') {
          this.errorMessage =
            'Le serveur met trop de temps à répondre. Vérifiez que le backend est démarré puis réessayez.';
          return;
        }

        if (error?.status === 401) {
          this.errorMessage = 'Votre session a expiré. Veuillez vous reconnecter.';
          return;
        }

        if (error?.status === 403) {
          this.errorMessage =
            "Vous n'avez pas les droits nécessaires pour enregistrer cet utilisateur.";
          return;
        }

        if (error?.status === 409) {
          this.errorMessage =
            error?.error?.error ||
            'Un utilisateur existe déjà avec cet email, ce matricule ou ce téléphone.';
          return;
        }

        this.errorMessage =
          error?.error?.error ||
          error?.error?.message ||
          "Impossible d'enregistrer l'utilisateur. Vérifiez le backend et réessayez.";
      },
    });
  }

  deleteTeacher(id: number) {
    this.confirmDeleteId = id;
    this.confirmDeleteMessage = 'Voulez-vous vraiment supprimer cet utilisateur ?';
  }

  cancelDelete() {
    this.confirmDeleteId = null;
    this.confirmDeleteMessage = '';
  }

  confirmDelete() {
    if (this.confirmDeleteId === null) {
      return;
    }

    const id = this.confirmDeleteId;
    this.cancelDelete();

    this.userService.delete(id).subscribe({
      next: () => this.loadTeachers(),
      error: (err) => console.error('Erreur lors de la suppression', err),
    });
  }

  downloadImportTemplate() {
    const csvContent = [
      'nom,prenom,email,telephone,matricule',
      'Keita,Moussa,moussa.keita@example.com,70000000,ENS-001',
      'Diarra,Aminata,aminata.diarra@example.com,71000000,ENS-002',
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'modele-import-enseignants.csv';
    link.click();

    window.URL.revokeObjectURL(url);
  }

  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.pendingImportFile = file;
      this.confirmImportMessage = `Voulez-vous importer les enseignants depuis le fichier ${file.name} ?`;
    }

    input.value = '';
  }

  cancelImport() {
    this.pendingImportFile = null;
    this.confirmImportMessage = '';
  }

  confirmImport() {
    if (!this.pendingImportFile) {
      return;
    }

    const file = this.pendingImportFile;
    this.cancelImport();
    this.isImporting = true;
    this.importReportSummary = [];
    this.importReportErrors = [];

    this.userService.importTeachers(file).subscribe({
      next: (res: any) => {
        this.isImporting = false;

        const totalRows = Number(res?.totalRows ?? 0);
        const importedCount = Number(res?.importedCount ?? 0);
        const skippedCount = Number(res?.skippedCount ?? 0);
        this.importReportErrors = Array.isArray(res?.errors) ? res.errors : [];

        this.importReportSummary = [
          `Lignes analysées : ${totalRows}`,
          `Enseignants importés : ${importedCount}`,
          `Lignes ignorées : ${skippedCount}`,
          'Mot de passe provisoire : Intec@2026',
        ];

        this.showResultDialog(
          'Import terminé',
          this.importReportErrors.length > 0
            ? 'Le fichier a été traité. Certaines lignes ont été ignorées.'
            : res?.message || 'Les enseignants ont été importés avec succès.',
          'success',
        );
        this.loadTeachers();
      },
      error: (err) => {
        this.isImporting = false;
        this.importReportSummary = [];
        this.importReportErrors = [];

        this.showResultDialog(
          'Import impossible',
          err?.error?.error || "Erreur lors de l'importation des enseignants.",
          'error',
        );
      },
    });
  }

  showResultDialog(title: string, message: string, type: 'success' | 'error') {
    this.resultDialogTitle = title;
    this.resultDialogMessage = message;
    this.resultDialogType = type;
  }

  closeResultDialog() {
    this.resultDialogTitle = '';
    this.resultDialogMessage = '';
    this.resultDialogType = 'success';
    this.importReportSummary = [];
    this.importReportErrors = [];
  }
}
