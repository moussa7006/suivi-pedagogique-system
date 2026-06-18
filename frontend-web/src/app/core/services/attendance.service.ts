import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Emargement, EmargementRequest } from '../models/attendance.model';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  private apiUrl = `${environment.apiUrl}/emargements`;

  constructor(private http: HttpClient) {}

  getAllAttendances(): Observable<Emargement[]> {
    return this.http.get<Emargement[]>(this.apiUrl);
  }

  scanQRCode(request: EmargementRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/scan`, request);
  }

  exportEmargementsExcel(): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/export/emargements/excel`, {
      responseType: 'blob',
    });
  }
}
