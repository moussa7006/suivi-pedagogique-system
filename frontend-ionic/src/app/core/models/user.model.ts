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
  photoUrl?: string;
  specialite?: string;
  dateEmbauche?: string;
  grade?: string;
  /** Matières déduites des emplois du temps affectés à l'enseignant. */
  matieres?: string[];
}

export interface Enseignant extends Utilisateur {
  specialite: string;
  dateEmbauche: string;
  grade: string;
}
