import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { environment } from '../../../environments/environment';

const DEFAULT_API_PORT = '8099';
const API_PATH = 'api';

@Injectable({ providedIn: 'root' })
export class ApiConfigService {
  // On garde l'IP en mémoire vive (RAM) uniquement. 
  // Pas de localStorage pour ne jamais bloquer l'app sur un vieux Wi-Fi !
  private memoryUrl: string | null = null;

  getBaseUrl(): string {
    if (this.memoryUrl) {
      return this.memoryUrl;
    }

    // Sur un appareil natif (Capacitor), window.location.hostname vaut "localhost"
    // (l'appareil lui-meme). environment.apiBaseUrl pointerait donc vers le telephone
    // au lieu du PC qui heberge le backend. On renvoie une chaine vide pour laisser
    // le ServerDiscoveryService (ou une saisie manuelle) resoudre la bonne URL.
    if (Capacitor.isNativePlatform()) {
      return '';
    }

    if (environment.apiBaseUrl) {
      return environment.apiBaseUrl;
    }

    return environment.apiUrl;
  }

  hasConfiguredBaseUrl(): boolean {
    return this.getBaseUrl().trim().length > 0;
  }

  // Ajouté pour éviter l'erreur de compilation avec auth.interceptor.ts
  // On retourne null car on n'utilise plus le cache local
  getCustomApiBaseUrl(): string | null {
    return null;
  }

  buildUrl(path: string): string {
    const baseUrl = this.getBaseUrl().replace(/\/+$/, '');
    const normalizedPath = path.replace(/^\/+/, '');

    if (!baseUrl) {
      return `/${normalizedPath}`;
    }

    return `${baseUrl}/${normalizedPath}`;
  }

  getConfiguredServerIp(): string {
    const baseUrl = this.getBaseUrl();

    return baseUrl
      .replace(/^https?:\/\//, '')
      .replace(new RegExp(`/${API_PATH}/?$`), '');
  }

  setServerIp(serverAddress: string): boolean {
    const normalizedUrl = this.normalizeServerAddress(serverAddress);

    if (!normalizedUrl) {
      return false;
    }

    this.memoryUrl = normalizedUrl;
    return true;
  }

  private normalizeServerAddress(serverAddress: string): string | null {
    const rawAddress = serverAddress.trim().replace(/\/+$/, '');

    if (!rawAddress) {
      return null;
    }

    const addressWithProtocol = /^https?:\/\//i.test(rawAddress)
      ? rawAddress
      : `http://${rawAddress}`;

    try {
      const url = new URL(addressWithProtocol);
      const protocol = url.protocol || 'http:';
      const hostname = url.hostname;
      const port = url.port || DEFAULT_API_PORT;
      const apiPath = url.pathname.replace(/^\/+|\/+$/g, '') || API_PATH;

      if (!hostname) {
        return null;
      }

      return `${protocol}//${hostname}:${port}/${apiPath}`;
    } catch {
      return null;
    }
  }
}
