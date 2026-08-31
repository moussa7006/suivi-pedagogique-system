import { ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit, NgZone, inject } from '@angular/core';
import { Platform } from '@ionic/angular';
import { CommonModule } from '@angular/common';


import { RouterLink } from '@angular/router';
import {
  IonContent,
  IonButton,
  IonIcon,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  personOutline,
  mailOutline,
  callOutline,
  locationOutline,
  businessOutline,
  bookOutline,
  timeOutline,
  warningOutline,
  logOutOutline,
  statsChartOutline,
  arrowBackOutline,
  personCircleOutline,
  cameraOutline,
  imagesOutline,
  globeOutline,
  createOutline,
  trashOutline,
  schoolOutline,
  chevronForwardOutline,
} from 'ionicons/icons';

import { AuthService } from '../../core/services/auth.service';
import { ScheduleService } from '../../core/services/schedule.service';
import { UtilisateurService } from '../../core/services/utilisateur.service';
import { MatiereService } from '../../core/services/matiere.service';

import { Subscription, catchError, forkJoin, of, switchMap } from 'rxjs';
import { Seance } from '../../core/models/seance.model';
import { EmploiDuTemps } from '../../core/models/schedule.model';
import { Matiere } from '../../core/models/matiere.model';


@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
  imports: [
    CommonModule,
    RouterLink,
    IonContent,
    IonButton,
    IonIcon,
  ],
})
export class ProfilePage implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private scheduleService = inject(ScheduleService);
  private utilisateurService = inject(UtilisateurService);
  private matiereService = inject(MatiereService);
  private toastController = inject(ToastController);
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);
  private readonly platform = inject(Platform);
  private backButtonSubscription?: Subscription;

  // La fiche enseignant est en lecture seule ; seule la photo est modifiable.
  isEditingProfile = false;

  teacher = {
    id: null as number | null,
    firstName: 'Enseignant',
    lastName: '',
    matricule: '',
    email: '',
    telephone: '',
    adresse: '',
    role: '' as string,
    grade: '',
    specialite: '',
    matieres: [] as string[],
    subjects: [] as string[],
    status: 'Actif',
    avatar: 'https://i.pravatar.cc/150?u=default',

    statistiques: {
      totalSeances: 0,
      tauxPresence: 0,
      etudiants: 0,
    },
  };

  constructor() {
    addIcons({
      personOutline,
      mailOutline,
      callOutline,
      locationOutline,
      businessOutline,
      bookOutline,
      timeOutline,
      warningOutline,
      logOutOutline,
      statsChartOutline,
      arrowBackOutline,
      personCircleOutline,
      cameraOutline,
      imagesOutline,
      trashOutline,
      globeOutline,
      createOutline,
      schoolOutline,
      chevronForwardOutline,
    });
  }

  ngOnInit() {
    void this.loadUserProfile();
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(1000, () => {
      if (this.isEditingProfile) {
        this.cancelProfileEditing();
      }
    });
  }

  ngOnDestroy(): void {
    this.backButtonSubscription?.unsubscribe();
  }

  ionViewWillEnter(): void {
    void this.loadUserProfile();
  }

  private async loadUserProfile(): Promise<void> {
    const storedUser = await this.authService.getUser();
    if (storedUser) {
      this.applyUserToTeacher(storedUser);
      this.cdr.detectChanges();
    }

    this.authService
      .getMe()
      .pipe(
        catchError(() => of(storedUser)),
        switchMap((user) => {
          if (user) {
            this.applyUserToTeacher(user);
            this.cdr.detectChanges();
          }

          const userId = user?.id ?? storedUser?.id ?? this.teacher.id;
          return forkJoin({
            fullUser: userId
              ? this.utilisateurService
                  .listerParId(userId)
                  .pipe(catchError(() => of(user)))
              : of(user),
            seances: this.scheduleService
              .getSeances()
              .pipe(catchError(() => of([] as Seance[]))),
            emploisDuTemps: this.scheduleService
              .getEmploisDuTemps()
              .pipe(catchError(() => of([] as EmploiDuTemps[]))),
            matieres: this.matiereService
              .getAll()
              .pipe(catchError(() => of([] as Matiere[]))),
          });
        }),
      )
      .subscribe({
        next: ({ fullUser, seances, emploisDuTemps, matieres }) => {
          if (fullUser) {
            this.applyUserToTeacher(fullUser);
          }
          const teacherSeances = this.filterTeacherSeances(seances || []);
          this.applySeanceStats(teacherSeances);
          this.applyMatieres(emploisDuTemps || [], matieres || []);
          this.cdr.detectChanges();
        },
        error: () => {
          // Garder les informations déjà disponibles localement.
          this.cdr.detectChanges();
        },
      });
  }

  private applyUserToTeacher(user: any): void {
    const avatar = this.getSafeAvatar(user);
    this.teacher = {
      ...this.teacher,
      id: user?.id ?? this.teacher.id,
      firstName: user?.prenom || this.teacher.firstName || 'Enseignant',
      lastName: user?.nom || this.teacher.lastName || '',
      matricule: user?.matricule || this.teacher.matricule || '',
      email: user?.email || this.teacher.email || '',
      telephone: user?.telephone || this.teacher.telephone || '',
      adresse: user?.adresse || this.teacher.adresse || '',
      role: user?.role || this.teacher.role || '',
      grade: user?.grade || this.teacher.grade || '',
      specialite: user?.specialite || this.teacher.specialite || '',
      status: user?.actif === false ? 'Inactif' : 'Actif',
      avatar,
    };
  }

  private getSafeAvatar(user: any): string {
    const url = user?.photoUrl as string | undefined;
    if (url && (!url.startsWith('data:image/') || url.length <= 500_000)) {
      return url;
    }
    return `https://i.pravatar.cc/150?u=${user?.email || user?.id || this.teacher.email || this.teacher.id || 'default'}`;
  }

  private filterTeacherSeances(seances: Seance[]): Seance[] {
    if (!this.teacher.id) return [];
    return seances.filter((seance) => seance.enseignantId === this.teacher.id);
  }

  private applySeanceStats(seances: Seance[]): void {

    const emargees = seances.filter((seance) => !!seance.emargementId).length;
    const tauxPresence = seances.length
      ? Math.round((emargees / seances.length) * 100)
      : 0;

    this.teacher.statistiques = {
      ...this.teacher.statistiques,
      totalSeances: seances.length,
      tauxPresence,
    };

  }

  private applyMatieres(
    emploisDuTemps: EmploiDuTemps[],
    matieresCatalogue: Matiere[],
  ): void {
    const matiereLabels = new Map(
      matieresCatalogue.map((matiere) => [matiere.id, matiere.libelle]),
    );
    const matieres = emploisDuTemps
      .filter((emploi) => emploi.enseignantId === this.teacher.id)
      .map((emploi) => matiereLabels.get(emploi.matiereId) || `Matière #${emploi.matiereId}`)
      .filter((value, index, self) => !!value && self.indexOf(value) === index)
      .sort((a, b) => a.localeCompare(b, 'fr'));

    this.teacher.matieres = matieres;
    this.teacher.subjects = matieres;
  }

  /** Ouvre la fenêtre dédiée à la photo, sans exposer les données personnelles. */
  changePhoto(): void {
    this.isEditingProfile = true;
  }

  /** Ferme uniquement la fenêtre photo ; la route mobile reste inchangée. */
  cancelProfileEditing(): void {
    this.isEditingProfile = false;
  }

  /** Le bouton retour système ferme d'abord la fenêtre photo ouverte. */
  @HostListener('window:popstate', ['$event'])
  onBrowserBack(event: PopStateEvent): void {
    if (this.isEditingProfile) {
      event.preventDefault();
      this.cancelProfileEditing();
    }
  }

  onPhotoOption(option: 'camera' | 'gallery' | 'delete') {
    if (option === 'delete') {
      void this.saveProfilePhoto('');
    } else {
      this.takePhoto(option);
    }
  }

  private async takePhoto(source: 'camera' | 'gallery') {
    try {
      const { Camera, CameraResultType, CameraSource } =
        await import('@capacitor/camera');

      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: source === 'camera' ? CameraSource.Camera : CameraSource.Photos,
        saveToGallery: source === 'camera',
        width: 512,
        height: 512,
      });

      if (image.dataUrl) {
        // Compresser l'image via un canvas pour produire une data URL legerere
        // (~30-80 Ko). Sans cela, une photo JPEG 512x512 quality 90 peut peser
        // plusieurs Mo en base64, ce qui fait echouer ou ralentir fortement le
        // rechargement depuis getMe() et donne l'impression que la photo
        // disparait apres un changement de page.
        const compressed = await this.compressDataUrl(image.dataUrl, 256, 0.7);
        this.ngZone.run(() => {
          void this.saveProfilePhoto(compressed);
        });
      }
    } catch (error: any) {
      if (error?.message?.includes('User cancelled')) {
        return;
      }

      // Fallback: utiliser un avatar par defaut
      const toast = await this.toastController.create({
        message:
          "Impossible d'accéder à la caméra/galerie. Utilisation d'un avatar par défaut.",
        duration: 3000,
        color: 'warning',
        position: 'top',
      });
      await toast.present();

      const newId = Math.floor(Math.random() * 1000);
      this.teacher.avatar = `https://i.pravatar.cc/150?u=${newId}`;
    }
  }

  /**
   * Reencode l'image (data URL) via un canvas a une taille cible et une
   * qualite JPEG donnee, afin de produire une data URL compacte.
   * Retourne l'URL d'origine si le canvas n'est pas disponible.
   */
  private async compressDataUrl(
    dataUrl: string,
    targetSize: number,
    quality: number,
  ): Promise<string> {
    return new Promise((resolve) => {
      if (typeof document === 'undefined') {
        resolve(dataUrl);
        return;
      }

      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          // Conserver le ratio, mais borner la dimension max a targetSize.
          const ratio = Math.min(
            1,
            targetSize / Math.max(img.width, img.height),
          );
          canvas.width = Math.round(img.width * ratio);
          canvas.height = Math.round(img.height * ratio);
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(dataUrl);
            return;
          }
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } catch {
          resolve(dataUrl);
        }
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  }

  private async saveProfilePhoto(photoUrl: string): Promise<void> {
    const user = await this.authService.getUser();

    if (!user?.id) {
      await this.presentToast(
        'Impossible de retrouver l’identifiant du compte connecté.',
        'danger',
      );
      return;
    }

    this.utilisateurService.modifierPhoto(user.id, photoUrl).subscribe({
      next: async (updatedUser) => {
        // La photo est un data URL base64 potentiellement volumineux ;
        // on ne la persiste PAS dans le localStorage (quota Capacitor)
        // pour eviter QuotaExceededError. On la garde uniquement en memoire.
        const { photoUrl: _omitted, ...userWithoutPhoto } = updatedUser;
        const nextUser = {
          ...user,
          ...userWithoutPhoto,
        };

        if (!photoUrl) {
          delete nextUser.photoUrl;
        }

        await this.authService.setUser(nextUser);
        this.teacher.avatar =
          photoUrl ||
          `https://i.pravatar.cc/150?u=${this.teacher.email || this.teacher.id || 'default'}`;
        await this.presentToast(
          photoUrl
            ? 'Photo de profil mise à jour.'
            : 'Photo de profil supprimée.',
          'success',
        );
      },
      error: async () => {
        await this.presentToast(
          photoUrl
            ? 'Impossible d’enregistrer cette photo.'
            : 'Impossible de supprimer la photo.',
          'danger',
        );
      },
    });
  }

  private async presentToast(message: string, color: string = 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top',
    });
    await toast.present();
  }


  logout() {
    void this.authService.logout();
  }

  getMatieresLabel(): string {
    return this.teacher.matieres.length > 0
      ? this.teacher.matieres.join(', ')
      : 'Non renseigné';
  }
}
