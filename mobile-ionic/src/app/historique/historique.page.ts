import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import {
  IonContent,
  IonButton,
  IonIcon,
  IonBadge,
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
import { forkJoin } from "rxjs";
import { ScheduleService } from "../core/services/schedule.service";
import { EmargementService } from "../core/services/emargement.service";
import { FicheProgressionService } from "../core/services/fiche-progression.service";
import { MatiereService } from "../core/services/matiere.service";
import { Seance } from "../core/models/seance.model";
import { Emargement as EmargementModel } from "../core/models/attendance.model";
import { FicheProgression } from "../core/models/fiche-progression.model";
import { Matiere } from "../core/models/matiere.model";

interface HistoriqueItem {
  id?: number;
  matiere: string;
  date: Date;
  heure: string;
  contenu: string;
  status: "completed" | "in_progress" | "planned";
  presents: number;
  total: number;
  duree: number;
}

@Component({
  selector: "app-historique",
  templateUrl: "historique.page.html",
  styleUrls: ["historique.page.scss"],
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonContent,
    IonButton,
    IonIcon,
    IonBadge,
    IonSegment,
    IonSegmentButton,
    IonLabel,
  ],
})
export class HistoriquePage implements OnInit {
  private readonly scheduleService = inject(ScheduleService);
  private readonly emargementService = inject(EmargementService);
  private readonly ficheProgressionService = inject(FicheProgressionService);
  private readonly matiereService = inject(MatiereService);

  filterPeriod = "all";
  stats = {
    seancesCompletees: 0,
    moyennePresence: 0,
  };

  seances: HistoriqueItem[] = [];
  private seancesData: Seance[] = [];
  private emargementsData: EmargementModel[] = [];
  private fichesProgression: FicheProgression[] = [];
  private matieres: Matiere[] = [];

  get filteredSeances(): HistoriqueItem[] {
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

    return this.seances.filter((s) => s.date >= cutoff);
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

  ngOnInit(): void {
    this.loadHistorique();
  }

  ionViewWillEnter(): void {
    this.loadHistorique();
  }

  filterByPeriod(): void {
    // Filtrage géré par le getter filteredSeances.
  }

  private loadHistorique(): void {
    forkJoin({
      seances: this.scheduleService.getSeances(),
      emargements: this.emargementService.getEmargements(),
      fiches: this.ficheProgressionService.getFichesProgression(),
      matieres: this.matiereService.getAll(),
    }).subscribe({
      next: ({ seances, emargements, fiches, matieres }) => {
        this.seancesData = seances || [];
        this.emargementsData = emargements || [];
        this.fichesProgression = fiches || [];
        this.matieres = matieres || [];
        this.buildHistorique();
      },
      error: () => {
        this.seancesData = [];
        this.emargementsData = [];
        this.fichesProgression = [];
        this.matieres = [];
        this.buildHistorique();
      },
    });
  }

  private buildHistorique(): void {
    this.seances = this.seancesData
      .map((seance) => {
        const fiche = this.findFicheForSeance(seance);
        const emargement = this.findEmargementForSeance(seance);

        return {
          id: seance.id,
          matiere:
            fiche?.matiereLibelle ||
            this.getMatiereLabelFromFiche(fiche) ||
            `Séance #${seance.id}`,
          date: this.parseDate(seance.dateCours),
          heure: `${this.formatTime(seance.heureDebutReelle)} - ${this.formatTime(seance.heureFinReelle)}`,
          contenu:
            fiche?.contenuDetaille || `Statut de la séance : ${seance.statut}`,
          status: this.mapStatus(seance.statut),
          presents: emargement ? 1 : 0,
          total: 1,
          duree: this.calculerDureeMinutes(
            seance.heureDebutReelle,
            seance.heureFinReelle,
          ),
        };
      })
      .sort((a, b) => b.date.getTime() - a.date.getTime());

    this.stats.seancesCompletees = this.seances.filter(
      (s) => s.status === "completed",
    ).length;
    const total = this.seances.reduce((acc, s) => acc + s.total, 0);
    const presents = this.seances.reduce((acc, s) => acc + s.presents, 0);
    this.stats.moyennePresence =
      total > 0 ? Math.round((presents / total) * 100) : 0;
  }

  private findFicheForSeance(seance: Seance): FicheProgression | undefined {
    return this.fichesProgression.find(
      (fiche) =>
        fiche.seanceId === seance.id || fiche.id === seance.ficheProgressionId,
    );
  }

  private findEmargementForSeance(seance: Seance): EmargementModel | undefined {
    return this.emargementsData.find(
      (emargement) => emargement.id === seance.emargementId,
    );
  }

  private getMatiereLabelFromFiche(fiche?: FicheProgression): string {
    if (!fiche?.matiereLibelle) {
      return "";
    }

    const matiere = this.matieres.find(
      (item) => item.libelle === fiche.matiereLibelle,
    );
    return matiere?.libelle || fiche.matiereLibelle;
  }

  private mapStatus(statut: string): "completed" | "in_progress" | "planned" {
    if (statut === "TERMINEE") return "completed";
    if (statut === "EN_COURS") return "in_progress";
    return "planned";
  }

  private calculerDureeMinutes(debut: string, fin: string): number {
    const start = this.toMinutes(debut);
    const end = this.toMinutes(fin);
    return start !== null && end !== null && end > start ? end - start : 0;
  }

  private toMinutes(value?: string): number | null {
    if (!value) return null;
    const [hours, minutes] = value.split(":").map(Number);
    return Number.isFinite(hours) && Number.isFinite(minutes)
      ? hours * 60 + minutes
      : null;
  }

  private parseDate(value?: string): Date {
    if (!value) return new Date();
    const [year, month, day] = value.split("-").map(Number);
    return year && month && day
      ? new Date(year, month - 1, day)
      : new Date(value);
  }

  private formatTime(value?: string): string {
    return value ? value.substring(0, 5) : "--:--";
  }
}
