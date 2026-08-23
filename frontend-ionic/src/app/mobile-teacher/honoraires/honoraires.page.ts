import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  IonModal,
  IonDatetime,
  IonPopover
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
  closeCircle,
  funnelOutline,
  checkmark
} from 'ionicons/icons';
import { finalize } from 'rxjs';
import { HonorairesCalcul } from '../../core/models/honoraires.model';
import { HonorairesService } from '../../core/services/honoraires.service';

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
    IonRefresher,
    IonRefresherContent,
    IonModal,
    IonDatetime,
    IonPopover
  ],
})
export class HonorairesPage implements OnInit {
  private readonly honorairesService = inject(HonorairesService);
  private readonly cdr = inject(ChangeDetectorRef);

  honoraires: HonorairesCalcul[] = [];
  expandedId: number | null = null;
  loading = false;
  errorMessage = '';

  // Filtre par periode : 'all' | 'current' | 'previous'
  filterPeriod: 'all' | 'current' | 'previous' = 'all';
  selectedDate = '';

  constructor() {
    addIcons({
      calendarOutline,
      cashOutline,
      chevronDownOutline,
      chevronUpOutline,
      timeOutline,
      walletOutline,
      arrowBackOutline,
      closeCircle,
      funnelOutline,
      checkmark
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
      return this.selectedDate
        ? this.filterHonorairesByDate(this.honoraires, this.selectedDate)
        : this.honoraires;
    }
    const currentMonth = this.currentMonthKey();
    const result =
      this.filterPeriod === 'current'
        ? this.honoraires.filter(
            (item) => this.normalizeMonthKey(item.mois) === currentMonth,
          )
        : this.honoraires.filter(
            (item) => this.normalizeMonthKey(item.mois) < currentMonth,
          );
    return result;
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

  onFilterPeriodChange(): void {
    if (this.filterPeriod !== 'all') {
      this.selectedDate = '';
    }
    this.cdr.detectChanges();
  }

  selectFilter(period: 'all' | 'current' | 'previous'): void {
    this.filterPeriod = period;
    this.onFilterPeriodChange();
  }

  get formattedSelectedMonth(): string {
    if (!this.selectedDate) return 'Sélectionner une date';
    const parts = this.selectedDate.split('-');
    if (parts.length < 3) return 'Sélectionner une date';
    const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  get selectedDatetime(): string | undefined {
    return this.selectedDate ? `${this.selectedDate}T00:00:00` : undefined;
  }

  onMonthSelect(event: any): void {
    const val = event.detail.value;
    if (val) {
      this.selectedDate = typeof val === 'string' ? val.substring(0, 10) : val[0].substring(0, 10);
      this.cdr.detectChanges();
    }
  }

  clearSelectedMonth(): void {
    this.selectedDate = '';
    this.cdr.detectChanges();
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
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (items) => {
          this.honoraires = this.sortHonoraires(items || []);
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.errorMessage =
            error?.error?.message ||
            error?.error?.error ||
            'Impossible de charger vos honoraires.';
          this.cdr.detectChanges();
        },
      });
  }

  toggleDetails(item: HonorairesCalcul): void {
    this.expandedId = this.expandedId === item.id ? null : item.id || null;
  }

  getStatutLabel(statut?: string): string {
    const labels: Record<string, string> = {
      VALIDE: 'VALIDÉ',
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

  private filterHonorairesByDate(
    items: HonorairesCalcul[],
    selectedDate: string,
  ): HonorairesCalcul[] {
    return items
      .map((item) => {
        const details = (item.detailsHonoraires || []).filter(
          (detail) =>
            (detail.dateCours || '').substring(0, 10) === selectedDate,
        );
        const totalHeures = details.reduce(
          (sum, detail) => sum + (detail.nombreHeures || 0),
          0,
        );
        const montantBrut = details.reduce(
          (sum, detail) => sum + (detail.montant || 0),
          0,
        );
        return {
          ...item,
          detailsHonoraires: details,
          totalHeures,
          montantBrut,
        };
      })
      .filter((item) => (item.detailsHonoraires || []).length > 0);
  }

  private sortHonoraires(items: HonorairesCalcul[]): HonorairesCalcul[] {
    return [...items]
      .map((item) => ({
        ...item,
        detailsHonoraires: [...(item.detailsHonoraires || [])].sort((a, b) => {
          const aKey = `${a.dateCours || ''} ${a.heureDebut || ''} ${a.matiereLibelle || ''} ${a.classeLibelle || ''} ${a.seanceId || ''}`;
          const bKey = `${b.dateCours || ''} ${b.heureDebut || ''} ${b.matiereLibelle || ''} ${b.classeLibelle || ''} ${b.seanceId || ''}`;
          return bKey.localeCompare(aKey, 'fr', {
            numeric: true,
            sensitivity: 'base',
          });
        }),
      }))
      .sort((a, b) => {
        const aKey = `${this.normalizeMonthKey(a.mois)} ${a.id || ''}`;
        const bKey = `${this.normalizeMonthKey(b.mois)} ${b.id || ''}`;
        return bKey.localeCompare(aKey, 'fr', {
          numeric: true,
          sensitivity: 'base',
        });
      });
  }

  formatTime(value?: string): string {
    return value ? value.substring(0, 5) : '--:--';
  }
}
