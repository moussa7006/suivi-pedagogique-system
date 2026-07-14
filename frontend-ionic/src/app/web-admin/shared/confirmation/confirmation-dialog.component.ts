import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConfirmationService } from './confirmation.service';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container *ngIf="confirmationService.dialog$ | async as dialog">
      <div class="confirm-backdrop" (click)="confirmationService.close(false)">
        <div class="confirm-card" (click)="$event.stopPropagation()">
          <div class="confirm-icon" [ngClass]="dialog.variant">
            <i class="pi" [ngClass]="dialog.variant === 'danger' ? 'pi-trash' : 'pi-question-circle'"></i>
          </div>
          <div class="confirm-content">
            <h3>{{ dialog.title }}</h3>
            <p>{{ dialog.message }}</p>
          </div>
          <div class="confirm-actions">
            <button type="button" class="btn-cancel" (click)="confirmationService.close(false)">
              {{ dialog.cancelText }}
            </button>
            <button type="button" class="btn-confirm" [ngClass]="dialog.variant" (click)="confirmationService.close(true)">
              {{ dialog.confirmText }}
            </button>
          </div>
        </div>
      </div>
    </ng-container>
  `,
  styleUrl: './confirmation-dialog.component.scss',
})
export class ConfirmationDialogComponent {
  constructor(public confirmationService: ConfirmationService) {}
}
