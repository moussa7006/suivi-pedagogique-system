import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfigService } from '../../../core/services/api-config.service';
import { ArchiveAnnee } from '../../../core/models/archive.model';

@Injectable({ providedIn: 'root' })
export class ArchiveService {
  private readonly http = inject(HttpClient);
  private readonly apiConfig = inject(ApiConfigService);

  getArchive(anneeId: number): Observable<ArchiveAnnee> {
    return this.http.get<ArchiveAnnee>(this.apiConfig.buildUrl(`archives/${anneeId}`));
  }
}
