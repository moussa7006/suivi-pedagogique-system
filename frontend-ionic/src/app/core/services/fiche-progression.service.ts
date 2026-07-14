import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfigService } from './api-config.service';
import {
  FicheProgressionRequest,
  FicheProgression,
} from '../models/fiche-progression.model';

@Injectable({ providedIn: 'root' })
export class FicheProgressionService {
  private readonly http = inject(HttpClient);
  private readonly apiConfig = inject(ApiConfigService);

  createFicheProgression(
    seanceId: number,
    payload: FicheProgressionRequest,
  ): Observable<FicheProgression> {
    return this.http.post<FicheProgression>(
      this.apiConfig.buildUrl(`fiche-progression/${seanceId}`),
      payload,
    );
  }

  getFichesProgression(): Observable<FicheProgression[]> {
    return this.http.get<FicheProgression[]>(
      this.apiConfig.buildUrl('fiche-progression'),
    );
  }
}
