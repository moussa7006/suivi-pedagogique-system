import { Component, inject, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { forkJoin } from "rxjs";
import {
  IonContent,
  IonButton,
  IonIcon,
  IonBadge,
} from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import {
  notificationsOutline,
  qrCodeOutline,
  bookOutline,
  calendarOutline,
  checkmarkDoneOutline,
  addCircleOutline,
  documentTextOutline,
  timeOutline,
  statsChartOutline,
  listOutline,
  settingsOutline,
  peopleOutline,
  alertCircleOutline,
  gridOutline,
  personOutline,
  schoolOutline,
  checkmarkCircleOutline,
  trendingUpOutline,
  closeOutline,
  sparklesOutline,
} from "ionicons/icons";
import { AuthService } from "../core/services/auth.service";
import { ScheduleService } from "../core/services/schedule.service";
import { FicheProgressionService } from "../core/services/fiche-progression.service";
import { FicheProgression } from "../core/models/fiche-progression.model";
import { Seance } from "../core/models/seance.model";
import { CommonModule } from "@angular/common";

interface NotificationItem {
  title: string;
  message: string;
  icon: string;
  type: "warning" | "info" | "success";
  actionLabel?: string;
  actionRoute?: string;
}

@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"],
  imports: [CommonModule, IonContent, IonButton, IonIcon, IonBadge],
})
export class Tab1Page implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  private scheduleService = inject(ScheduleService);
  private ficheProgressionService = inject(FicheProgressionService);

  isCahierFait = false;

  teacher = {
    firstName: "Enseignant",
    lastName: "",
  };

  teacherInitials = "EN";

  // Stats data
  totalSeances = 0;
  completedSeances = 0;
  totalHeures = 0;
  studentCount = 0; // Not returned directly by backend, could be calculated later
  completionRate = 0;

  // Notifications
  notificationCount = 0;
  pendingNotifications: NotificationItem[] = [];
  showNotifications = false;

  // Gauge SVG constants
  readonly gaugeCircumference = 2 * Math.PI * 52; // ≈ 326.73

  get gaugeOffset(): number {
    return (
      this.gaugeCircumference -
      (this.completionRate / 100) * this.gaugeCircumference
    );
  }

  constructor() {
    addIcons({
      notificationsOutline,
      qrCodeOutline,
      bookOutline,
      calendarOutline,
      checkmarkDoneOutline,
      addCircleOutline,
      documentTextOutline,
      timeOutline,
      statsChartOutline,
      listOutline,
      settingsOutline,
      peopleOutline,
      alertCircleOutline,
      gridOutline,
      personOutline,
      schoolOutline,
      checkmarkCircleOutline,
      trendingUpOutline,
      closeOutline,
      sparklesOutline,
    });
  }

  ngOnInit() {
    void this.loadUser();
    this.loadRealData();
  }

  private async loadUser(): Promise<void> {
    const user = await this.authService.getUser();
    if (user) {
      this.teacher = {
        firstName: user.prenom || "Enseignant",
        lastName: user.nom || "",
      };
      this.teacherInitials = this.getInitials(
        user.prenom || "Enseignant",
        user.nom || "",
      );
    }
  }

  private loadRealData() {
    forkJoin({
      seances: this.scheduleService.getSeances(),
      fiches: this.ficheProgressionService.getFichesProgression(),
    }).subscribe({
      next: ({ seances, fiches }) => {
        this.totalSeances = seances.length;
        this.completedSeances = seances.filter(
          (s: Seance) => s.statut === "TERMINEE",
        ).length;
        this.completionRate =
          this.totalSeances > 0
            ? Math.round((this.completedSeances / this.totalSeances) * 100)
            : 0;
        this.isCahierFait = this.hasCurrentSeanceCahier(seances, fiches);

        let totalMins = 0;
        seances.forEach((s: Seance) => {
          if (s.heureDebutReelle && s.heureFinReelle) {
            const debutParts = s.heureDebutReelle.split(":");
            const finParts = s.heureFinReelle.split(":");
            const debutMins =
              parseInt(debutParts[0], 10) * 60 + parseInt(debutParts[1], 10);
            const finMins =
              parseInt(finParts[0], 10) * 60 + parseInt(finParts[1], 10);
            totalMins += finMins - debutMins;
          }
        });
        this.totalHeures = Math.round(totalMins / 60);
        this.updateNotifications();
      },
      error: (err: any) => {
        console.error("Erreur lors du chargement des séances", err);
      },
    });
  }

  private hasCurrentSeanceCahier(
    seances: Seance[],
    fiches: FicheProgression[],
  ): boolean {
    const now = new Date();
    const currentOrNextSeance =
      seances.find((seance) => {
        const start = this.combineDateAndTime(
          seance.dateCours,
          seance.heureDebutReelle,
        );
        const end = this.combineDateAndTime(
          seance.dateCours,
          seance.heureFinReelle,
        );
        return start && end && now >= start && now <= end;
      }) ||
      seances.find(
        (seance) => seance.statut === "PREVUE" || seance.statut === "EN_COURS",
      );

    if (!currentOrNextSeance?.id) {
      return fiches.length > 0;
    }

    return (
      !!currentOrNextSeance.ficheProgressionId ||
      fiches.some((fiche) => fiche.seanceId === currentOrNextSeance.id)
    );
  }

  private combineDateAndTime(
    dateValue?: string,
    timeValue?: string,
  ): Date | null {
    if (!dateValue || !timeValue) return null;
    const [year, month, day] = dateValue.split("-").map(Number);
    const [hours, minutes] = timeValue.split(":").map(Number);
    if (
      !year ||
      !month ||
      !day ||
      !Number.isFinite(hours) ||
      !Number.isFinite(minutes)
    )
      return null;
    return new Date(year, month - 1, day, hours, minutes, 0, 0);
  }

  private getInitials(firstName: string, lastName: string): string {
    const first = firstName ? firstName.charAt(0).toUpperCase() : "";
    const last = lastName ? lastName.charAt(0).toUpperCase() : "";
    return first + last || "EN";
  }

  private updateNotifications() {
    let count = 0;
    const notifications: NotificationItem[] = [];

    if (!this.isCahierFait) {
      count++;
      notifications.push({
        title: "Fiche de progression à remplir",
        message:
          "Scannez le QR Code de la séance puis complétez la fiche pour valider l'émargement.",
        icon: "document-text-outline",
        type: "warning",
        actionLabel: "Remplir",
        actionRoute: "/tabs/tabs/tab3",
      });
    }

    const uncompleted = this.totalSeances - this.completedSeances;
    if (uncompleted > 0) {
      count += uncompleted;
      notifications.push({
        title: `${uncompleted} séance(s) à finaliser`,
        message:
          "Consultez votre planning pour suivre les séances prévues ou en cours.",
        icon: "calendar-outline",
        type: "info",
        actionLabel: "Voir planning",
        actionRoute: "/tabs/tabs/tab2",
      });
    }

    this.notificationCount = count;
    this.pendingNotifications = notifications;
  }

  openNotifications() {
    this.showNotifications = true;
  }

  closeNotifications() {
    this.showNotifications = false;
  }

  handleNotificationAction(notification: NotificationItem) {
    this.closeNotifications();
    if (notification.actionRoute) {
      this.navigateTo(notification.actionRoute);
    }
  }

  navigateTo(path: string) {
    if (path.startsWith("/")) {
      this.router.navigateByUrl(path);
    } else {
      this.router.navigate([path]);
    }
  }
}
