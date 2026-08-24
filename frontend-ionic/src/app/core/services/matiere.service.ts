import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { ApiConfigService } from './api-config.service';
import { Matiere } from '../models/matiere.model';

@Injectable({ providedIn: 'root' })
export class MatiereService {
  private readonly http = inject(HttpClient);
  private readonly apiConfig = inject(ApiConfigService);
  private cachedMatieres$?: Observable<Matiere[]>;

  getAll(): Observable<Matiere[]> {
    if (!this.cachedMatieres$) {
      this.cachedMatieres$ = this.http
        .get<Matiere[]>(this.apiConfig.buildUrl('matieres'))
        .pipe(shareReplay({ bufferSize: 1, refCount: true }));
    }
    return this.cachedMatieres$;
  }

  invalidateCache(): void {
    this.cachedMatieres$ = undefined;
  }
}
