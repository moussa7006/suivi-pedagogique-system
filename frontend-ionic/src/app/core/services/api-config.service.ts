import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { environment } from '../../../environments/environment';

<<<<<<< HEAD
const CUSTOM_API_URL_KEY = 'custom_api_url';
=======
>>>>>>> d6b8d3bf8fe91554ef39feb5f2aba44b33093b1d
const DEFAULT_API_PORT = '8099';
const API_PATH = 'api';

@Injectable({ providedIn: 'root' })
export class ApiConfigService {
<<<<<<< HEAD
  getBaseUrl(): string {
    // FORCE HARDCODED IP FOR THE PRESENTATION TO AVOID CACHE ISSUES
    if (environment.apiBaseUrl) {
      return environment.apiBaseUrl;
    }

    const customApiBaseUrl = this.getCustomApiBaseUrl();
    if (customApiBaseUrl) {
      return customApiBaseUrl;
=======
  // On garde l'IP en mémoire vive (RAM) uniquement. 
  // Pas de localStorage pour ne jamais bloquer l'app sur un vieux Wi-Fi !
  private memoryUrl: string | null = null;

  getBaseUrl(): string {
    if (this.memoryUrl) {
      return this.memoryUrl;
    }

    if (environment.apiBaseUrl) {
      return environment.apiBaseUrl;
>>>>>>> d6b8d3bf8fe91554ef39feb5f2aba44b33093b1d
    }

    return Capacitor.isNativePlatform() ? '' : environment.apiUrl;
  }

  hasConfiguredBaseUrl(): boolean {
    return this.getBaseUrl().trim().length > 0;
  }

<<<<<<< HEAD
  getCustomApiBaseUrl(): string | null {
    try {
      return typeof localStorage !== 'undefined'
        ? localStorage.getItem(CUSTOM_API_URL_KEY)
        : null;
    } catch {
      return null;
    }
=======
  // Ajouté pour éviter l'erreur de compilation avec auth.interceptor.ts
  // On retourne null car on n'utilise plus le cache local
  getCustomApiBaseUrl(): string | null {
    return null;
>>>>>>> d6b8d3bf8fe91554ef39feb5f2aba44b33093b1d
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

<<<<<<< HEAD
    this.setCustomApiBaseUrl(normalizedUrl);
=======
    this.memoryUrl = normalizedUrl;
>>>>>>> d6b8d3bf8fe91554ef39feb5f2aba44b33093b1d
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
<<<<<<< HEAD

  private setCustomApiBaseUrl(baseUrl: string): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(CUSTOM_API_URL_KEY, baseUrl);
      }
    } catch {
      // Ignore storage errors to avoid breaking the mobile WebView.
    }
  }
=======
>>>>>>> d6b8d3bf8fe91554ef39feb5f2aba44b33093b1d
}
