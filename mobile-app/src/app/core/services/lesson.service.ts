import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface LessonEntry {
  subjectId: number;
  chapter: string;
  summary: string;
  duration: number;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  submitLesson(entry: LessonEntry): Observable<boolean> {
    console.log('Envoi du cahier de textes:', entry);
    // Simulation d'envoi API
    return of(true).pipe(delay(1500));
  }
}
