import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfigService } from './api-config.service';
import { Salle } from '../models/salle.model';

@Injectable({ providedIn: 'root' })
export class SalleService {
  private readonly http = inject(HttpClient);
  private readonly apiConfig = inject(ApiConfigService);

  getAll(): Observable<Salle[]> {
    return this.http.get<Salle[]>(this.apiConfig.buildUrl('salles'));
  }
}
