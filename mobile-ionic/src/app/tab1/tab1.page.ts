import { Component, inject, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import {
  IonContent,
  IonButton,
  IonIcon,
  IonBadge,
  AlertController,
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
} from "ionicons/icons";
import { AuthService } from "../core/services/auth.service";
import { EnseignantApiService } from "../core/services/enseignant-api.service";
import { SeanceDto } from "../core/models/enseignant.models";
import { SeanceService } from "../seance.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"],
  imports: [CommonModule, IonContent, IonButton, IonIcon, IonBadge],
})
export class Tab1Page implements OnInit, OnDestroy {
  private router = inject(Router);
  private authService = inject(AuthService);
  private seanceService = inject(SeanceService); // Keeping it for cahierFait if needed
  private apiService = inject(EnseignantApiService);
  private alertController = inject(AlertController);

  private sub: Subscription | null = null;

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
  pendingNotifications: string[] = [];

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
    });

    this.loadUser();
  }

  ngOnInit() {
    this.sub = this.seanceService.isCahierFait$.subscribe((status) => {
      this.isCahierFait = status;
      this.updateNotifications();
    });

    this.loadRealData();
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

  private loadUser(): void {
    const user = this.authService.getUser();
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
    this.apiService.getSeances().subscribe({
      next: (seances: SeanceDto[]) => {
        this.totalSeances = seances.length;
        this.completedSeances = seances.filter((s: SeanceDto) => s.statut === 'EFFECTUEE').length;
        this.completionRate = this.totalSeances > 0 ? Math.round((this.completedSeances / this.totalSeances) * 100) : 0;
        
        let totalMins = 0;
        seances.forEach((s: SeanceDto) => {
          if (s.heureDebutReelle && s.heureFinReelle) {
            const debutParts = s.heureDebutReelle.split(':');
            const finParts = s.heureFinReelle.split(':');
            const debutMins = parseInt(debutParts[0]) * 60 + parseInt(debutParts[1]);
            const finMins = parseInt(finParts[0]) * 60 + parseInt(finParts[1]);
            totalMins += (finMins - debutMins);
          }
        });
        this.totalHeures = Math.round(totalMins / 60);
        this.updateNotifications();
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des séances', err);
      }
    });
  }

  private getInitials(firstName: string, lastName: string): string {
    const first = firstName ? firstName.charAt(0).toUpperCase() : "";
    const last = lastName ? lastName.charAt(0).toUpperCase() : "";
    return first + last || "EN";
  }

  private updateNotifications() {
    let count = 0;
    const notifications: string[] = [];

    if (!this.isCahierFait) {
      count++;
      notifications.push("Cahier de textes à remplir");
    }

    const uncompleted = this.totalSeances - this.completedSeances;
    if (uncompleted > 0) {
      count += uncompleted;
      notifications.push(uncompleted + " séance(s) non complétée(s)");
    }

    this.notificationCount = count;
    this.pendingNotifications = notifications;
  }

  async openNotifications() {
    const alert = await this.alertController.create({
      header: "Notifications",
      message:
        this.pendingNotifications.length > 0
          ? this.pendingNotifications.map((n) => "• " + n).join("<br>")
          : "Aucune notification pour le moment.",
      buttons: ["OK"],
    });
    await alert.present();
  }

  navigateTo(path: string) {
    if (path.startsWith("/")) {
      this.router.navigateByUrl(path);
    } else {
      this.router.navigate([path]);
    }
  }
}
