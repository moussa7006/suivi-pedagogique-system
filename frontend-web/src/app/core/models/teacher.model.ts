export interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
  matricule: string;
  email: string;
  department: string;
  subjects: string[];
  status: 'Actif' | 'En congé' | 'Inactif';
  avatar?: string;
}
