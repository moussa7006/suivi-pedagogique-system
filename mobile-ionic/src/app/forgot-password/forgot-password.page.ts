import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonIcon,
  IonSpinner,
  ToastController,
} from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { keyOutline, mailOutline, arrowBackOutline } from "ionicons/icons";
import { finalize } from "rxjs";
import { AuthService } from "../core/services/auth.service";

@Component({
  selector: "app-forgot-password",
  standalone: true,
  templateUrl: "./forgot-password.page.html",
  styleUrls: ["./forgot-password.page.scss"],
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonIcon,
    IonSpinner,
  ],
})
export class ForgotPasswordPage {
  private authService = inject(AuthService);
  private toastController = inject(ToastController);
  private router = inject(Router);
  email = "";
  isLoading = false;

  constructor() {
    addIcons({ keyOutline, mailOutline, arrowBackOutline });
  }

  submit() {
    this.isLoading = true;
    this.authService
      .forgotPassword(this.email)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: async (res: any) => {
          await this.toast(
            res?.message || "Si cet email existe, un code a été envoyé.",
            "success",
          );
          this.router.navigate(["/reset-password"], {
            queryParams: { email: this.email },
          });
        },
        error: async (err) => {
          await this.toast(
            err?.error?.error || "Impossible d'envoyer le code.",
            "danger",
          );
        },
      });
  }

  private async toast(message: string, color: "success" | "danger") {
    const toast = await this.toastController.create({
      message,
      color,
      duration: 3000,
      position: "top",
    });
    await toast.present();
  }
}
