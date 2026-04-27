import { Component } from "@angular/core";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonToggle,
  IonSpinner,
} from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import {
  listOutline,
  calendarOutline,
  qrCodeOutline,
  settingsOutline,
  stopCircleOutline,
  refreshOutline,
  scanOutline,
  bookOutline,
  timeOutline,
  locationOutline,
} from "ionicons/icons";

@Component({
  selector: "app-tab3",
  templateUrl: "tab3.page.html",
  styleUrls: ["tab3.page.scss"],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonMenuButton,
    IonButton,
    IonIcon,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonInput,
    IonToggle,
    IonSpinner,
  ],
})
export class Tab3Page {
  constructor() {
    addIcons({
      listOutline,
      calendarOutline,
      qrCodeOutline,
      settingsOutline,
      stopCircleOutline,
      refreshOutline,
      scanOutline,
      bookOutline,
      timeOutline,
      locationOutline,
    });
  }
}
