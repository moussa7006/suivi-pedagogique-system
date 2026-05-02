import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import {
  CahierDeTexteDto,
  CahierDeTexteRequest,
  EmargementRequest,
  SeanceDto,
} from "../models/enseignant.models";

@Injectable({ providedIn: "root" })
export class EnseignantApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  getSeances(): Observable<SeanceDto[]> {
    return this.http.get<SeanceDto[]>(`${this.baseUrl}/seances`);
  }

  getEmploiDuTemps(): Observable<SeanceDto[]> {
    return this.http.get<SeanceDto[]>(`${this.baseUrl}/emploi-du-temps`);
  }

  getCahierDeTextes(): Observable<CahierDeTexteDto[]> {
    return this.http.get<CahierDeTexteDto[]>(`${this.baseUrl}/cahier-texte`);
  }

  publierCahierDeTexte(
    seanceId: number,
    payload: CahierDeTexteRequest,
  ): Observable<string> {
    return this.http.post(`${this.baseUrl}/cahier-texte/${seanceId}`, payload, {
      responseType: "text",
    });
  }

  scannerEmargement(payload: EmargementRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/emargements/scan`, payload);
  }
}
