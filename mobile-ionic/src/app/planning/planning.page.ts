import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
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
  arrowBackOutline,
  notificationsOutline,
  bookOutline,
  personOutline,
  repeatOutline,
  checkmarkOutline,
  playOutline,
  refreshOutline,
} from "ionicons/icons";
import { ScheduleService } from "../core/services/schedule.service";

@Component({
  selector: "app-planning",
  templateUrl: "planning.page.html",
  styleUrls: ["planning.page.scss"],
  standalone: true,
  imports: [CommonModule, IonContent, IonButton, IonIcon, IonBadge],
})
export class PlanningPage implements OnInit {
  private scheduleService = inject(ScheduleService);

  today = new Date();
  selectedDayIndex = 0;
  isLoading = false;

  weekDays: { name: string; number: number; date: Date }[] = [];
  emploisDuTemps: any[] = [];

  constructor() {
    addIcons({
      calendarOutline,
      timeOutline,
      locationOutline,
      arrowBackOutline,
      notificationsOutline,
      bookOutline,
      personOutline,
      repeatOutline,
      checkmarkOutline,
      playOutline,
      refreshOutline,
    });
    this.generateWeekDays();
  }

  ngOnInit() {
    this.loadEmploisDuTemps();
  }

  private generateWeekDays() {
    const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
    const today = new Date();
    const currentDay = today.getDay();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - currentDay + i);
      this.weekDays.push({
        name: dayNames[date.getDay()],
        number: date.getDate(),
        date: date,
      });

      // Définir le jour actuel comme sélectionné
      if (date.toDateString() === today.toDateString()) {
        this.selectedDayIndex = i;
      }
    }
  }

  selectDay(index: number) {
    this.selectedDayIndex = index;
    this.loadEmploisDuTemps();
  }

  refreshPlanning() {
    this.isLoading = true;
    this.loadEmploisDuTemps();
  }

  private loadEmploisDuTemps() {
    this.isLoading = true;
    this.scheduleService.getEmploisDuTemps().subscribe({
      next: (data) => {
        this.emploisDuTemps = data.map((edt, index) => {
          const now = new Date();
          const status =
            index === 0 ? "in-progress" : index < 2 ? "completed" : "upcoming";
          const statusLabels: Record<string, string> = {
            completed: "Terminé",
            "in-progress": "En cours",
            upcoming: "À venir",
          };
          return {
            matiere: edt.titre || `Séance #${edt.id}`,
            salle: `Salle ${edt.salleId || "A101"}`,
            horaire: `${edt.heureDebut || "08:00"} - ${edt.heureFin || "10:00"}`,
            type: this.getTypeRecurrenceLabel(edt.typeRecurrence),
            status: status,
            statusLabel: statusLabels[status],
            enseignant: edt.enseignantId
              ? `Enseignant #${edt.enseignantId}`
              : "",
          };
        });
        this.isLoading = false;
      },
      error: () => {
        this.emploisDuTemps = [];
        this.isLoading = false;
      },
    });
  }

  private getTypeRecurrenceLabel(type: string): string {
    const labels: Record<string, string> = {
      UNIQUE: "Cours unique",
      HEBDOMADAIRE: "Hebdomadaire",
      MENSUEL: "Mensuel",
    };
    return labels[type] || type || "Cours";
  }
}
