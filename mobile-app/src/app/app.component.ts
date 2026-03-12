import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IonicModule, MenuController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { AuthService, User } from './core/services/auth.service';
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
export class AppComponent implements OnInit {
  public appPages = [
    { title: 'Accueil', url: '/home', icon: 'home-outline' },
    { title: 'Scanner QR Code', url: '/scan', icon: 'qr-code-outline' },
    { title: 'Cahier de Textes', url: '/lesson-entry', icon: 'book-outline' },
  ];
  
  public user: User | null = null;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private menuCtrl: MenuController
  ) {
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

  ngOnInit() {
    this.authService.currentUser.subscribe(user => {
      this.user = user;
    });
  }

  async logout() {
    await this.menuCtrl.close(); // Ferme le menu avant de déconnecter
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
