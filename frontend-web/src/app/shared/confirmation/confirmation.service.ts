import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ConfirmationDialogState {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  variant: 'danger' | 'primary';
  resolve: (confirmed: boolean) => void;
}

export interface ConfirmationOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
}

@Injectable({ providedIn: 'root' })
export class ConfirmationService {
  private readonly dialogSubject = new BehaviorSubject<ConfirmationDialogState | null>(null);
  readonly dialog$ = this.dialogSubject.asObservable();

  confirm(options: ConfirmationOptions): Promise<boolean> {
    return new Promise((resolve) => {
      this.dialogSubject.next({
        title: options.title || 'Confirmation',
        message: options.message,
        confirmText: options.confirmText || 'Confirmer',
        cancelText: options.cancelText || 'Annuler',
        variant: options.variant || 'primary',
        resolve,
      });
    });
  }

  close(confirmed: boolean): void {
    const current = this.dialogSubject.value;
    if (!current) return;

    this.dialogSubject.next(null);
    current.resolve(confirmed);
  }
}
