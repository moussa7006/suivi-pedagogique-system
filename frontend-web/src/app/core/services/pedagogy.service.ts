import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LessonLog } from '../models/lesson-log.model';

@Injectable({
  providedIn: 'root'
})
export class PedagogyService {
  private apiUrl = `${environment.apiUrl}/cahier-texte`;

  constructor(private http: HttpClient) {}

  getLessonLogs(): Observable<LessonLog[]> {
    return this.http.get<LessonLog[]>(this.apiUrl);
  }

  validateLog(id: number, status: string): Observable<LessonLog> {
    return this.http.put<LessonLog>(`${this.apiUrl}/${id}/valider`, { statutValidite: status });
  }
}
