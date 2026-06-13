import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { EmploiDuTemps } from "../models/schedule.model";
import { Seance } from "../models/seance.model";

@Injectable({ providedIn: "root" })
export class ScheduleService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  getEmploisDuTemps(): Observable<EmploiDuTemps[]> {
    return this.http.get<EmploiDuTemps[]>(`${this.baseUrl}/emploi-du-temps`);
  }

  getSeances(): Observable<Seance[]> {
    return this.http.get<Seance[]>(`${this.baseUrl}/seances`);
  }
}
