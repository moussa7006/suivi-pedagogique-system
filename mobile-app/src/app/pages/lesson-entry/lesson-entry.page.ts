import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule, ToastController, NavController, LoadingController } from '@ionic/angular';
import { LessonService } from '../../core/services/lesson.service';

@Component({
  selector: 'app-lesson-entry',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/home"></ion-back-button>
        </ion-buttons>
        <ion-title>Cahier de Textes</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="lesson-page">
      <div class="header-info">
        <ion-chip color="success" class="status-chip">
          <ion-icon name="checkmark-circle"></ion-icon>
          <ion-label>Émargement validé</ion-label>
        </ion-chip>
        <h1>Détails de la séance</h1>
        <p>Veuillez résumer le contenu pédagogique dispensé aujourd'hui.</p>
      </div>

      <div class="form-container">
        <form [formGroup]="lessonForm" (ngSubmit)="onSubmit()">
          
          <div class="form-group">
            <ion-item lines="none" class="pro-select">
              <ion-label position="stacked">Matière</ion-label>
              <ion-select formControlName="subjectId" placeholder="Sélectionner la matière" interface="action-sheet">
                <ion-select-option [value]="1">Algorithmique</ion-select-option>
                <ion-select-option [value]="2">Programmation Java</ion-select-option>
                <ion-select-option [value]="3">Bases de données</ion-select-option>
              </ion-select>
            </ion-item>
          </div>

          <div class="form-group">
            <ion-item lines="none" class="pro-input">
              <ion-label position="stacked">Chapitre / Titre</ion-label>
              <ion-input formControlName="chapter" placeholder="Ex: Les Arbres Binaires"></ion-input>
            </ion-item>
          </div>

          <div class="form-group">
            <ion-item lines="none" class="pro-textarea">
              <ion-label position="stacked">Résumé du contenu</ion-label>
              <ion-textarea 
                formControlName="summary" 
                placeholder="Décrivez brièvement les points abordés..."
                [autoGrow]="true"
                rows="4">
              </ion-textarea>
            </ion-item>
          </div>

          <div class="form-group duration-selector">
            <ion-label class="range-label">Durée de la séance (Heures)</ion-label>
            <div class="range-display">{{ lessonForm.get('duration')?.value }}h</div>
            <ion-range 
              formControlName="duration" 
              [min]="1" [max]="6" [step]="1" [snaps]="true" 
              color="primary">
              <ion-icon slot="start" size="small" name="time-outline"></ion-icon>
              <ion-icon slot="end" name="time"></ion-icon>
            </ion-range>
          </div>

          <div class="action-footer">
            <ion-button 
              type="submit" 
              expand="block" 
              class="submit-btn" 
              [disabled]="lessonForm.invalid || isLoading">
              <span *ngIf="!isLoading">Valider la séance</span>
              <ion-spinner *ngIf="isLoading" name="crescent"></ion-spinner>
            </ion-button>
          </div>
        </form>
      </div>
    </ion-content>
  `,
  styles: [`
    .lesson-page { --background: #f8fafc; }

    .header-info {
      padding: 30px 20px; text-align: left; background: white; border-bottom-left-radius: 40px; border-bottom-right-radius: 40px;
      margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.03);
      
      .status-chip { margin-bottom: 12px; font-weight: 700; height: 32px; font-size: 0.8rem; }
      h1 { font-weight: 800; color: #1e293b; font-size: 1.8rem; margin: 0; letter-spacing: -0.5px; }
      p { color: #64748b; font-size: 0.95rem; margin-top: 8px; line-height: 1.5; }
    }

    .form-container { padding: 0 20px 40px; }

    .form-group { margin-bottom: 20px; }

    .pro-select, .pro-input, .pro-textarea {
      --background: white; border: 1px solid #e2e8f0; border-radius: 18px; padding: 10px 16px;
      ion-label { color: #2563eb; font-weight: 700; font-size: 0.85rem !important; margin-bottom: 8px; }
      ion-input, ion-select, ion-textarea { font-weight: 600; font-size: 1rem; color: #1e293b; --padding-start: 0; }
    }

    .duration-selector {
      background: white; border-radius: 18px; padding: 20px; border: 1px solid #e2e8f0; text-align: center;
      .range-label { display: block; color: #64748b; font-weight: 700; font-size: 0.85rem; margin-bottom: 15px; }
      .range-display { font-size: 2.2rem; font-weight: 800; color: #2563eb; margin-bottom: 10px; }
    }

    .action-footer { margin-top: 30px; }

    .submit-btn {
      --background: #1e293b; --border-radius: 18px; --padding-top: 20px; --padding-bottom: 20px;
      font-weight: 800; text-transform: none; font-size: 1.1rem; box-shadow: 0 10px 20px rgba(30,41,59,0.2);
    }
  `]
})
export class LessonEntryComponent {
  lessonForm: FormGroup;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private lessonService: LessonService,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController
  ) {
    this.lessonForm = this.fb.group({
      subjectId: [null, Validators.required],
      chapter: ['', [Validators.required, Validators.minLength(5)]],
      summary: ['', [Validators.required, Validators.minLength(10)]],
      duration: [2, Validators.required],
      date: [new Date().toISOString()]
    });
  }

  async onSubmit() {
    if (this.lessonForm.valid) {
      this.isLoading = true;
      const loading = await this.loadingCtrl.create({
        message: 'Envoi du cahier de textes...',
        spinner: 'dots'
      });
      await loading.present();

      this.lessonService.submitLesson(this.lessonForm.value).subscribe({
        next: async () => {
          await loading.dismiss();
          this.isLoading = false;
          this.showSuccess();
          this.navCtrl.navigateRoot('/home');
        },
        error: async () => {
          await loading.dismiss();
          this.isLoading = false;
        }
      });
    }
  }

  async showSuccess() {
    const toast = await this.toastCtrl.create({
      message: 'Séance enregistrée avec succès !',
      duration: 3000,
      color: 'success',
      position: 'top',
      icon: 'checkmark-circle'
    });
    await toast.present();
  }
}
