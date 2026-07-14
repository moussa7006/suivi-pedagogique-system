import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type NotificationType = 'error' | 'success' | 'info' | 'warning';

export interface AppNotification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly notificationsSubject = new BehaviorSubject<AppNotification[]>([]);
  readonly notifications$ = this.notificationsSubject.asObservable();
  private nextId = 1;

  error(message: string, title = 'Erreur'): void {
    this.show('error', title, message);
  }

  success(message: string, title = 'Succès'): void {
    this.show('success', title, message);
  }

  info(message: string, title = 'Information'): void {
    this.show('info', title, message);
  }

  warning(message: string, title = 'Attention'): void {
    this.show('warning', title, message);
  }

  dismiss(id: number): void {
    this.notificationsSubject.next(this.notificationsSubject.value.filter((item) => item.id !== id));
  }

  private show(type: NotificationType, title: string, message: string): void {
    const notification: AppNotification = {
      id: this.nextId++,
      type,
      title,
      message,
    };

    this.notificationsSubject.next([...this.notificationsSubject.value, notification]);
    setTimeout(() => this.dismiss(notification.id), 5500);
  }
}
