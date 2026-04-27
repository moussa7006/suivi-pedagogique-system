import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
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
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonList,
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
  linkOutline,
  eyeOutline,
  createOutline,
  saveOutline,
  closeCircleOutline,
  checkmarkDoneOutline,
  arrowBackOutline,
  time,
  sendOutline,
} from "ionicons/icons";

@Component({
  selector: "app-cahier-textes",
  templateUrl: "cahier-textes.page.html",
  styleUrls: ["cahier-textes.page.scss"],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ReactiveFormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    IonList,
    IonBadge,
    IonSpinner,
  ],
})
export class CahierTextesPage {
  seanceForm: FormGroup;
  isSubmitting = false;
  showForm = false;
  private seanceService = inject(SeanceService);
  totalHeures = 0;

  seances = [
    {
      id: 1,
      matiere: "Algorithmique",
      date: "2024-01-15",
      heure: "08:00 - 10:00",
      contenu: "Introduction aux algorithmes de tri: tri à bulles, tri par insertion.",
      status: "Validé",
      ressources: "Support de cours PDF",
    }
  ];

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
      linkOutline,
      eyeOutline,
      createOutline,
      saveOutline,
      closeCircleOutline,
      checkmarkDoneOutline,
      arrowBackOutline,
      time,
      sendOutline,
    });

    this.seanceForm = this.fb.group({
      matiere: ["", Validators.required],
      date: ["", Validators.required],
      heure: ["08:00 - 10:00"],
      contenu: ["", [Validators.required, Validators.minLength(20)]],
      ressources: [""],
    });
  }

  get getValidatedCount(): number {
    return this.seances.filter((s) => s.status === "Validé").length;
  }

  onSubmit() {
    if (this.seanceForm.invalid) {
      this.seanceForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    setTimeout(() => {
      const nouvelleSeance = {
        id: this.seances.length + 1,
        matiere: this.seanceForm.value.matiere,
        date: this.seanceForm.value.date,
        heure: this.seanceForm.value.heure || "08:00 - 10:00",
        contenu: this.seanceForm.value.contenu,
        status: "En attente",
        ressources: this.seanceForm.value.ressources || "",
      };

      this.seances.unshift(nouvelleSeance);
      this.seanceService.setTableauFait(true);

      this.isSubmitting = false;
      this.seanceForm.reset();
      this.showForm = false;
    }, 1500);
  }
}
