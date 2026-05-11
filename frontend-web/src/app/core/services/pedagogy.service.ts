import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FicheProgression, FicheProgressionRequest } from '../models/lesson-log.model';

@Injectable({
  providedIn: 'root'
})
export class PedagogyService {
  private apiUrl = `${environment.apiUrl}/fiche-progression`;

  constructor(private http: HttpClient) {}

  getFicheProgressions(): Observable<FicheProgression[]> {
    return this.http.get<FicheProgression[]>(this.apiUrl);
  }

  remplirFicheProgression(seanceId: number, request: FicheProgressionRequest): Observable<FicheProgression> {
    return this.http.post<FicheProgression>(`${this.apiUrl}/${seanceId}`, request);
  }

  validerFicheProgression(id: number, estValideAdmin: boolean): Observable<FicheProgression> {
    return this.http.put<FicheProgression>(`${this.apiUrl}/${id}/valider`, { estValideAdmin });
  }

  // Alias pour la rétrocompatibilité
  getLessonLogs(): Observable<FicheProgression[]> {
    return this.getFicheProgressions();
  }
}
