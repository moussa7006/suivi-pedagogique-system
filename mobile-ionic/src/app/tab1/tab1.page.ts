import { Component, inject, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonLabel,
  IonBadge,
} from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import {
  notificationsOutline,
  qrCodeOutline,
  bookOutline,
  calendarOutline,
  checkmarkDoneOutline,
  addCircleOutline,
  documentTextOutline,
  timeOutline,
  statsChartOutline,
  listOutline,
  settingsOutline,
  peopleOutline,
  alertCircleOutline,
} from "ionicons/icons";
import { SeanceService } from "../seance.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"],
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonIcon,
    IonLabel,
    IonBadge,
  ],
})
export class Tab1Page implements OnInit, OnDestroy {
  private router = inject(Router);
  private seanceService = inject(SeanceService);
  
  isCahierFait = false;
  private sub: Subscription | null = null;

  teacher = {
    firstName: "Alou",
    lastName: "Diarra",
  };

  constructor() {
    addIcons({
      notificationsOutline,
      qrCodeOutline,
      bookOutline,
      calendarOutline,
      checkmarkDoneOutline,
      addCircleOutline,
      documentTextOutline,
      timeOutline,
      statsChartOutline,
      listOutline,
      settingsOutline,
      peopleOutline,
      alertCircleOutline,
    });
  }

  ngOnInit() {
    this.sub = this.seanceService.isCahierFait$.subscribe(status => {
      this.isCahierFait = status;
    });
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

  navigateTo(path: string) {
    if (path.startsWith('/')) {
      this.router.navigateByUrl(path);
    } else {
      this.router.navigate([path]);
    }
  }
}
