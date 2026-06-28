import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfigService } from './api-config.service';
import { EmploiDuTemps } from '../models/schedule.model';
import { Seance } from '../models/seance.model';

@Injectable({ providedIn: 'root' })
export class ScheduleService {
  private readonly http = inject(HttpClient);
  private readonly apiConfig = inject(ApiConfigService);

  getEmploisDuTemps(): Observable<EmploiDuTemps[]> {
    return this.http.get<EmploiDuTemps[]>(
      this.apiConfig.buildUrl('emploi-du-temps'),
    );
  }

  getSeances(): Observable<Seance[]> {
    return this.http.get<Seance[]>(this.apiConfig.buildUrl('seances'));
  }
}
