const apiHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const browserApiBaseUrl = `http://${apiHost || 'localhost'}:8099/api`;

export const environment = {
  production: true,
  // En APK sur téléphone physique, l'IP du backend doit être configurée
  // depuis l'écran de connexion pour éviter une ancienne IP codée en dur.
  apiBaseUrl: '',
  // L'interface web admin n'a pas l'écran de configuration mobile : elle utilise
  // l'hôte courant du navigateur comme le frontend-web original.
  apiUrl: browserApiBaseUrl,
};
