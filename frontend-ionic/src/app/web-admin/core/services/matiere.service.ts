import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Matiere } from '../models/matiere.model';

@Injectable({
  providedIn: 'root'
})
export class MatiereService {
  private apiUrl = `${environment.apiUrl}/matieres`;
  private cachedMatieres$?: Observable<Matiere[]>;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Matiere[]> {
    if (!this.cachedMatieres$) {
      this.cachedMatieres$ = this.http
        .get<Matiere[]>(this.apiUrl)
        .pipe(shareReplay({ bufferSize: 1, refCount: true }));
    }
    return this.cachedMatieres$;
  }

  invalidateCache(): void {
    this.cachedMatieres$ = undefined;
  }

  getById(id: number): Observable<Matiere> {
    return this.http.get<Matiere>(`${this.apiUrl}/${id}`);
  }

  create(matiere: Matiere): Observable<Matiere> {
    return this.http.post<Matiere>(this.apiUrl, matiere).pipe(
      tap(() => this.invalidateCache()),
    );
  }

  update(id: number, matiere: Matiere): Observable<Matiere> {
    return this.http.put<Matiere>(`${this.apiUrl}/${id}`, matiere).pipe(
      tap(() => this.invalidateCache()),
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.invalidateCache()),
    );
  }
}
