import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonBadge,
  IonList,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  calendarOutline,
  timeOutline,
  locationOutline,
  arrowBackOutline,
  notificationsOutline,
  bookOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-planning',
  templateUrl: 'planning.page.html',
  styleUrls: ['planning.page.scss'],
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
    IonBadge,
    IonList,
  ],
})
export class PlanningPage {
  today = new Date();
  
  emploisDuTemps = [
    {
      matiere: 'Algorithmique Avancée',
      salle: 'Salle A102',
      horaire: '08:00 - 10:00',
      type: 'Cours Magistral',
      status: 'Prochainement'
    },
    {
      matiere: 'Programmation Java',
      salle: 'Labo Info 3',
      horaire: '10:15 - 12:15',
      type: 'Travaux Pratiques',
      status: 'Prochainement'
    },
    {
      matiere: 'Bases de Données',
      salle: 'Amphi B',
      horaire: '14:00 - 16:00',
      type: 'Cours Magistral',
      status: 'Après-midi'
    }
  ];

  constructor() {
    addIcons({
      calendarOutline,
      timeOutline,
      locationOutline,
      arrowBackOutline,
      notificationsOutline,
      bookOutline,
    });
  }
}
