const apiHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost';

export const environment = {
  production: false,
  apiUrl: `http://${apiHost}:8099/api`,
};
