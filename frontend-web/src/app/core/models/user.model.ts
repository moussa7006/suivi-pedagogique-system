import { Role } from './enums';

export interface Utilisateur {
  id?: number;
  matricule: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  role: Role;
  actif: boolean;
  motDePasse?: string;
}

export interface Enseignant extends Utilisateur {
  specialite: string;
  dateEmbauche: string;
  grade: string;
}

export type { Utilisateur as Teacher };
