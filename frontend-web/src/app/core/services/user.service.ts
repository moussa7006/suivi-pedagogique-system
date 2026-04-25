import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Teacher } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/utilisateurs`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(`${this.apiUrl}/lister-tous`);
  }

  getUserById(id: number): Observable<Teacher> {
    return this.http.get<Teacher>(`${this.apiUrl}/lister/${id}`);
  }

  create(user: Teacher): Observable<any> {
    const registerUrl = `${environment.apiUrl}/auth/register`;
    return this.http.post<any>(registerUrl, user);
  }

  update(id: number, user: Teacher): Observable<Teacher> {
    return this.http.put<Teacher>(`${this.apiUrl}/modifier/${id}`, user);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/supprimer/${id}`);
  }
}

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private apiUrl = `${environment.apiUrl}/utilisateurs`;

  constructor(private http: HttpClient) {}

  getTeachers(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(`${this.apiUrl}/lister-tous`);
  }

  getTeacherById(id: number): Observable<Teacher> {
    return this.http.get<Teacher>(`${this.apiUrl}/lister/${id}`);
  }

  create(teacher: Teacher): Observable<any> {
    const registerUrl = `${environment.apiUrl}/auth/register`;
    return this.http.post<any>(registerUrl, teacher);
  }

  update(id: number, teacher: Teacher): Observable<Teacher> {
    return this.http.put<Teacher>(`${this.apiUrl}/modifier/${id}`, teacher);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/supprimer/${id}`);
  }
}
