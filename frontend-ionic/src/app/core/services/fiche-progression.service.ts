import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay, tap } from 'rxjs';
import { ApiConfigService } from './api-config.service';
import {
  FicheProgressionRequest,
  FicheProgression,
} from '../models/fiche-progression.model';

@Injectable({ providedIn: 'root' })
export class FicheProgressionService {
  private readonly http = inject(HttpClient);
  private readonly apiConfig = inject(ApiConfigService);
  private cachedFiches$?: Observable<FicheProgression[]>;

  createFicheProgression(
    seanceId: number,
    payload: FicheProgressionRequest,
  ): Observable<FicheProgression> {
    return this.http.post<FicheProgression>(
      this.apiConfig.buildUrl(`fiche-progression/${seanceId}`),
      payload,
    ).pipe(
      tap(() => this.invalidateCache()),
    );
  }

  getFichesProgression(): Observable<FicheProgression[]> {
    if (!this.cachedFiches$) {
      this.cachedFiches$ = this.http
        .get<FicheProgression[]>(this.apiConfig.buildUrl('fiche-progression'))
        .pipe(shareReplay({ bufferSize: 1, refCount: true }));
    }
    return this.cachedFiches$;
  }

  invalidateCache(): void {
    this.cachedFiches$ = undefined;
  }
}
