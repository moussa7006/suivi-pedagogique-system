const apiHost =
  typeof window !== 'undefined' ? window.location.hostname : 'localhost';

// En dev navigateur :
// - http://localhost:8100 utilise http://localhost:8099/api
// - http://IP_DU_PC:8100 utilise automatiquement http://IP_DU_PC:8099/api
// Cela évite l'erreur mobile où `localhost` pointe vers le téléphone au lieu du PC backend.
export const environment = {
  production: false,
  apiBaseUrl: `http://${apiHost || 'localhost'}:8099/api`,
};
