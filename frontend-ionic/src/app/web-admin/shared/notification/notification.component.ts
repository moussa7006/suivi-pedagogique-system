import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NotificationService, NotificationType } from './notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification-container" aria-live="polite" aria-atomic="true">
      <div
        *ngFor="let notification of notificationService.notifications$ | async"
        class="notification-toast"
        [ngClass]="notification.type"
      >
        <div class="notification-icon">
          <i class="pi" [ngClass]="getIcon(notification.type)"></i>
        </div>
        <div class="notification-content">
          <strong>{{ notification.title }}</strong>
          <span>{{ notification.message }}</span>
        </div>
        <button type="button" class="notification-close" (click)="notificationService.dismiss(notification.id)" aria-label="Fermer">
          <i class="pi pi-times"></i>
        </button>
      </div>
    </div>
  `,
  styleUrl: './notification.component.scss',
})
export class NotificationComponent {
  constructor(public notificationService: NotificationService) {}

  getIcon(type: NotificationType): string {
    switch (type) {
      case 'success':
        return 'pi-check-circle';
      case 'warning':
        return 'pi-exclamation-circle';
      case 'info':
        return 'pi-info-circle';
      default:
        return 'pi-exclamation-triangle';
    }
  }
}
