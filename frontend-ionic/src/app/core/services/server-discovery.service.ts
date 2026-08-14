import { Injectable, inject } from '@angular/core';
import { ApiConfigService } from './api-config.service';

const DISCOVERY_PORT = 8099;
const PROBE_TIMEOUT_MS = 600;
const CONCURRENCY = 16;

/**
 * Sous-réseaux privés les plus courants, scannés pour trouver le backend
 * EduTrack sur le même réseau local (LAN). L'utilisateur n'a plus besoin
 * de saisir manuellement l'IP du PC qui exécute le backend.
 *
 * Les hotspots mobiles (souvent utilisés en soutenance) sont en premier :
 *  - Android hotspot : 192.168.43.x / 192.168.x
 *  - iPhone hotspot  : 172.20.10.x
 */
const CANDIDATE_SUBNETS = [
  '192.168.43', // Partage connexion Android
  '172.20.10',  // Partage connexion iPhone
  '10.62.103',  // Ton réseau Wi-Fi actuel !
  '192.168.1',
  '192.168.0',
  '10.0.0',
  '10.0.1',
  '172.16.0',
];

@Injectable({ providedIn: 'root' })
export class ServerDiscoveryService {
  private apiConfig = inject(ApiConfigService);

  /**
   * Scanne le réseau local à la recherche du backend EduTrack.
   * Retourne l'URL de base détectée (ex: http://192.168.1.15:8099/api)
   * ou null si aucun serveur n'a été trouvé.
   */
  async autoDetect(): Promise<string | null> {
    for (const subnet of CANDIDATE_SUBNETS) {
      const found = await this.scanSubnet(subnet);
      if (found) {
        return found;
      }
    }
    return null;
  }

  private async scanSubnet(subnet: string): Promise<string | null> {
    const hosts: string[] = [];
    // On ignore .0 et .255 (réseau/broadcast), et .1 est souvent la box.
    for (let i = 1; i <= 254; i++) {
      hosts.push(`${subnet}.${i}`);
    }

    for (let i = 0; i < hosts.length; i += CONCURRENCY) {
      const batch = hosts.slice(i, i + CONCURRENCY);
      const results = await Promise.all(batch.map((h) => this.probeHost(h)));
      const found = results.find((r): r is string => r !== null);
      if (found) {
        return found;
      }
    }
    return null;
  }

  private async probeHost(host: string): Promise<string | null> {
    const url = `http://${host}:${DISCOVERY_PORT}/api/health`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);

    try {
      // mode "no-cors" : on ne lit pas la réponse, on détecte simplement
      // qu'un serveur répond sur ce port. Un échec réseau (connexion
      // refusée / timeout) lève une exception et on passe au suivant.
      await fetch(url, { signal: controller.signal, mode: 'no-cors' });
      const base = `http://${host}:${DISCOVERY_PORT}/api`;
      this.apiConfig.setServerIp(base);
      return base;
    } catch {
      return null;
    } finally {
      clearTimeout(timer);
    }
  }
}
