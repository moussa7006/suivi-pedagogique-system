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
import {
  shieldCheckmarkOutline,
  keyOutline,
  lockClosedOutline,
  arrowBackOutline,
} from "ionicons/icons";
import { finalize } from "rxjs";
import { AuthService } from "../core/services/auth.service";

@Component({
  selector: "app-change-password",
  standalone: true,
  templateUrl: "./change-password.page.html",
  styleUrls: ["./change-password.page.scss"],
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
export class ChangePasswordPage {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastController = inject(ToastController);

  currentPassword = "";
  newPassword = "";
  confirmPassword = "";
  isLoading = false;
  forced = history.state?.forced === true;
  private readonly passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{14,}$/;

  constructor() {
    addIcons({
      shieldCheckmarkOutline,
      keyOutline,
      lockClosedOutline,
      arrowBackOutline,
    });
  }

  async submit() {
    if (!this.currentPassword) {
      await this.toast("Veuillez renseigner l'ancien mot de passe.", "danger");
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
      .changePassword(this.currentPassword, this.newPassword)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: async () => {
          const user = await this.authService.getUser();
          if (user) {
            user.forcePasswordChange = false;
            await this.authService.setUser(user);
          }
          await this.toast("Mot de passe modifié avec succès.", "success");
          this.router.navigate(["/tabs"]);
        },
        error: async (err) => {
          await this.toast(
            err?.error?.error || "Erreur lors du changement de mot de passe.",
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
