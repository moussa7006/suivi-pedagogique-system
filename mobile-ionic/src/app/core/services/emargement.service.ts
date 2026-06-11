import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import {
  EmargementRequest,
  Emargement,
  EmargementScanResponse,
} from "../models/attendance.model";

@Injectable({ providedIn: "root" })
export class EmargementService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  scanQRCode(payload: EmargementRequest): Observable<EmargementScanResponse> {
    return this.http.post<EmargementScanResponse>(
      `${this.baseUrl}/emargements/scan`,
      payload,
    );
  }

  getEmargements(): Observable<Emargement[]> {
    return this.http.get<Emargement[]>(`${this.baseUrl}/emargements`);
  }
}
