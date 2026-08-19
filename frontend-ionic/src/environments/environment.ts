const apiHost =
  typeof window !== 'undefined' ? window.location.hostname : 'localhost';

<<<<<<< HEAD
// En dev navigateur :
// - http://localhost:8100 utilise http://localhost:8099/api
// - http://IP_DU_PC:8100 utilise automatiquement http://IP_DU_PC:8099/api
// Cela évite l'erreur mobile où `localhost` pointe vers le téléphone au lieu du PC backend.
export const environment = {
  production: false,
  apiBaseUrl: `http://192.168.1.26:8099/api`,
  apiUrl: `http://192.168.1.26:8099/api`,
=======
export const environment = {
  production: false,
  // L'adresse API s'adapte automatiquement au nom d'hôte avec lequel
  // le frontend est accédé (localhost, IP du réseau local, etc.).
  apiBaseUrl: `http://${apiHost}:8099/api`,
  apiUrl: `http://${apiHost}:8099/api`,
>>>>>>> d6b8d3bf8fe91554ef39feb5f2aba44b33093b1d
};
