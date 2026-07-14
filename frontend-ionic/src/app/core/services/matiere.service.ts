import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfigService } from './api-config.service';
import { Matiere } from '../models/matiere.model';

@Injectable({ providedIn: 'root' })
export class MatiereService {
  private readonly http = inject(HttpClient);
  private readonly apiConfig = inject(ApiConfigService);

  getAll(): Observable<Matiere[]> {
    return this.http.get<Matiere[]>(this.apiConfig.buildUrl('matieres'));
  }
}
