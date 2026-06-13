import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Departement } from '../models/departement.model';

@Injectable({
  providedIn: 'root'
})
export class DepartementService {
  private apiUrl = `${environment.apiUrl}/departements`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Departement[]> {
    return this.http.get<Departement[]>(`${this.apiUrl}?t=${new Date().getTime()}`);
  }

  getById(id: number): Observable<Departement> {
    return this.http.get<Departement>(`${this.apiUrl}/${id}?t=${new Date().getTime()}`);
  }

  create(departement: Departement): Observable<Departement> {
    return this.http.post<Departement>(this.apiUrl, departement);
  }

  update(id: number, departement: Departement): Observable<Departement> {
    return this.http.put<Departement>(`${this.apiUrl}/${id}`, departement);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
