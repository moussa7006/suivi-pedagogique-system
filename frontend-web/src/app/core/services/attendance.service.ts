import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Emargement } from '../models/attendance.model';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private apiUrl = `${environment.apiUrl}/emargements`;

  constructor(private http: HttpClient) {}

  getAllAttendances(): Observable<Emargement[]> {
    return this.http.get<Emargement[]>(this.apiUrl);
  }

  validateAttendance(id: number): Observable<Emargement> {
    // Supposons une route spécifique pour valider ou juste un update
    return this.http.put<Emargement>(`${this.apiUrl}/${id}`, { statut: 'Validé' });
  }
}
