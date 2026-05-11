import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ScheduleService } from '../../core/services/schedule.service';
import { ClasseService } from '../../core/services/classe.service';
import { MatiereService } from '../../core/services/matiere.service';
import { TeacherService } from '../../core/services/teacher.service';
import { SalleService } from '../../core/services/salle.service';
import { AnneeUniversitaireService } from '../../core/services/annee-universitaire.service';
import { EmploiDuTemps } from '../../core/models/schedule.model';
import { Classe } from '../../core/models/classe.model';
import { Matiere } from '../../core/models/matiere.model';
import { Teacher } from '../../core/models/user.model';
import { Salle } from '../../core/models/salle.model';
import { AnneeUniversitaire } from '../../core/models/annee-universitaire.model';

@Component({
  selector: 'app-schedule',
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
              <h1>Emploi du temps</h1>
              <p>Planifiez les cours ({{ schedules.length }} planifications effectuées)</p>
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
          <button class="btn btn-outline" (click)="fileInput.click()">
            <i class="pi pi-upload"></i> Importer
          </button>
          <button class="btn btn-primary" (click)="showAddForm()">
            <i class="pi pi-calendar-plus"></i> Nouvelle Planification
          </button>
        </div>
      </div>

      <!-- ── Form Card ── -->
      <div class="form-card" *ngIf="displayForm">
        <div class="form-card-header">
          <h3>Nouvelle Planification</h3>
        </div>
        <div class="form-card-body">
          <div class="form-section">
            <div class="section-label">
              <i class="pi pi-calendar"></i>
              <span>Planification</span>
            </div>
            <div class="section-grid">
              <div class="input-group">
                <label>Titre de la planification</label>
                <input
                  type="text"
                  [(ngModel)]="currentSchedule.titre"
                  placeholder="Ex: Informatique Semestre 1"
                />
              </div>
              <div class="input-group">
                <label>Type de récurrence</label>
                <select [(ngModel)]="currentSchedule.typeRecurrence">
                  <option value="HEBDOMADAIRE">Hebdomadaire</option>
                  <option value="MENSUEL">Mensuel</option>
                  <option value="UNIQUE">Unique</option>
                </select>
              </div>
              <div class="input-group">
                <label>Année Universitaire</label>
                <select [(ngModel)]="currentSchedule.anneeUniversitaireId">
                  <option [value]="null" disabled>Sélectionnez une année</option>
                  <option *ngFor="let a of anneesUniversitaires" [value]="a.id">
                    {{ a.libelle }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div class="form-section" *ngIf="currentSchedule.typeRecurrence === 'HEBDOMADAIRE'">
            <div class="section-label">
              <i class="pi pi-clock"></i>
              <span>Récurrence hebdomadaire</span>
            </div>
            <div class="section-grid">
              <div class="input-group">
                <label>Jour de la semaine</label>
                <select [(ngModel)]="currentSchedule.jourSemaine">
                  <option *ngFor="let j of jours" [value]="j">{{ j }}</option>
                </select>
              </div>
              <div class="input-group">
                <label>Valide à partir de</label>
                <input type="date" [(ngModel)]="currentSchedule.dateDebutValidite" />
              </div>
              <div class="input-group">
                <label>Jusqu'au</label>
                <input type="date" [(ngModel)]="currentSchedule.dateFinValidite" />
              </div>
            </div>
          </div>

          <div class="form-section" *ngIf="currentSchedule.typeRecurrence === 'UNIQUE'">
            <div class="section-label">
              <i class="pi pi-calendar"></i>
              <span>Date spécifique</span>
            </div>
            <div class="section-grid">
              <div class="input-group">
                <label>Date Spécifique</label>
                <input type="date" [(ngModel)]="currentSchedule.dateSpecifique" />
              </div>
            </div>
          </div>

          <div class="form-section" *ngIf="currentSchedule.typeRecurrence === 'MENSUEL'">
            <div class="section-label">
              <i class="pi pi-calendar"></i>
              <span>Récurrence mensuelle</span>
            </div>
            <div class="section-grid">
              <div class="input-group">
                <label>Jour du mois</label>
                <input type="number" [(ngModel)]="currentSchedule.jourDuMois" min="1" max="31" />
              </div>
            </div>
          </div>

          <div class="form-section">
            <div class="section-label">
              <i class="pi pi-clock"></i>
              <span>Horaire & Salle</span>
            </div>
            <div class="section-grid">
              <div class="input-group">
                <label>Heure Début</label>
                <input type="time" [(ngModel)]="currentSchedule.heureDebut" />
              </div>
              <div class="input-group">
                <label>Heure Fin</label>
                <input type="time" [(ngModel)]="currentSchedule.heureFin" />
              </div>
              <div class="input-group">
                <label>Salle</label>
                <select [(ngModel)]="currentSchedule.salleId">
                  <option [value]="null" disabled>Sélectionnez une salle</option>
                  <option *ngFor="let s of salles" [value]="s.id">
                    {{ s.nom }} ({{ s.batiment }})
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div class="form-section">
            <div class="section-label">
              <i class="pi pi-users"></i>
              <span>Affectation</span>
            </div>
            <div class="section-grid">
              <div class="input-group">
                <label>Classe</label>
                <select [(ngModel)]="selectedClasseId">
                  <option [value]="null" disabled>Sélectionnez une classe</option>
                  <option *ngFor="let c of classes" [value]="c.id">
                    {{ c.libelle }}
                  </option>
                </select>
              </div>
              <div class="input-group">
                <label>Matière</label>
                <select [(ngModel)]="selectedMatiereId">
                  <option [value]="null" disabled>Sélectionnez une matière</option>
                  <option *ngFor="let m of matieres" [value]="m.id">{{ m.libelle }}</option>
                </select>
              </div>
              <div class="input-group">
                <label>Enseignant</label>
                <select [(ngModel)]="selectedTeacherId">
                  <option [value]="null" disabled>Sélectionnez un enseignant</option>
                  <option *ngFor="let t of teachers" [value]="t.id">
                    {{ t.prenom }} {{ t.nom }}
                  </option>
                </select>
              </div>
            </div>

            <div class="form-actions">
              <button class="btn btn-outline" (click)="displayForm = false">Annuler</button>
              <button class="btn btn-primary" (click)="save()">
                <i class="pi pi-check"></i> Planifier
              </button>
            </div>
          </div>
        </div>

        <!-- ── Search ── -->
        <div class="search-section">
          <div class="search-wrapper">
            <i class="pi pi-search"></i>
            <input
              type="text"
              placeholder="Rechercher titre, salle, enseignant..."
              [(ngModel)]="searchText"
              (input)="filterSchedules()"
            />
          </div>
        </div>

        <!-- ── Empty State ── -->
        <div class="empty-state" *ngIf="filteredSchedules.length === 0">
          <div class="empty-icon">
            <i class="pi pi-calendar"></i>
          </div>
          <h3>Aucune planification trouvée</h3>
          <p>Créez une nouvelle planification pour commencer.</p>
        </div>

        <!-- ── Cards Grid ── -->
        <div class="cards-grid" *ngIf="filteredSchedules.length > 0">
          <div class="schedule-card" *ngFor="let s of filteredSchedules">
            <div class="card-accent"></div>
            <div class="card-body">
              <div class="card-header-row">
                <div class="card-title">{{ s.titre || 'Sans-titre' }}</div>
                <span class="badge-type" [ngClass]="s.typeRecurrence?.toLowerCase()">
                  {{ s.typeRecurrence }}
                </span>
              </div>

              <div class="card-schedule-info">
                <div class="schedule-row">
                  <i class="pi pi-calendar"></i>
                  <span>
                    <ng-container *ngIf="s.typeRecurrence === 'HEBDOMADAIRE'">{{
                      s.jourSemaine
                    }}</ng-container>
                    <ng-container *ngIf="s.typeRecurrence === 'UNIQUE'">{{
                      s.dateSpecifique
                    }}</ng-container>
                    <ng-container *ngIf="s.typeRecurrence === 'MENSUEL'"
                      >Le {{ s.jourDuMois }} du mois</ng-container
                    >
                  </span>
                </div>
                <div class="schedule-row">
                  <i class="pi pi-clock"></i>
                  <span>{{ s.heureDebut }} - {{ s.heureFin }}</span>
                </div>
                <div class="schedule-row">
                  <i class="pi pi-map-marker"></i>
                  <span>{{ getSalleNom(s.salleId) }}</span>
                </div>
              </div>

              <div class="card-divider"></div>

              <div class="card-cours-info">
                <div class="cours-row">
                  <i class="pi pi-folder"></i>
                  <span>{{ getClasseLibelle(s.classeId) }}</span>
                </div>
                <div class="cours-row">
                  <i class="pi pi-book"></i>
                  <span>{{ getMatiereLibelle(s.matiereId) }}</span>
                </div>
                <div class="cours-row">
                  <i class="pi pi-user"></i>
                  <span>{{ getEnseignantNom(s.enseignantId) }}</span>
                </div>
                <div class="cours-row" *ngIf="s.anneeUniversitaireId">
                  <i class="pi pi-calendar"></i>
                  <span>{{ getAnneeUniversitaireLibelle(s.anneeUniversitaireId) }}</span>
                </div>
              </div>
            </div>
            <div class="card-actions">
              <button class="btn-icon-sm delete" (click)="delete(s.id!)" title="Supprimer">
                <i class="pi pi-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './schedule.scss',
})
export class Schedule implements OnInit {
  schedules: EmploiDuTemps[] = [];
  filteredSchedules: EmploiDuTemps[] = [];
  searchText: string = '';
  classes: Classe[] = [];
  matieres: Matiere[] = [];
  teachers: Teacher[] = [];
  salles: Salle[] = [];
  anneesUniversitaires: AnneeUniversitaire[] = [];

  displayForm: boolean = false;

  currentSchedule: Partial<EmploiDuTemps> = {};
  selectedClasseId: number | null = null;
  selectedMatiereId: number | null = null;
  selectedTeacherId: number | null = null;

  jours = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];

  constructor(
    private scheduleService: ScheduleService,
    private classeService: ClasseService,
    private matiereService: MatiereService,
    private teacherService: TeacherService,
    private salleService: SalleService,
    private anneeUniversitaireService: AnneeUniversitaireService,
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.scheduleService.getAllSchedules().subscribe((s) => {
      this.schedules = s;
      this.filterSchedules();
    });
    this.classeService.getAll().subscribe((c) => (this.classes = c));
    this.matiereService.getAll().subscribe((m) => (this.matieres = m));
    this.teacherService.getTeachers().subscribe((t) => (this.teachers = t));
    this.salleService.getAll().subscribe((s) => (this.salles = s));
    this.anneeUniversitaireService.getAll().subscribe((a) => (this.anneesUniversitaires = a));
  }

  filterSchedules() {
    const text = this.searchText.toLowerCase();
    this.filteredSchedules = this.schedules.filter(
      (s) =>
        (s.titre || '').toLowerCase().includes(text) ||
        this.getSalleNom(s.salleId).toLowerCase().includes(text) ||
        this.getEnseignantNom(s.enseignantId).toLowerCase().includes(text) ||
        this.getMatiereLibelle(s.matiereId).toLowerCase().includes(text),
    );
  }

  getSalleNom(salleId: number | undefined): string {
    if (!salleId) return 'N/A';
    const s = this.salles.find((salle) => salle.id === salleId);
    return s ? `${s.nom} (${s.batiment})` : 'N/A';
  }

  getClasseLibelle(classeId: number | undefined): string {
    if (!classeId) return 'N/A';
    const c = this.classes.find((cl) => cl.id === classeId);
    return c ? c.libelle : 'N/A';
  }

  getMatiereLibelle(matiereId: number | undefined): string {
    if (!matiereId) return 'N/A';
    const m = this.matieres.find((mat) => mat.id === matiereId);
    return m ? m.libelle : 'N/A';
  }

  getEnseignantNom(enseignantId: number | undefined): string {
    if (!enseignantId) return 'N/A';
    const t = this.teachers.find((teacher) => teacher.id === enseignantId);
    return t ? `${t.prenom} ${t.nom}` : 'N/A';
  }

  getAnneeUniversitaireLibelle(anneeId: number | undefined): string {
    if (!anneeId) return '';
    const a = this.anneesUniversitaires.find((au) => au.id === anneeId);
    return a ? a.libelle : '';
  }

  showAddForm() {
    this.currentSchedule = { typeRecurrence: 'HEBDOMADAIRE', jourSemaine: 'LUNDI' };
    this.selectedClasseId = null;
    this.selectedMatiereId = null;
    this.selectedTeacherId = null;
    this.displayForm = true;
  }

  save() {
    if (
      !this.selectedClasseId ||
      !this.selectedMatiereId ||
      !this.selectedTeacherId ||
      !this.currentSchedule.salleId ||
      !this.currentSchedule.heureDebut ||
      !this.currentSchedule.heureFin
    )
      return;

    const scheduleToSave: EmploiDuTemps = {
      titre: this.currentSchedule.titre,
      typeRecurrence: this.currentSchedule.typeRecurrence as any,
      dateDebutValidite: this.currentSchedule.dateDebutValidite || '',
      dateFinValidite: this.currentSchedule.dateFinValidite || '',
      jourSemaine: this.currentSchedule.jourSemaine as any,
      jourDuMois: this.currentSchedule.jourDuMois,
      dateSpecifique: this.currentSchedule.dateSpecifique,
      heureDebut: this.currentSchedule.heureDebut!,
      heureFin: this.currentSchedule.heureFin!,
      salleId: Number(this.currentSchedule.salleId),
      enseignantId: Number(this.selectedTeacherId),
      classeId: Number(this.selectedClasseId),
      matiereId: Number(this.selectedMatiereId),
      anneeUniversitaireId: this.currentSchedule.anneeUniversitaireId
        ? Number(this.currentSchedule.anneeUniversitaireId)
        : 0,
    };

    this.scheduleService.createSchedule(scheduleToSave).subscribe(() => {
      this.displayForm = false;
      this.loadData();
    });
  }

  delete(id: number) {
    if (confirm('Voulez-vous supprimer cette planification ?')) {
      this.scheduleService.deleteSchedule(id).subscribe(() => this.loadData());
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (confirm(`Voulez-vous importer les emplois du temps depuis le fichier ${file.name} ?`)) {
        this.scheduleService.importSchedules(file).subscribe({
          next: (res: any) => {
            alert(res.message);
            this.loadData();
          },
          error: (err) => {
            alert(err.error?.error || "Erreur lors de l'importation");
          },
        });
      }
      event.target.value = '';
    }
  }
}
