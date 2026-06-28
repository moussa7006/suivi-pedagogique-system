import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Classe } from '../models/classe.model';
import { ApiConfigService } from './api-config.service';

@Injectable({ providedIn: 'root' })
export class ClasseService {
  private readonly http = inject(HttpClient);
  private readonly apiConfig = inject(ApiConfigService);

  getAll(): Observable<Classe[]> {
    return this.http.get<Classe[]>(this.apiConfig.buildUrl('classes'));
  }
}
