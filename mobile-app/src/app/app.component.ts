import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { 
  schoolOutline, 
  qrCodeOutline, 
  bookOutline, 
  logOutOutline, 
  homeOutline,
  personOutline,
  lockClosedOutline,
  scanOutline,
  timeOutline,
  checkmarkCircle,
  time,
  closeCircleOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, RouterLink, RouterLinkActive, CommonModule],
})
export class AppComponent {
  public appPages = [
    { title: 'Accueil', url: '/home', icon: 'home-outline' },
    { title: 'Scanner QR Code', url: '/scan', icon: 'qr-code-outline' },
    { title: 'Cahier de Textes', url: '/lesson-entry', icon: 'book-outline' },
  ];

  constructor() {
    addIcons({ 
      schoolOutline, 
      qrCodeOutline, 
      bookOutline, 
      logOutOutline, 
      homeOutline,
      personOutline,
      lockClosedOutline,
      scanOutline,
      timeOutline,
      checkmarkCircle,
      time,
      closeCircleOutline
    });
  }
}
