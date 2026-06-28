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
      .replace(new RegExp(`:${DEFAULT_API_PORT}/${API_PATH}/?$`), '')
      .replace(new RegExp(`/${API_PATH}/?$`), '');
  }

  setServerIp(ipAddress: string): void {
    const host = ipAddress
      .trim()
      .replace(/^https?:\/\//, '')
      .replace(/\/.*$/, '')
      .replace(/:\d+$/, '');

    if (!host) {
      return;
    }

    this.setCustomApiBaseUrl(`http://${host}:${DEFAULT_API_PORT}/${API_PATH}`);
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
