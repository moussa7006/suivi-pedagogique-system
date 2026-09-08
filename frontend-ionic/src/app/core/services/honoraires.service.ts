import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { ApiConfigService } from './api-config.service';
import { HonorairesCalcul } from '../models/honoraires.model';

@Injectable({ providedIn: 'root' })
export class HonorairesService {
  private readonly http = inject(HttpClient);
  private readonly apiConfig = inject(ApiConfigService);
  private cachedHonoraires$?: Observable<HonorairesCalcul[]>;

  getMesHonoraires(): Observable<HonorairesCalcul[]> {
    if (!this.cachedHonoraires$) {
      this.cachedHonoraires$ = this.http
        .get<HonorairesCalcul[]>(this.apiConfig.buildUrl('honoraires/mes-honoraires'))
        .pipe(shareReplay({ bufferSize: 1, refCount: true }));
    }
    return this.cachedHonoraires$;
  }

  invalidateCache(): void {
    this.cachedHonoraires$ = undefined;
  }

  getMesHonorairesParMois(
    annee: number,
    mois: number,
  ): Observable<HonorairesCalcul> {
    const params = new HttpParams().set('annee', annee).set('mois', mois);
    return this.http.get<HonorairesCalcul>(
      this.apiConfig.buildUrl('honoraires/mes-honoraires/mois'),
      { params },
    );
  }

  getById(id: number): Observable<HonorairesCalcul> {
    return this.http.get<HonorairesCalcul>(
      this.apiConfig.buildUrl(`honoraires/${id}`),
    );
  }
}
