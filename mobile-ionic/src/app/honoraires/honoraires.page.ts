import { CommonModule } from "@angular/common";
import { Component, OnInit, inject } from "@angular/core";
import {
  IonBadge,
  IonButton,
  IonContent,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
} from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import {
  calendarOutline,
  cashOutline,
  chevronDownOutline,
  chevronUpOutline,
  timeOutline,
  walletOutline,
} from "ionicons/icons";
import { finalize } from "rxjs";
import { HonorairesCalcul } from "../core/models/honoraires.model";
import { HonorairesService } from "../core/services/honoraires.service";

@Component({
  selector: "app-honoraires",
  templateUrl: "honoraires.page.html",
  styleUrls: ["honoraires.page.scss"],
  imports: [
    CommonModule,
    IonContent,
    IonIcon,
    IonButton,
    IonBadge,
    IonSpinner,
    IonRefresher,
    IonRefresherContent,
  ],
})
export class HonorairesPage implements OnInit {
  private readonly honorairesService = inject(HonorairesService);

  honoraires: HonorairesCalcul[] = [];
  expandedId: number | null = null;
  loading = false;
  errorMessage = "";

  constructor() {
    addIcons({
      calendarOutline,
      cashOutline,
      chevronDownOutline,
      chevronUpOutline,
      timeOutline,
      walletOutline,
    });
  }

  get totalMontant(): number {
    return this.honoraires.reduce(
      (sum, item) => sum + (item.montantBrut || 0),
      0,
    );
  }

  get totalHeures(): number {
    return this.honoraires.reduce(
      (sum, item) => sum + (item.totalHeures || 0),
      0,
    );
  }

  ngOnInit(): void {
    this.loadHonoraires();
  }

  loadHonoraires(event?: CustomEvent): void {
    this.loading = !event;
    this.errorMessage = "";

    this.honorairesService
      .getMesHonoraires()
      .pipe(
        finalize(() => {
          this.loading = false;
          event?.target && (event.target as HTMLIonRefresherElement).complete();
        }),
      )
      .subscribe({
        next: (items) => {
          this.honoraires = this.sortHonoraires(items || []);
        },
        error: (error) => {
          this.errorMessage =
            error?.error?.message ||
            error?.error?.error ||
            "Impossible de charger vos honoraires.";
        },
      });
  }

  toggleDetails(item: HonorairesCalcul): void {
    this.expandedId = this.expandedId === item.id ? null : item.id || null;
  }

  getStatutLabel(statut?: string): string {
    const labels: Record<string, string> = {
      BROUILLON: "Brouillon",
      VALIDE: "Validé",
      PAYE: "Payé",
      ANNULE: "Annulé",
    };
    return statut ? labels[statut] || statut : "-";
  }

  getStatusClass(statut?: string): string {
    return `badge-${(statut || "BROUILLON").toLowerCase()}`;
  }

  formatMonth(value?: string): string {
    if (!value) return "Mois non défini";
    return new Intl.DateTimeFormat("fr-FR", {
      month: "long",
      year: "numeric",
    }).format(new Date(value));
  }

  formatDate(value?: string): string {
    if (!value) return "-";
    return new Intl.DateTimeFormat("fr-FR").format(new Date(value));
  }

  private sortHonoraires(items: HonorairesCalcul[]): HonorairesCalcul[] {
    return [...items]
      .map((item) => ({
        ...item,
        detailsHonoraires: [...(item.detailsHonoraires || [])].sort((a, b) => {
          const aKey = `${a.dateCours || ""} ${a.matiereLibelle || ""} ${a.classeLibelle || ""} ${a.seanceId || ""}`;
          const bKey = `${b.dateCours || ""} ${b.matiereLibelle || ""} ${b.classeLibelle || ""} ${b.seanceId || ""}`;
          return this.compareAlphaNumeric(aKey, bKey);
        }),
      }))
      .sort((a, b) => {
        const aKey = `${a.mois || ""} ${a.enseignantNomPrenom || ""} ${a.id || ""}`;
        const bKey = `${b.mois || ""} ${b.enseignantNomPrenom || ""} ${b.id || ""}`;
        return this.compareAlphaNumeric(aKey, bKey);
      });
  }

  private compareAlphaNumeric(a: string, b: string): number {
    return a.localeCompare(b, "fr", { numeric: true, sensitivity: "base" });
  }

  formatTime(value?: string): string {
    return value ? value.substring(0, 5) : "--:--";
  }
}
