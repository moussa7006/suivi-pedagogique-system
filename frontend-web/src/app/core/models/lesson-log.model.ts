export interface PieceJointe {
  id: number;
  nom: string;
  type: string; // MIME type: 'application/pdf', 'image/png', etc.
  taille: number; // taille en octets
  url: string; // URL ou base64 pour téléchargement
}

export interface LessonLog {
  id: number;
  titleCours: string;
  contenu: string;
  dateDeCreation: string;
  pieceJointe: PieceJointe | null;
  // Champs complémentaires pour le contexte pédagogique
  teacherName: string;
  subject: string;
  status: 'En attente' | 'Validé' | 'Rejeté';
  comments?: string;
}
