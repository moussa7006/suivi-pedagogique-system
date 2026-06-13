// En développement navigateur, localhost pointe vers la machine qui lance Ionic.
// Sur émulateur Android, utilisez plutôt http://10.0.2.2:8099/api.
// Sur téléphone réel, remplacez par l'IP locale du PC backend, ex: http://192.168.1.15:8099/api.
export const environment = {
  production: false,
  apiBaseUrl: "http://localhost:8099/api",
};
