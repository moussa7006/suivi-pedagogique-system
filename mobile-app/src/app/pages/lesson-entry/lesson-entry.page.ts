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
          <ion-back-button defaultHref="/home" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Cahier de Textes</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="lesson-entry-content">
      <div class="status-banner">
        <div class="success-icon">
          <ion-icon name="checkmark-done-circle"></ion-icon>
        </div>
        <div class="banner-text">
          <h3>Émargement Validé</h3>
          <p>Vous pouvez maintenant remplir votre séance.</p>
        </div>
      </div>

      <div class="form-wrapper">
        <form [formGroup]="lessonForm" (ngSubmit)="onSubmit()">
          
          <div class="form-card">
            <div class="card-title">Informations Séance</div>
            
            <div class="input-item">
              <ion-label>Matière dispensée</ion-label>
              <div class="select-box">
                <ion-select formControlName="subjectId" placeholder="Choisir la matière" interface="action-sheet">
                  <ion-select-option [value]="1">Algorithmique</ion-select-option>
                  <ion-select-option [value]="2">Programmation Java</ion-select-option>
                  <ion-select-option [value]="3">Bases de données</ion-select-option>
                </ion-select>
              </div>
            </div>

            <div class="input-item">
              <ion-label>Chapitre ou Thème</ion-label>
              <div class="input-box">
                <input type="text" formControlName="chapter" placeholder="Ex: Les Arbres Binaires">
              </div>
            </div>
          </div>

          <div class="form-card">
            <div class="card-title">Contenu Pédagogique</div>
            <div class="textarea-box">
              <textarea 
                formControlName="summary" 
                placeholder="Décrivez les points clés abordés durant cette séance..."
                rows="5">
              </textarea>
            </div>
          </div>

          <div class="form-card">
            <div class="card-title">Heures de cours : <span>{{ lessonForm.get('duration')?.value }}h</span></div>
            <div class="range-wrapper">
              <ion-range 
                formControlName="duration" 
                [min]="1" [max]="6" [step]="1" [snaps]="true" 
                color="primary">
                <ion-label slot="start">1h</ion-label>
                <ion-label slot="end">6h</ion-label>
              </ion-range>
            </div>
          </div>

          <div class="action-footer">
            <ion-button 
              type="submit" 
              expand="block" 
              class="finish-btn" 
              [disabled]="lessonForm.invalid || isLoading">
              <span *ngIf="!isLoading">Terminer la séance</span>
              <ion-spinner *ngIf="isLoading" name="dots"></ion-spinner>
            </ion-button>
          </div>
        </form>
      </div>
    </ion-content>
  `,
  styles: [`
    .lesson-entry-content { --background: #f8fafc; }

    .status-banner {
      background: #059669; color: white; padding: 25px 20px;
      display: flex; align-items: center; gap: 15px;
      border-bottom-left-radius: 30px; border-bottom-right-radius: 30px;
      margin-bottom: 20px;
      
      .success-icon { font-size: 3rem; }
      .banner-text {
        h3 { margin: 0; font-size: 1.2rem; font-weight: 800; }
        p { margin: 2px 0 0; font-size: 0.85rem; opacity: 0.9; }
      }
    }

    .form-wrapper { padding: 0 15px 40px; }

    .form-card {
      background: white; border-radius: 20px; padding: 20px;
      margin-bottom: 15px; border: 1px solid #e2e8f0;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);

      .card-title { font-size: 0.85rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px;
        span { color: #2563eb; float: right; font-size: 1rem; }
      }
    }

    .input-item {
      margin-bottom: 15px;
      ion-label { display: block; font-size: 0.8rem; font-weight: 700; color: #1e293b; margin-bottom: 8px; }
      .input-box, .select-box {
        background: #f1f5f9; border-radius: 12px; padding: 12px 15px;
        input, ion-select { width: 100%; border: none; background: transparent; font-weight: 600; color: #1e293b; outline: none; }
      }
    }

    .textarea-box {
      background: #f1f5f9; border-radius: 15px; padding: 15px;
      textarea { width: 100%; border: none; background: transparent; font-size: 1rem; font-weight: 500; color: #1e293b; outline: none; resize: none; }
    }

    .range-wrapper { padding: 0 10px; }

    .action-footer { margin-top: 30px; }

    .finish-btn {
      --background: #1e293b; --color: white; --border-radius: 18px;
      --padding-top: 22px; --padding-bottom: 22px;
      font-weight: 800; text-transform: none; font-size: 1.1rem;
      box-shadow: 0 10px 20px rgba(30,41,59,0.2);
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
        message: 'Enregistrement...',
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
      message: 'Séance enregistrée !',
      duration: 3000,
      color: 'success',
      position: 'top',
      icon: 'checkmark-done-circle'
    });
    await toast.present();
  }
}
