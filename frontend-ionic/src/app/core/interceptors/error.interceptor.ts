import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Laisse les erreurs HTTP à la page qui a déclenché la requête.
 *
 * Une requête de données peut échouer temporairement au retour sur l'accueil.
 * Elle ne doit jamais effacer la session mobile. La validité de la session est
 * contrôlée explicitement par AuthService et le guard de navigation.
 */
export const errorInterceptor: HttpInterceptorFn = (_req, next) => next(_req);
