import { Injectable, inject } from '@angular/core';
import { CapacitorWifi } from '@capgo/capacitor-wifi';
import { ApiConfigService } from './api-config.service';

const DISCOVERY_PORT = 8099;
const PROBE_TIMEOUT_MS = 400;
const CONCURRENCY = 32;

/**
 * Sous-réseaux privés les plus courants, utilisés uniquement en secours
 * lorsque l'on ne peut pas déduire le sous-réseau depuis l'IP du téléphone
 * (ex: navigateur web, permission Wi-Fi refusée, aucune IP récupérée).
 *
 * La détection principale dérive désormais le sous-réseau de l'IP locale
 * de l'appareil via @capgo/capacitor-wifi, ce qui est beaucoup plus rapide
 * et ne dépend plus d'une liste figée.
 */
const FALLBACK_SUBNETS = [
  '192.168.43', // Partage connexion Android
  '172.20.10', // Partage connexion iPhone
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
    // 1) On essaie de déduire le sous-réseau exact depuis l'IP du téléphone.
    const deviceSubnet = await this.getDeviceSubnet();

    if (deviceSubnet) {
      const found = await this.scanSubnet(deviceSubnet);
      if (found) {
        return found;
      }
    }

    // 2) Sinon (ou si rien trouvé), on retombe sur les sous-réseaux courants.
    const subnets = this.uniqueSubnets([
      ...(deviceSubnet ? [deviceSubnet] : []),
      ...FALLBACK_SUBNETS,
    ]);

    for (const subnet of subnets) {
      const found = await this.scanSubnet(subnet);
      if (found) {
        return found;
      }
    }

    return null;
  }

  /**
   * Récupère l'IP locale de l'appareil et en extrait les 3 premiers octets
   * (le préfixe /24). Ex: "192.168.1.42" -> "192.168.1".
   * Retourne null si indisponible (navigateur, permission refusée, IPv6...).
   */
  private async getDeviceSubnet(): Promise<string | null> {
    try {
      const { ipAddress } = await CapacitorWifi.getIpAddress();
      return extractSubnet(ipAddress);
    } catch {
      return null;
    }
  }

  private uniqueSubnets(subnets: string[]): string[] {
    return Array.from(new Set(subnets));
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

/**
 * Extrait le préfixe /24 d'une adresse IPv4 valide.
 * Ex: "192.168.1.42" -> "192.168.1". Retourne null sinon.
 */
function extractSubnet(ipAddress: string | undefined | null): string | null {
  if (!ipAddress) {
    return null;
  }

  const match = ipAddress.trim().match(
    /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.\d{1,3}$/,
  );
  if (!match) {
    return null;
  }

  const octets = match.slice(1).map(Number);
  if (octets.some((octet) => octet < 0 || octet > 255)) {
    return null;
  }

  return `${octets[0]}.${octets[1]}.${octets[2]}`;
}
