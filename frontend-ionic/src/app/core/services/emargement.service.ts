import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfigService } from './api-config.service';
import {
  EmargementRequest,
  Emargement,
  EmargementScanResponse,
} from '../models/attendance.model';

@Injectable({ providedIn: 'root' })
export class EmargementService {
  private readonly http = inject(HttpClient);
  private readonly apiConfig = inject(ApiConfigService);

  scanQRCode(payload: EmargementRequest): Observable<EmargementScanResponse> {
    return this.http.post<EmargementScanResponse>(
      this.apiConfig.buildUrl('emargements/scan'),
      payload,
    );
  }

  getEmargements(): Observable<Emargement[]> {
    return this.http.get<Emargement[]>(this.apiConfig.buildUrl('emargements'));
  }
}
