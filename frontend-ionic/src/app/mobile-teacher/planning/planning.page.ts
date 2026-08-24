import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  IonContent,
  IonButton,
  IonIcon,
  IonBadge,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  calendarOutline,
  timeOutline,
  locationOutline,
  notificationsOutline,
  bookOutline,
  personOutline,
  repeatOutline,
  checkmarkOutline,
  playOutline,
  refreshOutline,
  scanOutline,
  arrowBackOutline,
  arrowForwardOutline,
  checkmark,
  calendar,
  calendarClearOutline
} from 'ionicons/icons';
import { forkJoin, finalize } from 'rxjs';
import { ScheduleService } from '../../core/services/schedule.service';
import { SalleService } from '../../core/services/salle.service';
import { MatiereService } from '../../core/services/matiere.service';
import { AuthService } from '../../core/services/auth.service';
import { EmploiDuTemps } from '../../core/models/schedule.model';
import { Seance } from '../../core/models/seance.model';
import { Salle } from '../../core/models/salle.model';
import { Matiere } from '../../core/models/matiere.model';

interface PlanningCourse {
  matiere: string;
  salle: string;
  horaire: string;
  type: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  source: 'real' | 'planned';
  statusLabel: string;
  enseignant: string;
  seanceId?: number;
  hasQrCode: boolean;
}

@Component({
  selector: 'app-planning',
  templateUrl: 'planning.page.html',
  styleUrls: ['planning.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink, IonContent, IonButton, IonIcon, IonBadge],
})
export class PlanningPage implements OnInit {
  private readonly scheduleService = inject(ScheduleService);
  private readonly salleService = inject(SalleService);
  private readonly matiereService = inject(MatiereService);
  private readonly authService = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);

  today = new Date();
  selectedDayIndex = 0;
  isLoading = false;

  weekDays: { name: string; number: number; date: Date }[] = [];
  emploisDuTemps: PlanningCourse[] = [];

  private allSchedules: EmploiDuTemps[] = [];
  private allSeances: Seance[] = [];
  private salles: Salle[] = [];
  private matieres: Matiere[] = [];
  private currentUserId: number | null = null;
  private currentUserLabel = '';
  private weekOffset = 0;

  constructor() {
    addIcons({
      calendarOutline,
      timeOutline,
      locationOutline,
      notificationsOutline,
      bookOutline,
      personOutline,
      repeatOutline,
      checkmarkOutline,
      playOutline,
      refreshOutline,
      scanOutline,
      arrowBackOutline,
      arrowForwardOutline,
      checkmark,
      calendar,
      calendarClearOutline
    });
    this.generateWeekDays();
  }

  ngOnInit(): void {
    void this.refreshPlanningData();
  }

  ionViewWillEnter(): void {
    void this.refreshPlanningData();
  }

  private async refreshPlanningData(): Promise<void> {
    await this.loadCurrentUser();
    this.loadEmploisDuTemps();
  }

  private async loadCurrentUser(): Promise<void> {
    const user = await this.authService.getUser();
    if (user) {
      this.currentUserId = user.id ?? null;
      this.currentUserLabel = `${user.prenom || ''} ${user.nom || ''}`.trim();
      this.cdr.detectChanges();
    }
  }

  selectDay(index: number): void {
    this.selectedDayIndex = index;
    this.buildPlanningForSelectedDay();
    this.cdr.detectChanges();
  }

  get selectedDate(): Date {
    return this.weekDays[this.selectedDayIndex]?.date || new Date();
  }

  get selectedDateLabel(): string {
    return this.selectedDate.toLocaleDateString('fr-FR', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });
  }

  goToPreviousWeek(): void {
    this.weekOffset -= 1;
    this.generateWeekDays();
    this.buildPlanningForSelectedDay();
  }

  goToNextWeek(): void {
    this.weekOffset += 1;
    this.generateWeekDays();
    this.buildPlanningForSelectedDay();
  }

  goToCurrentWeek(): void {
    this.weekOffset = 0;
    this.generateWeekDays();
    this.buildPlanningForSelectedDay();
  }

  refreshPlanning(): void {
    this.loadEmploisDuTemps();
  }

  private generateWeekDays(): void {
    const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const today = new Date();
    const mondayOffset = (today.getDay() + 6) % 7;
    const monday = new Date(today);
    monday.setDate(today.getDate() - mondayOffset + this.weekOffset * 7);
    monday.setHours(0, 0, 0, 0);

    this.weekDays = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      return { name: dayNames[index], number: date.getDate(), date };
    });

    const todayIndex = this.weekDays.findIndex((day) => this.isSameDate(day.date, today));
    this.selectedDayIndex = todayIndex >= 0 ? todayIndex : 0;
  }

  private loadEmploisDuTemps(): void {
    this.isLoading = true;
    forkJoin({
      schedules: this.scheduleService.getEmploisDuTemps(),
      seances: this.scheduleService.getSeances(),
      salles: this.salleService.getAll(),
      matieres: this.matiereService.getAll(),
    })
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: ({ schedules, seances, salles, matieres }) => {
          this.allSchedules = (schedules || []).filter((schedule) => schedule.enseignantId === this.currentUserId);
          this.allSeances = (seances || []).filter((seance) => seance.enseignantId === this.currentUserId);
          this.salles = salles || [];
          this.matieres = matieres || [];
          this.buildPlanningForSelectedDay();
          this.cdr.detectChanges();
        },
        error: () => {
          this.allSchedules = [];
          this.allSeances = [];
          this.emploisDuTemps = [];
          this.cdr.detectChanges();
        },
      });
  }

  private buildPlanningForSelectedDay(): void {
    const selectedDate =
      this.weekDays[this.selectedDayIndex]?.date || new Date();
    const seancesForDay = this.allSeances.filter((seance) =>
      this.isSameDate(this.parseDate(seance.dateCours), selectedDate),
    );
    const seanceScheduleIds = new Set(
      seancesForDay
        .map((seance) => seance.emploiDuTempsId)
        .filter((id): id is number => !!id),
    );

    const realCourses = seancesForDay.map((seance) =>
      this.mapSeanceToCourse(seance, selectedDate),
    );

    const theoreticalCourses = this.allSchedules
      .filter((schedule) => this.occursOnDate(schedule, selectedDate))
      .filter((schedule) => !schedule.id || !seanceScheduleIds.has(schedule.id))
      .map((edt) => this.mapScheduleToCourse(edt, selectedDate));

    this.emploisDuTemps = [...realCourses, ...theoreticalCourses].sort((a, b) =>
      a.horaire.localeCompare(b.horaire),
    );
  }

  private mapSeanceToCourse(
    seance: Seance,
    selectedDate: Date,
  ): PlanningCourse {
    const schedule = this.findScheduleForSeance(seance);
    const status = this.getSeanceStatus(seance, selectedDate);

    return {
      matiere: schedule ? this.getMatiereLabel(schedule) : 'Séance programmée',
      salle: this.getSalleLabel(seance.salleId),
      horaire: `${this.formatTime(seance.heureDebutReelle)} - ${this.formatTime(seance.heureFinReelle)}`,
      type: seance.qrCodeId ? 'QR Code disponible' : 'Séance générée',
      status,
      statusLabel: this.getStatusLabel(status),
      enseignant: this.getEnseignantLabel(seance.enseignantId),
      seanceId: seance.id,
      hasQrCode: !!seance.qrCodeId && status !== 'completed',
      source: 'real',
    };
  }

  private mapScheduleToCourse(
    edt: EmploiDuTemps,
    selectedDate: Date,
  ): PlanningCourse {
    const status = this.getCourseStatus(edt, selectedDate);

    return {
      matiere: this.getMatiereLabel(edt),
      salle: this.getSalleLabel(edt.salleId),
      horaire: `${this.formatTime(edt.heureDebut)} - ${this.formatTime(edt.heureFin)}`,
      type: this.getTypeRecurrenceLabel(edt.typeRecurrence),
      status,
      statusLabel: this.getStatusLabel(status),
      enseignant: this.getEnseignantLabel(edt.enseignantId),
      hasQrCode: false,
      source: 'planned',
    };
  }

  private occursOnDate(schedule: EmploiDuTemps, date: Date): boolean {
    const day = this.toDateOnly(date);
    const start = this.parseDate(schedule.dateDebutValidite);
    const end = this.parseDate(schedule.dateFinValidite);

    if (start && day < start) return false;
    if (end && day > end) return false;

    if (schedule.typeRecurrence === 'UNIQUE') {
      const specificDate = this.parseDate(
        schedule.dateSpecifique || schedule.dateDebutValidite,
      );
      return !!specificDate && this.isSameDate(day, specificDate);
    }

    if (schedule.typeRecurrence === 'HEBDOMADAIRE') {
      return this.getJourSemaine(date) === schedule.jourSemaine;
    }

    if (schedule.typeRecurrence === 'MENSUEL') {
      return date.getDate() === Number(schedule.jourDuMois);
    }

    return false;
  }

  private getCourseStatus(
    schedule: EmploiDuTemps,
    date: Date,
  ): 'completed' | 'in-progress' | 'upcoming' {
    const now = new Date();
    const start = this.combineDateAndTime(date, schedule.heureDebut);
    const end = this.combineDateAndTime(date, schedule.heureFin);

    if (!start || !end) return 'upcoming';
    if (now > end) return 'completed';
    if (now >= start && now <= end) return 'in-progress';
    return 'upcoming';
  }

  private getSeanceStatus(
    seance: Seance,
    date: Date,
  ): 'completed' | 'in-progress' | 'upcoming' {
    const now = new Date();
    const start = this.combineDateAndTime(date, seance.heureDebutReelle);
    const end = this.combineDateAndTime(date, seance.heureFinReelle);

    if (!start || !end) return 'upcoming';
    if (now > end || seance.statut === 'TERMINEE') return 'completed';
    if (now >= start && now <= end) return 'in-progress';
    return 'upcoming';
  }

  private findScheduleForSeance(seance: Seance): EmploiDuTemps | undefined {
    return this.allSchedules.find(
      (schedule) => schedule.id === seance.emploiDuTempsId,
    );
  }

  private getMatiereLabel(schedule: EmploiDuTemps): string {
    const matiere = this.matieres.find(
      (item) => item.id === schedule.matiereId,
    );
    return (
      matiere?.libelle || schedule.titre || `Matière #${schedule.matiereId}`
    );
  }

  private getSalleLabel(salleId: number): string {
    const salle = this.salles.find((item) => item.id === salleId);
    return salle
      ? `${salle.nom}${salle.batiment ? ' • ' + salle.batiment : ''}`
      : `Salle #${salleId}`;
  }

  private getEnseignantLabel(enseignantId: number): string {
    if (this.currentUserId != null && enseignantId === this.currentUserId) {
      return this.currentUserLabel || 'Vous';
    }
    return `Enseignant #${enseignantId}`;
  }

  private getStatusLabel(status: PlanningCourse['status']): string {
    return {
      completed: 'Terminé',
      'in-progress': 'En cours',
      upcoming: 'À venir',
    }[status];
  }

  private getTypeRecurrenceLabel(type: string): string {
    const labels: Record<string, string> = {
      UNIQUE: 'Cours unique',
      HEBDOMADAIRE: 'Hebdomadaire',
      MENSUEL: 'Mensuel',
    };
    return labels[type] || type || 'Cours';
  }

  private getJourSemaine(date: Date): string {
    const jours = [
      'DIMANCHE',
      'LUNDI',
      'MARDI',
      'MERCREDI',
      'JEUDI',
      'VENDREDI',
      'SAMEDI',
    ];
    return jours[date.getDay()];
  }

  private parseDate(value?: string): Date | null {
    if (!value) return null;
    const [year, month, day] = value.split('-').map(Number);
    return year && month && day ? new Date(year, month - 1, day) : null;
  }

  private combineDateAndTime(date: Date, time?: string): Date | null {
    if (!time) return null;
    const [hours, minutes] = time.split(':').map(Number);
    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
    const result = new Date(date);
    result.setHours(hours, minutes, 0, 0);
    return result;
  }

  private toDateOnly(date: Date): Date {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
  }

  private isSameDate(first: Date | null, second: Date | null): boolean {
    if (!first || !second) return false;

    return (
      first.getFullYear() === second.getFullYear() &&
      first.getMonth() === second.getMonth() &&
      first.getDate() === second.getDate()
    );
  }

  private formatTime(value?: string): string {
    return value ? value.substring(0, 5) : '--:--';
  }
}
