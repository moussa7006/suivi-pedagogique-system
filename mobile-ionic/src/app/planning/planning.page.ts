import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import {
  IonContent,
  IonButton,
  IonIcon,
  IonBadge,
} from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
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
} from "ionicons/icons";
import { forkJoin, finalize } from "rxjs";
import { ScheduleService } from "../core/services/schedule.service";
import { SalleService } from "../core/services/salle.service";
import { MatiereService } from "../core/services/matiere.service";
import { UtilisateurService } from "../core/services/utilisateur.service";
import { EmploiDuTemps } from "../core/models/schedule.model";
import { Seance } from "../core/models/seance.model";
import { Salle } from "../core/models/salle.model";
import { Matiere } from "../core/models/matiere.model";
import { Utilisateur } from "../core/models/user.model";

interface PlanningCourse {
  matiere: string;
  salle: string;
  horaire: string;
  type: string;
  status: "completed" | "in-progress" | "upcoming";
  statusLabel: string;
  enseignant: string;
  seanceId?: number;
  hasQrCode: boolean;
}

@Component({
  selector: "app-planning",
  templateUrl: "planning.page.html",
  styleUrls: ["planning.page.scss"],
  standalone: true,
  imports: [CommonModule, RouterLink, IonContent, IonButton, IonIcon, IonBadge],
})
export class PlanningPage implements OnInit {
  private readonly scheduleService = inject(ScheduleService);
  private readonly salleService = inject(SalleService);
  private readonly matiereService = inject(MatiereService);
  private readonly utilisateurService = inject(UtilisateurService);

  today = new Date();
  selectedDayIndex = 0;
  isLoading = false;

  weekDays: { name: string; number: number; date: Date }[] = [];
  emploisDuTemps: PlanningCourse[] = [];

  private allSchedules: EmploiDuTemps[] = [];
  private allSeances: Seance[] = [];
  private salles: Salle[] = [];
  private matieres: Matiere[] = [];
  private utilisateurs: Utilisateur[] = [];

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
    });
    this.generateWeekDays();
  }

  ngOnInit(): void {
    this.loadEmploisDuTemps();
  }

  selectDay(index: number): void {
    this.selectedDayIndex = index;
    this.buildPlanningForSelectedDay();
  }

  refreshPlanning(): void {
    this.loadEmploisDuTemps();
  }

  private generateWeekDays(): void {
    const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
    const today = new Date();
    const currentDay = today.getDay();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - currentDay + i);
      this.weekDays.push({
        name: dayNames[date.getDay()],
        number: date.getDate(),
        date,
      });

      if (this.isSameDate(date, today)) {
        this.selectedDayIndex = i;
      }
    }
  }

  private loadEmploisDuTemps(): void {
    this.isLoading = true;
    forkJoin({
      schedules: this.scheduleService.getEmploisDuTemps(),
      seances: this.scheduleService.getSeances(),
      salles: this.salleService.getAll(),
      matieres: this.matiereService.getAll(),
      utilisateurs: this.utilisateurService.listerTous(),
    })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: ({ schedules, seances, salles, matieres, utilisateurs }) => {
          this.allSchedules = schedules || [];
          this.allSeances = seances || [];
          this.salles = salles || [];
          this.matieres = matieres || [];
          this.utilisateurs = utilisateurs || [];
          this.buildPlanningForSelectedDay();
        },
        error: () => {
          this.allSchedules = [];
          this.allSeances = [];
          this.emploisDuTemps = [];
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
      matiere: schedule ? this.getMatiereLabel(schedule) : "Séance programmée",
      salle: this.getSalleLabel(seance.salleId),
      horaire: `${this.formatTime(seance.heureDebutReelle)} - ${this.formatTime(seance.heureFinReelle)}`,
      type: seance.qrCodeId ? "QR Code disponible" : "Séance générée",
      status,
      statusLabel: this.getStatusLabel(status),
      enseignant: this.getEnseignantLabel(seance.enseignantId),
      seanceId: seance.id,
      hasQrCode: !!seance.qrCodeId,
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
    };
  }

  private occursOnDate(schedule: EmploiDuTemps, date: Date): boolean {
    const day = this.toDateOnly(date);
    const start = this.parseDate(schedule.dateDebutValidite);
    const end = this.parseDate(schedule.dateFinValidite);

    if (start && day < start) return false;
    if (end && day > end) return false;

    if (schedule.typeRecurrence === "UNIQUE") {
      const specificDate = this.parseDate(
        schedule.dateSpecifique || schedule.dateDebutValidite,
      );
      return !!specificDate && this.isSameDate(day, specificDate);
    }

    if (schedule.typeRecurrence === "HEBDOMADAIRE") {
      return this.getJourSemaine(date) === schedule.jourSemaine;
    }

    if (schedule.typeRecurrence === "MENSUEL") {
      return date.getDate() === Number(schedule.jourDuMois);
    }

    return false;
  }

  private getCourseStatus(
    schedule: EmploiDuTemps,
    date: Date,
  ): "completed" | "in-progress" | "upcoming" {
    const now = new Date();
    const start = this.combineDateAndTime(date, schedule.heureDebut);
    const end = this.combineDateAndTime(date, schedule.heureFin);

    if (!start || !end) return "upcoming";
    if (now > end) return "completed";
    if (now >= start && now <= end) return "in-progress";
    return "upcoming";
  }

  private getSeanceStatus(
    seance: Seance,
    date: Date,
  ): "completed" | "in-progress" | "upcoming" {
    const now = new Date();
    const start = this.combineDateAndTime(date, seance.heureDebutReelle);
    const end = this.combineDateAndTime(date, seance.heureFinReelle);

    if (!start || !end) return "upcoming";
    if (now > end || seance.statut === "TERMINEE") return "completed";
    if (now >= start && now <= end) return "in-progress";
    return "upcoming";
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
      ? `${salle.nom}${salle.batiment ? " • " + salle.batiment : ""}`
      : `Salle #${salleId}`;
  }

  private getEnseignantLabel(enseignantId: number): string {
    const enseignant = this.utilisateurs.find(
      (item) => item.id === enseignantId,
    );
    return enseignant
      ? `${enseignant.prenom} ${enseignant.nom}`.trim()
      : `Enseignant #${enseignantId}`;
  }

  private getStatusLabel(status: PlanningCourse["status"]): string {
    return {
      completed: "Terminé",
      "in-progress": "En cours",
      upcoming: "À venir",
    }[status];
  }

  private getTypeRecurrenceLabel(type: string): string {
    const labels: Record<string, string> = {
      UNIQUE: "Cours unique",
      HEBDOMADAIRE: "Hebdomadaire",
      MENSUEL: "Mensuel",
    };
    return labels[type] || type || "Cours";
  }

  private getJourSemaine(date: Date): string {
    const jours = [
      "DIMANCHE",
      "LUNDI",
      "MARDI",
      "MERCREDI",
      "JEUDI",
      "VENDREDI",
      "SAMEDI",
    ];
    return jours[date.getDay()];
  }

  private parseDate(value?: string): Date | null {
    if (!value) return null;
    const [year, month, day] = value.split("-").map(Number);
    return year && month && day ? new Date(year, month - 1, day) : null;
  }

  private combineDateAndTime(date: Date, time?: string): Date | null {
    if (!time) return null;
    const [hours, minutes] = time.split(":").map(Number);
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
    return value ? value.substring(0, 5) : "--:--";
  }
}
