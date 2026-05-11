import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AnneeUniversitaire } from '../models/annee-universitaire.model';

@Injectable({
  providedIn: 'root'
})
export class AnneeUniversitaireService {
  private apiUrl = `${environment.apiUrl}/annee-universitaire`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<AnneeUniversitaire[]> {
    return this.http.get<AnneeUniversitaire[]>(`${this.apiUrl}?t=${new Date().getTime()}`);
  }

  getById(id: number): Observable<AnneeUniversitaire> {
    return this.http.get<AnneeUniversitaire>(`${this.apiUrl}/${id}?t=${new Date().getTime()}`);
  }

  create(anneeUniversitaire: AnneeUniversitaire): Observable<AnneeUniversitaire> {
    return this.http.post<AnneeUniversitaire>(this.apiUrl, anneeUniversitaire);
  }

  update(id: number, anneeUniversitaire: AnneeUniversitaire): Observable<AnneeUniversitaire> {
    return this.http.put<AnneeUniversitaire>(`${this.apiUrl}/${id}`, anneeUniversitaire);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
