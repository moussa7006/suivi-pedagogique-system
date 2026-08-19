<<<<<<< HEAD
export const environment = {
  production: true,
  // Force l'IP de ton PC pour la soutenance (pour que le téléphone trouve le backend)
  apiBaseUrl: 'http://192.168.1.26:8099/api',
  apiUrl: 'http://192.168.1.26:8099/api',
=======
const apiHost =
  typeof window !== 'undefined' ? window.location.hostname : 'localhost';

export const environment = {
  production: true,
  // L'adresse API s'adapte automatiquement au nom d'hôte avec lequel
  // le frontend est accédé (localhost, IP du réseau local, etc.).
  apiBaseUrl: `http://${apiHost}:8099/api`,
  apiUrl: `http://${apiHost}:8099/api`,
>>>>>>> d6b8d3bf8fe91554ef39feb5f2aba44b33093b1d
};
