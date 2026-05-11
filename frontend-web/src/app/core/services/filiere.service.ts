import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Filiere } from '../models/filiere.model';

@Injectable({
  providedIn: 'root'
})
export class FiliereService {
  private apiUrl = `${environment.apiUrl}/filieres`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Filiere[]> {
    return this.http.get<Filiere[]>(`${this.apiUrl}?t=${new Date().getTime()}`);
  }

  getById(id: number): Observable<Filiere> {
    return this.http.get<Filiere>(`${this.apiUrl}/${id}?t=${new Date().getTime()}`);
  }

  create(filiere: Filiere): Observable<Filiere> {
    return this.http.post<Filiere>(this.apiUrl, filiere);
  }

  update(id: number, filiere: Filiere): Observable<Filiere> {
    return this.http.put<Filiere>(`${this.apiUrl}/${id}`, filiere);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
