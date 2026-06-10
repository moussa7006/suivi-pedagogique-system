import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SeanceService } from "../seance.service";
import {
  FormsModule,
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
  IonBadge,
  IonSpinner,
} from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import {
  documentTextOutline,
  addCircleOutline,
  calendarOutline,
  bookOutline,
  timeOutline,
  checkmarkCircleOutline,
  alertCircleOutline,
  pencilOutline,
  listCircleOutline,
  eyeOutline,
  createOutline,
  saveOutline,
  closeCircleOutline,
  checkmarkDoneOutline,
  arrowBackOutline,
  addOutline,
  closeOutline,
  arrowForwardOutline,
  listOutline,
  time,
} from "ionicons/icons";
import { FicheProgressionService } from "../core/services/fiche-progression.service";
import { ScheduleService } from "../core/services/schedule.service";
import { FicheProgression } from "../core/models/fiche-progression.model";
import { Seance } from "../core/models/seance.model";
import { finalize } from "rxjs";

@Component({
  selector: "app-cahier-textes",
  templateUrl: "cahier-textes.page.html",
  styleUrls: ["cahier-textes.page.scss"],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonContent,
    IonButton,
    IonIcon,
    IonInput,
    IonTextarea,
    IonBadge,
    IonSpinner,
  ],
})
export class CahierTextesPage implements OnInit {
  seanceForm: FormGroup;
  isSubmitting = false;
  showForm = false;
  private seanceService = inject(SeanceService);
  private ficheProgressionService = inject(FicheProgressionService);
  private scheduleService = inject(ScheduleService);
  totalHeures = 0;

  fichesProgression: FicheProgression[] = [];
  seancesDisponibles: Seance[] = [];

  private fb = inject(FormBuilder);

  constructor() {
    this.totalHeures = this.seanceService.totalHeures;
    addIcons({
      documentTextOutline,
      addCircleOutline,
      calendarOutline,
      bookOutline,
      timeOutline,
      checkmarkCircleOutline,
      alertCircleOutline,
      pencilOutline,
      listCircleOutline,
      eyeOutline,
      createOutline,
      saveOutline,
      closeCircleOutline,
      checkmarkDoneOutline,
      arrowBackOutline,
      addOutline,
      closeOutline,
      arrowForwardOutline,
      listOutline,
      time,
    });

    this.seanceForm = this.fb.group({
      seanceId: [null, Validators.required],
      matiere: ["", Validators.required],
      date: ["", Validators.required],
      heure: ["08:00 - 10:00"],
      contenu: ["", [Validators.required, Validators.minLength(20)]],
    });
  }

  ngOnInit() {
    this.loadFichesProgression();
    this.loadSeancesDisponibles();
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
      matiere: f.matiereLibelle,
      date: f.dateSeance,
      heure: f.heureSeance,
      contenu: f.contenuDetaille,
      status: f.estValideAdmin ? "Validé" : "En attente",
    }));
  }

  private loadSeancesDisponibles() {
    this.scheduleService.getSeances().subscribe({
      next: (seances) => {
        this.seancesDisponibles = seances.filter((s) => !s.ficheProgressionId);
        const selected = this.seancesDisponibles[0] || seances[0];

        if (selected?.id) {
          this.seanceForm.patchValue({
            seanceId: selected.id,
            date: selected.dateCours,
            heure: `${selected.heureDebutReelle} - ${selected.heureFinReelle}`,
          });
        }
      },
      error: () => {
        this.seancesDisponibles = [];
      },
    });
  }

  onSeanceChange() {
    const seanceId = Number(this.seanceForm.value.seanceId);
    const selected = this.seancesDisponibles.find((s) => s.id === seanceId);

    if (selected) {
      this.seanceForm.patchValue({
        date: selected.dateCours,
        heure: `${selected.heureDebutReelle} - ${selected.heureFinReelle}`,
      });
    }
  }

  private loadFichesProgression() {
    this.ficheProgressionService.getFichesProgression().subscribe({
      next: (data) => {
        this.fichesProgression = data;
      },
      error: () => {
        this.fichesProgression = [];
      },
    });
  }

  onSubmit() {
    if (this.seanceForm.invalid) {
      this.seanceForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const seanceId = Number(this.seanceForm.value.seanceId);
    const payload = {
      dateSaisie: this.seanceForm.value.date,
      contenuDetaille: this.seanceForm.value.contenu,
      objectifs: this.seanceForm.value.matiere,
      travaux: "",
    };

    this.ficheProgressionService
      .createFicheProgression(seanceId, payload)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: (fiche) => {
          this.fichesProgression.unshift(fiche);
          this.seanceService.setTableauFait(true);
          this.seanceForm.reset();
          this.showForm = false;
        },
        error: () => {
          // En cas d'erreur, on garde les données mockées comme fallback
          this.seanceService.setTableauFait(true);
          this.isSubmitting = false;
          this.seanceForm.reset();
          this.showForm = false;
        },
      });
  }
}
