import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
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
import {
  lockClosedOutline,
  mailOutline,
  keypadOutline,
  arrowBackOutline,
} from "ionicons/icons";
import { finalize } from "rxjs";
import { AuthService } from "../core/services/auth.service";

@Component({
  selector: "app-reset-password",
  standalone: true,
  templateUrl: "./reset-password.page.html",
  styleUrls: ["./reset-password.page.scss"],
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
export class ResetPasswordPage {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastController = inject(ToastController);
  email = this.route.snapshot.queryParamMap.get("email") || "";
  code = "";
  newPassword = "";
  confirmPassword = "";
  isLoading = false;
  private readonly passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{14,}$/;
  private readonly emailRegex =
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  constructor() {
    addIcons({
      lockClosedOutline,
      mailOutline,
      keypadOutline,
      arrowBackOutline,
    });
  }

  async submit() {
    if (!this.emailRegex.test(this.email)) {
      await this.toast("Veuillez renseigner un email valide.", "danger");
      return;
    }
    if (!/^\d{6}$/.test(this.code)) {
      await this.toast(
        "Le code doit contenir exactement 6 chiffres.",
        "danger",
      );
      return;
    }
    if (!this.passwordRegex.test(this.newPassword)) {
      await this.toast(
        "Le mot de passe doit contenir au moins 14 caractères, une majuscule, une minuscule, un chiffre et un symbole.",
        "danger",
      );
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      await this.toast("Les mots de passe ne correspondent pas.", "danger");
      return;
    }

    this.isLoading = true;
    this.authService
      .resetPassword(this.email, this.code, this.newPassword)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: async () => {
          await this.toast(
            "Mot de passe réinitialisé. Vous pouvez vous connecter.",
            "success",
          );
          this.router.navigate(["/login"]);
        },
        error: async (err) => {
          await this.toast(
            err?.error?.error || "Réinitialisation impossible.",
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
