import { Injectable, inject } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { ToastController } from "@ionic/angular/standalone";

@Injectable({ providedIn: "root" })
export class ApiErrorService {
  private readonly toastController = inject(ToastController);

  extractMessage(
    error: unknown,
    fallback = "Une erreur est survenue.",
  ): string {
    if (!(error instanceof HttpErrorResponse)) {
      return fallback;
    }

    if (!error.error) {
      return fallback;
    }

    if (typeof error.error === "string" && error.error.trim().length > 0) {
      const rawError = error.error.trim();
      if (this.looksLikeHtml(rawError)) {
        return this.messageForStatus(error.status, fallback);
      }
      return rawError;
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

    return this.messageForStatus(error.status, fallback);
  }

  private looksLikeHtml(value: string): boolean {
    const normalized = value.toLowerCase();
    return (
      normalized.startsWith("<!doctype html") ||
      normalized.startsWith("<html") ||
      normalized.includes("<body")
    );
  }

  private messageForStatus(status: number, fallback: string): string {
    if (status === 0) {
      return "Impossible de joindre le serveur. Vérifiez que le backend est démarré.";
    }
    if (status === 401 || status === 403) {
      return "Email ou mot de passe incorrect.";
    }
    if (status === 404) {
      return "API introuvable. Vérifiez la configuration du proxy mobile.";
    }
    if (status >= 500) {
      return "Erreur serveur. Réessayez dans un instant.";
    }
    return fallback;
  }

  async presentError(error: unknown, fallback?: string): Promise<void> {
    const message = this.extractMessage(
      error,
      fallback ?? "Une erreur est survenue.",
    );
    const toast = await this.toastController.create({
      message,
      duration: 2800,
      color: "danger",
      position: "top",
    });
    await toast.present();
  }
}
