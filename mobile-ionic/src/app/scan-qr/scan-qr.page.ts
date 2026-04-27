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
  private alertController = inject(AlertController);
  private router = inject(Router);

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

    console.log('Scanner ouvert avec succès !');
  }
}
