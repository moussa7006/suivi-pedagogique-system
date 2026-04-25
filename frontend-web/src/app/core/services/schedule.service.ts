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

  createSchedule(schedule: EmploiDuTemps): Observable<EmploiDuTemps> {
    return this.http.post<EmploiDuTemps>(this.scheduleUrl, schedule);
  }

  deleteSchedule(id: number): Observable<void> {
    return this.http.delete<void>(`${this.scheduleUrl}/${id}`);
  }

  getAllSeances(): Observable<Seance[]> {
    return this.http.get<Seance[]>(this.seanceUrl);
  }
}
