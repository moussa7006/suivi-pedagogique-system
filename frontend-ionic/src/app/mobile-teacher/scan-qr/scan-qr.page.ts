import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  IonContent,
  IonButton,
  IonIcon,
  IonInput,
  ToastController,
  AlertController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  scanOutline,
  cameraOutline,
  alertCircleOutline,
  checkmarkCircleOutline,
  locationOutline,
  arrowBackOutline,
  stopCircleOutline,
  calendarOutline,
  radioButtonOn,
  radioButtonOff,
  checkmarkCircle,
  ellipseOutline,
  bookOutline,
  peopleOutline,
  timeOutline,
} from 'ionicons/icons';
import { Geolocation } from '@capacitor/geolocation';
import jsQR from 'jsqr';
import { forkJoin } from 'rxjs';
import { EmargementService } from '../../core/services/emargement.service';
import { FicheProgressionService } from '../../core/services/fiche-progression.service';
import { ScheduleService } from '../../core/services/schedule.service';
import { MatiereService } from '../../core/services/matiere.service';
import { ClasseService } from '../../core/services/classe.service';
import { SalleService } from '../../core/services/salle.service';
import { FicheProgression } from '../../core/models/fiche-progression.model';
import { Seance } from '../../core/models/seance.model';
import { EmploiDuTemps } from '../../core/models/schedule.model';
import { Matiere } from '../../core/models/matiere.model';
import { Classe } from '../../core/models/classe.model';
import { Salle } from '../../core/models/salle.model';
import { StatutSeance } from '../../core/models/enums';

interface SeanceDisplay extends Seance {
  matiereLibelle?: string;
  classeLibelle?: string;
  salleLibelle?: string;
}

@Component({
  selector: 'app-scan-qr',
  templateUrl: 'scan-qr.page.html',
  styleUrls: ['scan-qr.page.scss'],
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
export class ScanQRPage implements OnDestroy {
  @ViewChild('previewVideo') previewVideo?: ElementRef<HTMLVideoElement>;
  @ViewChild('seanceGroup') seanceGroup?: ElementRef<HTMLElement>;

  private readonly emargementService = inject(EmargementService);
  private readonly ficheProgressionService = inject(FicheProgressionService);
  private readonly scheduleService = inject(ScheduleService);
  private readonly matiereService = inject(MatiereService);
  private readonly classeService = inject(ClasseService);
  private readonly salleService = inject(SalleService);
  private readonly alertController = inject(AlertController);
  private readonly toastController = inject(ToastController);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);

  isScanning = false;
  isCameraOpen = false;
  isLoading = false;
  manualToken = '';
  selectedSeanceId: number | null = null;
  seances: SeanceDisplay[] = [];
  fichesProgression: FicheProgression[] = [];
  cameraSupported = true;
  seanceRequiredError = false;

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
      radioButtonOn,
      radioButtonOff,
      checkmarkCircle,
      ellipseOutline,
      bookOutline,
      peopleOutline,
      timeOutline,
    });

    this.loadData();
  }

  ngOnDestroy(): void {
    this.stopCamera();
  }

  get selectedSeance(): SeanceDisplay | null {
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
      emplois: this.scheduleService.getEmploisDuTemps(),
      matieres: this.matiereService.getAll(),
      classes: this.classeService.getAll(),
      salles: this.salleService.getAll(),
    }).subscribe({
      next: ({ seances, fiches, emplois, matieres, classes, salles }) => {
        this.seances = (seances || [])
          .filter((seance) => this.isTodaySeance(seance))
          .map((seance) =>
            this.enrichSeance(seance, emplois, matieres, classes, salles),
          );
        this.fichesProgression = fiches || [];
        this.selectedSeanceId = this.resolveInitialSeanceId(this.seances);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: async () => {
        this.isLoading = false;
        this.cdr.detectChanges();
        await this.presentAlert(
          'Chargement impossible',
          'Impossible de charger les séances.',
        );
      },
    });
  }

  private enrichSeance(
    seance: Seance,
    emplois: EmploiDuTemps[],
    matieres: Matiere[],
    classes: Classe[],
    salles: Salle[],
  ): SeanceDisplay {
    const emploi = emplois.find((e) => e.id === seance.emploiDuTempsId);
    const matiere = matieres.find((m) => m.id === emploi?.matiereId);
    const classe = classes.find(
      (c) => c.id === (seance.classeId ?? emploi?.classeId),
    );
    const salle = salles.find(
      (s) => s.id === (seance.salleId ?? emploi?.salleId),
    );

    return {
      ...seance,
      matiereLibelle: matiere?.libelle,
      classeLibelle: classe?.libelle,
      salleLibelle: salle
        ? `${salle.nom}${salle.batiment ? ' · ' + salle.batiment : ''}`
        : undefined,
    };
  }

  private resolveInitialSeanceId(seances: SeanceDisplay[]): number | null {
    const seanceIdFromRoute = Number(
      this.route.snapshot.queryParamMap.get('seanceId'),
    );

    if (seanceIdFromRoute && seances.some((s) => s.id === seanceIdFromRoute)) {
      return seanceIdFromRoute;
    }

    if (this.selectedSeanceId) {
      return this.selectedSeanceId;
    }

    const todaysSeanceWithQr = seances.find((seance) => !!seance.qrCodeId);
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
      this.cdr.detectChanges();
      await this.presentAlert(
        'Caméra non supportée',
        "La caméra n'est pas disponible dans cet environnement. Utilisez temporairement le champ de secours.",
      );
      return;
    }

    try {
      this.cameraSupported = true;
      this.isCameraOpen = true;
      this.isScanning = true;
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      this.cdr.detectChanges();

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
      this.cdr.detectChanges();
      await this.presentAlert(
        'Caméra indisponible',
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
    this.cdr.detectChanges();
  }

  async submitManualToken(): Promise<void> {
    if (!(await this.ensureSelectedSeanceIsReady())) {
      return;
    }


    const tokenQRCode = this.manualToken.trim();
    if (!tokenQRCode) {
      await this.presentAlert(
        'QR Code manquant',
        'Veuillez renseigner le token QR de secours.',
      );
      return;
    }

    await this.submitToken(tokenQRCode);
  }

  statutLabel(statut?: string): string {
    const labels: Record<string, string> = {
      PREVUE: 'Prévue',
      EN_COURS: 'En cours',
      TERMINEE: 'Terminée',
      ANNULEE: 'Annulée',
    };

    return statut ? labels[statut] ?? statut : 'Non défini';
  }

  formatSeanceLabel(seance: SeanceDisplay): string {
    return `${seance.dateCours} • ${this.formatTime(seance.heureDebutReelle)} - ${this.formatTime(
      seance.heureFinReelle,
    )} • ${seance.statut}`;
  }

  hasCahierForSeance(seance: SeanceDisplay | null): boolean {
    if (!seance?.id) {
      return false;
    }

    return (
      !!seance.ficheProgressionId ||
      this.fichesProgression.some((fiche) => fiche.seanceId === seance.id)
    );
  }


  private startQrDetection(video: HTMLVideoElement): void {
    this.scanCanvas = document.createElement('canvas');
    this.scanContext = this.scanCanvas.getContext('2d', {
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
        inversionAttempts: 'attemptBoth',
      });

      const token = qrCode?.data?.trim();
      if (token) {
        this.stopCamera();
        await this.submitToken(token);
      }
    }, 250);
  }

  private async ensureSelectedSeanceIsReady(): Promise<boolean> {
    if (this.selectedSeance) {
      this.seanceRequiredError = false;
      return true;
    }
    if (this.seances.length === 0) {
      await this.presentToast(
        "Aucune séance n'est prévue aujourd'hui.",
        'warning',
      );
      return false;
    }

    this.triggerSeanceRequiredError();
    return false;
  }

  private triggerSeanceRequiredError(): void {
    this.seanceRequiredError = true;
    this.cdr.detectChanges();
    this.scrollToSeanceSelect();
  }

  private scrollToSeanceSelect(): void {
    // Petit délai pour laisser la bannière d'erreur s'afficher avant de scroller.
    window.setTimeout(() => {
      this.seanceGroup?.nativeElement?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }, 80);
  }

  selectSeance(id: number | undefined): void {
    this.selectedSeanceId = id ?? null;
    this.seanceRequiredError = false;
  }

  private async presentToast(
    message: string,
    color: 'success' | 'warning' | 'danger' = 'danger',
  ): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2500,
      color,
      position: 'top',
    });
    await toast.present();
  }

  private async submitToken(tokenQRCode: string): Promise<void> {
    if (!(await this.ensureTokenMatchesSelectedSeance(tokenQRCode))) {
      return;
    }

    this.isScanning = true;
    this.cdr.detectChanges();

    try {
      const position = await this.getCurrentPosition();
      this.emargementService
        .scanQRCode({
          seanceId: this.selectedSeance!.id!,
          tokenQRCode,
          latitude: position.latitude,
          longitude: position.longitude,
          adresseApproximative: position.adresseApproximative,
        })
        .subscribe({
          next: async (response) => {
            this.isScanning = false;
            this.manualToken = '';
            this.cdr.detectChanges();
            const toast = await this.toastController.create({
              message: 'Émargement validé ✅ Vous pouvez maintenant remplir la fiche de progression.',
              duration: 2500,
              color: 'success',
              position: 'top',
            });
            await toast.present();
            await this.router.navigate(['/mobile/cahier-textes'], {
              queryParams: {
                seanceId: response.seanceId || this.selectedSeanceId,
                emargementId: response.emargementId,
                fromScan: true,
              },
            });
          },
          error: async (error) => {
            this.isScanning = false;
            this.cdr.detectChanges();
            await this.presentAlert(
              "Échec de l'émargement",
              this.getScanErrorMessage(error),
            );
          },
        });
    } catch (error: any) {
      this.isScanning = false;
      this.cdr.detectChanges();
      await this.presentAlert(
        'Position GPS indisponible',
        error?.message || 'Impossible de récupérer votre position.',
      );
    }
  }

  private async ensureTokenMatchesSelectedSeance(
    tokenQRCode: string,
  ): Promise<boolean> {
    const selectedSeance = this.selectedSeance;
    if (!selectedSeance?.id) {
      this.triggerSeanceRequiredError();
      return false;
    }

    if (
      selectedSeance.qrCodeToken &&
      selectedSeance.qrCodeToken.trim() !== tokenQRCode.trim()
    ) {
      await this.presentAlert(
        'QR Code non correspondant',
        "Le QR Code scanné n'appartient pas à la séance sélectionnée. Veuillez sélectionner la bonne séance ou scanner le QR Code correspondant.",
      );
      return false;
    }

    return true;
  }

  private getScanErrorMessage(error: any): string {
    if (typeof error?.error === 'string') {
      return error.error;
    }

    if (error.status === 400) {
      return (
        error?.error?.error || 'QR Code invalide, expiré ou séance non trouvée.'
      );
    }
    if (error.status === 409) {
      return 'Vous avez déjà émargé pour cette séance.';
    }
    if (error.status === 403) {
      return "Émargement non autorisé.";
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
      if (permissions.location !== 'granted') {
        const requestedPermissions = await Geolocation.requestPermissions();
        if (requestedPermissions.location !== 'granted') {
          throw new Error('Autorisation GPS refusée.');
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
        adresseApproximative: 'Position GPS du mobile',
      };
    } catch (error: any) {
      throw new Error(
        error?.message ||
          "Impossible de récupérer votre position GPS. Activez la localisation du téléphone et autorisez l'application.",
      );
    }
  }

  formatTime(value?: string): string {
    return value ? value.substring(0, 5) : '--:--';
  }

  private isTodaySeance(seance: Seance): boolean {
    return (
      this.toDateKeyFromValue(seance.dateCours) === this.toDateKey(new Date())
    );
  }

  private toDateKeyFromValue(value: unknown): string {
    if (!value) {
      return '';
    }

    if (typeof value === 'string') {
      return value.slice(0, 10);
    }

    if (Array.isArray(value) && value.length >= 3) {
      const year = Number(value[0]);
      const month = String(Number(value[1])).padStart(2, '0');
      const day = String(Number(value[2])).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    return '';
  }

  private toDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private async presentAlert(header: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
