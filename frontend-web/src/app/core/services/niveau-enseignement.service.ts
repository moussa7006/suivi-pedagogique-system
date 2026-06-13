import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { NiveauEnseignement } from '../models/niveau-enseignement.model';

@Injectable({
  providedIn: 'root'
})
export class NiveauEnseignementService {
  private apiUrl = `${environment.apiUrl}/niveau-enseignement`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<NiveauEnseignement[]> {
    return this.http.get<NiveauEnseignement[]>(`${this.apiUrl}?t=${new Date().getTime()}`);
  }

  getById(id: number): Observable<NiveauEnseignement> {
    return this.http.get<NiveauEnseignement>(`${this.apiUrl}/${id}?t=${new Date().getTime()}`);
  }

  create(niveauEnseignement: NiveauEnseignement): Observable<NiveauEnseignement> {
    return this.http.post<NiveauEnseignement>(this.apiUrl, niveauEnseignement);
  }

  update(id: number, niveauEnseignement: NiveauEnseignement): Observable<NiveauEnseignement> {
    return this.http.put<NiveauEnseignement>(`${this.apiUrl}/${id}`, niveauEnseignement);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
