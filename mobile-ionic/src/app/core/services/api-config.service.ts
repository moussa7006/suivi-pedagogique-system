import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

const CUSTOM_API_URL_KEY = 'custom_api_url';
const DEFAULT_API_PORT = '8099';
const API_PATH = 'api';

@Injectable({ providedIn: 'root' })
export class ApiConfigService {
  getBaseUrl(): string {
    return this.getCustomApiBaseUrl() || environment.apiBaseUrl;
  }

  hasConfiguredBaseUrl(): boolean {
    return this.getBaseUrl().trim().length > 0;
  }

  getCustomApiBaseUrl(): string | null {
    try {
      return typeof localStorage !== 'undefined'
        ? localStorage.getItem(CUSTOM_API_URL_KEY)
        : null;
    } catch {
      return null;
    }
  }

  buildUrl(path: string): string {
    const baseUrl = this.getBaseUrl().replace(/\/+$/, '');
    const normalizedPath = path.replace(/^\/+/, '');

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

    this.setCustomApiBaseUrl(normalizedUrl);
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

  private setCustomApiBaseUrl(baseUrl: string): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(CUSTOM_API_URL_KEY, baseUrl);
      }
    } catch {
      // Ignore storage errors to avoid breaking the mobile WebView.
    }
  }
}
