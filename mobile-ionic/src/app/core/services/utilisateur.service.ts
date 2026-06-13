import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Utilisateur } from "../models/user.model";

@Injectable({ providedIn: "root" })
export class UtilisateurService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  listerTous(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(
      `${this.baseUrl}/utilisateurs/lister-tous`,
    );
  }

  listerParId(id: number): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(
      `${this.baseUrl}/utilisateurs/lister/${id}`,
    );
  }

  modifier(
    id: number,
    utilisateur: Partial<Utilisateur>,
  ): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(
      `${this.baseUrl}/utilisateurs/modifier/${id}`,
      utilisateur,
    );
  }

  modifierPhoto(id: number, photoUrl: string): Observable<Utilisateur> {
    return this.http.patch<Utilisateur>(
      `${this.baseUrl}/utilisateurs/${id}/photo`,
      {
        photoUrl,
      },
    );
  }
}
