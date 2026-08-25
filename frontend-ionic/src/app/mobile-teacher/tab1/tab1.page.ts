import {
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';
import {
  IonContent,
  IonButton,
  IonIcon,
  IonBadge,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
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
  alertCircleOutline,
  gridOutline,
  personOutline,
  schoolOutline,
  checkmarkCircleOutline,
  trendingUpOutline,
  closeOutline,
  cashOutline,
  chevronForwardOutline,
} from 'ionicons/icons';
import { AuthService } from '../../core/services/auth.service';
import { ScheduleService } from '../../core/services/schedule.service';
import { FicheProgressionService } from '../../core/services/fiche-progression.service';
import { UtilisateurService } from '../../core/services/utilisateur.service';
import { FicheProgression } from '../../core/models/fiche-progression.model';
import { Seance } from '../../core/models/seance.model';
import { CommonModule } from '@angular/common';

interface NotificationItem {
  title: string;
  message: string;
  icon: string;
  type: 'warning' | 'info' | 'success';
  actionLabel?: string;
  actionRoute?: string;
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [CommonModule, IonContent, IonButton, IonIcon, IonBadge],
})
export class Tab1Page implements OnInit, OnDestroy {
  private router = inject(Router);
  private authService = inject(AuthService);
  private scheduleService = inject(ScheduleService);
  private ficheProgressionService = inject(FicheProgressionService);
  private utilisateurService = inject(UtilisateurService);
  private cdr = inject(ChangeDetectorRef);

  isCahierFait = false;

  teacher = {
    firstName: 'Enseignant',
    lastName: '',
    avatar: '',
  };

  teacherInitials = 'EN';

  // Stats data calculées depuis les vraies séances/fiches du backend
  totalSeances = 0;
  completedSeances = 0;
  pendingSeances = 0;
  completionRate = 0;
  heuresEffectuees = 0;
  heuresPrevues = 0;
  private seances: Seance[] = [];

  // Notifications
  notificationCount = 0;
  pendingNotifications: NotificationItem[] = [];
  showNotifications = false;

  // Gauge SVG constants
  readonly gaugeCircumference = 2 * Math.PI * 52; // ≈ 326.73

  get gaugeOffset(): number {
    return (
      this.gaugeCircumference -
      (this.completionRate / 100) * this.gaugeCircumference
    );
  }

  get greeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  }

  get nextSeanceLabel(): string {
    const now = new Date();
    const todayKey = this.todayKey();
    const sessions = this.seances
      .filter(
        (seance) => (seance.dateCours || '').substring(0, 10) === todayKey,
      )
      .map((seance) => {
        const start = this.combineDateAndTime(
          seance.dateCours,
          seance.heureDebutReelle,
        );
        const end = this.combineDateAndTime(
          seance.dateCours,
          seance.heureFinReelle,
        );
        return start && end ? { seance, start, end } : null;
      })
      .filter(
        (item): item is { seance: Seance; start: Date; end: Date } =>
          item !== null,
      );

    // 1. Séance en cours
    const enCours = sessions.find(
      (item) => item.start <= now && item.end >= now,
    );
    if (enCours) {
      const end = this.formatTime(enCours.end);
      return `Séance en cours · jusqu'à ${end}`;
    }

    // 2. Prochaine séance du jour
    const upcoming = sessions
      .filter((item) => item.start > now)
      .sort((a, b) => a.start.getTime() - b.start.getTime())[0];

    if (!upcoming) {
      return "Aucune séance aujourd'hui";
    }
    const time = this.formatTime(upcoming.start);
    return `Prochaine séance à ${time}`;
  }

  private formatTime(date: Date): string {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  private todayKey(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      '0',
    )}-${String(now.getDate()).padStart(2, '0')}`;
  }

  get todayLabel(): string {
    return new Date().toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  }

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
      alertCircleOutline,
      gridOutline,
      personOutline,
      schoolOutline,
      checkmarkCircleOutline,
      trendingUpOutline,
      closeOutline,
      cashOutline,
      chevronForwardOutline,
    });
  }

  ngOnInit() {
    this.refresh();
  }

  ionViewWillEnter(): void {
    this.refresh();
  }

  ionViewWillLeave(): void {
    this.closeNotifications();
  }

  ngOnDestroy(): void {
    this.closeNotifications();
  }

  private refresh(): void {
    void this.loadUser();
    this.loadRealData();
  }

  private async loadUser(): Promise<void> {
    const user = await this.authService.getUser();
    if (user) {
      const firstName = user.prenom || 'Enseignant';
      const lastName = user.nom || '';
      this.teacher = {
        firstName,
        lastName,
        avatar: user.photoUrl || '',
      };
      this.teacherInitials = this.getInitials(firstName, lastName);
      this.cdr.detectChanges();

      // Recharger la photo depuis le backend (non persistee dans le storage
      // pour eviter QuotaExceededError sur les data URLs base64).
      this.authService.getMe().subscribe({
        next: (fullUser) => {
          if (fullUser?.photoUrl) {
            this.teacher.avatar = fullUser.photoUrl;
          }
          this.cdr.detectChanges();
        },
        error: () => {
          // Garder l'avatar par defaut.
          this.cdr.detectChanges();
        },
      });
    }
  }

  private loadRealData() {
    forkJoin({
      seances: this.scheduleService.getSeances().pipe(
        catchError((err: unknown) => {
          console.error('Erreur lors du chargement des séances', err);
          return of([] as Seance[]);
        }),
      ),
      fiches: this.ficheProgressionService.getFichesProgression().pipe(
        catchError((err: unknown) => {
          console.error('Erreur lors du chargement des fiches de progression', err);
          return of([] as FicheProgression[]);
        }),
      ),
    }).subscribe({
      next: ({ seances, fiches }) => {
        const safeSeances = seances || [];
        const safeFiches = fiches || [];
        const ficheSeanceIds = new Set(
          safeFiches
            .map((fiche) => fiche.seanceId)
            .filter((id): id is number => Number.isFinite(id)),
        );

        this.totalSeances = safeSeances.length;
        this.seances = safeSeances;
        this.completedSeances = safeSeances.filter((seance) =>
          this.hasFicheProgression(seance, ficheSeanceIds),
        ).length;
        this.pendingSeances = safeSeances.filter((seance) =>
          this.isAwaitingFicheProgression(seance, ficheSeanceIds),
        ).length;
        this.completionRate = this.totalSeances
          ? Math.round((this.completedSeances / this.totalSeances) * 100)
          : 0;
        this.updateHoursSummary(safeSeances);
        this.isCahierFait = this.hasCurrentSeanceCahier(
          safeSeances,
          safeFiches,
        );

        this.updateNotifications();
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des séances', err);
        this.cdr.detectChanges();
      },
    });
  }

  private updateHoursSummary(seances: Seance[]): void {
    const now = new Date();
    let plannedMinutes = 0;
    let completedMinutes = 0;

    for (const seance of seances) {
      const start = this.combineDateAndTime(
        seance.dateCours,
        seance.heureDebutReelle,
      );
      const end = this.combineDateAndTime(
        seance.dateCours,
        seance.heureFinReelle,
      );
      if (!start || !end || end <= start) {
        continue;
      }

      const duration = (end.getTime() - start.getTime()) / 60000;
      plannedMinutes += duration;
      if (end <= now) {
        completedMinutes += duration;
      }
    }

    this.heuresPrevues = Math.round((plannedMinutes / 60) * 10) / 10;
    this.heuresEffectuees = Math.round((completedMinutes / 60) * 10) / 10;
  }

  private hasCurrentSeanceCahier(
    seances: Seance[],
    fiches: FicheProgression[],
  ): boolean {
    const now = new Date();
    const currentOrNextSeance =
      seances.find((seance) => {
        const start = this.combineDateAndTime(
          seance.dateCours,
          seance.heureDebutReelle,
        );
        const end = this.combineDateAndTime(
          seance.dateCours,
          seance.heureFinReelle,
        );
        return start && end && now >= start && now <= end;
      }) ||
      seances.find(
        (seance) => seance.statut === 'PREVUE' || seance.statut === 'EN_COURS',
      );

    if (!currentOrNextSeance?.id) {
      return fiches.length > 0;
    }

    return (
      !!currentOrNextSeance.ficheProgressionId ||
      fiches.some((fiche) => fiche.seanceId === currentOrNextSeance.id)
    );
  }

  private hasFicheProgression(
    seance: Seance,
    ficheSeanceIds: Set<number>,
  ): boolean {
    return (
      !!seance.ficheProgressionId ||
      (!!seance.id && ficheSeanceIds.has(seance.id))
    );
  }

  private isAwaitingFicheProgression(
    seance: Seance,
    ficheSeanceIds: Set<number>,
  ): boolean {
    return (
      !!seance.emargementId && !this.hasFicheProgression(seance, ficheSeanceIds)
    );
  }

  private toMinutes(timeValue?: string): number | null {
    if (!timeValue) {
      return null;
    }

    const [hours, minutes] = timeValue.split(':').map(Number);
    return Number.isFinite(hours) && Number.isFinite(minutes)
      ? hours * 60 + minutes
      : null;
  }

  private combineDateAndTime(
    dateValue?: string,
    timeValue?: string,
  ): Date | null {
    if (!dateValue || !timeValue) return null;
    const [year, month, day] = dateValue.split('-').map(Number);
    const minutesOfDay = this.toMinutes(timeValue);
    if (!year || !month || !day || minutesOfDay === null) return null;
    return new Date(
      year,
      month - 1,
      day,
      Math.floor(minutesOfDay / 60),
      minutesOfDay % 60,
      0,
      0,
    );
  }

  private getInitials(firstName: string, lastName: string): string {
    const first = firstName ? firstName.charAt(0).toUpperCase() : '';
    const last = lastName ? lastName.charAt(0).toUpperCase() : '';
    return first + last || 'EN';
  }

  private updateNotifications() {
    let count = 0;
    const notifications: NotificationItem[] = [];

    if (!this.isCahierFait) {
      count++;
      notifications.push({
        title: 'Fiche de progression à remplir',
        message:
          "Scannez le QR Code de la séance puis complétez la fiche pour valider l'émargement.",
        icon: 'document-text-outline',
        type: 'warning',
        actionLabel: 'Remplir',
        actionRoute: '/mobile/cahier-textes',
      });
    }

    const uncompleted = this.pendingSeances;
    if (uncompleted > 0) {
      count += uncompleted;
      notifications.push({
        title: `${uncompleted} séance(s) à finaliser`,
        message:
          'Complétez la fiche des séances dont l’émargement a déjà été effectué.',
        icon: 'calendar-outline',
        type: 'info',
        actionLabel: 'Remplir',
        actionRoute: '/mobile/cahier-textes',
      });
    }

    this.notificationCount = count;
    this.pendingNotifications = notifications;
  }

  openNotifications() {
    this.showNotifications = true;
    document.body.classList.add('mobile-notifications-open');
  }

  closeNotifications() {
    this.showNotifications = false;
    document.body.classList.remove('mobile-notifications-open');
  }

  handleNotificationAction(notification: NotificationItem) {
    this.closeNotifications();
    if (notification.actionRoute) {
      this.navigateTo(notification.actionRoute);
    }
  }

  navigateTo(path: string) {
    if (path.startsWith('/')) {
      this.router.navigateByUrl(path);
    } else {
      this.router.navigate([path]);
    }
  }
}
