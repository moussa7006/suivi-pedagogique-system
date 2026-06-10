import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import {
  IonContent,
  IonButton,
  IonIcon,
  IonInput,
  ToastController,
} from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import {
  scanOutline,
  cameraOutline,
  alertCircleOutline,
  checkmarkCircleOutline,
  timeOutline,
  locationOutline,
  arrowBackOutline,
} from "ionicons/icons";
import { SeanceService } from "../seance.service";
import { EmargementService } from "../core/services/emargement.service";
import { FicheProgressionService } from "../core/services/fiche-progression.service";
import { AlertController } from "@ionic/angular/standalone";

@Component({
  selector: "app-scan-qr",
  templateUrl: "scan-qr.page.html",
  styleUrls: ["scan-qr.page.scss"],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonContent,
    IonButton,
    IonIcon,
    IonInput,
  ],
})
export class ScanQRPage implements OnInit {
  private seanceService = inject(SeanceService);
  private emargementService = inject(EmargementService);
  private ficheProgressionService = inject(FicheProgressionService);
  private alertController = inject(AlertController);
  private toastController = inject(ToastController);
  private router = inject(Router);

  isScanning = false;
  manualToken = "";

  constructor() {
    addIcons({
      scanOutline,
      cameraOutline,
      alertCircleOutline,
      checkmarkCircleOutline,
      timeOutline,
      locationOutline,
      arrowBackOutline,
    });
  }

  ngOnInit() {
    this.ficheProgressionService.getFichesProgression().subscribe({
      next: (fiches) => {
        if (fiches.length > 0) {
          this.seanceService.setTableauFait(true);
        }
      },
      error: () => {
        // Le scan gardera le contrôle local si l'API n'est pas disponible.
      },
    });
  }

  async openScanner() {
    if (!this.seanceService.isCahierFait) {
      const alert = await this.alertController.create({
        header: "Action Bloquée",
        subHeader: "Cahier de Textes manquant",
        message:
          "Vous ne pouvez pas émarger sans avoir d'abord saisi le contenu de votre séance dans le Cahier de Textes.",
        buttons: [
          {
            text: "Plus tard",
            role: "cancel",
          },
          {
            text: "Remplir le cahier",
            handler: () => {
              this.router.navigate(["/tabs/tabs/tab3"]);
            },
          },
        ],
      });

      await alert.present();
      return;
    }

    const tokenQRCode = this.manualToken.trim();
    if (!tokenQRCode) {
      const alert = await this.alertController.create({
        header: "QR Code manquant",
        message:
          "Veuillez scanner un QR code ou coller le token QR affiché par l'administrateur.",
        buttons: ["OK"],
      });
      await alert.present();
      return;
    }

    this.isScanning = true;
    this.getCurrentPosition()
      .then((position) => {
        this.emargementService
          .scanQRCode({
            tokenQRCode,
            latitude: position.latitude,
            longitude: position.longitude,
            adresseApproximative: position.adresseApproximative,
          })
          .subscribe({
            next: async (response) => {
              this.isScanning = false;
              const toast = await this.toastController.create({
                message: `Émargement ${response.statut === "VALIDE" ? "validé ✅" : "enregistré (" + response.statut + ")"}`,
                duration: 3000,
                color: response.statut === "VALIDE" ? "success" : "warning",
                position: "top",
              });
              await toast.present();
            },
            error: async (error) => {
              this.isScanning = false;

              let message =
                error?.error?.error || "Erreur lors de l'émargement.";
              if (error.status === 400 && !error?.error?.error) {
                message = "QR Code invalide ou séance non trouvée.";
              } else if (error.status === 409) {
                message = "Vous avez déjà émargé pour cette séance.";
              } else if (error.status === 403) {
                message = "Hors périmètre autorisé pour l'émargement.";
              }

              const alert = await this.alertController.create({
                header: "Échec de l'émargement",
                message,
                buttons: ["OK"],
              });
              await alert.present();
            },
          });
      })
      .catch(async (error) => {
        this.isScanning = false;
        const alert = await this.alertController.create({
          header: "Position GPS indisponible",
          message: error?.message || "Impossible de récupérer votre position.",
          buttons: ["OK"],
        });
        await alert.present();
      });
  }

  private getCurrentPosition(): Promise<{
    latitude: number;
    longitude: number;
    adresseApproximative: string;
  }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(
          new Error(
            "La géolocalisation n'est pas disponible sur cet appareil.",
          ),
        );
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            adresseApproximative: "Position GPS du mobile",
          });
        },
        () =>
          reject(
            new Error("Autorisation GPS refusée ou position introuvable."),
          ),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      );
    });
  }
}
