const apiHost =
  typeof window !== 'undefined' ? window.location.hostname : 'localhost';

export const environment = {
  production: false,
  // L'adresse API s'adapte automatiquement au nom d'hôte avec lequel
  // le frontend est accédé (localhost, IP du réseau local, etc.).
  apiBaseUrl: `http://${apiHost}:8099/api`,
  apiUrl: `http://${apiHost}:8099/api`,
};
