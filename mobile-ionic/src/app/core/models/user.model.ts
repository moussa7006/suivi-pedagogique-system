import { Role } from "./enums";

export interface Utilisateur {
  id?: number;
  matricule: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  role: Role;
  actif?: boolean;
  photoUrl?: string;
}

export interface LoginRequest {
  email: string;
  motDePasse: string;
}

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

export interface ChangePasswordRequest {
  newPassword: string;
}
