import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SeanceService {
  private isCahierFaitSubject = new BehaviorSubject<boolean>(false);
  isCahierFait$ = this.isCahierFaitSubject.asObservable();

  private totalHeuresSubject = new BehaviorSubject<number>(85); // Valeur initiale par défaut
  totalHeures$ = this.totalHeuresSubject.asObservable();

  setTableauFait(status: boolean) {
    this.isCahierFaitSubject.next(status);
  }

  setTotalHeures(heures: number) {
    this.totalHeuresSubject.next(heures);
  }

  get isCahierFait(): boolean {
    return this.isCahierFaitSubject.value;
  }

  get totalHeures(): number {
    return this.totalHeuresSubject.value;
  }
}
