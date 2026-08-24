import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Classe } from '../models/classe.model';

@Injectable({
  providedIn: 'root'
})
export class ClasseService {
  private apiUrl = `${environment.apiUrl}/classes`;
  private cachedClasses$?: Observable<Classe[]>;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Classe[]> {
    if (!this.cachedClasses$) {
      this.cachedClasses$ = this.http
        .get<Classe[]>(this.apiUrl)
        .pipe(shareReplay({ bufferSize: 1, refCount: true }));
    }
    return this.cachedClasses$;
  }

  invalidateCache(): void {
    this.cachedClasses$ = undefined;
  }

  getById(id: number): Observable<Classe> {
    return this.http.get<Classe>(`${this.apiUrl}/${id}?t=${new Date().getTime()}`);
  }

  create(classe: Classe): Observable<Classe> {
    return this.http.post<Classe>(this.apiUrl, classe).pipe(
      tap(() => this.invalidateCache()),
    );
  }

  update(id: number, classe: Classe): Observable<Classe> {
    return this.http.put<Classe>(`${this.apiUrl}/${id}`, classe).pipe(
      tap(() => this.invalidateCache()),
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.invalidateCache()),
    );
  }
}
