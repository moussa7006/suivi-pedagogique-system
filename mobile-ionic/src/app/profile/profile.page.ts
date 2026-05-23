import { Component, inject, OnInit, NgZone } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterLink } from "@angular/router";
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
  IonToggle,
  ToastController,
} from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { ThemeService } from "../core/services/theme.service";
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
  imagesOutline,
  globeOutline,
  chevronForwardOutline,
  keyOutline,
  createOutline,
  eyeOutline,
  eyeOffOutline,
  trashOutline,
  moonOutline,
  moon,
  sunny,
} from "ionicons/icons";

import {
  AlertController,
  ActionSheetController,
} from "@ionic/angular/standalone";
import { AuthService } from "../core/services/auth.service";
import { ScheduleService } from "../core/services/schedule.service";
import { finalize } from "rxjs";

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
    IonToggle,
  ],
})
export class ProfilePage implements OnInit {
  private authService = inject(AuthService);
  private scheduleService = inject(ScheduleService);
  private seanceService = inject(SeanceService);
  private alertController = inject(AlertController);
  private actionSheetController = inject(ActionSheetController);
  private toastController = inject(ToastController);
  private router = inject(Router);
  private ngZone = inject(NgZone);

  private themeService = inject(ThemeService);
  isDark = this.themeService.isDark;
  isPasswordModalOpen = false;
  showOldPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  isChangingPassword = false;

  oldPassword = "";
  newPassword = "";
  confirmPassword = "";

  teacher = {
    id: 1,
    firstName: "Enseignant",
    lastName: "",
    matricule: "",
    email: "",
    telephone: "",
    adresse: "",
    subjects: [] as string[],
    status: "Actif",
    avatar: "https://i.pravatar.cc/150?u=default",
    volumeHoraire: {
      total: 0,
      effectue: 0,
      restant: 0,
    },
    statistiques: {
      totalSeances: 0,
      tauxPresence: 0,
      etudiants: 0,
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
      imagesOutline,
      trashOutline,
      globeOutline,
      chevronForwardOutline,
      keyOutline,
      createOutline,
      eyeOutline,
      eyeOffOutline,
      moonOutline,
      moon,
      sunny,
    });
  }

  ngOnInit() {
    this.loadUserProfile();
  }

  private loadUserProfile() {
    const user = this.authService.getUser();
    if (user) {
      this.teacher = {
        ...this.teacher,
        id: user.id || 1,
        firstName: user.prenom || "Enseignant",
        lastName: user.nom || "",
        matricule: user.matricule || "",
        email: user.email || "",
        telephone: user.telephone || "",
        adresse: user.adresse || "",
        avatar: `https://i.pravatar.cc/150?u=${user.email || user.id || "default"}`,
      };
      // Charger la photo sauvegardée si elle existe
      this.loadPhotoFromStorage();
    }

    // Charger les statistiques depuis l'API des séances
    this.scheduleService.getSeances().subscribe({
      next: (seances) => {
        this.teacher.statistiques.totalSeances = seances.length;
        this.teacher.volumeHoraire.effectue = seances.length * 2; // Approximation: 2h par séance
        this.teacher.volumeHoraire.total = Math.max(
          this.teacher.volumeHoraire.effectue,
          120,
        );
        this.teacher.volumeHoraire.restant =
          this.teacher.volumeHoraire.total -
          this.teacher.volumeHoraire.effectue;
      },
      error: () => {
        // Garder les valeurs par défaut
      },
    });
  }

  openPasswordModal() {
    this.oldPassword = "";
    this.newPassword = "";
    this.confirmPassword = "";
    this.isPasswordModalOpen = true;
  }

  toggleDarkMode() {
    this.isDark = this.themeService.toggle();
  }

  updatePassword() {
    if (!this.newPassword || this.newPassword.length < 14) {
      this.presentToast(
        "Le mot de passe doit contenir au moins 14 caractères.",
        "danger",
      );
      return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{14,}$/.test(this.newPassword)) {
      this.presentToast(
        "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre.",
        "danger",
      );
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.presentToast("Les mots de passe ne correspondent pas.", "danger");
      return;
    }

    this.isChangingPassword = true;

    this.authService
      .changePassword(this.newPassword)
      .pipe(finalize(() => (this.isChangingPassword = false)))
      .subscribe({
        next: async () => {
          this.isPasswordModalOpen = false;
          const toast = await this.toastController.create({
            message: "Mot de passe modifié avec succès.",
            duration: 3000,
            color: "success",
            position: "top",
          });
          await toast.present();
        },
        error: async () => {
          const toast = await this.toastController.create({
            message: "Erreur lors de la modification du mot de passe.",
            duration: 3000,
            color: "danger",
            position: "top",
          });
          await toast.present();
        },
      });
  }

  async changePhoto() {
    const actionSheet = await this.actionSheetController.create({
      header: "Changer la photo de profil",
      buttons: [
        {
          text: "Prendre une photo",
          icon: "camera-outline",
          handler: () => {
            this.takePhoto("camera");
          },
        },
        {
          text: "Choisir depuis la galerie",
          icon: "images-outline",
          handler: () => {
            this.takePhoto("gallery");
          },
        },
        {
          text: "Supprimer la photo",
          icon: "trash-outline",
          handler: () => {
            this.teacher.avatar = "";
            this.savePhotoToStorage("");
          },
          role: "destructive",
        },
        {
          text: "Annuler",
          icon: "close-outline",
          role: "cancel",
        },
      ],
    });
    await actionSheet.present();
  }

  private async takePhoto(source: "camera" | "gallery") {
    try {
      const { Camera, CameraResultType, CameraSource } =
        await import("@capacitor/camera");

      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: source === "camera" ? CameraSource.Camera : CameraSource.Photos,
        saveToGallery: source === "camera",
        width: 512,
        height: 512,
      });

      if (image.dataUrl) {
        this.ngZone.run(() => {
          this.teacher.avatar = image.dataUrl!;
          this.savePhotoToStorage(image.dataUrl!);
        });
      }
    } catch (error: any) {
      if (error?.message?.includes("User cancelled")) {
        return;
      }

      // Fallback: utiliser un avatar par defaut
      const toast = await this.toastController.create({
        message:
          "Impossible d'accéder à la caméra/galerie. Utilisation d'un avatar par défaut.",
        duration: 3000,
        color: "warning",
        position: "top",
      });
      await toast.present();

      const newId = Math.floor(Math.random() * 1000);
      this.teacher.avatar = `https://i.pravatar.cc/150?u=${newId}`;
    }
  }

  private savePhotoToStorage(dataUrl: string) {
    try {
      localStorage.setItem("profile_photo", dataUrl);
    } catch (e) {
      console.warn("Impossible de sauvegarder la photo dans le stockage local");
    }
  }

  private async presentToast(message: string, color: string = "danger") {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: "top",
    });
    await toast.present();
  }

  private loadPhotoFromStorage() {
    try {
      const saved = localStorage.getItem("profile_photo");
      if (saved) {
        this.teacher.avatar = saved;
      }
    } catch (e) {
      // Ignorer
    }
  }

  getProgressPercent() {
    if (this.teacher.volumeHoraire.total === 0) {
      return 0;
    }
    return (
      (this.teacher.volumeHoraire.effectue / this.teacher.volumeHoraire.total) *
      100
    );
  }

  logout() {
    this.authService.logout();
  }
}
