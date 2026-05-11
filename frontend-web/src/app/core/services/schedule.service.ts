import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EmploiDuTemps, Seance } from '../models/schedule.model';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private scheduleUrl = `${environment.apiUrl}/emploi-du-temps`;
  private seanceUrl = `${environment.apiUrl}/seances`;

  constructor(private http: HttpClient) {}

  getAllSchedules(): Observable<EmploiDuTemps[]> {
    return this.http.get<EmploiDuTemps[]>(this.scheduleUrl);
  }

  getScheduleById(id: number): Observable<EmploiDuTemps> {
    return this.http.get<EmploiDuTemps>(`${this.scheduleUrl}/${id}`);
  }

  createSchedule(schedule: EmploiDuTemps): Observable<EmploiDuTemps> {
    return this.http.post<EmploiDuTemps>(this.scheduleUrl, schedule);
  }

  updateSchedule(id: number, schedule: EmploiDuTemps): Observable<EmploiDuTemps> {
    return this.http.put<EmploiDuTemps>(`${this.scheduleUrl}/${id}`, schedule);
  }

  deleteSchedule(id: number): Observable<void> {
    return this.http.delete<void>(`${this.scheduleUrl}/${id}`);
  }

  importSchedules(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${this.scheduleUrl}/import`, formData);
  }

  getAllSeances(): Observable<Seance[]> {
    return this.http.get<Seance[]>(this.seanceUrl);
  }

  getSeanceById(id: number): Observable<Seance> {
    return this.http.get<Seance>(`${this.seanceUrl}/${id}`);
  }

  createSeance(seance: Seance): Observable<Seance> {
    return this.http.post<Seance>(this.seanceUrl, seance);
  }

  updateSeance(id: number, seance: Seance): Observable<Seance> {
    return this.http.put<Seance>(`${this.seanceUrl}/${id}`, seance);
  }

  deleteSeance(id: number): Observable<void> {
    return this.http.delete<void>(`${this.seanceUrl}/${id}`);
  }
}
