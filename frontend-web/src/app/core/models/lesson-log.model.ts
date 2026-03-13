export interface LessonLog {
  id: number;
  teacherName: string;
  subject: string;
  date: string;
  startTime: string;
  endTime: string;
  chapter: string;
  content: string;
  status: 'En attente' | 'Validé' | 'Rejeté';
  comments?: string;
}
