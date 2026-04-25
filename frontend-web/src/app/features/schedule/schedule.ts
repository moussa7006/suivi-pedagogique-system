import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScheduleService } from '../../core/services/schedule.service';
import { ClasseService } from '../../core/services/classe.service';
import { MatiereService } from '../../core/services/matiere.service';
import { TeacherService } from '../../core/services/teacher.service';
import { EmploiDuTemps, TypeRecurrence } from '../../core/models/schedule.model';
import { Classe } from '../../core/models/classe.model';
import { Matiere } from '../../core/models/matiere.model';
import { Teacher } from '../../core/models/teacher.model';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-left">
          <h1>Emploi du temps</h1>
          <p>Planifiez les cours ({{ schedules.length }} planifications effectuées)</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-primary" (click)="showAddForm()"><i class="pi pi-calendar-plus"></i> Nouvelle Planification</button>
        </div>
      </div>

      <div class="form-card" *ngIf="displayForm">
        <h3>Nouvelle Planification</h3>
        <div class="form-row">
          <div class="input-group">
            <label>Titre de la planification</label>
            <input type="text" [(ngModel)]="currentSchedule.titre" placeholder="Ex: Informatique Semestre 1"/>
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

        <div class="form-row" *ngIf="currentSchedule.typeRecurrence === 'HEBDOMADAIRE'">
          <div class="input-group" style="flex:1">
            <label>Jour de la semaine</label>
            <select [(ngModel)]="currentSchedule.jourDeSemaine">
              <option *ngFor="let j of jours" [value]="j">{{j}}</option>
            </select>
          </div>
          <div class="input-group" style="flex:1">
            <label>Valide à partir de</label>
            <input type="date" [(ngModel)]="currentSchedule.dateDebutValidite"/>
          </div>
          <div class="input-group" style="flex:1">
            <label>Jusqu'au</label>
            <input type="date" [(ngModel)]="currentSchedule.dateFinValidite"/>
          </div>
        </div>

        <div class="form-row" *ngIf="currentSchedule.typeRecurrence === 'UNIQUE'">
          <div class="input-group">
            <label>Date Spécifique</label>
            <input type="date" [(ngModel)]="currentSchedule.dateSpecifique"/>
          </div>
        </div>
        
        <div class="form-row" *ngIf="currentSchedule.typeRecurrence === 'MENSUEL'">
          <div class="input-group">
            <label>Jour du mois</label>
            <input type="number" [(ngModel)]="currentSchedule.jourDuMois" min="1" max="31"/>
          </div>
        </div>

        <div class="form-row">
          <div class="input-group">
            <label>Heure Début</label>
            <input type="time" [(ngModel)]="currentSchedule.heureDebut"/>
          </div>
          <div class="input-group">
            <label>Heure Fin</label>
            <input type="time" [(ngModel)]="currentSchedule.heureFin"/>
          </div>
          <div class="input-group">
            <label>Salle</label>
            <input type="text" [(ngModel)]="currentSchedule.salle" placeholder="Ex: Amphi A"/>
          </div>
        </div>

        <div class="form-row">
          <div class="input-group">
            <label>Classe</label>
            <select [(ngModel)]="selectedClasseId">
              <option *ngFor="let c of classes" [value]="c.id">{{c.filiere}} - {{c.niveau}}</option>
            </select>
          </div>
          <div class="input-group">
            <label>Matière</label>
            <select [(ngModel)]="selectedMatiereId">
              <option *ngFor="let m of matieres" [value]="m.id">{{m.libelle}}</option>
            </select>
          </div>
          <div class="input-group">
            <label>Enseignant</label>
            <select [(ngModel)]="selectedTeacherId">
              <option *ngFor="let t of teachers" [value]="t.id">{{t.prenom}} {{t.nom}}</option>
            </select>
          </div>
        </div>

        <div class="form-actions">
          <button class="btn btn-outline" (click)="displayForm = false">Annuler</button>
          <button class="btn btn-primary" (click)="save()"><i class="pi pi-check"></i> Planifier</button>
        </div>
      </div>

      <div class="table-card">
        <div class="table-responsive">
          <table class="pro-table">
            <thead>
              <tr>
                <th>Titre</th>
                <th>Type</th>
                <th>Jour / Date</th>
                <th>Horaire</th>
                <th>Infos Cours</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngIf="schedules.length === 0">
                <td colspan="6" class="text-center" style="padding: 30px; color: #94a3b8;">Aucune planification trouvée.</td>
              </tr>
              <tr *ngFor="let s of schedules">
                <td data-label="Titre" style="font-weight: 600; color:var(--primary-color);">{{ s.titre || 'Sans-titre' }}</td>
                <td data-label="Type"><span class="subject-chip">{{ s.typeRecurrence }}</span></td>
                <td data-label="Jour / Date">
                  <ng-container *ngIf="s.typeRecurrence === 'HEBDOMADAIRE'">{{ s.jourDeSemaine }}</ng-container>
                  <ng-container *ngIf="s.typeRecurrence === 'UNIQUE'">{{ s.dateSpecifique }}</ng-container>
                  <ng-container *ngIf="s.typeRecurrence === 'MENSUEL'">Le {{ s.jourDuMois }} du mois</ng-container>
                </td>
                <td data-label="Horaire">{{ s.heureDebut }} - {{ s.heureFin }}</td>
                <td data-label="Infos Cours" style="font-size: 0.85rem; color: #475569;">
                  <div><i class="pi pi-folder" style="font-size:0.75rem; margin-right:4px;"></i>{{ s.classe?.filiere }}</div>
                  <div><i class="pi pi-book" style="font-size:0.75rem; margin-right:4px;"></i>{{ s.matiere?.libelle }}</div>
                  <div><i class="pi pi-user" style="font-size:0.75rem; margin-right:4px;"></i>{{ s.enseignant?.prenom }} {{ s.enseignant?.nom }}</div>
                  <div><i class="pi pi-map-marker" style="font-size:0.75rem; margin-right:4px;"></i>{{ s.salle }}</div>
                </td>
                <td data-label="Actions" class="text-right">
                  <div class="action-buttons">
                    <button class="btn-icon delete" (click)="delete(s.id!)"><i class="pi pi-trash"></i></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styleUrl: '../classes/classes.scss'
})
export class Schedule implements OnInit {
  schedules: EmploiDuTemps[] = [];
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
    private teacherService: TeacherService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.scheduleService.getAllSchedules().subscribe(s => this.schedules = s);
    this.classeService.getAll().subscribe(c => this.classes = c);
    this.matiereService.getAll().subscribe(m => this.matieres = m);
    this.teacherService.getTeachers().subscribe(t => this.teachers = t);
  }

  showAddForm() {
    this.currentSchedule = { typeRecurrence: 'HEBDOMADAIRE', jourDeSemaine: 'LUNDI' };
    this.selectedClasseId = null;
    this.selectedMatiereId = null;
    this.selectedTeacherId = null;
    this.displayForm = true;
  }

  save() {
    if (!this.selectedClasseId || !this.selectedMatiereId || !this.selectedTeacherId || !this.currentSchedule.heureDebut || !this.currentSchedule.heureFin) return;

    this.currentSchedule.classe = this.classes.find(c => c.id === Number(this.selectedClasseId));
    this.currentSchedule.matiere = this.matieres.find(m => m.id === Number(this.selectedMatiereId));
    this.currentSchedule.enseignant = this.teachers.find(t => t.id === Number(this.selectedTeacherId));

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
}
