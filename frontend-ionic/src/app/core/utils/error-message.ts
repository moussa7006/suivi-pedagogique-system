export function extractErrorMessage(error: any, fallback = 'Une erreur est survenue.'): string {
  if (error?.name === 'TimeoutError') {
    return 'Le serveur met trop de temps à répondre. Vérifiez que le backend est démarré puis réessayez.';
  }

  return error?.error?.error || error?.error?.message || error?.message || fallback;
}
