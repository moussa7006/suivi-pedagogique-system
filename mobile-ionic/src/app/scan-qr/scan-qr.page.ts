import {
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  inject,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import {
  IonContent,
  IonButton,
  IonIcon,
  IonInput,
  IonSelect,
  IonSelectOption,
  ToastController,
  AlertController,
} from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import {
  scanOutline,
  cameraOutline,
  alertCircleOutline,
  checkmarkCircleOutline,
  locationOutline,
  arrowBackOutline,
  stopCircleOutline,
  calendarOutline,
} from "ionicons/icons";
import { Geolocation } from "@capacitor/geolocation";
import jsQR from "jsqr";
import { forkJoin } from "rxjs";
import { EmargementService } from "../core/services/emargement.service";
import { FicheProgressionService } from "../core/services/fiche-progression.service";
import { ScheduleService } from "../core/services/schedule.service";
import { FicheProgression } from "../core/models/fiche-progression.model";
import { Seance } from "../core/models/seance.model";

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
    IonSelect,
    IonSelectOption,
  ],
})
export class ScanQRPage implements OnDestroy {
  @ViewChild("previewVideo") previewVideo?: ElementRef<HTMLVideoElement>;

  private readonly emargementService = inject(EmargementService);
  private readonly ficheProgressionService = inject(FicheProgressionService);
  private readonly scheduleService = inject(ScheduleService);
  private readonly alertController = inject(AlertController);
  private readonly toastController = inject(ToastController);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  isScanning = false;
  isCameraOpen = false;
  isLoading = false;
  manualToken = "";
  selectedSeanceId: number | null = null;
  seances: Seance[] = [];
  fichesProgression: FicheProgression[] = [];
  cameraSupported = true;

  private mediaStream: MediaStream | null = null;
  private scanTimer: number | null = null;
  private scanCanvas?: HTMLCanvasElement;
  private scanContext?: CanvasRenderingContext2D | null;

  constructor() {
    addIcons({
      scanOutline,
      cameraOutline,
      alertCircleOutline,
      checkmarkCircleOutline,
      locationOutline,
      arrowBackOutline,
      stopCircleOutline,
      calendarOutline,
    });

    this.loadData();
  }

  ngOnDestroy(): void {
    this.stopCamera();
  }

  get selectedSeance(): Seance | null {
    return (
      this.seances.find((item) => item.id === Number(this.selectedSeanceId)) ||
      null
    );
  }

  get canUseManualFallback(): boolean {
    return !this.cameraSupported;
  }

  loadData(): void {
    this.isLoading = true;
    forkJoin({
      seances: this.scheduleService.getSeances(),
      fiches: this.ficheProgressionService.getFichesProgression(),
    }).subscribe({
      next: ({ seances, fiches }) => {
        this.seances = seances || [];
        this.fichesProgression = fiches || [];
        this.selectedSeanceId = this.resolveInitialSeanceId(this.seances);
        this.isLoading = false;
      },
      error: async () => {
        this.isLoading = false;
        await this.presentAlert(
          "Chargement impossible",
          "Impossible de charger les séances.",
        );
      },
    });
  }

  private resolveInitialSeanceId(seances: Seance[]): number | null {
    const seanceIdFromRoute = Number(
      this.route.snapshot.queryParamMap.get("seanceId"),
    );

    if (seanceIdFromRoute && seances.some((s) => s.id === seanceIdFromRoute)) {
      return seanceIdFromRoute;
    }

    if (this.selectedSeanceId) {
      return this.selectedSeanceId;
    }

    const today = this.toDateKey(new Date());
    const todaysSeanceWithQr = seances.find(
      (seance) => seance.dateCours === today && !!seance.qrCodeId,
    );
    if (todaysSeanceWithQr?.id) {
      return todaysSeanceWithQr.id;
    }

    return seances.length === 1 && seances[0].id ? seances[0].id : null;
  }

  async openScanner(): Promise<void> {
    if (!(await this.ensureSelectedSeanceIsReady())) {
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      this.cameraSupported = false;
      await this.presentAlert(
        "Caméra non supportée",
        "La caméra n'est pas disponible dans cet environnement. Utilisez temporairement le champ de secours.",
      );
      return;
    }

    try {
      this.cameraSupported = true;
      this.isCameraOpen = true;
      this.isScanning = true;
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });

      setTimeout(() => {
        const video = this.previewVideo?.nativeElement;
        if (!video || !this.mediaStream) {
          return;
        }

        video.srcObject = this.mediaStream;
        void video.play();
        this.startQrDetection(video);
      });
    } catch (error: any) {
      this.isScanning = false;
      this.isCameraOpen = false;
      await this.presentAlert(
        "Caméra indisponible",
        error?.message ||
          "Impossible d'ouvrir la caméra. Vérifiez les permissions.",
      );
    }
  }

  stopCamera(): void {
    if (this.scanTimer !== null) {
      window.clearInterval(this.scanTimer);
      this.scanTimer = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }

    this.scanCanvas = undefined;
    this.scanContext = undefined;
    this.isCameraOpen = false;
    this.isScanning = false;
  }

  async submitManualToken(): Promise<void> {
    if (!(await this.ensureSelectedSeanceIsReady())) {
      return;
    }

    const tokenQRCode = this.manualToken.trim();
    if (!tokenQRCode) {
      await this.presentAlert(
        "QR Code manquant",
        "Veuillez renseigner le token QR de secours.",
      );
      return;
    }

    await this.submitToken(tokenQRCode);
  }

  formatSeanceLabel(seance: Seance): string {
    return `${seance.dateCours} • ${this.formatTime(seance.heureDebutReelle)} - ${this.formatTime(
      seance.heureFinReelle,
    )} • ${seance.statut}`;
  }

  hasCahierForSeance(seance: Seance | null): boolean {
    if (!seance?.id) {
      return false;
    }

    return (
      !!seance.ficheProgressionId ||
      this.fichesProgression.some((fiche) => fiche.seanceId === seance.id)
    );
  }

  private startQrDetection(video: HTMLVideoElement): void {
    this.scanCanvas = document.createElement("canvas");
    this.scanContext = this.scanCanvas.getContext("2d", {
      willReadFrequently: true,
    });

    this.scanTimer = window.setInterval(async () => {
      if (
        !this.isScanning ||
        !this.scanCanvas ||
        !this.scanContext ||
        video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA
      ) {
        return;
      }

      const width = video.videoWidth;
      const height = video.videoHeight;
      if (!width || !height) {
        return;
      }

      this.scanCanvas.width = width;
      this.scanCanvas.height = height;
      this.scanContext.drawImage(video, 0, 0, width, height);

      const imageData = this.scanContext.getImageData(0, 0, width, height);
      const qrCode = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "attemptBoth",
      });

      const token = qrCode?.data?.trim();
      if (token) {
        this.stopCamera();
        await this.submitToken(token);
      }
    }, 250);
  }

  private async ensureSelectedSeanceIsReady(): Promise<boolean> {
    if (!this.selectedSeance) {
      await this.presentAlert(
        "Séance requise",
        "Veuillez sélectionner la séance concernée.",
      );
      return false;
    }

    return true;
  }

  private async submitToken(tokenQRCode: string): Promise<void> {
    this.isScanning = true;

    try {
      const position = await this.getCurrentPosition();
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
            this.manualToken = "";
            const toast = await this.toastController.create({
              message:
                "Scan validé ✅ Remplissez maintenant la fiche de progression.",
              duration: 2500,
              color: "success",
              position: "top",
            });
            await toast.present();
            await this.router.navigate(["/tabs/tabs/tab3"], {
              queryParams: {
                seanceId: response.seanceId || this.selectedSeanceId,
                fromScan: true,
              },
            });
          },
          error: async (error) => {
            this.isScanning = false;
            await this.presentAlert(
              "Échec de l'émargement",
              this.getScanErrorMessage(error),
            );
          },
        });
    } catch (error: any) {
      this.isScanning = false;
      await this.presentAlert(
        "Position GPS indisponible",
        error?.message || "Impossible de récupérer votre position.",
      );
    }
  }

  private getScanErrorMessage(error: any): string {
    if (typeof error?.error === "string") {
      return error.error;
    }

    if (error.status === 400) {
      return (
        error?.error?.error || "QR Code invalide, expiré ou séance non trouvée."
      );
    }
    if (error.status === 409) {
      return "Vous avez déjà émargé pour cette séance.";
    }
    if (error.status === 403) {
      return "Hors périmètre autorisé pour l'émargement.";
    }

    return (
      error?.error?.error ||
      error?.error?.message ||
      "Erreur lors de l'émargement."
    );
  }

  private async getCurrentPosition(): Promise<{
    latitude: number;
    longitude: number;
    adresseApproximative: string;
  }> {
    try {
      const permissions = await Geolocation.checkPermissions();
      if (permissions.location !== "granted") {
        const requestedPermissions = await Geolocation.requestPermissions();
        if (requestedPermissions.location !== "granted") {
          throw new Error("Autorisation GPS refusée.");
        }
      }

      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      });

      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        adresseApproximative: "Position GPS du mobile",
      };
    } catch (error: any) {
      throw new Error(
        error?.message ||
          "Impossible de récupérer votre position GPS. Activez la localisation du téléphone et autorisez l'application.",
      );
    }
  }

  private formatTime(value?: string): string {
    return value ? value.substring(0, 5) : "--:--";
  }

  private toDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  private async presentAlert(header: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ["OK"],
    });
    await alert.present();
  }
}
