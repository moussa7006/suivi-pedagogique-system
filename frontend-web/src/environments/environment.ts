// En développement, le frontend-web utilise un proxy (proxy.conf.json)
// qui forward les requêtes /api vers http://localhost:8099.
// Cela évite les problèmes CORS et fonctionne que l'on accède via
// localhost ou via une IP réseau (192.168.x.x).
// En production, un reverse proxy (nginx) doit faire le même forwarding.
const apiHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost';

export const environment = {
  production: false,
  // URL relative : le proxy ng serve intercepte /api -> http://localhost:8099
  apiUrl: '/api',
  // Conserve l'URL absolue pour debug ou usage hors proxy
  apiUrlDirect: `http://${apiHost}:8099/api`,
};