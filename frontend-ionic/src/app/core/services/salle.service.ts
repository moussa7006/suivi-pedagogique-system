import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { ApiConfigService } from './api-config.service';
import { Salle } from '../models/salle.model';

@Injectable({ providedIn: 'root' })
export class SalleService {
  private readonly http = inject(HttpClient);
  private readonly apiConfig = inject(ApiConfigService);
  private cachedSalles$?: Observable<Salle[]>;

  getAll(): Observable<Salle[]> {
    if (!this.cachedSalles$) {
      this.cachedSalles$ = this.http
        .get<Salle[]>(this.apiConfig.buildUrl('salles'))
        .pipe(shareReplay({ bufferSize: 1, refCount: true }));
    }
    return this.cachedSalles$;
  }

  invalidateCache(): void {
    this.cachedSalles$ = undefined;
  }
}
