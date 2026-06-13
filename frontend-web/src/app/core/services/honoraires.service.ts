import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HonorairesCalcul, HonorairesCalculRequest } from '../models/honoraires.model';

@Injectable({ providedIn: 'root' })
export class HonorairesService {
  private readonly apiUrl = `${environment.apiUrl}/honoraires`;

  constructor(private http: HttpClient) {}

  preview(enseignantId: number, annee: number, mois: number): Observable<HonorairesCalcul> {
    const params = new HttpParams()
      .set('enseignantId', enseignantId)
      .set('annee', annee)
      .set('mois', mois);
    return this.http.get<HonorairesCalcul>(`${this.apiUrl}/preview`, { params });
  }

  calculer(request: HonorairesCalculRequest): Observable<HonorairesCalcul> {
    return this.http.post<HonorairesCalcul>(`${this.apiUrl}/calculer`, request);
  }

  getParMois(annee: number, mois: number): Observable<HonorairesCalcul[]> {
    const params = new HttpParams().set('annee', annee).set('mois', mois);
    return this.http.get<HonorairesCalcul[]>(this.apiUrl, { params });
  }

  getEnseignant(enseignantId: number): Observable<HonorairesCalcul[]> {
    return this.http.get<HonorairesCalcul[]>(`${this.apiUrl}/enseignant/${enseignantId}`);
  }

  getMesHonoraires(): Observable<HonorairesCalcul[]> {
    return this.http.get<HonorairesCalcul[]>(`${this.apiUrl}/mes-honoraires`);
  }

  getById(id: number): Observable<HonorairesCalcul> {
    return this.http.get<HonorairesCalcul>(`${this.apiUrl}/${id}`);
  }

  valider(id: number): Observable<HonorairesCalcul> {
    return this.http.patch<HonorairesCalcul>(`${this.apiUrl}/${id}/valider`, {});
  }

  payer(id: number): Observable<HonorairesCalcul> {
    return this.http.patch<HonorairesCalcul>(`${this.apiUrl}/${id}/payer`, {});
  }
}
