import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { Classe } from '../models/classe.model';
import { ApiConfigService } from './api-config.service';

@Injectable({ providedIn: 'root' })
export class ClasseService {
  private readonly http = inject(HttpClient);
  private readonly apiConfig = inject(ApiConfigService);
  private cachedClasses$?: Observable<Classe[]>;

  getAll(): Observable<Classe[]> {
    if (!this.cachedClasses$) {
      this.cachedClasses$ = this.http
        .get<Classe[]>(this.apiConfig.buildUrl('classes'))
        .pipe(shareReplay({ bufferSize: 1, refCount: true }));
    }
    return this.cachedClasses$;
  }

  invalidateCache(): void {
    this.cachedClasses$ = undefined;
  }
}
