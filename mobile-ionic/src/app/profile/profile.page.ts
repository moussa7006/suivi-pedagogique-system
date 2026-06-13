import { Component, inject, OnInit, NgZone } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import {
  IonContent,
  IonButton,
  IonIcon,
  IonAvatar,
  IonModal,
  IonInput,
  ToastController,
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
  imagesOutline,
  globeOutline,
  chevronForwardOutline,
  keyOutline,
  createOutline,
  eyeOutline,
  eyeOffOutline,
  trashOutline,
} from "ionicons/icons";

import { ActionSheetController } from "@ionic/angular/standalone";
import { AuthService } from "../core/services/auth.service";
import { ScheduleService } from "../core/services/schedule.service";
import { UtilisateurService } from "../core/services/utilisateur.service";
import { finalize } from "rxjs";

@Component({
  selector: "app-profile",
  templateUrl: "profile.page.html",
  styleUrls: ["profile.page.scss"],
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonContent,
    IonButton,
    IonIcon,
    IonAvatar,
    IonModal,
    IonInput,
  ],
})
export class ProfilePage implements OnInit {
  private authService = inject(AuthService);
  private scheduleService = inject(ScheduleService);
  private utilisateurService = inject(UtilisateurService);
  private actionSheetController = inject(ActionSheetController);
  private toastController = inject(ToastController);
  private ngZone = inject(NgZone);

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
    });
  }

  ngOnInit() {
    void this.loadUserProfile();
  }

  private async loadUserProfile(): Promise<void> {
    const user = await this.authService.getUser();
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
        avatar:
          user.photoUrl ||
          `https://i.pravatar.cc/150?u=${user.email || user.id || "default"}`,
      };
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

  updatePassword() {
    if (!this.oldPassword) {
      this.presentToast("Veuillez renseigner l'ancien mot de passe.", "danger");
      return;
    }

    if (!this.newPassword || this.newPassword.length < 14) {
      this.presentToast(
        "Le mot de passe doit contenir au moins 14 caractères.",
        "danger",
      );
      return;
    }

    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{14,}$/.test(
        this.newPassword,
      )
    ) {
      this.presentToast(
        "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un symbole.",
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
      .changePassword(this.oldPassword, this.newPassword)
      .pipe(finalize(() => (this.isChangingPassword = false)))
      .subscribe({
        next: async () => {
          this.oldPassword = "";
          this.newPassword = "";
          this.confirmPassword = "";
          this.isPasswordModalOpen = false;
          const toast = await this.toastController.create({
            message: "Mot de passe modifié avec succès.",
            duration: 3000,
            color: "success",
            position: "top",
          });
          await toast.present();
        },
        error: async (err) => {
          const toast = await this.toastController.create({
            message:
              err?.error?.error ||
              "Erreur lors de la modification du mot de passe.",
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
            void this.saveProfilePhoto("");
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
          void this.saveProfilePhoto(image.dataUrl!);
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

  private async saveProfilePhoto(photoUrl: string): Promise<void> {
    const user = await this.authService.getUser();

    if (!user?.id) {
      await this.presentToast(
        "Impossible de retrouver l’identifiant du compte connecté.",
        "danger",
      );
      return;
    }

    this.utilisateurService.modifierPhoto(user.id, photoUrl).subscribe({
      next: async (updatedUser) => {
        const nextUser = {
          ...user,
          ...updatedUser,
          photoUrl,
        };

        if (!photoUrl) {
          delete nextUser.photoUrl;
        }

        await this.authService.setUser(nextUser);
        this.teacher.avatar =
          photoUrl ||
          `https://i.pravatar.cc/150?u=${this.teacher.email || this.teacher.id || "default"}`;
        await this.presentToast(
          photoUrl
            ? "Photo de profil mise à jour."
            : "Photo de profil supprimée.",
          "success",
        );
      },
      error: async () => {
        await this.presentToast(
          photoUrl
            ? "Impossible d’enregistrer cette photo."
            : "Impossible de supprimer la photo.",
          "danger",
        );
      },
    });
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
    void this.authService.logout();
  }
}
