import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonContent,
  IonButton,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonModal,
  IonDatetime
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  calendarOutline,
  timeOutline,
  peopleOutline,
  documentTextOutline,
  checkmarkDoneOutline,
  eyeOutline,
  arrowDownOutline,
  arrowBackOutline,
  checkmarkCircleOutline,
  calendarClearOutline,
  closeCircle,
  hourglassOutline,
  checkmark,
  ellipsisHorizontal,
  calendar,
  alertCircleOutline
} from 'ionicons/icons';
import { catchError, forkJoin, from, of, take, firstValueFrom } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { ScheduleService } from '../../core/services/schedule.service';
import { EmargementService } from '../../core/services/emargement.service';
import { FicheProgressionService } from '../../core/services/fiche-progression.service';
import { MatiereService } from '../../core/services/matiere.service';
import { Seance } from '../../core/models/seance.model';
import { Emargement as EmargementModel } from '../../core/models/attendance.model';
import { FicheProgression } from '../../core/models/fiche-progression.model';
import { Matiere } from '../../core/models/matiere.model';
import { EmploiDuTemps } from '../../core/models/schedule.model';

interface HistoriqueItem {
  id?: number;
  matiere: string;
  date: Date;
  heure: string;
  contenu: string;
  status: 'completed' | 'in_progress' | 'planned';
  presents: number;
  total: number;
  duree: number;
}

@Component({
  selector: 'app-historique',
  templateUrl: 'historique.page.html',
  styleUrls: ['historique.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonContent,
    IonButton,
    IonIcon,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonModal,
    IonDatetime
  ],
})
export class HistoriquePage implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly scheduleService = inject(ScheduleService);
  private readonly emargementService = inject(EmargementService);
  private readonly ficheProgressionService = inject(FicheProgressionService);
  private readonly matiereService = inject(MatiereService);
  private readonly cdr = inject(ChangeDetectorRef);

  filterPeriod = 'all';
  selectedDate = '';
  isLoading = false;
  errorMessage = '';

  stats = {
    seancesCompletees: 0,
    seancesEmargees: 0,
    dureeTotale: 0,
  };

  seances: HistoriqueItem[] = [];
  private seancesData: Seance[] = [];
  private emargementsData: EmargementModel[] = [];
  private fichesProgression: FicheProgression[] = [];
  private matieres: Matiere[] = [];
  private emploisDuTemps: EmploiDuTemps[] = [];
  private currentTeacherId?: number;
  private currentTeacherName = '';

  get filteredSeances(): HistoriqueItem[] {
    const now = new Date();
    now.setHours(23, 59, 59, 999);

    let result = this.seances.filter(
      (s) => s.date <= now && s.status !== 'planned',
    );

    if (this.filterPeriod === 'all') {
      if (this.selectedDate) {
        result = result.filter(
          (s) => this.toDateKey(s.date) === this.selectedDate,
        );
      }
      return result;
    }

    const cutoff = new Date();
    if (this.filterPeriod === 'week') {
      cutoff.setDate(now.getDate() - 7);
    } else if (this.filterPeriod === 'month') {
      cutoff.setMonth(now.getMonth() - 1);
    }

    return result.filter((s) => s.date >= cutoff);
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
      checkmarkCircleOutline,
      calendarClearOutline,
      closeCircle,
      hourglassOutline,
      checkmark,
      ellipsisHorizontal,
      calendar,
      alertCircleOutline
    });
  }

  ngOnInit(): void {
    this.loadHistorique();
  }

  ionViewWillEnter(): void {
    this.loadHistorique();
  }

  filterByPeriod(): void {
    if (this.filterPeriod !== 'all') {
      this.selectedDate = '';
    }
    // Filtrage géré par le getter filteredSeances.
    this.cdr.detectChanges();
  }

  private async loadHistorique(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    try {
      // On utilise Promise.all pour charger en parallèle
      // firstValueFrom garantit qu'on prend la 1ere valeur émise (même si l'observable ne se complète pas).
      const [user, seances, emplois, emargements, fiches, matieres] = await Promise.all([
        firstValueFrom(this.authService.getMe().pipe(catchError(() => from(this.authService.getUser()))).pipe(catchError(() => of(null)))),
        firstValueFrom(this.scheduleService.getSeances().pipe(catchError(() => of([])))),
        firstValueFrom(this.scheduleService.getEmploisDuTemps().pipe(catchError(() => of([])))),
        firstValueFrom(this.emargementService.getEmargements().pipe(catchError(() => of([])))),
        firstValueFrom(this.ficheProgressionService.getFichesProgression().pipe(catchError(() => of([])))),
        firstValueFrom(this.matiereService.getAll().pipe(catchError(() => of([]))))
      ]);

      this.currentTeacherId = user?.id;
      this.currentTeacherName = `${user?.prenom || ''} ${user?.nom || ''}`.trim().toLowerCase();
      
      this.seancesData = this.filterTeacherSeances(seances || []);
      this.emargementsData = this.filterTeacherEmargements(emargements || []);
      this.fichesProgression = this.filterTeacherFiches(fiches || []);
      this.emploisDuTemps = emplois || [];
      this.matieres = matieres || [];
      
      this.buildHistorique();
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique', error);
      this.seancesData = [];
      this.emargementsData = [];
      this.fichesProgression = [];
      this.matieres = [];
      this.emploisDuTemps = [];
      this.buildHistorique();
      this.errorMessage = "Impossible de charger l'historique complètement.";
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  private buildHistorique(): void {
    this.seances = this.seancesData
      .map((seance) => {
        const fiche = this.findFicheForSeance(seance);
        const emargement = this.findEmargementForSeance(seance);
        const duree = this.calculerDureeMinutes(
          seance.heureDebutReelle,
          seance.heureFinReelle,
        );

        return {
          id: seance.id,
          matiere: this.getMatiereLabel(seance, fiche),
          date: this.parseDate(seance.dateCours),
          heure: `${this.formatTime(seance.heureDebutReelle)} - ${this.formatTime(seance.heureFinReelle)}`,
          contenu: this.getContenuSeance(seance, fiche, emargement),
          status: this.mapStatus(seance.statut, fiche, emargement),
          presents: emargement ? 1 : 0,
          total: 1,
          duree,
        };
      })
      .sort((a, b) => {
        const dateCompare = b.date.getTime() - a.date.getTime();
        if (dateCompare !== 0) return dateCompare;
        return (
          this.toMinutes(b.heure.split(' - ')[0])! -
          this.toMinutes(a.heure.split(' - ')[0])!
        );
      });

    this.stats.seancesCompletees = this.seances.filter(
      (s) => s.status === 'completed',
    ).length;
    this.stats.seancesEmargees = this.seances.filter(
      (s) => s.presents > 0,
    ).length;
    this.stats.dureeTotale = this.seances.reduce(
      (total, seance) => total + seance.duree,
      0,
    );
  }

  private filterTeacherSeances(seances: Seance[]): Seance[] {
    if (!this.currentTeacherId) return seances;
    return seances.filter(
      (seance) =>
        !seance.enseignantId || seance.enseignantId === this.currentTeacherId,
    );
  }

  private filterTeacherEmargements(
    emargements: EmargementModel[],
  ): EmargementModel[] {
    if (!this.currentTeacherName) return emargements;
    return emargements.filter((emargement) => {
      const name = (emargement.enseignantNomPrenom || '').toLowerCase();
      return (
        !name ||
        name.includes(this.currentTeacherName) ||
        this.currentTeacherName.includes(name)
      );
    });
  }

  private filterTeacherFiches(fiches: FicheProgression[]): FicheProgression[] {
    if (!this.currentTeacherName) return fiches;
    return fiches.filter((fiche) => {
      const name = (fiche.enseignantNomPrenom || '').toLowerCase();
      return (
        !name ||
        name.includes(this.currentTeacherName) ||
        this.currentTeacherName.includes(name)
      );
    });
  }

  private findFicheForSeance(seance: Seance): FicheProgression | undefined {
    return this.fichesProgression.find(
      (fiche) =>
        fiche.seanceId === seance.id || fiche.id === seance.ficheProgressionId,
    );
  }

  private findEmargementForSeance(seance: Seance): EmargementModel | undefined {
    const byId = this.emargementsData.find(
      (emargement) => emargement.id === seance.emargementId,
    );
    if (byId) return byId;

    const seanceDate = this.parseDate(seance.dateCours)
      .toISOString()
      .substring(0, 10);
    return this.emargementsData.find((emargement) => {
      const scanDate = (emargement.dateHeureScan || '').substring(0, 10);
      return (
        scanDate === seanceDate &&
        emargement.heureSeance?.includes(
          this.formatTime(seance.heureDebutReelle),
        )
      );
    });
  }

  private getMatiereLabel(seance: Seance, fiche?: FicheProgression): string {
    if (fiche?.matiereLibelle) return fiche.matiereLibelle;

    const emploi = this.emploisDuTemps.find(
      (item) => item.id === seance.emploiDuTempsId,
    );
    const emploiMatiereLabel =
      (emploi as any)?.matiereLibelle ||
      (emploi as any)?.matiereNom ||
      (emploi as any)?.matiere?.libelle;
    if (emploiMatiereLabel) return emploiMatiereLabel;
    if (emploi?.titre) return emploi.titre;

    const matiereId =
      (seance as any).matiereId ||
      (seance as any).matiere?.id ||
      emploi?.matiereId;
    const matiere = this.matieres.find((item: any) => item.id === matiereId);

    return matiere?.libelle || 'Matière non renseignée';
  }

  private getContenuSeance(
    seance: Seance,
    fiche?: FicheProgression,
    emargement?: EmargementModel,
  ): string {
    const parts = [fiche?.contenuDetaille, fiche?.objectifs, fiche?.travaux]
      .filter(Boolean)
      .map((value) => String(value).trim())
      .filter(Boolean);

    if (parts.length > 0) {
      return parts.join(' • ');
    }

    if (emargement) {
      return `Émargement ${emargement.statut?.toString().toLowerCase() || 'enregistré'}${emargement.lieu ? ` à ${emargement.lieu}` : ''}.`;
    }

    return `Statut de la séance : ${seance.statut}`;
  }

  private mapStatus(
    statut: string,
    fiche?: FicheProgression,
    emargement?: EmargementModel,
  ): 'completed' | 'in_progress' | 'planned' {
    if (
      statut === 'TERMINEE' ||
      fiche?.estValideAdmin ||
      emargement?.statut === 'VALIDE'
    ) {
      return 'completed';
    }
    if (statut === 'EN_COURS' || emargement) return 'in_progress';
    return 'planned';
  }

  private calculerDureeMinutes(debut: string, fin: string): number {
    const start = this.toMinutes(debut);
    const end = this.toMinutes(fin);
    return start !== null && end !== null && end > start ? end - start : 0;
  }

  private toMinutes(value?: string): number | null {
    if (!value) return null;
    const [hours, minutes] = value.split(':').map(Number);
    return Number.isFinite(hours) && Number.isFinite(minutes)
      ? hours * 60 + minutes
      : null;
  }

  private parseDate(value?: string): Date {
    if (!value) return new Date();
    const [year, month, day] = value.split('-').map(Number);
    return year && month && day
      ? new Date(year, month - 1, day)
      : new Date(value);
  }

  private toDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private formatTime(value?: string): string {
    return value ? value.substring(0, 5) : '--:--';
  }
}
