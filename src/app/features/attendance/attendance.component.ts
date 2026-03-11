import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule],
  template: '<div class="card"><h2>Suivi des Émargements</h2><p>Consultez les présences en temps réel.</p></div>'
})
export class AttendanceComponent {}
