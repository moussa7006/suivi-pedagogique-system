import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfigService } from './api-config.service';
import { Utilisateur } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UtilisateurService {
  private readonly http = inject(HttpClient);
  private readonly apiConfig = inject(ApiConfigService);

  listerTous(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(
      this.apiConfig.buildUrl('utilisateurs/lister-tous'),
    );
  }

  listerParId(id: number): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(
      this.apiConfig.buildUrl(`utilisateurs/lister/${id}`),
    );
  }

  modifier(
    id: number,
    utilisateur: Partial<Utilisateur>,
  ): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(
      this.apiConfig.buildUrl(`utilisateurs/modifier/${id}`),
      utilisateur,
    );
  }

  modifierPhoto(id: number, photoUrl: string): Observable<Utilisateur> {
    return this.http.patch<Utilisateur>(
      this.apiConfig.buildUrl(`utilisateurs/${id}/photo`),
      {
        photoUrl,
      },
    );
  }
}
