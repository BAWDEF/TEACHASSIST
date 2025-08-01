export interface Lesson {
  id?: string;
  title: string;
  subject: string;
  grade: string;
  dateCreated: string;
  objectives: string[];
  duration: string;
  hasAttachments: boolean;
}