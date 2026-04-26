import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Teacher } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/utilisateurs`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(`${this.apiUrl}/lister-tous?t=${new Date().getTime()}`);
  }

  getUserById(id: number): Observable<Teacher> {
    return this.http.get<Teacher>(`${this.apiUrl}/lister/${id}?t=${new Date().getTime()}`);
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

  importTeachers(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${this.apiUrl}/import-enseignants`, formData);
  }
}

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private apiUrl = `${environment.apiUrl}/utilisateurs`;

  constructor(private http: HttpClient) {}

  getTeachers(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(`${this.apiUrl}/lister-tous?t=${new Date().getTime()}`).pipe(
      map(users => users.filter(u => u.role === 'ENSEIGNANT' || u.role === 'enseignant'))
    );
  }

  getTeacherById(id: number): Observable<Teacher> {
    return this.http.get<Teacher>(`${this.apiUrl}/lister/${id}?t=${new Date().getTime()}`);
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

  importTeachers(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${this.apiUrl}/import-enseignants`, formData);
  }
}
