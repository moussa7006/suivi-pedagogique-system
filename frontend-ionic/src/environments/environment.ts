const apiHost =
  typeof window !== 'undefined' ? window.location.hostname : 'localhost';

export const environment = {
  production: false,
  // HARDCODED IP
  apiBaseUrl: 'http://192.168.1.26:8099/api',
  apiUrl: 'http://192.168.1.26:8099/api',
};
