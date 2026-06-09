import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type AlertDialogVariant = 'info' | 'success' | 'warning' | 'error';

export interface AlertDialogOptions {
  title?: string;
  message: string;
  okText?: string;
  variant?: AlertDialogVariant;
}

interface AlertDialogState extends Required<AlertDialogOptions> {
  open: boolean;
}

@Injectable({ providedIn: 'root' })
export class AlertDialogService {
  private resolver: (() => void) | null = null;

  private readonly initialState: AlertDialogState = {
    open: false,
    title: 'Information',
    message: '',
    okText: 'OK',
    variant: 'info',
  };

  private readonly stateSubject = new BehaviorSubject<AlertDialogState>(this.initialState);
  readonly state$ = this.stateSubject.asObservable();

  open(options: string | AlertDialogOptions): Promise<void> {
    const normalized = typeof options === 'string' ? { message: options } : options;

    this.resolver?.();

    return new Promise<void>((resolve) => {
      this.resolver = resolve;
      this.stateSubject.next({
        open: true,
        title: normalized.title || this.getDefaultTitle(normalized.variant || 'info'),
        message: normalized.message,
        okText: normalized.okText || 'OK',
        variant: normalized.variant || 'info',
      });
    });
  }

  close(): void {
    this.stateSubject.next(this.initialState);
    this.resolver?.();
    this.resolver = null;
  }

  private getDefaultTitle(variant: AlertDialogVariant): string {
    switch (variant) {
      case 'success':
        return 'Succès';
      case 'warning':
        return 'Attention';
      case 'error':
        return 'Erreur';
      default:
        return 'Information';
    }
  }
}
