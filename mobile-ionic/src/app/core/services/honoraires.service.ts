import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { HonorairesCalcul } from "../models/honoraires.model";

@Injectable({ providedIn: "root" })
export class HonorairesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  getMesHonoraires(): Observable<HonorairesCalcul[]> {
    return this.http.get<HonorairesCalcul[]>(
      `${this.baseUrl}/honoraires/mes-honoraires`,
    );
  }

  getMesHonorairesParMois(
    annee: number,
    mois: number,
  ): Observable<HonorairesCalcul> {
    const params = new HttpParams().set("annee", annee).set("mois", mois);
    return this.http.get<HonorairesCalcul>(
      `${this.baseUrl}/honoraires/mes-honoraires/mois`,
      { params },
    );
  }

  getById(id: number): Observable<HonorairesCalcul> {
    return this.http.get<HonorairesCalcul>(`${this.baseUrl}/honoraires/${id}`);
  }
}
