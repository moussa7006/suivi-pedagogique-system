import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import {
  IonContent,
  IonButton,
  IonIcon,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonBadge,
  IonSpinner,
  ToastController,
} from "@ionic/angular/standalone";
import { ActivatedRoute } from "@angular/router";
import { addIcons } from "ionicons";
import {
  documentTextOutline,
  calendarOutline,
  bookOutline,
  timeOutline,
  checkmarkCircleOutline,
  createOutline,
  arrowForwardOutline,
  listOutline,
  closeOutline,
  addOutline,
  checkmarkDoneOutline,
} from "ionicons/icons";
import { forkJoin, finalize } from "rxjs";
import { FicheProgressionService } from "../core/services/fiche-progression.service";
import { ScheduleService } from "../core/services/schedule.service";
import { FicheProgression } from "../core/models/fiche-progression.model";
import { Seance } from "../core/models/seance.model";

@Component({
  selector: "app-cahier-textes",
  templateUrl: "cahier-textes.page.html",
  styleUrls: ["cahier-textes.page.scss"],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    IonButton,
    IonIcon,
    IonInput,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    IonBadge,
    IonSpinner,
  ],
})
export class CahierTextesPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly ficheProgressionService = inject(FicheProgressionService);
  private readonly scheduleService = inject(ScheduleService);
  private readonly toastController = inject(ToastController);
  private readonly route = inject(ActivatedRoute);

  seanceForm: FormGroup;
  isSubmitting = false;
  isLoading = false;
  showForm = false;
  totalHeures = 0;
  fichesProgression: FicheProgression[] = [];
  seancesDisponibles: Seance[] = [];
  openedFromScan = false;

  constructor() {
    addIcons({
      documentTextOutline,
      calendarOutline,
      bookOutline,
      timeOutline,
      checkmarkCircleOutline,
      createOutline,
      arrowForwardOutline,
      listOutline,
      closeOutline,
      addOutline,
      checkmarkDoneOutline,
    });

    this.seanceForm = this.fb.group({
      seanceId: [null, Validators.required],
      contenu: ["", [Validators.required, Validators.minLength(20)]],
      objectifs: ["", [Validators.required, Validators.minLength(5)]],
      travaux: [""],
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  get getValidatedCount(): number {
    return this.fichesProgression.filter((f) => f.estValideAdmin).length;
  }

  get getPendingCount(): number {
    return this.fichesProgression.filter((f) => !f.estValideAdmin).length;
  }

  get seances() {
    return this.fichesProgression.map((f) => ({
      id: f.id,
      matiere: f.matiereLibelle || f.objectifs || "Séance",
      date: f.dateSeance || f.dateSaisie,
      heure: f.heureSeance || "Horaire non précisé",
      contenu: f.contenuDetaille,
      status: f.estValideAdmin ? "Validé" : "En attente",
    }));
  }

  get selectedSeanceLabel(): string {
    const seance = this.seancesDisponibles.find(
      (item) => item.id === Number(this.seanceForm.value.seanceId),
    );
    return seance ? this.formatSeanceLabel(seance) : "";
  }

  loadData(): void {
    this.isLoading = true;
    forkJoin({
      fiches: this.ficheProgressionService.getFichesProgression(),
      seances: this.scheduleService.getSeances(),
    })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: ({ fiches, seances }) => {
          this.fichesProgression = fiches || [];
          this.seancesDisponibles = (seances || []).filter(
            (seance) => !this.hasFicheProgression(seance),
          );
          this.applyScanContext();
          this.totalHeures = this.fichesProgression.reduce(
            (total, fiche) =>
              total + this.extractDurationHours(fiche.heureSeance),
            0,
          );
        },
        error: () =>
          this.presentToast("Impossible de charger les séances.", "danger"),
      });
  }

  onSubmit(): void {
    if (this.seanceForm.invalid) {
      this.seanceForm.markAllAsTouched();
      return;
    }

    const seanceId = Number(this.seanceForm.value.seanceId);
    const payload = {
      dateSaisie: new Date().toISOString().slice(0, 10),
      contenuDetaille: this.seanceForm.value.contenu,
      objectifs: this.seanceForm.value.objectifs,
      travaux: this.seanceForm.value.travaux || "",
    };

    this.isSubmitting = true;
    this.ficheProgressionService
      .createFicheProgression(seanceId, payload)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: async () => {
          await this.presentToast(
            this.openedFromScan
              ? "Fiche enregistrée. Émargement validé automatiquement."
              : "Cahier de textes enregistré.",
            "success",
          );
          this.seanceForm.reset();
          this.showForm = false;
          this.openedFromScan = false;
          this.loadData();
        },
        error: (error) => {
          const message =
            typeof error?.error === "string"
              ? error.error
              : error?.error?.message ||
                "Impossible d'enregistrer le cahier de textes.";
          this.presentToast(message, "danger");
        },
      });
  }

  formatSeanceLabel(seance: Seance): string {
    return `${seance.dateCours} • ${this.formatTime(seance.heureDebutReelle)} - ${this.formatTime(
      seance.heureFinReelle,
    )} • ${seance.statut}`;
  }

  private applyScanContext(): void {
    const seanceId = Number(this.route.snapshot.queryParamMap.get("seanceId"));
    this.openedFromScan =
      this.route.snapshot.queryParamMap.get("fromScan") === "true";

    if (!this.openedFromScan || !seanceId) {
      return;
    }

    const seanceIsAvailable = this.seancesDisponibles.some(
      (seance) => seance.id === seanceId,
    );
    if (seanceIsAvailable) {
      this.showForm = true;
      this.seanceForm.patchValue({ seanceId });
    }
  }

  private hasFicheProgression(seance: Seance): boolean {
    return (
      !!seance.ficheProgressionId ||
      this.fichesProgression.some((fiche) => fiche.seanceId === seance.id)
    );
  }

  private extractDurationHours(heureSeance?: string): number {
    if (!heureSeance || !heureSeance.includes("-")) {
      return 0;
    }

    const [start, end] = heureSeance.split("-").map((value) => value.trim());
    const startMinutes = this.toMinutes(start);
    const endMinutes = this.toMinutes(end);
    return startMinutes !== null &&
      endMinutes !== null &&
      endMinutes > startMinutes
      ? Math.round(((endMinutes - startMinutes) / 60) * 10) / 10
      : 0;
  }

  private toMinutes(value: string): number | null {
    const [hours, minutes] = value.split(":").map(Number);
    return Number.isFinite(hours) && Number.isFinite(minutes)
      ? hours * 60 + minutes
      : null;
  }

  private formatTime(value?: string): string {
    return value ? value.substring(0, 5) : "--:--";
  }

  private async presentToast(
    message: string,
    color: "success" | "danger" | "warning" = "success",
  ) {
    const toast = await this.toastController.create({
      message,
      color,
      duration: 3000,
      position: "top",
    });
    await toast.present();
  }
}
