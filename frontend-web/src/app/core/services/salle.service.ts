import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Salle } from '../models/salle.model';

@Injectable({
  providedIn: 'root'
})
export class SalleService {
  private apiUrl = `${environment.apiUrl}/salles`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Salle[]> {
    return this.http.get<Salle[]>(`${this.apiUrl}?t=${new Date().getTime()}`);
  }

  getById(id: number): Observable<Salle> {
    return this.http.get<Salle>(`${this.apiUrl}/${id}?t=${new Date().getTime()}`);
  }

  create(salle: Salle): Observable<Salle> {
    return this.http.post<Salle>(this.apiUrl, salle);
  }

  update(id: number, salle: Salle): Observable<Salle> {
    return this.http.put<Salle>(`${this.apiUrl}/${id}`, salle);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
