import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  IonContent,
  IonButton,
  IonIcon,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonBadge,
  IonSpinner,
  ToastController,
} from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  documentTextOutline,
  calendarOutline,
  bookOutline,
  timeOutline,
  checkmarkCircleOutline,
  createOutline,
  arrowForwardOutline,
  listOutline,
  closeOutline,
  addOutline,
  checkmarkCircle,
  checkmarkDoneOutline,
  informationCircleOutline,
  peopleOutline,
  schoolOutline,
} from 'ionicons/icons';
import { catchError, finalize, forkJoin, of, timeout } from 'rxjs';
import { FicheProgressionService } from '../core/services/fiche-progression.service';
import { ScheduleService } from '../core/services/schedule.service';
import { FicheProgression } from '../core/models/fiche-progression.model';
import { Seance } from '../core/models/seance.model';
import { EmploiDuTemps } from '../core/models/schedule.model';
import { Matiere } from '../core/models/matiere.model';
import { Classe } from '../core/models/classe.model';
import { MatiereService } from '../core/services/matiere.service';
import { ClasseService } from '../core/services/classe.service';

@Component({
  selector: 'app-cahier-textes',
  templateUrl: 'cahier-textes.page.html',
  styleUrls: ['cahier-textes.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    IonButton,
    IonIcon,
    IonInput,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    IonBadge,
    IonSpinner,
  ],
})
export class CahierTextesPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly ficheProgressionService = inject(FicheProgressionService);
  private readonly scheduleService = inject(ScheduleService);
  private readonly matiereService = inject(MatiereService);
  private readonly classeService = inject(ClasseService);
  private readonly toastController = inject(ToastController);
  private readonly route = inject(ActivatedRoute);

  seanceForm: FormGroup;
  isSubmitting = false;
  isLoading = false;
  showForm = false;
  totalHeures = 0;
  fichesProgression: FicheProgression[] = [];
  seances: Array<{
    id?: number;
    matiere: string;
    date: string;
    heure: string;
    contenu: string;
    status: 'Validé' | 'En attente';
  }> = [];
  seancesDisponibles: Seance[] = [];
  emploisDuTemps: EmploiDuTemps[] = [];
  matieres: Matiere[] = [];
  classes: Classe[] = [];
  openedFromScan = false;

  constructor() {
    addIcons({
      documentTextOutline,
      calendarOutline,
      bookOutline,
      timeOutline,
      checkmarkCircleOutline,
      checkmarkCircle,
      informationCircleOutline,
      peopleOutline,
      schoolOutline,
      createOutline,
      arrowForwardOutline,
      listOutline,
      closeOutline,
      addOutline,
      checkmarkDoneOutline,
    });

    this.seanceForm = this.fb.group({
      seanceId: [null, Validators.required],
      contenu: ['', [Validators.required, Validators.minLength(20)]],
      objectifs: ['', [Validators.required, Validators.minLength(5)]],
      travaux: [''],
    });
  }

  ngOnInit(): void {}

  ionViewWillEnter(): void {
    this.loadData();
  }

  get getValidatedCount(): number {
    return this.fichesProgression.filter((f) => f.estValideAdmin).length;
  }

  get getPendingCount(): number {
    return this.seancesDisponibles.filter((seance) => !!seance.emargementId)
      .length;
  }

  get selectedSeance(): Seance | undefined {
    return this.seancesDisponibles.find(
      (item) => item.id === Number(this.seanceForm.value.seanceId),
    );
  }

  get selectedSeanceDetails(): {
    matiere: string;
    classe: string;
    statut: string;
    statutClass: string;
  } | null {
    const seance = this.selectedSeance;
    if (!seance) {
      return null;
    }

    return {
      matiere: this.getMatiereLabel(seance),
      classe: this.getClasseLabel(seance),
      statut: this.getSeanceStatusLabel(seance),
      statutClass: this.getSeanceStatusClass(seance),
    };
  }

  loadData(): void {
    this.isLoading = true;
    forkJoin({
      fiches: this.ficheProgressionService.getFichesProgression().pipe(
        timeout(10000),
        catchError((error) => {
          this.presentToast(
            this.getLoadErrorMessage(error, 'fiches de progression'),
            'danger',
          );
          return of([] as FicheProgression[]);
        }),
      ),
      seances: this.scheduleService.getSeances().pipe(
        timeout(10000),
        catchError((error) => {
          this.presentToast(
            this.getLoadErrorMessage(error, 'séances'),
            'danger',
          );
          return of([] as Seance[]);
        }),
      ),
      emploisDuTemps: this.scheduleService.getEmploisDuTemps().pipe(
        timeout(10000),
        catchError(() => of([] as EmploiDuTemps[])),
      ),
      matieres: this.matiereService.getAll().pipe(
        timeout(10000),
        catchError(() => of([] as Matiere[])),
      ),
      classes: this.classeService.getAll().pipe(
        timeout(10000),
        catchError(() => of([] as Classe[])),
      ),
    })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(({ fiches, seances, emploisDuTemps, matieres, classes }) => {
        this.fichesProgression = this.normalizeArray(fiches);
        this.emploisDuTemps = this.normalizeArray(emploisDuTemps);
        this.matieres = this.normalizeArray(matieres);
        this.classes = this.normalizeArray(classes);
        this.seances = this.buildSeanceViews(this.fichesProgression);
        this.seancesDisponibles = this.normalizeArray(seances).filter(
          (seance) => this.isSelectableSeance(seance),
        );
        this.applyScanContext();
        this.totalHeures = this.fichesProgression.reduce(
          (total, fiche) =>
            total + this.extractDurationHours(fiche.heureSeance),
          0,
        );
      });
  }

  onSubmit(): void {
    if (this.seanceForm.invalid) {
      this.seanceForm.markAllAsTouched();
      return;
    }

    const seanceId = Number(this.seanceForm.value.seanceId);
    const payload = {
      dateSaisie: new Date().toISOString().slice(0, 10),
      contenuDetaille: this.seanceForm.value.contenu,
      objectifs: this.seanceForm.value.objectifs,
      travaux: this.seanceForm.value.travaux || '',
    };

    this.isSubmitting = true;
    this.ficheProgressionService
      .createFicheProgression(seanceId, payload)
      .pipe(
        timeout(10000),
        finalize(() => (this.isSubmitting = false)),
      )
      .subscribe({
        next: async () => {
          await this.presentToast(
            this.openedFromScan
              ? 'Fiche enregistrée. Émargement validé automatiquement.'
              : 'Fiche de progression enregistrée.',
            'success',
          );
          this.seanceForm.reset();
          this.showForm = false;
          this.openedFromScan = false;
          this.loadData();
        },
        error: (error) => {
          const message =
            typeof error?.error === 'string'
              ? error.error
              : error?.error?.error ||
                error?.error?.message ||
                "Impossible d'enregistrer la fiche de progression.";
          this.presentToast(message, 'danger');
        },
      });
  }

  trackBySeanceId(_index: number, seance: { id?: number }): number | string {
    return seance.id ?? _index;
  }

  formatSeanceLabel(seance: Seance): string {
    return `${seance.dateCours} • ${this.formatTime(seance.heureDebutReelle)} - ${this.formatTime(
      seance.heureFinReelle,
    )} • ${this.getSeanceStatusLabel(seance)}`;
  }

  private applyScanContext(): void {
    const seanceId = Number(this.route.snapshot.queryParamMap.get('seanceId'));
    this.openedFromScan =
      this.route.snapshot.queryParamMap.get('fromScan') === 'true';

    if (!this.openedFromScan || !seanceId) {
      return;
    }

    const seanceIsAvailable = this.seancesDisponibles.some(
      (seance) => seance.id === seanceId,
    );
    if (seanceIsAvailable) {
      this.showForm = true;
      this.seanceForm.patchValue({ seanceId });
    }
  }

  private buildSeanceViews(fiches: FicheProgression[]): Array<{
    id?: number;
    matiere: string;
    date: string;
    heure: string;
    contenu: string;
    status: 'Validé' | 'En attente';
  }> {
    return fiches.map((fiche) => ({
      id: fiche.id,
      matiere: fiche.matiereLibelle || fiche.objectifs || 'Séance',
      date: fiche.dateSeance || fiche.dateSaisie || '',
      heure: fiche.heureSeance || 'Horaire non précisé',
      contenu: fiche.contenuDetaille || '',
      status: fiche.estValideAdmin ? 'Validé' : 'En attente',
    }));
  }

  private getLoadErrorMessage(error: unknown, resource: string): string {
    const isTimeout =
      typeof error === 'object' &&
      error !== null &&
      'name' in error &&
      error.name === 'TimeoutError';

    if (isTimeout) {
      return `Le chargement des ${resource} prend trop de temps. Vérifiez l'IP du serveur et le Wi-Fi.`;
    }

    return `Impossible de charger les ${resource}.`;
  }

  private normalizeArray<T>(
    value: T[] | { content?: T[]; data?: T[] } | null | undefined,
  ): T[] {
    if (Array.isArray(value)) {
      return value;
    }

    if (Array.isArray(value?.content)) {
      return value.content;
    }

    if (Array.isArray(value?.data)) {
      return value.data;
    }

    return [];
  }

  private isSelectableSeance(seance: Seance): boolean {
    return (
      !!seance.emargementId &&
      !this.hasFicheProgression(seance) &&
      this.isTodayOrPast(seance.dateCours)
    );
  }

  private isTodayOrPast(dateValue?: string): boolean {
    if (!dateValue) {
      return false;
    }

    const today = new Date();
    const seanceDate = new Date(`${dateValue}T00:00:00`);
    today.setHours(0, 0, 0, 0);
    seanceDate.setHours(0, 0, 0, 0);

    return seanceDate.getTime() <= today.getTime();
  }

  private getMatiereLabel(seance: Seance): string {
    const schedule = this.getScheduleForSeance(seance);
    const matiere = this.matieres.find(
      (item) => item.id === schedule?.matiereId,
    );

    return matiere?.libelle || 'Matière non renseignée';
  }

  private getClasseLabel(seance: Seance): string {
    const classe = this.classes.find((item) => item.id === seance.classeId);

    return classe?.libelle || `Classe #${seance.classeId}`;
  }

  private getScheduleForSeance(seance: Seance): EmploiDuTemps | undefined {
    return this.emploisDuTemps.find(
      (item) => item.id === seance.emploiDuTempsId,
    );
  }

  private getSeanceStatusLabel(seance: Seance): string {
    const status = this.getComputedSeanceStatus(seance);

    if (status === 'in-progress') {
      return 'EN COURS';
    }
    if (status === 'completed') {
      return 'TERMINÉE';
    }
    return 'PRÉVUE';
  }

  private getSeanceStatusClass(seance: Seance): string {
    return this.getComputedSeanceStatus(seance);
  }

  private getComputedSeanceStatus(
    seance: Seance,
  ): 'upcoming' | 'in-progress' | 'completed' {
    const start = this.combineDateAndTime(
      seance.dateCours,
      seance.heureDebutReelle,
    );
    const end = this.combineDateAndTime(
      seance.dateCours,
      seance.heureFinReelle,
    );
    const now = new Date();

    if (start && end) {
      if (now >= start && now <= end) {
        return 'in-progress';
      }
      if (now > end) {
        return 'completed';
      }
    }

    if (seance.statut === 'EN_COURS') {
      return 'in-progress';
    }
    if (seance.statut === 'TERMINEE') {
      return 'completed';
    }

    return 'upcoming';
  }

  private combineDateAndTime(
    dateValue?: string,
    timeValue?: string,
  ): Date | null {
    if (!dateValue || !timeValue) {
      return null;
    }

    const time = timeValue.substring(0, 5);
    const date = new Date(`${dateValue}T${time}:00`);

    return Number.isNaN(date.getTime()) ? null : date;
  }

  private hasFicheProgression(seance: Seance): boolean {
    return (
      !!seance.ficheProgressionId ||
      this.fichesProgression.some((fiche) => fiche.seanceId === seance.id)
    );
  }

  private extractDurationHours(heureSeance?: string): number {
    if (!heureSeance || !heureSeance.includes('-')) {
      return 0;
    }

    const [start, end] = heureSeance.split('-').map((value) => value.trim());
    const startMinutes = this.toMinutes(start);
    const endMinutes = this.toMinutes(end);
    return startMinutes !== null &&
      endMinutes !== null &&
      endMinutes > startMinutes
      ? Math.round(((endMinutes - startMinutes) / 60) * 10) / 10
      : 0;
  }

  private toMinutes(value: string): number | null {
    const [hours, minutes] = value.split(':').map(Number);
    return Number.isFinite(hours) && Number.isFinite(minutes)
      ? hours * 60 + minutes
      : null;
  }

  private formatTime(value?: string): string {
    return value ? value.substring(0, 5) : '--:--';
  }

  private async presentToast(
    message: string,
    color: 'success' | 'danger' | 'warning' = 'success',
  ) {
    const toast = await this.toastController.create({
      message,
      color,
      duration: 3000,
      position: 'top',
    });
    await toast.present();
  }
}
