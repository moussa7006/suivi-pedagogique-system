import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { SeanceService } from "../seance.service";
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
  IonAvatar,
  IonBadge,
  IonList,
  IonProgressBar,
  IonSelect,
  IonSelectOption,
  IonModal,
  IonInput,
  IonButtons,
} from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import {
  personOutline,
  mailOutline,
  callOutline,
  locationOutline,
  businessOutline,
  bookOutline,
  timeOutline,
  checkmarkCircleOutline,
  warningOutline,
  logOutOutline,
  statsChartOutline,
  arrowBackOutline,
  personCircleOutline,
  shieldCheckmarkOutline,
  lockClosedOutline,
  notificationsOutline,
  cameraOutline,
  globeOutline,
  chevronForwardOutline,
  keyOutline,
  createOutline,
  eyeOutline,
  eyeOffOutline,
} from "ionicons/icons";

import { AlertController } from "@ionic/angular/standalone";

@Component({
  selector: "app-profile",
  templateUrl: "profile.page.html",
  styleUrls: ["profile.page.scss"],
  imports: [
    CommonModule,
    RouterLink,
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
    IonAvatar,
    IonBadge,
    IonList,
    IonProgressBar,
    IonSelect,
    IonSelectOption,
    IonModal,
    IonInput,
    IonButtons,
  ],
})
export class ProfilePage {
  private seanceService = inject(SeanceService);
  private alertController = inject(AlertController);
  
  isPasswordModalOpen = false;
  showOldPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  teacher = {
    id: 1,
    firstName: "Alou",
    lastName: "Diarra",
    matricule: "M001",
    email: "alou.diarra@univ-mali.ml",
    telephone: "+223 70 12 34 56",
    adresse: "Bamako, Quartier Badalabougou",
    subjects: ["Algorithmique", "Java"],
    status: "Actif",
    avatar: "https://i.pravatar.cc/150?u=alou",
    volumeHoraire: {
      total: 120,
      effectue: 85,
      restant: 35,
    },
    statistiques: {
      totalSeances: 42,
      tauxPresence: 89,
      etudiants: 156,
    },
  };

  constructor() {
    addIcons({
      personOutline,
      mailOutline,
      callOutline,
      locationOutline,
      businessOutline,
      bookOutline,
      timeOutline,
      checkmarkCircleOutline,
      warningOutline,
      logOutOutline,
      statsChartOutline,
      arrowBackOutline,
      personCircleOutline,
      shieldCheckmarkOutline,
      lockClosedOutline,
      notificationsOutline,
      cameraOutline,
      chevronForwardOutline,
      keyOutline,
      createOutline,
      eyeOutline,
      eyeOffOutline,
    });
  }

  openPasswordModal() {
    this.isPasswordModalOpen = true;
  }

  updatePassword() {
    console.log("Mot de passe mis à jour !");
    this.isPasswordModalOpen = false;
  }

  changePhoto() {
    // Simulation du changement de photo
    const newId = Math.floor(Math.random() * 100);
    this.teacher.avatar = `https://i.pravatar.cc/150?u=${newId}`;
  }

  getProgressPercent() {
    return (
      (this.teacher.volumeHoraire.effectue / this.teacher.volumeHoraire.total) *
      100
    );
  }

  logout() {
    // TODO: Implement logout logic
    console.log("Logout");
  }
}
