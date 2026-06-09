import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Matiere } from "../models/matiere.model";

@Injectable({ providedIn: "root" })
export class MatiereService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  getAll(): Observable<Matiere[]> {
    return this.http.get<Matiere[]>(`${this.baseUrl}/matieres`);
  }
}
