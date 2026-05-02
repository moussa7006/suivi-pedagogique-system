import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ScheduleService } from '../../core/services/schedule.service';
import { ClasseService } from '../../core/services/classe.service';
import { MatiereService } from '../../core/services/matiere.service';
import { TeacherService } from '../../core/services/teacher.service';
import { EmploiDuTemps } from '../../core/models/schedule.model';
import { Classe } from '../../core/models/classe.model';
import { Matiere } from '../../core/models/matiere.model';
import { Teacher } from '../../core/models/teacher.model';

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
                <select [(ngModel)]="currentSchedule.jourDeSemaine">
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
                <input type="text" [(ngModel)]="currentSchedule.salle" placeholder="Ex: Amphi A" />
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
                  <option *ngFor="let c of classes" [value]="c.id">
                    {{ c.filiere }} - {{ c.niveau }}
                  </option>
                </select>
              </div>
              <div class="input-group">
                <label>Matière</label>
                <select [(ngModel)]="selectedMatiereId">
                  <option *ngFor="let m of matieres" [value]="m.id">{{ m.libelle }}</option>
                </select>
              </div>
              <div class="input-group">
                <label>Enseignant</label>
                <select [(ngModel)]="selectedTeacherId">
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
                      s.jourDeSemaine
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
                  <span>{{ s.salle }}</span>
                </div>
              </div>

              <div class="card-divider"></div>

              <div class="card-cours-info">
                <div class="cours-row">
                  <i class="pi pi-folder"></i>
                  <span>{{ s.classe?.filiere }}</span>
                </div>
                <div class="cours-row">
                  <i class="pi pi-book"></i>
                  <span>{{ s.matiere?.libelle }}</span>
                </div>
                <div class="cours-row">
                  <i class="pi pi-user"></i>
                  <span>{{ s.enseignant?.prenom }} {{ s.enseignant?.nom }}</span>
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
  }

  filterSchedules() {
    const text = this.searchText.toLowerCase();
    this.filteredSchedules = this.schedules.filter(
      (s) =>
        (s.titre || '').toLowerCase().includes(text) ||
        (s.salle || '').toLowerCase().includes(text) ||
        (s.enseignant?.nom || '').toLowerCase().includes(text) ||
        (s.enseignant?.prenom || '').toLowerCase().includes(text) ||
        (s.matiere?.libelle || '').toLowerCase().includes(text),
    );
  }

  showAddForm() {
    this.currentSchedule = { typeRecurrence: 'HEBDOMADAIRE', jourDeSemaine: 'LUNDI' };
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
      !this.currentSchedule.heureDebut ||
      !this.currentSchedule.heureFin
    )
      return;

    this.currentSchedule.classe = this.classes.find((c) => c.id === Number(this.selectedClasseId));
    this.currentSchedule.matiere = this.matieres.find(
      (m) => m.id === Number(this.selectedMatiereId),
    );
    this.currentSchedule.enseignant = this.teachers.find(
      (t) => t.id === Number(this.selectedTeacherId),
    );

    this.scheduleService.createSchedule(this.currentSchedule as EmploiDuTemps).subscribe(() => {
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
