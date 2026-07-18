import { Role } from './enums';

/** Requête de connexion */
export interface LoginRequest {
  email: string;
  motDePasse: string;
}

/** Réponse après connexion réussie */
export interface LoginResponse {
  token: string;
  id: number;
  matricule: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  role: Role;
  forcePasswordChange: boolean;
  photoUrl?: string;
}

/** Requête de changement de mot de passe (premier login) */
export interface ChangePasswordRequest {
  newPassword: string;
}

/** Requête de mot de passe oublié */
export interface ForgotPasswordRequest {
  email: string;
}

/** Requête de réinitialisation de mot de passe */
export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}
