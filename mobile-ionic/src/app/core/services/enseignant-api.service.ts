import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import {
  FicheProgressionDto,
  FicheProgressionRequest,
  EmargementRequest,
  SeanceDto,
  EmploiDuTempsDto
} from "../models/enseignant.models";

@Injectable({ providedIn: "root" })
export class EnseignantApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  getSeances(): Observable<SeanceDto[]> {
    return this.http.get<SeanceDto[]>(`${this.baseUrl}/seances`);
  }

  getEmploiDuTemps(): Observable<EmploiDuTempsDto[]> {
    return this.http.get<EmploiDuTempsDto[]>(`${this.baseUrl}/emploi-du-temps`);
  }

  getCahierDeTextes(): Observable<FicheProgressionDto[]> {
    return this.http.get<FicheProgressionDto[]>(`${this.baseUrl}/fiche-progression`);
  }

  publierCahierDeTexte(
    seanceId: number,
    payload: FicheProgressionRequest,
  ): Observable<string> {
    return this.http.post(`${this.baseUrl}/fiche-progression/${seanceId}`, payload, {
      responseType: "text",
    });
  }

  scannerEmargement(payload: EmargementRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/emargements/scan`, payload);
  }
}
