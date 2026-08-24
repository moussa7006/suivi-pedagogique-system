import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Salle } from '../models/salle.model';

@Injectable({
  providedIn: 'root'
})
export class SalleService {
  private apiUrl = `${environment.apiUrl}/salles`;
  private cachedSalles$?: Observable<Salle[]>;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Salle[]> {
    if (!this.cachedSalles$) {
      this.cachedSalles$ = this.http
        .get<Salle[]>(this.apiUrl)
        .pipe(shareReplay({ bufferSize: 1, refCount: true }));
    }
    return this.cachedSalles$;
  }

  invalidateCache(): void {
    this.cachedSalles$ = undefined;
  }

  getById(id: number): Observable<Salle> {
    return this.http.get<Salle>(`${this.apiUrl}/${id}?t=${new Date().getTime()}`);
  }

  create(salle: Salle): Observable<Salle> {
    return this.http.post<Salle>(this.apiUrl, salle).pipe(
      tap(() => this.invalidateCache()),
    );
  }

  update(id: number, salle: Salle): Observable<Salle> {
    return this.http.put<Salle>(`${this.apiUrl}/${id}`, salle).pipe(
      tap(() => this.invalidateCache()),
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.invalidateCache()),
    );
  }
}
