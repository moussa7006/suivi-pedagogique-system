import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
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
  sparklesOutline,
  cashOutline,
} from 'ionicons/icons';
import { AuthService } from '../core/services/auth.service';
import { ScheduleService } from '../core/services/schedule.service';
import { FicheProgressionService } from '../core/services/fiche-progression.service';
import { FicheProgression } from '../core/models/fiche-progression.model';
import { Seance } from '../core/models/seance.model';
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
export class Tab1Page implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  private scheduleService = inject(ScheduleService);
  private ficheProgressionService = inject(FicheProgressionService);

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
  totalHeures = 0;
  scheduledHeures = 0;
  completionRate = 0;

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
      sparklesOutline,
      cashOutline,
    });
  }

  ngOnInit() {
    this.refresh();
  }

  ionViewWillEnter(): void {
    this.refresh();
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
    }
  }

  private loadRealData() {
    forkJoin({
      seances: this.scheduleService.getSeances(),
      fiches: this.ficheProgressionService.getFichesProgression(),
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
        this.completedSeances = safeSeances.filter((seance) =>
          this.hasFicheProgression(seance, ficheSeanceIds),
        ).length;
        this.pendingSeances = safeSeances.filter((seance) =>
          this.isAwaitingFicheProgression(seance, ficheSeanceIds),
        ).length;
        this.completionRate = this.totalSeances
          ? Math.round((this.completedSeances / this.totalSeances) * 100)
          : 0;
        this.isCahierFait = this.hasCurrentSeanceCahier(
          safeSeances,
          safeFiches,
        );

        this.scheduledHeures = this.roundHours(
          safeSeances.reduce(
            (total, seance) => total + this.getDurationMinutes(seance),
            0,
          ),
        );
        this.totalHeures = this.roundHours(
          safeSeances
            .filter((seance) =>
              this.hasFicheProgression(seance, ficheSeanceIds),
            )
            .reduce(
              (total, seance) => total + this.getDurationMinutes(seance),
              0,
            ),
        );
        this.updateNotifications();
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des séances', err);
      },
    });
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

  private getDurationMinutes(seance: Seance): number {
    const start = this.toMinutes(seance.heureDebutReelle);
    const end = this.toMinutes(seance.heureFinReelle);
    return start !== null && end !== null && end > start ? end - start : 0;
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

  private roundHours(minutes: number): number {
    return Math.round((minutes / 60) * 10) / 10;
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
        actionRoute: '/tabs/tabs/tab3',
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
        actionLabel: 'Voir planning',
        actionRoute: '/tabs/tabs/tab2',
      });
    }

    this.notificationCount = count;
    this.pendingNotifications = notifications;
  }

  openNotifications() {
    this.showNotifications = true;
  }

  closeNotifications() {
    this.showNotifications = false;
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
