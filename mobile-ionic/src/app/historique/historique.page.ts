import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
  IonCard,
  IonBadge,
  IonList,
  IonSegment,
  IonSegmentButton,
  IonLabel,
} from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import {
  calendarOutline,
  timeOutline,
  peopleOutline,
  documentTextOutline,
  checkmarkDoneOutline,
  eyeOutline,
  arrowDownOutline,
  arrowBackOutline,
} from "ionicons/icons";
import { ScheduleService } from "../core/services/schedule.service";
import { EmargementService } from "../core/services/emargement.service";
import { Seance } from "../core/models/seance.model";
import { Emargement as EmargementModel } from "../core/models/attendance.model";

@Component({
  selector: "app-historique",
  templateUrl: "historique.page.html",
  styleUrls: ["historique.page.scss"],
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonIcon,
    IonCard,
    IonBadge,
    IonList,
    IonSegment,
    IonSegmentButton,
    IonLabel,
  ],
})
export class HistoriquePage implements OnInit {
  private scheduleService = inject(ScheduleService);
  private emargementService = inject(EmargementService);

  filterPeriod = "all";

  stats = {
    seancesCompletees: 0,
    moyennePresence: 0,
  };

  seances: any[] = [];
  seancesData: Seance[] = [];
  emargementsData: EmargementModel[] = [];

  get filteredSeances() {
    if (this.filterPeriod === "all") {
      return this.seances;
    }

    const now = new Date();
    const cutoff = new Date();

    if (this.filterPeriod === "week") {
      cutoff.setDate(now.getDate() - 7);
    } else if (this.filterPeriod === "month") {
      cutoff.setMonth(now.getMonth() - 1);
    }

    return this.seances.filter((s) => new Date(s.date) >= cutoff);
  }

  constructor() {
    addIcons({
      calendarOutline,
      timeOutline,
      peopleOutline,
      documentTextOutline,
      checkmarkDoneOutline,
      eyeOutline,
      arrowDownOutline,
      arrowBackOutline,
    });
  }

  ngOnInit() {
    this.loadHistorique();
  }

  private loadHistorique() {
    // Charger les séances
    this.scheduleService.getSeances().subscribe({
      next: (data) => {
        this.seancesData = data;
        this.buildHistorique();
      },
      error: () => {
        this.seancesData = [];
        this.buildHistorique();
      },
    });

    // Charger les émargements
    this.emargementService.getEmargements().subscribe({
      next: (data) => {
        this.emargementsData = data;
        this.buildHistorique();
      },
      error: () => {
        this.emargementsData = [];
        this.buildHistorique();
      },
    });
  }

  private buildHistorique() {
    // Fusionner les données de séances avec les infos d'émargements
    const now = new Date();
    this.seances = this.seancesData.map((s) => {
      const emargement = this.emargementsData.find((e) => e.id === s.emargementId);

      return {
        id: s.id,
        matiere: `Séance #${s.id}`,
        date: new Date(s.dateCours),
        heure: `${s.heureDebutReelle} - ${s.heureFinReelle}`,
        contenu: `Statut: ${s.statut}`,
        status: s.statut === 'TERMINEE' ? 'completed' :
                s.statut === 'EN_COURS' ? 'in_progress' : 'planned',
        presents: emargement ? 1 : 0,
        total: 1,
        duree: this.calculerDureeMinutes(s.heureDebutReelle, s.heureFinReelle),
      };
    });

    this.stats.seancesCompletees = this.seances.filter(
      (s) => s.status === 'completed'
    ).length;
    this.stats.moyennePresence = this.seances.length > 0
      ? Math.round(
          (this.seances.reduce((acc, s) => acc + s.presents, 0) /
            this.seances.reduce((acc, s) => acc + s.total, 0)) *
            100
        )
      : 0;
  }

  private calculerDureeMinutes(debut: string, fin: string): number {
    const [h1, m1] = debut.split(':').map(Number);
    const [h2, m2] = fin.split(':').map(Number);
    return (h2 * 60 + m2) - (h1 * 60 + m1);
  }

  filterByPeriod() {
    // Filtrage déjà géré par le getter filteredSeances
  }
}
