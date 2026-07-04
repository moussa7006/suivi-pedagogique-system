import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonBadge,
  IonButton,
  IonContent,
  IonIcon,
  IonLabel,
  IonRefresher,
  IonRefresherContent,
  IonSegment,
  IonSegmentButton,
  IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  calendarOutline,
  cashOutline,
  chevronDownOutline,
  chevronUpOutline,
  timeOutline,
  walletOutline,
  arrowBackOutline,
} from 'ionicons/icons';
import { finalize } from 'rxjs';
import { HonorairesCalcul } from '../core/models/honoraires.model';
import { HonorairesService } from '../core/services/honoraires.service';

@Component({
  selector: 'app-honoraires',
  templateUrl: 'honoraires.page.html',
  styleUrls: ['honoraires.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonContent,
    IonIcon,
    IonButton,
    IonBadge,
    IonLabel,
    IonSegment,
    IonSegmentButton,
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
  errorMessage = '';

  // Filtre par periode : 'all' | 'current' | 'previous'
  filterPeriod: 'all' | 'current' | 'previous' = 'all';

  constructor() {
    addIcons({
      calendarOutline,
      cashOutline,
      chevronDownOutline,
      chevronUpOutline,
      timeOutline,
      walletOutline,
      arrowBackOutline,
    });
  }

  get totalMontant(): number {
    return this.filteredHonoraires.reduce(
      (sum, item) => sum + (item.montantBrut || 0),
      0,
    );
  }

  get totalHeures(): number {
    return this.filteredHonoraires.reduce(
      (sum, item) => sum + (item.totalHeures || 0),
      0,
    );
  }

  /**
   * Retourne les honoraires filtrés selon la periode choisie.
   * - all      : tous les mois disponibles
   * - current  : mois en cours (YYYY-MM courant)
   * - previous : tous les mois antérieurs au mois en cours
   */
  get filteredHonoraires(): HonorairesCalcul[] {
    if (this.filterPeriod === 'all') {
      return this.honoraires;
    }
    const currentMonth = this.currentMonthKey();
    if (this.filterPeriod === 'current') {
      return this.honoraires.filter(
        (item) => this.normalizeMonthKey(item.mois) === currentMonth,
      );
    }
    // previous
    return this.honoraires.filter(
      (item) => this.normalizeMonthKey(item.mois) < currentMonth,
    );
  }

  private currentMonthKey(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  /**
   * Normalise une valeur de mois (ex: "2026-07" ou "2026-07-01")
   * vers une cle "YYYY-MM" comparable lexicographiquement.
   */
  private normalizeMonthKey(value?: string): string {
    if (!value) return '';
    const s = value.trim();
    // Accepte YYYY-MM ou YYYY-MM-DD
    return s.length >= 7 ? s.substring(0, 7) : s;
  }

  ngOnInit(): void {
    this.loadHonoraires();
  }

  ionViewWillEnter(): void {
    this.loadHonoraires();
  }

  loadHonoraires(event?: CustomEvent): void {
    this.loading = !event;
    this.errorMessage = '';

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
            'Impossible de charger vos honoraires.';
        },
      });
  }

  toggleDetails(item: HonorairesCalcul): void {
    this.expandedId = this.expandedId === item.id ? null : item.id || null;
  }

  getStatutLabel(statut?: string): string {
    const labels: Record<string, string> = {
      BROUILLON: 'EN ATTENTE',
      VALIDE: 'VALIDÉ',
      PAYE: 'PAYÉ',
    };
    return statut ? labels[statut] || statut : '-';
  }

  getStatusClass(statut?: string): string {
    // On garde une classe stable basee sur le statut backend ;
    // le style "EN ATTENTE" reutilise le visuel brouillon (ambre).
    return `badge-${(statut || 'BROUILLON').toLowerCase()}`;
  }

  formatMonth(value?: string): string {
    if (!value) return 'Mois non défini';
    return new Intl.DateTimeFormat('fr-FR', {
      month: 'long',
      year: 'numeric',
    }).format(new Date(value));
  }

  formatDate(value?: string): string {
    if (!value) return '-';
    return new Intl.DateTimeFormat('fr-FR').format(new Date(value));
  }

  private sortHonoraires(items: HonorairesCalcul[]): HonorairesCalcul[] {
    return [...items]
      .map((item) => ({
        ...item,
        detailsHonoraires: [...(item.detailsHonoraires || [])].sort((a, b) => {
          const aKey = `${a.dateCours || ''} ${a.matiereLibelle || ''} ${a.classeLibelle || ''} ${a.seanceId || ''}`;
          const bKey = `${b.dateCours || ''} ${b.matiereLibelle || ''} ${b.classeLibelle || ''} ${b.seanceId || ''}`;
          return this.compareAlphaNumeric(aKey, bKey);
        }),
      }))
      .sort((a, b) => {
        const aKey = `${a.mois || ''} ${a.enseignantNomPrenom || ''} ${a.id || ''}`;
        const bKey = `${b.mois || ''} ${b.enseignantNomPrenom || ''} ${b.id || ''}`;
        return this.compareAlphaNumeric(aKey, bKey);
      });
  }

  private compareAlphaNumeric(a: string, b: string): number {
    return a.localeCompare(b, 'fr', { numeric: true, sensitivity: 'base' });
  }

  formatTime(value?: string): string {
    return value ? value.substring(0, 5) : '--:--';
  }
}
