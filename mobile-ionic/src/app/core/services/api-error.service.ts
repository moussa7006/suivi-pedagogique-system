import { Injectable, inject } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { ToastController } from "@ionic/angular/standalone";

@Injectable({ providedIn: "root" })
export class ApiErrorService {
  private readonly toastController = inject(ToastController);

  extractMessage(error: unknown, fallback = "Une erreur est survenue."): string {
    if (!(error instanceof HttpErrorResponse)) {
      return fallback;
    }

    if (!error.error) {
      return fallback;
    }

    if (typeof error.error === "string" && error.error.trim().length > 0) {
      return error.error;
    }

    if (typeof error.error === "object" && error.error !== null) {
      const data = error.error as Record<string, unknown>;
      const message = data["message"];
      if (typeof message === "string" && message.trim().length > 0) {
        return message;
      }
      const errorText = data["error"];
      if (typeof errorText === "string" && errorText.trim().length > 0) {
        return errorText;
      }
    }

    return fallback;
  }

  async presentError(error: unknown, fallback?: string): Promise<void> {
    const message = this.extractMessage(error, fallback);
    const toast = await this.toastController.create({
      message,
      duration: 2800,
      color: "danger",
      position: "top",
    });
    await toast.present();
  }
}
