import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
  IonCard,
  IonBadge,
  IonList,
  IonSegment,
  IonSegmentButton,
  IonLabel,
} from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import {
  calendarOutline,
  timeOutline,
  peopleOutline,
  documentTextOutline,
  checkmarkDoneOutline,
  eyeOutline,
  arrowDownOutline,
  arrowBackOutline,
} from "ionicons/icons";

@Component({
  selector: "app-historique",
  templateUrl: "historique.page.html",
  styleUrls: ["historique.page.scss"],
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonIcon,
    IonCard,
    IonBadge,
    IonList,
    IonSegment,
    IonSegmentButton,
    IonLabel,
  ],
})
export class HistoriquePage {
  filterPeriod = "all";

  stats = {
    seancesCompletees: 42,
    moyennePresence: 89,
  };

  seances = [
    {
      id: 1,
      matiere: "Algorithmique",
      date: new Date("2024-01-15"),
      heure: "08:00 - 10:00",
      contenu:
        "Introduction aux algorithmes de tri: tri à bulles, tri par insertion, tri par sélection.",
      status: "completed",
      presents: 45,
      total: 50,
      duree: 120,
    },
    {
      id: 2,
      matiere: "Java",
      date: new Date("2024-01-16"),
      heure: "14:00 - 16:00",
      contenu:
        "Programmation orientée objet: concepts de base, classes et objets.",
      status: "completed",
      presents: 48,
      total: 50,
      duree: 120,
    },
    {
      id: 3,
      matiere: "Bases de données",
      date: new Date("2024-01-17"),
      heure: "10:00 - 12:00",
      contenu: "Modèle relationnel, algèbre relationnelle et SQL de base.",
      status: "completed",
      presents: 47,
      total: 50,
      duree: 120,
    },
    {
      id: 4,
      matiere: "Algorithmique",
      date: new Date("2024-01-18"),
      heure: "08:00 - 10:00",
      contenu: "Algorithmes de tri avancés: tri rapide, tri fusion.",
      status: "completed",
      presents: 46,
      total: 50,
      duree: 120,
    },
    {
      id: 5,
      matiere: "Java",
      date: new Date("2024-01-19"),
      heure: "14:00 - 16:00",
      contenu: "Héritage et polymorphisme en Java.",
      status: "in_progress",
      presents: 0,
      total: 50,
      duree: 120,
    },
  ];

  get filteredSeances() {
    if (this.filterPeriod === "all") {
      return this.seances;
    }

    const now = new Date();
    const cutoff = new Date();

    if (this.filterPeriod === "week") {
      cutoff.setDate(now.getDate() - 7);
    } else if (this.filterPeriod === "month") {
      cutoff.setMonth(now.getMonth() - 1);
    }

    return this.seances.filter((s) => s.date >= cutoff);
  }

  constructor() {
    addIcons({
      calendarOutline,
      timeOutline,
      peopleOutline,
      documentTextOutline,
      checkmarkDoneOutline,
      eyeOutline,
      arrowDownOutline,
      arrowBackOutline,
    });
  }

  filterByPeriod() {
    // Filtrage déjà géré par le getter filteredSeances
  }
}
