import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AlertDialogService } from './alert-dialog.service';

@Component({
  selector: 'app-alert-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container *ngIf="alertDialog.state$ | async as state">
      <div class="alert-backdrop" *ngIf="state.open" (click)="alertDialog.close()">
        <section
          class="alert-dialog"
          [ngClass]="state.variant"
          role="alertdialog"
          aria-modal="true"
          [attr.aria-label]="state.title"
          (click)="$event.stopPropagation()"
        >
          <div class="alert-icon">
            <i class="pi" [ngClass]="getIcon(state.variant)"></i>
          </div>

          <div class="alert-content">
            <h2>{{ state.title }}</h2>
            <p>{{ state.message }}</p>
          </div>

          <div class="alert-actions">
            <button type="button" class="btn-ok" (click)="alertDialog.close()">
              {{ state.okText }}
            </button>
          </div>
        </section>
      </div>
    </ng-container>
  `,
  styleUrl: './alert-dialog.component.scss',
})
export class AlertDialogComponent {
  constructor(public alertDialog: AlertDialogService) {}

  getIcon(variant: string): string {
    switch (variant) {
      case 'success':
        return 'pi-check-circle';
      case 'warning':
        return 'pi-exclamation-triangle';
      case 'error':
        return 'pi-times-circle';
      default:
        return 'pi-info-circle';
    }
  }
}
