import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonText,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  scanOutline,
  cameraOutline,
  alertCircleOutline,
  checkmarkCircleOutline,
  timeOutline,
  locationOutline,
  arrowBackOutline,
} from 'ionicons/icons';
import { SeanceService } from '../seance.service';
import { EmargementService } from '../core/services/emargement.service';
import { AlertController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-scan-qr',
  templateUrl: 'scan-qr.page.html',
  styleUrls: ['scan-qr.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonText,
  ],
})
export class ScanQRPage {
  private seanceService = inject(SeanceService);
  private emargementService = inject(EmargementService);
  private alertController = inject(AlertController);
  private toastController = inject(ToastController);
  private router = inject(Router);

  isScanning = false;

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

  async openScanner() {
    if (!this.seanceService.isCahierFait) {
      const alert = await this.alertController.create({
        header: 'Action Bloquée',
        subHeader: 'Cahier de Textes manquant',
        message: 'Vous ne pouvez pas émarger sans avoir d\'abord saisi le contenu de votre séance dans le Cahier de Textes.',
        buttons: [
          {
            text: 'Plus tard',
            role: 'cancel'
          },
          {
            text: 'Remplir le cahier',
            handler: () => {
              this.router.navigate(['/tabs/tabs/tab4']);
            }
          }
        ]
      });

      await alert.present();
      return;
    }

    // Simulation d'un scan de QR Code
    // Dans une vraie app, on utiliserait @capacitor-mlkit/barcode-scanning ou un plugin similaire
    this.isScanning = true;

    // Simulation du résultat de scan
    const tokenQRSimule = 'QR-' + Date.now();
    const latitude = 12.6392; // Exemple: Bamako
    const longitude = -8.0029;
    const adresseApproximative = 'Bamako, Mali';

    this.emargementService.scanQRCode({
      tokenQRCode: tokenQRSimule,
      latitude,
      longitude,
      adresseApproximative,
    }).subscribe({
      next: async (response) => {
        this.isScanning = false;
        const toast = await this.toastController.create({
          message: `Émargement ${response.statut === 'VALIDE' ? 'validé ✅' : 'enregistré (' + response.statut + ')'}`,
          duration: 3000,
          color: response.statut === 'VALIDE' ? 'success' : 'warning',
          position: 'top',
        });
        await toast.present();
      },
      error: async (error) => {
        this.isScanning = false;

        let message = 'Erreur lors de l\'émargement.';
        if (error.status === 400) {
          message = 'QR Code invalide ou séance non trouvée.';
        } else if (error.status === 409) {
          message = 'Vous avez déjà émargé pour cette séance.';
        } else if (error.status === 403) {
          message = 'Hors périmètre autorisé pour l\'émargement.';
        }

        const alert = await this.alertController.create({
          header: 'Échec de l\'émargement',
          message,
          buttons: ['OK'],
        });
        await alert.present();
      },
    });
  }
}
